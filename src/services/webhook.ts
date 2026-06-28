import { logger } from "../lib/logger.js";
import { createNotification } from "./notification-service.js";

// ── Webhook Notification Service ──

interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
}

interface WebhookPayload {
  event: string;
  projectId?: string;
  mode?: string;
  status?: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

// In-memory webhook registry (production: store in DB)
const webhooks = new Map<string, WebhookConfig[]>();

export function registerWebhook(userId: string, config: WebhookConfig): void {
  const existing = webhooks.get(userId) || [];
  existing.push(config);
  webhooks.set(userId, existing);
  logger.info({ userId, url: config.url }, "Webhook registered");
}

export function removeWebhook(userId: string, url: string): void {
  const existing = webhooks.get(userId) || [];
  webhooks.set(userId, existing.filter(w => w.url !== url));
}

export async function fireWebhook(
  userId: string,
  event: string,
  payload: Omit<WebhookPayload, "event" | "timestamp">,
): Promise<void> {
  const userWebhooks = webhooks.get(userId) || [];
  const matching = userWebhooks.filter(w => w.events.includes(event) || w.events.includes("*"));

  if (!matching.length) return;

  const body: WebhookPayload = { event, ...payload, timestamp: new Date().toISOString() };

  for (const webhook of matching) {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (webhook.secret) {
        headers["X-Webhook-Secret"] = webhook.secret;
      }

      const response = await fetch(webhook.url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        logger.warn({ url: webhook.url, status: response.status }, "Webhook delivery failed");
      }
    } catch (err) {
      logger.error({ err, url: webhook.url }, "Webhook delivery error");
    }
  }
}

// ── Notification helpers ──
export async function notifySimulationCompleted(projectId: string, userId: string, mode: string, score: number): Promise<void> {
  await createNotification(userId, "simulation_completed", { projectId, mode, score });
  await fireWebhook(userId, "simulation.completed", { projectId, mode, status: "completed", data: { score } });
}

export async function notifySimulationFailed(projectId: string, userId: string, mode: string, error: string): Promise<void> {
  await createNotification(userId, "simulation_failed", { projectId, mode, error });
  await fireWebhook(userId, "simulation.failed", { projectId, mode, status: "failed", data: { error } });
}
