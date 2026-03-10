# Brief

## Questions

- What does the normalized output schema look like? Define the JSON structure for a SaaS quote (pricing tiers, billing frequency, contract length, limits, overage costs, hidden fees, support level, etc.)
- What input formats need to be supported first? (plain text, PDF, HTML pricing pages, email body)
- What LLM extraction pipeline? (Claude for parsing, structured output, confidence scoring)
- How to handle confidence scoring — per-field or per-document?
- What's the MVP API surface? (single endpoint: POST /normalize, or multiple?)

## Directives

- **Phase 0: Validate the core** — Collect 15+ real SaaS quotes, finalize schema, build extraction pipeline, test accuracy. Answer: is this meaningfully better than prompting Claude directly?
- **Phase 1: Ship /normalize with text + PDF + URL, Stripe, Python SDK** — Get a credible product live that developers can actually try. No /compare, no USDC yet.

## Open Items

- Tech stack decision (mirrors AgentsBoard with Next.js + Prisma, or standalone Python/FastAPI?)
- Pricing model specifics (per-call tiers, free tier for adoption?)
- First demo input: find or create a sample SaaS quote to test normalization against
- Competitive landscape: any existing quote normalization APIs?

### Gated on Phase 1 signal (month 4 decision gate)
- USDC payment implementation: wallet management, on-chain verification, balance tracking — coordinate with AgentsBoard USDC patterns
- `/v1/compare` endpoint
- MCP tool + AgentsBoard listing
- Community launch and outreach

### Gated on paying customers
- `/v1/validate` endpoint
- TypeScript SDK
- LangChain/CrewAI integrations
- Vendor fingerprinting
- Landing page beyond docs
