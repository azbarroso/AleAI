# Brief

## Questions

- What does the normalized output schema look like? Define the JSON structure for a SaaS quote (pricing tiers, billing frequency, contract length, limits, overage costs, hidden fees, support level, etc.)
- What input formats need to be supported first? (plain text, PDF, HTML pricing pages, email body)
- What LLM extraction pipeline? (Claude for parsing, structured output, confidence scoring)
- How to handle confidence scoring — per-field or per-document?
- What's the MVP API surface? (single endpoint: POST /normalize, or multiple?)

## Directives

- **Design USDC pre-funded account payment flow** — Define the stablecoin payment architecture for agent-native consumption:
  - Pre-funded account model: agent/operator deposits USDC to QuoteNorm-managed address on Base L2
  - API credential tied to balance, each call deducts
  - Reuse patterns from AgentsBoard USDC implementation where possible
  - Document the agent payment flow: deposit → credential → API call → deduction → top-up
- **Revise GTM to developer-first** — Ensure all Phase 1-2 execution targets developers (Stripe, API keys, docs, content marketing) with USDC added in Phase 2

## Open Items

- Tech stack decision (mirrors AgentsBoard with Next.js + Prisma, or standalone Python/FastAPI?)
- Pricing model specifics (per-call tiers, free tier for adoption?)
- First demo input: find or create a sample SaaS quote to test normalization against
- Competitive landscape: any existing quote normalization APIs?
- USDC payment implementation: wallet management, on-chain verification, balance tracking — coordinate with AgentsBoard USDC patterns
- Decision point at month 4: if neither developer nor agent usage shows traction, park the project
- Watch signal: ratio of developer (Stripe) vs agent (USDC) usage to determine where to double down
