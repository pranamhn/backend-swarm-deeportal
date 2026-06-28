import type { SwarmProject, GraphNode, GraphEdge } from "../types/swarm.js";
import { db, graphNodes, graphEdges, swarmProjects } from "../db/index.js";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

// ── Multi-Market Parallel Execution ──

export interface MarketConfig {
  name: string;
  conditions: Record<string, string>;
  agentCount: number;
  loops: number;
}

export const DEFAULT_MARKETS: Record<string, MarketConfig> = {
  SEA: {
    name: "SEA Market",
    conditions: { investor_sentiment: "selective", avg_check_size: "$500K-2M", sector_maturity: "early", regulatory_complexity: "medium" },
    agentCount: 8,
    loops: 8,
  },
  US: {
    name: "US Market",
    conditions: { investor_sentiment: "competitive", avg_check_size: "$2M-5M", sector_maturity: "maturing", regulatory_complexity: "high" },
    agentCount: 10,
    loops: 10,
  },
  EU: {
    name: "EU Market",
    conditions: { investor_sentiment: "cautious", avg_check_size: "$1M-3M", sector_maturity: "mid", regulatory_complexity: "high (GDPR, AI Act)" },
    agentCount: 8,
    loops: 8,
  },
  CN: {
    name: "China Market",
    conditions: { investor_sentiment: "government-driven", avg_check_size: "$3M-10M", sector_maturity: "maturing", regulatory_complexity: "very high" },
    agentCount: 10,
    loops: 10,
  },
  IN: {
    name: "India Market",
    conditions: { investor_sentiment: "growing", avg_check_size: "$1M-5M", sector_maturity: "early", regulatory_complexity: "medium-high" },
    agentCount: 8,
    loops: 8,
  },
};

export async function runMultiMarketSimulation(
  project: SwarmProject,
  markets: string[],
  baseGraph: { nodes: GraphNode[]; edges: GraphEdge[] },
): Promise<Record<string, { score: number; confidence: number; insights: string[] }>> {
  const results: Record<string, { score: number; confidence: number; insights: string[] }> = {};

  for (const marketCode of markets) {
    const marketConfig = DEFAULT_MARKETS[marketCode] || DEFAULT_MARKETS.SEA;
    logger.info({ projectId: project.id, market: marketCode }, "Running market simulation");

    // Clone graph with market-specific adjustments
    const marketNodes = baseGraph.nodes.map(n => ({
      ...n,
      id: uuid(),
      metadata: { ...n.metadata, market: marketCode, conditions: marketConfig.conditions },
    }));

    const score = calculateMarketAdjustedScore(project, marketConfig);
    const confidence = 60 + Math.floor(Math.random() * 25);

    results[marketCode] = {
      score,
      confidence,
      insights: generateMarketInsights(marketCode, marketConfig, score),
    };
  }

  return results;
}

function calculateMarketAdjustedScore(project: SwarmProject, market: MarketConfig): number {
  const base = 50 + Math.floor(Math.random() * 30);

  // Adjust for market conditions
  let multiplier = 1.0;
  if (market.conditions.investor_sentiment === "competitive") multiplier += 0.1;
  if (market.conditions.investor_sentiment === "cautious") multiplier -= 0.1;
  if (market.conditions.regulatory_complexity?.includes("high")) multiplier -= 0.15;
  if (market.conditions.sector_maturity === "maturing") multiplier += 0.05;

  return Math.round(Math.min(100, Math.max(10, base * multiplier)));
}

function generateMarketInsights(marketCode: string, market: MarketConfig, score: number): string[] {
  const insights: string[] = [];
  if (score >= 70) insights.push(`${market.name}: Strong opportunity — favorable conditions`);
  else if (score >= 50) insights.push(`${market.name}: Moderate opportunity — some headwinds`);
  else insights.push(`${market.name}: Challenging — significant barriers`);

  if (market.conditions.regulatory_complexity?.includes("high")) {
    insights.push("⚠️ High regulatory complexity — factor in compliance costs");
  }
  if (market.conditions.investor_sentiment === "competitive") {
    insights.push("💡 Competitive investor landscape — differentiation is key");
  }

  return insights;
}

// ── External Signal Injection ──

export interface ExternalSignal {
  type: "competitor_funding" | "regulatory_change" | "key_hire" | "market_crash" | "product_launch" | "partnership" | "scandal" | "macro_event";
  source: string;
  description: string;
  impactMagnitude: number; // -10 to +10
  affectedNodes: string[];
  timestamp: Date;
}

export async function injectSignal(
  projectId: string,
  signal: ExternalSignal,
): Promise<{ beforeScore: number; afterScore: number; impact: number; affectedNodes: GraphNode[] }> {
  logger.info({ projectId, signalType: signal.type }, "Injecting external signal");

  // Get current graph
  const nodes = await db.select().from(graphNodes).where(eq(graphNodes.projectId, projectId));
  const beforeScore = 60; // Would come from latest snapshot in production

  // Create signal node
  const signalNode: typeof graphNodes.$inferInsert = {
    id: uuid(),
    projectId,
    nodeType: "Signal",
    name: `${signal.type}: ${signal.description.slice(0, 50)}`,
    description: signal.description,
    metadata: { signalType: signal.type, source: signal.source, impactMagnitude: signal.impactMagnitude },
    confidence: 0.8,
    createdAt: new Date(),
  };

  await db.insert(graphNodes).values(signalNode);

  // Update existing nodes that are affected
  const affectedNodesList: GraphNode[] = [];
  for (const node of nodes) {
    if (signal.affectedNodes.some(n => node.name?.toLowerCase().includes(n.toLowerCase()))) {
      affectedNodesList.push(node as unknown as GraphNode);
    }
  }

  const afterScore = Math.round(beforeScore + signal.impactMagnitude);

  // Update project with signal metadata
  await db.update(swarmProjects)
    .set({ updatedAt: new Date() } as Partial<typeof swarmProjects.$inferInsert>)
    .where(eq(swarmProjects.id, projectId));

  return {
    beforeScore,
    afterScore,
    impact: signal.impactMagnitude,
    affectedNodes: affectedNodesList,
  };
}

export function generateMockSignal(type: ExternalSignal["type"], projectId: string): ExternalSignal {
  const signals: Record<string, ExternalSignal> = {
    competitor_funding: {
      type: "competitor_funding", source: "News API", description: "Competitor X raised $20M Series A at $100M valuation",
      impactMagnitude: -4, affectedNodes: ["competition", "investor_attention", "market_position"], timestamp: new Date(),
    },
    regulatory_change: {
      type: "regulatory_change", source: "Government Gazette", description: "New data privacy regulation announced, effective in 6 months",
      impactMagnitude: -6, affectedNodes: ["compliance", "regulatory_risk", "operational_cost"], timestamp: new Date(),
    },
    key_hire: {
      type: "key_hire", source: "LinkedIn", description: "Ex-Google VP joins as CTO",
      impactMagnitude: +5, affectedNodes: ["team_quality", "investor_confidence", "product_velocity"], timestamp: new Date(),
    },
    market_crash: {
      type: "market_crash", source: "Bloomberg", description: "SEA tech index down 15% — broad market selloff",
      impactMagnitude: -8, affectedNodes: ["investor_sentiment", "valuation", "funding_probability"], timestamp: new Date(),
    },
    product_launch: {
      type: "product_launch", source: "Press Release", description: "Major product launch with partnership announcements",
      impactMagnitude: +7, affectedNodes: ["revenue", "market_position", "customer_acquisition"], timestamp: new Date(),
    },
    partnership: {
      type: "partnership", source: "Joint Press Release", description: "Strategic partnership with Fortune 500 company",
      impactMagnitude: +6, affectedNodes: ["credibility", "distribution", "revenue_potential"], timestamp: new Date(),
    },
    scandal: {
      type: "scandal", source: "Investigative Report", description: "Founder accused of financial misconduct",
      impactMagnitude: -9, affectedNodes: ["reputation", "investor_confidence", "team_morale"], timestamp: new Date(),
    },
    macro_event: {
      type: "macro_event", source: "Central Bank", description: "Interest rate hike of 50bps — tightening monetary policy",
      impactMagnitude: -5, affectedNodes: ["cost_of_capital", "valuation", "investor_sentiment"], timestamp: new Date(),
    },
  };

  return signals[type] || signals.competitor_funding;
}
