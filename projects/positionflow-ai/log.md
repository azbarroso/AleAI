# Log

### 2026-03-14

- Project created from initial concept discussion
- Full business plan (`positionflow_business_plan.md`) integrated into project files
- **Summary:** PositionFlow.ai is an agent-native API for CFTC TFF ES futures positioning data. Two endpoints (`/es/latest` $0.25, `/es/history` $1.00), x402 pay-per-call, MCP server. Leveraged Funds crowding as primary signal with Asset Manager confirmation context. Categorical signals with `rules_triggered` for full auditability.
- Key architecture decisions documented: TFF over Legacy, 13874+ consolidated, categorical signals, open methodology, 2011+ history
- Tech stack: Node.js/TS + Express + PostgreSQL + Redis on Railway (same pattern as QuoteNorm)
- 4-sprint build plan: data foundation → signal engine → API + x402 → MCP + launch
- Next step: Phase 0 data validation spike (download TFF files, verify columns, test percentile logic manually)
- **Phase 0 data validation spike — COMPLETE. GO decision.**
  - Downloaded TFF Futures Only files for 2011, 2015, 2020, 2025 + current week
  - Correct URL pattern: `https://www.cftc.gov/files/dea/history/fut_fin_txt_YYYY.zip` (note: `fut_fin_txt_`, not `fin_fut_txt_`)
  - 13874+ (S&P 500 Consolidated) present in all years, 52 rows/year, no gaps
  - All 8 required columns 100% populated across all tested years
  - Cross-checked current week (2026-03-10) against CFTC viewer — exact match on all fields
  - COVID crash data shows clear positioning shifts — signal plausibility confirmed
  - Current positioning: LF Net -358,096 (heavy short), AM Net +901,066 (heavy long), ~46th percentile (no extreme)
  - Implementation notes: YYMMDD date field always present (YYYY-MM-DD empty in 2011), no headers in current week file, 87 columns total
  - Full spike results documented in `scratch/phase0_spike_results.md`
  - Next step: Sprint 1 — init code repo, Railway setup, parser + backfill
- **Sprint 1 + 2 — COMPLETE. Data foundation + signal engine live.**
  - Code repo initialized at `~/dev/claude_dev/positionflow-ai/` — TypeScript, Express, ESM
  - Railway project provisioned: PostgreSQL + Redis + app service (`positionflow-api`)
  - Railway CLI installed and authenticated
  - Source files: config, types, DB schema/pool/queries, CFTC fetcher + parser, field mapping, signal engine (percentile, rules, constants)
  - Backfill ran successfully: 793 rows (2011-01-04 to 2026-03-10) loaded into Railway PostgreSQL
  - Signal engine computed over full history: 431 extreme signals, 205 high-strength signals
  - COVID crash sanity check: 2020-03-17 LF Net +8,363 at 99th percentile (5yr) — correctly detected as extreme
  - Latest data (2026-03-10): LF Net -358,096 (22nd percentile 5yr, neutral), AM Net +901,066
  - Recent high signal: 2026-02-24 LF at 3rd percentile 5yr, bullish_lean, high strength (AM opposing)
  - Express app scaffolded with /health endpoint + placeholder /es/latest and /es/history
  - Next step: Sprint 3 — full API endpoints, x402 middleware, Redis cache, cron job, deploy
