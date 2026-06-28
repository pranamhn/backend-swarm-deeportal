# Swarm Deeportal — Backend

> TypeScript · Express · MySQL · Redis · BullMQ · DeepSeek
> AI Multi-Agent Prediction Engine

---

## Overview

**backend-swarm-deeportal** is the AI prediction and simulation engine for Deeportal.ai. It runs dual-mode swarm simulations — **Social Sentiment** (Twitter/Reddit/Mastodon/Bluesky) and **Investment Prediction** (34 types across 9 categories).

```
backend-swarm-deeportal (Express :5002)
  ├── Social Sentiment Simulation (OASIS Python scripts)
  ├── Investment Prediction Engine (BullMQ workers)
  ├── Knowledge Graph (MySQL + Drizzle ORM)
  ├── Scoring Engine (34 weighted formulas)
  ├── ReACT Report Agent (DeepSeek-powered)
  └── SSE Real-time Streaming
```

---

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, DEEPSEEK_API_KEY, REDIS_URL
npm run dev     # → http://localhost:5002
```

### Environment

```env
DATABASE_URL=mysql://root:password@localhost:3306/deeportal
REDIS_URL=redis://localhost:6379
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_REASONER=deepseek-reasoner
PORT=5002
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20, TypeScript 5 (strict) |
| Framework | Express.js |
| Database | MySQL (Drizzle ORM, 14 tables) |
| Queue | BullMQ + Redis |
| AI | DeepSeek (primary), GPT-4o (fallback) |
| OASIS | Python 3 subprocess (5 simulation scripts) |
| Real-time | SSE (Server-Sent Events) |

---

## API Endpoints (37 total)

### Projects
`POST /api/swarm/projects` `GET /api/swarm/projects` `GET /api/swarm/projects/:id` `PATCH /api/swarm/projects/:id` `DELETE /api/swarm/projects/:id`

### Simulation
`POST /api/swarm/simulation/:id/start` `GET /api/swarm/simulation/:id/status` `GET /api/swarm/simulation/:id/stream` (SSE) `POST /api/swarm/simulation/:id/stop`

### Report & Chat
`GET /api/swarm/report/:id/report` `POST /api/swarm/report/:id/chat`

### Notifications, Share, Export
`GET /api/swarm/notifications` `POST /api/swarm/report/share` `GET /api/swarm/report/share/:token` `GET /api/swarm/report/export/:id/json` `GET /api/swarm/report/export/:id/md`

### Admin, Enterprise, Replay, Playground, Marketplace, Population
`GET/PUT/DELETE /api/swarm/admin/flags` `GET/POST /api/swarm/enterprise/*` `GET /api/swarm/replay/*` `GET/POST /api/swarm/playground/*` `GET/POST /api/swarm/marketplace/*` `GET/POST /api/swarm/population/*`

---

## Prediction Types (34 across 9 categories)

| Category | Types |
|----------|-------|
| 🏢 Startup Intelligence | `funding_signal`, `growth_signal`, `investor_fit`, `mna_signal`, `business_risk` |
| 📊 Market Intelligence | `market_opportunity`, `market_expansion`, `revenue_potential` |
| 🐦 Social Sentiment | `social_sentiment` (+ political, IPO, crisis sub-types) |
| 🏛️ Political Intelligence | `political_risk`, `regulation_impact`, `policy_direction` |
| 💳 Financial Intelligence | `credit_risk`, `financing_eligibility`, `cashflow_health` |
| 👥 HR & Talent | `talent_acquisition`, `retention_risk`, `salary_benchmark`, `team_scalability` |
| ⚖️ Legal & Compliance | `litigation_risk`, `regulatory_fine`, `compliance_gap`, `contract_risk` |
| 👥 Population | `regional_opportunity`, `demand_forecast`, `consumer_segment`, `urbanization_impact` |
| 📜 Legacy Compat | `funding`, `acquisition`, `ipo`, `market_dynamics`, `pricing`, `customer_behavior`, `competitive_response` |

---

## Simulation Platforms (4, all FREE)

| Platform | Script | Protocol |
|----------|--------|----------|
| Twitter/X | `run_twitter_simulation.py` | Internal sim |
| Reddit | `run_reddit_simulation.py` | Internal sim |
| Mastodon | `run_mastodon_simulation.py` | ActivityPub |
| Bluesky | `run_bluesky_simulation.py` | AT Protocol |

---

## Project Structure

```
src/
├── index.ts                    # Express entry (10 route modules)
├── config.ts                   # Centralized config
├── types/swarm.ts              # 34 prediction types, 9 categories
├── lib/
│   ├── validation.ts           # Zod schemas (dual-mode conditional)
│   ├── errors.ts               # AppError, 20+ codes
│   ├── llm.ts                  # DeepSeek + OpenAI fallback
│   ├── feature-flags.ts        # 16 flags + admin API
│   └── analytics.ts            # 11 event types
├── db/
│   ├── schema.ts               # Drizzle ORM, 14 tables
│   └── index.ts                # MySQL connection pool
├── routes/                     # 10 route files
├── services/                   # 17 service files
│   ├── simulation-queue.ts     # BullMQ 7-step pipeline
│   ├── simulation-engine.ts    # Multi-scenario simulation
│   ├── simulation-ipc.ts       # TypeScript ↔ Python IPC
│   ├── scoring-engine.ts       # 34 weighted formulas
│   └── ...                     # +13 more services
└── middleware/
    ├── security.ts             # Rate limiter + auth + sanitization
    └── error-handler.ts        # Structured error responses

scripts/                        # Python OASIS scripts (5 files)
tests/                          # Playwright E2E tests (15 cases)
```

---

## Connected Repos

| Repo | Role | Port |
|------|------|------|
| [frontend-deeportal](https://github.com/pranamhn/frontend-deeportal) | Unified UI | 3000 |
| [backend-deeportal](https://github.com/pranamhn/backend-deeportal) | Company data engine | 8080 |

---

## Documentation

| File | Content |
|------|---------|
| [specification.md](./specification.md) | Full product spec (55 sections) |
| [split-task-repo.md](./split-task-repo.md) | 3-repo architecture + task split |
| [population-data.md](./population-data.md) | Population intelligence spec |
| [shared-types.md](./shared-types.md) | Type sharing across repos |
| [openapi.json](./openapi.json) | API documentation (37 endpoints) |
