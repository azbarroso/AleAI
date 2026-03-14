# Brief

## Questions

- ~~Data validation spike: Do all required TFF columns exist and populate consistently across 2011-2026 files?~~ — Yes, all columns 100% populated across 2011-2025. GO. See `scratch/phase0_spike_results.md`.
- ~~What does the 13874+ row look like during known events (COVID crash 2020-03-24, 2022 bear market)?~~ — COVID crash shows clear LF positioning shift (net short → briefly net long → back to short). Data captures extremes well.
- ~~How many "high" strength signals would the engine have produced historically? Is the hit rate publishable?~~ — 205 high-strength signals out of 793 weeks (~26%). Hit rate analysis still needed for methodology page.
- Should x402 middleware be extracted into a shared npm package now (for QuoteNorm + PositionFlow) or copy-paste for speed?

## Directives

- ~~Integrate full business plan once provided by Ale~~ — Done, 2026-03-14. Full plan in `positionflow_business_plan.md`, key details extracted into overview.md.

## Open Items

- ~~**Phase 0 — Data validation spike**~~ — Done, 2026-03-14. **GO decision.** All columns clean, data matches CFTC viewer exactly. Full results in `scratch/phase0_spike_results.md`.
- ~~**Sprint 1 — Data Foundation**~~ — Done, 2026-03-14. Code repo at `~/dev/claude_dev/positionflow-ai/`. Railway project live (PostgreSQL + Redis). 793 rows backfilled (2011-2026). Signal engine built and run over full history. COVID crash sanity check passed (LF at 99th percentile).
- ~~**Sprint 2 — Signal Engine**~~ — Done, 2026-03-14. Built alongside Sprint 1. Percentile computation, signal rules, constants all in `src/signal/`. 431 extreme signals, 205 high-strength across history.
- **Sprint 3 — API + x402** (Weekend 3): Endpoints, x402 middleware, cron job, Redis cache, deploy to Railway
- **Sprint 4 — MCP + Launch Prep** (Weekend 4): MCP server, OpenAPI docs, landing page, methodology page
- Domain `positionflow.ai` — status? (business plan says "done")
- Decide on shared x402 middleware package vs copy from QuoteNorm
