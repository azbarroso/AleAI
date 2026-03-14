# PositionFlow.ai — Full Business Plan
**Version:** 1.0 | **Date:** March 2026 | **Owner:** Ale | **Status:** Pre-build

---

## Table of Contents

1. [One-Line Pitch](#1-one-line-pitch)
2. [The Problem](#2-the-problem)
3. [The Solution](#3-the-solution)
4. [Dataset Specification](#4-dataset-specification)
5. [Product Specification — v1](#5-product-specification--v1)
6. [Signal Methodology](#6-signal-methodology)
7. [API Design](#7-api-design)
8. [x402 Payment Integration](#8-x402-payment-integration)
9. [Tech Stack](#9-tech-stack)
10. [Data Pipeline Architecture](#10-data-pipeline-architecture)
11. [Infrastructure and Deployment](#11-infrastructure-and-deployment)
12. [Monetization](#12-monetization)
13. [Go-to-Market Strategy](#13-go-to-market-strategy)
14. [Marketing Voice and Positioning](#14-marketing-voice-and-positioning)
15. [Competitive Landscape](#15-competitive-landscape)
16. [Risks and Mitigations](#16-risks-and-mitigations)
17. [Financial Projections](#17-financial-projections)
18. [Roadmap](#18-roadmap)
19. [Build Sprint Board](#19-build-sprint-board)
20. [Action Checklist — Ordered](#20-action-checklist--ordered)
21. [Key Resources and Links](#21-key-resources-and-links)

---

## 1. One-Line Pitch

> **PositionFlow.ai — ES futures positioning intelligence for trading agents.**
> TFF-based, agent-native, pay-per-call. One endpoint. No subscriptions. No auth friction.

### Company and Product Structure

| Layer | Name |
|---|---|
| Company / Brand | PositionFlow |
| Domain | positionflow.ai |
| Product v1 | ES Positioning API |
| Base endpoint | `api.positionflow.ai/es/latest` |
| History endpoint | `api.positionflow.ai/es/history` |
| Methodology page | `positionflow.ai/methodology` |

---

## 2. The Problem

### For Trading Agents

AI trading agents and systematic traders need institutional positioning context to make high-probability decisions on ES futures. The data exists — the CFTC publishes the Commitment of Traders (COT) report every Friday at 3:30 PM ET — but it is completely unusable in its raw form:

- Fixed-width text and CSV files unchanged in structure since 1986
- 80+ columns with cryptic, abbreviated field names
- Zero signal interpretation — raw position counts with no percentile context
- No participant-type separation that maps to modern market structure
- No API — developers must download files, parse them, build a historical database, compute percentiles, and derive signals manually before making a single decision
- No agent-native format — no JSON, no MCP compliance, no x402 payment support

### For Agent Developers

A developer building a Claude-based or GPT-based trading assistant needs positioning context as a tool call. Today they have two options:

1. Build the entire pipeline themselves — 2-4 weeks of engineering work, ongoing maintenance, weekly data ingestion, percentile computation, signal logic
2. Use legacy data providers (Barchart, Quandl/Nasdaq Data Link) that charge subscription fees, have no MCP integration, return raw data with no signal layer, and were designed for human dashboards, not agent tool calls

Neither is acceptable for a solo agent developer who wants to ship a product, not maintain a data infrastructure.

### The Gap in One Sentence

There is no agent-native, pay-per-call API that delivers TFF-based ES futures positioning data with percentile context, participant-level signal logic, and x402 micro-payment support.

---

## 3. The Solution

PositionFlow.ai is a purpose-built REST API and MCP server that delivers normalized ES futures positioning intelligence — derived from the CFTC's Traders in Financial Futures (TFF) report — in clean JSON, payable per call via the x402 protocol.

**What makes it different from every existing COT data product:**

| Feature | PositionFlow | Barchart | Quandl/Nasdaq Data Link | Sentimentrader |
|---|---|---|---|---|
| TFF dataset (not Legacy) | ✅ | ❌ Legacy only | ❌ Legacy only | ❌ Legacy only |
| Leveraged Funds signal | ✅ Primary signal | ❌ | ❌ | Partial |
| 52-week + 5-year percentile | ✅ | ❌ | ❌ | ✅ |
| Categorical signal layer | ✅ | ❌ | ❌ | Partial |
| Agent-native JSON | ✅ | ❌ | ❌ | ❌ |
| MCP server | ✅ | ❌ | ❌ | ❌ |
| x402 pay-per-call | ✅ | ❌ | ❌ | ❌ |
| No subscription required | ✅ | ❌ | ❌ | ❌ |
| Methodology fully documented | ✅ | ❌ | ❌ | Partial |
| rules_triggered audit field | ✅ | ❌ | ❌ | ❌ |

---

## 4. Dataset Specification

### Report: CFTC Traders in Financial Futures (TFF)

| Parameter | Value |
|---|---|
| Report type | Traders in Financial Futures (TFF) |
| Sub-type | Futures Only (not combined) |
| Market code | 13874+ |
| Market description | S&P 500 Consolidated (aggregates classic + E-mini contracts) |
| Publication cadence | Weekly, every Friday at 3:30 PM ET |
| Historical availability | June 2006 (irregular early packaging — see below) |
| Reliable clean history | 2011 onward (safe for 5-year percentile windows) |
| CFTC source URL | https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm |
| Historical bulk download | https://www.cftc.gov/MarketReports/CommitmentsofTraders/HistoricalCompressed/index.htm |

### Why TFF Over Legacy

The Legacy COT report uses a commercial / non-commercial framing that collapses structurally different participants into a single bucket. Non-commercial includes both hedge funds (fast money, trend-following, crowding signal) and pension funds / asset managers (structural, index-rebalancing, low signal value). This collapse makes the Legacy signal noisy and unreliable for equity-index futures specifically.

The TFF report breaks participants into five explicit categories:

| TFF Category | Market Role | Signal Value for ES |
|---|---|---|
| Dealer / Intermediary | Banks, swap dealers, market makers | Secondary context |
| Asset Manager / Institutional | Pension funds, index funds, ETFs | Confirmation / opposition context |
| Leveraged Funds | Hedge funds, CTAs, prop traders | **Primary signal — crowding and reversals** |
| Other Reportables | Non-category large traders | Low signal value |
| Nonreportable | Small traders | Low signal value |

**Leveraged Funds is the "fast money" bucket.** When Leveraged Funds net positioning reaches an extreme percentile, it identifies crowded directional exposure that historically precedes mean reversion. This is the signal. Asset Managers provide confirmation or opposition context. Dealers and Others are noise for v1.

### Why 13874+

The `+` consolidated code aggregates the classic S&P 500 futures contract and the E-mini contract into a single row. This gives a complete picture of institutional S&P 500 futures positioning rather than a contract-specific slice. It is the CFTC's own definition of the consolidated S&P 500 market and the correct code for a product positioning as "ES positioning intelligence."

### Field Mapping (TFF Futures Only Raw → PositionFlow)

You compute and own all derived fields. Do not use pre-computed change fields from the CFTC file — derive them yourself from consecutive weekly rows. This ensures your deltas are always internally consistent even if the CFTC issues revisions.

| PositionFlow Field | Derived From |
|---|---|
| `lev_funds_long` | `Lev_Money_Positions_Long_All` |
| `lev_funds_short` | `Lev_Money_Positions_Short_All` |
| `lev_funds_net` | `lev_funds_long - lev_funds_short` |
| `lev_funds_net_chg_wk` | `lev_funds_net` this week minus prior week (own computation) |
| `asset_mgr_long` | `Asset_Mgr_Positions_Long_All` |
| `asset_mgr_short` | `Asset_Mgr_Positions_Short_All` |
| `asset_mgr_net` | `asset_mgr_long - asset_mgr_short` |
| `asset_mgr_net_chg_wk` | Own computation |
| `dealer_long` | `Dealer_Positions_Long_All` |
| `dealer_short` | `Dealer_Positions_Short_All` |
| `dealer_net` | `dealer_long - dealer_short` |
| `open_interest` | `Open_Interest_All` |
| `oi_chg_wk` | Own computation |
| `report_date` | `As_of_Date_In_Form_YYMMDD` → ISO 8601 |

---

## 5. Product Specification — v1

### Scope of v1

- **One instrument:** ES (S&P 500 Consolidated, 13874+)
- **Two endpoints:** `/es/latest` and `/es/history`
- **One dataset:** TFF Futures Only
- **Two payment options:** x402 per-call (primary), API key subscription (secondary, v1.1)
- **No dashboard:** API only. Landing page with docs is the product surface.
- **No alerts / webhooks:** v2 feature

### What Ships in v1

1. Parsed and normalized TFF data for 13874+ from 2011 to present
2. Rolling 52-week and 5-year percentile for Leveraged Funds net and Asset Manager net
3. Signal layer: bias, signal_type, signal_strength, institutional_context, rules_triggered, signal_version
4. Freshness metadata: data_age_days, report_date, next_expected_report
5. x402 pay-per-call on both endpoints
6. MCP server (Claude and GPT tool-call compatible)
7. Methodology documentation page
8. OpenAPI spec (auto-generated)

### What Does NOT Ship in v1

- NQ, RTY, GC, CL, ZN — future markets, v2
- Fed balance sheet endpoint — v2
- CBOE put/call ratio endpoint — v2
- Dealer gamma endpoint — v3
- Webhooks / push notifications — v2
- User dashboard — not planned
- Subscription billing — v1.1

---

## 6. Signal Methodology

This section is the core intellectual property. Publish it openly on `positionflow.ai/methodology`. Transparency is a trust feature. Traders will not pay for a black box.

### Primary Signal: Leveraged Funds Extreme

**Definition:** Leveraged Funds net positioning is at an extreme when its 5-year rolling percentile rank exceeds 80 (crowded long) or falls below 20 (crowded short).

**Logic:**
- Leveraged Funds participants are trend followers and momentum players
- When they are crowded in one direction, they have already expressed their conviction
- Crowded positioning creates fragility — the fuel for the move is mostly spent
- Historically, extreme crowding precedes mean reversion within 2–6 weeks in equity-index futures

**Threshold calibration:** 80th / 20th percentile is the starting threshold for v1. This will be empirically validated against the historical dataset during the data spike. Document the hit rate and false positive rate transparently on the methodology page.

### Secondary Signal: Asset Manager Confirmation / Opposition

**Definition:** Asset Manager net positioning is used as a confirmation or opposition context field only. It does not independently trigger the primary signal.

**States:**
- `asset_managers_supportive`: Asset Managers positioned in the same direction as Leveraged Funds extreme — adds confirmation
- `asset_managers_opposing`: Asset Managers positioned opposite to Leveraged Funds extreme — strengthens the reversal signal
- `asset_managers_neutral`: Asset Managers near median positioning — no additional context

**Threshold for neutral:** Asset Manager 52-week percentile between 35 and 65 = neutral.

### Signal Strength Rules

Signal strength is categorical, derived from rule count. Not a formula. Not a decimal.

| Signal Strength | Rules That Must Fire |
|---|---|
| `low` | Leveraged Funds 5yr percentile > 80 OR < 20 only |
| `medium` | Leveraged Funds extreme + Asset Managers opposing (52wk percentile) |
| `high` | Leveraged Funds at 5yr extreme + Asset Managers opposing + 52wk and 5yr alignment |

**"52wk and 5yr alignment"** means both the 52-week and 5-year percentiles agree on extremity for Leveraged Funds. If 52wk shows 82nd but 5yr shows only 55th, the signal is degraded because recent positioning is extreme but not historically unusual.

### Signal Bias

| Condition | Bias |
|---|---|
| Leveraged Funds crowded long (high percentile) | `bearish_lean` |
| Leveraged Funds crowded short (low percentile) | `bullish_lean` |
| No extreme condition | `neutral` |

**Note on naming:** `bearish_lean` and `bullish_lean` are deliberate. Not `bearish` or `bullish`. The signal is a positioning context, not a price prediction. Lean language is honest about what the data can and cannot say.

### Signal Version

Every signal response includes `signal_version: "v1"`. When thresholds or rules change, bump to v2. This allows agents to detect methodology changes and handle them explicitly. Never change signal logic without bumping the version.

### Methodology Page Requirements

The public methodology page at `positionflow.ai/methodology` must include:

1. What TFF is and why it was chosen over Legacy
2. Why 13874+ consolidated
3. How percentiles are computed (rolling window, minimum history required)
4. Exact threshold values for each signal rule
5. Historical hit rate for `signal_strength: high` — how often did it precede a reversal within 4 weeks, with sample size
6. Clear disclaimer: this is positioning data, not investment advice
7. Link to CFTC source data
8. Changelog — document every signal_version change with date and what changed

---

## 7. API Design

### Base URL
```
https://api.positionflow.ai
```

### Authentication
x402 protocol — no API key required for per-call access. Payment is embedded in the HTTP request. See Section 8.

### Endpoint 1: Latest Snapshot

```
GET /es/latest
```

**Price:** $0.25 per call (x402)

**Response:**

```json
{
  "instrument": "ES",
  "market_code": "13874+",
  "dataset": "TFF_futures_only",
  "report_date": "2026-03-11",
  "data_age_days": 3,
  "next_expected_report": "2026-03-18",

  "open_interest": {
    "total": 697248,
    "chg_wk": 18420,
    "chg_pct_wk": 2.7
  },

  "leveraged_funds": {
    "long": 389204,
    "short": 218445,
    "net": 170759,
    "net_chg_wk": 22140,
    "percentile_52wk": 81,
    "percentile_5yr": 76
  },

  "asset_managers": {
    "long": 284521,
    "short": 412847,
    "net": -128326,
    "net_chg_wk": -14820,
    "percentile_52wk": 28,
    "percentile_5yr": 33
  },

  "dealers": {
    "long": 198420,
    "short": 156890,
    "net": 41530,
    "net_chg_wk": 3210
  },

  "signal": {
    "signal_version": "v1",
    "bias": "bearish_lean",
    "signal_type": "leveraged_fund_extreme",
    "signal_strength": "high",
    "institutional_context": "asset_managers_opposing",
    "rules_triggered": [
      "lev_funds_net_above_80th_percentile_5yr",
      "lev_funds_net_above_80th_percentile_52wk",
      "asset_mgr_net_below_35th_percentile_52wk"
    ],
    "extreme_flag": true,
    "extreme_side": "leveraged_funds_long"
  },

  "meta": {
    "cftc_source": "TFF_futures_only",
    "methodology_url": "https://positionflow.ai/methodology",
    "call_cost_usd": 0.25,
    "paid_via": "x402"
  }
}
```

---

### Endpoint 2: History

```
GET /es/history?weeks=52
```

**Price:** $1.00 per call (x402)
**Max weeks:** 260 (5 years)
**Default weeks:** 52

**Response:**

```json
{
  "instrument": "ES",
  "market_code": "13874+",
  "dataset": "TFF_futures_only",
  "weeks_requested": 52,
  "weeks_returned": 52,
  "from_date": "2025-03-14",
  "to_date": "2026-03-11",

  "history": [
    {
      "report_date": "2026-03-11",
      "open_interest": 697248,
      "leveraged_funds_net": 170759,
      "leveraged_funds_percentile_52wk": 81,
      "leveraged_funds_percentile_5yr": 76,
      "asset_mgr_net": -128326,
      "asset_mgr_percentile_52wk": 28,
      "signal_bias": "bearish_lean",
      "signal_strength": "high"
    }
  ],

  "meta": {
    "methodology_url": "https://positionflow.ai/methodology",
    "call_cost_usd": 1.00,
    "paid_via": "x402"
  }
}
```

---

### MCP Server Tool Definitions

Two tools exposed via MCP:

```json
{
  "name": "get_es_positioning",
  "description": "Returns the latest ES futures positioning signal from CFTC TFF data. Includes Leveraged Funds and Asset Manager net positions with 52-week and 5-year percentile context, plus a categorical signal with explicit rules.",
  "inputSchema": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
```

```json
{
  "name": "get_es_positioning_history",
  "description": "Returns historical ES futures positioning data for the last N weeks. Useful for backtesting, trend analysis, and regime identification.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "weeks": {
        "type": "integer",
        "description": "Number of weeks of history to return. Max 260. Default 52.",
        "default": 52
      }
    }
  }
}
```

### Error Responses

All errors return standard HTTP codes with a JSON body:

```json
{
  "error": "payment_required",
  "message": "This endpoint requires x402 payment. See https://positionflow.ai/docs/x402",
  "price_usd": 0.25,
  "x402_endpoint": "https://api.positionflow.ai/es/latest"
}
```

```json
{
  "error": "data_unavailable",
  "message": "Latest COT report not yet published for this week. Next expected: 2026-03-18T20:30:00Z",
  "next_expected_report": "2026-03-18T20:30:00Z"
}
```

### OpenAPI Spec

Generate with `swagger-jsdoc` or `tsoa`. Publish at `api.positionflow.ai/docs`. This is your documentation surface — keep it current. Agent developers read OpenAPI specs before reading prose docs.

---

## 8. x402 Payment Integration

### Protocol Overview

x402 is an HTTP-native micropayment protocol. When a client calls a paid endpoint without payment, the server returns HTTP 402 with a payment challenge. The client pays, includes proof in the next request, and the server serves the response. No accounts. No subscriptions. No API keys. No friction for agents.

This is already implemented in QuoteNorm.ai. The middleware pattern is identical — copy it.

### Payment Flow

```
Client → GET /es/latest
Server → 402 Payment Required
         {
           "x402Version": 1,
           "accepts": [{
             "scheme": "exact",
             "network": "base",
             "maxAmountRequired": "250000",   // $0.25 in USDC (6 decimals)
             "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // USDC on Base
             "payTo": "<your_wallet_address>",
             "description": "ES latest positioning snapshot — PositionFlow.ai"
           }]
         }

Client → GET /es/latest
         X-PAYMENT: <signed_payment_proof>
Server → 200 OK + full JSON response
```

### Pricing in USDC (6 decimals)

| Endpoint | USD | USDC units |
|---|---|---|
| `/es/latest` | $0.25 | 250000 |
| `/es/history` | $1.00 | 1000000 |

### Middleware Reuse

Since QuoteNorm.ai already has x402 middleware built:

1. Extract the x402 verification middleware into a shared npm package or a private GitHub repo
2. Import it into PositionFlow
3. The only change is the price amounts and wallet address (same wallet is fine)

### Agent Compatibility

x402 is natively supported by:
- Claude tool calls (with x402-aware tool wrappers)
- LangChain agent toolkit
- OpenAI function calling (with x402 middleware in the caller layer)
- Any agent that can handle HTTP 402 responses programmatically

Include a code example in the docs showing a complete tool call → payment → response cycle in both Python and JavaScript. This is the primary conversion path for agent developers.

---

## 9. Tech Stack

### Rationale

Solo maintainability is the primary constraint. Every technology choice is evaluated against: can you debug this at 6 AM before the market opens if the Friday cron job fails?

| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js (TypeScript) | Already your stack from QuoteNorm.ai and trading tools |
| Framework | Express | Simple, minimal, debuggable |
| Database | PostgreSQL | Historical time series, percentile queries, reliability |
| Cache | Redis | Sub-10ms response on `/es/latest` — same row served all week |
| Job scheduler | node-cron | Friday 3:35 PM ET data pull, simple cron expression |
| CFTC parser | Custom Node.js module | CSV parsing with papaparse, field mapping hardcoded |
| x402 middleware | Shared with QuoteNorm | See Section 8 |
| MCP server | @anthropic-ai/mcp or equivalent | Wrap both endpoints as MCP tools |
| API docs | swagger-jsdoc + swagger-ui | Auto-generated from JSDoc comments |
| Deployment | Railway | Simple, Git-push deploy, managed PostgreSQL and Redis available |
| Monitoring | Railway built-in + UptimeRobot (free) | Alert on cron failure or endpoint downtime |
| DNS | Cloudflare | Already managing positionflow.ai |
| Payments | x402 + Coinbase CDP | Same as QuoteNorm.ai |

### Repository Structure

```
positionflow/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── es-latest.ts
│   │   │   └── es-history.ts
│   │   ├── middleware/
│   │   │   ├── x402.ts          (shared from QuoteNorm)
│   │   │   └── error-handler.ts
│   │   └── app.ts
│   ├── data/
│   │   ├── cftc-fetcher.ts      (downloads weekly TFF file)
│   │   ├── cftc-parser.ts       (CSV → normalized row)
│   │   ├── ingestion.ts         (parser → PostgreSQL)
│   │   └── field-map.ts         (TFF column names → PositionFlow schema)
│   ├── signal/
│   │   ├── percentile.ts        (rolling percentile computation)
│   │   ├── signal-engine.ts     (bias, strength, rules_triggered)
│   │   └── constants.ts         (thresholds, signal_version)
│   ├── mcp/
│   │   └── server.ts            (MCP tool definitions and handlers)
│   ├── jobs/
│   │   └── weekly-refresh.ts    (cron job — Friday 3:35 PM ET)
│   └── db/
│       ├── schema.sql
│       ├── queries.ts
│       └── migrations/
├── scripts/
│   ├── backfill.ts              (load historical data from bulk files)
│   ├── validate-spike.ts        (data validation spike script)
│   └── manual-refresh.ts        (trigger weekly refresh manually)
├── tests/
│   ├── parser.test.ts
│   ├── percentile.test.ts
│   └── signal.test.ts
├── docs/
│   └── methodology.md           (source for positionflow.ai/methodology)
├── .env.example
├── railway.toml
└── README.md
```

### Database Schema

```sql
-- Historical TFF rows, normalized
CREATE TABLE cot_tff_es (
  id                      SERIAL PRIMARY KEY,
  report_date             DATE NOT NULL UNIQUE,
  open_interest           INTEGER NOT NULL,
  oi_chg_wk               INTEGER,

  lev_funds_long          INTEGER NOT NULL,
  lev_funds_short         INTEGER NOT NULL,
  lev_funds_net           INTEGER GENERATED ALWAYS AS (lev_funds_long - lev_funds_short) STORED,
  lev_funds_net_chg_wk    INTEGER,

  asset_mgr_long          INTEGER NOT NULL,
  asset_mgr_short         INTEGER NOT NULL,
  asset_mgr_net           INTEGER GENERATED ALWAYS AS (asset_mgr_long - asset_mgr_short) STORED,
  asset_mgr_net_chg_wk    INTEGER,

  dealer_long             INTEGER NOT NULL,
  dealer_short            INTEGER NOT NULL,
  dealer_net              INTEGER GENERATED ALWAYS AS (dealer_long - dealer_short) STORED,

  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cot_report_date ON cot_tff_es (report_date DESC);

-- Computed signal snapshot (updated weekly after ingestion)
CREATE TABLE signal_snapshot (
  id                          SERIAL PRIMARY KEY,
  report_date                 DATE NOT NULL UNIQUE,
  signal_version              VARCHAR(10) NOT NULL DEFAULT 'v1',

  lev_funds_percentile_52wk   NUMERIC(5,2),
  lev_funds_percentile_5yr    NUMERIC(5,2),
  asset_mgr_percentile_52wk   NUMERIC(5,2),
  asset_mgr_percentile_5yr    NUMERIC(5,2),

  bias                        VARCHAR(20),
  signal_type                 VARCHAR(50),
  signal_strength             VARCHAR(10),
  institutional_context       VARCHAR(30),
  rules_triggered             TEXT[],
  extreme_flag                BOOLEAN,
  extreme_side                VARCHAR(30),

  computed_at                 TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. Data Pipeline Architecture

### Weekly Refresh Flow (Every Friday 3:35 PM ET)

```
cron: 35 15 * * 5 (America/New_York)
  │
  ▼
cftc-fetcher.ts
  │  Downloads: https://www.cftc.gov/dea/newcot/FinFutWk.txt
  │  (TFF Futures Only, current week file)
  │
  ▼
cftc-parser.ts
  │  Parses CSV, filters for market_code = "13874+"
  │  Maps raw column names → PositionFlow schema
  │  Validates: all required fields present, values numeric, report_date is new
  │
  ▼
ingestion.ts
  │  INSERT INTO cot_tff_es
  │  Compute chg_wk fields vs prior row
  │  ON CONFLICT (report_date) DO NOTHING (idempotent)
  │
  ▼
percentile.ts
  │  Recompute rolling 52wk percentile for lev_funds_net (last 52 rows)
  │  Recompute rolling 5yr percentile for lev_funds_net (last 260 rows)
  │  Same for asset_mgr_net
  │
  ▼
signal-engine.ts
  │  Evaluate signal rules against new percentiles
  │  Produce: bias, signal_type, signal_strength, institutional_context, rules_triggered
  │
  ▼
signal_snapshot INSERT
  │  Write new signal row to signal_snapshot table
  │
  ▼
Redis INVALIDATE
  │  DEL positionflow:es:latest
  │  Next API call rebuilds from DB and caches
  │
  ▼
Alerting
   Log: "Weekly refresh complete. Report date: 2026-03-11. Signal: bearish_lean / high"
   If any step fails: send alert (Railway logs + optional email/Slack webhook)
```

### Historical Backfill (One-Time, Pre-Launch)

```
scripts/backfill.ts
  │
  ├── Download annual TFF Futures Only ZIP files: 2011–2025
  │   From: https://www.cftc.gov/MarketReports/CommitmentsofTraders/HistoricalCompressed/
  │
  ├── Unzip and concatenate into single CSV
  │
  ├── Parse all rows, filter for 13874+
  │   Expected: ~780 weekly rows (2011–2026)
  │
  ├── Sort by report_date ascending
  │
  ├── Compute chg_wk for every row (own computation, not from source)
  │
  ├── Bulk INSERT into cot_tff_es
  │
  ├── Run percentile computation over full history
  │
  └── Run signal engine over full history → populate signal_snapshot
      (This becomes your backtest dataset)
```

### Holiday Schedule Handling

The CFTC publishes a release calendar annually. Some Fridays shift to Thursday or the following Monday around US federal holidays.

```typescript
// jobs/weekly-refresh.ts
const HOLIDAY_SHIFTED_DATES: Record<string, string> = {
  // Add from CFTC annual calendar
  // Format: "YYYY-MM-DD" (scheduled) -> "YYYY-MM-DD" (actual release)
  "2026-11-27": "2026-11-25",  // Thanksgiving week — example
};

// Retry logic: if Friday fetch returns no new data,
// retry Saturday and Sunday before marking as failed
```

---

## 11. Infrastructure and Deployment

### Railway Setup

```
Services:
  positionflow-api     (Node.js web service)
  positionflow-db      (Railway managed PostgreSQL)
  positionflow-redis   (Railway managed Redis)

Environment variables:
  DATABASE_URL         (Railway provides automatically)
  REDIS_URL            (Railway provides automatically)
  WALLET_ADDRESS       (your USDC receiving address on Base)
  X402_SECRET          (shared secret for x402 verification)
  CRON_TIMEZONE        America/New_York
  SIGNAL_VERSION       v1
  NODE_ENV             production
```

### Estimated Monthly Cost

| Service | Cost |
|---|---|
| Railway Hobby plan | $5/month |
| Railway PostgreSQL | ~$5/month (small DB) |
| Railway Redis | ~$5/month |
| Cloudflare (DNS, proxy) | Free |
| UptimeRobot monitoring | Free |
| Domain (positionflow.ai) | ~$3/month amortized |
| **Total** | **~$18–25/month** |

This stays under $25/month until you have meaningful traffic. Railway scales gracefully.

### Monitoring Checklist

- [ ] UptimeRobot ping on `api.positionflow.ai/health` — alert if down
- [ ] Railway deploy alerts on GitHub push
- [ ] Cron job completion logging — manual check every Friday evening
- [ ] Weekly data freshness check: `data_age_days` > 8 = something broke
- [ ] Redis hit rate monitoring — if 0%, cache is not warming correctly

---

## 12. Monetization

### Primary: x402 Pay-Per-Call

No signup. No subscription. No friction. An agent calls the endpoint, pays $0.25 in USDC on Base, gets the data. This is the primary monetization model for v1.

| Endpoint | Price per Call |
|---|---|
| `/es/latest` | $0.25 |
| `/es/history?weeks=52` | $1.00 |
| `/es/history?weeks=260` | $1.00 (same — all history) |

### Secondary: API Key Subscription (v1.1)

For users who call the API frequently and want predictable billing without per-call payment overhead. Stripe-based.

| Tier | Price | Includes |
|---|---|---|
| Analyst | $29/month | 200 calls/month to `/es/latest` + 20 history calls |
| Trader Pro | $79/month | Unlimited `/es/latest` + 100 history calls + webhook on Friday release |
| Agent Builder | $149/month | Unlimited all endpoints + MCP server access + priority support |

### Revenue Model at Scale

| Scenario | Monthly Calls | Revenue |
|---|---|---|
| 100 agents × 4 calls/month | 400 | $100 |
| 500 agents × 4 calls/month | 2,000 | $500 |
| 50 subscriptions at $79 avg | — | $3,950 |
| 50 subscriptions + 500 pay-per-call | — | $4,450 |
| **Target Month 6** | — | **$3,000–5,000 MRR** |

### Affiliate / Partnership Revenue (v2)

When expanding to additional instruments, consider affiliate arrangements with broker platforms (Tradovate, Topstep, Apex) where PositionFlow is a featured data tool for their trader communities. Low priority for v1.

---

## 13. Go-to-Market Strategy

### Target Buyers — In Priority Order

**1. Agent Developers (Primary ICP)**

Who: Developers building Claude-based, GPT-based, or LangChain trading assistants. They need a tool call that returns positioning context. They do not want to build data infrastructure. They are comfortable with x402 micropayments. They will try the product the same day they discover it if the setup friction is zero.

Where to find them: Claude developer Discord, LangChain Discord, X/Twitter (following @AnthropicAI, @LangChainAI, @OpenAI developer accounts), GitHub (searching for repos that use Claude tool calls or function calling with financial data), r/MachineLearning, r/LocalLLaMA.

What they need: A copy-paste tool definition they can drop into their agent in 5 minutes. Prioritize this in the docs.

**2. Systematic Retail Traders (Secondary ICP)**

Who: Traders who use ES futures, have some technical sophistication, follow COT data manually today, and would pay for a cleaner signal with less manual work. They may not be building agents but will use the API via curl or a Python script.

Where to find them: X/Twitter (futures trading community), r/algotrading, r/futures, TradingView community, Substack (systematic trading newsletters).

What they need: Proof that the signal has historical validity. The methodology page and a backtest post are the primary conversion tools.

**3. Trading Newsletter Authors (Tertiary ICP)**

Who: Writers who publish weekly COT analysis for subscribers. They do this manually today — download the file, compute numbers in a spreadsheet, write commentary. PositionFlow automates the data work.

Where to find them: Substack search "COT", "commitment of traders", "futures positioning". There are 20-30 active writers in this niche.

What they need: A free trial, a case study format showing how to integrate PositionFlow into a weekly workflow, and a discount on the Trader Pro tier in exchange for a mention.

### Launch Sequence

**Pre-launch (while building — 4-6 weeks)**

- [ ] Register positionflow.ai (done)
- [ ] Set up simple landing page: headline, one-line description, waitlist email capture, link to methodology (even if draft)
- [ ] Start a thread on X documenting the build — "Building a TFF-based ES positioning API. Here's what I found in the CFTC data this week." Post every Friday after the COT release with a manual version of what the API will return. This builds an audience before the product exists.
- [ ] Post the data validation spike findings as a technical thread — developers respect this

**Launch Week**

- [ ] Product Hunt launch: "PositionFlow — ES futures positioning intelligence for trading agents. TFF data. x402 pay-per-call. No subscriptions."
- [ ] X/Twitter launch thread with live API response screenshot
- [ ] Post in Claude developer Discord and LangChain Discord with copy-paste MCP tool definition
- [ ] Post on r/algotrading: "I built a clean COT API for ES using TFF data. Here's the signal output. Free to try."
- [ ] Email the 5-10 most relevant systematic trading Substack authors with a personal note and free 30-day access

**Post-Launch (weeks 2-8)**

- [ ] Weekly Friday COT thread on X using live PositionFlow output — this is the recurring content engine
- [ ] Respond to every GitHub issue, Discord question, and X reply personally — early community matters more than scale
- [ ] Write a detailed technical post: "Why TFF beats Legacy COT for ES futures signals" — this is your SEO and credibility anchor
- [ ] After 10 paying customers, write a case study with one of them

---

## 14. Marketing Voice and Positioning

### The Core Message

PositionFlow exists at the intersection of three truths:

1. Institutional positioning data is the most reliable leading indicator available for ES
2. The CFTC publishes this data free every week
3. Nobody has built it into a form that agents can consume

The marketing voice leads with those truths — no hype, no vague claims, just the specific and verifiable.

### Tone Principles

**Precise over broad.** Never say "institutional positioning intelligence." Say "Leveraged Funds net positioning in 52-week percentile context." Specificity signals that you know what you're talking about. Your ICP is technical. Reward their intelligence.

**Auditable over authoritative.** Every claim you make, back it with methodology. "Signal strength: high" only lands if the user can see exactly which three rules fired to produce it. The `rules_triggered` field is not a debug tool — it's a marketing feature.

**Agent-native framing.** Lead with the agent use case in every piece of content. Not "traders can use this" — "agents can call this." The tool call examples in your docs are marketing copy, not just documentation.

**No fake precision.** No decimal confidence scores. No "87% accuracy." You have hit rates with sample sizes — state those explicitly. "In 34 of 47 historical instances where signal_strength was high, ES saw a pullback within 4 weeks." That's honest. "87% accurate" is not.

**Short sentences in copy.** The agent developer audience skims. They read the first line of every paragraph and the code blocks. Write for skimmers.

### Sample Copy — Landing Page Hero

```
PositionFlow

ES futures positioning intelligence for trading agents.

TFF data. Leveraged Funds signal. Percentile context.
One endpoint. Pay per call. No subscription.

GET /es/latest → $0.25 → JSON

[See the docs]  [View methodology]
```

### Sample Copy — X/Twitter Launch Thread

```
Tweet 1:
I built PositionFlow — an ES futures positioning API for trading agents.

TFF data from the CFTC. Leveraged Funds signal. 52-week and 5-year percentile context.
Pay $0.25 per call via x402. No account. No subscription.

Here's what it returns right now 👇

Tweet 2:
[paste actual /es/latest JSON response]

Tweet 3:
The signal layer:
- Primary: Leveraged Funds extreme (crowded positioning = fragility)
- Secondary: Asset Manager confirmation or opposition
- Output: categorical bias + strength + exact rules that fired

No decimal confidence scores. No black box. Every rule is documented.

Tweet 4:
The data is CFTC TFF Futures Only, code 13874+.
That's the S&P 500 consolidated market — classic + E-mini aggregated.

TFF separates Leveraged Funds from Asset Managers.
Legacy COT doesn't. That difference matters a lot for ES signal quality.

Tweet 5:
Full methodology at positionflow.ai/methodology
MCP server included — drop it into your Claude or GPT agent in 5 minutes.

api.positionflow.ai/es/latest
```

### Sample Copy — r/algotrading Post

```
Title: Built a clean TFF-based COT API for ES futures — agent-native, pay-per-call

I got frustrated with the CFTC's raw data format and the fact that no existing COT 
product uses TFF instead of Legacy.

So I built PositionFlow. Here's what's different:

- Uses TFF Futures Only (not Legacy COT)
- 13874+ consolidated S&P 500 code
- Leveraged Funds is the primary signal bucket — not the blended "non-commercial" 
  catch-all from Legacy that mixes CTAs with pension funds
- 52-week AND 5-year percentile context in every response
- Categorical signal with exact rules_triggered — fully auditable, no black box
- x402 pay-per-call — $0.25 per snapshot, $1.00 for 52-week history
- MCP server for agent integration

Current signal for ES: [paste current output]

Methodology is fully public: positionflow.ai/methodology
Happy to discuss the signal logic, threshold choices, or TFF vs Legacy.
```

---

## 15. Competitive Landscape

### Direct Comparison

| Product | Dataset | Signal Layer | Agent Native | Pricing |
|---|---|---|---|---|
| **PositionFlow** | TFF Futures Only | Leveraged Funds extreme + Asset Mgr context | ✅ x402 + MCP | $0.25/call |
| Barchart COT | Legacy Combined | None (raw data) | ❌ | $50-200/mo |
| Nasdaq Data Link | Legacy | None (raw data) | ❌ | $30-500/mo |
| Sentimentrader | Legacy + proprietary | Composite score (black box) | ❌ | $350/mo |
| MarketSentiment.co | Legacy | Basic | ❌ | $20-50/mo |
| Bloomberg COT | Legacy | Charting only | ❌ | $2,000+/mo |

### Your Defensible Position

1. **TFF, not Legacy** — nobody else leads with this for a standalone product
2. **Leveraged Funds as the named, primary signal** — specific and auditable
3. **Agent-native by design** — x402, MCP, JSON, no friction
4. **Transparent methodology** — every competitor has a black box; you don't
5. **Solo founder speed** — you ship features, fix bugs, and respond to users faster than any of these companies

### The Realistic Competitive Risk

Barchart or Sentimentrader could add a JSON API with x402 support in a few months if they saw PositionFlow gaining traction. The moat is not technical — it's speed, voice, community, and the methodology trust layer you build before they react. Move fast. The first 6 months define the brand.

---

## 16. Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| CFTC changes TFF file format | Low | High | Build format-agnostic parser with column-name mapping in config file; automated regression test on every parse |
| CFTC changes 13874+ code | Very low | High | Monitor CFTC release notes; document the code rationale publicly so users understand if it ever changes |
| Holiday-shifted release breaks cron | Medium | Low | Implement retry window (Sat/Sun after scheduled Friday); hardcode CFTC holiday calendar annually |
| x402 adoption slower than expected | Medium | Medium | Add Stripe subscription billing as v1.1 fallback; don't depend on x402-only revenue |
| Signal doesn't have historical validity | Low (you use this data) | High | Data spike will validate before launch; publish hit rates honestly; if weak, narrow the signal threshold |
| Low initial traction | Medium | Medium | Friday COT thread is the recurring engine; one viral technical post can change the trajectory |
| Large competitor adds TFF + JSON API | Low (6-month window) | High | Build community and brand loyalty before they react; your voice and methodology page are not replicable fast |
| Data accuracy error in percentile computation | Low | High | Regression tests comparing computed percentiles against manual spot-checks; publish methodology so users can verify |

---

## 17. Financial Projections

### Conservative Scenario (Base Case)

| Month | x402 Revenue | Subscription Revenue | Total MRR |
|---|---|---|---|
| 1 | $50 | $0 | $50 |
| 2 | $150 | $0 | $150 |
| 3 | $300 | $200 | $500 |
| 4 | $400 | $500 | $900 |
| 5 | $500 | $1,200 | $1,700 |
| 6 | $600 | $2,000 | $2,600 |

### Optimistic Scenario (One Viral Post or Partnership)

| Month | x402 Revenue | Subscription Revenue | Total MRR |
|---|---|---|---|
| 1 | $100 | $0 | $100 |
| 2 | $400 | $200 | $600 |
| 3 | $600 | $1,000 | $1,600 |
| 4 | $800 | $2,500 | $3,300 |
| 5 | $1,000 | $4,000 | $5,000 |
| 6 | $1,200 | $5,500 | $6,700 |

### Break-Even

Infrastructure cost: ~$25/month. You break even on your first paying subscriber. The question is never break-even — it's whether this reaches meaningful MRR before you lose interest. The Friday COT thread is the mechanism that keeps it compounding.

### Unit Economics

- Cost per API call served: ~$0.00 (Redis hit, no compute)
- Revenue per API call: $0.25 or $1.00
- Gross margin: ~99% (excluding infrastructure fixed cost)

---

## 18. Roadmap

### v1 — ES Only (Target: 8 weeks from today)
- TFF Futures Only, 13874+
- Two endpoints: latest + history
- Signal layer: Leveraged Funds primary, Asset Manager context
- x402 pay-per-call
- MCP server
- Methodology page
- Railway deployment

### v1.1 — Subscription Billing (Target: week 10-12)
- Stripe integration
- API key management
- Three subscription tiers
- Usage tracking per key

### v2 — Additional Instruments (Target: 3 months after v1 launch, only after 50 paying users)
- NQ (Nasdaq 100 — 20974+)
- Possibly GC (Gold) or ZN (10-Year Treasury)
- Same TFF signal structure, same endpoints
- Dashboard endpoint: `/portfolio/latest?tickers=ES,NQ`

### v2.1 — Macro Context Layer (Target: Q4 2026)
- Fed balance sheet weekly change (H.4.1)
- CBOE put/call ratio normalized with percentile context
- Combined macro signal endpoint

### v3 — Webhooks (Target: 2027)
- Push notification on new COT release
- Webhook to user-specified URL every Friday ~3:35 PM ET
- Enables agents to be triggered by data freshness rather than polling

---

## 19. Build Sprint Board

### Pre-Sprint: Data Validation Spike (2-3 hours — Do This First)

- [ ] Download TFF Futures Only annual files for 2011, 2015, 2020, 2025
  - URL: https://www.cftc.gov/MarketReports/CommitmentsofTraders/HistoricalCompressed/
  - Look for files named `f_year_futonly.zip` or similar
- [ ] Unzip each, open in Excel or `csvkit` to inspect structure
- [ ] Filter for rows where market_code = "13874+"
- [ ] Confirm these columns exist and are populated in all 4 files:
  - `Lev_Money_Positions_Long_All`
  - `Lev_Money_Positions_Short_All`
  - `Asset_Mgr_Positions_Long_All`
  - `Asset_Mgr_Positions_Short_All`
  - `Dealer_Positions_Long_All`
  - `Dealer_Positions_Short_All`
  - `Open_Interest_All`
  - `As_of_Date_In_Form_YYMMDD`
- [ ] Manually compute lev_funds_net for the most recent 5 rows
- [ ] Manually rank the most recent row against last 52 rows — rough percentile
- [ ] Compare your row to CFTC's own data viewer at:
  https://www.cftc.gov/dea/futures/financial_lof.htm
- [ ] Document any gaps, missing weeks, or column name variations found
- [ ] Go / no-go decision: if columns are clean and consistent across all 4 years, proceed

---

### Sprint 1 — Data Foundation (Weekend 1)

- [ ] Initialize repo: `positionflow` with TypeScript, Express, ESLint
- [ ] Set up Railway project: web service + PostgreSQL + Redis
- [ ] Run schema migrations: `cot_tff_es` and `signal_snapshot` tables
- [ ] Write `cftc-parser.ts`: parse TFF CSV, filter 13874+, map to schema
- [ ] Write `backfill.ts`: load all historical files, compute chg_wk
- [ ] Run backfill: load 2011–2026 into PostgreSQL
- [ ] Verify row count: expect ~780 rows
- [ ] Sanity check: query the 2020-03-24 row (COVID crash week — should show extreme Leveraged Funds)

---

### Sprint 2 — Signal Engine (Weekend 2)

- [ ] Write `percentile.ts`:
  - Function: `computePercentile(values: number[], current: number): number`
  - Function: `getRollingWindow(reportDate: Date, weeks: number): number[]`
- [ ] Compute and store 52wk + 5yr percentiles for every row in history
- [ ] Write `signal-engine.ts`:
  - Evaluate Leveraged Funds 5yr percentile against thresholds
  - Determine `bias` (bearish_lean / bullish_lean / neutral)
  - Determine `signal_strength` (low / medium / high) per rule table
  - Determine `institutional_context` (asset_managers_supportive / opposing / neutral)
  - Build `rules_triggered` array
- [ ] Write tests for signal engine: test each rule combination explicitly
- [ ] Run signal engine over full history → populate `signal_snapshot`
- [ ] Review signal history: count how many `high` signals occurred since 2011
  - Document this number for the methodology page

---

### Sprint 3 — API and x402 (Weekend 3)

- [ ] Write `/es/latest` route:
  - Check Redis cache first
  - On miss: query DB for latest snapshot + signal
  - Cache response with TTL = until next Friday
  - Return full JSON schema
- [ ] Write `/es/history` route:
  - Accept `weeks` query param (default 52, max 260)
  - Return array of historical rows with signal summary per row
- [ ] Port x402 middleware from QuoteNorm.ai
  - Update price amounts: 250000 for latest, 1000000 for history
  - Verify wallet address on Base
- [ ] Write `/health` endpoint (no payment required):
  ```json
  {
    "status": "ok",
    "latest_report_date": "2026-03-11",
    "data_age_days": 3,
    "next_expected_report": "2026-03-18"
  }
  ```
- [ ] Write error handler middleware
- [ ] Write cron job `weekly-refresh.ts`:
  - Friday 3:35 PM ET
  - Fetch current week's TFF file
  - Parse, validate, ingest
  - Recompute percentiles and signal
  - Invalidate Redis cache
  - Log completion
- [ ] Test full flow end-to-end: cold call → 402 → payment → 200 response
- [ ] Deploy to Railway

---

### Sprint 4 — MCP, Docs, Launch Prep (Weekend 4)

- [ ] Write MCP server `server.ts`:
  - Tool: `get_es_positioning` → calls `/es/latest` internally
  - Tool: `get_es_positioning_history` → calls `/es/history` internally
  - Publish as MCP-compatible server
- [ ] Add swagger-jsdoc to all routes → auto-generate OpenAPI spec
- [ ] Deploy OpenAPI docs at `api.positionflow.ai/docs`
- [ ] Write methodology page content (`docs/methodology.md`)
- [ ] Set up Cloudflare to route:
  - `positionflow.ai` → landing page (can be simple HTML on Cloudflare Pages)
  - `api.positionflow.ai` → Railway service
- [ ] Write landing page: headline, one-line description, two code examples, link to docs and methodology
- [ ] Write Python code example for docs (copy-paste agent integration)
- [ ] Write JavaScript code example for docs
- [ ] Manual end-to-end test from a clean environment
- [ ] Final check: does the Friday cron run cleanly in Railway's timezone?

---

## 20. Action Checklist — Ordered

### This Week
- [ ] Complete data validation spike (see Sprint Pre-Sprint above — 2-3 hours)
- [ ] Document spike findings in Obsidian: columns found, any gaps, 2006-2010 edge status
- [ ] Decision: confirm go/no-go based on spike results
- [ ] Set up Railway project and provision PostgreSQL + Redis

### Week 2-3 (Sprint 1)
- [ ] Initialize repo with TypeScript + Express
- [ ] Write and run backfill script
- [ ] Verify historical data integrity

### Week 4-5 (Sprint 2)
- [ ] Build and test signal engine
- [ ] Review historical signal output manually — does it look right?
- [ ] Write methodology doc first draft

### Week 6-7 (Sprint 3)
- [ ] Build API endpoints
- [ ] Port x402 middleware
- [ ] Deploy to Railway
- [ ] Test x402 flow end-to-end

### Week 8 (Sprint 4)
- [ ] MCP server
- [ ] Landing page + methodology page live
- [ ] OpenAPI docs deployed
- [ ] Soft launch: post on X with live output

### Week 9-10 (Launch)
- [ ] Product Hunt launch
- [ ] r/algotrading post
- [ ] Claude and LangChain Discord posts
- [ ] Email 10 systematic trading Substack authors
- [ ] First Friday COT thread with live API output

---

## 21. Key Resources and Links

### CFTC Data
- COT reports index: https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm
- TFF current week (Futures Only): https://www.cftc.gov/dea/newcot/FinFutWk.txt
- TFF historical compressed: https://www.cftc.gov/MarketReports/CommitmentsofTraders/HistoricalCompressed/index.htm
- TFF current data viewer (ground truth for validation): https://www.cftc.gov/dea/futures/financial_lof.htm
- CFTC variable definitions: https://www.cftc.gov/MarketReports/CommitmentsofTraders/ExplanatoryNotes/index.htm
- CFTC release calendar: https://www.cftc.gov/MarketReports/CommitmentsofTraders/ReleaseSchedule/index.htm

### x402 Protocol
- x402 spec: https://x402.org
- Coinbase CDP (for payment verification): https://docs.cdp.coinbase.com

### Infrastructure
- Railway: https://railway.app
- Cloudflare Pages (landing page hosting): https://pages.cloudflare.com
- UptimeRobot: https://uptimerobot.com

### MCP
- Anthropic MCP docs: https://docs.anthropic.com/en/docs/agents/mcp
- MCP server SDK: https://github.com/anthropics/anthropic-sdk-python (check for MCP tooling)

### Competitive Reference
- Barchart COT: https://www.barchart.com/futures/commitment-of-traders
- Nasdaq Data Link COT: https://data.nasdaq.com/data/CFTC
- Sentimentrader: https://www.sentimentrader.com

### Community (GTM Targets)
- r/algotrading: https://www.reddit.com/r/algotrading
- r/futures: https://www.reddit.com/r/Futures
- LangChain Discord: https://discord.gg/langchain
- Claude developer community: https://discord.gg/anthropic

---

*PositionFlow.ai — positionflow.ai*
*Last updated: March 2026*
*Next review: After data validation spike completion*
