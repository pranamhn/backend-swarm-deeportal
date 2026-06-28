import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { errorHandler, requestLogger } from "./middleware/error-handler.js";
import projectsRouter from "./routes/projects.js";
import simulationRouter from "./routes/simulation.js";
import reportRouter from "./routes/report.js";

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);

// ── Health ──
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ──
app.use("/api/swarm/projects", projectsRouter);
app.use("/api/swarm/simulation", simulationRouter);
app.use("/api/swarm/report", reportRouter);

// ── Error Handler ──
app.use(errorHandler);

// ── Start ──
app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, `🔄 Swarm Deeportal backend running on port ${config.port}`);
  logger.info("   POST /api/swarm/projects          — Create swarm project (social or investment)");
  logger.info("   GET  /api/swarm/projects          — List projects");
  logger.info("   GET  /api/swarm/projects/:id      — Get project");
  logger.info("   POST /api/swarm/simulation/:id/start — Start simulation");
  logger.info("   GET  /api/swarm/simulation/:id/status — Get status");
  logger.info("   GET  /api/swarm/report/:id/report  — Get report");
  logger.info("   POST /api/swarm/report/:id/chat   — Chat with report");
});

export default app;
