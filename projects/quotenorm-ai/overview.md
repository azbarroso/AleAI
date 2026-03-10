# QuoteNorm.ai

## Goal

Become the structured commercial data layer for the agentic commerce stack. Starting wedge: a developer-first, agent-ready API that normalizes messy quotes, proposals, and pricing documents into clean, decision-ready JSON with confidence scores and missing-field alerts.

## What It Is

QuoteNorm.ai is a usage-based API — developer-first with an agent-native path. Developers (and eventually autonomous agents) send unstructured commercial inputs (quotes, proposals, pricing pages, offer documents) and get back:

- **Normalized JSON** — structured, comparable fields (pricing, terms, constraints)
- **Confidence scores** — how reliable each extracted field is
- **Missing-field flags** — what the source document doesn't include
- **Comparable pricing/terms** — so agents can evaluate vendors programmatically

## Strategy: Developer-First, Agent-Ready

Target developers NOW (they pay with Stripe, they exist today), but design the API and payment layer so agents can consume it directly when the infra matures.

- **Primary customer (today):** Agent builders — developers integrating QuoteNorm into their agent code. Standard API keys, Stripe billing, credit cards.
- **Secondary customer (emerging):** Autonomous agents — agents that discover QuoteNorm via AgentsBoard/MCP registries and pay with USDC on Base L2. Pre-funded wallet model.
- **Not end users** — the customer is always a developer or agent/platform, never a human doing manual procurement.

### Why dual-track
- Developers exist today. Agents with wallets and purchasing autonomy are 12-24 months from critical mass.
- Building agent-native payment (USDC) from the start is low incremental effort and positions for the wave.
- Watch usage signals: if 80%+ comes from developers, stay developer-focused. If agent-native picks up, invest more there.

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

- API-only — no human-facing UI
- First vertical: SaaS quotes / B2B vendor proposals
- Terms are valuable, repetitive, and text-heavy — ideal for structured extraction
- Long-term play: become the structured commercial data layer of the agentic commerce stack
- Developer-first GTM with agent-native USDC payment path built in from early phases

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-09 | Agent-only API, no human product | Customer is developers/agent platforms, not end users |
| 2026-03-09 | SaaS quotes as first wedge | Narrow, repetitive, high-value, text-heavy — ideal starting vertical |
| 2026-03-09 | Usage-based pricing | Aligns with agent consumption patterns — pay per call |
| 2026-03-09 | Developer-first, agent-ready strategy | Developers exist today with credit cards; agent-native commerce is 12-24mo from critical mass. Build for devs now, support agents when ready. |
| 2026-03-09 | Dual payment: Stripe + USDC (Base L2) | Stripe for developers (primary), USDC pre-funded accounts for agents (secondary). Low incremental effort, positions for agentic commerce wave. |
| 2026-03-09 | Revised revenue projections downward | Original projections ($40K MRR at month 12) were optimistic. Realistic: $8-15K MRR at month 12 for a side project. |
| 2026-03-09 | Gated execution plan | Phase 1: /normalize + text/PDF/URL + Stripe + Python SDK. Phase 2+ gated on usage signal at month 4. Committed effort ~52 hrs, not 109. |
