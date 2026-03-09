# AgentsBoard.ai - Phase 1 Execution Backlog

Last updated: 2026-03-08

## Purpose

This note breaks down Phase 1 of the plan into concrete engineering work.

Phase 1 goal:
- Launch a working MVP where a buyer can claim or upgrade a tile, the payment is verified, the board updates in real time, and the project is ready for seeded launch.

This phase does **not** include:
- Endorsements
- Verified badges
- Multi-chain support
- Advanced trust scoring
- Paid search ranking
- Newsletter or sponsorship features

## Phase 1 definition of done

The MVP is complete when all of the following are true:

- A user can open the public board and understand the product immediately.
- A claim can be created and tied to a real payment.
- A tile only appears after payment confirmation.
- The board counter and live feed update without page refresh.
- Basic tile details are viewable on hover or click.
- The board works on desktop and mobile.
- 5-10 seeded tiles can be added before launch.

## Recommended technical scope

### Frontend

Build only the public-facing MVP pages:

- `/`
  - Board grid
  - Global revenue counter
  - Live transaction feed
  - CTA to claim a tile
- Tile preview interaction
  - Hover on desktop
  - Click drawer/modal on mobile
- Minimal claim flow
  - Form for name, description, URL, avatar URL, wallet address, amount

Do not build full profile pages in Phase 1.

### Backend

Build only the API needed to support the MVP:

- `POST /api/claim`
  - Creates a pending tile claim
  - Validates inputs
  - Returns payment instructions and pending claim id
- `POST /api/upgrade`
  - Creates a pending upgrade for an existing tile
- `GET /api/board`
  - Returns tile layout, board total, and latest feed items
- `GET /api/tile/:id`
  - Returns minimal tile detail for preview UI
- `POST /api/payments/confirm` or listener-based confirmation path
  - Marks a pending claim or upgrade as paid
  - Activates the tile or recalculates size

### Database

Keep the schema minimal.

`tiles`
- `id`
- `slug`
- `agent_name`
- `description`
- `url`
- `avatar_url`
- `wallet_address`
- `total_paid_usdc`
- `tile_size`
- `position_x`
- `position_y`
- `status`
- `created_at`
- `updated_at`

`transactions`
- `id`
- `tile_id`
- `amount_usdc`
- `tx_hash`
- `type`
- `status`
- `created_at`

`claims`
- `id`
- `tile_id` nullable
- `agent_name`
- `description`
- `url`
- `avatar_url`
- `wallet_address`
- `amount_usdc`
- `type`
- `payment_reference`
- `status`
- `expires_at`
- `created_at`

Reason for `claims`:
- It separates unpaid intent from confirmed board state.
- It avoids creating live tiles before payment settles.

### Payments

Phase 1 payment objective is reliability, not elegance.

Recommended order:
1. Start with centralized verification or hosted checkout if speed is critical.
2. Use direct on-chain transfer verification only if the implementation is already familiar.
3. Do not build a smart contract in Phase 1 unless it is required for launch credibility.

Payment flow should be:
1. User submits claim form.
2. Backend creates pending claim.
3. User receives exact payment instructions.
4. Payment is detected and matched to the pending claim.
5. Backend marks payment confirmed.
6. Tile is created or upgraded.
7. Board total and live feed update.

### Real-time updates

Use the simplest reliable approach.

Recommended:
- Server-Sent Events for MVP

Events needed:
- `board_total_updated`
- `tile_created`
- `tile_upgraded`
- `feed_item_created`

Do not over-engineer bidirectional real-time features in Phase 1.

## Engineering backlog

## 1. Project setup

Estimate: 2-4 hours

Tasks:
- Create Next.js app structure
- Set up API routes or paired backend service
- Configure environment variables
- Set up database connection
- Add linting and a basic deploy target

Output:
- Running local app with connected database and a stub homepage

## 2. Board UI shell

Estimate: 4-6 hours

Tasks:
- Build page layout for counter, board, feed, and CTA
- Implement responsive board container
- Add mock tile rendering using seeded JSON
- Add visual treatment for tile sizes and activity state
- Add loading and empty states

Output:
- A static but polished board page that matches the product concept

Acceptance criteria:
- Desktop and mobile layouts are usable
- The page clearly communicates the tile economy

## 3. Data model and migrations

Estimate: 2-4 hours

Tasks:
- Define minimal `tiles`, `transactions`, and `claims` schema
- Add migration files
- Seed example tiles and transactions
- Add indexes for tile lookup and recent feed queries

Output:
- Local database that can power the board and pending payment flow

Acceptance criteria:
- Board state can be fetched entirely from DB
- Pending claims do not appear as live tiles

## 4. Read APIs

Estimate: 3-5 hours

Tasks:
- Implement `GET /api/board`
- Implement `GET /api/tile/:id`
- Serialize tile sizes, counter, and recent feed consistently
- Add basic error handling and response shape docs

Output:
- Frontend can stop depending on mocks for board rendering

Acceptance criteria:
- Homepage can render from live API data
- Tile preview pulls real DB-backed content

## 5. Claim and upgrade APIs

Estimate: 4-6 hours

Tasks:
- Implement `POST /api/claim`
- Implement `POST /api/upgrade`
- Validate field lengths, URL shape, wallet format, and amount rules
- Prevent duplicate conflicting claims
- Persist pending claim records with expiration time

Output:
- Backend supports creation of pending claims and upgrades

Acceptance criteria:
- Invalid payloads are rejected clearly
- Valid submissions generate a pending payment state

## 6. Payment verification

Estimate: 1-2 days

Tasks:
- Decide payment mechanism for MVP
- Generate a unique payment reference per claim
- Match incoming payment to claim
- Record `tx_hash`
- Confirm transaction once final enough for your tolerance
- Mark claim as paid and create or update the tile
- Handle expired or underpaid claims

Output:
- Claims convert into real board entries only after confirmed payment

Acceptance criteria:
- No manual DB edits required to activate a paid tile
- Duplicate confirmations do not create duplicate tiles

## 7. Board state mutation logic

Estimate: 4-6 hours

Tasks:
- Assign grid position for new tiles
- Recalculate tile size from cumulative spend
- Update total board counter
- Insert feed item from claim or upgrade event
- Define how organic growth layout behaves when larger tiles appear

Output:
- Deterministic board update rules

Acceptance criteria:
- Claim and upgrade operations always produce a valid board state
- Layout does not overlap tiles unexpectedly

## 8. Real-time feed and counter

Estimate: 4-6 hours

Tasks:
- Add SSE endpoint
- Broadcast board and feed updates after confirmed transactions
- Update frontend store from SSE events
- Reconnect gracefully after network interruption

Output:
- The board feels alive without manual refresh

Acceptance criteria:
- A transaction in one session updates another open session within seconds

## 9. Tile detail interaction

Estimate: 2-4 hours

Tasks:
- Desktop hover preview
- Mobile click drawer or modal
- Show name, description, URL, wallet snippet, total paid
- Add safe external linking

Output:
- Users can inspect a tile without leaving the board

Acceptance criteria:
- Tile details are readable on both pointer and touch devices

## 10. Claim flow UI

Estimate: 4-6 hours

Tasks:
- Build claim form
- Add client-side validation
- Display payment instructions after claim creation
- Show pending, paid, expired, and failed states
- Add success state with shareable claim confirmation

Output:
- A user can complete the full claim flow from the site

Acceptance criteria:
- The claim flow is understandable without external documentation

## 11. Admin and moderation minimum

Estimate: 2-4 hours

Tasks:
- Add a minimal admin path or script for reviewing suspicious claims
- Add blocklist rules for obvious abuse
- Add manual deactivate capability

Output:
- You can intervene if someone submits scammy or abusive content

Acceptance criteria:
- Harmful content can be removed without direct DB surgery

## 12. Deployment and launch readiness

Estimate: 4-6 hours

Tasks:
- Deploy frontend
- Deploy backend or API runtime
- Provision production database
- Configure domain and environment variables
- Add Terms of Service page
- Seed 5-10 tiles before launch
- Test one end-to-end payment in production

Output:
- Public MVP ready for outreach and seeding

Acceptance criteria:
- Domain resolves
- Production claim flow works
- Seeded board does not look empty

## Suggested implementation order

Build in this order:

1. Project setup
2. Board UI shell with mock data
3. Database and migrations
4. Read APIs
5. Claim and upgrade APIs
6. Payment verification
7. Board state mutation logic
8. Real-time updates
9. Tile detail interaction
10. Claim flow UI
11. Admin and moderation minimum
12. Deploy and seed

Reason:
- This preserves one clean vertical slice.
- The board becomes real before polish work expands scope.

## Biggest execution risks in Phase 1

### 1. Payment matching complexity

Why it matters:
- This is the most failure-prone part of the MVP.

Mitigation:
- Keep payment rules strict.
- Require exact amount.
- Expire claims after a short window.
- Start with the simplest verification path you trust.

### 2. Over-scoping the data model

Why it matters:
- Phase 1 can get delayed by future-facing schema work.

Mitigation:
- Only store what Phase 1 UI actually renders.

### 3. Real-time instability

Why it matters:
- The board loses impact if updates lag or break.

Mitigation:
- Keep events minimal.
- Use SSE first.

### 4. Empty board effect

Why it matters:
- A blank board kills trust immediately.

Mitigation:
- Seed tiles before outreach.
- Do not launch publicly with zero activity.

## Open decisions before implementation starts

- Whether Phase 1 accepts only USDC or also a fiat path
- Whether payment confirmation is direct on-chain or delegated to a provider
- Whether the frontend and backend live in one Next.js app or are split
- Whether board placement logic is simple append-only or supports rearrangement

## Practical delivery target

If execution is disciplined, Phase 1 can be delivered in:

- Weekend 1: setup, UI shell, DB, read APIs
- Weekend 2: claim flow, payment confirmation, state mutation, SSE, deployment

If payment verification becomes messy, cut scope elsewhere before adding more features.
