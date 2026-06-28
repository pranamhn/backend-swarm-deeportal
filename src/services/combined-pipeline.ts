import { db, swarmProjects, swarmReports } from "../db/index.js";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import { enqueueSimulation } from "./simulation-queue.js";
import { createNotification } from "./notification-service.js";
import crypto from "crypto";

// ── Combined Mode Pipeline ──
// Auto-runs social sentiment simulation after investment prediction completes

interface CombinedPipelineConfig {
  investmentProjectId: string;
  userId: string;
  autoStartSocial: boolean;
  socialConfig?: {
    platforms: string[];
    seedTopics: string[];
    agentCount: number;
    loops: number;
    subType?: string;
  };
}

export async function runCombinedPipeline(config: CombinedPipelineConfig): Promise<{
  investmentJobId: string;
  socialProjectId?: string;
  socialJobId?: string;
}> {
  logger.info({ investmentProjectId: config.investmentProjectId }, "Starting combined pipeline");

  // Step 1: Start investment simulation
  const investmentJob = await enqueueSimulation(config.investmentProjectId, "balanced");

  if (!config.autoStartSocial) {
    return { investmentJobId: String(investmentJob.id) };
  }

  // Step 2: Wait for investment to complete, then extract topics for social
  const [project] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, config.investmentProjectId)).limit(1);
  if (!project) throw new Error("Project not found");

  // Extract seed topics from investment report
  let topics = config.socialConfig?.seedTopics || [];
  try {
    const [report] = await db.select().from(swarmReports)
      .where(eq(swarmReports.projectId, config.investmentProjectId))
      .limit(1);

    if (report?.keyFindings) {
      const findings = report.keyFindings as { title: string }[];
      topics = [...topics, ...findings.map(f => f.title).slice(0, 5)];
    }
    if (report?.risks) {
      const risks = report.risks as { type: string }[];
      topics = [...topics, ...risks.map(r => r.type).slice(0, 3)];
    }
  } catch {
    // Use defaults
    topics = topics.length ? topics : ["investment", "market", "funding"];
  }

  // Step 3: Create social sentiment project automatically
  const socialProjectId = crypto.randomUUID();
  await db.insert(swarmProjects).values({
    id: socialProjectId,
    userId: config.userId,
    title: `Social Sentiment: ${project.title}`,
    mode: "social_sentiment" as const,
    subType: "general",
    platforms: config.socialConfig?.platforms || ["twitter", "reddit"],
    seedTopics: topics,
    agentCount: config.socialConfig?.agentCount || 100,
    loops: config.socialConfig?.loops || 10,
    status: "draft" as const,
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Step 4: Enqueue social simulation
  const socialJob = await enqueueSimulation(socialProjectId, "balanced");

  await createNotification(config.userId, "combined_pipeline_started", {
    investmentProjectId: config.investmentProjectId,
    socialProjectId,
    topics,
  });

  logger.info({ investmentProjectId: config.investmentProjectId, socialProjectId }, "Combined pipeline enqueued");

  return {
    investmentJobId: String(investmentJob.id),
    socialProjectId,
    socialJobId: String(socialJob.id),
  };
}

// ── Auto-combine: called after investment simulation completes ──
export async function autoCombineAfterInvestment(projectId: string): Promise<void> {
  try {
    const [project] = await db.select().from(swarmProjects).where(eq(swarmProjects.id, projectId)).limit(1);
    if (!project || project.mode !== "investment_prediction") return;

    // Check if auto-combine is enabled for this user
    const autoCombine = process.env.SWARM_AUTO_COMBINE === "true";
    if (!autoCombine) return;

    await runCombinedPipeline({
      investmentProjectId: projectId,
      userId: project.userId,
      autoStartSocial: true,
      socialConfig: {
        platforms: ["twitter", "reddit"],
        seedTopics: [],
        agentCount: 100,
        loops: 10,
        subType: "general",
      },
    });

    logger.info({ projectId }, "Auto-combined pipeline started");
  } catch (err) {
    logger.error({ err, projectId }, "Auto-combine failed");
  }
}
