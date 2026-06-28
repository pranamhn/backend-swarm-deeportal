import { spawn } from "child_process";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { logger } from "../lib/logger.js";
import type { AgentProfile } from "../types/swarm.js";

const IPC_DIR = path.resolve(process.cwd(), "ipc");
const COMMANDS_DIR = path.join(IPC_DIR, "commands");
const RESPONSES_DIR = path.join(IPC_DIR, "responses");

// ── Launch Social Simulation (Mode A) ──
export async function launchSocialSimulation(
  projectId: string,
  config: {
    platforms: string[];
    agents: AgentProfile[];
    seedTopics: string[];
    agentCount: number;
    loops: number;
    subType?: string;
    candidates?: { name: string; party: string; twitterHandle?: string }[];
    electionType?: string;
    region?: string;
  }
): Promise<{ twitter?: Record<string, unknown>; reddit?: Record<string, unknown>; crossPlatform: Record<string, unknown> }> {
  logger.info({ projectId, platforms: config.platforms }, "Launching social simulation");

  // Write command files for each platform
  const commandPayload = {
    project_id: projectId,
    agents: config.agents.map(a => ({
      id: a.id,
      role: a.role,
      bio: a.persona.bio,
      persona: a.persona.persona,
      followerCount: a.persona.followerCount,
      friendCount: a.persona.friendCount,
      karma: a.persona.karma,
      subreddits: a.persona.subreddits,
      postingStyle: a.persona.postingStyle,
      interestedTopics: a.persona.interestedTopics || config.seedTopics,
      riskTolerance: a.persona.riskTolerance,
      goal: a.persona.goal,
    })),
    seed_topics: config.seedTopics,
    agent_count: config.agentCount,
    loops: config.loops,
    sub_type: config.subType,
    candidates: config.candidates,
    election_type: config.electionType,
    region: config.region,
  };

  for (const platform of config.platforms) {
    const cmdPath = path.join(COMMANDS_DIR, `${platform}_${projectId}.json`);
    await writeFile(cmdPath, JSON.stringify(commandPayload, null, 2));
    logger.info({ platform, cmdPath }, "Command file written");
  }

  // Write parallel config
  await writeFile(
    path.join(COMMANDS_DIR, `parallel_${projectId}.json`),
    JSON.stringify({ ...commandPayload, platforms: config.platforms }, null, 2)
  );

  // Launch parallel runner
  const runner = spawn("python3", ["scripts/run_parallel_simulation.py", projectId], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    runner.stdout?.on("data", (data: Buffer) => { stdout += data.toString(); });
    runner.stderr?.on("data", (data: Buffer) => { stderr += data.toString(); });

    runner.on("close", async (code: number) => {
      logger.info({ projectId, exitCode: code }, "Social simulation subprocess exited");

      if (code !== 0) {
        logger.error({ stderr }, "Social simulation failed");
        reject(new Error(`Social simulation exited with code ${code}: ${stderr}`));
        return;
      }

      // Read merged results
      try {
        const resultPath = path.join(RESPONSES_DIR, `parallel_${projectId}.json`);
        const raw = await readFile(resultPath, "utf-8");
        const result = JSON.parse(raw);

        const twitterResult = result.platforms?.twitter;
        const redditResult = result.platforms?.reddit;

        resolve({
          twitter: twitterResult,
          reddit: redditResult,
          crossPlatform: {
            sentiment: result.cross_platform_sentiment,
            twitterSentiment: twitterResult?.sentiment_score,
            redditSentiment: redditResult?.sentiment_score,
            completedAt: result.completed_at,
          },
        });
      } catch (err) {
        logger.error({ err }, "Failed to read simulation results");
        reject(err);
      }
    });

    runner.on("error", (err: Error) => {
      logger.error({ err }, "Failed to launch simulation subprocess");
      reject(err);
    });
  });
}

// ── Send command to running simulation ──
export async function sendSimulationCommand(projectId: string, platform: string, command: Record<string, unknown>): Promise<void> {
  const cmdPath = path.join(COMMANDS_DIR, `${platform}_${projectId}_cmd.json`);
  await writeFile(cmdPath, JSON.stringify({ ...command, timestamp: new Date().toISOString() }, null, 2));
}

// ── Read simulation response ──
export async function readSimulationResponse(projectId: string, platform: string): Promise<Record<string, unknown> | null> {
  try {
    const respPath = path.join(RESPONSES_DIR, `${platform}_${projectId}.json`);
    const raw = await readFile(respPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
