import { logger } from "./logger.js";

// ── Analytics Events (lightweight, no external dependency) ──
// Production: replace with PostHog, Mixpanel, or custom warehouse

type EventName =
  | "swarm_project_created"
  | "swarm_simulation_started"
  | "swarm_simulation_completed"
  | "swarm_simulation_failed"
  | "swarm_report_viewed"
  | "swarm_report_exported"
  | "swarm_report_shared"
  | "swarm_chat_message_sent"
  | "swarm_agent_interviewed"
  | "swarm_feature_flag_changed"
  | "swarm_error_occurred";

interface AnalyticsEvent {
  name: EventName;
  properties: Record<string, unknown>;
  userId?: string;
  projectId?: string;
  timestamp: string;
}

// In-memory buffer (production: flush to DB or external service)
const eventBuffer: AnalyticsEvent[] = [];
const MAX_BUFFER = 1000;

export function track(
  name: EventName,
  properties: Record<string, unknown> = {},
  userId?: string,
  projectId?: string,
) {
  const event: AnalyticsEvent = {
    name,
    properties,
    userId,
    projectId,
    timestamp: new Date().toISOString(),
  };

  eventBuffer.push(event);

  // Flush if buffer is full
  if (eventBuffer.length >= MAX_BUFFER) {
    flush();
  }

  logger.debug({ event: name, projectId }, "Analytics event tracked");
}

export function getEvents(limit = 100): AnalyticsEvent[] {
  return eventBuffer.slice(-limit);
}

export function flush(): void {
  const count = eventBuffer.length;
  // In production: batch insert to analytics DB
  logger.info({ eventCount: count }, "Analytics buffer flushed");
  eventBuffer.length = 0;
}

// Periodic flush every 60 seconds
setInterval(flush, 60_000);

// ── Event helpers ──
export const analytics = {
  projectCreated(projectId: string, mode: string, userId?: string) {
    track("swarm_project_created", { mode }, userId, projectId);
  },
  simulationStarted(projectId: string, mode: string, userId?: string) {
    track("swarm_simulation_started", { mode }, userId, projectId);
  },
  simulationCompleted(projectId: string, mode: string, duration: number, userId?: string) {
    track("swarm_simulation_completed", { mode, durationMs: duration }, userId, projectId);
  },
  simulationFailed(projectId: string, mode: string, error: string, userId?: string) {
    track("swarm_simulation_failed", { mode, error }, userId, projectId);
  },
  reportViewed(projectId: string, userId?: string) {
    track("swarm_report_viewed", {}, userId, projectId);
  },
  reportExported(projectId: string, format: string, userId?: string) {
    track("swarm_report_exported", { format }, userId, projectId);
  },
  reportShared(projectId: string, userId?: string) {
    track("swarm_report_shared", {}, userId, projectId);
  },
  chatMessageSent(projectId: string, userId?: string) {
    track("swarm_chat_message_sent", {}, userId, projectId);
  },
  agentInterviewed(projectId: string, agentRole: string, userId?: string) {
    track("swarm_agent_interviewed", { agentRole }, userId, projectId);
  },
  errorOccurred(code: string, message: string, projectId?: string) {
    track("swarm_error_occurred", { code, message }, undefined, projectId);
  },
};
