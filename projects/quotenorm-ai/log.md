# Log

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
