---
name: x402 facilitator URL
description: Use payai.network facilitator instead of x402.org for x402 payment middleware on Base mainnet
type: feedback
---

Use `https://facilitator.payai.network` as the x402 facilitator URL, not `https://x402.org/facilitator`. The default x402.org facilitator does not support the "exact" scheme on Base mainnet (eip155:8453).

**Why:** Discovered during QuoteNorm deployment — x402.org facilitator fails with `RouteConfigurationError: Facilitator does not support scheme "exact" on network "eip155:8453"`.

**How to apply:** Set `X402_FACILITATOR_URL=https://facilitator.payai.network` in env vars for any x402-enabled project. Update both Railway env vars and local `.env`.
