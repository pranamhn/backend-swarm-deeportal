import { Router, type Request, type Response } from "express";
import { successResponse } from "../lib/errors.js";
import { completeWithReasoning } from "../lib/llm.js";
import { getAllPacks, getPersonaPack } from "../services/persona-packs.js";
import { generateMultilingualPost, getAvailableLanguages, type SimulationLanguage } from "../services/multilang.js";
import { generateMockSignal, injectSignal, type ExternalSignal } from "../services/market-engine.js";
import { logger } from "../lib/logger.js";

const router = Router();

// ── Persona Packs ──
router.get("/playground/persona-packs", (_req: Request, res: Response) => {
  res.json(successResponse(getAllPacks()));
});

router.get("/playground/persona-packs/:packId", (req: Request, res: Response) => {
  const pack = getPersonaPack(req.params.packId);
  if (!pack) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Pack not found" } });
  res.json(successResponse(pack));
});

// ── Test Single Persona ──
router.post("/playground/test-persona", async (req: Request, res: Response) => {
  try {
    const { role, persona, scenario, topic } = req.body;

    if (!role || !persona) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "role and persona required" } });
    }

    const prompt = `You are a ${role} agent with the following persona:
    ${JSON.stringify(persona, null, 2)}
    
    Scenario: ${scenario || "General market analysis"}
    Topic: ${topic || "technology sector"}
    
    What action would you take? What's your reasoning? Return JSON with: decision, action, score_impact (-5 to +5), reasoning (2-3 sentences).`;

    const response = await completeWithReasoning(
      "You are a simulation agent. Respond only with valid JSON.",
      prompt
    );

    try {
      const parsed = JSON.parse(response);
      res.json(successResponse(parsed));
    } catch {
      res.json(successResponse({ decision: response, action: "analyze", score_impact: 0, reasoning: response }));
    }
  } catch (err) {
    logger.error({ err }, "Persona test failed");
    res.status(500).json({ success: false });
  }
});

// ── Test Multi-language Post ──
router.post("/playground/test-multilang", (req: Request, res: Response) => {
  const { lang, topic, sentiment } = req.body as { lang: SimulationLanguage; topic: string; sentiment: "positive" | "negative" | "neutral" };

  if (!lang || !topic) {
    return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "lang and topic required" } });
  }

  const post = generateMultilingualPost(lang, topic, sentiment || "neutral");
  res.json(successResponse({ lang, topic, sentiment: sentiment || "neutral", post }));
});

// ── List Languages ──
router.get("/playground/languages", (_req: Request, res: Response) => {
  res.json(successResponse(getAvailableLanguages()));
});

// ── Test Signal Injection ──
router.post("/playground/inject-signal", async (req: Request, res: Response) => {
  try {
    const { projectId, signalType } = req.body;

    if (!projectId || !signalType) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "projectId and signalType required" } });
    }

    const signal = generateMockSignal(signalType, projectId);
    const result = await injectSignal(projectId, signal);

    res.json(successResponse({ signal, ...result }));
  } catch (err) {
    logger.error({ err }, "Signal injection failed");
    res.status(500).json({ success: false });
  }
});

// ── List Signal Types ──
router.get("/playground/signal-types", (_req: Request, res: Response) => {
  const types = [
    { type: "competitor_funding", description: "Competitor raises funding", defaultImpact: -4 },
    { type: "regulatory_change", description: "New regulation announced", defaultImpact: -6 },
    { type: "key_hire", description: "Key executive hire", defaultImpact: +5 },
    { type: "market_crash", description: "Broad market selloff", defaultImpact: -8 },
    { type: "product_launch", description: "Major product launch", defaultImpact: +7 },
    { type: "partnership", description: "Strategic partnership", defaultImpact: +6 },
    { type: "scandal", description: "Founder/company scandal", defaultImpact: -9 },
    { type: "macro_event", description: "Macroeconomic event", defaultImpact: -5 },
  ];
  res.json(successResponse(types));
});

export default router;
