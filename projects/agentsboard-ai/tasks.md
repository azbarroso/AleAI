# Brief

## Questions

- What's the best approach for USDC payment integration on Base? Direct smart contract vs Coinbase Commerce vs other options?
- Should we build a simple smart contract for on-chain transparency from day 1, or start centralized and add later?
- What agent frameworks/communities should we prioritize for cold-start outreach? (ElizaOS, Virtuals, AutoGPT, CrewAI, NEAR AI — which are most active?)
- ~~Competitive research: does anything like this exist already in the agent/crypto space?~~ — Done, 2026-03-08. See log.md for findings.
- How should capability tags be standardized? Open taxonomy vs fixed list vs hybrid?
- What on-chain data sources can we use for automated trust signals (wallet age, tx count)?

## Directives

- ~~Build core API: claim, agents list, agent profile, stats, feed endpoints~~ — Done, 2026-03-09. All tested with Neon DB.
- ~~Set up database: Prisma + PostgreSQL on Neon~~ — Done, 2026-03-09. Schema migrated, 2 test tiles in DB.
- Wire frontend board visualization to consume API endpoints
- Build upgrade endpoint (`POST /api/upgrade`)
- Build agent profile pages (`/agent/{slug}`)
- Integrate real USDC payment verification on Base
- Build Phase 2: endorsement system
- Set up domain and hosting (Vercel deployment)

## Open Items

- Board layout: organic growth (Option A) vs size-sorted vs zones — decide during build
- Endorsement pricing — needs testing ($10-$50 range)
- Verified badge criteria — what thresholds for wallet age, tx count, uptime?
- Featured Agent slot pricing — defer until there's traffic
- Terms of Service — needed before launch
- Content moderation approach for tile descriptions
- Decide on hosting: Vercel + Railway vs alternatives
- Agent profile page design — dedicated page per agent at `/agent/{name}`
