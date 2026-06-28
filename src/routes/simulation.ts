import { Router, type Request, type Response } from "express";
import { db, swarmProjects, simulationRuns, simulationSnapshots } from "../db/index.js";
import { eq, desc } from "drizzle-orm";
import { simulationRunSchema } from "../lib/validation.js";
import { AppError, successResponse, notFound } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

const router = Router();

// ── Start Simulation ──
router.post("/:projectId/start", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const parsed = simulationRunSchema.safeParse({ ...req.body, projectId });
    if (!parsed.success) throw new AppError("VALIDATION_ERROR", "Invalid simulation config", { issues: parsed.error.issues });

    const [project] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, projectId)).limit(1);
    if (!project) throw notFound("Project", projectId);

    const scenarios = project.scenarios || ["optimistic", "neutral", "pessimistic"];
    const runs = scenarios.map((scenario) => ({
      id: uuid(),
      projectId,
      mode: project.mode,
      scenarioName: scenario as string,
      status: "pending" as const,
      currentLoop: 0,
      totalLoops: project.loops,
    }));

    await db.insert(simulationRuns).values(runs);
    await db.update(swarmProjects).set({ status: "simulating", progress: 0, updatedAt: new Date() }).where(eq(swarmProjects.id, projectId));

    logger.info({ projectId, mode: project.mode, scenarios }, "Simulation started");

    // In production: push to BullMQ. For now, acknowledge start.
    res.json(successResponse({ projectId, runs, status: "running" }));
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    logger.error({ err }, "Failed to start simulation");
    res.status(500).json({ success: false });
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

// ── Get Snapshot ──
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
