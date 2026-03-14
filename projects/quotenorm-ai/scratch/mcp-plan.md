# Plan: QuoteNorm MCP Server + npm Distribution

## Context

QuoteNorm API is live at `api.quotenorm.ai` with x402 payment (USDC on Base L2). The primary distribution channel for agents is MCP — agents discover QuoteNorm via MCP registries and call it as a tool. The MCP server needs to be published to npm and registered in MCP directories.

## Architecture

**Thin client MCP server** — runs locally via stdio, calls the hosted API, handles x402 payment internally.

```
Agent (Claude/Cursor) → MCP stdio → @quotenorm/mcp-server (local)
                                          ↓
                                    POST api.quotenorm.ai/v1/normalize
                                          ↓ (402)
                                    Sign EIP-3009 with agent's wallet
                                          ↓
                                    Retry with payment-signature header
                                          ↓
                                    Return structured JSON to agent
```

The agent configures their wallet private key in the MCP server config. The MCP server handles the full x402 flow transparently.

## Why Thin Client

- Keeps extraction logic centralized on the server (one place to update prompts, schema, models)
- Preserves the x402 payment model — every call pays via USDC
- MCP server is tiny (~100 lines) — easy to maintain and publish
- Alternative (thick client calling Claude directly) would bypass x402 and require agents to have their own Anthropic API key

## Files to Create

All new files in the existing `quotenorm-ai` code repo under `mcp/`:

```
quotenorm-ai/
├── src/              # Existing API server
├── site/             # Existing landing page
└── mcp/              # NEW — MCP server package
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    └── src/
        └── index.ts  # MCP server entry point
```

### `mcp/package.json`
- Name: `@quotenorm/mcp-server`
- Dependencies: `@modelcontextprotocol/sdk`, `zod`, `viem` (for EIP-3009 signing with private key)
- Bin: `quotenorm-mcp` → `./build/index.js`
- Scripts: build (tsc), prepublishOnly (build)
- Field: `mcpName: "io.github.azbarroso/quotenorm"` (for registry)

### `mcp/src/index.ts`
- Single tool: `normalize_quote`
  - Input: `{ url: string }` (pricing page URL)
  - Optional input: `{ url: string, sandbox: boolean }` (sandbox mode, no wallet needed)
- x402 payment flow:
  1. POST to API → get 402
  2. Parse `payment-required` header
  3. Sign EIP-3009 TransferWithAuthorization using viem's `signTypedData` with private key account
  4. Retry with `payment-signature` header
  5. Return result as text content
- Wallet config via env var: `QUOTENORM_WALLET_PRIVATE_KEY`
- Falls back to sandbox if no wallet configured (with warning)

### `mcp/README.md`
- What QuoteNorm does (one paragraph)
- Installation: `npm install -g @quotenorm/mcp-server`
- Claude Desktop config example
- Cursor config example
- Env var docs (wallet private key)
- Sandbox mode docs (no wallet needed)

## Tool Definition

```typescript
server.registerTool("normalize_quote", {
  description: "Extract structured pricing data from a vendor pricing page. Returns normalized JSON with plans, pricing, features, terms, confidence scores, and missing-field alerts. Costs $0.10 USDC per call (paid via x402 on Base L2). Use sandbox mode for free truncated output.",
  inputSchema: {
    url: z.string().url().describe("URL of the pricing page to normalize"),
    sandbox: z.boolean().optional().describe("Use free sandbox mode (truncated output, no payment required)")
  }
}, handler);
```

## x402 Payment in MCP Server

Unlike the browser (which uses MetaMask), the MCP server uses a private key directly with viem:

```typescript
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(privateKey);
// signTypedData for EIP-3009 TransferWithAuthorization
// Same payload structure as the browser implementation:
// { x402Version: 2, accepted: <requirements>, payload: { authorization, signature } }
```

This is the standard approach for server-side/agent x402 clients. The EIP-712 typed data structure is identical to what the browser site uses.

## Distribution Channels

### 1. npm
- `npm publish --access public` from `mcp/` directory
- Package name: `@quotenorm/mcp-server`
- Users install via `npx -y @quotenorm/mcp-server` (no global install needed)

### 2. MCP Registry (official)
- Install `mcp-publisher` CLI
- Run `mcp-publisher login github` + `mcp-publisher publish`
- Verify at registry.modelcontextprotocol.io
- This is how Claude Desktop and other MCP clients discover tools

### 3. Claude Desktop / Cursor configuration
Users add to their config (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "quotenorm": {
      "command": "npx",
      "args": ["-y", "@quotenorm/mcp-server"],
      "env": {
        "QUOTENORM_WALLET_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

### 4. Community directories
- **Cursor Directory** — cursor.directory/mcp (1800+ servers, community submissions)
- **MCP.so** — 18,000+ servers, broad discovery
- **Anthropic MCP Directory** — Google Form submission (https://forms.gle/tyiAZvch1kDADKoP9)
- **PulseMCP** — community registry

### 5. x402 Bazaar catalog
- List QuoteNorm API endpoint in the x402 Bazaar discovery catalog
- Agents browsing Bazaar can discover and call it directly (without MCP)

## Implementation Order

1. Scaffold `mcp/` with package.json, tsconfig.json
2. Implement `mcp/src/index.ts` — tool registration + x402 payment flow
3. Test locally with Claude Desktop (sandbox mode first, then paid)
4. Write README.md with setup instructions
5. Publish to npm (`@quotenorm/mcp-server`)
6. Register in MCP registry via `mcp-publisher`
7. Submit to community directories

## Verification

1. `cd mcp && npm run build` — compiles cleanly
2. Add to Claude Desktop config → ask Claude to "normalize the pricing at linear.app/pricing"
3. Verify sandbox mode works without wallet key configured
4. Verify paid mode works with wallet key (signs EIP-3009, pays $0.10 USDC, returns full result)
5. `npx @quotenorm/mcp-server` works after npm publish (no global install needed)

## Open Questions

- **npm org**: Do we need to create the `@quotenorm` npm org first? Alternative: publish as `quotenorm-mcp-server` (no org needed).
- **Wallet UX**: Requiring a private key in env vars is standard for agents but could be a friction point. Document clearly how to create a dedicated wallet for this purpose.
- **Rate limiting**: Should the MCP server have any client-side rate limiting, or rely entirely on the API's rate limiting?
- **Error messages**: When x402 payment fails (insufficient USDC, wrong network), surface clear actionable errors to the agent.
