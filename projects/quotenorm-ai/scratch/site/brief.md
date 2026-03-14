# QuoteNorm.ai — Landing Page

## Concept

Single static page. No framework, no build step — just HTML + CSS + JS. Dark, minimal, developer-focused.

Live at `quotenorm.ai`. Source at `site/index.html` in the `quotenorm-ai` code repo.

## Design

- **Background:** #0a0a0a (near-black)
- **Text:** #f5f5f5 (off-white)
- **Accents:**
  - Cyan (#00e5ff) — API endpoints, technical terms
  - Orange (#ff9100) — pricing, USDC, payment references
  - Yellow (#ffd600) — emphasis words, call-to-action
- **Font:** System monospace stack (`"SF Mono", "Fira Code", "JetBrains Mono", monospace`)
- **Layout:** Single column, centered, max-width ~800px
- No logo, no images — text and code only

## Sections (top to bottom)

### 1. Hero
- **QuoteNorm.ai** (large, with cyan dot)
- Two-line tagline:
  - "Pricing pages are messy. Your agent needs structured data."
  - "One API call. Pay per request. No setup."
- Subtle sub-tagline: "x402-native · USDC on Base · no accounts · no API keys"

### 2. What It Does
- 4 bullet points:
  - Send a pricing page URL, get back structured JSON — ready for comparison
  - Plans, pricing, features, terms — normalized across vendors
  - Confidence scores per field — know what's reliable vs inferred
  - Missing-field alerts — know what the vendor didn't disclose

### 3. Sample Output
- Syntax-highlighted JSON block showing a truncated Linear pricing result
- Shows: vendor, 2 plans (Free + Pro with pricing models), confidence score, missing fields, source

### 4. Try It (Live Demo)
- **Connect Wallet** button (MetaMask / injected provider)
- On connect: switches to Base mainnet (chain ID 8453), shows truncated address + "on Base"
- Input field: "Paste a pricing page URL"
- **Normalize** button ($0.10 USDC) — disabled until wallet connected
- **Try free (sandbox)** button — no wallet needed
- Status messages shown below buttons
- Results displayed as syntax-highlighted JSON in a code block

### 5. API Reference
- Endpoint table: `/v1/normalize` ($0.10 USDC), `/v1/sandbox/normalize` (free), `/health`
- Request body example
- Note: "Built for autonomous agents. Works with any x402-compatible client. No API keys. No accounts."

### 6. Footer
- Links: AleLabs · x402.org (both open in new tab)
- Privacy line (white text): "QuoteNorm processes your input and returns structured JSON. Raw input is deleted within 24 hours."

## Tech

- Single `index.html` file — inline CSS + JS, no build step
- Vanilla JS for wallet connect + API calls
- No external dependencies — no viem, no ethers.js, no @x402 client libs
- x402 payment signing uses MetaMask's `eth_signTypedData_v4` directly (EIP-3009 TransferWithAuthorization)
- Hosted on Cloudflare Pages, auto-deploys from `site/` folder in `quotenorm-ai` GitHub repo
- Domain: `quotenorm.ai` (DNS via Squarespace, pointing to Cloudflare Pages)

## x402 Client-Side Flow

Manual EIP-3009 signing — no @x402 client libraries needed. We tried `@x402/evm` via esm.sh CDN but it caused viem version mismatches (`invalid_exact_evm_payload_signature`). Direct signing is simpler and dependency-free.

1. POST to `api.quotenorm.ai/v1/normalize` → get 402
2. Decode `payment-required` header (base64 JSON) → extract `accepts[0]`
3. Build EIP-712 typed data for `TransferWithAuthorization` using payment requirements (domain: token name/version/chainId/contract, message: from/to/value/validAfter/validBefore/nonce)
4. Sign via `eth_signTypedData_v4` through MetaMask
5. Build payload: `{ x402Version: 2, accepted: <requirements>, payload: { authorization, signature } }`
6. Base64 encode → send as `payment-signature` header
7. Server verifies via facilitator → returns full JSON result

## Out of Scope
- No signup, no dashboard, no account management
- No analytics (maybe add Plausible later)
- No blog, no docs site — this one page is everything
