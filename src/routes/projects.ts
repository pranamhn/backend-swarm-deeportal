import { Router, type Request, type Response } from "express";
import { db, swarmProjects } from "../db/index.js";
import { eq, desc, and, sql } from "drizzle-orm";
import { newSwarmProjectSchema, paginationSchema } from "../lib/validation.js";
import { AppError, successResponse, notFound, validationError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

const router = Router();

// ── Create Project ──
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = newSwarmProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw validationError("Invalid project data", { issues: parsed.error.issues });
    }

    const project = {
      id: uuid(),
      userId: req.headers["x-user-id"] as string || "anonymous",
      ...parsed.data,
      status: "draft" as const,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(swarmProjects).values(project);
    logger.info({ projectId: project.id, mode: project.mode }, "Project created");

    res.status(201).json(successResponse(project));
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json(err.toResponse());
    }
    logger.error({ err }, "Failed to create project");
    res.status(500).json(successResponse(null));
  }
});

// ── List Projects ──
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const mode = req.query.mode as string | undefined;

    const where = mode ? eq(swarmProjects.mode, mode) : undefined;
    const offset = (page - 1) * limit;

    const [items, totalResult] = await Promise.all([
      db.select().from(swarmProjects).where(where).orderBy(desc(swarmProjects.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(swarmProjects).where(where),
    ]);

    const total = Number(totalResult[0]?.count || 0);

    res.json(successResponse({
      items,
      total,
      page,
      limit,
      hasMore: offset + limit < total,
    }));
  } catch (err) {
    logger.error({ err }, "Failed to list projects");
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to list projects", retryable: true } });
  }
});

// ── Get Project ──
router.get("/:projectId", async (req: Request, res: Response) => {
  try {
    const project = await db.select().from(swarmProjects).where(eq(swarmProjects.id, req.params.projectId)).limit(1);
    if (!project.length) throw notFound("Project", req.params.projectId);

    res.json(successResponse(project[0]));
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json(err.toResponse());
    res.status(500).json({ success: false });
  }
});

// ── Update Project Status ──
router.patch("/:projectId", async (req: Request, res: Response) => {
  try {
    const { status, progress, currentStep, error } = req.body;
    await db.update(swarmProjects)
      .set({ status, progress, currentStep, error, updatedAt: new Date() })
      .where(eq(swarmProjects.id, req.params.projectId));

    res.json(successResponse({ updated: true }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ── Delete Project ──
router.delete("/:projectId", async (req: Request, res: Response) => {
  try {
    await db.delete(swarmProjects).where(eq(swarmProjects.id, req.params.projectId));
    res.json(successResponse({ deleted: true }));
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
