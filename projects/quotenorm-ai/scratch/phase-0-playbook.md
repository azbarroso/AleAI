# QuoteNorm Phase 0 Playbook

Phase 0 answers one question: **Is QuoteNorm meaningfully better than prompting Claude directly?**

If yes → Phase 1 (build the API). If no → park the project.

**Total estimated effort:** ~7-8 hours across 4 work blocks.
**Timeline:** 2 weeks (2-3 hrs/week).

---

## Work Block 1: Collect Sample Quotes (~1.5 hrs)

### What
Gather 15+ real SaaS quotes and pricing documents to use as test inputs. These become the ground truth for schema validation and extraction testing.

### Why this matters
Without real data, schema design is guesswork. The schema needs to handle the actual messiness of real quotes — partial info, inconsistent formats, vendor-specific jargon, multi-tier pricing.

### Specific tasks

1. **Collect 10 public SaaS pricing pages** (save as URLs + snapshot text)
   - Targets: Slack, Notion, Linear, Vercel, GitHub, Stripe, Datadog, Snowflake, HubSpot, Salesforce
   - For each: save the URL and a plain-text copy of the pricing content
   - Focus on pages with enough detail to extract terms (not just "$10/mo" buttons)

2. **Collect 3-5 sample PDF/email quotes** (save as files)
   - Create realistic mock quotes if real ones aren't available (based on actual vendor pricing)
   - Should include: multi-tier pricing, volume discounts, contract terms, SLA language
   - Vary complexity: one simple (flat price), one medium (tiers + terms), one complex (enterprise with custom pricing + negotiated terms)

3. **Create a ground-truth spreadsheet** (`test-data-index.md`)
   - For each sample: source, format (URL/PDF/text), vendor, expected key fields, known complexity
   - This becomes the accuracy benchmark — what the extraction pipeline should output for each input

### Deliverables
- `scratch/test-data/` folder with saved inputs (text snapshots, mock PDFs)
- `scratch/test-data-index.md` — index of all test inputs with expected outputs

### Recommendations
- **Start with URLs, not PDFs.** Most SaaS pricing lives on web pages, and URL→text extraction is simpler. PDF parsing is the harder problem — test it, but don't let it block schema validation.
- **Don't over-collect.** 15 samples is enough. The goal is variety (pricing models, industries, complexity levels), not volume.
- **Save snapshots, not just URLs.** Pricing pages change. Save the raw text so tests are reproducible.

---

## Work Block 2: Design & Validate the Schema (~2 hrs)

### What
Take the draft schema from the business plan, test it against the collected samples, and refine it into a stable v1 JSON Schema.

### Why this matters
The schema IS the product. If it doesn't fit real quotes, nothing else matters. This is also where you discover if SaaS quotes are structured enough for reliable extraction — or if the variation is too wild.

### Specific tasks

1. **Manual mapping exercise (45 min)**
   - Take 5 diverse samples from the test data
   - For each, manually fill in the business plan schema by hand
   - Note: which fields map cleanly? Which are ambiguous? Which are missing from the source?
   - Track patterns: do all SaaS quotes have contract length? Do most specify payment terms?

2. **Schema refinement (30 min)**
   - Based on the mapping exercise, revise the schema:
     - Remove fields that are rarely present (move to `custom_fields` or `metadata`)
     - Add fields that keep appearing but aren't in the current schema
     - Clarify ambiguous types (e.g., is `base_price.period` always "monthly"/"annual" or can it be "per-transaction"?)
   - Document every change and why

3. **Write formal JSON Schema (30 min)**
   - Convert the refined schema into a proper JSON Schema file (`schema/quote-v1.json`)
   - Include: types, required vs optional fields, enums for constrained values, descriptions for each field
   - This schema will be used for structured output with Claude API

4. **Define confidence scoring rules (15 min)**
   - Per-field confidence: what makes a field high vs low confidence?
   - Proposed rubric:
     - **High (0.9-1.0):** Explicitly stated, unambiguous (e.g., "$49/seat/month")
     - **Medium (0.6-0.89):** Implied or requires interpretation (e.g., "starts at $49" — per what?)
     - **Low (0.3-0.59):** Inferred from context, might be wrong (e.g., assuming monthly when not stated)
     - **Not found (0.0):** Field not present in source → goes to `missing_fields`

### Deliverables
- `scratch/schema/quote-v1.json` — formal JSON Schema
- `scratch/schema/schema-notes.md` — decisions made, fields added/removed, confidence rubric
- Updated ground-truth mappings showing schema fit

### Recommendations
- **Don't overthink `custom_fields`.** A catch-all `metadata` or `custom` object is fine for v1. You'll learn what belongs in the core schema from real usage.
- **Keep the schema flat-ish.** Deep nesting makes comparison harder later. `pricing.tiers[].price` is fine; `pricing.models[].tiers[].brackets[].price` is too deep.
- **Enum early.** For fields like `pricing.model`, define the allowed values now. It forces clarity and makes structured output more reliable.

---

## Work Block 3: Test Extraction with Claude API (~2.5 hrs)

### What
Build a test prompt, run it against the sample quotes via Claude API, and measure extraction quality. This is the core validation — does the LLM extraction pipeline produce reliable, structured output?

### Why this matters
This is the make-or-break test. If Claude can reliably extract structured data from real quotes with high confidence, the product works. If extraction is unreliable or requires heavy post-processing, the value prop weakens.

### Specific tasks

1. **Design the extraction prompt (30 min)**
   - System prompt: role (expert quote analyst), task (extract structured data), output format (JSON matching schema)
   - Include the JSON Schema in the prompt as the target structure
   - Add instructions for confidence scoring (use the rubric from Work Block 2)
   - Add instructions for missing field detection
   - Use Claude's structured output / tool_use mode for schema enforcement

2. **Run extraction on 5 diverse samples (45 min)**
   - Start with the 5 samples used in the manual mapping exercise
   - For each: send to Claude API, capture the full response
   - Save: input, prompt, raw response, parsed JSON, latency, token count
   - Compare output to ground truth from Work Block 2

3. **Measure accuracy (30 min)**
   - Per-field accuracy: does the extracted value match the ground truth?
   - Confidence calibration: do high-confidence fields tend to be correct?
   - Missing field detection: does it correctly identify what's absent?
   - Create a simple accuracy report: % fields correct, avg confidence, false positives/negatives

4. **Iterate the prompt (30 min)**
   - Based on accuracy results, refine the prompt
   - Common fixes: more specific field descriptions, few-shot examples, better handling of ambiguous pricing models
   - Re-run on the same 5 samples, compare before/after

5. **Run on remaining samples (15 min)**
   - Run the refined prompt on all 15+ samples
   - Update accuracy report
   - Identify any systematic failure patterns

### Deliverables
- `scratch/prompts/extraction-v1.md` — the extraction prompt (versioned)
- `scratch/results/` — extraction results for each sample (input → output pairs)
- `scratch/results/accuracy-report.md` — accuracy metrics, failure patterns, per-field breakdown

### Recommendations
- **Use `tool_use` mode, not raw JSON.** Claude's tool_use with a defined schema gives you validated JSON output. Raw JSON in a chat response is more likely to have format issues.
- **Test with Haiku first, then Sonnet.** If Haiku (cheap) gives 80%+ accuracy, your margins are great. If you need Sonnet/Opus, margins shrink — factor that into pricing.
- **Track token counts religiously.** At $0.10/call, you need to know your cost per call. A 20-page quote might cost $0.03-$0.08 in API tokens — that's tight margins. If costs are too high, consider:
  - Extracting from the most relevant sections only (not full document)
  - Using Haiku for initial extraction + Sonnet for low-confidence fields only
  - Adjusting pricing upward
- **Don't over-prompt.** Start simple. A concise system prompt + schema + document often beats a 2000-word prompt with 10 examples. Add complexity only where extraction fails.

---

## Work Block 4: x402 Proof of Concept + Go/No-Go Decision (~1.5 hrs)

### What
Evaluate the x402 npm package, test the payment flow, and make the Phase 1 go/no-go decision.

### Why this matters
x402 is the entire payment strategy. If the package is immature, poorly documented, or has deal-breaker limitations, you need to know before building Phase 1 around it.

### Specific tasks

1. **Evaluate x402 npm package (30 min)**
   - Install `@coinbase/x402` (or current package name)
   - Read the docs: middleware setup, facilitator configuration, payment verification
   - Check: is it production-ready? How many GitHub stars/issues? Last commit date? Breaking changes?
   - Understand the facilitator model: who verifies payments? Coinbase hosted vs self-hosted?

2. **Test payment flow on Base testnet (30 min)**
   - Set up a minimal Express/Next.js endpoint with x402 middleware
   - Configure for Base Sepolia testnet + test USDC
   - Simulate: client sends request → 402 response → client pays → server verifies → server responds
   - Measure: latency added by x402 middleware, payment verification time

3. **Go/No-Go decision (30 min)**
   - Review all Phase 0 findings:
     - **Extraction quality:** Is accuracy high enough? (Target: 85%+ field accuracy on clean inputs)
     - **Schema fit:** Does the schema cover real quotes without too many gaps?
     - **x402 readiness:** Is the package production-viable? Any blockers?
     - **Cost per call:** Is $0.10 pricing sustainable given Claude API costs?
     - **The core question:** Is this meaningfully better than prompting Claude directly?
   - Decision outcomes:
     - **Go:** Proceed to Phase 1. Create the code repo, scaffold the Next.js project.
     - **Iterate:** Schema or prompt needs more work. Extend Phase 0 by 1 week.
     - **Pivot:** x402 isn't ready or extraction quality is too low. Consider alternatives or park.
     - **Park:** The answer to "is this better than raw Claude?" is no. Move on.

### Deliverables
- `scratch/x402/x402-evaluation.md` — package assessment, test results, limitations found
- `scratch/x402/test-server/` — minimal x402 test server (can be discarded)
- Go/No-Go decision documented in project `log.md` and `tasks.md`

### Recommendations
- **Don't build a full server.** A 20-line Express app with x402 middleware is enough. You're testing the payment flow, not building the product.
- **Check Base L2 gas costs.** x402 claims "nominal" gas — verify. If gas costs eat into $0.10 transactions, that's a problem.
- **Look for x402 client libraries too.** Your MCP tool will need to make x402 payments on behalf of agents. Check if client-side x402 handling is straightforward.
- **If x402 isn't ready**, don't panic. The extraction pipeline is the hard part. x402 vs API keys is an implementation detail — you could ship with API keys and migrate to x402 later if needed. But document this as a conscious fallback, not the default plan.

---

## Summary: Phase 0 Decision Framework

| Signal | Go | Iterate | Park |
|--------|-----|---------|------|
| Field accuracy on clean inputs | >85% | 70-85% | <70% |
| Schema covers real quotes | >80% fields present | 60-80% | <60% |
| Confidence calibration | Reliable | Noisy but directional | Random |
| x402 package | Production-viable | Usable with workarounds | Broken/abandoned |
| Cost per call (Claude API) | <$0.05 | $0.05-$0.08 | >$0.08 |
| "Better than raw Claude?" | Clear yes — schema stability, confidence, missing fields | Marginal — mostly prompt engineering | No meaningful difference |

---

## File Structure After Phase 0

```
projects/quotenorm-ai/scratch/
├── phase-0-playbook.md          # This file
├── test-data/                   # Sample quotes (URLs, text snapshots, mock PDFs)
├── test-data-index.md           # Index with expected outputs
├── schema/
│   ├── quote-v1.json            # Formal JSON Schema
│   └── schema-notes.md          # Design decisions, confidence rubric
├── prompts/
│   └── extraction-v1.md         # Extraction prompt (versioned)
├── results/
│   ├── [sample-name].json       # Per-sample extraction results
│   └── accuracy-report.md       # Accuracy metrics, failure patterns
└── x402/
    ├── x402-evaluation.md       # Package assessment, findings
    └── test-server/             # Minimal x402 proof of concept (disposable)
```
