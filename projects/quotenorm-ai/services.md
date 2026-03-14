# Services & Infrastructure

| Service | URL | Purpose |
|---------|-----|---------|
| Railway | https://railway.app | API hosting — `api.quotenorm.ai`. Auto-deploys from `main` branch. |
| Cloudflare Pages | https://dash.cloudflare.com | Static site hosting — `quotenorm.ai`. Auto-deploys from `site/` folder in code repo. |
| Squarespace | https://domains.squarespace.com | Domain registrar — `quotenorm.ai`. DNS points to Cloudflare Pages. |
| GitHub | https://github.com/azbarroso/quotenorm-ai | Code repo — API server (`src/`) + landing page (`site/`). |
| x402 Facilitator | https://x402.org/ecosystem?filter=facilitators | Third-party facilitator for x402 payment verification/settlement. No auth required. |
| Anthropic API | https://console.anthropic.com | Claude API for extraction pipeline (Haiku primary, Sonnet fallback). |
| Base L2 | https://basescan.org | USDC payment settlement chain. Payments received at wallet configured in Railway env vars. |
