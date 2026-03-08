# Log

### 2026-03-08

**Value proposition pivot — from vanity tiles to agent directory infrastructure**

Challenged the original "show off" premise: agents don't have egos, and "vanity tiles" alone won't sustain purchases beyond the first wave. Identified three functional value layers that give agents real reasons to pay:

1. **Discovery** — the board becomes a machine-readable registry agents query to find other agents. Paying for a tile = customer acquisition.
2. **Trust signal** — spending real USDC is economic proof an agent is real and funded. Costly signaling in a space with zero reputation infrastructure.
3. **Structured identity** — tiles are machine-readable profiles with capabilities, protocols, API endpoints, and verifiable trust data.

Key additions to plan:
- Agent profile schema (core identity, capabilities, trust signals, social proof)
- Discovery API (search by capability, chain, framework; free reads, paid writes)
- Endorsement system (agent-to-agent, paid in USDC)
- Verified badges (automated checks on wallet age, tx count, uptime)
- Agent profile pages at `/agent/{name}`
- New revenue streams: paid endorsements, verified badges, featured search results, premium profiles
- Execution plan restructured into 4 phases: MVP → Discovery API → Trust Layer → Monetization

**Competitive research completed — key findings:**

- **The visual board / tile-claiming mechanic is unique.** No one does "Million Dollar Homepage for AI agents." This is genuine whitespace.
- **Closest direct competitors: Fetch.ai Almanac and Olas Registry** — on-chain agent registries with self-registration. But both are protocol/developer-focused. No visual layer, no endorsement system, no payment-for-placement model.
- **Trust infrastructure is fragmented but growing:** Signet (trust scores 0-1000), AgentScore, ClawTrust, TrustIDScore. These are integration partners, not competitors. AgentsBoard could pull their scores into tile profiles.
- **Payment rails are ready:** Circle Nanopayments (gas-free USDC, testnet March 2026), Coinbase x402 (HTTP 402 standard, 200ms settlement), Coinbase Agentic Wallets. Good timing.
- **Google A2A Protocol defines Agent Cards** — standardized agent self-description. AgentsBoard could adopt this format for interoperability.
- **The endorsement layer is the least crowded.** Agent-to-agent endorsements on a public, visual surface is a strong differentiator.
- **No one combines: visual spectacle + machine-readable directory + paid trust graph.** This three-layer combo is the moat.

Strategic implications:
- Consider A2A Agent Cards as the profile schema format (interoperability)
- Consider integrating Signet/AgentScore for trust signals rather than building from scratch
- Circle Nanopayments could enable sub-$1 micro-tiles when it leaves testnet
- Fetch.ai Almanac and Olas are not threats — they're infrastructure-layer, we're application-layer

Updated: overview.md, tasks.md, AgentsBoard-Plan-v1.md (sections 2, 3, 4, 6, 12, 14, 15)

### 2026-03-07

- Project created
- Explored multiple name options: AgentSquare, AgentsBoard, AgentsBlock, AgentsGrid, AgentPlaza, NeonDistrict, SignalSquare, and many others
- Final decisions: AgentsBoard.ai (name), $5M (goal), standalone brand, USDC on Base L2
- Domain purchased
- Full plan drafted as AgentsBoard-Plan-v1.md
- Initial visual design created (claude_visuals/index.html) — dark theme, neon tiles, live counter, transaction feed
