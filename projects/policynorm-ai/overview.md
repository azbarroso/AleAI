# PolicyNorm.ai

## Goal

Become the policy intelligence layer for the agentic web. Starting wedge: an x402-native API that normalizes messy Terms of Service, Privacy Policies, and DPAs into structured, decision-ready JSON with risk flags, unusual clause detection, and confidence scores. Agents pay per-request with USDC on Base — no accounts, no API keys, no subscriptions.

## What It Is

PolicyNorm.ai is an x402-native API — agents pay per-request with USDC on Base L2, no accounts or API keys needed. Send unstructured legal/policy documents (ToS, Privacy Policies, DPAs) and get back:

- **Structured JSON** — data practices, user rights, retention policies, security posture, jurisdiction
- **Risk flags** — high/medium/low risk items with explanations
- **Notable clauses** — unusual or potentially problematic clauses flagged with risk level
- **Confidence scores** — how reliable each extracted field is
- **Missing sections** — what the document doesn't cover

A free sandbox endpoint (`/v1/sandbox/normalize`) returns truncated output for evaluation — no wallet required.

## Strategy: x402-Only, Agent-Native

Payment is via x402 protocol (HTTP 402 + USDC on Base L2). No Stripe, no accounts, no API keys, no subscriptions. Agents pay per-request at the HTTP layer. A sandbox endpoint provides free, truncated access for evaluation.

- **Primary user:** Autonomous agents with funded USDC wallets — agents that need to understand terms before signing up for services, interacting with APIs, or processing user data on behalf of users.
- **Secondary user:** Developers evaluating PolicyNorm via the sandbox endpoint, then integrating it into agent workflows with x402-compatible clients.
- **Not end users** — the customer is always a developer or agent/platform, never a human reading a privacy policy.

### Why x402-only
- Same rationale as QuoteNorm: walk the talk as agent-native infrastructure.
- x402 eliminates the entire auth+billing stack: no user accounts, no API key management, no Stripe webhooks, no billing dashboard, no signup flow. One line of middleware.
- The x402 ecosystem is growing fast (Coinbase, Stripe, Etherlink). Positioning as x402-native now plants a flag early.
- Developers can still evaluate via the sandbox endpoint (no wallet needed) before committing.
- MCP registries remain the discovery channel — MCP tool wraps the x402 API.

### Why PolicyNorm over other ideas
- **Broader market than QuoteNorm:** Every autonomous agent interacting with web services needs to understand terms — not just procurement agents.
- **Higher per-call value:** $0.25/call (legal/compliance commands premium pricing).
- **Stronger moat:** 10-50 page legal docs are hard for raw LLM; risk flagging + clause detection + cross-vendor comparison adds real value beyond simple extraction.
- **Safety narrative:** Agent safety infrastructure — agents MUST understand terms before signing up for services. This is a compliance/safety story, not just a convenience story.
- **Same build cost:** ~50 hrs, same stack, same x402 pattern as QuoteNorm.

## Business Model

Usage-based pricing via x402: agents pay per API call with USDC on Base L2.

### API Surface

| Endpoint | Payment | Price | Description |
|----------|---------|-------|-------------|
| `POST /v1/normalize` | x402, USDC | $0.25 | Full structured policy JSON |
| `POST /v1/sandbox/normalize` | Free | — | Truncated output for evaluation |
| `POST /v1/compare` | x402, USDC | $0.35 | Side-by-side policy comparison (Phase 2) |
| `POST /v1/check` | x402, USDC | $0.40 | Check policy against requirements (Phase 3) |

### Output Schema (key fields)

- `vendor`, `document_type`, `effective_date`, `last_updated`
- `data_collected[]` — what, purpose, legal_basis
- `data_shared_with[]` — who, purpose, opt_out
- `retention` — period, deletion_rights, deletion_process
- `user_rights` — access, portability, deletion, opt_out
- `security` — encryption, certifications, breach_notification
- `jurisdiction`, `governing_law`, `dispute_resolution`
- `notable_clauses[]` — clause, risk_level, explanation
- `risk_flags[]` — high/medium/low, description
- `confidence{}` — overall, per_field
- `missing_sections[]`

## Wedge → Platform

| Phase | Scope |
|-------|-------|
| **Wedge** | SaaS Terms of Service — common, text-heavy, standardized enough for structured extraction |
| **Expand** | Privacy Policies, DPAs, SLAs |
| **Platform** | Full contract analysis, compliance checking, policy monitoring, vendor risk scoring |

## Execution (Gated)

| Phase | Timeline | Scope | Gate |
|-------|----------|-------|------|
| Phase 0 | Weeks 1-2 | Collect 15+ real ToS/policies, design schema, test extraction quality | Quality: can we reliably extract structured data from real policies? |
| Phase 1 | Weeks 3-5 | x402 API + sandbox endpoint + MCP tool | Ship it |
| Phase 2+ | Gated | Compare endpoint, broader doc types | Month-4 signal: 5+ paying wallets |

## Context

- x402-native API + MCP tool — no human-facing UI (except sandbox endpoint)
- First vertical: SaaS Terms of Service
- Legal docs are long, repetitive, and text-heavy — ideal for structured extraction + risk flagging
- Long-term play: become the policy intelligence layer for the agentic web
- Under AleLabs LLC (same parent entity as QuoteNorm and AgentsBoard)
- Same tech stack: Express, TypeScript, Claude API, x402, Neon, Railway/Vercel
- Shared x402 facilitator setup and Base L2 wallet with QuoteNorm
- Separate codebase and domain (`policynorm.ai`)

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-11 | Create PolicyNorm as new project | Strongest candidate from x402-native brainstorm — broader market, higher per-call value, stronger moat than QuoteNorm |
| 2026-03-11 | x402-only payment from day one | Same pattern as QuoteNorm. Eliminates accounts, API keys, Stripe, dashboard. |
| 2026-03-11 | $0.25/call pricing | Legal/compliance commands premium over QuoteNorm's $0.10. Justified by document complexity and value of risk analysis. |
| 2026-03-11 | SaaS ToS as first wedge | Common, text-heavy, standardized enough. Privacy Policies and DPAs expand in Phase 2. |
| 2026-03-11 | Gated execution (same as QuoteNorm) | Phase 2+ gated on month-4 signal (5+ paying wallets). Don't over-build before validation. |
| 2026-03-11 | AleLabs LLC parent entity | Same parent as QuoteNorm and AgentsBoard. Shared wallet, shared learnings. |
