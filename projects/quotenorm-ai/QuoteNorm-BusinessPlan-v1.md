# QuoteNorm.ai — Business Plan v1

_Developer-first, agent-ready API for structured commercial data._
_Draft: 2026-03-09 | Revised: 2026-03-09_

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

Every agent builder is solving this from scratch. It's repetitive, error-prone, and not their core competency. They want to build the decision logic — not the data extraction pipeline.

## 2. The Solution

QuoteNorm.ai is a single-purpose API: send us unstructured commercial input, get back structured, decision-ready JSON.

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
- Versioned, stable API contract agents can depend on
- Faster and cheaper than a full LLM call for structured extraction

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

### Strategy: Developer-First, Agent-Ready

The business targets developers NOW (they have credit cards, they exist today) while designing the API and payment layer so autonomous agents can consume it directly when the infrastructure matures.

**The core tension:** An "agent-only API" and a "developer GTM" target two different customers with different discovery, payment, and adoption patterns. Resolution: build for developers, design for agents.

### Primary: Agent Builders (Developers)

Developers building AI agents that handle procurement, vendor evaluation, or purchasing workflows. They need reliable structured data to feed into their decision logic. They pay with Stripe, integrate via API keys, and make purchasing decisions themselves.

**Examples:**
- A procurement agent that compares cloud hosting vendors
- A SaaS management agent that evaluates renewal offers
- An IT purchasing agent that processes vendor quotes from email

**Honest assessment:** The realistic addressable pool in 2026 is a few hundred developers worldwide actively building agents that process commercial quotes. This is a niche — growth will be steady, not explosive.

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
| **1 — Normalize** | None (committed) | Single-quote normalization for SaaS quotes (text, PDF, URL) |
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

### Phase 1: MVP + Developer Adoption (Months 1-3)

- **Free tier** — 50 calls/month, no credit card required
- **Developer docs** — OpenAPI spec auto-generated, Python SDK
- **Stripe billing** — metered usage, credit card
- **Focus:** Get /normalize live with text + PDF + URL. Validate extraction quality. Find first 5+ free-tier users.

### Phase 2: Distribution + Agent-Native Path (Months 4-6) — GATED ON USAGE SIGNAL

- **MCP tool** — Publish as MCP tool (low effort, high discovery leverage)
- **AgentsBoard listing** — Agent marketplace presence
- **USDC payment path** — Pre-funded accounts on Base L2 for agent-native consumption
- **`/v1/compare`** — Multi-quote comparison endpoint
- **Community launch** — Agent builder communities, direct outreach

### Phase 3: Demand-Driven (Months 6+) — GATED ON PAYING CUSTOMERS

- Build what users actually ask for: /validate, framework integrations, TypeScript SDK, vendor fingerprinting, landing page
- Enterprise path (custom schemas, on-prem) only if enterprise interest materializes

### Distribution Channels

| Channel | Cost | Phase | Expected Impact |
|---------|------|-------|----------------|
| Free tier + docs | Low | 1 | Primary driver — developers discover via docs and try free |
| MCP tool publication | Low | 2 | Direct integration into Claude/AI coding tools |
| AgentsBoard listing | Low | 2 | Agent marketplace discovery |
| Community engagement | Low | 2 | Build trust in agent builder communities |
| Content marketing | Low-Medium | 2-3 | SEO + social for "procurement agent" / "quote parsing" queries |
| Agent framework plugins | Low | 3 | High-leverage — listed where agent builders already look |
| Partnerships | Medium | 3 | Platform deals with agent marketplaces |

## 9. Tech Stack (Proposed)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **API framework** | FastAPI (Python) or Next.js API routes | Python preferred for LLM integration; Next.js if sharing infra with AgentsBoard |
| **LLM extraction** | Claude API (structured output) | Best-in-class for document understanding, native JSON mode |
| **Document parsing** | pdf-parse (PDF), cheerio or Playwright (URL/HTML) | PDF and web page extraction |
| **Database** | PostgreSQL (Neon) | Store schemas, usage, customer data |
| **Cache** | Redis or Upstash | Cache normalized results for repeated vendors |
| **Auth** | API keys + usage tracking | Simple, standard for developer APIs |
| **Hosting** | Vercel or Railway | Fast deployment, auto-scaling |
| **Billing (primary)** | Stripe metered billing | Usage-based billing for developers |
| **Billing (secondary)** | USDC on Base L2 (pre-funded accounts) | Agent-native payment path |

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
- **Weeks 6-9:** Add USDC pre-funded accounts, list on AgentsBoard, publish as MCP tool
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
- `/v1/normalize` live with text + PDF + URL input
- Stripe billing working
- Python SDK published
- 5+ developers using free tier
- Schema validated against 15+ real SaaS quotes
- Core question answered: is output meaningfully better than prompting Claude directly?

### Month 4 — Decision Gate
- If no usage signal (< 5 active free-tier users) → park the project
- If signal → proceed to Phase 2 (distribution, /compare, USDC)

### Month 6 (End of Phase 2 — if gated)
- /compare endpoint live
- MCP tool + AgentsBoard listing live
- USDC payment path live
- 15-25 API customers, 3-5 paying
- $1-2K MRR

### Month 12 (Phase 3 — demand-driven, if gated)
- Additional endpoints based on what users actually request
- 50-100 API customers, 15-30 paying
- $8-15K MRR
- Clear signal on developer vs agent-native usage split

## 12. What Makes This a Good Business

1. **Real pain, no solution** — Every procurement agent builder is solving quote parsing from scratch today
2. **Usage-based = aligned incentives** — Revenue grows as agents process more quotes
3. **Narrow wedge, massive expansion** — SaaS quotes today, all B2B commerce tomorrow
4. **Low build cost** — API-only, no UI, LLM-powered extraction
5. **Compounding moat** — Schema quality, vendor fingerprinting, and pricing intelligence improve with every call
6. **Riding the wave** — Agentic commerce is early but accelerating. Structured commercial data is infrastructure that every purchasing agent will need
7. **Multiple exit paths** — Acquisition target for procurement platforms, agent frameworks, or cloud providers wanting commercial data capabilities

## 13. What Could Kill It

- Agents don't actually make purchasing decisions at scale for 3+ years (timing risk)
- A major LLM provider ships "commerce mode" with built-in quote parsing (platform risk)
- The normalized schema doesn't generalize well across verticals (product risk)
- Can't get unit economics right — LLM costs eat margins (cost risk)

## 14. Execution Plan

### Phase 0 — Foundation (Week 1-2)

**Goal:** Project scaffolded, schema validated, first extraction working end-to-end.

| Week | Task | Deliverable |
|------|------|-------------|
| 1 | Collect 15+ real SaaS quotes (pricing pages, PDF proposals, email quotes) | `test_data/` folder with real inputs |
| 1 | Finalize the normalized quote JSON schema — test it against collected quotes, refine fields | `schema/quote-v1.json` (JSON Schema) |
| 1 | Choose tech stack and scaffold API project | Repo with FastAPI or Next.js, project structure, CI |
| 1 | Set up database (Neon Postgres) — tables for API keys, usage logs, cached normalizations | Prisma schema or SQLAlchemy models, migration run |
| 2 | Build extraction pipeline: document → text → LLM prompt → structured JSON | `lib/extractor.py` or `src/lib/extractor.ts` |
| 2 | Build confidence scoring: per-field confidence based on extraction clarity | Confidence model v1 |
| 2 | Build missing-field detection: compare output against full schema, flag gaps | Missing fields logic |
| 2 | Test pipeline against all 15+ collected quotes, measure accuracy | Accuracy report: % fields correct, avg confidence |

**Key decisions in Phase 0:**
- Python (FastAPI) vs TypeScript (Next.js) — Python is stronger for LLM pipelines and document parsing; TypeScript shares infra with AgentsBoard
- Claude vs GPT-4 for extraction — Claude has better structured output and document understanding
- Document parsing library — pdf-parse for PDFs

### Phase 1 — MVP API (Week 3-5)

**Goal:** `/v1/normalize` endpoint live with text, PDF, and URL input, documented, deployable. Core question answered: is this meaningfully better than prompting Claude directly?

| Week | Task | Deliverable |
|------|------|-------------|
| 3 | Build `POST /v1/normalize` endpoint — accepts text, PDF (base64), and URL | Working endpoint |
| 3 | Input handling: text passthrough, PDF extraction (pdf-parse), URL fetch + HTML-to-text (cheerio or Playwright) | Text + PDF + URL input support |
| 3 | Response format: normalized quote JSON + confidence + missing fields + warnings | Stable response schema |
| 3 | Error handling: invalid input, extraction failures, timeout handling | Error response format |
| 4 | API key auth: generate keys, validate on requests, track usage | Key validation middleware |
| 4 | Usage tracking: log every call (customer, input type, latency, token cost) | Usage table, logging middleware |
| 4 | Rate limiting: free tier = 50/month, paid = based on plan | Rate limit middleware |
| 4 | Stripe integration: metered billing, customer portal, webhook handling | Billing live |
| 5 | API docs: OpenAPI spec auto-generated, hosted docs page | `/docs` endpoint (Swagger/Redoc) |
| 5 | Python SDK: thin wrapper around the API | `quotenorm` PyPI package |
| 5 | Deploy to production (Railway or Vercel) | Live API at `api.quotenorm.ai` |

**End of Phase 1:** A developer can sign up for an API key, send a SaaS quote (text, PDF, or URL), and get back structured JSON. Stripe billing works. Docs are live. Python SDK available.

**What's deliberately NOT in Phase 1:** TypeScript SDK, /compare, /validate, USDC payments, framework integrations, landing page. These are gated on usage signal.

### ⚑ Month 4 — Decision Gate

Before investing further, evaluate:
- Are developers using /normalize? (target: 5+ active free-tier users)
- Is the output meaningfully better than "just prompt Claude"?
- Any signal of willingness to pay?

**If no traction → park the project.** If signal → proceed to Phase 2.

### Phase 2 — Distribution & Compare (Week 6-9) — GATED ON PHASE 1 SIGNAL

**Goal:** Add distribution channels, second endpoint, and agent-native payment. Only build if Phase 1 shows usage signal.

| Week | Task | Deliverable |
|------|------|-------------|
| 6 | MCP tool publication — low effort, high discovery leverage | MCP tool spec published |
| 6 | AgentsBoard listing | Listed on AgentsBoard |
| 7 | Build `POST /v1/compare` — accepts 2-5 normalized quotes, returns comparison matrix | Working endpoint |
| 7 | Comparison logic: side-by-side fields, delta highlights, "best value" flags | Comparison output schema |
| 8 | USDC pre-funded accounts on Base L2 | Agent-native payment live |
| 8 | Expand test corpus to 50+ quotes across 20+ SaaS vendors | Broader test coverage |
| 9 | Community launch: post in agent builder communities (LangChain Discord, Reddit, HN, Twitter) | Launch posts |
| 9 | Reach out to 10 agent builders directly, offer free usage in exchange for feedback | 5+ active beta users |

**End of Phase 2:** /compare live. USDC payment path available. MCP + AgentsBoard distribution. 10+ developers using the API.

### Phase 3 — Deepen & Scale (Week 10+) — GATED ON PAYING CUSTOMERS

**Goal:** Only build these after paying customers exist. Sequence based on what users actually ask for.

**Available to build (prioritize by demand):**
- `POST /v1/validate` — policy checking, compliance validation
- Vendor fingerprinting — vendor-specific extraction rules for top SaaS vendors
- TypeScript SDK
- LangChain/CrewAI tool integrations
- Feedback endpoint (`POST /v1/feedback`)
- Performance optimization (smaller models, caching, latency reduction)
- Landing page beyond docs

**End of Phase 3:** Determined by what the market actually wants, not a pre-planned feature list.

### Execution Timeline Summary

```
Week  1-2   ████  Phase 0: Foundation (schema, pipeline, test data)
Week  3-5   ██████  Phase 1: MVP API (/normalize, text+PDF+URL, Stripe, Python SDK, deploy)
  ⚑  Month 4: Decision gate — traction or park
Week  6-9   ████████  Phase 2: Distribution + Compare (MCP, AgentsBoard, /compare, USDC) [GATED]
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
