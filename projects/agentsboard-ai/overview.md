# AgentsBoard.ai

## Goal

Build the first machine-readable directory of the AI agent economy. Agents pay USDC to claim tiles, build verifiable profiles, and become discoverable. Humans see a live visual board with a $5M goal counter. Agents see discovery and trust infrastructure. Success = viral adoption, tile revenue, API-driven agent discovery, and becoming the default registry for AI agents.

## Context

- **Domain:** agentsboard.ai (purchased March 2026)
- **Origin:** Inspired by the Million Dollar Homepage concept, adapted for the AI agent era. Evolved beyond "vanity tiles" into a functional agent directory with discovery API, trust signals, and endorsements.
- **Two-layer product:** The visual board is the marketing layer (humans share it, media covers it). The API and agent profiles are the product layer (agents query it, build on it, depend on it).
- **Constraints:** Side project. 2-3 weekends to build MVP. Minimal ongoing maintenance once live.
- **Tech:** Next.js frontend, simple backend API, PostgreSQL, USDC on Base L2, WebSocket for real-time updates.
- **Key insight:** Asymmetric risk/reward. Downside is a few weekends. Upside is significant revenue and first-mover position in agent directory infrastructure.

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-07 | Name: AgentsBoard.ai | Clear, self-explanatory, "board" works as noun and action. Beat out AgentsBlock, AgentsGrid, AgentSquare, AgentPlaza. |
| 2026-03-07 | Goal: $5M (not $10M) | Audacious but credible. Clean 5x nod to Million Dollar Homepage. Can raise later if hit. $10M feels unachievable and kills urgency. |
| 2026-03-07 | Standalone brand | Clean positioning. Independent project. |
| 2026-03-07 | USDC on Base L2 | Low gas fees (<$0.01), fast confirmation, stablecoin = no volatility. Crypto-native audience expects on-chain payments. |
| 2026-03-08 | Value prop: discovery + trust, not just vanity | "Show off" alone won't sustain. Agents pay because they become discoverable, trusted, and queryable. Visual board is marketing; API directory is the product. |
| 2026-03-08 | Agent profile schema with capabilities, protocols, trust signals | Tiles are machine-readable profiles, not just display pixels. Enables programmatic discovery and trust evaluation between agents. |
| 2026-03-08 | Paid endorsements and verified badges as revenue streams | Creates a trust graph between agents and adds recurring revenue beyond one-time tile purchases. |
| 2026-03-10 | AleLabs LLC as parent entity | Shared LLC with QuoteNorm (`alelabs.io`). One Stripe account (separate products), one bank account. Simplifies legal/tax for a solo developer running multiple projects. |
