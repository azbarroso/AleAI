# QuoteNorm.ai — Business Plan v1

_x402-native API for structured commercial data. Agent-native payment, MCP distribution._
_Draft: 2026-03-09 | Revised: 2026-03-11_

---

## 1. The Problem

AI agents are increasingly being built to handle procurement, vendor evaluation, and purchasing decisions. But commercial data — quotes, proposals, pricing pages, contracts — is messy, inconsistent, and unstructured. Every vendor formats differently: some send PDFs, some send emails, some have pricing pages with toggles and footnotes.

An agent that needs to compare three SaaS vendors today has to:
1. Parse three completely different document formats
2. Extract pricing, terms, limits, and constraints from each
3. Normalize units (monthly vs. annual, per-seat vs. per-org, USD vs. EUR)
4. Identify what's missing (no SLA mentioned? No data retention policy?)
5. Structure everything into a comparable format
6. Assess confidence in each extracted data point

Every developer and agent encountering this data is solving it from scratch. It's repetitive, error-prone, and not their core competency. They want to make decisions — not build extraction pipelines.

## 2. The Solution

QuoteNorm.ai is a single-purpose x402-native API: send unstructured commercial input, pay per-request with USDC, get back structured, decision-ready JSON. No accounts, no API keys — payment is the authentication.

**Core capabilities:**
- **Normalize** — Extract and structure pricing, terms, limits, constraints from any format
- **Compare** — Send multiple normalized quotes, get a side-by-side comparison matrix
- **Validate** — Check a quote against a policy (budget limits, required terms, compliance rules)
- **Flag** — Identify missing fields, hidden costs, unusual terms, confidence gaps

**What makes it different from "just call Claude":**
- Purpose-built schema for commercial data (not generic extraction)
- Per-field confidence scores calibrated on commercial documents
- Missing-field detection against a known-good field inventory
- Unit normalization (billing cycles, currencies, seat models)
- Comparison logic that understands commercial equivalence
- Versioned, stable contract agents can depend on (MCP tool or API)
- Cheaper for repeated vendors via caching (not day-1 — builds over time)

## 3. Market Opportunity

### The Agentic Commerce Wave

The AI agent ecosystem is moving from "agents that answer questions" to "agents that take actions" — including purchasing. This creates demand for structured commercial data that doesn't exist today.

**Market signals:**
- Agent frameworks (LangChain, CrewAI, AutoGen) growing rapidly
- Enterprise procurement automation is a $8B+ market traditionally
- B2B SaaS spend alone is $200B+ annually — all of it involves quotes/proposals
- Agent-to-agent commerce (like AgentsBoard) is emerging as a category

### TAM → SAM → SOM

| Scope | Market | Notes |
|-------|--------|-------|
| **TAM** | $5B+ | All commercial document processing and procurement automation |
| **SAM** | $500M | Programmatic quote/proposal processing for software and B2B services |
| **SOM (Year 1-2)** | $60-120K ARR | Realistic for a side project with x402-only: 30-80 paying wallets, $5-10K MRR at month 12 |

### Why Now

- LLMs make extraction feasible at high quality for the first time
- Agent frameworks are mature enough that developers are building real purchasing agents
- No incumbent owns "structured commercial data for agents" — the category is unclaimed
- API-first businesses can launch fast and iterate on the schema

## 4. Target Customers

### Strategy: x402-Only, Agent-Native

Payment is x402 protocol (HTTP 402 + USDC on Base L2) from day one. No Stripe, no accounts, no API keys. A sandbox endpoint provides free, truncated access for evaluation.

**The bet:** The x402 agent ecosystem is growing fast enough (Coinbase, Stripe, Etherlink) that by the time Phase 1 ships, there will be enough agents with funded wallets to generate traction signal. If not, the sandbox endpoint still allows developer evaluation, and the project parks cleanly at month 4.

### Primary: Autonomous Agents

Agents that discover QuoteNorm via MCP registries, AgentsBoard, or agent framework tool lists, call the API, and pay per-request via x402 with USDC on Base L2. No human signs up — the agent has a wallet and a budget.

**Why primary now:** x402 adoption is accelerating. Coinbase launched it, Stripe integrated it, Etherlink adopted it. QuoteNorm is positioned as "the structured data layer for agentic commerce" — being x402-native from day one is walking the talk and planting a flag early.

### Secondary: Developers Evaluating via Sandbox

Developers who discover QuoteNorm via MCP registries, docs, or word-of-mouth. They test via the sandbox endpoint (free, truncated output, no wallet needed), evaluate quality, then integrate x402 payments into their agent workflows.

**Examples:**
- A developer tests QuoteNorm's sandbox with a Slack pricing URL, sees the quality, then wires up x402 for production
- An agent builder integrates QuoteNorm into a procurement workflow — the agent pays per-call via x402
- A team lead evaluates extraction quality via sandbox before giving their agent a USDC budget for QuoteNorm

### Tertiary: Agent Platforms & Traditional Software

Platforms hosting/orchestrating multiple agents, or B2B software companies adding AI-powered vendor management. Longer-term opportunity.

### Decision Signal
- If x402 payments are flowing → the bet is working, double down
- If only sandbox usage (no paid conversions) → either x402 ecosystem isn't ready yet, or the product isn't compelling enough
- If neither shows traction by month 4 → park the project

## 5. Product

### MVP API Surface

```
POST /v1/normalize  [x402 — paid]
  Input: document (text, PDF, HTML, or URL)
  Output: normalized quote JSON + confidence scores + missing fields
  Payment: x402 (USDC on Base L2, e.g. $0.10/call)

POST /v1/sandbox/normalize  [free — truncated]
  Input: document (text, PDF, HTML, or URL)
  Output: truncated normalized quote JSON (first 3 fields only, no confidence details)
  Payment: none — for evaluation purposes

POST /v1/compare  [Phase 2+, x402 — paid]
  Input: array of normalized quotes
  Output: comparison matrix + recommendations + delta highlights

POST /v1/validate  [Phase 3+, x402 — paid]
  Input: normalized quote + policy rules
  Output: pass/fail per rule + violations + warnings
```

### Normalized Quote Schema (SaaS Wedge)

```json
{
  "vendor": {
    "name": "string",
    "product": "string",
    "website": "string | null"
  },
  "pricing": {
    "model": "per_seat | per_org | usage_based | flat | custom",
    "base_price": { "amount": 0, "currency": "USD", "period": "monthly" },
    "per_unit_price": { "amount": 0, "currency": "USD", "unit": "seat" },
    "tiers": [],
    "overage": { "rate": null, "unit": null },
    "discounts": [],
    "one_time_fees": []
  },
  "terms": {
    "contract_length_months": null,
    "billing_frequency": "monthly | annual | custom",
    "auto_renewal": null,
    "cancellation_notice_days": null,
    "payment_terms": null
  },
  "limits": {
    "users": null,
    "storage_gb": null,
    "api_calls": null,
    "custom": []
  },
  "support": {
    "level": "string | null",
    "sla_uptime": null,
    "response_time": null
  },
  "compliance": {
    "certifications": [],
    "data_residency": null,
    "data_retention_days": null
  },
  "confidence": {
    "overall": 0.0,
    "per_field": {}
  },
  "missing_fields": [],
  "warnings": [],
  "raw_source_type": "pdf | email | html | text",
  "extracted_at": "ISO 8601"
}
```

### Expansion Roadmap (Gated)

Each phase beyond Normalize is gated on usage signal from the previous phase. Timelines are aspirational, not committed.

| Phase | Gate | Capabilities |
|-------|------|-------------|
| **1 — Normalize** | None (committed) | Single-quote normalization for SaaS quotes (text, PDF, URL). x402-native API + sandbox endpoint + MCP tool. |
| **2 — Compare** | 5+ unique paying wallets at month 4 | Multi-quote comparison, delta detection |
| **3 — Validate** | Paying customers exist | Policy checking, compliance validation |
| **4 — Score & Recommend** | Demand signal | Value scoring, risk flags, purchase recommendations |
| **5 — Expand verticals** | Product-market fit confirmed | Hardware, professional services, cloud infrastructure, contracts |

## 6. Business Model

### Pricing: x402 Per-Request

| Endpoint | Price | Notes |
|----------|-------|-------|
| **`/v1/sandbox/normalize`** | Free | Truncated output (first 3 fields). No wallet needed. For evaluation. |
| **`/v1/normalize`** | $0.10 USDC | Full normalized JSON + confidence + missing fields. x402 payment. |
| **`/v1/compare`** (Phase 2+) | $0.15 USDC | Multi-quote comparison matrix. |
| **`/v1/validate`** (Phase 3+) | $0.20 USDC | Policy checking, compliance validation. |

No tiers, no subscriptions, no accounts. Every paid request is a single x402 transaction. Volume discounts could be introduced later via smart contract logic if demand warrants.

**Why x402 per-request works:**
- Agents consume APIs in bursts — subscription doesn't fit
- Zero onboarding friction — no signup, no API keys, no credit card
- Revenue scales directly with agent activity
- Payment is authentication — no separate auth system needed
- Near-zero protocol fees (only Base L2 gas ~$0.001/tx)
- Sandbox endpoint provides the "try before you buy" path that a free tier would normally serve

### Revenue Projections (Realistic — x402)

Projections are more uncertain with x402-only. The addressable market (agents with funded USDC wallets) is smaller today but growing fast. Upside: zero CAC (agents discover and pay autonomously). Downside: if the x402 ecosystem isn't ready, revenue is near zero.

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Unique paying wallets | 2-5 | 10-20 | 30-80 |
| Monthly paid API calls | 500 | 5K | 50K |
| Revenue/call | $0.10 | $0.10 | $0.10 |
| **MRR** | **$50-100** | **$500-1K** | **$5-10K** |
| Sandbox calls (free) | 2K | 5K | 10K |

**Why lower than previous projections:** x402-only narrows the funnel to agents with funded wallets. But engineering cost is also dramatically lower (no Stripe, no dashboard, no accounts), so break-even is easier to reach. The sandbox endpoint provides a conversion funnel — if sandbox usage is high but paid conversion is low, the signal is "product is good, x402 ecosystem isn't ready yet" (which is useful to know).

**Key unknown:** How many agents have x402-compatible wallets with USDC on Base in mid-2026? This is the critical assumption. If the Coinbase/Stripe x402 push succeeds, the number could be significant. If it stalls, revenue will be minimal regardless of product quality.

### Unit Economics

| Metric | Estimate | Notes |
|--------|----------|-------|
| Cost per normalization | ~$0.02-0.04 | LLM API cost (Claude) + compute |
| Revenue per normalization | $0.10 USDC | x402 per-request |
| Gross margin | 60-80% | Improves with caching, fine-tuning, smaller models |
| Payment processing cost | ~$0.001/tx | Base L2 gas only — no Stripe 2.9% + $0.30 |
| CAC | ~$0 | Agents discover and pay autonomously. No marketing funnel. |
| Sandbox cost | ~$0.02-0.04/call | Free calls still cost LLM tokens. Monitor for abuse. |

## 7. Competitive Landscape

### Direct Competitors

**None purpose-built.** No existing API specifically normalizes commercial quotes for agent consumption. This is the opportunity.

### Adjacent / Partial Competitors

| Category | Examples | Gap |
|----------|----------|-----|
| **Document AI** | Google Document AI, AWS Textract, Azure Form Recognizer | Generic extraction — no commercial schema, no confidence scoring for terms, no comparison |
| **LLM APIs** | Claude, GPT-4 | Can extract but: no stable schema, no calibrated confidence, no comparison logic, expensive per call |
| **Procurement software** | Coupa, Jaggaer, SAP Ariba | Human-facing, not API-first, not agent-friendly, enterprise-only |
| **Contract analysis** | Kira Systems, LawGeex | Legal focus, not commercial terms, not usage-based |

### Moat (Builds Over Time)

1. **Schema quality** — The normalized schema improves with every quote processed. Edge cases, vendor-specific patterns, industry norms.
2. **Confidence calibration** — Confidence scores get better with feedback loops. An agent that says "this field was wrong" improves the model for everyone.
3. **Vendor fingerprinting** — Over time, QuoteNorm knows how Salesforce, AWS, Datadog, etc. structure their quotes. Extraction gets faster and more accurate for known vendors.
4. **Network data** — Aggregate pricing intelligence (anonymized) becomes a valuable dataset. "Is this quote competitive?" requires knowing what others pay.
5. **Switching cost** — Agents built on QuoteNorm's schema depend on it. Changing providers means rewriting decision logic.

## 8. Go-to-Market

### Phase 1: x402-Native MVP (Months 1-3)

- **x402 API** — `POST /v1/normalize` with x402 payment middleware. Agents pay per-request with USDC on Base L2. No accounts, no API keys.
- **Sandbox endpoint** — `POST /v1/sandbox/normalize` returns truncated output for free. Lets developers evaluate quality without a wallet.
- **MCP tool** — `@quotenorm/mcp-server` on npm. Wraps the x402 API. Agent's wallet handles payment. Discovery via MCP registries (Claude, Cursor, Windsurf).
- **Developer docs** — OpenAPI spec, usage examples, x402 client setup guide.
- **No Stripe, no dashboard, no user accounts, no API keys, no SDKs** — all of this is eliminated by x402.
- **Focus:** Get /normalize live with x402 payment. Validate extraction quality. Monitor sandbox usage and paid conversions.

### Phase 2: Distribution & Compare (Months 4-6) — GATED ON USAGE SIGNAL

- **AgentsBoard listing** — Agent marketplace presence
- **`/v1/compare`** — Multi-quote comparison endpoint (x402 paid)
- **Python + TypeScript SDKs** — with x402 payment handling built in
- **Community launch** — Agent builder communities, direct outreach

### Phase 3: Demand-Driven (Months 6+) — GATED ON PAYING CUSTOMERS

- Build what users actually ask for: /validate, framework integrations, vendor fingerprinting, landing page
- Enterprise path (custom schemas, on-prem) only if enterprise interest materializes

### Distribution Channels

| Channel | Cost | Phase | Expected Impact |
|---------|------|-------|----------------|
| MCP tool in registries | Low | 1 | **Primary driver** — agents discover QuoteNorm as a tool, pay via x402 |
| Sandbox endpoint + docs | Low | 1 | Developer evaluation path — try before buying |
| x402 ecosystem directories | Low | 1 | Listed in x402 ecosystem/registry (x402.org, Coinbase docs) |
| AgentsBoard listing | Low | 2 | Agent marketplace discovery |
| Community engagement | Low | 2 | Build trust in agent builder communities |
| Content marketing | Low-Medium | 2-3 | SEO + social for "procurement agent" / "quote parsing" queries |
| Agent framework plugins | Low | 3 | Listed where agent builders already look |

## 9. Tech Stack (Proposed)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Core extraction** | `src/lib/extractor.ts` (shared) | Single extraction pipeline used by both API and MCP server |
| **MCP server** | `@modelcontextprotocol/sdk` (TypeScript) | Distribution channel. Local-first: npm package. Calls hosted x402 API internally. Agent's wallet handles payment. |
| **x402 API** | Next.js API routes (TypeScript) + x402 middleware | Primary interface. x402 payment middleware handles auth+billing in one layer. |
| **LLM extraction** | Claude API (structured output) | Best-in-class for document understanding, native JSON mode |
| **Document parsing** | pdf-parse (PDF), cheerio or Playwright (URL/HTML) | PDF and web page extraction |
| **Database** | PostgreSQL (Neon) | Store extraction logs, cached normalizations. No user/account tables needed. |
| **Cache** | Redis or Upstash | Cache normalized results for repeated vendors |
| **Auth + Billing** | x402 protocol (Coinbase) | HTTP 402 + USDC on Base L2. Payment IS authentication. No API keys, no Stripe. |
| **x402 facilitator** | Coinbase CDP or self-hosted | Verifies payment, settles USDC. Single dependency for all billing. |
| **Hosting** | Vercel or Railway | API + extraction backend. MCP server runs locally on user's machine. |

### Architecture

```
                    ┌─────────────────┐
                    │  src/lib/        │
                    │  extractor.ts    │  ← shared core logic
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │                         │
        ┌───────┴───────┐        ┌────────┴────────┐
        │  MCP Server   │        │  x402 API       │
        │  npm package  │        │  Next.js routes │
        │  runs locally │        │  hosted         │
        │  calls API    │        │                 │
        │  agent wallet │        │  x402 middleware │
        │  handles pay  │        │  + sandbox      │
        └───────────────┘        └─────────────────┘
                                         │
                                 ┌───────┴───────┐
                                 │  x402         │
                                 │  Facilitator  │
                                 │  (Coinbase)   │
                                 │  USDC on Base │
                                 └───────────────┘
```

**x402 payment flow:**
1. Agent sends `POST /v1/normalize` without payment
2. Server responds `402 Payment Required` with payment instructions (amount, facilitator, network)
3. Agent constructs USDC payment on Base L2, includes payment proof in `PAYMENT-SIGNATURE` header
4. Server verifies payment via facilitator, processes request, returns full normalized JSON
5. USDC settles to QuoteNorm's wallet on Base L2

**Sandbox flow (no payment):**
1. Agent/developer sends `POST /v1/sandbox/normalize`
2. Server processes request, returns truncated output (first 3 fields, no confidence details)
3. No wallet, no payment, no authentication needed
4. Rate limited by IP to prevent abuse (e.g., 20 calls/hour)

**MCP server design (local-first):**
- Published as `@quotenorm/mcp-server` on npm
- User installs: `npx @quotenorm/mcp-server` or adds to MCP config
- Runs locally, connects to Claude/Cursor/Windsurf via stdio
- Calls the hosted QuoteNorm x402 API under the hood
- Agent's wallet configuration is passed through MCP config — the MCP server handles x402 payment negotiation
- Exposes two tools: `normalize_quote` (paid, x402) and `sandbox_normalize_quote` (free, truncated)

**Why local-first over remote MCP:**
- stdio transport is universally supported across MCP clients
- Remote MCP (HTTP+SSE) support varies across clients and adds latency
- Local server is just a thin proxy — all real work happens on the hosted API

**Auth model: payment IS authentication.**
- No API keys, no user accounts, no signup
- x402 payment proof serves as both authentication and billing
- Sandbox endpoint is unauthenticated, rate-limited by IP

## 9b. x402 Payment Design

### Why x402 + USDC on Base L2

x402 is an open protocol (Coinbase) that uses HTTP 402 status codes for internet-native payments. Instead of building a custom pre-funded account system, x402 provides a standardized payment layer at the HTTP level. Agents pay per-request — no accounts, no deposits, no balance tracking.

**Why x402 over custom USDC pre-funded accounts (previous design):**
- Eliminates wallet management, deposit detection, balance tracking, withdrawal logic
- Standard protocol — agents with x402-compatible clients can pay any x402 API, not just QuoteNorm
- One line of middleware vs weeks of custom payment infrastructure
- Growing ecosystem: Coinbase, Stripe, Etherlink all supporting x402

### x402 Payment Flow

```
Agent Payment Flow:
1. Agent sends POST /v1/normalize (no payment header)
2. Server responds 402 Payment Required with PAYMENT-REQUIRED header:
   - amount: 0.10 USDC
   - network: Base L2
   - facilitator: <facilitator address>
3. Agent's x402-compatible wallet constructs USDC payment
4. Agent retries request with PAYMENT-SIGNATURE header containing payment proof
5. x402 middleware verifies payment via facilitator
6. Server processes request and returns full normalized JSON
7. USDC settles to QuoteNorm's wallet on Base L2
```

### Implementation Details

| Component | Design |
|-----------|--------|
| **x402 middleware** | Coinbase x402 npm package — one line of Express/Next.js middleware |
| **Facilitator** | Coinbase CDP facilitator (hosted) or self-hosted facilitator |
| **Settlement** | USDC settles to a QuoteNorm-controlled wallet on Base L2 |
| **Pricing config** | Per-endpoint pricing defined in middleware config |
| **Sandbox bypass** | `/v1/sandbox/*` routes skip x402 middleware entirely |
| **Rate limiting** | Sandbox: IP-based (20 calls/hr). Paid: no limit (payment = rate limiting) |

### What We DON'T Need to Build (vs Previous Design)

- ~~Per-account deposit addresses~~
- ~~Balance tracking database~~
- ~~Deposit detection (webhook/polling)~~
- ~~Withdrawal system~~
- ~~API key management~~
- ~~Stripe integration~~
- ~~Billing dashboard~~
- ~~User account system~~

### Synergy with AgentsBoard

AgentsBoard can adopt x402 as well for agent-to-agent payment. Shared learning:
- x402 facilitator setup and configuration
- Base L2 wallet management
- USDC settlement patterns

---

## 10. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **"Just use Claude directly"** | High | QuoteNorm adds schema stability, confidence calibration, comparison logic, and vendor fingerprinting that raw LLM calls don't provide. Price competitiveness matters — batch and cache to stay cheaper than direct LLM calls. |
| **x402 ecosystem too early** | High | If few agents have x402-compatible wallets with funded USDC, paid usage will be near zero regardless of product quality. Mitigation: sandbox endpoint provides value and generates usage signal even without x402 adoption. If sandbox usage is high but paid is zero, consider adding Stripe as a fallback. |
| **Market timing too early** | Medium | Sandbox keeps barrier low for evaluation. The x402 bet is time-bounded — if no traction by month 4, park cleanly. |
| **LLM cost compression** | Medium | As LLM costs drop, QuoteNorm's margins improve. The value is in the schema and intelligence layer, not the raw extraction. |
| **Extraction quality** | Medium | Start narrow (SaaS quotes only). Build feedback loops. Vendor fingerprinting improves accuracy over time. Confidence scores set honest expectations. |
| **Sandbox abuse** | Low-Medium | Free sandbox could be used to extract full data via repeated calls with different inputs. Mitigation: truncation is per-response (not per-user), rate limiting by IP, and truncated output is genuinely less useful than paid output. |
| **Data sensitivity** | Medium | Commercial quotes contain pricing and terms. Offer data processing agreements, SOC 2 path, and eventually on-prem for enterprise. |
| **Incumbent entry** | Low (short term) | Big cloud providers could add this but it's too niche for them now. Move fast, build the schema standard, create switching costs. |

## 11. Success Metrics

### Month 3 (End of Phase 1)
- `/v1/normalize` live with x402 payment (USDC on Base L2)
- `/v1/sandbox/normalize` live (free, truncated)
- `@quotenorm/mcp-server` published on npm, listed in MCP community tools directory
- Listed in x402 ecosystem directory
- Schema validated against 15+ real SaaS quotes
- Core question answered: is output meaningfully better than prompting Claude directly?
- Monitoring: sandbox calls/day, paid x402 calls/day, unique wallets

### Month 4 — Decision Gate
- If no usage signal (< 5 unique wallets paying OR < 50 sandbox calls/week) → park the project
- If sandbox usage is high but paid is zero → x402 ecosystem isn't ready; consider adding Stripe as fallback
- If paid usage is flowing → proceed to Phase 2 (AgentsBoard, /compare, SDKs)

### Month 6 (End of Phase 2 — if gated)
- /compare endpoint live (x402 paid)
- AgentsBoard listing live
- Python + TypeScript SDKs published (with x402 handling)
- 10-20 unique paying wallets
- $500-1K MRR

### Month 12 (Phase 3 — demand-driven, if gated)
- Additional endpoints based on what users actually request
- 30-80 unique paying wallets
- $5-10K MRR

## 12. What Makes This a Good Business

1. **Real pain, no solution** — Every developer and agent encountering commercial data is solving quote parsing from scratch today
2. **Usage-based = aligned incentives** — Revenue grows as agents process more quotes
3. **Narrow wedge, massive expansion** — SaaS quotes today, all B2B commerce tomorrow
4. **Low build cost** — MCP tool + API, no UI, LLM-powered extraction
5. **Compounding moat** — Schema quality, vendor fingerprinting, and pricing intelligence improve with every call
6. **Riding the wave** — Agentic commerce is early but accelerating. Structured commercial data is infrastructure that every purchasing agent will need
7. **Multiple exit paths** — Acquisition target for procurement platforms, agent frameworks, or cloud providers wanting commercial data capabilities

## 13. What Could Kill It

- x402 ecosystem doesn't mature fast enough — too few agents with funded wallets (distribution risk)
- Agents don't actually make purchasing decisions at scale for 3+ years (timing risk)
- A major LLM provider ships "commerce mode" with built-in quote parsing (platform risk)
- The normalized schema doesn't generalize well across verticals (product risk)
- Can't get unit economics right — LLM costs eat margins (cost risk)

## 14. Business & Legal Setup

### Legal Entity
**AleLabs LLC** — parent entity for QuoteNorm and AgentsBoard (and future projects). Single-member LLC, formed before going live. Provides liability protection (users send commercial documents, extraction accuracy isn't guaranteed) and clean tax separation. Home state is simpler than Delaware for a side project. Cost: ~$100-500 depending on state. Domain: `alelabs.io` (already registered).

QuoteNorm and AgentsBoard operate as product lines under AleLabs LLC — no separate entities needed. One bank account (optionally sub-accounts per project via Mercury). USDC revenue settles on Base L2 and can be converted to fiat via Coinbase or similar.

### Accounts & Infrastructure
| When | Action | Cost |
|------|--------|------|
| Phase 0 | Register `quotenorm.ai` domain | ~$12/yr |
| Phase 0 | Set up email forwarding (`support@quotenorm.ai` → personal) | Free |
| Phase 1 week 3 | Form AleLabs LLC (home state) | $100-500 |
| Phase 1 week 3 | Get EIN (IRS online) | Free |
| Phase 1 week 3 | Open business bank account (Mercury or similar) | Free |
| Phase 1 week 3 | Set up x402 facilitator account (Coinbase CDP) | Free |
| Phase 1 week 3 | Set up USDC receiving wallet on Base L2 | Free |

### Legal Pages (Phase 1 week 4)
- **Privacy Policy** — Must disclose: data collected (IP for rate limiting, extraction logs), third-party processing (Claude API — Anthropic doesn't train on API inputs), data retention policy. Generate with free tool (Termly, iubenda), customize data handling sections. Note: no email/account data collected (x402 = no accounts).
- **Terms of Service** — Required before going live. Key clauses: no guarantees on extraction accuracy, data handling (users send commercial documents), rate limits on sandbox, x402 payment terms, USDC settlement.
- **Acceptable Use Policy** — What users can't send (PII, classified documents, etc.).

### Data Handling Policy
- **Process and delete** — Don't store raw input documents beyond a short debugging window (24-48 hrs). Store only normalized output and metadata (input type, latency, token cost).
- **Claude API disclosure** — User documents are sent to Anthropic's API for extraction. Anthropic's API terms: no training on API inputs. Disclose this in privacy policy.
- **No PII commitment** — QuoteNorm processes commercial/pricing data, not personal data. Terms should prohibit sending PII.

### Taxes
- All revenue is pass-through income (single-member LLC → personal return).
- USDC revenue needs to be tracked for tax purposes — record each x402 payment (amount, timestamp, wallet address). On-chain records provide an audit trail.
- Sales tax: below thresholds at <$5K MRR. Revisit at $10K+ ARR.
- Crypto-to-fiat conversion: track cost basis for any USDC → USD conversions (though USDC is pegged 1:1, IRS still requires reporting).

### What You Don't Need Yet
- Business insurance (revisit if enterprise customers appear)
- Trademark registration (revisit if brand becomes valuable)
- Lawyer-reviewed terms (revisit if revenue exceeds $50K ARR)
- Separate accounting software (on-chain records + bank statements are enough)

## 15. Execution Plan

### Phase 0 — Foundation (Week 1-2)

**Goal:** Project scaffolded, schema validated, first extraction working end-to-end. x402 evaluated.

| Week | Task | Deliverable |
|------|------|-------------|
| 1 | Collect 15+ real SaaS quotes (pricing pages, PDF proposals, email quotes) | `test_data/` folder with real inputs |
| 1 | Finalize the normalized quote JSON schema — test it against collected quotes, refine fields | `schema/quote-v1.json` (JSON Schema) |
| 1 | Scaffold Next.js API project (TypeScript) | Repo with Next.js, project structure, CI |
| 1 | Set up database (Neon Postgres) — tables for extraction logs, cached normalizations (no user/account tables) | Prisma schema, migration run |
| 1 | Evaluate x402 npm package — test facilitator setup, payment flow, USDC settlement on Base L2 testnet | x402 proof of concept working |
| 2 | Build extraction pipeline: document → text → LLM prompt → structured JSON | `src/lib/extractor.ts` |
| 2 | Build confidence scoring: per-field confidence based on extraction clarity | Confidence model v1 |
| 2 | Build missing-field detection: compare output against full schema, flag gaps | Missing fields logic |
| 2 | Test pipeline against all 15+ collected quotes, measure accuracy | Accuracy report: % fields correct, avg confidence |

**Key decisions in Phase 0:**
- ~~Python (FastAPI) vs TypeScript (Next.js)~~ — Decided: TypeScript/Next.js. Shared stack with AgentsBoard outweighs Python's LLM ecosystem advantage. Pivot to Python if PDF extraction proves to be a bottleneck.
- Claude vs GPT-4 for extraction — Claude has better structured output and document understanding
- Document parsing: pdf-parse for PDFs, cheerio for static HTML, Playwright only if needed for JS-rendered pricing pages
- x402 facilitator: Coinbase CDP (hosted) vs self-hosted — evaluate in Phase 0

### Phase 1 — x402-Native MVP (Week 3-5)

**Goal:** `/v1/normalize` live with x402 payment, sandbox endpoint live, MCP tool published. Core question answered: is this meaningfully better than prompting Claude directly?

| Week | Task | Deliverable |
|------|------|-------------|
| 3 | Build `POST /v1/normalize` endpoint — accepts text, PDF (base64), and URL | Working endpoint |
| 3 | Input handling: text passthrough, PDF extraction (pdf-parse), URL fetch + HTML-to-text (cheerio or Playwright) | Text + PDF + URL input support |
| 3 | Response format: normalized quote JSON + confidence + missing fields + warnings | Stable response schema |
| 3 | Error handling: invalid input, extraction failures, timeout handling | Error response format |
| 3 | Add x402 payment middleware to `/v1/normalize` — configure pricing ($0.10 USDC), facilitator, Base L2 | x402 payment working on mainnet |
| 4 | Build `POST /v1/sandbox/normalize` — same extraction, truncated output (first 3 fields, no confidence details) | Sandbox endpoint live |
| 4 | Sandbox rate limiting: IP-based, 20 calls/hour | Rate limit middleware |
| 4 | Usage tracking: log every call (wallet address or IP, input type, latency, token cost, paid/sandbox) | Extraction logs table, logging middleware |
| 4 | Set up USDC receiving wallet on Base L2, configure x402 facilitator for production | Wallet + facilitator live |
| 5 | API docs: OpenAPI spec, x402 payment flow documentation, client setup guide | `/docs` endpoint |
| 5 | MCP server: build local MCP server wrapping the x402 API, agent wallet passthrough, publish `@quotenorm/mcp-server` to npm | npm package live, listed in MCP community tools |
| 5 | Submit to x402 ecosystem directory (x402.org) | Listed in x402 ecosystem |
| 5 | Deploy to production (Railway or Vercel) | Live API at `api.quotenorm.ai` |

**End of Phase 1:** QuoteNorm is live as an x402-native API + MCP tool. An agent can normalize a SaaS quote (text, PDF, or URL) and pay per-request with USDC. Developers can evaluate via the free sandbox. No accounts, no API keys, no Stripe, no dashboard.

#### User Experience Flows (Phase 1)

**Flow A: Agent via x402 (Primary — zero friction)**

How agents find it:
- MCP tool in registries (Claude, Cursor, Windsurf)
- x402 ecosystem directory (x402.org)
- Agent framework tool lists, AgentsBoard (Phase 2)

First use (zero setup):
1. Agent sends `POST /v1/normalize` with a quote URL
2. Gets `402 Payment Required` with payment instructions ($0.10 USDC, Base L2)
3. Agent's x402-compatible wallet pays automatically
4. Retries with `PAYMENT-SIGNATURE` header
5. Gets full structured JSON — pricing, terms, confidence scores, missing fields

No accounts, no API keys, no signup. The agent discovers the tool and pays in the same request cycle.

**Flow B: MCP Tool (Primary distribution channel)**

How users find it:
- Developer discovers QuoteNorm in MCP community tools directory, npm, or word of mouth
- Agent frameworks and AI coding tools (Claude, Cursor, Windsurf) support MCP tools natively

First use:
1. Installs MCP server with wallet config:
   ```json
   {
     "mcpServers": {
       "quotenorm": {
         "command": "npx",
         "args": ["@quotenorm/mcp-server"],
         "env": { "WALLET_PRIVATE_KEY": "0x..." }
       }
     }
   }
   ```
2. Agent/developer calls: "Normalize the pricing at https://slack.com/pricing"
3. MCP server handles x402 payment negotiation with the hosted API
4. Gets structured JSON back — pricing, terms, confidence scores, missing fields
5. Each call costs $0.10 USDC, deducted from the configured wallet

**Flow C: Sandbox (Evaluation — no wallet needed)**

How developers find it:
- Docs site at `api.quotenorm.ai/docs`
- Linked from MCP tool description and x402 ecosystem listing

First use (< 1 minute):
1. Developer sends `POST /v1/sandbox/normalize` with a quote URL
2. Gets truncated JSON back — first 3 fields only, no confidence details
3. Evaluates quality — is this good enough to integrate?
4. If yes → sets up x402 client or MCP tool with wallet for full access

```bash
# Sandbox — free, no wallet needed
curl -X POST https://api.quotenorm.ai/v1/sandbox/normalize \
  -H "Content-Type: application/json" \
  -d '{"source": "url", "content": "https://slack.com/pricing"}'

# Returns truncated output:
# { "vendor": { "name": "Slack", ... }, "pricing": { "model": "per_seat", ... },
#   "terms": { "billing_frequency": "monthly", ... },
#   "_truncated": true, "_message": "Full output available via x402 payment" }
```

**What's deliberately NOT in Phase 1:** /compare, /validate, SDKs, AgentsBoard listing, framework integrations, landing page. These are gated on usage signal.

### ⚑ Month 4 — Decision Gate

Before investing further, evaluate:
- Are agents paying via x402? (target: 5+ unique wallets)
- Is the sandbox getting usage? (target: 50+ calls/week)
- Is the output meaningfully better than "just prompt Claude"?

**Decision matrix:**
- x402 payments flowing → proceed to Phase 2
- High sandbox, zero paid → x402 ecosystem not ready; consider adding Stripe as fallback
- Low sandbox, zero paid → product or market isn't there; park the project

### Phase 2 — Distribution & Compare (Week 6-9) — GATED ON PHASE 1 SIGNAL

**Goal:** Add distribution channels, second endpoint, and SDKs. Only build if Phase 1 shows x402 payment signal.

| Week | Task                                                                                         | Deliverable               |
| ---- | -------------------------------------------------------------------------------------------- | ------------------------- |
| 6    | AgentsBoard listing                                                                          | Listed on AgentsBoard     |
| 7    | Build `POST /v1/compare` — accepts 2-5 normalized quotes, returns comparison matrix (x402 paid, $0.15) | Working endpoint          |
| 7    | Comparison logic: side-by-side fields, delta highlights, "best value" flags                  | Comparison output schema  |
| 8    | Python SDK with x402 payment handling built in                                               | `quotenorm` PyPI package  |
| 8    | TypeScript SDK with x402 payment handling built in                                           | `@quotenorm/sdk` npm package |
| 8    | Expand test corpus to 50+ quotes across 20+ SaaS vendors                                     | Broader test coverage     |
| 9    | Community launch: post in agent builder communities (LangChain Discord, Reddit, HN, Twitter) | Launch posts              |
| 9    | Reach out to 10 agent builders directly, offer sandbox access for feedback                   | 5+ active beta users      |

**End of Phase 2:** /compare live (x402 paid). AgentsBoard distribution. Python + TS SDKs. 10+ unique paying wallets.

### Phase 3 — Deepen & Scale (Week 10+) — GATED ON PAYING CUSTOMERS

**Goal:** Only build these after paying customers exist. Sequence based on what users actually ask for.

**Available to build (prioritize by demand):**
- `POST /v1/validate` — policy checking, compliance validation
- Vendor fingerprinting — vendor-specific extraction rules for top SaaS vendors
- LangChain/CrewAI tool integrations
- Feedback endpoint (`POST /v1/feedback`)
- Performance optimization (smaller models, caching, latency reduction)
- Landing page beyond docs

**End of Phase 3:** Determined by what the market actually wants, not a pre-planned feature list.

### Execution Timeline Summary

```
Week  1-2   ████  Phase 0: Foundation (schema, pipeline, test data, x402 proof of concept)
Week  3-5   ██████  Phase 1: x402-Native MVP (/normalize, sandbox, MCP tool, deploy)
  ⚑  Month 4: Decision gate — x402 payments flowing, or park
Week  6-9   ████████  Phase 2: Distribution + Compare (AgentsBoard, /compare, SDKs) [GATED]
Week 10+    ░░░░░░░░  Phase 3: Deepen & Scale (demand-driven) [GATED]
```

### Time Budget

Assuming similar constraints to other projects (part-time, Claude Code does heavy lifting). x402 pivot significantly reduces Phase 1 effort (no Stripe, no dashboard, no accounts, no SDKs):

| Phase | Calendar time | Effort/week | Total effort |
|-------|---------------|-------------|-------------|
| Phase 0 | 2 weeks | 6-8 hrs | ~14 hrs (includes x402 evaluation) |
| Phase 1 | 3 weeks | 4-5 hrs | ~13 hrs (down from ~18 — no Stripe/dashboard/SDKs) |
| Phase 2 | 4 weeks | 4-6 hrs | ~20 hrs |
| Phase 3 | TBD | TBD | TBD |
| **Committed** | **~9 weeks** | | **~47 hrs** |

Phase 3 effort is intentionally unbudgeted — it depends on what the market asks for.

### Phase 0, Week 1 — Concrete First Session

If starting today, here's what the first working session looks like:

1. **Collect sample quotes (30 min)** — Google "SaaS pricing page" for 5 vendors (e.g., Slack, Notion, Datadog, Linear, Vercel). Save HTML/screenshots. Find 2-3 PDF proposal examples.
2. **Validate schema (45 min)** — Take 3 quotes and manually map them to the proposed JSON schema. Identify fields that don't fit, fields that are missing, fields that are redundant.
3. **Scaffold project (30 min)** — Create repo, install dependencies, basic project structure.
4. **First extraction test (45 min)** — Take one quote, send it to Claude API with a structured output prompt, see what comes back. Compare to the schema. Iterate the prompt.
5. **x402 proof of concept (30 min)** — Install x402 npm package, set up a test endpoint with payment middleware on Base testnet. Verify the 402 → pay → retry flow works.
6. **Log findings (15 min)** — What worked, what didn't, schema adjustments needed, x402 impressions.

**Total: ~3.5 hours.** By the end you have a validated schema, a working extraction prompt, and confirmed x402 integration path.

---

_This is a v1 plan (revised 2026-03-11: x402-only pivot). Phases 2-3 are gated on usage signal. Build fast, validate early, only invest further if the market responds. The x402 bet is time-bounded — if the ecosystem isn't ready by month 4, the sandbox signal will tell us._
