# Log

### 2026-03-14

- Project created from initial concept discussion
- Full business plan (`positionflow_business_plan.md`) integrated into project files
- **Summary:** PositionFlow.ai is an agent-native API for CFTC TFF ES futures positioning data. Two endpoints (`/es/latest` $0.25, `/es/history` $1.00), x402 pay-per-call, MCP server. Leveraged Funds crowding as primary signal with Asset Manager confirmation context. Categorical signals with `rules_triggered` for full auditability.
- Key architecture decisions documented: TFF over Legacy, 13874+ consolidated, categorical signals, open methodology, 2011+ history
- Tech stack: Node.js/TS + Express + PostgreSQL + Redis on Railway (same pattern as QuoteNorm)
- 4-sprint build plan: data foundation → signal engine → API + x402 → MCP + launch
- Next step: Phase 0 data validation spike (download TFF files, verify columns, test percentile logic manually)
