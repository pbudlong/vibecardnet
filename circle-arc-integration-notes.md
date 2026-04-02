# Circle Programmable Wallets — Arc Testnet Integration Notes

---

## 1. Auth Flow

**The SDK handles encryption for you.** You pass the raw hex entity secret string directly to the SDK — you never manually encrypt it:

```typescript
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET  // raw 64-char hex string
});
```

The SDK does RSA OAEP SHA-256 encryption internally before sending it to Circle. You never see the encrypted form.

**What requires encrypted entity secret vs. just Bearer token:**
- **SDK calls** (`createContractExecutionTransaction`, `createWallets`, `listWallets`) — the SDK handles the entity secret encryption automatically
- **Direct REST calls** (checking transaction status, fetching wallet lists, entity config, faucet) — Bearer token only, no entity secret needed:

```
Authorization: Bearer <CIRCLE_API_KEY>
Content-Type: application/json
```

---

## 2. Blockchain Identifier

```
ARC-TESTNET
```

That exact string is used everywhere — in `blockchains: ['ARC-TESTNET']` during wallet creation, in `blockchain` fields, and to look up the USDC contract address. Circle added Arc testnet support as a first-class option.

---

## 3. Wallet Setup — One-Time vs. Every Startup

**One-time manual step.** The setup route exists but is not called on startup:

```
POST /api/wallets/setup-arc
```

On startup, `createArcTestnetWallets()` checks `listWallets({})` and exits early if 4+ Arc wallets already exist:

```typescript
const arcWallets = existingWallets.filter(w => w.blockchain === 'ARC-TESTNET');
if (arcWallets.length >= 4) {
  // Already set up, return existing wallets
  return { success: true, wallets: arcWallets };
}
```

The one-time flow is: get (or create) a wallet set → create 4 wallets with `name` and `refId` metadata → fund treasury from `https://faucet.circle.com` (20 USDC per 2 hours, select Arc Testnet).

The entity secret itself is also a one-time step: generate 32 random bytes as a hex string, register it at `console.circle.com/wallets/dev/configurator`, download the recovery file, save it as `CIRCLE_ENTITY_SECRET`.

---

## 4. Contract Execution — Exact Call Shape

This is the core call for ERC-20 transfers (and would be the same pattern for `postTask(uint256 amount)`):

```typescript
const result = await client.createContractExecutionTransaction({
  walletId: 'the-circle-wallet-uuid-of-the-sender',
  contractAddress: '0x3600000000000000000000000000000000000000',
  abiFunctionSignature: 'transfer(address,uint256)',
  abiParameters: [
    '0xRecipientAddress',
    '1000000'  // amount as string, in base units (6 decimals = $1.00 USDC)
  ],
  fee: { type: 'level', config: { feeLevel: 'MEDIUM' } }
});

const txId = result.data?.id;  // Circle UUID, not blockchain hash
```

**For your `postTask(uint256 amount)` example:**
```typescript
abiFunctionSignature: 'postTask(uint256)',
abiParameters: ['1000000']  // amount in base units as a string
```

Key details:
- `walletId` is Circle's internal UUID, not the blockchain address
- `abiParameters` are always **strings**, even for uint256
- The encrypted entity secret is handled internally by the SDK — it's not in this call at all
- Returns a **Circle UUID** immediately (`result.data.id`), not a blockchain hash. Poll `GET /api/transactions/:txId` to get the actual `txHash`

---

## 5. USDC Balance Check

Circle's API doesn't return Arc balances reliably (it showed stale/zero data during testing). The working approach is a direct RPC call to Arc:

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
// result.result is a hex string
const balanceBaseUnits = BigInt(result.result);
const balanceUSDC = Number(balanceBaseUnits) / 1_000_000;  // 6 decimals
```

---

## 6. Gotchas

**Entity secret format:** It's a 64-character hex string (32 bytes). Generate it with `crypto.getRandomValues`, not any other method. Register it at the Circle developer console and keep the recovery file — you can't recover it otherwise. Then store the raw hex in your env var; the SDK encrypts it automatically.

**Arc balance has 18 decimals at the native layer, 6 at the ERC-20 layer.** Both represent the same underlying balance — don't double-convert. The ERC-20 `balanceOf` call (above) returns 6-decimal values. The Circle API sometimes returns 18-decimal values for the same wallet. Use the direct RPC `eth_call` for correctness.

**Circle's API returns stale/zero balances for Arc wallets.** After any transfer, always query the Arc RPC directly for the real balance. `GET /v1/w3s/wallets` with bearer token will often show 0 even when the wallet has funds.

**Transfer size limit on Arc:** Single transfers above ~$2 fail silently or error. Cap at $1 per transaction with a 3-second delay between transfers. This was discovered the hard way during the reset flow.

**USDC is the gas token.** Every transaction (including failed ones) costs USDC. You can't transfer your full balance — leave at least $0.15 per wallet as a gas buffer or the transfer transaction itself will fail:

```typescript
const GAS_BUFFER = BigInt(150000); // 0.15 USDC in base units
const transferAmount = rawBalance > GAS_BUFFER ? rawBalance - GAS_BUFFER : BigInt(0);
```

**Transaction hash polling:** `createContractExecutionTransaction` returns a Circle UUID immediately, before the transaction hits the blockchain. Poll `GET /v1/w3s/transactions/:txId` with Bearer token — try these endpoints in order, as different tx types live at different paths:
```
/v1/w3s/transactions/:txId
/v1/w3s/transactions/contractExecution/:txId
/v1/w3s/developer/transactions/:txId
```
The `txHash` field appears in the response once Arc confirms (~15 seconds). Until then `state` is `PENDING`.

**Wallet state must be `LIVE` before transacting.** Newly created wallets start in a provisioning state. In practice with Arc testnet they're ready almost immediately, but if you get "wallet not ready" errors, `listWallets` and check the `state` field.
