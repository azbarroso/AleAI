# QuoteNorm.ai — Landing Page Brief

## Concept

Single static page. No framework, no build step — just HTML + CSS + JS. Dark, minimal, developer-focused.

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
- **QuoteNorm.ai** (large)
- One-liner: "Structured pricing data from any vendor page. One API call. Pay with USDC."
- Subtle tagline: "x402-native · Base L2 · no accounts · no API keys"

### 2. What It Does
- 3-4 short bullet points:
  - Send a URL, get structured JSON
  - Plans, pricing, features, terms — normalized and comparable
  - Confidence scores per field
  - Missing-field alerts for what the source doesn't include

### 3. Sample Output
- Syntax-highlighted JSON block showing a realistic truncated response
- Use the Linear pricing result as the example (vendor, 2 plans, confidence, source)

### 4. Try It (Live Demo)
- **Connect Wallet** button (MetaMask / injected provider)
- Once connected: show wallet address + USDC balance
- Input field: "Paste a pricing page URL"
- **Normalize** button ($0.10 USDC)
- Flow:
  1. POST to `api.quotenorm.ai/v1/normalize`
  2. Get 402 → sign x402 payment with connected wallet
  3. Resend with payment header
  4. Display full JSON result in a code block
- Also show a "Try free (sandbox)" link that hits `/v1/sandbox/normalize` — no wallet needed

### 5. API Reference (minimal)
```
POST /v1/normalize          $0.10 USDC (x402)
POST /v1/sandbox/normalize  Free (truncated, rate-limited)
GET  /health
```
- Request body: `{ "content": "https://...", "source_type": "url" }`
- Note: "No API keys. No accounts. Pay per request with USDC on Base L2."

### 6. Footer
- "Built by AleLabs" · GitHub link · x402.org link
- One line: "QuoteNorm processes your input and returns structured JSON. Raw input is deleted within 24 hours. Powered by Claude."

## Tech

- Single `index.html` file
- Inline CSS (or single `<style>` block)
- Vanilla JS for wallet connect + API calls
- Dependencies (CDN):
  - ethers.js or viem (for MetaMask interaction + EIP-3009 signing)
  - Need to handle x402 payment flow client-side
- Host on: Vercel static, Cloudflare Pages, or even GitHub Pages
- Domain: `quotenorm.ai` (root, not api subdomain)

## x402 Client-Side Flow

The tricky part is the x402 payment in the browser. Options:
1. **@x402/paywall** — pre-built UI component, handles wallet connect + payment
2. **Manual with ethers.js** — call API, parse 402 response, sign EIP-3009 TransferWithAuthorization, resend
3. **@x402/fetch wrapper** — `wrapFetchWithPayment()` with browser wallet as signer

Option 1 (@x402/paywall) may be simplest if it works as a drop-in. Otherwise option 2 keeps it dependency-light.

## Out of Scope
- No signup, no dashboard, no account management
- No analytics (maybe add Plausible later)
- No blog, no docs site — this one page is everything
