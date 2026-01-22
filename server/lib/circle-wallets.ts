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

export async function transferUSDC(
  fromWalletId: string, 
  toAddress: string, 
  amount: string,
  blockchain: string = 'BASE-SEPOLIA'
): Promise<{ success: boolean; txId?: string; error?: string }> {
  const apiKey = process.env.CIRCLE_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'No API key' };
  }

  try {
    // Get USDC token ID for the blockchain
    const tokenResponse = await fetch(`${CIRCLE_W3S_API_BASE}/tokens?blockchain=${blockchain}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!tokenResponse.ok) {
      return { success: false, error: 'Failed to get token info' };
    }

    const tokenData = await tokenResponse.json();
    const usdcToken = tokenData.data?.tokens?.find((t: any) => t.symbol === 'USDC');
    
    if (!usdcToken) {
      return { success: false, error: 'USDC token not found' };
    }

    console.log(`[Circle] Transferring ${amount} USDC from wallet ${fromWalletId} to ${toAddress}`);
    
    const transferResponse = await fetch(`${CIRCLE_W3S_API_BASE}/developer/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotencyKey: `transfer-${fromWalletId}-${Date.now()}`,
        walletId: fromWalletId,
        tokenId: usdcToken.id,
        destinationAddress: toAddress,
        amounts: [amount],
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
