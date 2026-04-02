# Circle Programmable Wallets — Arc Testnet Integration Notes

Based on the actual implementation in `server/lib/circle-wallets.ts` and `server/routes.ts`.

---

## 1. Auth Flow

**The SDK handles encryption for you.** Pass the raw hex entity secret string directly to the SDK — never manually encrypt it:

```typescript
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET  // raw 64-char hex string
});
```

The SDK does RSA OAEP SHA-256 encryption internally before sending to Circle. You never see the encrypted form.

**What requires entity secret vs. just Bearer token:**
- **SDK calls** (`createContractExecutionTransaction`, `createWallets`, `listWallets`) — SDK handles entity secret encryption automatically
- **Direct REST calls** (transaction status, wallet lists, entity config, faucet) — Bearer token only:

```
Authorization: Bearer <CIRCLE_API_KEY>
Content-Type: application/json
```

---

## 2. Blockchain Identifier

```
ARC-TESTNET
```

Used everywhere — in `blockchains: ['ARC-TESTNET']` during wallet creation, in `blockchain` fields, and to look up the USDC contract address.

---

## 3. Wallet Setup — One-Time vs. Every Startup

**One-time manual step.** The setup route (`POST /api/wallets/setup-arc`) exists but is not called on startup.

On startup, `createArcTestnetWallets()` checks `listWallets({})` and exits early if 4+ Arc wallets already exist:

```typescript
const arcWallets = existingWallets.filter(w => w.blockchain === 'ARC-TESTNET');
if (arcWallets.length >= 4) {
  return { success: true, wallets: arcWallets };
}
```

**One-time setup flow:**
1. Get (or create) a wallet set
2. Create wallets with `name` and `refId` metadata:

```typescript
await client.createWallets({
  blockchains: ['ARC-TESTNET'],
  count: 1,
  walletSetId,
  metadata: [{ name: 'Arc Treasury', refId: 'arc-treasury' }]
});
```

3. Fund treasury from `https://faucet.circle.com` (20 USDC per 2 hours, select Arc Testnet)

**Entity secret is also one-time:** Generate 32 random bytes as a hex string, register at `console.circle.com/wallets/dev/configurator`, download the recovery file, store raw hex as `CIRCLE_ENTITY_SECRET`.

---

## 4. Contract Execution — Exact Call Shape

```typescript
const result = await client.createContractExecutionTransaction({
  walletId: 'the-circle-wallet-uuid-of-the-sender',  // Circle UUID, not blockchain address
  contractAddress: '0x3600000000000000000000000000000000000000',
  abiFunctionSignature: 'transfer(address,uint256)',
  abiParameters: [
    '0xRecipientAddress',
    '1000000'   // amount as string, in base units (6 decimals = $1.00 USDC)
  ],
  fee: { type: 'level', config: { feeLevel: 'MEDIUM' } }
});

const txId = result.data?.id;  // Circle UUID — not a blockchain hash, poll for txHash
```

**For a custom function like `postTask(uint256 amount)`:**
```typescript
abiFunctionSignature: 'postTask(uint256)',
abiParameters: ['1000000']  // base units as a string
```

Key details:
- `walletId` is Circle's internal UUID, not the `0x` address
- `abiParameters` are always **strings**, even for uint256
- Encrypted entity secret is not in this call — the SDK handles it
- Returns a Circle UUID immediately (`result.data.id`), not a blockchain hash. Poll to get the `txHash`.

---

## 5. USDC Balance Check

Circle's API returns stale/zero data for Arc wallets. Use a direct RPC call instead:

```typescript
// ERC-20 balanceOf(address) — selector 0x70a08231
const data = '0x70a08231' + address.slice(2).padStart(64, '0');

const response = await fetch('https://arc-testnet.drpc.org', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_call',
    params: [{ to: '0x3600000000000000000000000000000000000000', data }, 'latest']
  })
});

const result = await response.json();
const balanceBaseUnits = BigInt(result.result);        // hex string → BigInt
const balanceUSDC = Number(balanceBaseUnits) / 1_000_000;  // 6 decimals
```

For exact balance with no floating-point loss (needed for reset/recovery flows), keep it as `BigInt` and only convert for display.

---

## 6. Polling for Blockchain Hash

`createContractExecutionTransaction` returns a Circle UUID immediately — the transaction hasn't hit the chain yet. Poll with Bearer token only, trying endpoints in this order:

```typescript
const endpoints = [
  `https://api.circle.com/v1/w3s/transactions/${txId}`,
  `https://api.circle.com/v1/w3s/transactions/contractExecution/${txId}`,
  `https://api.circle.com/v1/w3s/developer/transactions/${txId}`
];
```

Response shape when confirmed:
```json
{
  "data": {
    "transaction": {
      "state": "CONFIRMED",
      "txHash": "0xabc123...",
      "errorReason": null
    }
  }
}
```

Arc confirms in ~15 seconds. Until then `state` is `PENDING` and `txHash` is null. Poll every 1.5 seconds, up to 10 attempts. Arc explorer: `https://testnet.arcscan.app/tx/<txHash>`

---

## 7. Gotchas

**Entity secret format** — 64-character hex string (32 bytes). Generate with `crypto.getRandomValues`. Register at the Circle console and keep the recovery file. Store the raw hex as the env var; the SDK encrypts it automatically.

**Arc balance has 18 decimals at the native layer, 6 at the ERC-20 layer.** Both represent the same balance. The `balanceOf` RPC call (above) returns 6-decimal values. Always use the direct RPC call — don't trust Circle's API for Arc balances.

**Transfer size limit on Arc** — Single transfers above ~$2 fail. Cap at $1 per transaction with a 3-second delay between transfers:

```typescript
const MAX_CHUNK_BASE_UNITS = BigInt(1_000_000); // $1.00 max per transfer

while (remainingToTransfer > BigInt(0)) {
  const chunkAmount = remainingToTransfer > MAX_CHUNK_BASE_UNITS
    ? MAX_CHUNK_BASE_UNITS
    : remainingToTransfer;

  await transferUSDCExact(walletId, toAddress, chunkAmount.toString());
  remainingToTransfer -= chunkAmount;
  await new Promise(resolve => setTimeout(resolve, 3000));
}
```

**USDC is the gas token** — Every transaction (including failed ones) costs USDC. Leave at least $0.15 per wallet as a gas buffer or the transfer itself will fail:

```typescript
const GAS_BUFFER = BigInt(150000); // 0.15 USDC in base units
const transferAmount = rawBalance > GAS_BUFFER ? rawBalance - GAS_BUFFER : BigInt(0);
```

**Wallet state must be `LIVE` before transacting** — Newly created wallets start in a provisioning state. Check the `state` field from `listWallets` if you get "wallet not ready" errors. On Arc testnet they're typically ready within seconds.

**Add 2-second delays between sequential transfers** — Even though Arc has sub-second finality, the Circle SDK needs breathing room between contract executions from the same wallet. Without delays, the second transfer often fails.

---

## Key Constants

```typescript
const ARC_TESTNET_RPC     = 'https://arc-testnet.drpc.org';
const ARC_CHAIN_ID        = 5042002;
const ARC_USDC_CONTRACT   = '0x3600000000000000000000000000000000000000';
const ARC_EXPLORER        = 'https://testnet.arcscan.app';
const CIRCLE_API_BASE     = 'https://api.circle.com/v1/w3s';
const CIRCLE_FAUCET       = 'https://faucet.circle.com';  // 20 USDC per 2 hours
```
