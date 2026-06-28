# Predict Deeportal — Product Plan & Mode Selection

## 1. Product Vision

**Predict Deeportal** adalah modul intelligence di dalam Deeportal.ai yang membantu user memprediksi peluang, risiko, momentum, dan skenario strategis berdasarkan data company, market, social sentiment, funding, investor, berita, regulasi, dan sinyal publik.

Positioning utama:

> **Deeportal predicts startup growth, funding opportunity, investor fit, acquisition potential, market momentum, political risk, and public sentiment across Indonesia and Asia.**

Predict Deeportal bukan hanya database seperti Crunchbase, tetapi **decision intelligence platform** yang menggabungkan:

- Company intelligence
- Investor intelligence
- Market intelligence
- Social sentiment
- Political & regulatory signal
- Multi-agent simulation
- Scenario prediction

---

## 2. Core Concept

User memilih mode prediction, memasukkan company / sector / market / issue / scenario, lalu Deeportal menjalankan analisis berbasis data dan simulasi.

### Basic Flow

```text
User Input
  ↓
Data Collection
  ↓
Entity Extraction
  ↓
Signal Detection
  ↓
Knowledge Graph
  ↓
Prediction Model / AI Agent Simulation
  ↓
Scoring Engine
  ↓
Report + Recommendation
```

### Example Input

```text
Predict apakah startup EV rental di Indonesia bisa raise funding dalam 12 bulan ke depan.
```

### Example Output

```text
Funding Probability: 72%
Growth Signal: High
Market Momentum: Rising
Investor Fit: Strong
Political / Regulatory Risk: Medium
Recommended Action: Prepare Pre-Series A fundraising within 3-6 months.
```

---

## 3. Mode Selection Structure

```text
Predict Deeportal
│
├─ Startup & Company Intelligence
│  ├─ 🏢 Growth Signal
│  ├─ 💼 Funding Signal
│  ├─ 🧲 Investor Fit
│  ├─ 🤝 M&A Signal
│  ├─ 💵 Valuation Signal
│  ├─ ⚠️ Business Risk Signal
│  └─ 📉 Failure / Shutdown Risk
│
├─ Market Intelligence
│  ├─ 📈 Market Opportunity
│  ├─ 🔥 Trend Signal
│  ├─ 🌏 Market Expansion
│  ├─ 🧬 Similar Startup
│  └─ 💰 Revenue Potential
│
├─ Social & Public Sentiment
│  ├─ 🐦 Social Sentiment
│  ├─ 🗣️ Public Opinion Signal
│  ├─ 📣 Brand / Founder Reputation
│  └─ 📰 Media Sentiment
│
├─ Political & Policy Intelligence
│  ├─ 🏛️ Political Risk Signal
│  ├─ 🗳️ Election Sentiment
│  ├─ 📜 Regulation Impact
│  ├─ 🧭 Policy Direction
│  ├─ 🌐 Geopolitical Risk
│  └─ 🏙️ Regional Stability Signal
│
├─ Financial & Credit Intelligence
│  ├─ 🏦 Credit Risk
│  ├─ 💳 Financing Eligibility
│  ├─ 🧾 Cashflow Health
│  └─ 💸 Default Risk
│
└─ Scenario Simulation
   ├─ 🧠 Strategic Scenario Simulation
   ├─ 🧪 What-if Simulation
   ├─ 🧩 Multi-Agent Market Simulation
   └─ 🔀 Scenario Comparison
```

---

## 4. Recommended MVP Mode

Untuk MVP, jangan langsung terlalu banyak. Gunakan 8 mode utama yang paling valuable.

```text
MVP Mode Selection
│
├─ 💼 Funding Signal
├─ 🏢 Growth Signal
├─ 🧲 Investor Fit
├─ 🤝 M&A Signal
├─ 📈 Market Opportunity
├─ 🐦 Social Sentiment
├─ 🏛️ Political Risk Signal
└─ ⚠️ Business Risk Signal
```

Kenapa 8 mode ini cocok untuk MVP:

- Mudah dipahami oleh user bisnis
- Relevan untuk startup, investor, corporate, dan government relation
- Bisa menggunakan data publik dan data internal
- Bisa dikembangkan bertahap menjadi prediction engine yang lebih kompleks

---

# 5. Prediction Modes Detail

## 5.1 💼 Funding Signal

### Purpose

Memprediksi peluang sebuah startup/company mendapatkan pendanaan.

### User Question

```text
Apakah company ini punya peluang raise funding dalam 6-12 bulan?
```

### Input Data

- Company profile
- Founder background
- Revenue / traction
- Funding history
- Market category
- Investor activity
- Competitor funding
- News and media mention
- Social sentiment
- Macro market condition

### Output

```text
Funding Probability: 72%
Best Stage: Pre-Series A
Investor Type: Early-stage VC, Corporate VC
Confidence: Medium-High
```

### Key Scores

| Metric | Description |
|---|---|
| Funding Probability | Kemungkinan mendapatkan funding |
| Investor Interest | Potensi menarik minat investor |
| Sector Momentum | Apakah sektor sedang naik |
| Founder Signal | Kualitas founder dan track record |
| Traction Signal | Pertumbuhan revenue/user/customer |

---

## 5.2 🏢 Growth Signal

### Purpose

Memprediksi potensi pertumbuhan company dalam periode tertentu.

### User Question

```text
Apakah startup ini bisa tumbuh 2x dalam 12 bulan?
```

### Input Data

- Revenue growth
- User growth
- Hiring signal
- Market demand
- Funding status
- Product expansion
- Partnership
- Geographic expansion
- Customer review
- Social activity

### Output

```text
Growth Potential: High
12-Month Growth Estimate: 2.1x - 2.8x
Main Growth Driver: Demand growth + recurring revenue
Main Weakness: Operational scalability
```

---

## 5.3 🧲 Investor Fit

### Purpose

Memprediksi investor mana yang paling cocok dengan startup/company.

### User Question

```text
Investor mana yang paling cocok untuk company ini?
```

### Input Data

- Company sector
- Stage
- Geography
- Ticket size
- Business model
- Investor portfolio
- Investor thesis
- Past investment
- Follow-on behavior

### Output

```text
Best Investor Match:
1. East Ventures
2. AC Ventures
3. Alpha JWC
4. Corporate Venture Telco
5. Regional Climate Fund
```

### Matching Logic

```text
Investor Fit Score =
Sector Match
+ Stage Match
+ Geography Match
+ Ticket Size Match
+ Portfolio Similarity
+ Investment Timing
+ Strategic Relevance
```

---

## 5.4 🤝 M&A Signal

### Purpose

Memprediksi potensi sebuah company menjadi target akuisisi atau melakukan akuisisi.

### User Question

```text
Apakah company ini potensial diakuisisi?
```

### Input Data

- Company profile
- Revenue / traction
- Technology asset
- Customer base
- Strategic position
- Competitor landscape
- Corporate buyer activity
- Funding pressure
- Market consolidation trend

### Output

```text
Acquisition Potential: Medium-High
Possible Buyer Type:
- Telco
- Fintech
- Logistics group
- Marketplace
- Regional holding company
```

---

## 5.5 💵 Valuation Signal

### Purpose

Memprediksi indikasi valuasi company berdasarkan market comparable dan performance signal.

### User Question

```text
Berapa estimasi valuation range company ini?
```

### Input Data

- Revenue
- GMV
- ARR/MRR
- Growth rate
- Funding stage
- Comparable companies
- Sector multiple
- Profitability
- Market timing
- Investor sentiment

### Output

```text
Estimated Valuation Range: USD 8M - 12M
Comparable Multiple: 4x - 6x Revenue
Confidence: Medium
```

### Important Note

Valuation signal harus dianggap sebagai **indikasi**, bukan angka pasti.

```text
This valuation range is an indicative estimate based on available signals and comparable companies, not a formal valuation.
```

---

## 5.6 ⚠️ Business Risk Signal

### Purpose

Memprediksi risiko bisnis dari company/startup.

### User Question

```text
Apa risiko utama company ini?
```

### Input Data

- Business model
- Revenue concentration
- Cash runway
- Founder dependency
- Regulatory exposure
- Competition
- Unit economics
- Customer churn
- Operational complexity
- Public sentiment

### Output

```text
Risk Level: Medium
Main Risks:
- Cash runway pressure
- Weak defensibility
- High operational dependency
- Regulatory uncertainty
```

---

## 5.7 📉 Failure / Shutdown Risk

### Purpose

Memprediksi kemungkinan startup menjadi dormant, gagal scale, pivot ekstrem, atau shutdown.

### User Question

```text
Apakah startup ini berisiko gagal dalam 12-24 bulan?
```

### Input Data

- Funding gap
- Hiring slowdown
- Low media activity
- Social inactivity
- Negative reviews
- Declining web traffic
- Founder changes
- Layoff signal
- Bad unit economics
- Debt pressure

### Output

```text
Shutdown Risk: Medium
Dormant Signal: High
Primary Warning: Declining hiring + weak public activity + funding gap
```

---

## 5.8 📈 Market Opportunity

### Purpose

Memprediksi peluang market untuk sector, region, atau business model tertentu.

### User Question

```text
Apakah market EV rental di Indonesia masih menarik?
```

### Input Data

- Market size
- Growth trend
- Competitor activity
- Funding activity
- Regulation
- Consumer demand
- Search trend
- Social sentiment
- Macro economy
- Technology adoption

### Output

```text
Market Opportunity: High
Timing: Good
Competition: Medium
Recommended Entry: Jakarta, Bandung, Surabaya
```

---

## 5.9 🔥 Trend Signal

### Purpose

Memprediksi tren sektor, kategori, atau tema yang akan naik.

### User Question

```text
Sektor startup apa yang akan naik dalam 12 bulan?
```

### Input Data

- News trend
- Funding trend
- Social conversation
- Search trend
- Government policy
- Corporate activity
- Technology adoption
- Global trend
- Local market adaptation

### Output

```text
Rising Trend:
1. Climate fintech
2. EV fleet infrastructure
3. AI business automation
4. Healthcare affordability
5. SME credit infrastructure
```

---

## 5.10 🌏 Market Expansion

### Purpose

Memprediksi market, kota, atau negara mana yang cocok untuk ekspansi.

### User Question

```text
Company ini cocok ekspansi ke kota/negara mana?
```

### Input Data

- Existing customer profile
- Market similarity
- Demand signal
- Regulation
- Logistics readiness
- Competition
- Pricing power
- Local partner availability
- Payment behavior

### Output

```text
Best Expansion Market:
1. Jakarta
2. Bandung
3. Surabaya
4. Medan
5. Makassar
```

---

## 5.11 🐦 Social Sentiment

### Purpose

Memprediksi persepsi publik terhadap company, founder, brand, sector, atau isu tertentu.

### User Question

```text
Bagaimana sentiment publik terhadap company ini?
```

### Input Data

- Twitter/X
- LinkedIn
- Instagram
- TikTok
- Reddit / forum
- News comment
- App review
- Google review
- Media mention
- Influencer mention

### Output

```text
Public Sentiment: Positive
Positive: 64%
Neutral: 25%
Negative: 11%
Main Topic: Pricing, trust, product quality
```

---

## 5.12 🗣️ Public Opinion Signal

### Purpose

Memprediksi arah opini publik terhadap kebijakan, campaign, isu sosial, regulasi, atau brand movement.

### User Question

```text
Apakah publik akan menerima kebijakan ini?
```

### Input Data

- Social media
- News coverage
- Polling
- Forum/community
- Demographic segmentation
- Regional sentiment
- Historical reaction pattern

### Output

```text
Public Acceptance: Medium
Support: 48%
Reject: 34%
Undecided: 18%
Main Objection: Cost burden and unclear implementation
```

---

# 6. Political & Policy Prediction

Political prediction perlu dibuat hati-hati. Deeportal sebaiknya tidak mengklaim hasil pasti, tetapi memberikan **signal, scenario, probability range, dan risk assessment**.

## 6.1 🏛️ Political Risk Signal

### Purpose

Memprediksi risiko politik terhadap company, sector, market, atau investment.

### User Question

```text
Apa risiko politik terhadap sektor EV, fintech, mining, healthcare, atau logistics?
```

### Input Data

- Government policy
- Regulation draft
- Parliamentary discussion
- Political party statement
- Ministry statement
- Regional government policy
- Lobbying activity
- Public sentiment
- Election cycle
- News sentiment
- Legal cases
- Policy history

### Output

```text
Political Risk: Medium-High
Main Risk:
- Regulatory uncertainty
- Licensing change
- Subsidy policy shift
- Regional policy inconsistency

Impact:
- Higher compliance cost
- Delayed expansion
- Lower investor confidence
```

### Key Scores

| Metric | Description |
|---|---|
| Political Risk Score | Risiko politik keseluruhan |
| Regulatory Volatility | Seberapa sering aturan berubah |
| Policy Support | Tingkat dukungan pemerintah |
| Public Pressure | Tekanan opini publik |
| Election Sensitivity | Sensitivitas terhadap siklus pemilu |
| Stakeholder Conflict | Konflik antar stakeholder |

---

## 6.2 🗳️ Election Sentiment

### Purpose

Membaca arah sentiment publik terhadap kandidat, partai, program, atau isu pemilu.

### User Question

```text
Bagaimana sentiment publik terhadap kandidat atau isu ini?
```

### Input Data

- Polling resmi
- Social media sentiment
- Media coverage
- Debate performance
- Regional sentiment
- Demographic segment
- Influencer / opinion leader
- Historical voting behavior
- Campaign activity
- Issue ownership

### Output

```text
Election Sentiment:
Candidate A: Positive 52%, Negative 23%, Neutral 25%
Candidate B: Positive 41%, Negative 31%, Neutral 28%

Momentum:
Candidate A is gaining positive sentiment in urban voters.
```

### Recommended Features

- Candidate comparison
- Issue sentiment
- Regional heatmap
- Sentiment timeline
- Debate impact analysis
- Campaign message testing

### Important Guardrail

Output harus berupa **sentiment dan scenario**, bukan klaim kepastian hasil pemilu.

```text
This is a sentiment and signal analysis, not an official election forecast.
```

---

## 6.3 📜 Regulation Impact

### Purpose

Memprediksi dampak regulasi baru terhadap company, sector, atau investor.

### User Question

```text
Kalau regulasi ini disahkan, dampaknya ke startup fintech apa?
```

### Input Data

- Draft regulation
- Existing regulation
- Ministry statement
- Industry association response
- Legal analysis
- Company exposure
- Comparable regulation from other markets
- Public reaction
- Investor reaction

### Output

```text
Regulation Impact: High
Affected Sector: Fintech lending
Impact Type:
- Compliance cost increase
- Tighter licensing
- Lower risk appetite
- Market consolidation

Recommended Action:
- Prepare compliance roadmap
- Review license exposure
- Strengthen reporting and risk control
```

---

## 6.4 🧭 Policy Direction

### Purpose

Memprediksi arah kebijakan pemerintah terhadap sektor tertentu.

### User Question

```text
Arah kebijakan pemerintah terhadap AI, EV, fintech, kesehatan, energi, atau transportasi akan ke mana?
```

### Input Data

- Public speech
- Ministry roadmap
- Budget allocation
- Regulation pipeline
- National strategic project
- Political promise
- Party platform
- International agreement
- Lobbying signal
- Industry consultation

### Output

```text
Policy Direction: Supportive but more regulated
Likely Policy Movement:
- More licensing
- Stronger compliance
- Incentive for local players
- Data governance requirement
```

### Scenario Format

```text
Base Case:
Government supports sector growth but increases compliance.

Bull Case:
More incentives and public-private partnership.

Bear Case:
Regulatory tightening slows market entry.
```

---

## 6.5 🌐 Geopolitical Risk

### Purpose

Memprediksi dampak geopolitik terhadap market, supply chain, investment, dan sector.

### User Question

```text
Bagaimana risiko geopolitik terhadap supply chain EV battery?
```

### Input Data

- Trade policy
- Export restriction
- Import dependency
- Commodity price
- Diplomatic relation
- Regional conflict
- Sanction risk
- Currency movement
- Strategic commodity policy

### Output

```text
Geopolitical Risk: Medium
Main Exposure:
- Battery component import
- Nickel price volatility
- China supply chain dependency
- Export policy uncertainty
```

---

## 6.6 🏙️ Regional Stability Signal

### Purpose

Memprediksi stabilitas daerah untuk ekspansi bisnis atau investment.

### User Question

```text
Apakah kota/provinsi ini aman untuk ekspansi bisnis?
```

### Input Data

- Local government policy
- Regional election
- Infrastructure readiness
- Labor issue
- Crime data
- Protest activity
- Business licensing
- Local economic growth
- Local sentiment
- Logistics readiness

### Output

```text
Regional Stability: Medium-High
Expansion Readiness: Good
Main Risk:
- Local licensing delay
- Regional election uncertainty
- Infrastructure bottleneck
```

---

# 7. Scenario Simulation Mode

## 7.1 🧠 Strategic Scenario Simulation

### Purpose

Mensimulasikan dampak keputusan strategis.

### User Question

```text
Kalau startup ini raise funding USD 5 juta, masuk Surabaya, dan turunkan harga 10%, apa dampaknya?
```

### Simulation Inputs

- Decision variable
- Market condition
- Company baseline
- Competitor reaction
- Customer behavior
- Regulatory condition
- Funding availability
- Operational capacity

### Output

```text
Scenario Result:
- Growth potential increases from 2.1x to 3.0x
- Cash burn increases 35%
- Payback period extends to 18 months
- Competitive pressure increases
- Best scenario if expansion is phased
```

---

## 7.2 🧪 What-if Simulation

### Purpose

Membandingkan beberapa scenario.

### Example

```text
Scenario A: Raise funding now
Scenario B: Bootstrap for 12 months
Scenario C: Merge with competitor
```

### Output

| Scenario | Growth | Risk | Funding Need | Recommendation |
|---|---:|---:|---:|---|
| A. Raise Now | High | Medium | High | Good if investor fit is strong |
| B. Bootstrap | Medium | Low | Low | Good if margin is healthy |
| C. Merge | High | High | Medium | Good if integration risk is manageable |

---

## 7.3 🧩 Multi-Agent Market Simulation

### Purpose

Mensimulasikan beberapa aktor dalam market.

### Agents

```text
- Founder
- Investor
- Customer
- Competitor
- Regulator
- Media
- Corporate buyer
- Public opinion group
```

### Loop

```text
For each timestep:
  1. Update market condition
  2. Each agent reviews new information
  3. Each agent takes action
  4. System updates market state
  5. Prediction score is recalculated
```

---

# 8. Data Sources

## 8.1 Public Data

```text
- Company website
- LinkedIn
- Crunchbase-like database
- News media
- Press release
- Government regulation
- Ministry website
- Court/legal information where available
- Social media
- App review
- Job posting
- Investor portfolio
- Public financial report
```

## 8.2 Internal Deeportal Data

```text
- Company profile database
- Founder database
- Funding database
- Investor database
- M&A database
- Sector taxonomy
- Historical market signal
- User saved company list
- Uploaded documents
```

## 8.3 Political & Policy Data

```text
- Regulation draft
- Government statement
- Parliamentary agenda
- Ministry roadmap
- Election polling
- Party platform
- Regional government policy
- Public consultation documents
- News sentiment
- Social sentiment
```

## 8.4 Alternative Data

```text
- Web traffic estimate
- Hiring growth
- App ranking
- App review velocity
- Social follower growth
- Search trend
- Product review
- Community activity
- Partnership announcement
```

---

# 9. Scoring Framework

## 9.1 Universal Prediction Score

Every mode should produce these base outputs:

```text
Prediction Score: 0-100
Confidence Level: Low / Medium / High
Time Horizon: 3 / 6 / 12 / 24 months
Main Drivers
Main Risks
Recommended Action
Data Quality Score
```

## 9.2 Score Components

```text
Final Prediction Score =
Data Quality Score
+ Signal Strength
+ Historical Pattern Match
+ Market Momentum
+ Agent Simulation Output
+ Risk Adjustment
```

## 9.3 Confidence Level

| Confidence | Meaning |
|---|---|
| High | Data cukup banyak, sinyal konsisten, historical pattern kuat |
| Medium | Data cukup, tetapi ada mixed signal |
| Low | Data terbatas, sinyal lemah, atau banyak asumsi |

---

# 10. Output Format

## 10.1 Prediction Card

```text
┌────────────────────────────────────┐
│ Deeportal Prediction               │
├────────────────────────────────────┤
│ Mode: Funding Signal               │
│ Score: 72 / 100                    │
│ Confidence: Medium-High            │
│ Time Horizon: 12 months            │
│ Status: Promising                  │
├────────────────────────────────────┤
│ Main Drivers:                      │
│ - Strong market momentum           │
│ - Founder background               │
│ - Early traction                   │
│                                    │
│ Main Risks:                        │
│ - Cash burn                        │
│ - Competitive pressure             │
│ - Regulatory uncertainty           │
└────────────────────────────────────┘
```

## 10.2 Report Sections

```text
1. Executive Summary
2. Prediction Score
3. Key Signals
4. Risk Factors
5. Scenario Analysis
6. Comparable Companies / Cases
7. Recommendation
8. Data Sources
9. Confidence & Limitation
```

---

# 11. UI / UX Plan

## 11.1 Mode Selection UI

```text
[Predict Deeportal]

What do you want to predict?

Startup & Company
[Funding Signal] [Growth Signal] [Investor Fit] [M&A Signal]

Market
[Market Opportunity] [Trend Signal] [Expansion Signal]

Social
[Social Sentiment] [Media Sentiment] [Public Opinion]

Politics & Policy
[Political Risk] [Election Sentiment] [Regulation Impact] [Policy Direction]

Simulation
[What-if Simulation] [Multi-Agent Simulation]
```

## 11.2 Input Form

Each prediction mode should have:

```text
- Target company / sector / issue
- Geography
- Time horizon
- Data source option
- Scenario assumptions
- Output preference
```

### Example Input Form

```text
Mode: Political Risk Signal

Target Sector:
[EV / Fintech / Healthcare / Logistics / Energy / Other]

Geography:
[Indonesia / Southeast Asia / City / Province]

Time Horizon:
[3 months / 6 months / 12 months / 24 months]

Main Question:
[What do you want to predict?]

Data:
[Use Deeportal data] [Upload document] [Add URL] [Manual input]
```

---

# 12. Technical Architecture

## 12.1 Backend Modules

```text
predict-service
│
├─ input-parser
├─ data-collector
├─ entity-extractor
├─ signal-detector
├─ knowledge-graph-builder
├─ scoring-engine
├─ agent-simulation-engine
├─ scenario-engine
├─ report-generator
└─ audit-log
```

## 12.2 Database Tables

```sql
prediction_projects
- id
- user_id
- title
- mode
- target_entity
- geography
- time_horizon
- status
- created_at

prediction_runs
- id
- project_id
- mode
- input_payload
- output_payload
- score
- confidence
- status
- created_at

prediction_signals
- id
- run_id
- signal_type
- signal_name
- signal_value
- weight
- confidence
- source

prediction_sources
- id
- run_id
- source_type
- source_name
- source_url
- extracted_text
- confidence

prediction_agents
- id
- run_id
- agent_role
- persona
- goal
- behavior_model
- memory

prediction_snapshots
- id
- run_id
- timestep
- state_payload
- score_payload

prediction_reports
- id
- run_id
- title
- summary
- markdown_report
- pdf_url
```

---

# 13. API Design

## 13.1 Create Prediction

```http
POST /api/predict/runs
```

### Request

```json
{
  "mode": "funding_signal",
  "target": "Example Startup",
  "geography": "Indonesia",
  "time_horizon": "12_months",
  "question": "Can this company raise funding in the next 12 months?",
  "data_sources": ["deeportal_db", "news", "social", "uploaded_docs"]
}
```

### Response

```json
{
  "run_id": "pred_123",
  "status": "queued"
}
```

---

## 13.2 Get Prediction Result

```http
GET /api/predict/runs/{run_id}
```

### Response

```json
{
  "run_id": "pred_123",
  "mode": "funding_signal",
  "score": 72,
  "confidence": "medium_high",
  "summary": "This company has a strong funding signal.",
  "drivers": [
    "Strong market momentum",
    "Founder background",
    "Early traction"
  ],
  "risks": [
    "Cash burn",
    "Competition",
    "Regulatory uncertainty"
  ],
  "recommendation": "Prepare Pre-Series A fundraising within 3-6 months."
}
```

---

## 13.3 Run Scenario Simulation

```http
POST /api/predict/scenarios
```

### Request

```json
{
  "target": "Example Startup",
  "base_mode": "growth_signal",
  "scenarios": [
    {
      "name": "Raise USD 5M",
      "assumptions": {
        "funding": 5000000,
        "expansion": "Surabaya",
        "price_change": -10
      }
    },
    {
      "name": "Bootstrap",
      "assumptions": {
        "funding": 0,
        "expansion": "Jakarta only",
        "price_change": 0
      }
    }
  ]
}
```

---

# 14. Ethical Guardrails

## 14.1 General Guardrails

Predict Deeportal should always show:

```text
- This is a prediction based on available data, not a guaranteed outcome.
- Confidence depends on data quality.
- Prediction should support decision-making, not replace human judgment.
```

## 14.2 Political Prediction Guardrails

Political prediction must be framed carefully:

```text
Allowed:
- Political risk analysis
- Policy impact analysis
- Regulation scenario
- Public sentiment reading
- Election sentiment from public data
- Regional stability signal
- Geopolitical risk

Avoid:
- Claiming exact election results as certainty
- Manipulative voter targeting
- Disinformation generation
- Individual voter profiling
- Suppression strategy
- Sensitive personal attribute inference
```

## 14.3 Recommended Disclaimer

```text
Deeportal Political Intelligence provides signal analysis and scenario assessment based on available public data. It does not provide guaranteed political outcomes, official election forecasts, or manipulative campaign recommendations.
```

---

# 15. MVP Roadmap

## Phase 1 — Core Prediction MVP

### Features

```text
- Mode selection
- Funding Signal
- Growth Signal
- Investor Fit
- Market Opportunity
- Social Sentiment
- Basic prediction card
- Markdown report export
```

### Data

```text
- Company database
- Investor database
- News source
- Manual input
- Uploaded document
```

---

## Phase 2 — Risk & Politics Layer

### Features

```text
- Business Risk Signal
- Political Risk Signal
- Regulation Impact
- Public Opinion Signal
- Source citation
- Confidence score
- Scenario comparison
```

### Data

```text
- Regulation documents
- Government statements
- News sentiment
- Sector policy mapping
- Public social sentiment
```

---

## Phase 3 — Simulation Engine

### Features

```text
- What-if Simulation
- Multi-agent simulation
- Scenario comparison dashboard
- Timeline projection
- Agent behavior tuning
```

---

## Phase 4 — Enterprise Intelligence

### Features

```text
- Private workspace
- Upload internal data
- Custom model per sector
- Team collaboration
- API access
- PDF report export
- Alert monitoring
```

---

# 16. Suggested Naming

## Option A — Simple

```text
Predict Deeportal
├─ Funding Signal
├─ Growth Signal
├─ Investor Fit
├─ M&A Signal
├─ Market Signal
├─ Social Signal
├─ Policy Signal
└─ Risk Signal
```

## Option B — Premium

```text
DeepPredict
├─ DeepFunding
├─ DeepGrowth
├─ DeepInvestor
├─ DeepM&A
├─ DeepMarket
├─ DeepSocial
├─ DeepPolicy
└─ DeepRisk
```

## Option C — Intelligence Suite

```text
Deeportal Intelligence
├─ Startup Intelligence
├─ Investor Intelligence
├─ Market Intelligence
├─ Social Intelligence
├─ Political Intelligence
└─ Scenario Intelligence
```

Recommended naming:

```text
Predict Deeportal
```

Recommended mode naming:

```text
Funding Signal
Growth Signal
Investor Fit
M&A Signal
Market Opportunity
Social Sentiment
Political Risk
Regulation Impact
Scenario Simulation
```

---

# 17. Final MVP Recommendation

Untuk versi awal, build seperti ini:

```text
Predict Deeportal MVP
│
├─ 💼 Funding Signal
├─ 🏢 Growth Signal
├─ 🧲 Investor Fit
├─ 📈 Market Opportunity
├─ 🐦 Social Sentiment
├─ 🏛️ Political Risk
├─ 📜 Regulation Impact
└─ 🧠 Scenario Simulation
```

### Why This MVP Works

- Cocok untuk user startup, investor, corporate, dan policy watcher
- Tidak terlalu luas tapi sudah terlihat powerful
- Bisa dipakai untuk pitch product
- Bisa dikembangkan ke prediction engine yang lebih kompleks
- Political prediction masuk sebagai risk & policy intelligence, bukan sekadar ramalan pemilu

### One-Liner

> **Predict Deeportal helps companies, investors, and decision makers predict funding opportunities, market momentum, public sentiment, political risk, and strategic scenarios across Indonesia and Asia.**
