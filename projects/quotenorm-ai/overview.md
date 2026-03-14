# QuoteNorm.ai

## Goal

Become the structured commercial data layer for the agentic commerce stack. Starting wedge: an x402-native API that normalizes messy quotes, proposals, and pricing documents into clean, decision-ready JSON with confidence scores and missing-field alerts. Agents pay per-request with USDC on Base — no accounts, no API keys, no subscriptions.

## What It Is

QuoteNorm.ai is an x402-native API — agents pay per-request with USDC on Base L2, no accounts or API keys needed. Send unstructured commercial inputs (quotes, proposals, pricing pages, offer documents) and get back:

- **Normalized JSON** — structured, comparable fields (pricing, terms, constraints)
- **Confidence scores** — how reliable each extracted field is
- **Missing-field flags** — what the source document doesn't include
- **Comparable pricing/terms** — so agents can evaluate vendors programmatically

A free sandbox endpoint (`/v1/sandbox/normalize`) returns truncated output for evaluation — no wallet required.

## Strategy: x402-Only, Agent-Native

Payment is via x402 protocol (HTTP 402 + USDC on Base L2). No Stripe, no accounts, no API keys, no subscriptions. Agents pay per-request at the HTTP layer. A sandbox endpoint provides free, truncated access for evaluation.

- **Primary user:** Autonomous agents with funded USDC wallets — agents that discover QuoteNorm via MCP registries, AgentsBoard, or agent framework tool lists and pay per-call via x402.
- **Secondary user:** Developers evaluating QuoteNorm via the sandbox endpoint, then integrating it into agent workflows with x402-compatible clients.
- **Not end users** — the customer is always a developer or agent/platform, never a human doing manual procurement.

### Why x402-only
- QuoteNorm claims to be "the structured data layer for agentic commerce" — it should itself be consumable by agents natively. Walk the talk.
- x402 eliminates the entire auth+billing stack: no user accounts, no API key management, no Stripe webhooks, no billing dashboard, no signup flow. One line of middleware.
- The x402 ecosystem is growing fast (Coinbase, Stripe, Etherlink). Positioning as x402-native now plants a flag early.
- Developers can still evaluate via the sandbox endpoint (no wallet needed) before committing.
- MCP registries remain the discovery channel — MCP tool wraps the x402 API.

## Business Model

Usage-based pricing via x402: agents pay per API call with USDC on Base L2.

- **Normalization** — parse and structure a quote/proposal
- **Comparison** — compare multiple normalized quotes (Phase 2+)
- **Validation** — check terms against policies or requirements (Phase 3+)

### Single Payment Layer: x402

- **x402 protocol** — HTTP 402 + USDC on Base L2. No accounts, no API keys, no pre-funded balances.
- Agent sends request → server responds 402 with payment instructions → agent pays → server delivers response.
- Per-request pricing (e.g., $0.10/normalize). Micropayments enabled — x402 supports as low as $0.001/request.
- Zero protocol fees (only nominal Base L2 gas).
- **Sandbox endpoint** — `/v1/sandbox/normalize` returns truncated output (e.g., first 3 fields only) for free, no wallet required. Lets developers evaluate quality before integrating x402 payments.

## Wedge → Platform

| Phase | Scope |
|-------|-------|
| **Wedge** | SaaS quote normalization — narrow, repetitive, high-value, text-heavy |
| **Expand** | B2B vendor proposals, hardware quotes, service agreements |
| **Platform** | Comparison, scoring, policy validation, purchase recommendation — core decision layer in agentic commerce |

## Context

- x402-native API + MCP tool — no human-facing UI (except sandbox endpoint)
- First vertical: SaaS quotes / B2B vendor proposals
- Terms are valuable, repetitive, and text-heavy — ideal for structured extraction
- Long-term play: become the structured commercial data layer of the agentic commerce stack
- x402 payment (USDC on Base L2) from day one — no Stripe, no accounts, no API keys
- MCP registries remain the primary discovery channel

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-09 | Agent-only API, no human product | Customer is developers/agent platforms, not end users |
| 2026-03-09 | SaaS quotes as first wedge | Narrow, repetitive, high-value, text-heavy — ideal starting vertical |
| 2026-03-09 | Usage-based pricing | Aligns with agent consumption patterns — pay per call |
| 2026-03-09 | ~~MCP-first distribution, developer-first billing~~ | ~~MCP registries are the discovery channel. Billing via Stripe (developers). USDC for autonomous agents in Phase 2.~~ — Superseded 2026-03-11, replaced by x402-only strategy. |
| 2026-03-09 | ~~Dual payment: Stripe + USDC (Base L2)~~ | ~~Stripe for developers (primary), USDC pre-funded accounts for agents (secondary).~~ — Superseded 2026-03-11, replaced by x402-only strategy. |
| 2026-03-09 | Revised revenue projections downward | Original projections ($40K MRR at month 12) were optimistic. Further revised 2026-03-11 for x402-only: $5-10K MRR at month 12 (narrower addressable market but lower engineering cost). |
| 2026-03-09 | ~~Gated execution plan~~ | ~~Phase 1: /normalize + text/PDF/URL + Stripe + Python & TS SDKs.~~ — Superseded 2026-03-11, Phase 1 now x402-based (no Stripe, no dashboard, no SDKs in Phase 1). Gated execution still applies. |
| 2026-03-09 | TypeScript + Next.js tech stack | Shared stack with AgentsBoard (Prisma, Neon, Vercel). x402 npm package is TypeScript-native. PDF parsing gap is narrow (most inputs are URLs). If Phase 0 reveals PDF extraction is a bottleneck, pivot to Python before Phase 1. |
| 2026-03-09 | ~~MCP-first distribution~~ | ~~MCP tool is primary distribution (Phase 1), REST API is secondary. API key required.~~ — Superseded 2026-03-11. MCP is still a distribution channel but x402 API is primary. No API keys needed (x402 handles auth+payment). |
| 2026-03-09 | ~~Minimal web dashboard in Phase 1~~ | ~~`quotenorm.ai/dashboard` — signup, key management, usage stats, Stripe billing.~~ — Superseded 2026-03-11. No dashboard needed — x402 eliminates accounts, keys, and Stripe billing entirely. |
| 2026-03-10 | AleLabs LLC as parent entity | AleLabs LLC (home state, `alelabs.io`) holds QuoteNorm + AgentsBoard as product lines. Form before going live. One bank account, USDC wallet on Base L2. |
| 2026-03-10 | Process-and-delete data policy | Don't store raw input docs — process, return result, delete within 24-48hrs. Disclose Claude API usage in privacy policy. |
| 2026-03-11 | x402-only payment from Phase 1 | Replace Stripe + USDC dual payment with x402 protocol (HTTP 402 + USDC on Base L2) as the sole payment method from day one. Eliminates accounts, API keys, Stripe, dashboard. One line of middleware. |
| 2026-03-11 | Sandbox endpoint for discovery | `/v1/sandbox/normalize` returns truncated output (first 3 fields) for free, no wallet required. Allows developers to evaluate quality without x402 setup. Preserves trial/discovery path without reintroducing accounts. |
| 2026-03-11 | Drop Stripe, dashboard, API keys from Phase 1 | x402 handles auth+payment at the HTTP layer. No user accounts, no key management, no billing UI. Dramatically simplifies MVP scope and cuts Phase 1 effort. |
| 2026-03-12 | Phase 0 GO — proceed to Phase 1 | All 6 criteria passed: extraction accuracy >85%, schema covers all input types, x402 production-viable (75M txns), cost ~$0.003/call (Haiku), clear value over raw Claude. |
| 2026-03-12 | ~~TypeScript + Next.js tech stack~~ | ~~Shared stack with AgentsBoard.~~ — Superseded 2026-03-12: Switch to Express. x402 has native Express middleware; QuoteNorm is a pure API with no frontend. Next.js adds unnecessary complexity. |
| 2026-03-12 | Express + TypeScript tech stack | x402 `@x402/express` has native Express middleware. QuoteNorm is a pure API — no SSR, no React, no pages. Express is simpler and cleaner. Deploy on Railway or Vercel (Express adapter). |
| 2026-03-12 | Haiku-first, Sonnet fallback extraction | Claude Haiku at ~$0.003/call gives 97% margin. Sonnet fallback only if confidence drops below 0.70. |
| 2026-03-12 | Schema v1 locked (plans[] array structure) | Validated against 5 diverse samples. `plans[]` handles tiered SaaS, multi-product, rate cards, and enterprise components. |
| 2026-03-13 | Third-party x402 facilitator over CDP | CDP requires JWT auth (key ID + secret, 2-min expiry). Open facilitators from x402 ecosystem support Base mainnet with no auth. Simpler, sufficient for v1. |
| 2026-03-13 | Deploy on Railway | Auto-deploy on push to `main`. Custom domain `api.quotenorm.ai`. |
| 2026-03-14 | Landing page on Cloudflare Pages | Single static page at `quotenorm.ai`. Dark theme, live demo (sandbox + paid x402), MetaMask wallet connection. Deployed from `site/` folder in code repo. |
| 2026-03-14 | Manual EIP-3009 signing over @x402 client libs | Browser-side x402 payment uses direct `eth_signTypedData_v4` via MetaMask instead of `@x402/evm` client. Eliminates esm.sh/viem version mismatch issues that caused `invalid_exact_evm_payload_signature`. |
