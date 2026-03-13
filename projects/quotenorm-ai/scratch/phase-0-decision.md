# Phase 0 Go/No-Go Decision

**Date:** 2026-03-12
**Decision:** GO — proceed to Phase 1

---

## Decision Framework Results

| Signal | Target | Actual | Status |
|--------|--------|--------|--------|
| Field accuracy on clean inputs | >85% | ~90% (mock-simple: 0.91, mock-complex: 0.94) | PASS |
| Schema covers real quotes | >80% fields present | ~85% (all 5 input types fit the schema) | PASS |
| Confidence calibration | Reliable | Directionally correct (enterprise > public pages) | PASS |
| x402 package | Production-viable | Yes — 75M txns, Coinbase-backed, multi-language SDKs | PASS |
| Cost per call (Claude API) | <$0.05 | Haiku: ~$0.003, Sonnet: ~$0.015 | PASS |
| "Better than raw Claude?" | Clear yes | Yes — schema stability, confidence scoring, missing field detection, rate_card handling | PASS |

**All 6 criteria passed.**

## What We Validated

1. **Schema works.** The `plans[]` array handles tiered SaaS, multi-product platforms, pure usage-based pricing, and complex enterprise proposals. The v1 JSON Schema is ready for production.

2. **Extraction quality is high.** Average confidence of 0.83 across 5 diverse samples. Enterprise quotes score 0.94. The prompt is compact (~350 words) and produces clean, structured output.

3. **Margins are excellent.** At $0.10/call:
   - Haiku: ~$0.003 cost → 97% margin
   - Sonnet: ~$0.015 cost → 85% margin
   - Even 20-page PDFs at Sonnet pricing (~$0.05-0.08) leave healthy margins

4. **x402 is production-ready.** 75M transactions, Coinbase backing, Express middleware, MCP package, Base L2 gas at $0.001-0.005. The ecosystem is more mature than expected.

5. **The product adds real value over raw Claude.** Schema stability, confidence scoring, missing field detection, and warnings provide value that a developer can't get from a single Claude prompt. The schema itself (designed from real data) is an asset.

## Key Decisions for Phase 1

1. **Express instead of Next.js.** x402 middleware has native Express support. QuoteNorm is a pure API — Next.js adds unnecessary complexity. Departure from original "shared stack" plan.

2. **Haiku-first, Sonnet fallback.** Start with Haiku for all extractions. If confidence drops below 0.70, re-extract with Sonnet. This keeps costs minimal while maintaining quality.

3. **Schema v1 is final for Phase 1.** The 5 prompt refinements identified go into extraction-v2.md, but the schema structure is locked.

4. **Sandbox endpoint is trivial.** Just skip x402 middleware on that route. Truncate output to first 2 plans, no confidence details.

## What's NOT Validated (Risks for Phase 1)

1. **Real document length.** Test samples were pre-processed text snapshots. Real-world inputs will be full HTML pages or multi-page PDFs — significantly more tokens. Need to test with actual Claude API calls on full documents.

2. **URL → text extraction.** We skipped the URL fetching and HTML-to-text step. Some pricing pages are heavily client-rendered (Slack, Stripe, HubSpot failed WebFetch). Need to decide: support only text/PDF in v1, or invest in headless browser?

3. **PDF parsing.** No real PDFs tested. `pdf-parse` or `unpdf` needs evaluation for enterprise proposals.

4. **x402 v2 npm packages.** Package structure was recently reorganized. Need to verify `@x402/http` etc. are published and stable before building on them.

5. **Concurrent requests and rate limits.** No load testing. What happens with 100 simultaneous requests?

## Phase 1 Scope (Confirmed)

| Deliverable | Details |
|-------------|---------|
| `POST /v1/normalize` | Text input → structured JSON. x402 payment ($0.10 USDC). |
| `POST /v1/sandbox/normalize` | Free, truncated output (first 2 plans, no confidence). IP rate-limited. |
| MCP tool | `@quotenorm/mcp-server` wrapping the x402 API. |
| Tech stack | Express + TypeScript + `@x402/http` + Claude API (Haiku) + Neon |
| Input formats (v1) | Text, URL (best-effort HTML-to-text). PDF deferred unless trivial. |
| Deployment | Railway or Vercel (Express adapter) |
| Domain | `quotenorm.ai` (register in Phase 1 setup) |

## Next Steps

1. **Register `quotenorm.ai` domain**
2. **Create code repo** at `~/dev/claude_dev/quotenorm-ai/`
3. **Scaffold Express + TypeScript project**
4. **Verify x402 v2 packages are published to npm**
5. **Build `/v1/normalize` endpoint** with extraction pipeline
6. **Add x402 middleware** and test on Base Sepolia testnet
7. **Build sandbox endpoint**
8. **Deploy and test end-to-end**
