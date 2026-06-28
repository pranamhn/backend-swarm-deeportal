import { Router, type Request, type Response } from "express";
import { getAllFlags, setOverride, removeOverride } from "../lib/feature-flags.js";
import { successResponse } from "../lib/errors.js";

const router = Router();

// ── Get all feature flags ──
router.get("/", (_req: Request, res: Response) => {
  res.json(successResponse(getAllFlags()));
});

// ── Set flag override ──
router.put("/:flagKey", (req: Request, res: Response) => {
  const { flagKey } = req.params;
  const { value } = req.body;

  setOverride(flagKey, value);
  res.json(successResponse({ flagKey, value, overridden: true }));
});

// ── Remove flag override ──
router.delete("/:flagKey", (req: Request, res: Response) => {
  removeOverride(req.params.flagKey);
  res.json(successResponse({ flagKey: req.params.flagKey, overridden: false }));
});

export default router;
