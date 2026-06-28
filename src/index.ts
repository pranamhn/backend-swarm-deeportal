import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { errorHandler, requestLogger } from "./middleware/error-handler.js";
import { rateLimiter } from "./middleware/security.js";
import projectsRouter from "./routes/projects.js";
import simulationRouter from "./routes/simulation.js";
import reportRouter from "./routes/report.js";
import notificationsRouter from "./routes/notifications.js";
import adminRouter from "./routes/admin.js";
import enterpriseRouter from "./routes/enterprise.js";

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter);

// ── Health ──
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ──
app.use("/api/swarm/projects", projectsRouter);
app.use("/api/swarm/simulation", simulationRouter);
app.use("/api/swarm/report", reportRouter);
app.use("/api/swarm/notifications", notificationsRouter);
app.use("/api/swarm/admin/flags", adminRouter);
app.use("/api/swarm/enterprise", enterpriseRouter);

// ── Error Handler ──
app.use(errorHandler);

// ── Start ──
app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, `🔄 Swarm Deeportal backend running on port ${config.port}`);
  logger.info("   POST /api/swarm/projects               — Create project (social or investment)");
  logger.info("   GET  /api/swarm/projects               — List projects");
  logger.info("   GET  /api/swarm/projects/:id           — Get project");
  logger.info("   POST /api/swarm/simulation/:id/start   — Start simulation (BullMQ)");
  logger.info("   GET  /api/swarm/simulation/:id/status  — Get simulation status");
  logger.info("   GET  /api/swarm/simulation/:id/stream  — SSE real-time progress");
  logger.info("   GET  /api/swarm/report/:id/report      — Get report");
  logger.info("   POST /api/swarm/report/:id/chat        — Chat with report");
  logger.info("   GET  /api/swarm/notifications          — Get notifications");
  logger.info("   POST /api/swarm/report/share           — Create share link");
  logger.info("   GET  /api/swarm/report/export/:id/json — Export report (JSON)");
  logger.info("   GET  /api/swarm/report/export/:id/md   — Export report (Markdown)");
  logger.info("   GET  /api/swarm/admin/flags            — List feature flags");
});

export default app;
