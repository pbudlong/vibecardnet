import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

const CIRCLE_W3S_API_BASE = 'https://api.circle.com/v1/w3s';
const ARC_TESTNET_RPC = 'https://arc-testnet.drpc.org';
const ARC_USDC_CONTRACT = '0x3600000000000000000000000000000000000000';

// Query real USDC balance from Arc blockchain directly
export async function getArcUsdcBalance(address: string): Promise<string> {
  try {
    // ERC-20 balanceOf(address) selector: 0x70a08231
    const data = '0x70a08231' + address.slice(2).padStart(64, '0');
    
    const response = await fetch(ARC_TESTNET_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          { to: ARC_USDC_CONTRACT, data },
          'latest'
        ]
      })
    });

    const result = await response.json();
    if (result.result) {
      // Convert hex to decimal, divide by 10^6 for USDC decimals
      const balanceWei = BigInt(result.result);
      const balance = Number(balanceWei) / 1_000_000;
      return balance.toFixed(2);
    }
    return '0';
  } catch (error) {
    console.error('[Arc RPC] Error fetching balance:', error);
    return '0';
  }
}

// Initialize Circle SDK client (lazy loaded)
let circleClient: ReturnType<typeof initiateDeveloperControlledWalletsClient> | null = null;

function getCircleClient() {
  if (!circleClient) {
    const apiKey = process.env.CIRCLE_API_KEY;
    const entitySecret = process.env.CIRCLE_ENTITY_SECRET;
    
    if (!apiKey || !entitySecret) {
      return null;
    }
    
    circleClient = initiateDeveloperControlledWalletsClient({
      apiKey,
      entitySecret
    });
  }
  return circleClient;
}

export interface WalletBalance {
  available: string;
  currency: string;
}

export interface DeveloperWallet {
  id: string;
  address: string;
  blockchain: string;
  balance: WalletBalance;
}

export interface UserWallet {
  id: string;
  address: string;
  userId: string;
  blockchain: string;
}

export async function getDeveloperWalletBalance(): Promise<DeveloperWallet | null> {
  const apiKey = process.env.CIRCLE_API_KEY;
  
  if (!apiKey) {
    console.warn('[Circle] No API key configured');
    return null;
  }

  try {
    const response = await fetch(`${CIRCLE_W3S_API_BASE}/wallets`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Circle] Failed to fetch wallets:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    if (data.data?.wallets && data.data.wallets.length > 0) {
      const wallets = data.data.wallets;
      
      // Prefer Arc treasury for gasless transfers
      const arcTreasury = wallets.find((w: any) => 
        w.blockchain === 'ARC-TESTNET' && 
        (w.refId === 'arc-treasury' || w.name?.toLowerCase().includes('arc treasury'))
      );
      
      const baseTreasury = wallets.find((w: any) => 
        w.blockchain === 'BASE-SEPOLIA' && 
        (w.refId === 'treasury' || w.name?.toLowerCase().includes('treasury'))
      );
      
      const wallet = arcTreasury || baseTreasury || wallets[0];
      console.log('[Circle] Selected wallet:', wallet.name || wallet.refId, wallet.address, wallet.blockchain);
      
      // Query REAL blockchain balance for Arc wallets
      let realBalance = '0';
      if (wallet.blockchain === 'ARC-TESTNET') {
        realBalance = await getArcUsdcBalance(wallet.address);
        console.log('[Arc RPC] Real USDC balance:', realBalance);
      } else {
        // For non-Arc, use Circle API balance
        const usdcBalance = wallet.balances?.find((b: any) => 
          b.token?.symbol === 'USDC' || b.token?.name?.includes('USDC')
        );
        realBalance = usdcBalance?.amount || '0';
      }
      
      return {
        id: wallet.id,
        address: wallet.address,
        blockchain: wallet.blockchain || 'ARC-TESTNET',
        balance: {
          available: realBalance,
          currency: 'USDC'
        }
      };
    }

    console.log('[Circle] No wallets found in response');
    return null;
  } catch (error) {
    console.error('[Circle] Error fetching wallet:', error);
    return null;
  }
}

export async function createUserWallet(userId: string): Promise<UserWallet | null> {
  const apiKey = process.env.CIRCLE_API_KEY;
  
  if (!apiKey) {
    console.warn('[Circle] No API key configured');
    return null;
  }

  try {
    const response = await fetch(`${CIRCLE_W3S_API_BASE}/user/wallets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotencyKey: `user-${userId}-${Date.now()}`,
        blockchains: ['ARC-TESTNET']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Circle] Failed to create wallet:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    return {
      id: data.data?.wallet?.id || data.data?.id,
      address: data.data?.wallet?.address || data.data?.address,
      userId,
      blockchain: 'ARC-TESTNET'
    };
  } catch (error) {
    console.error('[Circle] Error creating wallet:', error);
    return null;
  }
}

// Create Arc testnet wallets for the demo (treasury + users) using Circle SDK
export async function createArcTestnetWallets(): Promise<{
  success: boolean;
  wallets: Array<{ name: string; address: string; refId: string }>;
  error?: string;
}> {
  const client = getCircleClient();
  
  if (!client) {
    return { success: false, wallets: [], error: 'Circle SDK not configured - check API key and entity secret' };
  }

  try {
    // First, get the existing wallet set ID
    const existingWalletsResponse = await client.listWallets({});
    const existingWallets = existingWalletsResponse.data?.wallets || [];
    
    // Check if Arc wallets already exist
    const arcWallets = existingWallets.filter((w: any) => w.blockchain === 'ARC-TESTNET');
    if (arcWallets.length >= 4) {
      console.log('[Circle SDK] Arc testnet wallets already exist');
      return {
        success: true,
        wallets: arcWallets.map((w: any) => ({
          name: w.name || '',
          address: w.address,
          refId: w.refId || ''
        }))
      };
    }

    // Get wallet set ID from existing wallet or create new one
    let walletSetId = existingWallets[0]?.walletSetId;
    
    if (!walletSetId) {
      // Create a new wallet set
      console.log('[Circle SDK] Creating new wallet set for Arc');
      const walletSetResponse = await client.createWalletSet({
        name: 'VibeCard Arc Wallets'
      });
      walletSetId = walletSetResponse.data?.walletSet?.id;
      
      if (!walletSetId) {
        return { success: false, wallets: [], error: 'Failed to create wallet set' };
      }
    }

    console.log('[Circle SDK] Creating Arc testnet wallets with wallet set:', walletSetId);

    // Create Arc testnet wallets: treasury + 3 users
    const walletConfigs = [
      { name: 'Arc Treasury', refId: 'arc-treasury' },
      { name: 'Manny Arc', refId: 'arc-user-Manny' },
      { name: 'Pete Arc', refId: 'arc-user-Pete' },
      { name: 'Matt Arc', refId: 'arc-user-Matt' }
    ];

    const createdWallets: Array<{ name: string; address: string; refId: string }> = [];

    for (const config of walletConfigs) {
      try {
        const createResponse = await client.createWallets({
          blockchains: ['ARC-TESTNET'],
          count: 1,
          walletSetId,
          metadata: [{ name: config.name, refId: config.refId }]
        });

        const wallet = createResponse.data?.wallets?.[0];
        if (wallet) {
          createdWallets.push({
            name: config.name,
            address: wallet.address,
            refId: config.refId
          });
          console.log(`[Circle SDK] Created Arc wallet: ${config.name} - ${wallet.address}`);
        }
      } catch (walletError) {
        console.error(`[Circle SDK] Failed to create ${config.name}:`, walletError);
      }
    }

    return {
      success: createdWallets.length > 0,
      wallets: createdWallets
    };
  } catch (error) {
    console.error('[Circle SDK] Error creating Arc wallets:', error);
    return { success: false, wallets: [], error: String(error) };
  }
}

export async function fundFromFaucet(address: string, blockchain: string = 'BASE-SEPOLIA'): Promise<boolean> {
  const apiKey = process.env.CIRCLE_API_KEY;
  
  if (!apiKey) {
    console.warn('[Circle] No API key configured for faucet');
    return false;
  }

  try {
    console.log(`[Circle] Requesting faucet funds for ${address} on ${blockchain}`);
    const response = await fetch('https://api.circle.com/v1/faucet/drips', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address,
        blockchain,
        usdc: true,
        native: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Circle] Faucet error:', response.status, errorText);
      return false;
    }

    const text = await response.text();
    if (text) {
      try {
        const data = JSON.parse(text);
        console.log('[Circle] Faucet response:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('[Circle] Faucet response (non-JSON):', text);
      }
    } else {
      console.log('[Circle] Faucet request successful (empty response)');
    }
    return true;
  } catch (error) {
    console.error('[Circle] Faucet error:', error);
    return false;
  }
}

export async function checkIntegrationStatus(): Promise<{
  wallets: boolean;
  hasApiKey: boolean;
  arcNetwork: boolean;
}> {
  const hasApiKey = !!process.env.CIRCLE_API_KEY;
  
  let wallets = false;
  if (hasApiKey) {
    const wallet = await getDeveloperWalletBalance();
    wallets = wallet !== null;
  }

  return {
    hasApiKey,
    wallets,
    arcNetwork: true
  };
}

export interface WalletWithBalance {
  id: string;
  name: string;
  refId: string;
  address: string;
  blockchain: string;
  usdcBalance: string;
}

export async function getAllWalletsWithBalances(): Promise<WalletWithBalance[]> {
  const apiKey = process.env.CIRCLE_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(`${CIRCLE_W3S_API_BASE}/wallets`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    const wallets = data.data?.wallets || [];
    
    // Query real blockchain balances for Arc wallets
    const walletsWithBalances = await Promise.all(wallets.map(async (w: any) => {
      let usdcBalance = '0';
      
      if (w.blockchain === 'ARC-TESTNET') {
        // Query real Arc blockchain balance
        usdcBalance = await getArcUsdcBalance(w.address);
      } else {
        // Use Circle API balance for other chains
        const balance = w.balances?.find((b: any) => 
          b.token?.symbol === 'USDC' || b.token?.name?.includes('USDC')
        );
        usdcBalance = balance?.amount || '0';
      }
      
      return {
        id: w.id,
        name: w.name || '',
        refId: w.refId || '',
        address: w.address,
        blockchain: w.blockchain,
        usdcBalance
      };
    }));
    
    return walletsWithBalances;
  } catch (error) {
    console.error('[Circle] Error fetching all wallets:', error);
    return [];
  }
}

// Known USDC contract addresses for supported testnets
const USDC_CONTRACTS: Record<string, string> = {
  'BASE-SEPOLIA': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  'ETH-SEPOLIA': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  'ARC-TESTNET': '0x3600000000000000000000000000000000000000', // USDC is native gas on Arc!
};

// Generate a new entity secret (32 bytes hex)
export function generateNewEntitySecret(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function transferUSDC(
  fromWalletId: string, 
  toAddress: string, 
  amount: string,
  blockchain: string = 'BASE-SEPOLIA'
): Promise<{ success: boolean; txId?: string; error?: string }> {
  const client = getCircleClient();
  
  if (!client) {
    return { success: false, error: 'Circle SDK not configured - check API key and entity secret' };
  }

  const usdcContract = USDC_CONTRACTS[blockchain];
  if (!usdcContract) {
    return { success: false, error: `USDC contract not configured for ${blockchain}` };
  }

  // Convert amount to USDC base units (6 decimals)
  const amountInBaseUnits = Math.floor(parseFloat(amount) * 1_000_000).toString();

  console.log(`[Circle SDK] Transferring ${amount} USDC from wallet ${fromWalletId} to ${toAddress}`);
  console.log(`[Circle SDK] Using USDC contract: ${usdcContract} (${amountInBaseUnits} base units)`);

  try {
    // Use the SDK for contract execution
    const result = await client.createContractExecutionTransaction({
      walletId: fromWalletId,
      contractAddress: usdcContract,
      abiFunctionSignature: 'transfer(address,uint256)',
      abiParameters: [toAddress, amountInBaseUnits],
      fee: { type: 'level', config: { feeLevel: 'LOW' } }
    });

    console.log('[Circle SDK] Transfer result:', JSON.stringify(result.data, null, 2));
    return { success: true, txId: result.data?.id };
  } catch (error: any) {
    console.error('[Circle SDK] Transfer error:', error?.message || error);
    return { success: false, error: error?.message || String(error) };
  }
}

export async function runTestTransaction(): Promise<{
  success: boolean;
  transfers: Array<{ to: string; amount: string; status: string; txId?: string }>;
  totalSent: string;
  newTreasuryBalance: string;
  blockchain?: string;
}> {
  const wallets = await getAllWalletsWithBalances();
  
  // Prefer Arc testnet wallets for gasless transfers
  const arcTreasury = wallets.find(w => 
    w.blockchain === 'ARC-TESTNET' && 
    (w.refId === 'arc-treasury' || w.name?.toLowerCase().includes('arc treasury'))
  );
  
  // Fall back to Base Sepolia treasury if no Arc treasury
  const baseTreasury = wallets.find(w => 
    w.blockchain === 'BASE-SEPOLIA' && 
    (w.refId === 'treasury' || w.name?.toLowerCase().includes('treasury'))
  );
  
  const treasury = arcTreasury || baseTreasury;
  
  if (!treasury) {
    console.log('[Demo] No treasury wallet found');
    return { success: false, transfers: [], totalSent: '0', newTreasuryBalance: '0' };
  }
  
  console.log(`[Demo] Using treasury on ${treasury.blockchain}: ${treasury.address}`);

  // Use REAL blockchain balance
  const treasuryBalance = parseFloat(treasury.usdcBalance);
  console.log(`[Demo] Real treasury balance: $${treasuryBalance}`);
  
  if (treasuryBalance < 1) {
    console.log('[Demo] Treasury balance too low:', treasuryBalance);
    return { success: false, transfers: [], totalSent: '0', newTreasuryBalance: String(treasuryBalance), blockchain: treasury.blockchain };
  }

  // Find user wallets on the same blockchain as treasury
  const userWallets = wallets.filter(w => 
    w.blockchain === treasury.blockchain &&
    !w.refId?.includes('treasury') && 
    !w.name?.toLowerCase().includes('treasury')
  ).slice(0, 3); // Take up to 3 user wallets

  if (userWallets.length === 0) {
    console.log('[Demo] No user wallets found');
    return { success: false, transfers: [], totalSent: '0', newTreasuryBalance: treasury.usdcBalance };
  }

  // Calculate payout amounts (Creator 60%, Sharer 25%, Platform 15% of $5 total)
  const payoutTotal = Math.min(5, treasuryBalance); // Cap at $5 per test or available balance
  const payoutAmounts = [
    { label: 'Creator', ratio: 0.60 },
    { label: 'Sharer', ratio: 0.25 },
    { label: 'Platform', ratio: 0.15 }
  ];

  const transfers: Array<{ to: string; amount: string; status: string; txId?: string }> = [];
  let totalSent = 0;

  for (let i = 0; i < Math.min(userWallets.length, payoutAmounts.length); i++) {
    const userWallet = userWallets[i];
    const amount = (payoutTotal * payoutAmounts[i].ratio).toFixed(2);
    
    console.log(`[Demo] Sending $${amount} to ${userWallet.name || userWallet.refId} (${userWallet.address})`);
    
    const result = await transferUSDC(
      treasury.id,
      userWallet.address,
      amount,
      treasury.blockchain
    );
    
    transfers.push({
      to: userWallet.name || userWallet.refId || payoutAmounts[i].label,
      amount,
      status: result.success ? 'success' : 'failed',
      txId: result.txId
    });

    if (result.success) {
      totalSent += parseFloat(amount);
    }
  }

  const newBalance = (treasuryBalance - totalSent).toFixed(2);
  
  return {
    success: transfers.some(t => t.status === 'success'),
    transfers,
    totalSent: totalSent.toFixed(2),
    newTreasuryBalance: newBalance,
    blockchain: treasury.blockchain
  };
}

export async function resetDemoToTreasury(): Promise<{ 
  success: boolean; 
  transfers: Array<{ from: string; amount: string; status: string }>;
  totalRecovered: string;
}> {
  const wallets = await getAllWalletsWithBalances();
  
  // Prefer Arc treasury for gasless transfers
  const arcTreasury = wallets.find(w => 
    w.blockchain === 'ARC-TESTNET' && 
    (w.refId === 'arc-treasury' || w.name?.toLowerCase().includes('arc treasury'))
  );
  
  const baseTreasury = wallets.find(w => 
    w.blockchain === 'BASE-SEPOLIA' && 
    (w.refId === 'treasury' || w.name?.toLowerCase().includes('treasury'))
  );
  
  const treasury = arcTreasury || baseTreasury;
  
  if (!treasury) {
    return { success: false, transfers: [], totalRecovered: '0' };
  }

  console.log(`[Demo Reset] Using treasury on ${treasury.blockchain}: ${treasury.address}`);

  // Find user wallets on same blockchain as treasury with real balances
  const userWallets = wallets.filter(w => 
    w.blockchain === treasury.blockchain &&
    !w.refId?.includes('treasury') && 
    !w.name?.toLowerCase().includes('treasury') &&
    parseFloat(w.usdcBalance) > 0
  );

  console.log(`[Demo Reset] Found ${userWallets.length} user wallets with balances`);

  const transfers: Array<{ from: string; amount: string; status: string }> = [];
  let totalRecovered = 0;

  for (const userWallet of userWallets) {
    // Use REAL blockchain balance
    const amount = userWallet.usdcBalance;
    if (parseFloat(amount) <= 0) continue;

    console.log(`[Demo Reset] Recovering $${amount} from ${userWallet.name}`);
    
    const result = await transferUSDC(
      userWallet.id,
      treasury.address,
      amount,
      userWallet.blockchain
    );
    
    transfers.push({
      from: userWallet.name || userWallet.refId,
      amount,
      status: result.success ? 'success' : 'failed'
    });

    if (result.success) {
      totalRecovered += parseFloat(amount);
    }
  }

  return {
    success: transfers.length > 0,
    transfers,
    totalRecovered: totalRecovered.toFixed(2)
  };
}
