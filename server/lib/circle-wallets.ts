const CIRCLE_W3S_API_BASE = 'https://api.circle.com/v1/w3s';

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
    console.log('[Circle] Wallets response:', JSON.stringify(data, null, 2));
    
    if (data.data?.wallets && data.data.wallets.length > 0) {
      const wallets = data.data.wallets;
      
      const treasuryWallet = wallets.find((w: any) => 
        w.refId === 'treasury' || w.name?.toLowerCase().includes('treasury')
      );
      
      const wallet = treasuryWallet || wallets[0];
      console.log('[Circle] Selected wallet:', wallet.name || wallet.refId, wallet.address);
      
      const usdcBalance = wallet.balances?.find((b: any) => 
        b.token?.symbol === 'USDC' || b.token?.name?.includes('USDC')
      );
      
      return {
        id: wallet.id,
        address: wallet.address,
        blockchain: wallet.blockchain || 'ARC-TESTNET',
        balance: {
          available: usdcBalance?.amount || '0',
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
    
    return wallets.map((w: any) => {
      const usdcBalance = w.balances?.find((b: any) => 
        b.token?.symbol === 'USDC' || b.token?.name?.includes('USDC')
      );
      return {
        id: w.id,
        name: w.name || '',
        refId: w.refId || '',
        address: w.address,
        blockchain: w.blockchain,
        usdcBalance: usdcBalance?.amount || '0'
      };
    });
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

export async function transferUSDC(
  fromWalletId: string, 
  toAddress: string, 
  amount: string,
  blockchain: string = 'BASE-SEPOLIA'
): Promise<{ success: boolean; txId?: string; error?: string }> {
  const apiKey = process.env.CIRCLE_API_KEY;
  const entitySecret = process.env.CIRCLE_ENTITY_SECRET;
  
  if (!apiKey) {
    return { success: false, error: 'No API key' };
  }
  
  if (!entitySecret) {
    return { success: false, error: 'No entity secret configured' };
  }

  const usdcContract = USDC_CONTRACTS[blockchain];
  if (!usdcContract) {
    return { success: false, error: `USDC contract not configured for ${blockchain}` };
  }

  // Convert amount to USDC base units (6 decimals)
  const amountInBaseUnits = Math.floor(parseFloat(amount) * 1_000_000).toString();

  console.log(`[Circle] Transferring ${amount} USDC from wallet ${fromWalletId} to ${toAddress}`);
  console.log(`[Circle] Using USDC contract: ${usdcContract} (${amountInBaseUnits} base units)`);

  // Generate a UUID v4 for idempotency
  const idempotencyKey = crypto.randomUUID();

  try {
    // Use contract execution to call ERC-20 transfer function
    const transferResponse = await fetch(`${CIRCLE_W3S_API_BASE}/developer/transactions/contractExecution`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotencyKey,
        entitySecretCiphertext: entitySecret,
        walletId: fromWalletId,
        contractAddress: usdcContract,
        abiFunctionSignature: 'transfer(address,uint256)',
        abiParameters: [toAddress, amountInBaseUnits],
        feeLevel: 'LOW'
      })
    });

    if (!transferResponse.ok) {
      const errorText = await transferResponse.text();
      console.error('[Circle] Transfer failed:', transferResponse.status, errorText);
      return { success: false, error: errorText };
    }

    const result = await transferResponse.json();
    console.log('[Circle] Transfer result:', JSON.stringify(result, null, 2));
    return { success: true, txId: result.data?.id };
  } catch (error) {
    console.error('[Circle] Transfer error:', error);
    return { success: false, error: String(error) };
  }
}

export async function runTestTransaction(cachedTreasuryBalance?: string): Promise<{
  success: boolean;
  transfers: Array<{ to: string; amount: string; status: string; txId?: string }>;
  totalSent: string;
  newTreasuryBalance: string;
}> {
  const wallets = await getAllWalletsWithBalances();
  
  // Find treasury wallet
  const treasury = wallets.find(w => 
    w.refId === 'treasury' || w.name?.toLowerCase().includes('treasury')
  );
  
  if (!treasury) {
    console.log('[Demo] No treasury wallet found');
    return { success: false, transfers: [], totalSent: '0', newTreasuryBalance: '0' };
  }

  // Use cached balance if Circle API returns 0 (balance not included in wallet list)
  let treasuryBalance = parseFloat(treasury.usdcBalance);
  if (treasuryBalance === 0 && cachedTreasuryBalance) {
    treasuryBalance = parseFloat(cachedTreasuryBalance);
    console.log('[Demo] Using cached treasury balance for transaction:', treasuryBalance);
  }
  
  if (treasuryBalance < 1) {
    console.log('[Demo] Treasury balance too low:', treasuryBalance);
    return { success: false, transfers: [], totalSent: '0', newTreasuryBalance: String(treasuryBalance) };
  }

  // Find user wallets (non-treasury)
  const userWallets = wallets.filter(w => 
    w.refId !== 'treasury' && 
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
    newTreasuryBalance: newBalance
  };
}

export async function resetDemoToTreasury(): Promise<{ 
  success: boolean; 
  transfers: Array<{ from: string; amount: string; status: string }>;
  totalRecovered: string;
}> {
  const wallets = await getAllWalletsWithBalances();
  
  // Find treasury wallet
  const treasury = wallets.find(w => 
    w.refId === 'treasury' || w.name?.toLowerCase().includes('treasury')
  );
  
  if (!treasury) {
    return { success: false, transfers: [], totalRecovered: '0' };
  }

  // Find user wallets with balances
  const userWallets = wallets.filter(w => 
    w.refId !== 'treasury' && 
    !w.name?.toLowerCase().includes('treasury') &&
    parseFloat(w.usdcBalance) > 0
  );

  const transfers: Array<{ from: string; amount: string; status: string }> = [];
  let totalRecovered = 0;

  for (const userWallet of userWallets) {
    const result = await transferUSDC(
      userWallet.id,
      treasury.address,
      userWallet.usdcBalance,
      userWallet.blockchain
    );
    
    transfers.push({
      from: userWallet.name || userWallet.refId,
      amount: userWallet.usdcBalance,
      status: result.success ? 'success' : 'failed'
    });

    if (result.success) {
      totalRecovered += parseFloat(userWallet.usdcBalance);
    }
  }

  return {
    success: transfers.length > 0,
    transfers,
    totalRecovered: totalRecovered.toFixed(2)
  };
}
