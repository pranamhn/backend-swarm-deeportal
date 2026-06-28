import { Router, type Request, type Response } from "express";
import { db, simulationSnapshots, simulationRuns, swarmAgents } from "../db/index.js";
import { eq, and, asc } from "drizzle-orm";
import { successResponse } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

const router = Router();

// ── Get simulation replay data (all loops for a run) ──
router.get("/replay/:simulationRunId", async (req: Request, res: Response) => {
  try {
    const snapshots = await db.select()
      .from(simulationSnapshots)
      .where(eq(simulationSnapshots.simulationRunId, req.params.simulationRunId))
      .orderBy(asc(simulationSnapshots.loop));

    const replayData = snapshots.map(s => ({
      loop: s.loop,
      state: s.state,
      agentDecisions: s.agentDecisions,
      metrics: s.metrics,
    }));

    // Get the run info
    const [run] = await db.select().from(simulationRuns)
      .where(eq(simulationRuns.id, req.params.simulationRunId))
      .limit(1);

    res.json(successResponse({
      simulationRunId: req.params.simulationRunId,
      totalLoops: run?.totalLoops || snapshots.length,
      snapshots: replayData,
      status: run?.status,
      startedAt: run?.startedAt,
      finishedAt: run?.finishedAt,
    }));
  } catch (err) {
    logger.error({ err }, "Failed to get replay data");
    res.status(500).json({ success: false });
  }
});

// ── Get simulation replay for a project (all runs) ──
router.get("/replay/project/:projectId", async (req: Request, res: Response) => {
  try {
    const runs = await db.select().from(simulationRuns)
      .where(eq(simulationRuns.projectId, req.params.projectId))
      .orderBy(asc(simulationRuns.createdAt));

    const replayByRun = await Promise.all(
      runs.map(async (run) => {
        const snapshots = await db.select()
          .from(simulationSnapshots)
          .where(eq(simulationSnapshots.simulationRunId, run.id))
          .orderBy(asc(simulationSnapshots.loop));

        return {
          simulationRunId: run.id,
          scenarioName: run.scenarioName,
          totalLoops: run.totalLoops,
          status: run.status,
          snapshots: snapshots.map(s => ({
            loop: s.loop,
            metrics: s.metrics,
            agentCount: Array.isArray(s.agentDecisions) ? s.agentDecisions.length : 0,
          })),
        };
      })
    );

    res.json(successResponse({ projectId: req.params.projectId, runs: replayByRun }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── Get agent decisions timeline ──
router.get("/replay/project/:projectId/agents", async (req: Request, res: Response) => {
  try {
    const runs = await db.select({ id: simulationRuns.id })
      .from(simulationRuns)
      .where(eq(simulationRuns.projectId, req.params.projectId));

    const runIds = runs.map(r => r.id);
    if (!runIds.length) return res.json(successResponse({ agents: [] }));

    const allSnapshots = await Promise.all(
      runIds.map(id =>
        db.select().from(simulationSnapshots)
          .where(eq(simulationSnapshots.simulationRunId, id))
          .orderBy(asc(simulationSnapshots.loop))
      )
    );

    // Aggregate agent decisions across all runs
    const agentTimeline: Record<string, { role: string; decisions: { loop: number; decision: string; scoreImpact: number }[] }> = {};

    for (const snapshots of allSnapshots) {
      for (const snapshot of snapshots) {
        const decisions = snapshot.agentDecisions as Record<string, unknown>[] || [];
        for (const d of decisions) {
          const agentId = d.agentId as string;
          if (!agentTimeline[agentId]) {
            agentTimeline[agentId] = { role: (d.role as string) || "unknown", decisions: [] };
          }
          agentTimeline[agentId].decisions.push({
            loop: snapshot.loop,
            decision: (d.decision as string) || "",
            scoreImpact: (d.scoreImpact as number) || 0,
          });
        }
      }
    }

    res.json(successResponse({ projectId: req.params.projectId, agents: agentTimeline }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
