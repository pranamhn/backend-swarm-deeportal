import { db, swarmNotifications } from "../db/index.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

// ── Notification Service ──
// Shared by routes and services — avoids circular dependency

export async function createNotification(userId: string, type: string, data: Record<string, unknown> = {}): Promise<void> {
  try {
    await db.insert(swarmNotifications).values({
      id: uuid(),
      userId,
      type,
      data,
      read: false,
      createdAt: new Date(),
    });
    logger.info({ userId, type }, "Notification created");
  } catch (err) {
    logger.error({ err, userId, type }, "Failed to create notification");
  }
}
