/**
 * Swarm Deeportal — End-to-End Test Specs (Playwright)
 *
 * Run: npx playwright test
 * Setup: npm install -D @playwright/test && npx playwright install
 */

import { test, expect } from "@playwright/test";

const API_BASE = "http://localhost:5002/api/swarm";

// ── Health ──
test("GET /health returns OK", async ({ request }) => {
  const resp = await request.get("http://localhost:5002/health");
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(body.status).toBe("ok");
});

// ── Projects CRUD ──
test.describe("Projects API", () => {
  let projectId: string;

  test("POST /projects — create social sentiment project", async ({ request }) => {
    const resp = await request.post(`${API_BASE}/projects`, {
      data: {
        title: "E2E Test — Social Sentiment",
        mode: "social_sentiment",
        subType: "general",
        platforms: ["twitter", "reddit"],
        seedTopics: ["technology", "economy"],
        agentCount: 10,
        loops: 3,
      },
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.data.mode).toBe("social_sentiment");
    projectId = body.data.id;
  });

  test("POST /projects — create investment prediction project", async ({ request }) => {
    const resp = await request.post(`${API_BASE}/projects`, {
      data: {
        title: "E2E Test — Investment Prediction",
        mode: "investment_prediction",
        predictionType: "funding",
        simulationMode: "fast",
        timeHorizon: "6 months",
        agentCount: 5,
        loops: 2,
      },
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.data.mode).toBe("investment_prediction");
  });

  test("POST /projects — political election mode", async ({ request }) => {
    const resp = await request.post(`${API_BASE}/projects`, {
      data: {
        title: "E2E Test — Pilgub Jatim 2027",
        mode: "social_sentiment",
        subType: "political_election",
        electionType: "gubernur",
        region: "Jawa Timur",
        platforms: ["twitter", "reddit"],
        candidates: [
          { name: "Candidate A", party: "PDIP" },
          { name: "Candidate B", party: "Gerindra" },
        ],
        seedTopics: ["ekonomi", "infrastruktur"],
        agentCount: 10,
        loops: 3,
      },
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.data.subType).toBe("political_election");
    expect(body.data.candidates).toHaveLength(2);
  });

  test("POST /projects — validation: social without platforms", async ({ request }) => {
    const resp = await request.post(`${API_BASE}/projects`, {
      data: { title: "Bad Request", mode: "social_sentiment", agentCount: 10, loops: 3 },
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(400);
  });

  test("POST /projects — validation: investment without predictionType", async ({ request }) => {
    const resp = await request.post(`${API_BASE}/projects`, {
      data: { title: "Bad Request", mode: "investment_prediction", agentCount: 10, loops: 3 },
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(400);
  });

  test("GET /projects — list projects", async ({ request }) => {
    const resp = await request.get(`${API_BASE}/projects`, {
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.data.items).toBeDefined();
    expect(body.data.total).toBeGreaterThan(0);
  });

  test("GET /projects?mode=social_sentiment — filter by mode", async ({ request }) => {
    const resp = await request.get(`${API_BASE}/projects?mode=social_sentiment`, {
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    for (const item of body.data.items) {
      expect(item.mode).toBe("social_sentiment");
    }
  });
});

// ── Notifications ──
test.describe("Notifications API", () => {
  test("GET /notifications — returns list", async ({ request }) => {
    const resp = await request.get(`${API_BASE}/notifications`, {
      headers: { "x-user-id": "e2e-test-user" },
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.success).toBe(true);
  });
});

// ── Feature Flags ──
test.describe("Feature Flags API", () => {
  test("GET /admin/flags — list all flags", async ({ request }) => {
    const resp = await request.get(`${API_BASE}/admin/flags`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.data).toHaveLength(16);
  });

  test("PUT /admin/flags/:key — set override", async ({ request }) => {
    const resp = await request.put(`${API_BASE}/admin/flags/SOCIAL_SENTIMENT_MODE`, {
      data: { value: false },
    });
    expect(resp.status()).toBe(200);
  });

  test("DELETE /admin/flags/:key — remove override", async ({ request }) => {
    const resp = await request.delete(`${API_BASE}/admin/flags/SOCIAL_SENTIMENT_MODE`);
    expect(resp.status()).toBe(200);
  });
});

// ── Enterprise ──
test.describe("Enterprise API", () => {
  test("POST /enterprise/costs/estimate — estimate simulation cost", async ({ request }) => {
    const resp = await request.post(`${API_BASE}/enterprise/costs/estimate`, {
      data: { mode: "investment_prediction", agentCount: 20, loops: 10 },
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.data.estimatedCost).toBeGreaterThan(0);
    expect(body.data.estimatedTokens).toBeGreaterThan(0);
  });

  test("PUT /enterprise/scoring/custom/:user — set custom weights", async ({ request }) => {
    const resp = await request.put(`${API_BASE}/enterprise/scoring/custom/test-user`, {
      data: { weights: { "Revenue": 0.4, "Market": 0.3, "Team": 0.3 } },
    });
    expect(resp.status()).toBe(200);
  });

  test("PUT /enterprise/scoring/custom/:user — reject invalid weights", async ({ request }) => {
    const resp = await request.put(`${API_BASE}/enterprise/scoring/custom/test-user`, {
      data: { weights: { "Revenue": 0.9 } }, // doesn't sum to 1.0
    });
    expect(resp.status()).toBe(400);
  });
});

// ── Share Links ──
test.describe("Share & Export API", () => {
  test("POST /report/share — requires valid reportId", async ({ request }) => {
    const resp = await request.post(`${API_BASE}/report/share`, {
      data: { reportId: "00000000-0000-0000-0000-000000000000", expiresInDays: 7 },
    });
    expect(resp.status()).toBe(404);
  });
});
