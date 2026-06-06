# Circle Developer Grant — Video Shot List

ACOA / VibeCard Circle integration walkthrough (script segment 0:25–1:20).
Every beat is mapped to the exact file and line range to open on screen.

**Verified facts (real, present in this codebase):**
- Network: Arc Testnet — Chain ID `5042002`
- USDC contract: `0x3600000000000000000000000000000000000000` (USDC is native gas on Arc)
- No custom smart contracts deployed — the only contract touched is the existing USDC token

---

## Quick-access links — open these tabs first

GitHub permalinks (branch `main`) jump straight to the exact lines. Open them in order before you hit record.

Numbered to match the **Suggested scroll order** below — one entry per take step.

1. [Provision wallets — `circle-wallets.ts` L313–342](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L313-L342)
2. [balanceOf over RPC — `circle-wallets.ts` L57–89](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L57-L89) · [USDC contract addr — L499](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L499)
3. [Sequential split loop — `x402-gateway.ts` L150–206](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L150-L206) · [Split ratios — L208–262](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L208-L262)
4. [ERC-20 `transfer` (only contract touched) — `circle-wallets.ts` L567–573](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L567-L573)
5. [Arc chain ID + RPC — `x402-gateway.ts` L4–5](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L4-L5) · [eip155:5042002 in x402 response — L44–66](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L44-L66) · [GATEWAY_CONFIG — L264–268](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L264-L268)
6. [Judge panel render — `DemoPlaygroundScreen.tsx` L533–565](https://github.com/pbudlong/vibecardnet/blob/main/client/src/components/screens/DemoPlaygroundScreen.tsx#L533-L565) · live view: `https://VibeCardNet.replit.app/demo`

> **Note:** these anchors point to the latest commit pushed to GitHub. If you record from the live Replit editor instead, the same line numbers apply locally — just use the file paths.

---

## Shot 1 — Intro pan: "Here's where we touch Circle technologies"

> **Narration:** "First, our hackathon build, running on Arc Testnet today. Here's where we touch Circle technologies."

Open these two files in tabs ahead of time:
- `server/lib/circle-wallets.ts` — Circle SDK + Arc RPC code
- `server/lib/x402-gateway.ts` — split orchestration

---

## Shot 2 — USDC + Wallets: "wallets are Circle non-custodial"

> **Narration:** "USDC is our settlement currency; wallets are Circle non-custodial."

**File: `server/lib/circle-wallets.ts`**

| What to show | Lines | Narration anchor |
|---|---|---|
| `client.createWalletSet({ name: 'VibeCard Arc Wallets' })` | **313–315** | "We provision a Circle wallet set…" |
| `walletConfigs` (Treasury + Matt/Pete/Manny) + `client.createWallets({ blockchains: ['ARC-TESTNET'], … })` | **325–342** | "…and mint non-custodial wallets via the Programmable Wallets SDK." |

Line 337 is the actual SDK provisioning call. Wallet names map directly to the four addresses in the judge panel.

---

## Shot 3 — USDC balance read (balanceOf over RPC): "USDC is our settlement currency"

> **Narration:** "We read balances straight off Arc over RPC — a standard ERC-20 balanceOf call against the USDC contract."

**File: `server/lib/circle-wallets.ts`**

| What to show | Lines |
|---|---|
| `getArcUsdcBalance()` — ERC-20 `balanceOf` selector `0x70a08231`, `eth_call` to Arc RPC | **57–89** |
| RPC endpoint `ARC_TESTNET_RPC = 'https://arc-testnet.drpc.org'` | **4** |
| USDC contract `'ARC-TESTNET': '0x3600…0000'` (matches judge panel) | **499** |

Line 61 builds the `balanceOf(address)` call data; line 71 points `to` at the USDC contract.
Beat: "We read balances straight off Arc over RPC."

---

## Shot 4 — Gateway / x402 split: the honesty point

> **Narration:** "This is our multi-party reward split. Important and honest point: there's no on-chain splitter contract — we deploy no custom contracts. The split is application-level orchestration, firing sequential USDC transfers from the treasury wallet through Circle's SDK. The only contract we touch is the existing USDC token on Arc."

**File: `server/lib/x402-gateway.ts`**

| What to show | Lines | Narration anchor |
|---|---|---|
| `executeX402Payment()` — `for…of` loop firing **sequential** `transferUSDC(…, 'ARC-TESTNET')` with a delay between each | **150–206** (loop 163–196) | "No on-chain splitter contract — application-level orchestration, sequential USDC transfers from treasury through Circle's SDK." |
| `createViralRewardSplits()` — 40/35/20 ratios computed in plain TypeScript | **208–262** | "The split math is just app logic, not a contract." |

**Proof the only contract you touch is USDC** — in `server/lib/circle-wallets.ts`:
- `transferUSDC()` → `client.createContractExecutionTransaction({ … abiFunctionSignature: 'transfer(address,uint256)' })` — **567–573**

A standard ERC-20 `transfer`, nothing custom.

---

## Shot 5 — Arc network config (Chain 5042002 / eip155:5042002)

> **Narration:** "And here's our Arc network config — Chain 5042002, the eip155 identifier baked into every x402 payment request."

**File: `server/lib/x402-gateway.ts`**

| What to show | Lines |
|---|---|
| `const ARC_TESTNET_CHAIN_ID = 5042002` + RPC | **4–5** |
| x402 `accepts` block: `network: 'eip155:5042002'`, `asset: 'eip155:5042002/erc20:usdc'` | **44, 59, 66** |
| `GATEWAY_CONFIG` (chainId, rpcUrl, arcscan explorer) | **264–268** |

The `eip155:5042002` strings (lines 59 & 66) are the textbook visual for "Arc Testnet, Chain 5042002."

---

## Shot 6 (optional) — the live "For Judges" panel

> **Narration:** "And here it is running on Arc today — real Circle wallets, real USDC balances, live on-chain."

Already in the running app:
- **Code:** `client/src/components/screens/DemoPlaygroundScreen.tsx` — diagnostics query at **line 174** (`/api/circle/diagnostics`), panel render at **533–565**
- **Live view:** `https://VibeCardNet.replit.app/demo` — shows the wallet set, four Arc wallets with real balances, and explorer links

Cut from the code shots to this live panel (Treasury $35.86, users $0.15) as the "running on Arc today" closer.

---

## Suggested scroll order (one continuous take)

1. `circle-wallets.ts` L313–342 — provision wallets
2. same file L57–89 — balanceOf RPC → flash L499 (USDC contract)
3. `x402-gateway.ts` L150–206 — sequential split → L208–262 (ratios)
4. back to `circle-wallets.ts` L567–573 — the ERC-20 `transfer` (only contract)
5. `x402-gateway.ts` L4–5 + L44/59/66 + L264–268 — Arc config
6. cut to live `/demo` judge panel

---

## Circle integration details (for judges)

- **API Key:** `TEST_API_KEY…` (configured)
- **Entity Secret:** configured
- **Entity ID / App:** `92264e56-2c0b-529d-9723-4945e2fba3da`
- **Network:** Arc Testnet (Chain `5042002`)
- **USDC Contract:** `0x3600000000000000000000000000000000000000`

**Arc Testnet wallets:**

| Wallet | Address | Balance |
|---|---|---|
| Matt | `0xa1d984687270ad3b1502cb45c5faa8fcf6097b14` | $0.15 |
| Pete | `0xc2618c9407d869f77cc3331a73911fb85ec6619f` | $0.15 |
| Manny | `0x2a4bd48088e09c5b2ba0b31c71244f54e10c1864` | $0.15 |
| Treasury | `0xb5277158cc64d6ac19e4704c2729e157c2ee12b4` | $35.86 |
