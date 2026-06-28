import type { Request, Response, NextFunction } from "express";
import { rateLimited } from "../lib/errors.js";

// Simple in-memory rate limiter
// Production: replace with Redis-based rate limiter (rate-limiter-flexible)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 60_000);

const LIMITS: Record<string, { points: number; duration: number }> = {
  free: { points: 20, duration: 60_000 },       // 20 req/min
  pro: { points: 100, duration: 60_000 },        // 100 req/min
  enterprise: { points: 500, duration: 60_000 }, // 500 req/min
};

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const tier = (req.headers["x-user-tier"] as string) || "free";
  const limit = LIMITS[tier] || LIMITS.free;
  const key = `${req.ip}:${req.path}`;

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + limit.duration });
    return next();
  }

  entry.count += 1;

  if (entry.count > limit.points) {
    const retryAfterMs = entry.resetAt - now;
    const err = rateLimited(retryAfterMs);
    res.set("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
    res.set("X-RateLimit-Limit", String(limit.points));
    res.set("X-RateLimit-Remaining", "0");
    return res.status(err.statusCode).json(err.toResponse());
  }

  res.set("X-RateLimit-Limit", String(limit.points));
  res.set("X-RateLimit-Remaining", String(limit.points - entry.count));
  next();
}

// ── Auth middleware (placeholder) ──
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    req.headers["x-user-id"] = "anonymous";
  }
  next();
}

// ── Input sanitization ──
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/```(?:system|prompt)\b[\s\S]*?```/gi, "[SANITIZED]")
    .slice(0, 10000);
}
