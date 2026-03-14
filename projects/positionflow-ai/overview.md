# PositionFlow.ai

## Goal

Ship an agent-native REST API + MCP server that turns CFTC TFF weekly futures positioning data into clean JSON signals for ES futures. Two endpoints (`/es/latest` at $0.25, `/es/history` at $1.00), x402 pay-per-call, no subscriptions required. Target: live in 8 weeks.

**Success criteria:**
- v1 live on Railway with x402 payments working end-to-end
- MCP server published for Claude/GPT agent integration
- Methodology page live and transparent
- Friday cron ingesting new COT data automatically
- First paying users within 2 weeks of launch

## Context

**One-line pitch:** ES futures positioning intelligence for trading agents. TFF-based, agent-native, pay-per-call.

**What it does:** Parses CFTC Traders in Financial Futures (TFF) report for S&P 500 consolidated (code 13874+), computes rolling percentiles, and returns categorical signals showing Leveraged Funds crowding with Asset Manager confirmation/opposition context.

**Why TFF over Legacy COT:** Legacy COT lumps hedge funds and pension funds into "non-commercial" — useless for ES signal quality. TFF separates Leveraged Funds (fast money, crowding signal) from Asset Managers (structural, confirmation context).

**Primary signal:** Leveraged Funds net positioning at 5-year percentile extremes (>80th = bearish_lean, <20th = bullish_lean). Signal strength escalates with Asset Manager opposition and 52wk/5yr alignment.

**Target users:**
1. Agent developers (primary ICP) — need a tool call for positioning context
2. Systematic retail traders — follow COT manually today, want cleaner signal
3. Trading newsletter authors — automate their weekly COT analysis workflow

**Tech stack:** Node.js/TypeScript, Express, PostgreSQL, Redis, Railway, x402 middleware (shared from QuoteNorm), Cloudflare DNS

**Pricing:**
- `/es/latest` — $0.25/call (x402)
- `/es/history` — $1.00/call (x402)
- Subscription tiers planned for v1.1 ($29/$79/$149/mo)

**Infrastructure cost:** ~$18-25/month (Railway + Cloudflare)

**Under AleLabs LLC** alongside QuoteNorm and PolicyNorm.

**Full business plan:** `positionflow_business_plan.md` in this project folder.

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-14 | Project created | New business idea — API for CFTC positioning data |
| 2026-03-14 | Use TFF Futures Only, not Legacy COT | Legacy blends CTAs with pension funds in "non-commercial" — noisy for ES. TFF separates Leveraged Funds as distinct signal bucket |
| 2026-03-14 | Market code 13874+ (S&P 500 Consolidated) | Aggregates classic + E-mini contracts for complete institutional picture |
| 2026-03-14 | x402 pay-per-call as primary monetization | Agent-native, zero friction, matches QuoteNorm/PolicyNorm model |
| 2026-03-14 | Leveraged Funds as primary signal, Asset Managers as context | Leveraged Funds = fast money crowding signal; Asset Managers = confirmation/opposition only |
| 2026-03-14 | Categorical signals, not decimal scores | "bearish_lean" + rules_triggered is honest and auditable; decimal confidence scores are fake precision |
| 2026-03-14 | Publish methodology openly | Transparency is a trust feature — traders won't pay for a black box. Competitive moat is speed + voice, not secrecy |
| 2026-03-14 | Historical data from 2011 onward | Clean and reliable for 5-year percentile windows. Pre-2011 TFF data has packaging inconsistencies |
| 2026-03-14 | **Phase 0 GO** — data validated | All columns 100% populated 2011-2025, exact match vs CFTC viewer, COVID crash shows expected positioning shifts |
| 2026-03-14 | Use payai.network x402 facilitator | Default x402.org facilitator doesn't support exact scheme on Base mainnet (eip155:8453) |
