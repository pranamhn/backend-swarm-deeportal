import { Router, type Request, type Response } from "express";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
import { successResponse } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

const router = Router();

// ── Prediction Marketplace ──
// Users can submit prediction outcomes for verification and earn reputation

// Submit outcome verification
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { predictionId, actualOutcome, actualDetails } = req.body;
    const userId = (req.headers["x-user-id"] as string) || "anonymous";

    if (!predictionId || !actualOutcome) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "predictionId and actualOutcome required" } });
    }

    const verification = {
      id: uuid(),
      predictionId,
      userId,
      actualOutcome,
      actualDetails: actualDetails || {},
      status: "pending_review",
      reputationEarned: 0,
      createdAt: new Date().toISOString(),
    };

    // In production: store in DB, trigger admin review
    logger.info({ predictionId, actualOutcome, userId }, "Outcome verification submitted");

    res.json(successResponse({
      ...verification,
      message: "Verification submitted. Admin review will confirm and award reputation.",
    }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── Reputation Leaderboard ──
router.get("/leaderboard", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    // In production: query from DB
    const leaderboard = [
      { rank: 1, userId: "user-1", username: "TopPredictor", reputation: 1250, verifiedPredictions: 42, accuracy: 0.88 },
      { rank: 2, userId: "user-2", username: "DataWhisperer", reputation: 980, verifiedPredictions: 35, accuracy: 0.82 },
      { rank: 3, userId: "user-3", username: "MarketSage", reputation: 850, verifiedPredictions: 28, accuracy: 0.85 },
    ].slice(0, limit);

    res.json(successResponse({
      leaderboard,
      totalVerifiers: 156,
      totalVerifiedPredictions: 312,
      platformAccuracy: 0.76,
    }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── User Reputation ──
router.get("/reputation/:userId", async (req: Request, res: Response) => {
  const reputation = {
    userId: req.params.userId,
    score: 450,
    level: "Expert Predictor",
    nextLevel: "Master Predictor",
    pointsToNext: 550,
    badges: ["🎯 Accurate (10+)", "🔥 Streak: 5 correct", "📊 Top 10%"],
    history: [
      { predictionId: "p-1", outcome: "correct", points: 50, date: "2026-06-15" },
      { predictionId: "p-2", outcome: "correct", points: 30, date: "2026-06-10" },
      { predictionId: "p-3", outcome: "incorrect", points: -10, date: "2026-06-05" },
    ],
  };

  res.json(successResponse(reputation));
});

export default router;
