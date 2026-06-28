import { Router, type Request, type Response } from "express";
import { db, swarmNotifications, swarmShareLinks, swarmReports } from "../db/index.js";
import { eq, desc, and } from "drizzle-orm";
import { shareLinkSchema } from "../lib/validation.js";
import { AppError, successResponse, notFound } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

const router = Router();

// ── Notifications ──

// Get notifications for user
router.get("/notifications", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string || "anonymous";
    const unreadOnly = req.query.unread === "true";

    const where = unreadOnly
      ? and(eq(swarmNotifications.userId, userId), eq(swarmNotifications.read, false))
      : eq(swarmNotifications.userId, userId);

    const notifications = await db.select().from(swarmNotifications)
      .where(where)
      .orderBy(desc(swarmNotifications.createdAt))
      .limit(50);

    res.json(successResponse(notifications));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Mark notification as read
router.patch("/notifications/:id/read", async (req: Request, res: Response) => {
  try {
    await db.update(swarmNotifications).set({ read: true }).where(eq(swarmNotifications.id, req.params.id));
    res.json(successResponse({ read: true }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Mark all as read
router.post("/notifications/read-all", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string || "anonymous";
    await db.update(swarmNotifications).set({ read: true }).where(eq(swarmNotifications.userId, userId));
    res.json(successResponse({ read: true }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── Create notification (internal) ──
export async function createNotification(userId: string, type: string, data: Record<string, unknown>) {
  await db.insert(swarmNotifications).values({
    id: uuid(),
    userId,
    type,
    data,
    read: false,
    createdAt: new Date(),
  });
  logger.info({ userId, type }, "Notification created");
}

// ── Share Links ──

// Create share link
router.post("/share", async (req: Request, res: Response) => {
  try {
    const parsed = shareLinkSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError("VALIDATION_ERROR", "Invalid share config", { issues: parsed.error.issues });

    const [report] = await db.select().from(swarmReports).where(eq(swarmReports.id, parsed.data.reportId)).limit(1);
    if (!report) throw notFound("Report", parsed.data.reportId);

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + parsed.data.expiresInDays * 24 * 60 * 60 * 1000);

    await db.insert(swarmShareLinks).values({
      id: uuid(),
      reportId: parsed.data.reportId,
      token,
      expiresAt,
      createdAt: new Date(),
    });

    res.json(successResponse({ token, url: `/share/${token}`, expiresAt }));
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    res.status(500).json({ success: false });
  }
});

// Get report by share token (public, no auth required)
router.get("/share/:token", async (req: Request, res: Response) => {
  try {
    const [link] = await db.select().from(swarmShareLinks).where(eq(swarmShareLinks.token, req.params.token)).limit(1);
    if (!link) throw notFound("Share link", req.params.token);
    if (new Date(link.expiresAt) < new Date()) throw new AppError("NOT_FOUND", "Share link has expired");

    const [report] = await db.select().from(swarmReports).where(eq(swarmReports.id, link.reportId)).limit(1);
    if (!report) throw notFound("Report", link.reportId);

    res.json(successResponse(report));
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    res.status(500).json({ success: false });
  }
});

// ── Export ──

// Export report as JSON
router.get("/export/:projectId/json", async (req: Request, res: Response) => {
  try {
    const [report] = await db.select().from(swarmReports)
      .where(eq(swarmReports.projectId, req.params.projectId))
      .orderBy(desc(swarmReports.createdAt))
      .limit(1);

    if (!report) throw notFound("Report", req.params.projectId);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="swarm-report-${req.params.projectId}.json"`);
    res.json(report);
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    res.status(500).json({ success: false });
  }
});

// Export report as Markdown
router.get("/export/:projectId/md", async (req: Request, res: Response) => {
  try {
    const [report] = await db.select().from(swarmReports)
      .where(eq(swarmReports.projectId, req.params.projectId))
      .orderBy(desc(swarmReports.createdAt))
      .limit(1);

    if (!report) throw notFound("Report", req.params.projectId);

    const md = report.rawMarkdown || `# ${report.summary || "Swarm Report"}\n\nReport generated at ${report.createdAt}`;

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader("Content-Disposition", `attachment; filename="swarm-report-${req.params.projectId}.md"`);
    res.send(md);
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    res.status(500).json({ success: false });
  }
});

export default router;
