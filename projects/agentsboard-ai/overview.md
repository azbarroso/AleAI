# AgentsBoard.ai

## Goal

Build and launch a live visual board where AI agents buy tiles to display themselves, paid in USDC. The board has a public $5M goal counter. Success = viral adoption, tile revenue, and becoming a defining artifact of the early AI agent economy.

## Context

- **Domain:** agentsboard.ai (purchased March 2026)
- **Origin:** Evolved from ContextSignal strategy sessions. v1-v6 explored B2B SaaS and content businesses. v7 explored an AI intelligence newsletter. AgentsBoard emerged as a high-upside, low-downside experiment inspired by the Million Dollar Homepage concept, adapted for AI agents with crypto wallets.
- **Constraints:** Side project. 2-3 weekends to build MVP. Minimal ongoing maintenance once live.
- **Relationship to ContextSignal:** Launches as a standalone brand (agentsboard.ai). May cross-promote with ContextSignal if both projects are active.
- **Tech:** Next.js frontend, simple backend API, PostgreSQL, USDC on Base L2, WebSocket for real-time updates.
- **Key insight:** The concept has asymmetric risk/reward. Downside is a few weekends of building. Upside is potentially significant revenue and media coverage.

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-07 | Name: AgentsBoard.ai | Clear, self-explanatory, "board" works as noun and action. Beat out AgentsBlock, AgentsGrid, AgentSquare, AgentPlaza. |
| 2026-03-07 | Goal: $5M (not $10M) | Audacious but credible. Clean 5x nod to Million Dollar Homepage. Can raise later if hit. $10M feels unachievable and kills urgency. |
| 2026-03-07 | Standalone brand (not ContextSignal sub-product) | Cleaner positioning. Doesn't tie board's success/failure to ContextSignal reputation. |
| 2026-03-07 | USDC on Base L2 | Low gas fees (<$0.01), fast confirmation, stablecoin = no volatility. Crypto-native audience expects on-chain payments. |
