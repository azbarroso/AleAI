# Journal

Daily notes, observations, and miscellaneous items worth keeping for context and history.

### 2026-03-14

- **New project: PositionFlow.ai** — API for CFTC weekly futures positioning data. Turns raw COT reports into structured JSON signals (positioning extremes, percentiles, labels) for ES futures. Target: traders, AI agents, dashboards. Project scaffolded in knowledge base, full business plan incoming.
- **QuoteNorm is fully live.** API at `api.quotenorm.ai` (Railway) + landing page at `quotenorm.ai` (Cloudflare Pages). Both sandbox and x402 paid flows working end-to-end from the browser.
- The hardest part was getting x402 payment signing to work in the browser. The `@x402/evm` client library loaded via esm.sh caused viem version mismatches — different instances of viem for our code vs the library's internals, leading to `invalid_exact_evm_payload_signature` from the facilitator. Solution: bypass the @x402 client libs entirely and sign EIP-3009 `TransferWithAuthorization` directly via MetaMask's `eth_signTypedData_v4`. Simpler, zero dependencies, works perfectly.
- Key learning: the x402 payment payload structure expected by the server is `{ x402Version: 2, accepted: <full payment requirements object>, payload: { authorization, signature } }`. This wasn't obvious from examples or docs — had to read the server-side verification code.
- Site is a single `index.html` — no build step, no framework. Lives in `site/` folder of the `quotenorm-ai` code repo. Cloudflare Pages auto-deploys from GitHub.
- First real USDC payment processed on Base L2 via the site demo. The whole x402 flow (402 → sign → pay → result) takes a few seconds from the user's perspective.

### 2026-03-13

- **QuoteNorm Phase 1 scaffolding complete.** Code repo live on GitHub (`azbarroso/quotenorm-ai`). Express + x402 middleware, Claude extraction pipeline (Haiku-first/Sonnet fallback), sandbox endpoint tested with real extraction. All 7 source files, typechecks clean.
- x402 npm packages verified: actual names are `@x402/express`, `@x402/evm`, `@x402/core` (v2.6.0) — differ from earlier evaluation notes which referenced `@x402/http` and `@x402/mechanisms`.
- Next for QuoteNorm: deploy to Railway, build MCP tool, test on full-length documents, set up Base L2 wallet for USDC payments.

### 2026-03-11

- **PolicyNorm.ai project created** from x402-native business ideation brainstorm. Evaluated multiple ideas following the QuoteNorm pattern; PolicyNorm (ToS/Privacy Policy normalizer) selected as strongest candidate.
- Key differentiators vs QuoteNorm: broader market (every agent interacting with web services, not just procurement), higher per-call value ($0.25 vs $0.10), stronger moat (long legal docs + risk analysis), safety narrative (agents must understand terms before acting).
- Same playbook: x402-only, sandbox endpoint, MCP tool, gated execution, AleLabs LLC. Separate codebase and domain (`policynorm.ai`).
- Open question: run PolicyNorm Phase 0 in parallel with QuoteNorm or sequential?
- **ContextSignal archived (parked).** Multiple strategy pivots (v1 SaaS → v5 SEO → v6 prompt packs → v7 newsletter) never converged. Superseded by AgentsBoard and x402-native projects. Full project preserved in `_archive/`.

### 2026-03-06

- ContextSignal homepage v6 is live. Revised footer, About page, and contact form guidance prepared. Site files organised under `site/` subfolder.
- Top priority now is Beehiiv setup — every CTA on the homepage leads to `/newsletter/?ref=pm` which has no working form yet. Funnel is broken until this is done.

### 2026-03-05

- Set up personal project knowledge base using the same structure as work
- Created contextsignal-ai project — details to follow
- Created ale-markets project — removed after rethinking approach (market data fetching too token-heavy via web search; needs a proper data pipeline before it's useful)
- **ContextSignal strategy pivot:** Revised from SEO-volume strategy (v2.5.2) to product-first model. Three constraints drove the change: (1) real time budget is 2–3 hrs/week, not 5–7; (2) Claude does all writing with minimal human editing; (3) no direct PM/Sales domain expertise. Flipped revenue model to lead with digital products (45%), cut 8 verticals to 1 (PM only), killed automated content tier entirely, set honest targets ($1k–$2k at Month 12). The insight: AI-generated content is strong for utility products (prompt packs, templates) but weak for SEO authority plays.
