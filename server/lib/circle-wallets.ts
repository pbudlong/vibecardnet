const CIRCLE_API_BASE = 'https://api.circle.com/v1';

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
    const response = await fetch(`${CIRCLE_API_BASE}/wallets`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('[Circle] Failed to fetch wallet:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const wallet = data.data[0];
      return {
        id: wallet.walletId || wallet.id,
        address: wallet.address,
        blockchain: wallet.blockchain || 'ARC',
        balance: {
          available: wallet.balances?.[0]?.amount || '0',
          currency: 'USDC'
        }
      };
    }

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
    const response = await fetch(`${CIRCLE_API_BASE}/wallets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotencyKey: `user-${userId}-${Date.now()}`,
        description: `VibeCard user wallet for ${userId}`,
        blockchain: 'ARC'
      })
    });

    if (!response.ok) {
      console.error('[Circle] Failed to create wallet:', response.status);
      return null;
    }

    const data = await response.json();
    
    return {
      id: data.data.walletId || data.data.id,
      address: data.data.address,
      userId,
      blockchain: 'ARC'
    };
  } catch (error) {
    console.error('[Circle] Error creating wallet:', error);
    return null;
  }
}

export async function fundFromFaucet(address: string): Promise<boolean> {
  const apiKey = process.env.CIRCLE_API_KEY;
  
  if (!apiKey) {
    console.warn('[Circle] No API key configured for faucet');
    return false;
  }

  try {
    const response = await fetch(`${CIRCLE_API_BASE}/faucet/drips`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address,
        blockchain: 'ARC',
        usdc: true
      })
    });

    return response.ok;
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
