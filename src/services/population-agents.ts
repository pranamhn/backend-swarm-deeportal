import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

// ── Population Agent Generator ──
// Generates synthetic population agents from demographic data

export type PopulationAgentType = "urban_worker" | "rural_farmer" | "student" | "professional" | "informal_worker" | "entrepreneur";

export interface PopulationAgent {
  id: string;
  agentType: PopulationAgentType;
  region: string;
  ageGroup: string;
  incomeProxy: "low" | "middle_low" | "middle" | "middle_high" | "high";
  occupation: string;
  mobilityNeed: "low" | "medium" | "high";
  digitalAdoption: "low" | "medium" | "high";
  priceSensitivity: "low" | "medium" | "high";
  policySensitivity: "low" | "medium" | "high";
  attributes: Record<string, unknown>;
}

interface RegionDemographics {
  regionId: string;
  name: string;
  totalPopulation: number;
  urbanPct: number;
  povertyRate: number;
  hdi: number;
  expenditurePc: number;
}

const AGENT_TYPE_DISTRIBUTION: Record<string, Partial<Record<PopulationAgentType, number>>> = {
  // Urban-dominated regions (Jakarta, Surabaya)
  urban_high: { urban_worker: 0.35, professional: 0.25, entrepreneur: 0.15, student: 0.15, informal_worker: 0.10 },
  // Mixed regions (Jawa Barat, Jatim outside cities)
  mixed: { urban_worker: 0.25, rural_farmer: 0.20, informal_worker: 0.20, student: 0.15, entrepreneur: 0.10, professional: 0.10 },
  // Rural-dominated regions
  rural: { rural_farmer: 0.40, informal_worker: 0.25, student: 0.15, urban_worker: 0.10, entrepreneur: 0.10 },
};

export function generatePopulationAgents(
  region: RegionDemographics,
  count: number,
): PopulationAgent[] {
  const distribution = region.urbanPct > 70 ? AGENT_TYPE_DISTRIBUTION.urban_high
    : region.urbanPct > 40 ? AGENT_TYPE_DISTRIBUTION.mixed
      : AGENT_TYPE_DISTRIBUTION.rural;

  const agents: PopulationAgent[] = [];

  for (let i = 0; i < count; i++) {
    const agentType = weightedRandom(distribution) as PopulationAgentType;
    const ageGroups = ["15-24", "25-34", "35-44", "45-54", "55+"];
    const incomes: PopulationAgent["incomeProxy"][] = ["low", "middle_low", "middle", "middle_high", "high"];

    const agent: PopulationAgent = {
      id: uuid(),
      agentType,
      region: region.name,
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      incomeProxy: incomes[Math.min(Math.floor(region.hdi * 6), 4)] as PopulationAgent["incomeProxy"],
      occupation: agentType.replace(/_/g, " "),
      mobilityNeed: agentType === "rural_farmer" ? "low" : agentType === "urban_worker" ? "high" : "medium",
      digitalAdoption: region.hdi > 0.7 ? "high" : region.hdi > 0.6 ? "medium" : "low",
      priceSensitivity: region.povertyRate > 15 ? "high" : region.povertyRate > 8 ? "medium" : "low",
      policySensitivity: (["low", "medium", "high"] as Array<"low" | "medium" | "high">)[Math.floor(Math.random() * 3)],
      attributes: {
        region_hdi: region.hdi,
        region_poverty: region.povertyRate,
        region_expenditure: region.expenditurePc,
      },
    };

    agents.push(agent);
  }

  logger.info({ region: region.name, count }, "Population agents generated");
  return agents;
}

function weightedRandom(distribution: Partial<Record<string, number>>): string {
  const entries = Object.entries(distribution) as [string, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [key, weight] of entries) {
    r -= weight;
    if (r <= 0) return key;
  }
  return entries[0][0];
}
