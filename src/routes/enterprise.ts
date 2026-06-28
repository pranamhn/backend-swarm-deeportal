import { Router, type Request, type Response } from "express";
import { successResponse } from "../lib/errors.js";
import { estimateSimulationCost, getProjectCost, getUserCosts, getGlobalStats } from "../services/cost-tracking.js";

const router = Router();

// ── Get project cost ──
router.get("/costs/project/:projectId", (req: Request, res: Response) => {
  const cost = getProjectCost(req.params.projectId);
  if (!cost) return res.json(successResponse(null));
  res.json(successResponse(cost));
});

// ── Get user costs ──
router.get("/costs/user", (req: Request, res: Response) => {
  const userId = (req.headers["x-user-id"] as string) || "anonymous";
  res.json(successResponse(getUserCosts(userId)));
});

// ── Get global cost stats ──
router.get("/costs/global", (_req: Request, res: Response) => {
  res.json(successResponse(getGlobalStats()));
});

// ── Estimate cost ──
router.post("/costs/estimate", (req: Request, res: Response) => {
  const { mode, agentCount, loops, model } = req.body;
  const estimate = estimateSimulationCost(mode || "investment_prediction", agentCount || 20, loops || 10, model);
  res.json(successResponse(estimate));
});

// ── Custom Scoring Formulas ──
const customFormulas = new Map<string, Record<string, number>>();

router.get("/scoring/custom/:userId", (req: Request, res: Response) => {
  const formula = customFormulas.get(req.params.userId);
  res.json(successResponse(formula || null));
});

router.put("/scoring/custom/:userId", (req: Request, res: Response) => {
  const { weights } = req.body;
  if (!weights || typeof weights !== "object") {
    return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "weights object required" } });
  }

  // Validate weights sum to ~1.0
  const total = Object.values(weights as Record<string, number>).reduce((a: number, b: number) => a + b, 0);
  if (Math.abs(total - 1.0) > 0.01) {
    return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Weights must sum to 1.0" } });
  }

  customFormulas.set(req.params.userId, weights as Record<string, number>);
  res.json(successResponse({ userId: req.params.userId, weights, saved: true }));
});

router.delete("/scoring/custom/:userId", (req: Request, res: Response) => {
  customFormulas.delete(req.params.userId);
  res.json(successResponse({ deleted: true }));
});

export default router;
