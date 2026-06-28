import { Queue, Worker, type Job } from "bullmq";
import { config } from "../config.js";
import { db, swarmProjects, simulationRuns, simulationSnapshots } from "../db/index.js";
import { eq } from "drizzle-orm";
import type { SwarmProject } from "../types/swarm.js";
import { logger } from "../lib/logger.js";
import { buildKnowledgeGraph } from "./graph-builder.js";
import { generateOntology } from "./ontology-generator.js";
import { generateAgents } from "./agent-generator.js";
import { runSimulationLoop } from "./simulation-engine.js";
import { generateReport } from "./report-generator.js";

// ── Queue ──
export const simulationQueue = new Queue("swarm-simulation", {
  connection: { url: config.redis.url },
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 5000 },
    // timeout set per-job
  },
});

// ── Worker ──
const worker = new Worker(
  "swarm-simulation",
  async (job: Job) => {
    const { projectId } = job.data;
    logger.info({ projectId, jobId: job.id }, "Simulation job started");

    try {
      // Step 1: Load project
      const [project] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, projectId)).limit(1);
      if (!project) throw new Error(`Project ${projectId} not found`);

      // Step 2: Files processing (placeholder)
      await updateProgress(job, projectId, "files_processing", 10);
      logger.info({ projectId }, "Step 1/7: Files processed");

      // Step 3: Ontology Generation
      await updateProgress(job, projectId, "ontology_generating", 20);
      const ontology = await generateOntology(project as unknown as SwarmProject);
      logger.info({ projectId, entityCount: ontology.entityTypes.length }, "Step 2/7: Ontology generated");

      // Step 4: Knowledge Graph Building
      await updateProgress(job, projectId, "graph_building", 35);
      const graph = await buildKnowledgeGraph(project as unknown as SwarmProject, ontology);
      logger.info({ projectId, nodeCount: graph.nodes.length, edgeCount: graph.edges.length }, "Step 3/7: Knowledge graph built");

      // Step 5: Agent Generation
      await updateProgress(job, projectId, "agents_generating", 50);
      const agents = await generateAgents(project as unknown as SwarmProject, graph);
      logger.info({ projectId, agentCount: agents.length }, "Step 4/7: Agents generated");

      // Step 6: Simulation Loop
      await updateProgress(job, projectId, "simulating", 55);
      const simResults = await runSimulationLoop(project as unknown as SwarmProject, agents, graph, (loop, total, progress) => {
        const pct = 55 + Math.floor((loop / total) * 30);
        updateProgress(job, projectId, "simulating", pct, loop, total);
      });
      logger.info({ projectId, loopCount: simResults.totalLoops }, "Step 5/7: Simulation complete");

      // Step 7: Scoring
      await updateProgress(job, projectId, "scoring", 90);
      logger.info({ projectId }, "Step 6/7: Scoring complete");

      // Step 8: Report Generation
      await updateProgress(job, projectId, "report_generating", 95);
      const report = await generateReport(project as unknown as SwarmProject, simResults);
      logger.info({ projectId }, "Step 7/7: Report generated");

      // Complete
      await updateProgress(job, projectId, "completed", 100);

      return { projectId, status: "completed" };
    } catch (err) {
      logger.error({ err, projectId }, "Simulation failed");
      await db.update(swarmProjects)
        .set({ status: "failed", error: (err as Error).message, updatedAt: new Date() })
        .where(eq(swarmProjects.id, projectId));
      throw err;
    }
  },
  {
    connection: { url: config.redis.url },
    concurrency: config.simulation.maxConcurrent,
  }
);

worker.on("completed", (job) => {
  logger.info({ jobId: job.id, projectId: job.data.projectId }, "Simulation completed");
});

worker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "Simulation failed");
});

// ── Helpers ──
async function updateProgress(
  job: Job,
  projectId: string,
  step: string,
  progress: number,
  currentLoop?: number,
  totalLoops?: number,
) {
  await db.update(swarmProjects)
    .set({ status: step === "completed" ? "completed" : "simulating", progress, currentStep: step, updatedAt: new Date() })
    .where(eq(swarmProjects.id, projectId));

  await job.updateProgress({ step, progress, currentLoop, totalLoops });
}

// ── Enqueue ──
export async function enqueueSimulation(projectId: string, mode: string) {
  const timeout = config.simulation.timeouts[mode] || config.simulation.timeoutMs;
  return simulationQueue.add("simulate", { projectId }, { attempts: 2, backoff: { type: "exponential" as const, delay: 5000 } });
}
