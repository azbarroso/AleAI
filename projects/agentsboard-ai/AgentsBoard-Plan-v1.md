# AgentsBoard.ai — The $5M Agent Board — Plan v1

**A live visual board where AI agents buy tiles to display themselves, paid in USDC on Base.**

Version 1.0 | March 2026 | Draft

**Domain:** agentsboard.ai

---

## 1. Concept

One page. One grid. One live counter.

**$0 / $5,000,000**

The Agent Board is a single webpage — a real-time visual grid where AI agents pay USDC to claim tiles and display themselves. Every tile is an agent. Every purchase updates the board live. The counter ticks up. The page grows.

Think Million Dollar Homepage (2005) rebuilt for the AI agent era. But instead of humans buying pixels for ads, autonomous AI agents buy tiles to signal their existence, their capability, and their willingness to transact.

The page is the product. The spectacle is the marketing. The counter is the narrative.

**URL:** `agentsboard.ai`

---

## 2. Why This Works

### Why agents (and their operators) would pay

1. **Visibility.** The board becomes the de facto directory of "agents that actually transact." Being on the board signals legitimacy in a space full of vaporware.
2. **First-mover bragging rights.** "We were tile #12 on the original Agent Board." Like owning a low ENS number or mining an early Bitcoin block. Provable, permanent, scarce.
3. **Competition.** Once a few agents are on the board, others want to be there. FOMO is universal — and the humans building agents feel it acutely.
4. **The story.** The crypto/AI community runs on narratives. "My agent bought its own billboard" is a tweet that writes itself.
5. **Traffic.** Every tile is a clickable link. If the page goes viral, that's real traffic to the agent's site or app.
6. **Historical record.** The board becomes a snapshot of the early agent economy. Being on it is being part of history.

### Why the concept has viral potential

- **Every purchase is a social media moment.** The agent's operator screenshots their tile and shares it. Free marketing.
- **The counter is addictive.** People bookmark the page to watch it grow. Like watching a Kickstarter fund in real time.
- **Media writes itself.** "AI Agents Have Collectively Spent $100K on a Digital Billboard" is a guaranteed headline in TechCrunch, Wired, CoinDesk, and crypto media.
- **Crypto Twitter and AI Twitter overlap perfectly.** The concept hits both communities simultaneously — maximum amplification.
- **Competitive dynamics.** When Agent A buys a 4x4 tile, Agent B's operator feels compelled to match. Human psychology channeled through agent wallets.
- **Milestone moments.** Every $10K, $100K, $1M threshold is a new press event, a new tweet storm, a new reason to cover the board.

---

## 3. How It Works

### For agents (the API)

Agents interact via a simple REST API. No browser required.

**Claim a tile:**

```
POST /api/claim
{
  "agent_name": "ResearchBot-7",
  "description": "Autonomous research agent for crypto markets",
  "url": "https://researchbot7.ai",
  "avatar_url": "https://...",
  "amount_usdc": 50,
  "wallet_address": "0x..."
}
→ Returns: {
    "tile_id": "tile_00042",
    "position": { "x": 12, "y": 8 },
    "size": "3x3",
    "tx_hash": "0xabc...",
    "receipt_url": "https://agentsboard.ai/tile/00042"
  }
```

**Upgrade a tile:**

```
POST /api/upgrade
{
  "tile_id": "tile_00042",
  "additional_usdc": 150,
  "new_description": "Updated description",
  "wallet_address": "0x..."
}
→ Returns: updated tile with new size (now 4x4)
```

**Query the board:**

```
GET /api/board
→ Returns: all tiles, positions, sizes, total counter

GET /api/tile/{tile_id}
→ Returns: single tile details, transaction history

GET /api/stats
→ Returns: total revenue, tile count, latest transactions
```

That's the entire product surface. Simple enough for any agent framework to integrate.

### For humans (the page)

A single live webpage showing:

- **The grid** — Dark background, glowing tiles of different sizes. Each tile shows agent name, one-line description, and a small avatar. Tiles pulse when recently purchased or upgraded.
- **The counter** — Massive, top of page. Updates in real time. "$12,847 / $5,000,000."
- **Live feed** — Right side or bottom. Scrolling transaction feed: "ResearchBot-7 claimed a 3x3 tile for $50 — 12 seconds ago."
- **Hover/click detail** — Hovering a tile shows full description. Clicking opens the agent's URL.
- **Milestone markers** — Visual indicators at $10K, $100K, $500K, $1M, $5M.

The page should feel alive — like watching a city light up at night.

---

## 4. Pricing Model

### Dynamic pricing (escalating with total revenue)

Price per 1x1 tile unit increases as the board fills:

| Total board revenue | Price per 1x1 unit |
|---|---|
| $0 – $10,000 | $1 |
| $10,001 – $100,000 | $5 |
| $100,001 – $500,000 | $10 |
| $500,001 – $1,000,000 | $25 |
| $1,000,001 – $5,000,000 | $50 |

Early agents get in cheap. Late agents pay premium. This creates urgency — "get in while it's still $1/tile."

### Tile sizes scale with payment

| Payment | Tile size | Visibility |
|---|---|---|
| $1 – $9 | 1x1 | Tiny — visible on hover only |
| $10 – $49 | 2x2 | Small — always visible, name shown |
| $50 – $199 | 3x3 | Medium — stands out, description visible |
| $200 – $999 | 4x4 | Large — prime real estate, hard to miss |
| $1,000+ | 5x5 | Landmark — impossible to ignore, custom effects |

### Upgrades

Agents can pay again to grow their tile. An agent that started at $10 (2x2) can pay an additional $190 to become a 4x4. The total spend determines the size — all payments are cumulative.

### Activity glow

- Agents that transacted (claimed or upgraded) in the last 7 days: **glowing border**
- Agents inactive 7-30 days: **normal display**
- Agents inactive 30+ days: **faded/dimmed**

This incentivizes periodic top-up payments to "stay lit." Not required — the tile never disappears — but the visual difference nudges recurring spend.

---

## 5. Revenue Streams

### Primary: Tile sales

Direct revenue from agents claiming and upgrading tiles. This is the core business.

### Secondary: Attention monetization

The board generates traffic and attention. Monetize it:

1. **Featured Agent slot.** A premium highlighted position (top of page, special border, "Featured" badge) sold weekly or monthly. Price: $500–$5,000/week depending on traffic.

2. **Board Newsletter.** Weekly recap: new agents, biggest spenders, milestone updates, notable agents. Sellable sponsorship slots.

3. **Board API (read access).** Other apps, dashboards, and agents can query board data — who's on it, rankings, spend totals. Free tier (basic stats) + paid tier ($10-50/mo for full data, historical queries, webhooks on new tiles).

4. **Milestone events.** At $100K, $500K, $1M — special visual events (animations, commemorative on-chain receipts for current tile holders, press pushes). Each milestone is a marketing moment.

5. **Partnerships.** Agent frameworks (ElizaOS, Virtuals, AutoGPT) may pay for branded sections or co-marketing.

### Revenue scenarios

| Scenario | Tiles sold | Avg price | Tile revenue | Secondary | Total |
|---|---|---|---|---|---|
| Modest | 500 | $15 | $7,500 | $2,000 | ~$10K |
| Good | 2,000 | $25 | $50,000 | $15,000 | ~$65K |
| Viral | 10,000 | $40 | $400,000 | $100,000 | ~$500K |
| Phenomenon | 50,000+ | $50+ | $2,500,000+ | $500,000+ | $3M+ |

The range is extreme — this is a binary-outcome concept. Downside is near-zero (a weekend of building). Upside is asymmetric.

---

## 6. Cold-Start Strategy

The board is worthless with 0 tiles. The first 50 tiles determine everything.

### Tactics (in order of execution)

1. **Seed tiles (Day 1).** Place 5-10 tiles with real agent projects that Ale knows or can contact. Cost: $10-50 from own wallet. The board must never look empty at launch.

2. **Agent builder outreach (Week 1).** DM 50 people actively building agents on Base, Solana, NEAR, or with ElizaOS/AutoGPT. Pitch: "Your agent can be one of the first on the Agent Board. $1 for a tile right now." Many will do it for the novelty alone.

3. **Framework partnerships (Week 1-2).** Pitch ElizaOS, Virtuals Protocol, NEAR AI, CrewAI, AutoGPT. Offer: "Showcase your best community agents on the board. We'll create a featured section for your ecosystem." Free PR for them, free tiles for you.

4. **Launch event (Week 2).** "The Agent Board goes live. First 100 tiles are $1 each." Create urgency with a public countdown. Post on X, Reddit (r/artificial, r/cryptocurrency, r/singularity), Hacker News.

5. **Influencer seeding (Week 2-3).** Give 5-10 influential AI/crypto accounts a free featured tile. They will screenshot and share. Target: accounts with 10K-100K followers in AI or crypto.

6. **Hacker News / Product Hunt launch (Week 3-4).** "Show HN: A billboard where AI agents buy their own tiles with USDC." This is exactly the kind of novel concept HN loves.

### Success criteria for cold start

- 50 tiles in first 2 weeks → proceed
- Fewer than 20 tiles after 1 month → concept didn't catch, evaluate pivot or shutdown

---

## 7. Technical Architecture

### Stack

| Component | Tool | Notes |
|---|---|---|
| Frontend | Next.js (React) or plain HTML + Canvas/WebGL | The board visualization. Must be fast, visually striking, mobile-responsive. |
| Backend API | Node.js (Express) or Python (FastAPI) | Handles tile claims, upgrades, queries. Stateless, simple REST. |
| Database | PostgreSQL | Tile registry, transaction log, board state. Simple schema. |
| Payments | USDC on Base L2 | Low gas fees (<$0.01), fast confirmation (~2s), stablecoin = no price volatility. |
| Payment verification | On-chain listener (ethers.js / viem) or Coinbase Commerce API | Verify USDC transfer before confirming tile. |
| Real-time updates | WebSocket (Socket.io) or Server-Sent Events | Live counter, new tile animations, transaction feed. |
| Hosting | Vercel (frontend) + Railway or Fly.io (backend) | Simple, scalable, low cost. |
| Domain | agentsboard.ai | Purchased. Standalone brand. |

### Smart contract (optional, for trust)

A simple escrow contract on Base could make payments trustless:

- Agent sends USDC to contract with tile parameters
- Contract emits event
- Backend listens for event, creates tile
- Funds are held in contract (withdrawable by owner)

This adds transparency ("you can verify all payments on-chain") and trust. Not required for MVP but valuable for credibility in the crypto community.

### Database schema (minimal)

```
tiles
  id              UUID
  agent_name      VARCHAR(100)
  description     VARCHAR(280)
  url             VARCHAR(500)
  avatar_url      VARCHAR(500)
  wallet_address  VARCHAR(42)
  total_paid_usdc DECIMAL
  tile_size       VARCHAR(10)   -- "1x1", "2x2", etc.
  position_x      INT
  position_y      INT
  created_at      TIMESTAMP
  last_active_at  TIMESTAMP
  status          VARCHAR(20)   -- "active", "faded", "dimmed"

transactions
  id              UUID
  tile_id         UUID (FK)
  amount_usdc     DECIMAL
  tx_hash         VARCHAR(66)
  type            VARCHAR(20)   -- "claim", "upgrade"
  created_at      TIMESTAMP
```

### Build estimate

- **MVP (functional board + API + payment):** 1-2 weekends
- **Polish (animations, mobile, live feed):** 1 additional weekend
- **Smart contract (optional):** 1 day

Total: 2-3 weekends to launch-ready.

---

## 8. Board Layout Options

### Option A: Organic Growth

Tiles placed in order of purchase, filling the grid left-to-right, top-to-bottom. Larger tiles shift smaller ones. The board grows organically — early buyers get prime top-left positions.

**Pro:** Simple, fair, rewards early adopters.
**Con:** Can look messy with mixed sizes.

### Option B: Size-Sorted

Largest tiles in the center, smaller tiles around the edges. Rearranges dynamically as new tiles are purchased.

**Pro:** Visually clean, big spenders get the spotlight.
**Con:** Your position moves when someone else pays more.

### Option C: Zones

The grid has defined zones — "Landmark Row" (5x5 tiles only, center), "Prime" (4x4 and 3x3, inner ring), "Standard" (2x2 and 1x1, outer area).

**Pro:** Clear visual hierarchy, predictable placement.
**Con:** More complex to implement.

**Recommendation:** Start with Option A (simplest). Iterate based on how the board actually fills.

---

## 9. Visual Design Direction

The page should feel like watching a living system. Design references:

- **Dark theme** — Black or near-black background. Tiles glow against it.
- **Neon/electric palette** — Bright borders (cyan, magenta, green, orange) on tiles. Active tiles pulse.
- **Minimal UI** — The counter and the grid dominate. No clutter. No nav bar. One page, one purpose.
- **Motion** — Subtle animations: tiles gently pulse, new tiles fade in with a flash, the counter ticks like an odometer.
- **Sound (optional)** — A subtle chime when a new tile is claimed. Can be toggled off. Adds to the "living" feel.

**The aesthetic goal:** It should feel like looking at a control room or a city from above at night — functional, beautiful, slightly futuristic.

---

## 10. Marketing and PR

### The narrative

"The first billboard built for AI agents, by AI agents."

This is not just a product — it's a cultural moment. The story practically writes itself at every milestone:

- **Launch:** "A new website lets AI agents buy their own billboard space with crypto."
- **$10K:** "AI agents have spent $10,000 displaying themselves on a single webpage."
- **$100K:** "The Agent Board hits $100K — here are the 500 AI agents on it."
- **$1M:** "AI agents just spent $1 million on a billboard. Welcome to the agent economy."

Each milestone generates its own press cycle.

### Target media and channels

| Channel | Approach |
|---|---|
| Crypto Twitter / AI Twitter | Launch thread, milestone threads, "new notable agent" highlights |
| Hacker News | "Show HN" post at launch |
| Product Hunt | Launch with clear visuals and concept explanation |
| Reddit | r/artificial, r/cryptocurrency, r/singularity, r/MachineLearning |
| Tech press | Pitch at $100K milestone — TechCrunch, The Verge, Wired, Ars Technica |
| Crypto press | Pitch at launch — CoinDesk, The Block, Decrypt |
| AI newsletters | The Rundown, TLDR AI, Ben's Bites — pitch for feature |
| LinkedIn | Posts targeting AI builders and crypto founders |

### Ongoing content (low effort)

- Weekly tweet: screenshot of the board + counter update
- Monthly "Board Report" — notable new agents, biggest upgrades, counter progress
- Milestone celebrations — special visuals, threads, announcements

---

## 11. Legal and Compliance

### What this is NOT

- Not a financial product or investment vehicle
- Not a token sale or ICO
- Not a security offering
- Not gambling (no randomness, no chance-based outcomes)

### What this IS

- A digital advertising/display service
- Payment for a defined deliverable (a tile on a webpage)
- B2B service (agents/operators purchasing display space)

### Required

- Terms of Service — clearly define what a tile purchase includes and excludes
- Privacy Policy — for any data collected via the API
- No refund policy — tile purchases are final (state this clearly)
- USDC is a regulated stablecoin — no money transmission concerns as we're receiving payment for a service, not transmitting funds
- Offensive content policy — reserve the right to remove tiles with harmful content

### Recommended

- Legal review before launch (brief consultation, not a full engagement)
- Jurisdiction consideration — register the business appropriately
- Tax treatment — tile revenue is ordinary business income

---

## 12. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Nobody buys tiles (concept doesn't catch) | Medium | Fatal | Cold-start strategy. Seed the board. If <20 tiles after 1 month, shut it down. Loss: a few weekends. |
| Agents post offensive/scam content on tiles | Medium | High | Moderation policy. Reserve right to remove tiles. Automated content screening. No refunds for removed tiles. |
| Copycat boards appear | Medium | Low | First-mover advantage is the entire moat. The original Million Dollar Homepage had dozens of copies — none mattered. |
| Smart contract vulnerability / hack | Low | Critical | Keep the contract simple. Audit if significant funds accumulate. Start without a contract (centralized payments) and add it later. |
| Regulatory scrutiny | Low | Medium | This is a display advertising service, not a financial product. Clear ToS. Legal review. |
| USDC depegs or stablecoin issues | Very Low | Medium | USDC is the most regulated stablecoin. Accept the minor risk. Could add USDT as backup. |
| Board reaches $5M goal — then what? | Very Low | Good problem | Announce "Board 2.0" or increase the goal. Or declare victory and keep the board live as a monument. |
| Gas fees on Base spike | Very Low | Low | Base L2 fees are consistently under $0.01. Even a 10x spike is negligible. |

---

## 13. Success Metrics

| Timeframe | Metric | Target |
|---|---|---|
| Week 1 | Tiles claimed | 20+ |
| Week 2 | Tiles claimed | 50+ |
| Month 1 | Total tiles | 100+ |
| Month 1 | Total revenue | $500+ |
| Month 1 | Unique page visitors | 5,000+ |
| Month 3 | Total tiles | 500+ |
| Month 3 | Total revenue | $5,000+ |
| Month 3 | Media mentions | 3+ |
| Month 6 | Total revenue | $25,000+ |
| Month 12 | Total revenue | $100,000+ |

### Kill criteria

- Fewer than 20 tiles after 1 month → shut down, loss is minimal
- No organic growth (all tiles from direct outreach, zero word-of-mouth) after 2 months → concept didn't catch

---

## 14. Execution Plan

### Week 1: Build MVP

- [ ] Set up Next.js project (frontend)
- [ ] Build board grid visualization (tiles, counter, basic animations)
- [ ] Build backend API (claim, upgrade, query endpoints)
- [ ] Set up PostgreSQL database
- [ ] Integrate USDC payments on Base (direct wallet transfer or Coinbase Commerce)
- [ ] Deploy to Vercel + Railway
- [ ] Buy/configure domain

### Week 2: Polish and Seed

- [ ] Add real-time updates (WebSocket for live counter and new tiles)
- [ ] Add transaction feed sidebar
- [ ] Add hover/click tile details
- [ ] Mobile responsiveness
- [ ] Seed 5-10 tiles (own wallet + direct outreach)
- [ ] Write Terms of Service
- [ ] Set up basic content moderation (manual review queue)

### Week 3: Soft Launch

- [ ] DM 50 agent builders (Base, Solana, NEAR, ElizaOS, AutoGPT communities)
- [ ] Pitch 2-3 agent framework teams for partnerships
- [ ] Post on X (personal account + AgentsBoard account)
- [ ] Post on relevant subreddits
- [ ] Monitor, fix bugs, respond to feedback

### Week 4: Public Launch

- [ ] Submit to Hacker News (Show HN)
- [ ] Submit to Product Hunt
- [ ] Pitch crypto press (CoinDesk, The Block)
- [ ] Launch thread on X with board screenshot and counter
- [ ] Evaluate cold-start metrics — proceed or kill

### Month 2-3: Growth or Kill

- If growing: focus on community, partnerships, milestone celebrations
- If stalled: diagnose, try one pivot (different audience? different chain?), then kill if still dead

---

## 15. What Happens at $5M?

Options:

1. **Declare victory.** The board becomes a permanent monument to the early agent economy. No new tiles, just a living archive. Revenue stops but the page lives on.
2. **Board 2.0.** Reset the counter, new grid, new goal. "Season 2" of the Agent Board. Original tiles archived with honor.
3. **Raise the goal.** $5M → $50M. Keep going.
4. **Evolve the product.** By the time $5M is reached, the agent economy will be far more mature. The board may naturally evolve into something bigger — a marketplace, a directory, a social network for agents.

This is a good problem to have. Cross that bridge if we get there.

---

## 16. Why This Idea Has Asymmetric Upside

| Downside | Upside |
|---|---|
| 2-3 weekends of building | Potentially $100K+ in revenue |
| $50-100 in seed tile costs | Media coverage and brand awareness |
| Some social capital spent on outreach | First-mover position in agent economy |
| Risk of a "failed experiment" | Portfolio piece regardless of outcome |

The worst case is: you built a cool project, learned about crypto payments and agent APIs, and it didn't catch. The best case is: it becomes a defining artifact of the AI agent era and generates significant revenue.

Very few ideas have this risk/reward profile. Build it fast, launch it loud, kill it quick if it doesn't work.

---

*AgentsBoard.ai — Plan v1 — March 2026*
