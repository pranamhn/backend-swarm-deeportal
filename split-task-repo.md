# Deeportal — Split Task by Repository

> How work is divided across the 3 Deeportal repos: responsibilities, engines, data flows, and development ownership.

---

## Repository Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    frontend-deeportal                            │
│                    Next.js 16 · React 19 · Tailwind 4            │
│                    Port 3000                                     │
│                                                                  │
│  Pages: /companies · /investors · /funding · /swarm · /admin    │
│  Role:  Unified UI layer — renders both backends                 │
└──────────────┬──────────────────────────────────┬────────────────┘
               │ /api/* (rewrite)                 │ /v1/swarm/* (proxy)
               ▼                                  ▼
┌──────────────────────────────┐  ┌───────────────────────────────┐
│  backend-deeportal           │  │  backend-swarm-deeportal       │
│  Python · Flask · SQLite     │  │  TypeScript · Express · Redis  │
│  Port 8080                   │  │  Port 5002                     │
│                              │  │                                │
│  Core data engine:           │  │  AI prediction engine:          │
│  • Company directory         │  │  • Social sentiment swarm      │
│  • Ingestion pipelines      │  │  • Investment prediction       │
│  • Admin dashboard API      │  │  • Population simulation       │
│  • WebSocket broadcasts     │  │  • Multi-agent AI orchestration│
│  • LLM enrichment           │  │  • Report generation           │
└──────────────────────────────┘  └───────────────────────────────┘
```

| | backend-deeportal | backend-swarm-deeportal | frontend-deeportal |
|---|---|---|---|
| **Language** | Python 3 | TypeScript 5 | TypeScript 5 |
| **Framework** | Flask | Express.js | Next.js 16 |
| **Database** | SQLite (file-based) | PostgreSQL + pgvector | — |
| **Queue/Cache** | — | Redis + BullMQ | — |
| **AI** | DeepSeek, Claude, Codex | DeepSeek (primary), GPT-4o | — |
| **Port** | 8080 | 5002 | 3000 |
| **Package** | requirements.txt | package.json | package.json |

---

## 1. backend-deeportal (Python/Flask)

### Core Engine
**Company Data Engine** — the source of truth for all Deeportal entity data.

### Responsibilities

| Layer | What It Does |
|-------|-------------|
| **Ingestion** | Scrapes/publicly sources SEA startup data (companies, investors, funding rounds, news, founders) |
| **Enrichment** | AI-powered LangGraph pipelines (DeepSeek, Claude, Codex) to enrich raw data |
| **Directory API** | `/api/v1/companies`, `/api/v1/investors`, `/api/v1/funding`, `/api/v1/search` |
| **Admin API** | `/api/v1/admin/*` — data quality, duplicates, moderation, ingestion monitoring |
| **WebSocket** | Broadcasts `ingest-complete` events to connected frontends |
| **Population API** | `/api/v1/population/*` — region demographics, ranking, segment builder |
| **Auth** | Session-based admin auth with role hierarchy (viewer/reviewer/operator/admin) |

### Key Files

```
orchestrator/
  webapp.py                    # Flask app, admin routes, WebSocket
  routes/
    api_routes.py              # Public API (/companies, /investors, etc.)
    population_routes.py       # Population Intelligence API 🆕
  services/                    # Company, investor, list, trend services
  agent/                       # LLM agent infrastructure (Claude, DeepSeek)
  config.py                    # Environment-based settings

holdco/
  db.py                        # SQLite schema + connection (SCHEMA_VERSION=5)
  population_schema.py         # Population DB schema (8 tables) 🆕
  population_quality.py        # Data quality scoring 🆕
  population_ranking.py        # Region ranking algorithm 🆕
  ingest.py                    # Ingestion loop
  pipelines.py                 # Multi-source data pipelines
```

### When to Add Code Here
- New company/investor/funding data models
- New ingestion sources
- Admin dashboard features
- Population data endpoints
- Search/filter improvements
- WebSocket events

---

## 2. backend-swarm-deeportal (TypeScript/Express)

### Core Engine
**AI Prediction & Simulation Engine** — dual-mode swarm intelligence for social sentiment and investment prediction.

### Responsibilities

| Layer | What It Does |
|-------|-------------|
| **Prediction Engine** | 34 types across 9 categories (funding, acquisition, IPO, market, political, HR, legal, population, social) |
| **Social Simulation** | OASIS-style Twitter/Reddit/Mastodon/Bluesky agent simulation (Python subprocesses) |
| **Investment Simulation** | BullMQ workers for business scenario simulation (optimistic/neutral/pessimistic) |
| **Knowledge Graph** | PostgreSQL + pgvector for entity extraction + relationship building |
| **Scoring Engine** | Weighted formulas per prediction type with causal chain tracing |
| **Report Generation** | ReACT-style AI report agent (Plan → Query → Reflect → Write) |
| **SSE Streaming** | Real-time simulation progress via Server-Sent Events |
| **Feature Flags** | 16 feature flags with env var + runtime overrides |
| **Analytics** | 11 event types, buffer + flush |

### Key Files

```
src/
  index.ts                     # Express entry point (10 route modules)
  types/swarm.ts               # 34 prediction types, 9 categories
  lib/
    validation.ts              # Zod schemas (dual-mode conditional)
    errors.ts                  # AppError class, 20+ error codes
    llm.ts                     # DeepSeek client + OpenAI fallback
    feature-flags.ts           # 16 feature flags
    analytics.ts               # 11 event types
  db/
    schema.ts                  # Drizzle ORM — 14 tables
  routes/
    projects.ts                # CRUD projects (dual-mode)
    simulation.ts              # Start/stop/status + SSE stream
    report.ts                  # Report + chat
    notifications.ts           # Notifications + share + export
    admin.ts                   # Feature flags management
    enterprise.ts              # Cost tracking + custom scoring
    replay.ts                  # Simulation playback
    playground.ts              # Agent playground (test personas, signals)
    marketplace.ts             # Prediction marketplace
    population.ts              # Population swarm API 🆕
  services/
    simulation-queue.ts        # BullMQ worker (7-step pipeline)
    simulation-engine.ts       # Multi-scenario simulation
    simulation-ipc.ts          # TypeScript ↔ Python IPC
    ontology-generator.ts      # LLM-powered ontology design
    graph-builder.ts           # Knowledge graph builder
    agent-generator.ts         # Persona generator (political, social, investment)
    report-generator.ts        # ReACT-style report
    scoring-engine.ts          # 34 weighted formulas
    population-agents.ts       # Synthetic population agents 🆕
    population-simulation.ts   # Population swarm simulation 🆕
    population-integration.ts  # Population → prediction enrichment 🆕
    market-engine.ts           # Multi-market parallel execution
    multilang.ts               # 7-language post generation
    persona-packs.ts           # 4 pre-built persona packs
    cost-tracking.ts           # Token usage + cost per project
    combined-pipeline.ts       # Auto social after investment
    webhook.ts                 # Webhook notifications
    audit-log.ts               # 14 audit action types
  middleware/
    security.ts                # Rate limiter + auth + sanitization
    error-handler.ts           # Structured error responses

scripts/
  run_twitter_simulation.py    # Twitter/X agent simulation
  run_reddit_simulation.py     # Reddit agent simulation
  run_mastodon_simulation.py   # Mastodon simulation 🆕
  run_bluesky_simulation.py    # Bluesky simulation 🆕
  run_parallel_simulation.py   # 4-platform parallel runner

tests/
  e2e.spec.ts                  # 15 Playwright test cases
```

### When to Add Code Here
- New prediction types or scoring formulas
- New simulation modes (platform expansion)
- New agent persona packs
- API endpoints for predictions
- SSE streaming improvements
- AI provider changes
- Report generation logic

---

## 3. frontend-deeportal (Next.js/React)

### Core Engine
**Unified UI Layer** — renders both backends into a single user experience.

### Responsibilities

| Layer | What It Does |
|-------|-------------|
| **Public Pages** | /companies, /investors, /funding, /acquisitions, /community, /search |
| **Swarm Pages** | /swarm, /swarm/new, /swarm/[id], /swarm/playground, /swarm/marketplace 🆕 |
| **Population Pages** | /population, /population/[regionCode], /population/segment 🆕 |
| **Admin Dashboard** | /admin/* — Next.js UI calling Flask admin API |
| **API Proxy** | next.config.js rewrites `/api/*` → Flask `127.0.0.1:8080` |
| **Swarm Proxy** | `/v1/swarm/*` → Express `127.0.0.1:5002` |
| **WebSocket** | socket.io-client for real-time ingestion updates |

### Key Files

```
app/(marketing)/
  companies/                   # Company directory
  investors/                   # Investor directory
  funding/                     # Funding rounds
  swarm/                       # Swarm Deeportal UI
    page.tsx                   # Dashboard (dual-mode cards)
    new/page.tsx               # New prediction form
    [projectId]/page.tsx       # Progress → Report
    playground/page.tsx        # Agent playground 🆕
    marketplace/page.tsx       # Prediction marketplace 🆕
  population/                  # Population Intelligence UI 🆕
    page.tsx                   # Dashboard (region cards)
    [regionCode]/page.tsx      # Region profile
    segment/page.tsx           # Segment builder
  admin/                       # Admin dashboard

components/
  ui/                          # Shared primitives (Button, Card, Badge, Input, etc.)
  swarm/                       # Swarm-specific components
    ModeSelector.tsx           # Dual-mode toggle
    NewSwarmForm.tsx           # Mode-aware prediction form
    SimulationProgress.tsx     # SSE-powered progress
    SwarmReportView.tsx        # Tabbed report
    SwarmScoreCard.tsx         # Score display

lib/api/
  client.ts                    # Axios instance (proxy-aware)
  swarmService.ts              # Swarm API functions
  populationService.ts         # Population API functions 🆕

types/
  swarm.ts                     # Swarm entity types
  population.ts                # Population entity types 🆕

public/
  swarm-manifest.json          # PWA manifest
```

### When to Add Code Here
- New public pages or sections
- New prediction form fields
- UI for new prediction types
- Admin dashboard improvements
- Chart/visualization components
- Any user-facing feature

---

## Data Flow

### Request Flow: User visits /swarm
```
Browser → Next.js :3000 → /v1/swarm/projects → Express :5002 → PostgreSQL
```

### Request Flow: User visits /companies
```
Browser → Next.js :3000 → /api/v1/companies (rewrite) → Flask :8080 → SQLite
```

### Real-time Flow: Ingestion complete
```
Flask :8080 → WebSocket broadcast → Next.js :3000 (socket.io-client) → Admin UI refresh
```

### Simulation Flow: User starts prediction
```
Browser → POST /v1/swarm/simulation/:id/start → Express :5002 → BullMQ queue
→ Worker: ontology → extraction → graph → agents → simulation → scoring → report
→ SSE stream → Browser (real-time progress)
```

### Population Flow: User builds segment
```
Browser → POST /api/v1/population/segment/build → Next.js rewrite → Flask :8080 → SQLite
```

---

## Development Ownership

| Feature Area | Primary Repo | Secondary Repo |
|-------------|-------------|----------------|
| Company data + ingestion | backend-deeportal | — |
| Company directory UI | frontend-deeportal | — |
| Admin dashboard | frontend-deeportal | backend-deeportal (API) |
| Swarm predictions | backend-swarm-deeportal | frontend-deeportal (UI) |
| Social simulation | backend-swarm-deeportal | — |
| Scoring + reports | backend-swarm-deeportal | — |
| Population data | backend-deeportal | backend-swarm-deeportal (sim) |
| Population UI | frontend-deeportal | — |
| Search + filters | backend-deeportal | frontend-deeportal |
| Auth | backend-deeportal | frontend-deeportal |
| AI/LLM | backend-deeportal + backend-swarm-deeportal | — |

---

## Quick Reference: Where to Add What

```
"I want to add a new prediction type..."
  → backend-swarm-deeportal: src/types/swarm.ts + src/services/scoring-engine.ts
  → frontend-deeportal: components/swarm/NewSwarmForm.tsx

"I want to scrape a new data source..."
  → backend-deeportal: holdco/pipelines.py or new pipeline file

"I want to add a new page..."
  → frontend-deeportal: app/(marketing)/<page>/page.tsx

"I want to change the AI model..."
  → backend-swarm-deeportal: src/lib/llm.ts
  → backend-deeportal: orchestrator/agent/

"I want to add a population metric..."
  → backend-deeportal: holdco/population_schema.py + orchestrator/routes/population_routes.py
  → frontend-deeportal: types/population.ts + app/(marketing)/population/

"I want to add a social platform..."
  → backend-swarm-deeportal: scripts/run_<platform>_simulation.py + src/types/swarm.ts
```
