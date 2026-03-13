# Schema Design Notes

Work Block 2 output: manual mapping exercise, schema refinement, and confidence rubric.

## 1. Manual Mapping Exercise

Mapped 5 diverse samples against the business plan schema. Findings below.

### Sample 01 — Linear (clean per-seat, 4 tiers)

**Maps well:**
- `vendor.name` = "Linear", `vendor.product` = "Linear", `vendor.website` = "https://linear.app"
- `pricing.model` = "per_seat"
- `pricing.tiers` = 4 tiers with clear per-user pricing

**Friction:**
- `pricing.base_price` — doesn't fit. Linear has no single base price; it has 4 tiers, each with a different per-seat price. The schema assumes one base price + one per-unit price, but multi-tier products need price *per tier*.
- `pricing.per_unit_price` — same issue. Which tier's price goes here?
- `terms.billing_frequency` — "annual" is listed but monthly is implied available. Schema only allows one value.
- `limits` — varies per tier (2 teams on Free, 5 on Basic, unlimited on Business). Schema doesn't model per-tier limits.

**Missing from schema:**
- No way to represent **per-tier features** (e.g., Free gets Slack+GitHub integrations, Business adds Zendesk+Intercom)
- No field for **free tier** existence
- No field for **AI features** (Linear includes AI agents)

### Sample 05 — Datadog (multi-product, usage-based)

**Maps well:**
- `vendor.name` = "Datadog"
- `pricing.model` = "usage_based" (partially — it's per-host + usage)

**Friction:**
- **Multiple products, each with own pricing.** Datadog has Infrastructure, APM, Log Management, etc. — each is essentially a separate quote. The current schema assumes one product = one quote. This is the biggest structural problem.
- `pricing.base_price` — there's no single base price. Infrastructure Pro is $15/host/month, APM Standard is $31/host/month. Which one?
- `pricing.overage` — multiple overage dimensions (custom metrics, spans, log events). Schema only allows one overage rate.
- `terms.billing_frequency` — both annual and on-demand available, with different prices for each.

**Missing from schema:**
- **Multi-product representation** — need a way to handle vendors that sell multiple products
- **Annual vs monthly price differentiation** — many vendors have both, with significant differences
- **Per-host pricing model** — "per_seat" doesn't capture per-host
- **Usage dimensions** — vendors have multiple usage meters, not just one overage rate

### Sample 09 — Twilio (pure usage, no seats)

**Maps well:**
- `vendor.name` = "Twilio"
- `pricing.model` = "usage_based"

**Friction:**
- **No plans/tiers at all.** Twilio is pure pay-per-use across many products. The schema's tier structure doesn't apply.
- `pricing.base_price` — not applicable. There's no monthly fee; you pay per SMS, per minute, per verification.
- `pricing.per_unit_price` — there are dozens of unit prices (SMS: $0.0083, Voice inbound: $0.0085/min, Voice outbound: $0.014/min, etc.). Schema allows one per-unit price.
- `limits` — no limits in the traditional sense; it's purely consumption-based.

**Missing from schema:**
- **Rate card representation** — a list of (service, unit, price) tuples
- **No-contract / pay-as-you-go flag** — important distinction from subscription models
- **Volume discount mention** without specific breakpoints

### Sample 12 — Mock Simple (email quote, TaskFlow)

**Maps well:**
- `vendor` fields all map cleanly
- `pricing.model` = "per_seat"
- `pricing.base_price` = { amount: 12, currency: "USD", period: "monthly" }
- `pricing.per_unit_price` = { amount: 12, currency: "USD", unit: "seat" }
- `terms.contract_length_months` = 12
- `terms.auto_renewal` = true
- `terms.cancellation_notice_days` = 30
- `terms.payment_terms` = "Net 30"
- `terms.billing_frequency` = "annual"
- `limits.users` = 25
- `limits.storage_gb` = 250 (10 GB/user × 25)
- `support.level` = "Priority email"
- `support.response_time` = "24 hours"
- `pricing.discounts` = [{ type: "volume", description: "10% off for 50+ seats" }]

**Friction:**
- `pricing.one_time_fees` — SSO is an add-on ($2/user/month), but it's recurring, not one-time. Need an `add_ons` field.
- `raw_source_type` — "email" isn't in the enum (only pdf, email, html, text). Actually "email" IS there — good.

**Missing from schema:**
- **Add-ons** (recurring optional extras like SSO) — different from one-time fees
- **Quote-specific metadata** — quote ID, validity date, sales contact, number of seats quoted
- **Explicit exclusions** — "not included" items are valuable for agents evaluating completeness

### Sample 14 — Mock Complex (DataStream Enterprise)

**Maps well:**
- `vendor` fields map cleanly
- `terms` fields mostly map (contract_length=36, auto_renewal=true, cancellation_notice=90 days for renewal, payment_terms="Net 60")

**Friction:**
- **Multiple pricing components** — platform license ($180K) + user licenses ($135K) + infrastructure usage ($168K est.) + professional services ($260K). Cannot represent in a single `pricing` object.
- `pricing.model` — it's simultaneously "flat" (platform license), "per_seat" (user licenses), "usage_based" (infrastructure), and "custom" (professional services). One enum value doesn't work.
- `pricing.tiers` — user licenses have 3 tiers (Admin $150/mo, Analyst $75/mo, Viewer $0), but this is *within the user license component*, not the overall product.
- `support` — 3 support tiers with detailed response times. Schema only allows one level/response_time.
- `compliance` — very rich (SOC2, ISO 27001, PCI DSS, HIPAA, GDPR, CCPA, FedRAMP). Maps to `certifications[]` well.

**Missing from schema:**
- **Multi-component pricing** — platform fee + per-seat + usage + professional services
- **Professional services / one-time implementation costs** — the current `one_time_fees` field exists but lacks structure
- **SLA details** — uptime target, service credits, RPO/RTO, maintenance windows
- **Contract negotiation terms** — price locks, escalation caps, early termination fees, liability caps
- **Quote metadata** — quote ID, validity period, customer name
- **Multi-year pricing** — year-over-year breakdown
- **Data portability / exit terms**
- **IP ownership terms**

---

## 2. Key Findings

### What works in the current schema
- `vendor` object is fine as-is
- `confidence` and `missing_fields` are well-designed
- `compliance.certifications[]` handles the data well
- `terms` object covers the basics for simple quotes
- `warnings[]` is valuable

### What needs to change

#### Problem 1: Single pricing model doesn't fit
The `pricing` object assumes one product with one pricing model. Reality:
- Vendors often have **multiple tiers** (Free/Pro/Enterprise), each a distinct pricing package
- Some vendors have **multiple products** (Datadog), each with own pricing
- Enterprise quotes have **multiple pricing components** (platform + seats + usage + services)

**Solution:** Restructure as `plans[]` — an array of plan objects, each with its own pricing, limits, and features. For enterprise quotes, components become separate items in the array.

#### Problem 2: No per-tier features or limits
Features and limits vary by tier, but the schema only captures one set of limits. An agent comparing plans needs to see what each tier includes.

**Solution:** Move `limits` and add `features[]` inside each plan object.

#### Problem 3: Annual vs monthly pricing
Most SaaS products have both monthly and annual pricing (often 15-20% difference). The schema captures one price.

**Solution:** Add `annual_price` alongside `price`, or make price an object with `monthly` and `annual` fields.

#### Problem 4: No add-ons
Recurring optional extras (SSO, premium support, HIPAA BAA) are common and don't fit `one_time_fees` or `tiers`.

**Solution:** Add `add_ons[]` at the top level — each with name, price, period.

#### Problem 5: Missing quote metadata
Enterprise quotes have validity dates, quote IDs, customer info, sales contacts. Important for agent workflows.

**Solution:** Add `quote_metadata` object (optional, for direct quotes vs public pricing pages).

#### Problem 6: SLA details too thin
Just `sla_uptime` and `response_time` misses service credits, RPO/RTO, maintenance windows.

**Solution:** Expand `support` to include structured SLA details.

### What to defer (not v1)
- Multi-year pricing breakdowns (can go in `metadata`)
- IP ownership / legal terms (out of scope for v1 — that's PolicyNorm territory)
- Liability caps / indemnification (legal, not pricing)
- Data portability terms (legal)

---

## 3. Revised Schema (v1)

See `quote-v1.json` for the formal JSON Schema. Key structural changes from the business plan draft:

1. **`plans[]` replaces flat `pricing`** — array of plan objects, each with name, pricing, limits, features
2. **Price objects include both monthly and annual** — `{ monthly: number, annual: number, currency, unit, period }`
3. **`add_ons[]` added** — recurring optional extras
4. **`quote_metadata` added** — optional, for direct quotes (quote ID, validity, customer, contact)
5. **`support` expanded** — SLA details, response times per severity, service credits
6. **`pricing.model` enum expanded** — added "per_host", "component" (for multi-component enterprise deals), "rate_card" (for pure usage like Twilio)
7. **`terms` expanded** — early termination, price escalation cap, price lock period

---

## 4. Confidence Scoring Rubric

### Per-Field Confidence Levels

| Level | Score Range | Criteria | Examples |
|-------|-----------|----------|----------|
| **High** | 0.90 - 1.00 | Explicitly stated, unambiguous, single interpretation | "$49/seat/month", "SOC 2 Type II certified", "Net 30 payment terms" |
| **Medium** | 0.60 - 0.89 | Stated but requires interpretation, or slightly ambiguous | "starts at $49" (per what unit?), "priority support" (what response time?), "annual billing" (but monthly price not shown) |
| **Low** | 0.30 - 0.59 | Inferred from context, educated guess, or conflicting signals | Assuming monthly when period not stated, inferring storage limit from tier name, guessing cancellation terms from industry norms |
| **Not found** | 0.00 | Field not present in source document | Goes to `missing_fields[]` instead of being extracted with low confidence |

### Overall Confidence
- **Weighted average** of per-field confidences, weighted by field importance
- High-weight fields: pricing, contract length, billing frequency
- Medium-weight fields: limits, support level, compliance
- Low-weight fields: vendor website, specific feature lists

### Confidence Modifiers
- **Source type bonus:** Direct quote/proposal gets +0.05 confidence vs public pricing page (more likely to be current and specific)
- **Recency penalty:** If document date is >6 months old, apply -0.05 to pricing fields
- **Completeness bonus:** Documents with more explicit fields tend to be more reliable overall

### When NOT to extract
- If confidence would be below 0.30 for a field, don't extract it — add to `missing_fields` instead
- Never fabricate values to fill the schema — a missing field with high confidence in its absence is better than a guessed value with low confidence
