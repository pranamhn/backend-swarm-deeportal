import type { ApiError, ApiResponse } from "../types/swarm.js";

// ── Error Codes ──
export const ErrorCode = {
  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_MODE: "INVALID_MODE",
  INVALID_PLATFORM: "INVALID_PLATFORM",
  INVALID_PREDICTION_TYPE: "INVALID_PREDICTION_TYPE",

  // Resource
  NOT_FOUND: "NOT_FOUND",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
  REPORT_NOT_FOUND: "REPORT_NOT_FOUND",

  // Simulation
  SIMULATION_TIMEOUT: "SIMULATION_TIMEOUT",
  SIMULATION_FAILED: "SIMULATION_FAILED",
  OASIS_RUNNER_FAILED: "OASIS_RUNNER_FAILED",
  SOCIAL_SIM_ERROR: "SOCIAL_SIM_ERROR",

  // AI
  EXTRACTION_FAILED: "EXTRACTION_FAILED",
  AGENT_DECISION_FAILED: "AGENT_DECISION_FAILED",
  REPORT_GENERATION_FAILED: "REPORT_GENERATION_FAILED",
  AI_API_ERROR: "AI_API_ERROR",

  // Rate Limiting
  RATE_LIMITED: "RATE_LIMITED",
  CONCURRENCY_LIMIT: "CONCURRENCY_LIMIT",

  // Auth
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",

  // General
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
} as const;

// ── HTTP Status Mapping ──
const statusMap: Record<string, number> = {
  VALIDATION_ERROR: 400,
  INVALID_MODE: 400,
  INVALID_PLATFORM: 400,
  INVALID_PREDICTION_TYPE: 400,
  NOT_FOUND: 404,
  PROJECT_NOT_FOUND: 404,
  REPORT_NOT_FOUND: 404,
  SIMULATION_TIMEOUT: 408,
  SIMULATION_FAILED: 500,
  OASIS_RUNNER_FAILED: 500,
  SOCIAL_SIM_ERROR: 500,
  EXTRACTION_FAILED: 500,
  AGENT_DECISION_FAILED: 500,
  REPORT_GENERATION_FAILED: 500,
  AI_API_ERROR: 502,
  RATE_LIMITED: 429,
  CONCURRENCY_LIMIT: 429,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_ERROR: 500,
  NOT_IMPLEMENTED: 501,
};

// ── AppError ──
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly retryable: boolean;

  constructor(code: string, message: string, details?: Record<string, unknown>, retryable = false) {
    super(message);
    this.code = code;
    this.statusCode = statusMap[code] || 500;
    this.details = details;
    this.retryable = retryable;
    this.name = "AppError";
  }

  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      retryable: this.retryable,
    };
  }

  toResponse(): ApiResponse<never> {
    return {
      success: false,
      error: this.toApiError(),
    };
  }
}

// ── Helpers ──
export function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function errorResponse(code: string, message: string, details?: Record<string, unknown>, retryable = false): ApiResponse<never> {
  return {
    success: false,
    error: { code, message, details, retryable },
  };
}

export function notFound(resource: string, id: string): AppError {
  return new AppError("NOT_FOUND", `${resource} not found: ${id}`, { resource, id });
}

export function validationError(message: string, details?: Record<string, unknown>): AppError {
  return new AppError("VALIDATION_ERROR", message, details);
}

export function simulationTimeout(projectId: string): AppError {
  return new AppError("SIMULATION_TIMEOUT", `Simulation timed out for project ${projectId}. Try a faster mode or simplify inputs.`, { projectId }, true);
}

export function rateLimited(retryAfterMs: number): AppError {
  return new AppError("RATE_LIMITED", `Rate limit exceeded. Retry after ${Math.ceil(retryAfterMs / 1000)}s.`, { retryAfterMs }, true);
}
