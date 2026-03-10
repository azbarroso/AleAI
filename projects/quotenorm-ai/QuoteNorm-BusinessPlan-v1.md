# QuoteNorm.ai — Business Plan v1

_MCP tool + API for structured commercial data. Developer-first billing, agent-ready distribution._
_Draft: 2026-03-09 | Revised: 2026-03-10_

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

QuoteNorm.ai is a single-purpose tool (MCP tool + REST API): send unstructured commercial input, get back structured, decision-ready JSON.

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
| **SOM (Year 1-2)** | $100-200K ARR | Realistic for a side project: 50-100 customers, $8-15K MRR at month 12 |

### Why Now

- LLMs make extraction feasible at high quality for the first time
- Agent frameworks are mature enough that developers are building real purchasing agents
- No incumbent owns "structured commercial data for agents" — the category is unclaimed
- API-first businesses can launch fast and iterate on the schema

## 4. Target Customers

### Strategy: MCP-First Distribution, Developer-First Billing

Distribution is agent-native: MCP tool in registries where agents and agent-building developers already look. Billing is developer-first: Stripe for humans with credit cards, USDC for autonomous agents (Phase 2).

**The resolved tension:** Discovery happens through MCP registries (agent-native), but payment comes from developers (Stripe) until autonomous agent payment infrastructure matures.

### Primary: Developers Using AI Tools (MCP Users)

Any developer using AI coding tools (Claude, Cursor, Windsurf) who encounters pricing, quote, or proposal data in their workflow. They install QuoteNorm as an MCP tool and use it naturally — "normalize this pricing page," "extract terms from this PDF." They pay with Stripe when they exceed the free tier.

**Examples:**
- A developer researching cloud vendors in Cursor — asks the tool to normalize each pricing page
- A team lead evaluating SaaS renewals — feeds proposals through Claude with QuoteNorm
- An agent builder integrating QuoteNorm into a procurement workflow via the REST API

**Why this is broader than "agent builders":** MCP-first distribution means the user doesn't need to be building an agent. Anyone whose AI tool has QuoteNorm in its MCP config can use it. The addressable pool is every developer using MCP-compatible AI tools who encounters commercial data — significantly larger than "a few hundred developers building procurement agents."

### Secondary: Autonomous Agents (Emerging)

Agents that discover QuoteNorm via AgentsBoard, MCP registries, or agent framework tool lists, call the API, and pay per-call using USDC on Base L2. No human signs up — the agent has a wallet and a budget.

**Why not primary (yet):** Agents don't autonomously purchase services at scale in March 2026. The infrastructure is nascent — very few agents have wallets, budgets, or purchasing autonomy. Discovery is unsolved. This market is 12-24 months from critical mass.

### Tertiary: Agent Platforms & Traditional Software

Platforms hosting/orchestrating multiple agents, or B2B software companies adding AI-powered vendor management. Longer-term opportunity.

### Decision Signal
- If 80%+ usage comes from developers → stay developer-focused
- If agent-native usage picks up (even small amounts) → signal the wave is coming, invest more there
- If neither shows traction by month 4 → park the project

## 5. Product

### MVP API Surface

```
POST /v1/normalize
  Input: document (text, PDF, HTML, or URL)
  Output: normalized quote JSON + confidence scores + missing fields

POST /v1/compare
  Input: array of normalized quotes
  Output: comparison matrix + recommendations + delta highlights

POST /v1/validate
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
| **1 — Normalize** | None (committed) | Single-quote normalization for SaaS quotes (text, PDF, URL). MCP tool + REST API. |
| **2 — Compare** | 5+ active free-tier users at month 4 | Multi-quote comparison, delta detection |
| **3 — Validate** | Paying customers exist | Policy checking, compliance validation |
| **4 — Score & Recommend** | Demand signal | Value scoring, risk flags, purchase recommendations |
| **5 — Expand verticals** | Product-market fit confirmed | Hardware, professional services, cloud infrastructure, contracts |

## 6. Business Model

### Pricing: Usage-Based

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 50 normalizations/month — enough to build and test |
| **Builder** | $0.10/normalize, $0.15/compare, $0.20/validate | Pay-as-you-go, no commitment |
| **Scale** | Volume discounts at 10K+ calls/month | Custom pricing, SLA, dedicated support |
| **Enterprise** | Custom | On-prem option, custom schemas, priority support |

**Why usage-based works:**
- Agents consume APIs in bursts — subscription doesn't fit
- Low barrier to start (free tier) drives adoption
- Revenue scales directly with agent activity
- Easy to measure and bill

### Revenue Projections (Realistic)

The original projections were optimistic for a niche side project. Revised to reflect realistic developer adoption pace:

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| API customers | 3-5 | 15-25 | 50-100 |
| Monthly API calls | 1K | 10K | 100K |
| Avg revenue/call | $0.10 | $0.10 | $0.08 |
| **MRR** | **$100-200** | **$1-2K** | **$8-15K** |

**Why the revision:** Finding 10 paying developers at month 3 requires a narrow funnel — developers who are (a) building procurement agents, (b) processing enough quotes to need an API, (c) willing to pay rather than DIY with Claude/GPT. CAC is likely $150-300+ for a niche B2B developer API — content marketing in small communities has high effort-per-lead. This is still a good outcome for ~50-100 hours invested, but don't plan around $40K MRR at month 12.

Assumptions: blended rate decreases as volume discounts kick in. Customer growth driven by agent ecosystem growth and word-of-mouth in developer communities.

### Unit Economics

| Metric | Estimate | Notes |
|--------|----------|-------|
| Cost per normalization | ~$0.02-0.04 | LLM API cost (Claude/GPT) + compute |
| Gross margin | 60-80% | Improves with caching, fine-tuning, smaller models |
| CAC | ~$150-300 | Niche B2B developer API — content marketing in small communities has high effort-per-lead |
| LTV (12-month) | ~$500-2,000 | Depends on agent activity volume |

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

### Phase 1: MVP + MCP-First Distribution (Months 1-3)

- **MCP tool** — Primary distribution channel. Agents and developers discover QuoteNorm as an MCP tool in registries, Claude/Cursor/Windsurf. API key required (sign up at minimal dashboard → get key → add to MCP config).
- **API** — Same endpoint, also available as a standard REST API for power users who outgrow MCP
- **Minimal web dashboard** (`quotenorm.ai/dashboard`) — signup (email → instant API key, no credit card), key management, usage stats, Stripe billing portal. Not a landing page — just the auth/billing UI needed to support MCP and API users.
- **Free tier** — 50 calls/month, no credit card required
- **Developer docs** — OpenAPI spec (via next-swagger-doc or hand-written), Python + TypeScript SDKs
- **Stripe billing** — metered usage, credit card
- **Focus:** Get /normalize live as MCP tool + API. Validate extraction quality. Find first 5+ users (MCP or API).

### Phase 2: Scale Distribution + Agent-Native Payment (Months 4-6) — GATED ON USAGE SIGNAL

- **AgentsBoard listing** — Agent marketplace presence
- **USDC payment path** — Pre-funded accounts on Base L2 for agent-native consumption
- **`/v1/compare`** — Multi-quote comparison endpoint
- **Community launch** — Agent builder communities, direct outreach

### Phase 3: Demand-Driven (Months 6+) — GATED ON PAYING CUSTOMERS

- Build what users actually ask for: /validate, framework integrations, vendor fingerprinting, landing page
- Enterprise path (custom schemas, on-prem) only if enterprise interest materializes

### Distribution Channels

| Channel | Cost | Phase | Expected Impact |
|---------|------|-------|----------------|
| MCP tool in registries | Low | 1 | **Primary driver** — agents and developers discover QuoteNorm as a tool, not a signup page |
| Free tier + docs (API) | Low | 1 | Secondary — power users who want direct API access |
| AgentsBoard listing | Low | 2 | Agent marketplace discovery |
| Community engagement | Low | 2 | Build trust in agent builder communities |
| Content marketing | Low-Medium | 2-3 | SEO + social for "procurement agent" / "quote parsing" queries |
| Agent framework plugins | Low | 3 | Listed where agent builders already look |
| Partnerships | Medium | 3 | Platform deals with agent marketplaces |

## 9. Tech Stack (Proposed)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Core extraction** | `src/lib/extractor.ts` (shared) | Single extraction pipeline used by both MCP server and REST API |
| **MCP server** | `@modelcontextprotocol/sdk` (TypeScript) | Primary distribution. Local-first: npm package users add to MCP config. Calls hosted REST API internally. |
| **REST API** | Next.js API routes (TypeScript) | Secondary interface. Shared stack with AgentsBoard (Prisma, Neon, Vercel). |
| **LLM extraction** | Claude API (structured output) | Best-in-class for document understanding, native JSON mode |
| **Document parsing** | pdf-parse (PDF), cheerio or Playwright (URL/HTML) | PDF and web page extraction |
| **Database** | PostgreSQL (Neon) | Store schemas, usage, customer data |
| **Cache** | Redis or Upstash | Cache normalized results for repeated vendors |
| **Auth** | API keys + MCP client tracking | API keys for REST API; MCP server requires API key in config (passed through to hosted API) |
| **Hosting** | Vercel or Railway | REST API + extraction backend. MCP server runs locally on user's machine. |
| **Billing (primary)** | Stripe metered billing | Usage-based billing for developers |
| **Billing (secondary)** | USDC on Base L2 (pre-funded accounts) | Agent-native payment path |

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
        │  MCP Server   │        │  REST API       │
        │  (primary)    │        │  (secondary)    │
        │  npm package  │        │  Next.js routes │
        │  runs locally │        │  hosted         │
        │  calls API    │        │                 │
        └───────────────┘        └─────────────────┘
```

**MCP server design (local-first):**
- Published as `@quotenorm/mcp-server` on npm
- User installs: `npx @quotenorm/mcp-server` or adds to MCP config
- Runs locally, connects to Claude/Cursor/Windsurf via stdio
- Calls the hosted QuoteNorm REST API under the hood (API key required in config)
- Exposes one tool: `normalize_quote` with input `{ source: "url" | "text" | "pdf", content: "..." }`

**Why local-first over remote MCP:**
- stdio transport is universally supported across MCP clients
- Remote MCP (HTTP+SSE) support varies across clients and adds latency
- Local server is just a thin proxy — all real work happens on the hosted API
- Usage tracking is automatic (every MCP call = API call = tracked)

**MCP auth model:**
- API key required in MCP server config (no anonymous usage)
- User signs up at `quotenorm.ai/dashboard`, gets API key, adds to MCP config
- Free tier (50 calls/month) still applies — tracked server-side via API key
- This adds one signup step vs truly zero-friction, but avoids the complexity of anonymous client ID tracking

## 9b. Stablecoin Payment Design (Agent-Native Path)

### Why USDC on Base L2

Autonomous agents need a payment method that doesn't require human intervention per transaction. USDC on Base L2 provides: low gas costs (~$0.001/tx), fast finality (~2s), and a stablecoin agents can hold without currency risk.

### Pre-Funded Account Model (Recommended)

Per-call on-chain verification adds latency and gas costs per request. Instead, use a pre-funded account:

```
Agent Payment Flow:
1. Agent (or its human operator) deposits USDC to a QuoteNorm-managed address on Base L2
2. QuoteNorm credits the deposit to an internal balance tied to an API credential
3. Agent calls POST /v1/normalize with the API credential
4. QuoteNorm deducts from internal balance (off-chain, instant)
5. When balance is low, agent or operator tops up with another USDC deposit
```

### Implementation Details

| Component | Design |
|-----------|--------|
| **Deposit address** | Per-account managed address on Base L2 (or shared address with memo/reference ID) |
| **Balance tracking** | Internal database — deposits increase balance, API calls deduct |
| **Deposit detection** | Listen for USDC transfer events on Base L2 via webhook or polling |
| **API credential** | Same API key format as Stripe path — agent doesn't need to know which payment method backs it |
| **Minimum deposit** | $5 USDC (~50 normalizations at $0.10/call) |
| **Withdrawal** | Support withdrawals of remaining balance to original deposit address |

### Why Pre-Funded Over Per-Call

- **No latency:** Balance check is a DB lookup, not an on-chain verification
- **No gas per API call:** Only gas is on deposit/withdrawal, not every request
- **Simpler agent integration:** Agent just uses an API key like any other API
- **Reuse pattern:** Mirrors how exchanges and prepaid API services work

### Synergy with AgentsBoard

AgentsBoard is building USDC payment infrastructure for agent-to-agent commerce. QuoteNorm should reuse:
- Wallet management patterns
- Base L2 USDC contract integration
- Deposit detection infrastructure

### GTM Timeline for USDC

- **Weeks 1-5:** Stripe-only (developer focus)
- **Weeks 6-9:** Add USDC pre-funded accounts, list on AgentsBoard
- **Week 10+:** Monitor developer vs agent payment split, double down on winner

---

## 10. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **"Just use Claude directly"** | High | QuoteNorm adds schema stability, confidence calibration, comparison logic, and vendor fingerprinting that raw LLM calls don't provide. Price competitiveness matters — batch and cache to stay cheaper than direct LLM calls. |
| **Market timing too early** | Medium | Free tier keeps barrier low. Even a small number of paying customers validates demand. The API can serve human-built software too, not only agents. |
| **LLM cost compression** | Medium | As LLM costs drop, QuoteNorm's margins improve. The value is in the schema and intelligence layer, not the raw extraction. |
| **Extraction quality** | Medium | Start narrow (SaaS quotes only). Build feedback loops. Vendor fingerprinting improves accuracy over time. Confidence scores set honest expectations. |
| **Data sensitivity** | Medium | Commercial quotes contain pricing and terms. Offer data processing agreements, SOC 2 path, and eventually on-prem for enterprise. |
| **Incumbent entry** | Low (short term) | Big cloud providers could add this but it's too niche for them now. Move fast, build the schema standard, create switching costs. |

## 11. Success Metrics

### Month 3 (End of Phase 1)
- `/v1/normalize` live as MCP tool + REST API with text + PDF + URL input
- `@quotenorm/mcp-server` published on npm, listed in MCP community tools directory
- Stripe billing working
- Python + TypeScript SDKs published
- 5+ users (MCP or API) on free tier
- Schema validated against 15+ real SaaS quotes
- Core question answered: is output meaningfully better than prompting Claude directly?

### Month 4 — Decision Gate
- If no usage signal (< 5 active users across MCP + API) → park the project
- If signal → proceed to Phase 2 (AgentsBoard, /compare, USDC)

### Month 6 (End of Phase 2 — if gated)
- /compare endpoint live
- AgentsBoard listing live
- USDC payment path live
- 15-25 API customers, 3-5 paying
- $1-2K MRR

### Month 12 (Phase 3 — demand-driven, if gated)
- Additional endpoints based on what users actually request
- 50-100 API customers, 15-30 paying
- $8-15K MRR
- Clear signal on developer vs agent-native usage split

## 12. What Makes This a Good Business

1. **Real pain, no solution** — Every developer and agent encountering commercial data is solving quote parsing from scratch today
2. **Usage-based = aligned incentives** — Revenue grows as agents process more quotes
3. **Narrow wedge, massive expansion** — SaaS quotes today, all B2B commerce tomorrow
4. **Low build cost** — MCP tool + API, no UI, LLM-powered extraction
5. **Compounding moat** — Schema quality, vendor fingerprinting, and pricing intelligence improve with every call
6. **Riding the wave** — Agentic commerce is early but accelerating. Structured commercial data is infrastructure that every purchasing agent will need
7. **Multiple exit paths** — Acquisition target for procurement platforms, agent frameworks, or cloud providers wanting commercial data capabilities

## 13. What Could Kill It

- Agents don't actually make purchasing decisions at scale for 3+ years (timing risk)
- A major LLM provider ships "commerce mode" with built-in quote parsing (platform risk)
- The normalized schema doesn't generalize well across verticals (product risk)
- Can't get unit economics right — LLM costs eat margins (cost risk)

## 14. Business & Legal Setup

### Legal Entity
**AleLabs LLC** — parent entity for QuoteNorm and AgentsBoard (and future projects). Single-member LLC, formed before turning on Stripe billing (Phase 1 week 3). Provides liability protection (users send commercial documents, extraction accuracy isn't guaranteed) and clean tax separation. Home state is simpler than Delaware for a side project. Cost: ~$100-500 depending on state. Domain: `alelabs.io` (already registered).

QuoteNorm and AgentsBoard operate as product lines under AleLabs LLC — no separate entities needed. One Stripe account (separate products per project), one bank account (optionally sub-accounts per project via Mercury).

### Accounts & Infrastructure
| When | Action | Cost |
|------|--------|------|
| Phase 0 | Register `quotenorm.ai` domain | ~$12/yr |
| Phase 0 | Set up email forwarding (`support@quotenorm.ai` → personal) | Free |
| Phase 1 week 3 | Form AleLabs LLC (home state) | $100-500 |
| Phase 1 week 3 | Get EIN (IRS online) | Free |
| Phase 1 week 3 | Open business bank account (Mercury or similar) | Free |
| Phase 1 week 4 | Create Stripe account under AleLabs LLC | Free |

### Legal Pages (Phase 1 week 4)
- **Privacy Policy** — Required before collecting emails at signup. Must disclose: data collected (email, usage logs), third-party processing (Claude API — Anthropic doesn't train on API inputs), data retention policy. Generate with free tool (Termly, iubenda), customize data handling sections.
- **Terms of Service** — Required before billing. Key clauses: no guarantees on extraction accuracy, usage limits, data handling (users send commercial documents), rate limits, payment terms.
- **Acceptable Use Policy** — What users can't send (PII, classified documents, etc.).

### Data Handling Policy
- **Process and delete** — Don't store raw input documents beyond a short debugging window (24-48 hrs). Store only normalized output and metadata (input type, latency, token cost).
- **Claude API disclosure** — User documents are sent to Anthropic's API for extraction. Anthropic's API terms: no training on API inputs. Disclose this in privacy policy.
- **No PII commitment** — QuoteNorm processes commercial/pricing data, not personal data. Terms should prohibit sending PII.

### Taxes
- All revenue is pass-through income (single-member LLC → personal return).
- Sales tax: below thresholds at <$5K MRR. Revisit at $10K+ ARR. Stripe Tax ($0.50/txn) handles EU VAT if needed.
- Keep clean records from day one (Stripe does this automatically).

### What You Don't Need Yet
- Business insurance (revisit if enterprise customers appear)
- Trademark registration (revisit if brand becomes valuable)
- Lawyer-reviewed terms (revisit if revenue exceeds $50K ARR)
- Separate accounting software (Stripe reports + bank statements are enough)

## 15. Execution Plan

### Phase 0 — Foundation (Week 1-2)

**Goal:** Project scaffolded, schema validated, first extraction working end-to-end.

| Week | Task | Deliverable |
|------|------|-------------|
| 1 | Collect 15+ real SaaS quotes (pricing pages, PDF proposals, email quotes) | `test_data/` folder with real inputs |
| 1 | Finalize the normalized quote JSON schema — test it against collected quotes, refine fields | `schema/quote-v1.json` (JSON Schema) |
| 1 | Scaffold Next.js API project (TypeScript) | Repo with Next.js, project structure, CI |
| 1 | Set up database (Neon Postgres) — tables for API keys, usage logs, cached normalizations | Prisma schema, migration run |
| 2 | Build extraction pipeline: document → text → LLM prompt → structured JSON | `src/lib/extractor.ts` |
| 2 | Build confidence scoring: per-field confidence based on extraction clarity | Confidence model v1 |
| 2 | Build missing-field detection: compare output against full schema, flag gaps | Missing fields logic |
| 2 | Test pipeline against all 15+ collected quotes, measure accuracy | Accuracy report: % fields correct, avg confidence |

**Key decisions in Phase 0:**
- ~~Python (FastAPI) vs TypeScript (Next.js)~~ — Decided: TypeScript/Next.js. Shared stack with AgentsBoard outweighs Python's LLM ecosystem advantage. Pivot to Python if PDF extraction proves to be a bottleneck.
- Claude vs GPT-4 for extraction — Claude has better structured output and document understanding
- Document parsing: pdf-parse for PDFs, cheerio for static HTML, Playwright only if needed for JS-rendered pricing pages
- MCP architecture: shared `src/lib/extractor.ts` called by both MCP server (local npm package) and REST API (hosted Next.js)

### Phase 1 — MVP MCP Tool + API (Week 3-5)

**Goal:** `/v1/normalize` endpoint live with text, PDF, and URL input, documented, deployable. Core question answered: is this meaningfully better than prompting Claude directly?

| Week | Task | Deliverable |
|------|------|-------------|
| 3 | Build `POST /v1/normalize` endpoint — accepts text, PDF (base64), and URL | Working endpoint |
| 3 | Input handling: text passthrough, PDF extraction (pdf-parse), URL fetch + HTML-to-text (cheerio or Playwright) | Text + PDF + URL input support |
| 3 | Response format: normalized quote JSON + confidence + missing fields + warnings | Stable response schema |
| 3 | Error handling: invalid input, extraction failures, timeout handling | Error response format |
| 4 | Minimal web dashboard: signup (email → API key), key management, usage stats | `quotenorm.ai/dashboard` live |
| 4 | API key auth: generate keys, validate on requests, track usage | Key validation middleware |
| 4 | Usage tracking: log every call (customer, input type, latency, token cost) | Usage table, logging middleware |
| 4 | Rate limiting: free tier = 50/month, paid = based on plan | Rate limit middleware |
| 4 | Stripe integration: metered billing, customer portal, webhook handling | Billing live |
| 5 | API docs: OpenAPI spec (next-swagger-doc or hand-written), hosted Swagger UI | `/docs` endpoint |
| 5 | Python SDK: thin wrapper around the API | `quotenorm` PyPI package |
| 5 | TypeScript SDK: thin wrapper around the API | `@quotenorm/sdk` npm package |
| 5 | MCP server: build local MCP server wrapping the hosted API, publish `@quotenorm/mcp-server` to npm | npm package live, listed in MCP community tools |
| 5 | Deploy to production (Railway or Vercel) | Live API at `api.quotenorm.ai` |

**End of Phase 1:** QuoteNorm is available as an MCP tool (primary) and a REST API (secondary). An agent or developer can normalize a SaaS quote (text, PDF, or URL) and get back structured JSON. Stripe billing works. Docs are live. Python + TypeScript SDKs available.

#### User Experience Flows (Phase 1)

**Flow A: MCP Tool (Primary — low friction)**

How users find it:
- Developer discovers QuoteNorm in MCP community tools directory, npm, or word of mouth
- Agent frameworks and AI coding tools (Claude, Cursor, Windsurf) support MCP tools natively

First use (< 5 minutes):
1. Developer signs up at `quotenorm.ai/dashboard` → gets API key instantly (email only, no credit card)
2. Installs MCP server: `npx @quotenorm/mcp-server --api-key qn_...` or adds to MCP config:
   ```json
   {
     "mcpServers": {
       "quotenorm": {
         "command": "npx",
         "args": ["@quotenorm/mcp-server"],
         "env": { "QUOTENORM_API_KEY": "qn_..." }
       }
     }
   }
   ```
3. Agent/developer calls: "Normalize the pricing at https://slack.com/pricing"
4. Gets structured JSON back — pricing, terms, confidence scores, missing fields
5. Free tier: 50 calls/month tracked via API key

Why this works: An agent doesn't think "I could DIY this." It needs a tool that does one thing reliably. The MCP tool IS the product — discovery and value delivery happen in the developer's existing workflow, not on a separate website.

**Flow B: REST API (Secondary — power users)**

How developers find it:
- Organic search, direct outreach, or graduates from MCP usage needing direct API access
- Docs site (Swagger UI at `api.quotenorm.ai/docs`) IS the landing page. Note: Next.js doesn't auto-generate OpenAPI like FastAPI — use `next-swagger-doc` or maintain a hand-written spec.

Signup → First API call (< 5 minutes):
1. Developer visits `api.quotenorm.ai/docs` — sees OpenAPI docs with live "Try it" functionality
2. Signs up at `quotenorm.ai/dashboard` — email only, no credit card required
3. Gets an API key immediately — displayed on screen + sent to email
4. Makes first call — either via docs "Try it" button, curl, or SDK:
   ```bash
   pip install quotenorm
   ```
   ```python
   from quotenorm import QuoteNorm
   qn = QuoteNorm(api_key="qn_...")
   result = qn.normalize(url="https://slack.com/pricing")
   print(result.pricing.base_price)  # structured output
   print(result.confidence.overall)  # 0.87
   print(result.missing_fields)      # ["cancellation_notice_days", "data_residency"]
   ```
5. Free tier: 50 normalizations/month — enough to build and test an integration

**SDK distribution:**
- **Python:** Published to PyPI as `quotenorm` — `pip install quotenorm`. Thin wrapper: `httpx` + `pydantic` for typed responses. Source: `github.com/quotenorm/quotenorm-python`
- **TypeScript:** Published to npm as `@quotenorm/sdk` — `npm install @quotenorm/sdk`. Thin wrapper: `fetch` + TypeScript types. Source: `github.com/quotenorm/quotenorm-js`
- Both SDKs are trivial — auth, request formatting, typed response parsing. ~2 hrs each with Claude Code.

**Upgrade → Paying customer:**

Both MCP and API users already have an API key (required at signup). When they hit the 50-call free tier limit:
1. API returns `429` with message: "Free tier limit reached. Upgrade at quotenorm.ai/dashboard"
2. MCP server surfaces this error to the agent/developer
3. Developer visits `quotenorm.ai/dashboard` → billing tab → Stripe Checkout session
4. Enters credit card → switches to pay-as-you-go ($0.10/normalize)
5. Stripe metered billing: usage tracked per API call, invoiced monthly
6. Usage visible via `GET /v1/usage` endpoint (programmatic) or dashboard (UI)

**What's deliberately NOT in Phase 1:** /compare, /validate, USDC payments, AgentsBoard listing, framework integrations, landing page. These are gated on usage signal.

### ⚑ Month 4 — Decision Gate

Before investing further, evaluate:
- Are agents/developers using /normalize via MCP or API? (target: 5+ active users)
- Is the output meaningfully better than "just prompt Claude"?
- Any signal of willingness to pay?

**If no traction → park the project.** If signal → proceed to Phase 2.

### Phase 2 — Distribution & Compare (Week 6-9) — GATED ON PHASE 1 SIGNAL

**Goal:** Add distribution channels, second endpoint, and agent-native payment. Only build if Phase 1 shows usage signal.

| Week | Task                                                                                         | Deliverable               |
| ---- | -------------------------------------------------------------------------------------------- | ------------------------- |
| 6    | AgentsBoard listing                                                                          | Listed on AgentsBoard     |
| 7    | Build `POST /v1/compare` — accepts 2-5 normalized quotes, returns comparison matrix          | Working endpoint          |
| 7    | Comparison logic: side-by-side fields, delta highlights, "best value" flags                  | Comparison output schema  |
| 8    | USDC pre-funded accounts on Base L2                                                          | Agent-native payment live |
| 8    | Expand test corpus to 50+ quotes across 20+ SaaS vendors                                     | Broader test coverage     |
| 9    | Community launch: post in agent builder communities (LangChain Discord, Reddit, HN, Twitter) | Launch posts              |
| 9    | Reach out to 10 agent builders directly, offer free usage in exchange for feedback           | 5+ active beta users      |

**End of Phase 2:** /compare live. USDC payment path available. AgentsBoard distribution. 10+ users across MCP + API.

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
Week  1-2   ████  Phase 0: Foundation (schema, pipeline, test data)
Week  3-5   ██████  Phase 1: MVP (/normalize, MCP tool, API, Stripe, SDKs, deploy)
  ⚑  Month 4: Decision gate — traction or park
Week  6-9   ████████  Phase 2: Scale + Compare (AgentsBoard, /compare, USDC) [GATED]
Week 10+    ░░░░░░░░  Phase 3: Deepen & Scale (demand-driven) [GATED]
```

### Time Budget

Assuming similar constraints to other projects (part-time, Claude Code does heavy lifting):

| Phase | Calendar time | Effort/week | Total effort |
|-------|---------------|-------------|-------------|
| Phase 0 | 2 weeks | 6-8 hrs | ~14 hrs |
| Phase 1 | 3 weeks | 5-7 hrs | ~18 hrs |
| Phase 2 | 4 weeks | 4-6 hrs | ~20 hrs |
| Phase 3 | TBD | TBD | TBD |
| **Committed** | **~9 weeks** | | **~52 hrs** |

Phase 3 effort is intentionally unbudgeted — it depends on what the market asks for.

### Phase 0, Week 1 — Concrete First Session

If starting today, here's what the first working session looks like:

1. **Collect sample quotes (30 min)** — Google "SaaS pricing page" for 5 vendors (e.g., Slack, Notion, Datadog, Linear, Vercel). Save HTML/screenshots. Find 2-3 PDF proposal examples.
2. **Validate schema (45 min)** — Take 3 quotes and manually map them to the proposed JSON schema. Identify fields that don't fit, fields that are missing, fields that are redundant.
3. **Scaffold project (30 min)** — Create repo, install dependencies, basic project structure.
4. **First extraction test (45 min)** — Take one quote, send it to Claude API with a structured output prompt, see what comes back. Compare to the schema. Iterate the prompt.
5. **Log findings (15 min)** — What worked, what didn't, schema adjustments needed.

**Total: ~3 hours.** By the end you have a validated schema and a working extraction prompt.

---

_This is a v1 plan (revised). Phases 2-3 are gated on usage signal. Build fast, validate early, only invest further if the market responds._
