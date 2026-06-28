import type { PopulationAgent } from "./population-agents.js";
import { logger } from "../lib/logger.js";

// ── Population Swarm Simulation ──

export type SimulationScenario = "policy_change" | "market_entry" | "price_change" | "regulatory_shift";

interface ScenarioParams {
  type: SimulationScenario;
  description: string;
  impactMagnitude: number; // -10 to +10
  affectedSegments: string[];
  region: string;
}

interface SimulationResult {
  scenario: SimulationScenario;
  totalAgents: number;
  affectedAgents: number;
  adoptionRate: number;
  demandShift: number;
  sentimentChange: number;
  migrationPattern: Record<string, number>;
  segmentBreakdown: Record<string, { total: number; affected: number; rate: number }>;
  loops: number;
}

export function runPopulationSimulation(
  agents: PopulationAgent[],
  scenario: ScenarioParams,
  loops = 5,
): SimulationResult {
  logger.info({ scenario: scenario.type, agentCount: agents.length, loops }, "Population simulation started");

  const segmentBreakdown: Record<string, { total: number; affected: number }> = {};
  let totalAffected = 0;

  for (let loop = 1; loop <= loops; loop++) {
    for (const agent of agents) {
      if (!segmentBreakdown[agent.agentType]) {
        segmentBreakdown[agent.agentType] = { total: 0, affected: 0 };
      }
      segmentBreakdown[agent.agentType].total++;

      // Agent reacts based on scenario + attributes
      const affected = isAgentAffected(agent, scenario);
      if (affected) {
        segmentBreakdown[agent.agentType].affected++;
        totalAffected++;
      }
    }
  }

  const adoptionRate = Math.round((totalAffected / (agents.length * loops)) * 100);
  const demandShift = Math.round(scenario.impactMagnitude * (adoptionRate / 100) * 10);
  const sentimentChange = Math.round(scenario.impactMagnitude * 5);

  const segmentResult: Record<string, { total: number; affected: number; rate: number }> = {};
  for (const [type, data] of Object.entries(segmentBreakdown)) {
    segmentResult[type] = {
      total: data.total,
      affected: data.affected,
      rate: Math.round((data.affected / (data.total || 1)) * 100),
    };
  }

  return {
    scenario: scenario.type,
    totalAgents: agents.length,
    affectedAgents: totalAffected,
    adoptionRate,
    demandShift,
    sentimentChange,
    migrationPattern: {
      urban: Math.round(Math.random() * 30),
      suburban: Math.round(Math.random() * 20),
      rural: Math.round(Math.random() * 10),
    },
    segmentBreakdown: segmentResult,
    loops,
  };
}

function isAgentAffected(agent: PopulationAgent, scenario: ScenarioParams): boolean {
  const typeMatch = scenario.affectedSegments.includes(agent.agentType) || scenario.affectedSegments.includes("*");
  if (!typeMatch) return false;

  // Sensitivity-based probability
  let probability = 0.5;
  if (scenario.type === "policy_change" && agent.policySensitivity === "high") probability = 0.8;
  if (scenario.type === "price_change" && agent.priceSensitivity === "high") probability = 0.8;
  if (scenario.type === "market_entry" && agent.digitalAdoption === "high") probability = 0.7;
  if (scenario.type === "regulatory_shift" && agent.policySensitivity === "high") probability = 0.75;

  return Math.random() < probability;
}
