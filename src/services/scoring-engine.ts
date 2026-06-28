import type { SwarmProject, SwarmScore, SubScore, CausalChainNode, InfluencerRanking } from "../types/swarm.js";
import { logger } from "../lib/logger.js";

// ── Investment Scoring ──
export function calculateInvestmentScore(
  project: SwarmProject,
  metrics: Record<string, number>,
  agentConsensus: number,
): Pick<SwarmScore, "predictionScore" | "subScores" | "causalChain"> {
  const weights = getWeights(project.predictionType || "funding");
  const subScores: SubScore[] = [];
  let totalScore = 0;

  for (const [name, weight] of Object.entries(weights)) {
    const raw = metrics[name] || 50;
    const score = Math.min(100, Math.max(0, raw));
    const contribution = score * weight;
    subScores.push({ name, score, weight, contribution, missingData: !metrics[name] });
    totalScore += contribution;
  }

  // Adversarial penalty (if agent consensus is low)
  const adversarialPenalty = agentConsensus < 0.5 ? Math.round((0.5 - agentConsensus) * 20) : 0;
  const finalScore = Math.round(Math.max(0, totalScore - adversarialPenalty));

  const causalChain: CausalChainNode[] = subScores.map(s => ({
    node: s.name,
    nodeType: "Metric",
    subScore: s.score,
    weight: s.weight,
    contribution: s.contribution,
    evidence: [{ source: "simulation_agent_consensus", agentsAgreeing: Math.round(agentConsensus * 10), total: 10 }],
    missingData: s.missingData,
    warning: s.missingData ? "Data point inferred, not directly extracted" : undefined,
  }));

  logger.info({ predictionType: project.predictionType, finalScore, adversarialPenalty }, "Investment score calculated");

  return { predictionScore: finalScore, subScores, causalChain };
}

// ── Social Sentiment Scoring ──
export function calculateSentimentScore(
  twitterSentiment: number,
  redditSentiment: number,
  twitterVolume: number,
  redditVolume: number,
  agentActions: { agentId: string; actionType: string; sentimentScore: number }[],
): Pick<SwarmScore, "sentimentScore" | "viralityProbability" | "influencerRankings"> {
  const totalVolume = twitterVolume + redditVolume || 1;
  const weightedSentiment = Math.round(
    (twitterSentiment * (twitterVolume / totalVolume)) +
    (redditSentiment * (redditVolume / totalVolume))
  );

  const viralityProbability = Math.round(
    (totalVolume > 100 ? 0.7 : totalVolume > 50 ? 0.5 : 0.3) * 100
  ) / 100;

  // Simple influencer ranking
  const influencerScores: Record<string, { totalImpact: number; count: number }> = {};
  for (const action of agentActions) {
    if (!influencerScores[action.agentId]) {
      influencerScores[action.agentId] = { totalImpact: 0, count: 0 };
    }
    influencerScores[action.agentId].totalImpact += Math.abs(action.sentimentScore);
    influencerScores[action.agentId].count += 1;
  }

  const influencerRankings: InfluencerRanking[] = Object.entries(influencerScores)
    .map(([agentId, data]) => ({
      agentId,
      role: "twitter_user",
      impactScore: Math.round(data.totalImpact / data.count * 100),
      narrativeAlignment: data.totalImpact > 5 ? "dominant" : "moderate",
    }))
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 10);

  logger.info({ weightedSentiment, viralityProbability }, "Sentiment score calculated");

  return { sentimentScore: weightedSentiment, viralityProbability, influencerRankings };
}

// ── Political Election Scoring ──
export function calculateElectionScore(
  candidates: { name: string; party: string }[],
  platformSentiments: Record<string, { positive: number; negative: number }>,
): { electabilityForecast: Record<string, number>; winner: string } {
  const forecast: Record<string, number> = {};
  let totalWeight = 0;

  for (const candidate of candidates) {
    const sentiment = platformSentiments[candidate.name] || { positive: 50, negative: 50 };
    const positivityRatio = sentiment.positive / (sentiment.positive + sentiment.negative || 1);
    forecast[candidate.name] = Math.round(positivityRatio * 100);
    totalWeight += forecast[candidate.name];
  }

  // Normalize to 100%
  for (const candidate of candidates) {
    forecast[candidate.name] = Math.round((forecast[candidate.name] / totalWeight) * 100);
  }

  const winner = Object.entries(forecast).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

  return { electabilityForecast: forecast, winner };
}

// ── Confidence Calculation ──
export function calculateConfidence(
  dataCompleteness: number,
  agentConsensus: number,
  scenarioStability: number,
): number {
  return Math.round(
    (dataCompleteness * 0.30) +
    (agentConsensus * 0.40) +
    (scenarioStability * 0.30)
  );
}

// ── Weight Maps ──
function getWeights(predictionType: string): Record<string, number> {
  const weightMaps: Record<string, Record<string, number>> = {
    funding: {
      "Revenue Traction": 0.25,
      "Growth Rate": 0.20,
      "Market Size": 0.15,
      "Founder Quality": 0.15,
      "Unit Economics": 0.10,
      "Investor Fit": 0.10,
      "Risk Adjustment": 0.05,
    },
    acquisition: {
      "Strategic Synergy": 0.25,
      "Product Fit": 0.20,
      "Customer Overlap": 0.15,
      "Technology Fit": 0.15,
      "Financial Health": 0.10,
      "Team Quality": 0.10,
      "Integration Risk": 0.05,
    },
    ipo: {
      "Financial Maturity": 0.25,
      "Growth Trajectory": 0.20,
      "Governance & Compliance": 0.15,
      "Market Conditions": 0.15,
      "Comparable Valuations": 0.10,
      "Institutional Appetite": 0.10,
      "Regulatory Risk": 0.05,
    },
    market_dynamics: {
      "Supply/Demand Balance": 0.20,
      "Regulatory Impact": 0.20,
      "Competitive Dynamics": 0.15,
      "Consumer Sentiment": 0.15,
      "Macro Factors": 0.15,
      "Technology Disruption": 0.10,
      "Seasonality": 0.05,
    },
  };

  return weightMaps[predictionType] || weightMaps.funding;
}
