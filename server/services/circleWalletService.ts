import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY!;
const CIRCLE_ENTITY_SECRET = process.env.CIRCLE_ENTITY_SECRET!;

// Base Sepolia testnet chain identifier
const BASE_SEPOLIA_CHAIN = 'BASE-SEPOLIA';

// USDC contract address on Base Sepolia
const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

let walletSetId: string | null = null;
let usdcTokenId: string | null = null;

interface WalletInfo {
  id: string;
  address: string;
  name: string;
  blockchain: string;
  state: string;
  balance?: string;
}

interface TransactionLog {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  amount: string;
  status: string;
  txHash?: string;
}

class CircleWalletService {
  private client: ReturnType<typeof initiateDeveloperControlledWalletsClient> | null = null;
  private treasuryWallet: WalletInfo | null = null;
  private userWallets: Map<string, WalletInfo> = new Map();
  private transactionLogs: TransactionLog[] = [];

  async initialize() {
    if (!CIRCLE_API_KEY || !CIRCLE_ENTITY_SECRET) {
      console.warn('⚠️ Circle credentials not configured - wallet service will use mock mode');
      return false;
    }

    try {
      this.client = initiateDeveloperControlledWalletsClient({
        apiKey: CIRCLE_API_KEY,
        entitySecret: CIRCLE_ENTITY_SECRET,
      });
      console.log('✅ Circle wallet client initialized');
      
      // Look up USDC token ID for Base Sepolia
      await this.lookupUsdcToken();
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Circle client:', error);
      return false;
    }
  }

  private async lookupUsdcToken() {
    if (!this.client || usdcTokenId) return;

    // For developer-controlled wallets, we need to use the contract address directly
    // The token lookup will happen when we check balances or make transfers
    // Set a placeholder - actual transfers will use contract interaction
    usdcTokenId = USDC_CONTRACT_ADDRESS;
    console.log('💵 Using USDC contract address:', usdcTokenId);
  }
  
  getUsdcContractAddress(): string {
    return USDC_CONTRACT_ADDRESS;
  }

  private async ensureWalletSet(): Promise<string> {
    if (walletSetId) return walletSetId;
    if (!this.client) throw new Error('Client not initialized');

    try {
      // Check for existing wallet sets
      const existingSets = await this.client.listWalletSets({});
      if (existingSets.data?.walletSets?.length) {
        walletSetId = existingSets.data.walletSets[0].id;
        console.log('📁 Using existing wallet set:', walletSetId);
        return walletSetId;
      }

      // Create new wallet set
      const response = await this.client.createWalletSet({
        name: 'VibeCard Demo Wallets',
      });
      walletSetId = response.data?.walletSet?.id || null;
      console.log('📁 Created wallet set:', walletSetId);
      return walletSetId!;
    } catch (error) {
      console.error('Failed to ensure wallet set:', error);
      throw error;
    }
  }

  async createTreasuryWallet(): Promise<WalletInfo> {
    if (this.treasuryWallet) return this.treasuryWallet;

    if (!this.client) {
      // Mock mode
      this.treasuryWallet = {
        id: 'mock-treasury',
        address: '0xTreasuryMock...abc',
        name: 'VibeCard Treasury',
        blockchain: BASE_SEPOLIA_CHAIN,
        state: 'LIVE',
        balance: '20.00',
      };
      return this.treasuryWallet;
    }

    try {
      const setId = await this.ensureWalletSet();
      
      // Check if treasury already exists
      const existingWallets = await this.client.listWallets({});
      const existing = existingWallets.data?.wallets?.find(w => w.name === 'VibeCard Treasury');
      
      if (existing) {
        this.treasuryWallet = {
          id: existing.id,
          address: existing.address,
          name: existing.name || 'VibeCard Treasury',
          blockchain: existing.blockchain,
          state: existing.state,
        };
        console.log('💰 Found existing treasury:', this.treasuryWallet.address);
        return this.treasuryWallet;
      }

      // Create new treasury wallet
      const response = await this.client.createWallets({
        walletSetId: setId,
        blockchains: [BASE_SEPOLIA_CHAIN],
        count: 1,
        metadata: [{ name: 'VibeCard Treasury', refId: 'treasury' }],
      });

      const wallet = response.data?.wallets?.[0];
      if (!wallet) throw new Error('Failed to create treasury wallet');

      this.treasuryWallet = {
        id: wallet.id,
        address: wallet.address,
        name: 'VibeCard Treasury',
        blockchain: wallet.blockchain,
        state: wallet.state,
      };
      console.log('💰 Created treasury wallet:', this.treasuryWallet.address);
      return this.treasuryWallet;
    } catch (error) {
      console.error('Failed to create treasury wallet:', error);
      throw error;
    }
  }

  async createUserWallet(userName: string): Promise<WalletInfo> {
    const existing = this.userWallets.get(userName);
    if (existing) return existing;

    if (!this.client) {
      // Mock mode
      const mockWallet: WalletInfo = {
        id: `mock-${userName}`,
        address: `0x${userName.substring(0, 8)}...Mock`,
        name: userName,
        blockchain: BASE_SEPOLIA_CHAIN,
        state: 'LIVE',
        balance: '0.00',
      };
      this.userWallets.set(userName, mockWallet);
      return mockWallet;
    }

    try {
      const setId = await this.ensureWalletSet();

      const response = await this.client.createWallets({
        walletSetId: setId,
        blockchains: [BASE_SEPOLIA_CHAIN],
        count: 1,
        metadata: [{ name: userName, refId: `user-${userName}` }],
      });

      const wallet = response.data?.wallets?.[0];
      if (!wallet) throw new Error(`Failed to create wallet for ${userName}`);

      const walletInfo: WalletInfo = {
        id: wallet.id,
        address: wallet.address,
        name: userName,
        blockchain: wallet.blockchain,
        state: wallet.state,
        balance: '0.00',
      };
      this.userWallets.set(userName, walletInfo);
      console.log(`👛 Created wallet for ${userName}:`, walletInfo.address);
      return walletInfo;
    } catch (error) {
      console.error(`Failed to create wallet for ${userName}:`, error);
      throw error;
    }
  }

  async getWalletBalance(walletId: string): Promise<string> {
    if (!this.client) {
      // Mock mode - return stored balance
      const wallets = Array.from(this.userWallets.values());
      for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].id === walletId) return wallets[i].balance || '0.00';
      }
      if (this.treasuryWallet?.id === walletId) return this.treasuryWallet.balance || '0.00';
      return '0.00';
    }

    try {
      const response = await this.client.getWalletTokenBalance({
        id: walletId,
      });
      
      const usdcBalance = response.data?.tokenBalances?.find(
        (t: any) => t.token?.symbol === 'USDC'
      );
      return usdcBalance?.amount || '0.00';
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return '0.00';
    }
  }

  async getAllWallets(): Promise<{ treasury: WalletInfo | null; users: WalletInfo[] }> {
    // Update balances
    if (this.treasuryWallet) {
      this.treasuryWallet.balance = await this.getWalletBalance(this.treasuryWallet.id);
    }
    
    const entries = Array.from(this.userWallets.entries());
    for (let i = 0; i < entries.length; i++) {
      const [name, wallet] = entries[i];
      wallet.balance = await this.getWalletBalance(wallet.id);
      this.userWallets.set(name, wallet);
    }

    return {
      treasury: this.treasuryWallet,
      users: Array.from(this.userWallets.values()),
    };
  }

  async transferUSDC(
    fromWalletId: string,
    toAddress: string,
    amount: string,
    description: string
  ): Promise<TransactionLog> {
    const log: TransactionLog = {
      id: `tx-${Date.now()}`,
      timestamp: Date.now(),
      from: fromWalletId,
      to: toAddress,
      amount,
      status: 'PENDING',
    };

    if (!this.client) {
      // Mock mode - simulate transfer
      log.status = 'COMPLETE';
      log.txHash = `0x${Math.random().toString(16).slice(2, 66)}`;
      this.transactionLogs.push(log);
      
      // Update mock balances
      if (this.treasuryWallet && fromWalletId === this.treasuryWallet.id) {
        const currentBalance = parseFloat(this.treasuryWallet.balance || '20.00');
        this.treasuryWallet.balance = (currentBalance - parseFloat(amount)).toFixed(2);
      }
      const wallets = Array.from(this.userWallets.values());
      for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].address === toAddress) {
          const currentBalance = parseFloat(wallets[i].balance || '0.00');
          wallets[i].balance = (currentBalance + parseFloat(amount)).toFixed(2);
        }
      }
      
      console.log(`💸 Mock transfer: ${amount} USDC to ${toAddress} - ${description}`);
      return log;
    }

    try {
      // Use tokenAddress + blockchain instead of tokenId for ERC-20 transfers
      const response = await this.client.createTransaction({
        walletId: fromWalletId,
        tokenAddress: USDC_CONTRACT_ADDRESS,
        blockchain: BASE_SEPOLIA_CHAIN,
        destinationAddress: toAddress,
        amount: [amount],
        fee: {
          type: 'level',
          config: { feeLevel: 'HIGH' },
        },
      } as any);

      log.status = (response.data as any)?.state || 'PENDING';
      log.txHash = (response.data as any)?.txHash;
      this.transactionLogs.push(log);
      
      console.log(`💸 Transfer: ${amount} USDC to ${toAddress} - ${description}`);
      return log;
    } catch (error) {
      log.status = 'FAILED';
      this.transactionLogs.push(log);
      console.error('Transfer failed:', error);
      throw error;
    }
  }

  getTransactionLogs(): TransactionLog[] {
    return this.transactionLogs;
  }

  resetDemo() {
    this.userWallets.clear();
    this.transactionLogs = [];
    if (this.treasuryWallet) {
      this.treasuryWallet.balance = '20.00';
    }
    console.log('🔄 Demo reset');
  }
}

export const circleWalletService = new CircleWalletService();
