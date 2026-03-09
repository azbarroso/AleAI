# Brief

## Questions

- What does the normalized output schema look like? Define the JSON structure for a SaaS quote (pricing tiers, billing frequency, contract length, limits, overage costs, hidden fees, support level, etc.)
- What input formats need to be supported first? (plain text, PDF, HTML pricing pages, email body)
- What LLM extraction pipeline? (Claude for parsing, structured output, confidence scoring)
- How to handle confidence scoring — per-field or per-document?
- What's the MVP API surface? (single endpoint: POST /normalize, or multiple?)

## Directives

_Waiting for direction on first steps — API design, tech stack, or market research._

## Open Items

- Tech stack decision (mirrors AgentsBoard with Next.js + Prisma, or standalone Python/FastAPI?)
- Pricing model specifics (per-call tiers, free tier for adoption?)
- First demo input: find or create a sample SaaS quote to test normalization against
- Competitive landscape: any existing quote normalization APIs?
