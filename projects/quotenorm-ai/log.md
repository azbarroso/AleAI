# Log

### 2026-03-13 — Phase 1 Scaffolding Complete

- Code repo scaffolded at `~/dev/claude_dev/quotenorm-ai/` and pushed to GitHub (`azbarroso/quotenorm-ai`)
- **Files created:** Express server (`src/index.ts`), extraction pipeline (`src/lib/extractor.ts`), schema types (`src/lib/schema.ts`), config (`src/lib/config.ts`), normalize route with x402 middleware (`src/routes/normalize.ts`), sandbox route (`src/routes/sandbox.ts`), rate limiter (`src/middleware/rateLimit.ts`)
- **Dependencies:** `@x402/express`, `@x402/evm`, `@x402/core` (all v2.6.0), `@anthropic-ai/sdk`, `express`, `dotenv`
- **Verified x402 packages:** Actual npm packages differ from evaluation notes — `@x402/express` (not `@x402/http`), `@x402/evm` (not `@x402/mechanisms`)
- **Sandbox endpoint tested:** `POST /v1/sandbox/normalize` successfully extracted 2 plans from minimal pricing text. Haiku handled it in ~4 seconds, confidence 0.70.
- Typecheck passes clean
- **Next:** Deploy (Railway), MCP tool, test with full-length documents, set up x402 wallet

### 2026-03-09

- Project created
- Captured core concept: agent-only API for normalizing quotes/proposals into structured JSON
- Key positioning: no human product, developer/agent platform customers only
- Wedge: SaaS quote normalization → expand to full agentic commerce data layer
- Business model: usage-based (per normalization, comparison, validation call)
- Created QuoteNorm-BusinessPlan-v1.md — covers problem, solution, market sizing, product schema, pricing, competitive landscape, GTM, tech stack, risks, and success metrics
- Added Section 14: Execution Plan — 5 phases over ~22 weeks (Foundation → MVP API → Quality & Distribution → Compare & Monetize → Validate & Scale), with week-by-week deliverables, time budget (~109 hrs total), and a concrete first session plan

### 2026-03-09 — Strategic Review

- **Core finding:** Business plan had a tension — "agent-only API" positioning but developer-focused GTM. These are different customers with different discovery, payment, and adoption patterns.
- **Decision: Developer-first, agent-ready.** Target developers now (they exist, they have credit cards), but design API and payment layer so agents can consume directly when infra matures.
- **Dual payment layer added:**
  - Primary: Stripe metered billing (developers)
  - Secondary: USDC pre-funded accounts on Base L2 (agents) — deposit USDC, get API credential tied to balance, each call deducts
- **Revenue projections revised downward:** Original ($40K MRR at month 12) was optimistic for a niche side project. Realistic: $8-15K MRR at month 12.
  - Key challenge: narrow funnel (developers building procurement agents AND processing enough quotes AND willing to pay vs. DIY with Claude)
  - CAC $50-100 unrealistic for niche B2B developer API
- **Month 4 decision gate added:** If neither developer nor agent usage shows traction, park the project.
- **Stablecoin payment section (9b) added to business plan** — full pre-funded account architecture, Base L2 USDC integration design, synergy with AgentsBoard USDC patterns.
- **GTM revised:** Weeks 1-5 developer-only (Stripe), weeks 6-9 add USDC + AgentsBoard listing + MCP tool, week 10+ follow the signal.
- Updated overview.md, tasks.md, business plan, and _active.md.

### 2026-03-09 — Scope Tightening

- **Decision: gated execution plan.** Phase 1 is lean — /normalize with text + PDF + URL input, Stripe billing, Python + TypeScript SDKs, auto-generated docs. Everything else is gated on usage signal.
- **Phase 1 scope (weeks 1-5):** Schema validation, extraction pipeline, POST /v1/normalize (text + PDF + URL), Stripe metered billing, API keys, Python + TypeScript SDKs, deploy.
- **Deliberately NOT in Phase 1:** /compare, /validate, USDC payments, framework integrations, landing page, vendor fingerprinting.
- **Month 4 decision gate:** If < 5 active free-tier users → park the project. If signal → Phase 2 adds distribution (/compare, MCP, AgentsBoard, USDC).
- **Phase 3 is demand-driven:** No pre-planned feature list. Build what paying customers actually ask for.
- **Committed effort reduced:** ~52 hrs (Phases 0-2) vs original ~109 hrs. Phase 3 is unbudgeted.
- **Rationale:** Claude Code makes building fast, but the risk isn't build time — it's investing in features before validating the core. The only question that matters: is QuoteNorm meaningfully better than prompting Claude directly?

### 2026-03-09 — Tech Stack Decision

- **Decision: TypeScript + Next.js** (shared stack with AgentsBoard)
- Evaluated Python/FastAPI vs TypeScript/Next.js. Python has stronger LLM ecosystem and PDF parsing, but TS wins on:
  - Shared infra with AgentsBoard: Prisma, Neon, Vercel deploy, and USDC payment code reuse in Phase 2
  - One stack to maintain across projects (solo developer)
  - TypeScript SDK becomes trivial (shared types)
- PDF parsing gap is manageable: most SaaS inputs are pricing page URLs (cheerio), not complex PDFs. `pdf-parse` handles 80%+ of PDF cases.
- **Escape hatch:** If Phase 0 testing reveals PDF extraction is a critical bottleneck, pivot to Python before Phase 1 (~14 hrs invested at that point).
- Also decided: TypeScript SDK ships in Phase 1 alongside Python SDK (agent builder audience is heavily TS).

### 2026-03-09 — MCP-First Distribution

- **Key insight:** A developer can DIY quote normalization with a Claude prompt in 20 minutes. The strongest value prop isn't for developers manually integrating — it's for agents consuming this as a tool. Agents don't think "I could DIY this." They need a tool that does one thing reliably.
- **Decision: MCP tool moves to Phase 1 as primary distribution.** REST API becomes secondary for power users who outgrow MCP.
- MCP registries (Claude, Cursor, Windsurf) are the natural discovery channel — no signup page needed
- AgentsBoard listing stays in Phase 2 (gated)
- This reframes the product: QuoteNorm is an MCP tool first that also has an API, not an API that also has an MCP tool.

### 2026-03-09 — MCP Architecture Details

- **Architecture decided:** Shared `src/lib/extractor.ts` called by both MCP server and REST API. No code duplication.
- **MCP server: local-first.** Published as `@quotenorm/mcp-server` on npm. Runs locally via stdio, calls hosted QuoteNorm REST API under the hood. Stdio is universally supported across MCP clients.
- **Auth: API key required.** No anonymous MCP usage. User signs up → gets API key → adds to MCP config. Simpler than anonymous client ID tracking, and usage is tracked server-side via the API.
- **Tech stack additions:** `@modelcontextprotocol/sdk` for MCP server. Three npm packages total: `@quotenorm/mcp-server`, `@quotenorm/sdk` (TS), `quotenorm` (Python/PyPI).
- **Upgrade path unified:** Both MCP and API users hit the same 429 limit → same Stripe upgrade flow. MCP server surfaces the error message.

### 2026-03-09 — Customer Targeting Update

- **Key change:** "Primary: Agent Builders (Developers)" was too narrow for MCP-first distribution. Updated to "Primary: Developers Using AI Tools (MCP Users)."
- **Rationale:** With MCP-first, the user doesn't need to be building an agent. Any developer using Claude/Cursor/Windsurf who encounters pricing data can use QuoteNorm as an MCP tool. The addressable pool is much larger than "a few hundred developers building procurement agents."
- **Files updated:** Business plan (Section 1, Section 4 customer targeting, GTM Phase 1 signup contradiction, Phase 1 title), overview.md (goal, strategy, context, decisions table), tasks.md (pricing model question struck through).
- **GTM fix:** "No signup required" contradicted the API key auth model. Fixed to "API key required (user signs up → gets key → adds to MCP config)."

### 2026-03-09 — Minimal Web Dashboard Decision

- **Decision:** Add a minimal web dashboard (`quotenorm.ai/dashboard`) to Phase 1 — signup (email → instant API key), key management, usage stats, Stripe billing portal.
- **Rationale:** MCP-first requires an API key, so users need somewhere to sign up. Not a landing page — just the auth/billing UI. Needed for Stripe anyway.
- **Added to Phase 1 deliverables** (week 4) and updated all user flow references from `api.quotenorm.ai/signup` to `quotenorm.ai/dashboard`.

### 2026-03-10 — Business & Legal Setup

- **Added Section 14 to business plan:** Business & Legal Setup — LLC formation, accounts, legal pages, data handling policy, taxes.
- **Key decisions:**
  - **AleLabs LLC** as parent entity for QuoteNorm + AgentsBoard (`alelabs.io`). Form before Stripe billing (Phase 1 week 3). Home state, not Delaware.
  - Register domain and set up email forwarding in Phase 0.
  - Stripe account created under LLC (not personal).
  - Privacy policy + ToS generated (free tool), customized for data handling and accuracy disclaimers. Must disclose Claude API usage.
  - Data retention: process and delete raw input (24-48hr debugging window). Store only normalized output and metadata.
  - No PII commitment — terms prohibit sending PII.
- **tasks.md updated** with "Pre-Phase 1: Business Setup" checklist.

### 2026-03-12 — Phase 0 Work Blocks 1 & 2

**Work Block 1: Test data collected**
- 11 real SaaS pricing pages fetched and saved (Linear, Vercel, GitHub, Notion, Datadog, 1Password, MongoDB, Postman, Twilio, Render, Neon)
- 3 mock enterprise quotes created (simple email, medium proposal, complex enterprise)
- 5 sites failed fetch (Slack, Stripe, HubSpot, Jira, Figma — client-rendered)
- Test data index created with schema coverage analysis

**Work Block 4: x402 evaluation + Go/No-Go decision**
- Evaluated x402 protocol: 75M txns, $24M volume, 94K buyers, Coinbase-backed, Apache 2.0. Production-viable.
- Key packages: `@x402/core`, `@x402/http` (Express/Hono middleware), `@x402/mcp` (MCP integration), `@x402/mechanisms`
- MCP package exists (`@x402/mcp`) — agents discover and pay through MCP natively
- Base L2 gas: ~$0.001-$0.005/txn — acceptable at $0.10/call pricing
- **Tech stack change: Express instead of Next.js.** x402 has native Express middleware; QuoteNorm is a pure API with no frontend. Express is simpler and cleaner.
- Bazaar discovery catalog available for listing QuoteNorm endpoints
- Concerns: v2 package migration (need to verify npm publish), Next.js middleware gap (resolved by switching to Express), facilitator single dependency (acceptable for v1)
- **GO/NO-GO: GO.** All 6 criteria passed. Proceed to Phase 1.

**Work Block 3: Extraction tested**
- Designed extraction prompt v1 (`scratch/prompts/extraction-v1.md`) — system prompt for tool_use mode, ~350 words
- Ran extraction on 5 diverse samples: Linear (clean tiers), Datadog (multi-product), Twilio (pure usage), mock simple (email quote), mock complex (enterprise proposal)
- Average overall confidence: 0.83. Enterprise quotes score highest (0.94), complex multi-product pages lowest (0.72) — as expected
- Schema handles all 5 input types well. `plans[]` array was the right structural decision. `rate_card` model handles pure usage-based pricing.
- Key findings: (1) features are subjective — cap at 5-8 per plan, (2) `annual` price field needs clearer semantics, (3) multi-product vendors create many plans but this is acceptable
- Cost estimate: Haiku ~$0.003/call (97% margin at $0.10), Sonnet ~$0.015/call (85% margin). Recommend Haiku-first with Sonnet fallback for low-confidence extractions.
- Identified 5 prompt refinements for v2
- **Go/No-Go signal from extraction: strong GO.** Schema works, quality is high, margins are healthy.

**Work Block 2: Schema designed and validated**
- Mapped 5 diverse samples against business plan schema — found 6 structural problems
- Key finding: flat `pricing` object doesn't work. Real quotes have multiple tiers, multiple products, or multiple pricing components. Restructured as `plans[]` array.
- Other changes: added `add_ons[]`, `quote_metadata`, expanded `support` with SLA details, `terms` with price escalation/termination, `one_time_costs`, `source` metadata
- Wrote formal JSON Schema (`scratch/schema/quote-v1.json`)
- Defined confidence scoring rubric: High (0.9-1.0), Medium (0.6-0.89), Low (0.3-0.59), Not found (→ missing_fields)
- Deliberately deferred: multi-year breakdowns, IP/legal terms (PolicyNorm territory), liability caps
- Next: Work Block 3 — test extraction with Claude API

### 2026-03-12 — Phase 0 Playbook Created

- Created `scratch/phase-0-playbook.md` — detailed execution plan for Phase 0 validation
- Four work blocks (~7-8 hrs total): (1) collect 15+ sample quotes, (2) design & validate schema, (3) test extraction with Claude API, (4) x402 proof of concept + go/no-go decision
- Defined go/no-go decision framework: field accuracy >85%, schema coverage >80%, cost per call <$0.05, clear "better than raw Claude" signal
- Key recommendations: use tool_use mode for structured output, test with Haiku first for cost, track token counts per call, keep x402 test minimal
- Next: start Work Block 1 — collect sample SaaS pricing pages and quotes

### 2026-03-11 — x402-Only Payment Pivot

- **Major strategic pivot: x402 replaces Stripe + USDC dual payment.** QuoteNorm will use x402 protocol (Coinbase, HTTP 402 + USDC on Base L2) as the sole payment method from Phase 1. No Stripe, no user accounts, no API keys, no billing dashboard.
- **Rationale:** QuoteNorm claims to be "the structured data layer for agentic commerce" — it should itself be consumable by agents natively. x402 eliminates the entire auth+billing stack (accounts, API key management, Stripe webhooks, dashboard UI) with one line of middleware. The x402 ecosystem is growing fast (Coinbase, Stripe, Etherlink all supporting it).
- **Sandbox endpoint added for discovery:** `POST /v1/sandbox/normalize` returns truncated output (first 3 fields, no confidence details) for free, no wallet needed. Rate-limited by IP (20 calls/hr). Provides a "try before you buy" path without reintroducing accounts.
- **What's eliminated from Phase 1:** Stripe integration, user accounts/signup, API key management, billing dashboard (`quotenorm.ai/dashboard`), Python/TS SDKs (moved to Phase 2). Estimated effort savings: ~5 hrs.
- **What's added to Phase 0:** x402 proof of concept — evaluate npm package, test facilitator setup, verify payment flow on Base testnet.
- **Revenue projections adjusted:** Lower (narrower addressable market of agents with funded wallets) but engineering cost is also dramatically lower. Break-even is easier.
- **Decision gate updated:** Month 4 now evaluates: (1) x402 payments flowing? (2) sandbox usage? If high sandbox but zero paid → x402 ecosystem isn't ready, consider Stripe fallback. If both low → park.
- **Total committed effort revised:** ~47 hrs (down from ~52 hrs).
- Updated: overview.md, tasks.md, business plan (all sections), _active.md.
