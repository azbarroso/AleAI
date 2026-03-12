# Brief

## Questions

- **Schema validation:** Does the proposed output schema cover what agents actually need when evaluating a ToS? Test against 3-5 real SaaS ToS docs and see what's missing or redundant.
- **Extraction quality:** Can Claude reliably extract structured data from 10-50 page legal documents? What's the failure mode — hallucinated clauses, missed sections, or wrong risk levels?
- **Pricing validation:** Is $0.25/call the right price point? What's the Claude API cost per call for a 20-page ToS? Need to confirm margins.
- **Domain availability:** Is `policynorm.ai` available? Check alternatives if not.
- **Differentiation from existing tools:** What exists today for automated ToS/policy analysis? How does PolicyNorm differentiate (x402-native, agent-first, structured JSON output)?

## Directives

- **Collect sample documents:** Gather 15+ real SaaS Terms of Service (e.g., Slack, Notion, Linear, Vercel, GitHub, Stripe). Save URLs or text for Phase 0 testing.
- **Design JSON schema:** Draft the full JSON schema for `/v1/normalize` output. Include all fields from the overview, with types and examples.
- **Test extraction:** Run 3-5 sample ToS through Claude with a structured extraction prompt. Evaluate output quality, identify failure modes.
- **Estimate API costs:** Calculate Claude API cost per call for typical document lengths (5-page, 20-page, 50-page ToS). Confirm $0.25 pricing leaves healthy margins.

## Open Items

- **QuoteNorm vs PolicyNorm priority:** Both are in Phase 0. Should they run in parallel or sequential? Shared learnings argue for sequential (QuoteNorm first since it's further along), but they're independent enough for parallel.
- **Shared infrastructure:** How much can be shared between QuoteNorm and PolicyNorm? x402 facilitator, wallet, Neon DB, Vercel project — or fully separate?
- **Phase 0 timeline:** When to start Phase 0? After QuoteNorm Phase 0, or in parallel?
- **Risk flag calibration:** How to calibrate risk levels (high/medium/low)? Need a rubric — what makes a clause "high risk" vs "medium"? This is where domain expertise matters.
