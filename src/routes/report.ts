import { Router, type Request, type Response } from "express";
import { db, swarmReports, swarmChatMessages } from "../db/index.js";
import { eq, desc } from "drizzle-orm";
import { chatMessageSchema } from "../lib/validation.js";
import { AppError, successResponse, notFound } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { completeWithReasoning } from "../lib/llm.js";
import { v4 as uuid } from "uuid";

const router = Router();

// ── Get Report ──
router.get("/:projectId/report", async (req: Request, res: Response) => {
  try {
    const [report] = await db.select().from(swarmReports)
      .where(eq(swarmReports.projectId, req.params.projectId))
      .orderBy(desc(swarmReports.createdAt))
      .limit(1);

    if (!report) throw notFound("Report", req.params.projectId);

    res.json(successResponse(report));
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    res.status(500).json({ success: false });
  }
});

// ── Get Chat Messages ──
router.get("/:projectId/chat", async (req: Request, res: Response) => {
  try {
    const messages = await db.select().from(swarmChatMessages)
      .where(eq(swarmChatMessages.projectId, req.params.projectId))
      .orderBy(desc(swarmChatMessages.timestamp))
      .limit(50);

    res.json(successResponse(messages.reverse()));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── Send Chat Message ──
router.post("/:projectId/chat", async (req: Request, res: Response) => {
  try {
    const parsed = chatMessageSchema.safeParse({ ...req.body, projectId: req.params.projectId });
    if (!parsed.success) throw new AppError("VALIDATION_ERROR", "Invalid message", { issues: parsed.error.issues });

    // Save user message
    const userMsg = {
      id: uuid(),
      projectId: req.params.projectId,
      role: "user" as const,
      content: parsed.data.message,
      timestamp: new Date(),
    };
    await db.insert(swarmChatMessages).values(userMsg);

    // Generate AI response (placeholder — full ReACT agent in production)
    const aiResponse = await completeWithReasoning(
      "You are a Swarm Deeportal analyst. Answer questions about the prediction report based on available data. Be concise and data-driven.",
      parsed.data.message
    );

    const assistantMsg = {
      id: uuid(),
      projectId: req.params.projectId,
      role: "assistant" as const,
      content: aiResponse,
      timestamp: new Date(),
    };
    await db.insert(swarmChatMessages).values(assistantMsg);

    logger.info({ projectId: req.params.projectId }, "Chat message processed");

    res.json(successResponse({
      message: assistantMsg,
      answer: aiResponse,
    }));
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    logger.error({ err }, "Chat failed");
    res.status(500).json({ success: false });
  }
});

export default router;
