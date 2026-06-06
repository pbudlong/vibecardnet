# Circle Developer Grant — Video Shot List

## Intro (talking only, no code on screen)

> **Narration:** "First, our hackathon build, running on Arc Testnet today. We touch Circle technologies in two library files — `server/lib/circle-wallets.ts` for wallets and USDC, and `server/lib/x402-gateway.ts` for the payment split."

Talk to camera (or over a title card). The shots below show the actual code snippets from those two files.

---

## Shot 1 — Wallets: "Circle non-custodial developer-controlled wallets"

> **Narration:** "Our wallets are Circle developer-controlled wallets — non-custodial, secured by MPC. We provision a wallet set and mint wallets through the Programmable Wallets SDK."

**File: `server/lib/circle-wallets.ts`**

| What to show | Lines |
|---|---|
| `client.createWalletSet({ name: 'VibeCard Arc Wallets' })` | **313–315** |
| `walletConfigs` (Treasury + Matt/Pete/Manny) + `client.createWallets({ blockchains: ['ARC-TESTNET'], … })` | **325–342** |

Line 337 is the actual SDK provisioning call. Wallet names map directly to the four addresses in the judge panel.

---

## Shot 2 — USDC balance read (balanceOf over RPC): "USDC is our settlement currency"

> **Narration:** "USDC is our settlement currency. We read balances straight off Arc over RPC — a standard ERC-20 balanceOf call against the USDC contract."

**File: `server/lib/circle-wallets.ts`**

| What to show | Lines |
|---|---|
| `getArcUsdcBalance()` — ERC-20 `balanceOf` selector `0x70a08231`, `eth_call` to Arc RPC | **57–89** |

Line 61 builds the `balanceOf(address)` call data; line 71 points `to` at the USDC contract.

---

## Shot 3 — Gateway / x402 split: the honesty point

> **Narration:** "This is our x402 gateway driving the multi-party reward split — by design, app-level orchestration firing sequential USDC transfers from the treasury through Circle's SDK. The only contract we touch is the USDC token on Arc."

**File: `server/lib/x402-gateway.ts`**

| What to show | Lines |
|---|---|
| `executeX402Payment()` — `for…of` loop firing **sequential** `transferUSDC(…, 'ARC-TESTNET')` with a delay between each | **150–206** (loop 163–196) |

---

## Shot 4 — Arc network config (Chain 5042002 / eip155:5042002)

> **Narration:** "And here's our Arc network config — Chain 5042002, the eip155 identifier baked into every x402 payment request."

**File: `server/lib/x402-gateway.ts`**

| What to show | Lines |
|---|---|
| x402 `accepts` block: `network: 'eip155:5042002'`, `asset: 'eip155:5042002/erc20:usdc'` | **44, 59, 66** |

The `eip155:5042002` strings (lines 59 & 66) are the textbook visual for "Arc Testnet, Chain 5042002."

---

## Shot 5 — the live "For Judges" panel

> **Narration:** "And here it is running on Arc today — real Circle wallets, real USDC balances, live on-chain."

---

## Suggested scroll order (one continuous take)

1. `circle-wallets.ts` L313–342 — provision wallets
2. same file L57–89 — balanceOf RPC → flash L499 (USDC contract)
3. `x402-gateway.ts` L150–206 — sequential split → L208–262 (ratios)
4. back to `circle-wallets.ts` L567–573 — the ERC-20 `transfer` (only contract)
5. `x402-gateway.ts` L4–5 + L44/59/66 + L264–268 — Arc config
6. cut to live `/demo` judge panel

---

## Quick-access links — open these tabs first

GitHub permalinks (branch `main`) jump straight to the exact lines. Open them in order before you hit record.

Numbered to match the **Suggested scroll order** above — one entry per take step.

1. [Provision wallets — `circle-wallets.ts` L313–342](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L313-L342)
2. [balanceOf over RPC — `circle-wallets.ts` L57–89](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L57-L89) · [USDC contract addr — L499](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L499)
3. [Sequential split loop — `x402-gateway.ts` L150–206](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L150-L206) · [Split ratios — L208–262](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L208-L262)
4. [ERC-20 `transfer` (only contract touched) — `circle-wallets.ts` L567–573](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/circle-wallets.ts#L567-L573)
5. [Arc chain ID + RPC — `x402-gateway.ts` L4–5](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L4-L5) · [eip155:5042002 in x402 response — L44–66](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L44-L66) · [GATEWAY_CONFIG — L264–268](https://github.com/pbudlong/vibecardnet/blob/main/server/lib/x402-gateway.ts#L264-L268)
6. [Judge panel render — `DemoPlaygroundScreen.tsx` L533–565](https://github.com/pbudlong/vibecardnet/blob/main/client/src/components/screens/DemoPlaygroundScreen.tsx#L533-L565) · live view: `https://VibeCardNet.replit.app/demo`

> **Note:** these anchors point to the latest commit pushed to GitHub. If you record from the live Replit editor instead, the same line numbers apply locally — just use the file paths.
