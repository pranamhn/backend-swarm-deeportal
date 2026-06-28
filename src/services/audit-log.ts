import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

// ── Audit Log Service ──
// Uses raw SQL for flexibility (lightweight, no schema migration needed for new event types)

export type AuditAction =
  | "project.created"
  | "project.deleted"
  | "simulation.started"
  | "simulation.completed"
  | "simulation.failed"
  | "simulation.cancelled"
  | "report.viewed"
  | "report.exported"
  | "report.shared"
  | "chat.message_sent"
  | "agent.interviewed"
  | "feature_flag.changed"
  | "webhook.registered"
  | "webhook.removed";

interface AuditEntry {
  id: string;
  userId: string;
  action: AuditAction;
  projectId?: string;
  mode?: string;
  details: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export async function logAudit(entry: Omit<AuditEntry, "id" | "timestamp">): Promise<void> {
  try {
    await db.execute(sql`
      INSERT INTO swarm_audit_log (id, user_id, action, project_id, mode, details, ip, user_agent, created_at)
      VALUES (
        ${uuid()},
        ${entry.userId},
        ${entry.action},
        ${entry.projectId || null},
        ${entry.mode || null},
        ${JSON.stringify(entry.details)}::jsonb,
        ${entry.ip || null},
        ${entry.userAgent || null},
        NOW()
      )
    `);
  } catch {
    // Non-critical — don't fail the main operation
    logger.warn({ action: entry.action }, "Audit log write failed");
  }
}

export async function getAuditLog(params: {
  userId?: string;
  projectId?: string;
  action?: AuditAction;
  limit?: number;
  offset?: number;
}): Promise<AuditEntry[]> {
  try {
    const conditions: string[] = ["1=1"];
    const values: unknown[] = [];

    if (params.userId) { conditions.push(`user_id = $${values.length + 1}`); values.push(params.userId); }
    if (params.projectId) { conditions.push(`project_id = $${values.length + 1}`); values.push(params.projectId); }
    if (params.action) { conditions.push(`action = $${values.length + 1}`); values.push(params.action); }

    const limit = params.limit || 50;
    const offset = params.offset || 0;

    const result = await db.execute(sql`
      SELECT * FROM swarm_audit_log
      WHERE ${sql.raw(conditions.join(" AND "))}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    return (result as unknown as AuditEntry[]) || [];
  } catch {
    return [];
  }
}

// ── Convenience helpers ──
export const audit = {
  projectCreated(userId: string, projectId: string, mode: string, ip?: string) {
    return logAudit({ userId, projectId, mode, action: "project.created", details: { mode }, ip });
  },
  simulationStarted(userId: string, projectId: string, mode: string, ip?: string) {
    return logAudit({ userId, projectId, mode, action: "simulation.started", details: { mode }, ip });
  },
  simulationCompleted(userId: string, projectId: string, mode: string, durationMs: number, ip?: string) {
    return logAudit({ userId, projectId, mode, action: "simulation.completed", details: { mode, durationMs }, ip });
  },
  simulationFailed(userId: string, projectId: string, mode: string, error: string, ip?: string) {
    return logAudit({ userId, projectId, mode, action: "simulation.failed", details: { mode, error }, ip });
  },
  reportViewed(userId: string, projectId: string, ip?: string) {
    return logAudit({ userId, projectId, action: "report.viewed", details: {}, ip });
  },
  reportExported(userId: string, projectId: string, format: string, ip?: string) {
    return logAudit({ userId, projectId, action: "report.exported", details: { format }, ip });
  },
};
