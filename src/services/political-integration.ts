import { logger } from "../lib/logger.js";

// ── Political Data Enrichment for Swarm Predictions ──

interface PoliticalContext {
  regionCode: string;
  dominantParty?: string;
  voteShare?: number;
  swingIndex?: number;
  turnout?: number;
  competitiveness?: number;
  topIssues?: string[];
}

export function enrichSwarmWithPoliticalData(
  predictionType: string,
  politicalContext: PoliticalContext,
): Record<string, number> {
  const enrichment: Record<string, number> = {};

  switch (predictionType) {
    case "political_risk":
      enrichment.regional_stability = politicalContext.swingIndex
        ? Math.round(100 - politicalContext.swingIndex)
        : 50;
      enrichment.electoral_volatility = politicalContext.swingIndex || 50;
      break;

    case "regulation_impact":
      enrichment.political_feasibility = politicalContext.dominantParty
        ? 60
        : 40;
      enrichment.public_support_proxy = politicalContext.turnout || 50;
      break;

    case "policy_direction":
      enrichment.government_priority = politicalContext.competitiveness
        ? Math.round(politicalContext.competitiveness * 100)
        : 50;
      break;

    case "political_election":
      enrichment.swing_potential = politicalContext.swingIndex || 50;
      enrichment.turnout_gap = politicalContext.turnout
        ? Math.round(85 - politicalContext.turnout)
        : 30;
      enrichment.issue_alignment = politicalContext.topIssues?.length
        ? Math.min(100, politicalContext.topIssues.length * 20)
        : 50;
      break;
  }

  logger.info({ predictionType, enrichment }, "Political data enriched swarm prediction");
  return enrichment;
}

export function getDefaultPoliticalContext(regionCode: string): PoliticalContext {
  // In production: fetch from political DB
  const contexts: Record<string, PoliticalContext> = {
    "31": { regionCode: "31", dominantParty: "PDIP", voteShare: 35, swingIndex: 25, turnout: 78, competitiveness: 0.6, topIssues: ["ekonomi", "infrastruktur"] },
    "32": { regionCode: "32", dominantParty: "Gerindra", voteShare: 30, swingIndex: 40, turnout: 72, competitiveness: 0.7, topIssues: ["lapangan kerja", "pendidikan"] },
    "35": { regionCode: "35", dominantParty: "PKB", voteShare: 28, swingIndex: 35, turnout: 70, competitiveness: 0.65, topIssues: ["pertanian", "infrastruktur"] },
    "default": { regionCode: "00", dominantParty: "Mixed", voteShare: 25, swingIndex: 40, turnout: 75, competitiveness: 0.65, topIssues: ["ekonomi", "kesehatan"] },
  };

  return contexts[regionCode] || contexts.default;
}
