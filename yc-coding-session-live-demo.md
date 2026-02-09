# AI Coding Agent Session: Building a Live Blockchain Demo with Real USDC Transfers

**Applicant:** Pete Budlong
**Project:** VibeCard - Viral Growth Network
**Tool:** Replit Agent (Claude)
**Date:** January 2026
**Feature:** Live Demo with Real Arc Blockchain Transactions

---

## Context

VibeCard is a viral rewards platform that pays content participants (creators, sharers, remixers) in USDC for driving engagement. For the "Agentic Commerce On Arc" Hackathon, I needed a live demo that executes **real blockchain transactions** on Arc testnet — not simulations. The demo needed to show a circular treasury flow: fund a treasury wallet with USDC, distribute rewards to participants via sequential multi-party splits, then recover funds back to treasury for the next demo run. Arc Network uses USDC as its native gas token, meaning near-zero transaction costs but requiring careful gas buffer management.

The entire application was 100% vibecoded using Replit Agent. Below is a representative session showing how the core Live Demo feature was built iteratively through AI collaboration.

---

## Session Transcript

### Phase 1: Circle Wallet Infrastructure

**User:** I need to set up Circle developer-controlled wallets on Arc testnet. We need a treasury wallet and three user wallets (Matt, Pete, Manny) for the demo.

**Agent:** I'll set up the Circle Wallets SDK integration. Let me create the wallet management layer.

The agent scaffolded `server/lib/circle-wallets.ts` with:

```typescript
// Initialize the Circle developer-controlled wallets client
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

const ARC_TESTNET_RPC = 'https://arc-testnet.drpc.org';
const ARC_USDC_CONTRACT = '0x3600000000000000000000000000000000000000';

function getCircleClient() {
  if (!circleClient) {
    const apiKey = process.env.CIRCLE_API_KEY;
    const entitySecret = process.env.CIRCLE_ENTITY_SECRET;
    if (!apiKey || !entitySecret) return null;
    circleClient = initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });
  }
  return circleClient;
}
```

It also created wallet creation, balance checking, and USDC transfer functions — all wired to Arc testnet (Chain ID: 5042002).

**Key discovery during this phase:** Arc uses USDC as its native gas token. Every transaction (even failed ones) costs USDC. This meant we needed gas buffers and careful balance management — something we discovered through trial and error during live testing.

---

### Phase 2: The x402 Payment Protocol

**User:** I need multi-party payment splits. When a conversion happens, USDC should be split between creator, remixer, and sharer — distributed sequentially to each wallet.

**Agent:** I'll create a custom x402 gateway implementation that executes sequential ERC-20 transfers with the split ratios built in.

The agent built `server/lib/x402-gateway.ts`:

```typescript
export async function executeX402Payment(request: X402PaymentRequest): Promise<{
  success: boolean;
  transfers: Array<{ to: string; amount: string; status: string; txId?: string }>;
  totalPaid: string;
}> {
  console.log(`[x402] Executing sequential payment: ${request.reason}`);
  const transfers = [];
  let totalPaid = 0;

  for (const split of request.splits) {
    const result = await transferUSDC(
      request.sourceWalletId,
      split.recipient,
      split.amount,
      'ARC-TESTNET'
    );

    transfers.push({
      to: split.recipient,
      amount: split.amount,
      status: result.success ? 'success' : 'failed',
      txId: result.txId
    });

    if (result.success) totalPaid += parseFloat(split.amount);

    // Delay between transfers for blockchain processing
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return { success: true, transfers, totalPaid: totalPaid.toFixed(2) };
}
```

The 2-second delay between transfers was critical — Arc's sub-second finality still needed breathing room for the Circle SDK to process sequential contract executions.

---

### Phase 3: Building the Live Demo UI

**User:** I need a demo page where hackathon judges can click "Run Demo" and see real USDC flow from treasury to user wallets with animated visualizations.

**Agent:** I'll build an interactive demo playground with a terminal-style log viewer, nerve synapse animation for payment flows, and wallet payout cards with live blockchain explorer links.

The agent created `DemoPlaygroundScreen.tsx` — an ~900 line component that orchestrates the entire demo experience:

1. **Integration status panel** — Checks Circle Wallets, x402 Gateway, and Arc Network connectivity on load
2. **Terminal log viewer** — Real-time scrolling log output styled like a terminal, showing SDK calls, pixel fires, and transaction confirmations
3. **Nerve synapse animation** — SVG paths with animated circles showing USDC flowing from the x402 hub to each participant wallet
4. **Wallet payout cards** — Three cards (Creator/Matt, Remixer/Pete, Sharer/Manny) that light up as payments arrive

Key frontend pattern — the animation timing is synchronized with real blockchain confirmation:

```typescript
// Animation: dur=1s, begin=i*1.1s, so ends at 1s, 2.1s, 3.2s
// Creator (i=0): animation ends at 1000ms
setTimeout(() => {
  setWalletPayouts(prev => [
    { label: "Creator", amount: `$${parseFloat(t.amount).toFixed(2)}`, ... },
    prev[1], prev[2]
  ]);
}, 1000);
// Remixer (i=1): animation ends at 2100ms
setTimeout(() => { ... }, 2100);
// Sharer (i=2): animation ends at 3200ms
setTimeout(() => { ... }, 3200);
```

---

### Phase 4: Transaction Explorer Links (Circle UUID to Blockchain Hash)

**User:** The transaction records should be clickable links to Arc blockchain explorer. But Circle gives us a UUID, not a blockchain hash.

**Agent:** I'll implement a polling mechanism. When a transaction is submitted, Circle returns a UUID immediately. We poll Circle's API until the transaction is confirmed on-chain and we get the actual blockchain hash.

Backend polling:

```typescript
export async function getTransactionStatus(txId: string): Promise<{ state: string; txHash?: string }> {
  const endpoints = [
    `${CIRCLE_W3S_API_BASE}/transactions/${txId}`,
    `${CIRCLE_W3S_API_BASE}/transactions/contractExecution/${txId}`,
    `${CIRCLE_W3S_API_BASE}/developer/transactions/${txId}`
  ];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (response.ok) {
      const data = await response.json();
      return { state: data.data?.transaction?.state, txHash: data.data?.transaction?.txHash };
    }
  }
}
```

Frontend display pattern:

```tsx
{payout.txHash ? (
  <a href={`https://testnet.arcscan.app/tx/${payout.txHash}`}
     target="_blank" className="text-blue-400 hover:underline font-mono">
    {payout.txHash.slice(0, 10)}...{payout.txHash.slice(-8)}
  </a>
) : (
  <span className="text-muted-foreground font-mono">
    {payout.txId.slice(0, 8)}...{payout.txId.slice(-6)}
  </span>
)}
```

The UX pattern: show the Circle UUID as a pending indicator immediately, then upgrade it to a clickable Arc explorer link once the blockchain hash is available. Judges could click through to verify every transaction on-chain.

---

### Phase 5: The Hardest Problem — Demo Reset (Circular Treasury Flow)

**User:** I need a reset button that recovers all USDC from user wallets back to treasury so I can run the demo again. This is critical for the live hackathon presentation.

This turned out to be the most technically challenging part. Three major issues discovered through iterative debugging:

**Issue 1: USDC Precision (18 vs 6 decimals)**

Arc reports native balances in 18 decimals, but the ERC-20 interface uses 6 decimals. Both represent the same underlying balance. The agent created `getArcUsdcBalanceBaseUnits()` to query exact balances via raw RPC calls:

```typescript
export async function getArcUsdcBalanceBaseUnits(address: string): Promise<string> {
  // ERC-20 balanceOf(address) selector: 0x70a08231
  const data = '0x70a08231' + address.slice(2).padStart(64, '0');
  const response = await fetch(ARC_TESTNET_RPC, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'eth_call',
      params: [{ to: ARC_USDC_CONTRACT, data }, 'latest']
    })
  });
  const result = await response.json();
  return BigInt(result.result).toString();
}
```

**Issue 2: Transfer Size Limits**

Large single transfers (>$2) would fail on Arc. The solution: chunked transfers of $1 max per transaction with 3-second delays between chunks.

```typescript
const MAX_CHUNK_BASE_UNITS = BigInt(1_000_000); // $1.00 max per transfer
while (remainingToTransfer > BigInt(0)) {
  const chunkAmount = remainingToTransfer > MAX_CHUNK_BASE_UNITS 
    ? MAX_CHUNK_BASE_UNITS : remainingToTransfer;
  
  const result = await transferUSDCExact(user.id, treasury.address, chunkAmount.toString());
  if (result.success) {
    remainingToTransfer -= chunkAmount;
    await new Promise(resolve => setTimeout(resolve, 3000));
  } else break;
}
```

**Issue 3: Gas Buffer**

Since USDC *is* the gas token on Arc, you can't transfer your entire balance — you need USDC left over to pay for the transfer itself. The agent implemented a $0.15 gas buffer per wallet:

```typescript
const GAS_BUFFER = BigInt(150000); // 0.15 USDC for gas buffer per wallet
const transferBalance = rawBalance > GAS_BUFFER ? (rawBalance - GAS_BUFFER).toString() : '0';
```

The reset flow waits 20 seconds for Arc blockchain confirmations, then reports actual gas costs vs. expected recovery amounts — full transparency for hackathon judges.

---

### Phase 6: Circle Integration Diagnostics (For Judges)

**User:** Hackathon judges need to verify this is real. Add a panel showing our Circle API configuration, wallet set details, and links to every wallet on Arc explorer.

The agent built a diagnostics card that queries Circle's entity configuration API and displays:
- API key prefix (first 12 chars)
- Entity ID and App ID
- Wallet Set name and custody type
- USDC contract address (linked to explorer)
- Every Arc wallet with address, balance, and explorer link

This was crucial for the hackathon — judges could independently verify every wallet and transaction on the public Arc testnet explorer.

---

## Key Technical Decisions Made by the Agent

1. **No mocking** — Every transaction in the demo is a real USDC transfer on Arc testnet. The agent consistently pushed toward real blockchain integration rather than simulated flows.

2. **Chunked transfers** — When large transfers failed during the reset flow, the agent diagnosed the Arc transfer limit issue and implemented $1-max chunking with delays, rather than switching to a simulated fallback.

3. **Exact balance recovery** — Used BigInt arithmetic with raw RPC calls for precise balance queries, avoiding floating-point rounding that would leave dust in wallets.

4. **Progressive transaction display** — Circle UUID shown immediately as a pending state, then upgraded to a clickable blockchain explorer link once the hash is available. No loading spinners — the UX always shows the most current information available.

5. **Gas accounting** — Since USDC is Arc's gas token, the agent tracked gas costs separately and reported them in the UI, giving judges full visibility into the economics.

---

## Outcome

This live demo was presented at the on-site hackathon on January 23, 2026. Judges could:
- Click "Run Demo" and watch real USDC flow to three wallets
- Click transaction links to verify each transfer on Arc's block explorer  
- Click "Reset" to watch funds return to treasury
- Run it again — fully circular

The project won **3rd place ($1,000 USDC)** in the "Best Gateway-Based Micropayments Integration" track.

The entire application — backend, frontend, blockchain integration, and presentation — was built 100% through AI-assisted development on Replit.
