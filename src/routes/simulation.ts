import { Router, type Request, type Response } from "express";
import { db, swarmProjects, simulationRuns, simulationSnapshots } from "../db/index.js";
import { eq, desc } from "drizzle-orm";
import { simulationRunSchema } from "../lib/validation.js";
import { AppError, successResponse, notFound } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { enqueueSimulation } from "../services/simulation-queue.js";
import { v4 as uuid } from "uuid";

const router = Router();

// ── Start Simulation (enqueue to BullMQ) ──
router.post("/:projectId/start", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const parsed = simulationRunSchema.safeParse({ ...req.body, projectId });
    if (!parsed.success) throw new AppError("VALIDATION_ERROR", "Invalid simulation config", { issues: parsed.error.issues });

    const [project] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, projectId)).limit(1);
    if (!project) throw notFound("Project", projectId);

    const scenarios = parsed.data.scenarios?.length
      ? parsed.data.scenarios
      : (project.scenarios || project.mode === "social_sentiment" ? ["baseline"] : ["optimistic", "neutral", "pessimistic"]);

    const runs = scenarios.map((scenario) => ({
      id: uuid(),
      projectId,
      mode: project.mode,
      scenarioName: scenario,
      status: "pending" as const,
      currentLoop: 0,
      totalLoops: project.loops,
    }));

    await db.insert(simulationRuns).values(runs);
    await db.update(swarmProjects).set({ status: "simulating", progress: 0, updatedAt: new Date() }).where(eq(swarmProjects.id, projectId));

    // Enqueue to BullMQ
    const job = await enqueueSimulation(projectId, project.simulationMode || "balanced");

    logger.info({ projectId, mode: project.mode, jobId: job.id, scenarios }, "Simulation enqueued");

    res.json(successResponse({
      projectId,
      jobId: job.id,
      runs,
      status: "queued",
      estimatedDuration: project.simulationMode === "fast" ? "~1 min" : project.simulationMode === "deep" ? "~10 min" : "~3 min",
    }));
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    logger.error({ err }, "Failed to start simulation");
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to start simulation", retryable: true } });
  }
});

// ── Get Simulation Status ──
router.get("/:projectId/status", async (req: Request, res: Response) => {
  try {
    const runs = await db.select().from(simulationRuns)
      .where(eq(simulationRuns.projectId, req.params.projectId))
      .orderBy(desc(simulationRuns.createdAt));

    const [project] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, req.params.projectId)).limit(1);

    res.json(successResponse({
      projectId: req.params.projectId,
      status: project?.status || "unknown",
      progress: project?.progress || 0,
      currentStep: project?.currentStep,
      runs,
    }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── Stop Simulation ──
router.post("/:projectId/stop", async (req: Request, res: Response) => {
  try {
    await db.update(swarmProjects).set({ status: "cancelled", updatedAt: new Date() }).where(eq(swarmProjects.id, req.params.projectId));
    await db.update(simulationRuns).set({ status: "stopped" }).where(eq(simulationRuns.projectId, req.params.projectId));
    res.json(successResponse({ stopped: true }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── SSE Stream (Real-time Progress) ──
router.get("/:projectId/stream", async (req: Request, res: Response) => {
  const { projectId } = req.params;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial state
  const [project] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, projectId)).limit(1);
  if (project) {
    sendEvent("status", { status: project.status, progress: project.progress, currentStep: project.currentStep });
  }

  // Poll for updates every 1 second (in production: use Redis pub/sub)
  const interval = setInterval(async () => {
    try {
      const [updated] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, projectId)).limit(1);

      if (updated) {
        sendEvent("progress", {
          status: updated.status,
          progress: updated.progress,
          currentStep: updated.currentStep,
          error: updated.error,
          timestamp: new Date().toISOString(),
        });

        if (updated.status === "completed" || updated.status === "failed" || updated.status === "cancelled") {
          sendEvent("done", { status: updated.status });
          clearInterval(interval);
          res.end();
        }
      }
    } catch {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

// ── Get Snapshots ──
router.get("/:simulationRunId/snapshots", async (req: Request, res: Response) => {
  try {
    const snapshots = await db.select().from(simulationSnapshots)
      .where(eq(simulationSnapshots.simulationRunId, req.params.simulationRunId))
      .orderBy(desc(simulationSnapshots.loop));
    res.json(successResponse(snapshots));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
