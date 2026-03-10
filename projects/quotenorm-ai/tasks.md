# Brief

## Questions

- ~~What does the normalized output schema look like?~~ — Done, defined in business plan Section 5
- ~~What input formats need to be supported first?~~ — Done, Phase 1: text + PDF + URL
- ~~What LLM extraction pipeline?~~ — Done, Claude API with structured output
- ~~How to handle confidence scoring — per-field or per-document?~~ — Done, per-field (see schema)
- ~~What's the MVP API surface?~~ — Done, single endpoint POST /v1/normalize, gated expansion

## Directives

- **Phase 0: Validate the core** — Collect 15+ real SaaS quotes, finalize schema, build extraction pipeline, test accuracy. Answer: is this meaningfully better than prompting Claude directly?
- **Phase 1: Ship /normalize as MCP tool + REST API** — Build shared extractor (`src/lib/extractor.ts`), publish local MCP server (`@quotenorm/mcp-server` on npm), REST API on Vercel/Railway, minimal dashboard (signup + key mgmt + billing), Stripe billing, Python/TS SDKs. No /compare, no USDC yet.

## Open Items

- ~~Tech stack decision~~ — Done, TypeScript/Next.js + Prisma + Neon (shared with AgentsBoard). Pivot to Python if Phase 0 PDF extraction is a bottleneck.
- ~~Pricing model specifics (per-call tiers, free tier for adoption?)~~ — Done, defined in business plan Section 6 (free tier 50 calls/month, paid tiers usage-based)
- First demo input: find or create a sample SaaS quote to test normalization against
- Competitive landscape: any existing quote normalization APIs?

### Pre-Phase 1: Business Setup
- Register `quotenorm.ai` domain
- Set up email forwarding (`support@quotenorm.ai` → personal)
- Form AleLabs LLC — parent entity for QuoteNorm + AgentsBoard (`alelabs.io`). Home state, before turning on Stripe billing.
- Get EIN for AleLabs LLC (free, IRS online)
- Open business bank account under AleLabs LLC (Mercury or similar)
- Create Stripe account under AleLabs LLC (separate products per project)
- Draft privacy policy + terms of service (generator + customize data handling/accuracy disclaimers)
- Decide data retention policy (process and delete raw input? retention window?)
- Disclose Claude API usage in privacy policy (Anthropic doesn't train on API inputs)

### Gated on Phase 1 signal (month 4 decision gate)
- USDC payment implementation: wallet management, on-chain verification, balance tracking — coordinate with AgentsBoard USDC patterns
- `/v1/compare` endpoint
- AgentsBoard listing
- Community launch and outreach

### Gated on paying customers
- `/v1/validate` endpoint
- LangChain/CrewAI integrations
- Vendor fingerprinting
- Landing page beyond docs
