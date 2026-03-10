# QuoteNorm.ai

## Goal

Become the structured commercial data layer for the agentic commerce stack. Starting wedge: an MCP-first tool (+ REST API) that normalizes messy quotes, proposals, and pricing documents into clean, decision-ready JSON with confidence scores and missing-field alerts.

## What It Is

QuoteNorm.ai is a usage-based MCP tool + API — agents and developers send unstructured commercial inputs (quotes, proposals, pricing pages, offer documents) and get back:

- **Normalized JSON** — structured, comparable fields (pricing, terms, constraints)
- **Confidence scores** — how reliable each extracted field is
- **Missing-field flags** — what the source document doesn't include
- **Comparable pricing/terms** — so agents can evaluate vendors programmatically

## Strategy: MCP-First Distribution, Developer-First Billing

Distribution is agent-native: MCP tool in registries where developers and agents already look (Claude, Cursor, Windsurf). Billing is developer-first: Stripe for humans with credit cards, USDC for autonomous agents (Phase 2).

- **Primary user:** Any developer using AI coding tools who encounters pricing/quote/proposal data. They install QuoteNorm as an MCP tool and use it naturally. Broader than "agent builders" — includes anyone whose AI tool has QuoteNorm in its MCP config.
- **Secondary user (emerging):** Autonomous agents — agents that discover QuoteNorm via AgentsBoard/MCP registries and pay with USDC on Base L2. Pre-funded wallet model.
- **Not end users** — the customer is always a developer or agent/platform, never a human doing manual procurement.

### Why MCP-first
- A developer can DIY quote normalization with a Claude prompt. But an MCP tool removes that friction — it's already there, one call away.
- Agents need tools, not prompts. They don't think "I could DIY this."
- MCP registries are the discovery channel — no signup page needed for discovery.
- Billing still flows through Stripe (developer-first). USDC for autonomous agents in Phase 2.

## Business Model

Usage-based pricing: developers or agents pay per API call.

- **Normalization** — parse and structure a quote/proposal
- **Comparison** — compare multiple normalized quotes
- **Validation** — check terms against policies or requirements

### Dual Payment Layer

1. **Stripe metered billing** (primary) — API keys, usage dashboard, credit card. Standard developer experience.
2. **USDC pre-funded accounts** (secondary) — Agent (or operator) deposits USDC to a QuoteNorm-managed address on Base L2, gets an API credential tied to that balance. Each call deducts from balance. Human tops up, agent spends autonomously.

## Wedge → Platform

| Phase | Scope |
|-------|-------|
| **Wedge** | SaaS quote normalization — narrow, repetitive, high-value, text-heavy |
| **Expand** | B2B vendor proposals, hardware quotes, service agreements |
| **Platform** | Comparison, scoring, policy validation, purchase recommendation — core decision layer in agentic commerce |

## Context

- MCP tool + API — no human-facing UI
- First vertical: SaaS quotes / B2B vendor proposals
- Terms are valuable, repetitive, and text-heavy — ideal for structured extraction
- Long-term play: become the structured commercial data layer of the agentic commerce stack
- MCP-first distribution (registries), developer-first billing (Stripe), agent-native USDC payment path in Phase 2

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-09 | Agent-only API, no human product | Customer is developers/agent platforms, not end users |
| 2026-03-09 | SaaS quotes as first wedge | Narrow, repetitive, high-value, text-heavy — ideal starting vertical |
| 2026-03-09 | Usage-based pricing | Aligns with agent consumption patterns — pay per call |
| 2026-03-09 | MCP-first distribution, developer-first billing | MCP registries are the discovery channel. Billing via Stripe (developers). USDC for autonomous agents in Phase 2. Primary user: any dev using AI tools with QuoteNorm in MCP config. |
| 2026-03-09 | Dual payment: Stripe + USDC (Base L2) | Stripe for developers (primary), USDC pre-funded accounts for agents (secondary). Low incremental effort, positions for agentic commerce wave. |
| 2026-03-09 | Revised revenue projections downward | Original projections ($40K MRR at month 12) were optimistic. Realistic: $8-15K MRR at month 12 for a side project. |
| 2026-03-09 | Gated execution plan | Phase 1: /normalize + text/PDF/URL + Stripe + Python & TS SDKs. Phase 2+ gated on usage signal at month 4. Committed effort ~52 hrs, not 109. |
| 2026-03-09 | TypeScript + Next.js tech stack | Shared stack with AgentsBoard (Prisma, Neon, Vercel), reuse USDC payment code in Phase 2. PDF parsing gap is narrow (most inputs are URLs). If Phase 0 reveals PDF extraction is a bottleneck, pivot to Python before Phase 1. |
| 2026-03-09 | MCP-first distribution | MCP tool is primary distribution (Phase 1), REST API is secondary for power users. Local-first MCP server (`@quotenorm/mcp-server` on npm) calls hosted API. API key required (no anonymous usage). |
| 2026-03-09 | Minimal web dashboard in Phase 1 | `quotenorm.ai/dashboard` — signup (email → API key), key management, usage stats, Stripe billing. Not a landing page, just the auth/billing UI needed for MCP and API users. |
| 2026-03-10 | AleLabs LLC as parent entity | AleLabs LLC (home state, `alelabs.io`) holds QuoteNorm + AgentsBoard as product lines. Form before Stripe goes live. One Stripe account, one bank account. |
| 2026-03-10 | Process-and-delete data policy | Don't store raw input docs — process, return result, delete within 24-48hrs. Disclose Claude API usage in privacy policy. |
