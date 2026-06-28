import { logger } from "../lib/logger.js";

// ── Cost Tracking Service ──

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
  cost: number; // USD
}

interface ProjectCost {
  projectId: string;
  mode: string;
  userId: string;
  calls: TokenUsage[];
  totalTokens: number;
  totalCost: number;
}

// Approximate pricing per 1M tokens (USD)
const PRICING: Record<string, { prompt: number; completion: number }> = {
  "deepseek-chat": { prompt: 0.14, completion: 0.28 },
  "deepseek-reasoner": { prompt: 0.55, completion: 2.19 },
  "gpt-4o": { prompt: 2.50, completion: 10.00 },
  "gpt-4o-mini": { prompt: 0.15, completion: 0.60 },
};

// In-memory store (production: persist to DB)
const projectCosts = new Map<string, ProjectCost>();

export function trackTokenUsage(
  projectId: string,
  mode: string,
  userId: string,
  model: string,
  promptTokens: number,
  completionTokens: number,
): void {
  const pricing = PRICING[model] || PRICING["deepseek-chat"];
  const cost =
    (promptTokens / 1_000_000) * pricing.prompt +
    (completionTokens / 1_000_000) * pricing.completion;

  const entry: TokenUsage = {
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    model,
    cost: Math.round(cost * 10000) / 10000,
  };

  const existing = projectCosts.get(projectId);
  if (existing) {
    existing.calls.push(entry);
    existing.totalTokens += entry.totalTokens;
    existing.totalCost += entry.cost;
  } else {
    projectCosts.set(projectId, {
      projectId,
      mode,
      userId,
      calls: [entry],
      totalTokens: entry.totalTokens,
      totalCost: entry.cost,
    });
  }

  logger.debug({ projectId, model, tokens: entry.totalTokens, cost: entry.cost }, "Token usage tracked");
}

export function getProjectCost(projectId: string): ProjectCost | undefined {
  return projectCosts.get(projectId);
}

export function getUserCosts(userId: string): { projects: ProjectCost[]; totalCost: number; totalTokens: number } {
  const projects: ProjectCost[] = [];
  let totalCost = 0;
  let totalTokens = 0;

  for (const cost of projectCosts.values()) {
    if (cost.userId === userId) {
      projects.push(cost);
      totalCost += cost.totalCost;
      totalTokens += cost.totalTokens;
    }
  }

  return { projects, totalCost: Math.round(totalCost * 100) / 100, totalTokens };
}

export function getGlobalStats(): {
  totalProjects: number;
  totalTokens: number;
  totalCost: number;
  avgCostPerProject: number;
  byMode: Record<string, { count: number; totalCost: number }>;
} {
  const projects = Array.from(projectCosts.values());
  const totalCost = projects.reduce((s, p) => s + p.totalCost, 0);
  const totalTokens = projects.reduce((s, p) => s + p.totalTokens, 0);

  const byMode: Record<string, { count: number; totalCost: number }> = {};
  for (const p of projects) {
    if (!byMode[p.mode]) byMode[p.mode] = { count: 0, totalCost: 0 };
    byMode[p.mode].count++;
    byMode[p.mode].totalCost += p.totalCost;
  }

  return {
    totalProjects: projects.length,
    totalTokens,
    totalCost: Math.round(totalCost * 100) / 100,
    avgCostPerProject: projects.length ? Math.round((totalCost / projects.length) * 100) / 100 : 0,
    byMode,
  };
}

// ── Estimate cost before running ──
export function estimateSimulationCost(
  mode: string,
  agentCount: number,
  loops: number,
  model = "deepseek-chat",
): { estimatedTokens: number; estimatedCost: number; breakdown: string } {
  const avgTokensPerAgentDecision = mode === "social_sentiment" ? 200 : 500;
  const decisions = agentCount * loops;
  const extractionTokens = 2000;
  const reportTokens = 3000;
  const totalTokens = decisions * avgTokensPerAgentDecision + extractionTokens + reportTokens;

  const pricing = PRICING[model] || PRICING["deepseek-chat"];
  const cost = Math.round((totalTokens / 1_000_000) * ((pricing.prompt + pricing.completion) / 2) * 10000) / 10000;

  return {
    estimatedTokens: totalTokens,
    estimatedCost: cost,
    breakdown: `${agentCount} agents × ${loops} loops × ~${avgTokensPerAgentDecision} tokens + extraction + report`,
  };
}
