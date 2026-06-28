import { Router, type Request, type Response } from "express";
import { successResponse } from "../lib/errors.js";
import { generatePopulationAgents } from "../services/population-agents.js";
import { runPopulationSimulation, type SimulationScenario } from "../services/population-simulation.js";
import { getPopulationContextForRegion, enrichPrediction } from "../services/population-integration.js";
import { logger } from "../lib/logger.js";

const router = Router();

// ── Get Region Demographics ──
router.get("/region/:regionCode", (req: Request, res: Response) => {
  const context = getPopulationContextForRegion(req.params.regionCode);
  res.json(successResponse({
    ...context,
    timestamp: new Date().toISOString(),
  }));
});

// ── Get Region Ranking ──
router.get("/ranking", (req: Request, res: Response) => {
  const regions = ["31", "32", "35", "34", "33"];
  const rankings = regions.map(code => {
    const ctx = getPopulationContextForRegion(code);
    const score = Math.round(
      (ctx.totalPopulation / 50000000) * 25 +
      (ctx.hdi * 100) * 0.20 +
      (ctx.expenditurePc / 20000000) * 15 +
      (ctx.urbanPct / 100) * 10 +
      (1 - ctx.povertyRate / 100) * 15 +
      ctx.growthRate * 10
    );
    return { ...ctx, opportunityScore: Math.min(100, score) };
  }).sort((a, b) => b.opportunityScore - a.opportunityScore);

  res.json(successResponse(rankings));
});

// ── Generate Population Agents ──
router.post("/agents/generate", (req: Request, res: Response) => {
  const { regionCode, count } = req.body;
  const ctx = getPopulationContextForRegion(regionCode || "default");
  const agents = generatePopulationAgents(
    { regionId: ctx.regionId, name: ctx.regionName, totalPopulation: ctx.totalPopulation, urbanPct: ctx.urbanPct, povertyRate: ctx.povertyRate, hdi: ctx.hdi, expenditurePc: ctx.expenditurePc },
    Math.min(count || 100, 10000)
  );
  res.json(successResponse({
    region: ctx.regionName,
    totalPopulation: ctx.totalPopulation,
    agentsGenerated: agents.length,
    agentTypes: [...new Set(agents.map(a => a.agentType))],
    sample: agents.slice(0, 5),
  }));
});

// ── Run Population Simulation ──
router.post("/simulate", (req: Request, res: Response) => {
  const { regionCode, scenarioType, agentCount, loops, affectedSegments } = req.body;

  const ctx = getPopulationContextForRegion(regionCode || "default");
  const agents = generatePopulationAgents(
    { regionId: ctx.regionId, name: ctx.regionName, totalPopulation: ctx.totalPopulation, urbanPct: ctx.urbanPct, povertyRate: ctx.povertyRate, hdi: ctx.hdi, expenditurePc: ctx.expenditurePc },
    Math.min(agentCount || 500, 10000)
  );

  const scenario = {
    type: (scenarioType || "policy_change") as SimulationScenario,
    description: req.body.description || "Simulation scenario",
    impactMagnitude: req.body.impactMagnitude || 5,
    affectedSegments: affectedSegments || ["*"],
    region: ctx.regionName,
  };

  const result = runPopulationSimulation(agents, scenario, loops || 5);

  logger.info({ regionCode, scenarioType, result: result.adoptionRate }, "Population simulation completed");

  res.json(successResponse({
    region: ctx.regionName,
    ...result,
  }));
});

// ── Enrich Prediction with Population Data ──
router.post("/enrich", (req: Request, res: Response) => {
  const { predictionType, regionCode } = req.body;
  const ctx = getPopulationContextForRegion(regionCode || "default");
  const enrichment = enrichPrediction(predictionType || "market_opportunity", ctx);
  res.json(successResponse({ predictionType, regionCode, enrichment }));
});

export default router;
