# x402 Protocol Evaluation

## Overview

x402 is an open protocol by Coinbase for internet-native payments using HTTP 402. Agents/clients pay per-request with stablecoins (USDC on Base L2). Server adds middleware, client wraps fetch — "1 line for the server, 1 function for the client."

**Repository:** https://github.com/coinbase/x402
**Docs:** https://docs.x402.org
**License:** Apache 2.0

## Maturity Assessment

| Signal | Value | Assessment |
|--------|-------|------------|
| GitHub stars | 5,600+ | Strong community interest |
| Forks | 1,300+ | Active ecosystem |
| Contributors | 243 | Healthy contributor base |
| Total commits | 655 | Actively maintained |
| Dependent projects | 567+ | Growing adoption |
| Protocol stats | 75M txns, $24M volume, 94K buyers, 22K sellers | Production usage is real |
| SDK languages | TypeScript, Python, Go, Java | Full coverage |
| Maintainer | Coinbase (CDP team) | Credible long-term backing |

**Verdict: Production-viable.** This isn't a toy or experiment — 75M transactions and Coinbase backing make it a credible bet.

## Architecture

### Payment Flow
```
1. Client → POST /v1/normalize (no payment header)
2. Server → 402 Payment Required + payment instructions (price, token, chain, facilitator URL)
3. Client → Signs payment with wallet, retries request with payment header
4. Server → Sends payment to facilitator for verification + settlement
5. Facilitator → Verifies signature, settles USDC on Base L2
6. Server → Returns response to client
```

### Key Concepts

**Facilitator:** Third party that verifies and settles payments. Coinbase hosts one (production-ready). Can self-host for more control. The facilitator has `/verify` and `/settle` endpoints.

**Schemes:** Payment mechanisms. "exact" = fixed price per request (what QuoteNorm needs). "upto" = variable amount (future use).

**Networks:** EVM chains (Base, Ethereum, etc.) and Solana. Base L2 is the sweet spot — low gas (<$0.01), fast confirmation, USDC native.

**Payment Identifier:** Idempotent retry mechanism — prevents duplicate charges if client retries.

**SIWX (Sign-In-With-X):** Wallet-based auth for returning users (useful for content access without re-paying, not needed for QuoteNorm v1).

**Bazaar:** Machine-readable catalog for API discovery — could list QuoteNorm endpoints for agents to find.

### TypeScript Packages (v2 architecture)

```
@x402/core         — Core protocol types and utilities
@x402/http         — HTTP middleware (Express, Hono, likely Next.js via Express adapter)
@x402/mechanisms   — Payment scheme implementations (exact, upto)
@x402/mcp          — MCP server integration for AI agents
@x402/extensions   — Extension modules
```

**Note:** Package structure was recently reorganized (v1→v2 migration). Previous packages like `x402-next`, `x402-express`, `x402-axios` appear to be in `legacy/`. The v2 packages use `@x402/` scoped names.

### Server Integration (Express example)

Based on the examples directory, server setup is minimal:

```typescript
import express from "express";
import { paymentMiddleware } from "@x402/http";

const app = express();

// One line to require payment
app.use("/v1/normalize", paymentMiddleware({
  price: "0.10",          // $0.10 USDC
  network: "base",        // Base L2
  facilitatorUrl: "https://facilitator.x402.org",
  payTo: "0x...",         // Your USDC wallet
}));

app.post("/v1/normalize", (req, res) => {
  // Normal endpoint logic — payment already verified
});
```

### Client Integration (Agent side)

```typescript
import { wrapFetch } from "@x402/fetch";

const fetch402 = wrapFetch(wallet);  // wallet signs payments
const response = await fetch402("https://api.quotenorm.ai/v1/normalize", {
  method: "POST",
  body: JSON.stringify({ url: "https://example.com/pricing" }),
});
```

### MCP Integration

The `@x402/mcp` package exists — this means QuoteNorm's MCP tool can natively handle x402 payments. Agents using MCP discover the tool and pay in the same flow.

## Implications for QuoteNorm

### What's great

1. **Minimal server code.** Payment middleware is literally one function call. No auth system, no billing logic, no Stripe webhooks.

2. **MCP package exists.** The `@x402/mcp` package means our MCP tool can wrap the x402 API natively — agents pay through MCP without extra setup.

3. **Bazaar discovery.** QuoteNorm can be listed in the x402 Bazaar catalog for agents to discover.

4. **Base L2 is ideal.** Gas <$0.01, fast confirmation, USDC native. $0.10 micropayments are viable.

5. **Facilitator is hosted.** Coinbase runs a production facilitator — no need to self-host initially.

6. **Multi-language SDKs.** TypeScript, Python, Go clients exist — agents in any language can pay.

7. **Payment identifier.** Built-in idempotency prevents double-charging on retries.

### Concerns

1. **v1→v2 migration.** The package structure was recently reorganized. Need to verify v2 packages are stable and published to npm. The `legacy/` folder suggests v1 packages may be deprecated.
   - **Mitigation:** Check npm for `@x402/http` publish date and version before committing.

2. **Next.js compatibility.** The examples show Express and Hono middleware, but no Next.js-specific middleware in v2. Next.js API routes use a different pattern (not Express middleware).
   - **Mitigation:** Two options: (a) use Express adapter in Next.js, or (b) use standalone Express server for the API. Given QuoteNorm is an API-only product (no frontend), a standalone Express server may be simpler than Next.js.

3. **Facilitator dependency.** The Coinbase facilitator is a single point of failure. If it goes down, payments fail.
   - **Mitigation:** Acceptable for v1. Self-hosted facilitator is possible later. The protocol is open, so no vendor lock-in.

4. **Testnet availability.** Need to confirm Base Sepolia testnet works for development/testing without real USDC.
   - **Mitigation:** The examples directory has a `mainnet/` example separate from others, suggesting default examples use testnet.

5. **Transaction costs.** At $0.10/call, gas costs are ~$0.001-$0.005 on Base L2. That's 1-5% of revenue — acceptable.
   - **Mitigation:** Monitor gas costs. If they spike, consider batch settlement.

### Tech Stack Decision: Express vs Next.js

The x402 research surfaces an important question: should QuoteNorm use Express (standalone API server) or Next.js (API routes)?

**Arguments for Express:**
- x402 middleware has native Express support
- QuoteNorm has no frontend — Next.js is overkill for a pure API
- Simpler deployment (single Express process)
- Shared stack with AgentsBoard is less important than clean architecture

**Arguments for Next.js:**
- Originally planned tech stack (shared with AgentsBoard)
- Vercel deployment is convenient
- Next.js API routes can use Express middleware via adapter

**Recommendation:** Use **Express** for QuoteNorm. It's a pure API — no SSR, no React, no pages. Express + x402 middleware + Vercel (or Railway) is the simplest path. This is a departure from the original "shared stack" plan, but the right call given x402 integration.

## Sandbox Endpoint

The sandbox endpoint (`/v1/sandbox/normalize`) needs to be **outside** the x402 middleware — no payment required. This is trivial: just don't apply the middleware to that route.

```typescript
// Payment required
app.use("/v1/normalize", paymentMiddleware({ price: "0.10", ... }));
app.post("/v1/normalize", handleNormalize);

// Free (no middleware)
app.post("/v1/sandbox/normalize", handleSandboxNormalize);
```

## Summary

| Criterion | Assessment |
|-----------|------------|
| Production-ready? | Yes — 75M txns, Coinbase-backed, Apache 2.0 |
| Integration effort | Low — one middleware line for server |
| Next.js compatible? | Partially — better with Express (native middleware support) |
| MCP support | Yes — `@x402/mcp` package exists |
| Base L2 gas costs | ~$0.001-$0.005 per txn (acceptable) |
| Multi-language clients | Yes — TS, Python, Go |
| Discovery (Bazaar) | Yes — machine-readable API catalog |
| Risk | Low — v2 migration needs verification, facilitator is single dependency |

**Overall: x402 is the right choice for QuoteNorm.** The ecosystem is more mature than expected. The main adjustment is using Express instead of Next.js for cleaner middleware integration.
