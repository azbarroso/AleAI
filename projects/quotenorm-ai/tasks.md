# Brief

## Questions

- ~~What does the normalized output schema look like?~~ — Done, defined in business plan Section 5
- ~~What input formats need to be supported first?~~ — Done, Phase 1: text + PDF + URL
- ~~What LLM extraction pipeline?~~ — Done, Claude API with structured output
- ~~How to handle confidence scoring — per-field or per-document?~~ — Done, per-field (see schema)
- ~~What's the MVP API surface?~~ — Done, single endpoint POST /v1/normalize, gated expansion

## Directives

- ~~**Phase 0: Validate the core** — Collect 15+ real SaaS quotes, finalize schema, build extraction pipeline, test accuracy. Answer: is this meaningfully better than prompting Claude directly?~~ — Done 2026-03-12. GO decision. 14 test samples, schema v1 validated, extraction avg confidence 0.83, x402 production-ready, Haiku cost ~$0.003/call.
- ~~**Phase 1: Ship /normalize as MCP tool + REST API** — Build shared extractor (`src/lib/extractor.ts`), publish local MCP server (`@quotenorm/mcp-server` on npm), REST API on Vercel/Railway, minimal dashboard (signup + key mgmt + billing), Stripe billing, Python/TS SDKs. No /compare, no USDC yet.~~ — Superseded 2026-03-11, replaced by x402-only Phase 1.
- ~~**Phase 1: Ship /normalize as x402-native API** — Build extraction pipeline, `POST /v1/normalize` with x402 payment middleware (USDC on Base L2), `POST /v1/sandbox/normalize` (free, truncated output), MCP tool wrapping the x402 API. No Stripe, no accounts, no API keys, no dashboard, no SDKs.~~ — Scaffolding done 2026-03-13. Code repo live on GitHub (`azbarroso/quotenorm-ai`). Extraction pipeline, x402 middleware, sandbox endpoint all working. Still needed: deploy, MCP tool, real-world testing with full-length docs.

## Open Items

- ~~Tech stack decision~~ — Revised 2026-03-12: Express + TypeScript (not Next.js). x402 has native Express middleware; pure API doesn't need Next.js.
- ~~Pricing model specifics (per-call tiers, free tier for adoption?)~~ — Revised 2026-03-11: x402 per-request pricing ($0.10/normalize). Sandbox replaces free tier.
- ~~First demo input: find or create a sample SaaS quote to test normalization against~~ — Done 2026-03-12. 14 test samples collected (11 real + 3 mock).
- Competitive landscape: any existing quote normalization APIs?
- ~~x402 middleware: evaluate Coinbase's x402 npm package, understand facilitator setup and USDC settlement on Base L2~~ — Done 2026-03-12. `@x402/express` middleware, Coinbase hosted facilitator, Base L2 gas ~$0.001-0.005. See `scratch/x402/x402-evaluation.md`.
- ~~Sandbox endpoint design: what fields to truncate/redact?~~ — Done 2026-03-12. First 2 plans, no confidence details. Separate route (no x402 middleware). IP rate-limited.
- ~~Verify `@x402/http` and `@x402/mcp` are published on npm (v2 packages) before scaffolding Phase 1~~ — Done 2026-03-13. Actual packages: `@x402/express`, `@x402/evm`, `@x402/core` (all v2.6.0).
- Test extraction on full-length real HTML pages and PDFs (not just pre-processed text snapshots)

### Pre-Phase 1: Business Setup
- Register `quotenorm.ai` domain
- Set up email forwarding (`support@quotenorm.ai` → personal)
- Form AleLabs LLC — parent entity for QuoteNorm + AgentsBoard (`alelabs.io`). Home state.
- Get EIN for AleLabs LLC (free, IRS online)
- Open business bank account under AleLabs LLC (Mercury or similar)
- ~~Create Stripe account under AleLabs LLC (separate products per project)~~ — Not needed, 2026-03-11. x402 replaces Stripe. USDC settles on Base L2.
- Set up x402 facilitator account (Coinbase or self-hosted) for USDC settlement on Base L2
- Set up wallet for receiving USDC payments on Base L2
- Draft privacy policy + terms of service (generator + customize data handling/accuracy disclaimers)
- Decide data retention policy (process and delete raw input? retention window?)
- Disclose Claude API usage in privacy policy (Anthropic doesn't train on API inputs)

### Gated on Phase 1 signal (month 4 decision gate)
- ~~USDC payment implementation: wallet management, on-chain verification, balance tracking~~ — Not needed, 2026-03-11. x402 handles payment from Phase 1.
- `/v1/compare` endpoint
- AgentsBoard listing
- Community launch and outreach
- Python + TypeScript SDKs (with x402 payment handling built in)

### Gated on paying customers
- `/v1/validate` endpoint
- LangChain/CrewAI integrations
- Vendor fingerprinting
- Landing page beyond docs
