# QuoteNorm.ai

## Goal

Become the structured commercial data layer for the agentic commerce stack. Starting wedge: an agent-only API that normalizes messy quotes, proposals, and pricing documents into clean, decision-ready JSON with confidence scores and missing-field alerts.

## What It Is

QuoteNorm.ai is an agent-only API — no human-facing product. Agents send unstructured commercial inputs (quotes, proposals, pricing pages, offer documents) and get back:

- **Normalized JSON** — structured, comparable fields (pricing, terms, constraints)
- **Confidence scores** — how reliable each extracted field is
- **Missing-field flags** — what the source document doesn't include
- **Comparable pricing/terms** — so agents can evaluate vendors programmatically

## Who It's For

- Agent builders who need reliable, machine-readable commercial data
- Agent platforms where agents compare vendors or make purchase decisions
- Not end users — the customer is a developer or agent platform

## Business Model

Usage-based pricing: agents or agent builders pay per API call.

- **Normalization** — parse and structure a quote/proposal
- **Comparison** — compare multiple normalized quotes
- **Validation** — check terms against policies or requirements

## Wedge → Platform

| Phase | Scope |
|-------|-------|
| **Wedge** | SaaS quote normalization — narrow, repetitive, high-value, text-heavy |
| **Expand** | B2B vendor proposals, hardware quotes, service agreements |
| **Platform** | Comparison, scoring, policy validation, purchase recommendation — core decision layer in agentic commerce |

## Context

- No human-facing UI — agent-to-agent service (API only)
- First vertical: SaaS quotes / B2B vendor proposals
- Terms are valuable, repetitive, and text-heavy — ideal for structured extraction
- Long-term play: become the structured commercial data layer of the agentic commerce stack

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-09 | Agent-only API, no human product | Customer is developers/agent platforms, not end users |
| 2026-03-09 | SaaS quotes as first wedge | Narrow, repetitive, high-value, text-heavy — ideal starting vertical |
| 2026-03-09 | Usage-based pricing | Aligns with agent consumption patterns — pay per call |
