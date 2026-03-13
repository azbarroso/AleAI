# Test Data Index

14 sample inputs for Phase 0 schema validation and extraction testing.

## Summary

| Type | Count | Notes |
|------|-------|-------|
| URL pricing pages (real) | 11 | Captured as text snapshots from live SaaS pricing pages |
| Mock email quote | 1 | Simple flat-rate SaaS — tests basic extraction |
| Mock proposal (medium) | 1 | Multi-tier with negotiated terms — tests discount handling, contract terms |
| Mock proposal (complex) | 1 | Enterprise with custom pricing, SLAs, professional services — tests edge cases |

## Pricing Model Variety

| Model | Samples |
|-------|---------|
| Per-seat/user | Linear, Notion, GitHub, 1Password, Postman, Render, mock-simple, mock-medium |
| Usage-based | Datadog, Twilio, Neon, MongoDB, Vercel |
| Flat-rate | mock-simple (team plan) |
| Tiered/component | Datadog, Vercel, mock-complex |
| Custom/enterprise | All (enterprise tiers), mock-complex |

## Samples

### Real SaaS Pricing Pages

| # | File | Vendor | Pricing Model | Complexity | Key Challenge |
|---|------|--------|--------------|------------|---------------|
| 01 | `01-linear-pricing.md` | Linear | Per-seat, 4 tiers | Low | Clean tier structure, easy extraction |
| 02 | `02-vercel-pricing.md` | Vercel | Per-seat + usage-based | High | Many usage dimensions, overage pricing, add-on costs |
| 03 | `03-github-pricing.md` | GitHub | Per-seat, 3 tiers | Low-Medium | Promotional pricing, add-on services |
| 04 | `04-notion-pricing.md` | Notion | Per-seat, 4 tiers | Medium | AI add-on pricing, student plan, refund policy details |
| 05 | `05-datadog-pricing.md` | Datadog | Per-host + usage | Very High | Multiple products, each with own tiers; complex overage; annual vs on-demand |
| 06 | `06-1password-pricing.md` | 1Password | Per-seat + flat-rate | Low | Simple tiers, clear features; teams starter is flat rate |
| 07 | `07-mongodb-pricing.md` | MongoDB | Usage-based (hourly) | High | Many cluster tiers, usage-based pricing, add-on services |
| 08 | `08-postman-pricing.md` | Postman | Per-seat, 4 tiers | Medium | AI credits with overage, monitoring limits, RBAC tiers |
| 09 | `09-twilio-pricing.md` | Twilio | Usage-based (per-unit) | High | Pure usage pricing across many products, no seat model |
| 10 | `10-render-pricing.md` | Render | Per-seat + per-instance | High | Workspace plans + compute instances + databases, many tiers |
| 11 | `11-neon-pricing.md` | Neon | Usage-based (CU-hours) | Medium | Usage-based compute, special programs, branch pricing |

### Mock Quotes

| # | File | Vendor | Pricing Model | Complexity | Key Challenge |
|---|------|--------|--------------|------------|---------------|
| 12 | `12-mock-simple-quote.md` | TaskFlow (mock) | Per-seat, flat | Low | Email format, informal language, volume discount mentioned |
| 13 | `13-mock-medium-quote.md` | CloudVault (mock) | Per-seat + storage add-on | Medium | Multi-year pricing, negotiated discount, early termination fee, SLA |
| 14 | `14-mock-complex-quote.md` | DataStream (mock) | Platform + seat + usage + PS | Very High | Multiple pricing components, infrastructure overage, 3-year deal, detailed SLA with service credits, professional services, IP terms |

## Expected Schema Coverage

Fields the schema should handle, with notes on which samples exercise each:

| Schema Field | Well-Covered By | Partially Covered | Missing From |
|-------------|----------------|-------------------|-------------|
| `vendor.name` | All | — | — |
| `vendor.product` | All | — | — |
| `pricing.model` | All | — | — |
| `pricing.base_price` | 01-04, 06, 08, 12, 13 | 05 (per-product) | 09 (pure usage) |
| `pricing.per_unit_price` | 01-04, 06, 08, 12, 13 | 05, 07 | 09 |
| `pricing.tiers` | 01-08, 10, 11 | 14 (component-based) | 09, 12 |
| `pricing.overage` | 02, 05, 07, 08, 14 | — | 01, 03, 06, 12 |
| `pricing.discounts` | 13, 14 | 04 (annual savings) | Most public pages |
| `pricing.one_time_fees` | 14 (professional services) | — | Most |
| `terms.contract_length` | 12, 13, 14 | — | Public pages (implied monthly/annual) |
| `terms.auto_renewal` | 12, 13, 14 | — | Public pages |
| `terms.cancellation_notice` | 13 (60 days), 14 (90 days) | 12 (30 days) | Public pages |
| `terms.payment_terms` | 12 (Net 30), 13 (Net 45), 14 (Net 60) | — | Public pages |
| `limits.users` | 01, 06, 12, 13, 14 | — | Usage-based (05, 07, 09) |
| `limits.storage` | 01, 02, 04, 07, 10, 13, 14 | — | — |
| `support.level` | 04, 05, 08, 10, 13, 14 | 01, 03, 06 | 09 |
| `support.sla_uptime` | 02 (99.99%), 13 (99.9%), 14 (99.95%) | — | Most |
| `support.response_time` | 13 (4hr), 14 (detailed) | 03 (30min Premium) | Most |
| `compliance.certifications` | 02, 04, 06, 10, 13, 14 | 03, 05 | 09, 12 |

## Notes

- **Failed fetches:** Slack, Stripe, HubSpot, Jira, Figma — all heavily client-rendered, returned JS/CSS only. Could retry with a headless browser if needed, but 11 real samples + 3 mocks is sufficient for Phase 0.
- **Cloudflare** partially fetched (add-ons only, no plan details) — excluded.
- **Mock quotes** designed to test scenarios that public pricing pages don't cover: negotiated discounts, contract terms, payment terms, SLAs, professional services, termination clauses.
- **Complexity distribution:** 3 Low, 4 Medium, 4 High, 3 Very High — good spread for testing extraction quality across difficulty levels.
