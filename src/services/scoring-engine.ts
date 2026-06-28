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
    // Startup Intelligence
    funding_signal: {
      "Funding Probability": 0.30,
      "Investor Interest": 0.20,
      "Sector Momentum": 0.15,
      "Founder Signal": 0.15,
      "Traction Signal": 0.20,
    },
    growth_signal: {
      "Revenue Growth Rate": 0.30,
      "Market Demand": 0.25,
      "Team Capability": 0.15,
      "Product-Market Fit": 0.15,
      "Competitive Position": 0.15,
    },
    investor_fit: {
      "Sector Alignment": 0.25,
      "Stage Match": 0.20,
      "Check Size Fit": 0.15,
      "Geography Match": 0.15,
      "Founder-Investor Chemistry": 0.15,
      "Portfolio Synergy": 0.10,
    },
    mna_signal: {
      "Strategic Synergy": 0.25,
      "Product Fit": 0.20,
      "Customer Overlap": 0.15,
      "Technology Fit": 0.15,
      "Financial Health": 0.10,
      "Team Quality": 0.10,
      "Integration Risk": 0.05,
    },
    business_risk: {
      "Financial Risk": 0.25,
      "Market Risk": 0.20,
      "Operational Risk": 0.15,
      "Legal/Regulatory Risk": 0.15,
      "Competitive Risk": 0.15,
      "Reputation Risk": 0.10,
    },
    // Market Intelligence
    market_opportunity: {
      "Market Size": 0.25,
      "Growth Rate": 0.25,
      "Competition Level": 0.15,
      "Entry Barriers": 0.15,
      "Regulatory Environment": 0.10,
      "Timing": 0.10,
    },
    market_expansion: {
      "Market Attractiveness": 0.30,
      "Competitive Landscape": 0.20,
      "Regulatory Feasibility": 0.15,
      "Operational Readiness": 0.15,
      "Cultural Fit": 0.10,
      "Partnership Potential": 0.10,
    },
    revenue_potential: {
      "TAM/SAM/SOM": 0.25,
      "Pricing Power": 0.20,
      "Customer Acquisition Efficiency": 0.20,
      "Retention & Expansion": 0.15,
      "Unit Economics": 0.20,
    },
    // Political Intelligence
    political_risk: {
      "Regulatory Stability": 0.25,
      "Policy Continuity": 0.20,
      "Government Relations": 0.15,
      "Corruption Risk": 0.15,
      "Social Stability": 0.15,
      "International Relations": 0.10,
    },
    regulation_impact: {
      "Direct Business Impact": 0.30,
      "Compliance Cost": 0.25,
      "Timeline Pressure": 0.15,
      "Industry Resistance": 0.15,
      "Precedent Risk": 0.15,
    },
    policy_direction: {
      "Government Priority": 0.25,
      "Public Support": 0.20,
      "Industry Alignment": 0.20,
      "Budget Feasibility": 0.15,
      "Implementation Timeline": 0.10,
      "Political Will": 0.10,
    },
    // Financial Intelligence
    credit_risk: {
      "Debt-to-Equity": 0.25,
      "Cash Flow Coverage": 0.25,
      "Collateral Quality": 0.15,
      "Payment History": 0.15,
      "Industry Risk": 0.10,
      "Management Quality": 0.10,
    },
    financing_eligibility: {
      "Revenue Threshold": 0.25,
      "Time in Business": 0.20,
      "Credit Score": 0.20,
      "Business Plan Quality": 0.15,
      "Collateral Availability": 0.10,
      "Sector Eligibility": 0.10,
    },
    cashflow_health: {
      "Operating Cash Flow": 0.30,
      "Burn Rate": 0.25,
      "Runway (months)": 0.20,
      "Revenue Collection": 0.15,
      "Expense Management": 0.10,
    },
    // HR & Talent Intelligence 🆕
    talent_acquisition: {
      "Market Talent Supply": 0.25,
      "Employer Brand Strength": 0.20,
      "Compensation Competitiveness": 0.20,
      "Time-to-Hire Trend": 0.15,
      "Competitor Hiring Activity": 0.10,
      "Remote Work Flexibility": 0.10,
    },
    retention_risk: {
      "Employee Satisfaction": 0.25,
      "Compensation Fairness": 0.20,
      "Career Growth Path": 0.15,
      "Management Quality": 0.15,
      "Work-Life Balance": 0.15,
      "External Job Market": 0.10,
    },
    salary_benchmark: {
      "Industry Benchmark": 0.25,
      "Role Seniority": 0.20,
      "Location Factor": 0.15,
      "Company Stage": 0.15,
      "Skill Scarcity": 0.15,
      "Equity Component": 0.10,
    },
    team_scalability: {
      "Current Team Size": 0.20,
      "Hiring Velocity": 0.20,
      "Management Bandwidth": 0.15,
      "Culture Resilience": 0.15,
      "Process Maturity": 0.15,
      "Budget Availability": 0.15,
    },
    // Legal & Compliance Intelligence 🆕
    litigation_risk: {
      "IP Portfolio Strength": 0.20,
      "Contract Compliance": 0.20,
      "Regulatory Exposure": 0.15,
      "Past Dispute History": 0.15,
      "Jurisdiction Complexity": 0.15,
      "Legal Team Capability": 0.15,
    },
    regulatory_fine: {
      "Compliance Program Maturity": 0.25,
      "Data Protection Readiness": 0.20,
      "Past Violation History": 0.20,
      "Regulatory Scrutiny Level": 0.15,
      "Industry Fine Benchmarks": 0.10,
      "Self-Reporting Status": 0.10,
    },
    compliance_gap: {
      "Regulatory Coverage": 0.25,
      "Internal Audit Frequency": 0.20,
      "Policy Documentation": 0.15,
      "Training Completion Rate": 0.15,
      "Third-Party Risk": 0.15,
      "Whistleblower System": 0.10,
    },
    contract_risk: {
      "Counterparty Reliability": 0.25,
      "Payment Terms Risk": 0.20,
      "Force Majeure Exposure": 0.15,
      "Dispute Resolution Clause": 0.15,
      "IP Ownership Clarity": 0.15,
      "Termination Flexibility": 0.10,
    },
    // Legacy
    funding: { "Revenue Traction": 0.25, "Growth Rate": 0.20, "Market Size": 0.15, "Founder Quality": 0.15, "Unit Economics": 0.10, "Investor Fit": 0.10, "Risk Adjustment": 0.05 },
    acquisition: { "Strategic Synergy": 0.25, "Product Fit": 0.20, "Customer Overlap": 0.15, "Technology Fit": 0.15, "Financial Health": 0.10, "Team Quality": 0.10, "Integration Risk": 0.05 },
    ipo: { "Financial Maturity": 0.25, "Growth Trajectory": 0.20, "Governance & Compliance": 0.15, "Market Conditions": 0.15, "Comparable Valuations": 0.10, "Institutional Appetite": 0.10, "Regulatory Risk": 0.05 },
    market_dynamics: { "Supply/Demand Balance": 0.20, "Regulatory Impact": 0.20, "Competitive Dynamics": 0.15, "Consumer Sentiment": 0.15, "Macro Factors": 0.15, "Technology Disruption": 0.10, "Seasonality": 0.05 },
  };

  return weightMaps[predictionType] || weightMaps.funding_signal;
}
