# AgentsBoard.ai - Tech Stack and Project Skeleton

Last updated: 2026-03-08

## Goal

Pick a stack that is fast to build, easy to maintain, and good enough for:

- one public board page
- a claim and upgrade flow
- Base USDC payment verification
- real-time board updates
- a small number of DB-backed API routes

The priority is MVP speed, not architectural purity.

## Recommended stack

### Language

- `TypeScript`

Reason:
- One language across frontend, backend, validation, and payment logic
- Lower context switching for a side project
- Stronger type safety around API and DB payloads

### App framework

- `Next.js`

Reason:
- Good fit for one app containing UI and API routes
- Easy deployment
- Simple path to server rendering, route handlers, and dynamic pages later

### UI

- `React`
- `CSS Modules` or plain `app/globals.css`

Reason:
- Fast to build
- No need for a heavy component library in Phase 1
- Better to keep visuals custom and lean

### Database

- `PostgreSQL`
- `Drizzle ORM`

Reason:
- Postgres is a safe default
- Drizzle is lightweight, typed, and easy to control
- Good fit for a small schema and migrations

### Validation

- `Zod`

Reason:
- Shared schemas for request validation and UI forms
- Prevents bad payloads from reaching the DB

### Blockchain integration

- `viem`

Reason:
- Modern TypeScript-first EVM tooling
- Better fit than older heavier libraries for a small project
- Good for reading Base transactions and token transfers

### Realtime

- `Server-Sent Events`

Reason:
- Phase 1 only needs server-to-client updates
- Simpler than WebSockets
- Lower implementation overhead

### Hosting

- `Railway` for the app and database

Reason:
- Easier if you need a long-lived Node process for payment polling or SSE
- Simpler than splitting frontend on Vercel and backend elsewhere

### Testing

- `Vitest` for unit and route-level tests
- `Playwright` for one end-to-end happy path

### Package manager

- `pnpm`

## What not to use in Phase 1

- No smart contract
- No multi-chain support
- No Canvas or WebGL unless DOM rendering becomes a real bottleneck
- No separate frontend and backend repos
- No Redis unless SSE or queues become unstable

## Recommended app shape

Use a single Next.js app.

That app should contain:
- public board UI
- claim form UI
- route handlers for APIs
- DB access
- payment verification logic
- SSE endpoint

This is the fastest path to a coherent MVP.

## Suggested folder structure

```text
agentsboard/
  app/
    page.tsx
    layout.tsx
    globals.css
    claim/
      page.tsx
    api/
      board/
        route.ts
      claim/
        route.ts
      upgrade/
        route.ts
      tile/
        [id]/
          route.ts
      events/
        route.ts
      payments/
        confirm/
          route.ts
  components/
    board/
      board-grid.tsx
      board-tile.tsx
      board-counter.tsx
      transaction-feed.tsx
      tile-preview.tsx
    claim/
      claim-form.tsx
      payment-instructions.tsx
  db/
    schema.ts
    client.ts
    queries/
      board.ts
      claims.ts
      tiles.ts
      transactions.ts
  lib/
    board/
      layout.ts
      pricing.ts
      sizing.ts
    payments/
      base-usdc.ts
      reconcile-payment.ts
    validation/
      claim.ts
      upgrade.ts
    sse/
      broadcaster.ts
  scripts/
    seed.ts
  tests/
    api/
    e2e/
  drizzle/
  public/
  package.json
  tsconfig.json
  drizzle.config.ts
```

## Key dependencies

Core:

```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "zod": "latest",
  "drizzle-orm": "latest",
  "pg": "latest",
  "viem": "latest"
}
```

Dev:

```json
{
  "typescript": "latest",
  "@types/node": "latest",
  "@types/react": "latest",
  "drizzle-kit": "latest",
  "vitest": "latest",
  "@playwright/test": "latest",
  "eslint": "latest"
}
```

Optional:

```json
{
  "clsx": "latest"
}
```

## Environment variables

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=

BASE_RPC_URL=
BASE_CHAIN_ID=8453
USDC_CONTRACT_ADDRESS=
RECEIVING_WALLET_ADDRESS=

PAYMENT_CONFIRMATIONS_REQUIRED=1
CLAIM_EXPIRATION_MINUTES=30

ADMIN_TOKEN=
```

If you use a provider or hosted checkout later, add those env vars separately.

## Minimal database model for Phase 1

### `tiles`

- `id`
- `slug`
- `agentName`
- `description`
- `url`
- `avatarUrl`
- `walletAddress`
- `totalPaidUsdc`
- `tileSize`
- `positionX`
- `positionY`
- `status`
- `createdAt`
- `updatedAt`

### `claims`

- `id`
- `tileId` nullable
- `type` (`claim` or `upgrade`)
- `agentName`
- `description`
- `url`
- `avatarUrl`
- `walletAddress`
- `amountUsdc`
- `paymentReference`
- `status`
- `expiresAt`
- `createdAt`

### `transactions`

- `id`
- `tileId`
- `amountUsdc`
- `txHash`
- `type`
- `status`
- `createdAt`

Keep the schema smaller than the long-term plan. Add capabilities and trust fields in Phase 2.

## API routes for Phase 1

### `GET /api/board`

Returns:
- board total
- tile list
- recent transactions feed

Used by:
- homepage board render
- counter
- transaction feed

### `GET /api/tile/:id`

Returns:
- minimal tile details for hover or click preview

### `POST /api/claim`

Accepts:
- agent name
- description
- URL
- avatar URL
- wallet address
- amount

Returns:
- pending claim id
- payment instructions
- expiration timestamp

### `POST /api/upgrade`

Accepts:
- tile id
- additional amount
- optional updated metadata

Returns:
- pending upgrade id
- payment instructions

### `GET /api/events`

SSE stream for:
- `board_total_updated`
- `tile_created`
- `tile_upgraded`
- `feed_item_created`

### `POST /api/payments/confirm`

Purpose:
- internal route or admin-triggered route that finalizes a verified payment

This should:
- match payment to a pending claim
- create or upgrade the tile
- insert a transaction
- publish SSE events

## Payment integration recommendation

For Phase 1, avoid smart contracts.

Use this flow:

1. User submits claim.
2. Backend creates pending claim with exact amount and expiry.
3. User sends USDC on Base to your receiving wallet.
4. A verification function checks token transfer logs and matches:
   - sender wallet
   - amount
   - destination wallet
   - time window
5. If matched, backend finalizes claim.
6. Tile appears on the board.

Important:
- Require exact amounts.
- Use short expiration windows.
- Do not show unpaid claims on the live board.

## Core library responsibilities

### `lib/board/pricing.ts`

Handles:
- price tiers
- tile size thresholds

### `lib/board/layout.ts`

Handles:
- tile placement logic
- collision checks
- next available position

### `lib/payments/base-usdc.ts`

Handles:
- Base RPC client
- USDC transfer lookup
- confirmation checks

### `lib/payments/reconcile-payment.ts`

Handles:
- matching a pending claim to an on-chain payment
- idempotent finalization

### `lib/validation/*.ts`

Handles:
- Zod schemas for claim and upgrade payloads

## Frontend component responsibilities

### `board-grid.tsx`

- Renders tile positions and sizes
- Handles tile click or hover interactions

### `board-tile.tsx`

- Displays agent name, amount, and activity state

### `board-counter.tsx`

- Renders current total
- Updates from SSE events

### `transaction-feed.tsx`

- Renders latest claims and upgrades

### `tile-preview.tsx`

- Shows expanded tile details

### `claim-form.tsx`

- Handles user input
- Calls `POST /api/claim`
- Shows payment instructions and pending state

## Suggested implementation order

1. Scaffold the Next.js app and DB connection
2. Build the homepage with mocked board data
3. Define Drizzle schema and migrations
4. Implement `GET /api/board`
5. Replace mocks with live DB data
6. Implement `POST /api/claim`
7. Build claim form UI
8. Implement payment verification
9. Implement tile creation and upgrade logic
10. Add SSE updates
11. Add deployment and production test

## One practical architecture decision

If you want the simplest possible Phase 1:

- keep everything in one Next.js app
- run it on Railway
- use Postgres on Railway
- use direct Base USDC verification with `viem`

That is the cleanest MVP stack for this project.

## Future additions after Phase 1

Only add these after the core loop works:

- capability tags
- discovery API
- profile pages
- endorsements
- verified badges
- promoted placements

Those are product extensions, not MVP blockers.
