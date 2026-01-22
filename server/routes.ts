import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, getDemoTreasuryBalance, setDemoTreasuryBalance } from "./storage";
import { checkIntegrationStatus, getDeveloperWalletBalance, fundFromFaucet, resetDemoToTreasury, getAllWalletsWithBalances, runTestTransaction, createArcTestnetWallets } from "./lib/circle-wallets";
import { GATEWAY_CONFIG } from "./lib/x402-gateway";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get('/api/integrations/status', async (req, res) => {
    try {
      const circleStatus = await checkIntegrationStatus();
      const hasCloudsmithToken = !!process.env.CLOUDSMITH_TOKEN;
      
      res.json({
        circleWallets: {
          configured: circleStatus.hasApiKey,
          connected: circleStatus.wallets,
          status: circleStatus.wallets ? 'connected' : (circleStatus.hasApiKey ? 'pending' : 'not_configured')
        },
        x402Batching: {
          configured: hasCloudsmithToken,
          status: hasCloudsmithToken ? 'pending' : 'not_configured'
        },
        arcNetwork: {
          configured: true,
          chainId: GATEWAY_CONFIG.chainId,
          rpcUrl: GATEWAY_CONFIG.rpcUrl,
          status: 'connected'
        },
        viralTracking: {
          configured: false,
          status: 'pending',
          dependencies: ['circleWallets', 'x402Batching']
        }
      });
    } catch (error) {
      console.error('Integration status error:', error);
      res.status(500).json({ error: 'Failed to check integration status' });
    }
  });

  app.get('/api/wallet/balance', async (req, res) => {
    try {
      const wallet = await getDeveloperWalletBalance();
      if (wallet) {
        let balance = wallet.balance.available;
        
        // If real balance is non-zero, cache it for demo persistence
        if (parseFloat(balance) > 0) {
          setDemoTreasuryBalance(balance);
        } else {
          // Use cached balance if real balance is 0
          const cachedBalance = getDemoTreasuryBalance();
          if (parseFloat(cachedBalance) > 0) {
            balance = cachedBalance;
            console.log('[Demo] Using cached treasury balance:', balance);
          }
        }
        
        res.json({
          address: wallet.address,
          balance: balance,
          currency: wallet.balance.currency,
          blockchain: wallet.blockchain
        });
      } else {
        // Even without wallet, try cached balance
        const cachedBalance = getDemoTreasuryBalance();
        res.json({
          address: null,
          balance: cachedBalance,
          currency: 'USDC',
          blockchain: 'BASE-SEPOLIA',
          cached: true
        });
      }
    } catch (error) {
      console.error('Wallet balance error:', error);
      res.status(500).json({ error: 'Failed to fetch wallet balance' });
    }
  });

  // Manually set demo balance (for when Circle balance isn't updating)
  app.post('/api/wallet/set-balance', async (req, res) => {
    try {
      const { balance } = req.body;
      if (balance === undefined) {
        return res.status(400).json({ error: 'Balance required' });
      }
      setDemoTreasuryBalance(String(balance));
      console.log('[Demo] Manually set treasury balance to:', balance);
      res.json({ success: true, balance: String(balance) });
    } catch (error) {
      console.error('Set balance error:', error);
      res.status(500).json({ error: 'Failed to set balance' });
    }
  });

  app.post('/api/wallet/fund', async (req, res) => {
    try {
      const wallet = await getDeveloperWalletBalance();
      if (!wallet) {
        return res.status(400).json({ error: 'No wallet configured' });
      }
      
      console.log('[Faucet] Requesting funds for wallet:', wallet.address, 'on', wallet.blockchain);
      const success = await fundFromFaucet(wallet.address, wallet.blockchain);
      
      if (success) {
        res.json({ 
          success: true, 
          message: 'Faucet request submitted - funds should arrive shortly',
          address: wallet.address,
          blockchain: wallet.blockchain
        });
      } else {
        res.status(400).json({ 
          success: false, 
          error: 'Faucet request failed',
          faucetUrl: 'https://faucet.circle.com',
          note: 'You can manually fund the wallet at faucet.circle.com'
        });
      }
    } catch (error) {
      console.error('Faucet error:', error);
      res.status(500).json({ error: 'Failed to request faucet funds' });
    }
  });

  // Get all wallets with balances (for showing user wallets in UI)
  app.get('/api/wallets', async (req, res) => {
    try {
      const wallets = await getAllWalletsWithBalances();
      res.json({ wallets });
    } catch (error) {
      console.error('Get wallets error:', error);
      res.status(500).json({ error: 'Failed to fetch wallets' });
    }
  });

  // Run test transaction - transfer USDC from treasury to user wallets
  // Uses simulation mode when real transfers fail (e.g., no gas)
  app.post('/api/demo/test-transaction', async (req, res) => {
    try {
      console.log('[Demo] Running test transaction - sending rewards to users');
      const cachedBalance = getDemoTreasuryBalance();
      const result = await runTestTransaction(cachedBalance);
      
      if (result.success) {
        // Update cached balance
        setDemoTreasuryBalance(result.newTreasuryBalance);
        
        res.json({
          success: true,
          message: `Sent $${result.totalSent} USDC to ${result.transfers.length} recipients`,
          transfers: result.transfers,
          totalSent: result.totalSent,
          newTreasuryBalance: result.newTreasuryBalance,
          simulated: false
        });
      } else {
        // Simulation mode - show realistic demo flow when real transfers fail
        console.log('[Demo] Real transfer failed, using simulation mode');
        const totalSent = "5.00";
        const simulatedTransfers = [
          { to: "Manny (Creator)", amount: "3.00", status: "success", simulated: true },
          { to: "Pete (Sharer)", amount: "1.25", status: "success", simulated: true },
          { to: "Matt P (Platform)", amount: "0.75", status: "success", simulated: true }
        ];
        const currentBalance = parseFloat(cachedBalance) || 20;
        const newBalance = (currentBalance - parseFloat(totalSent)).toFixed(2);
        setDemoTreasuryBalance(newBalance);
        
        res.json({
          success: true,
          message: `[SIMULATED] Sent $${totalSent} USDC to 3 recipients`,
          transfers: simulatedTransfers,
          totalSent: totalSent,
          newTreasuryBalance: newBalance,
          simulated: true,
          note: "Simulation mode - needs testnet ETH for live transactions"
        });
      }
    } catch (error) {
      console.error('Test transaction error:', error);
      res.status(500).json({ error: 'Failed to run test transaction' });
    }
  });

  // Reset demo - transfer all user wallet USDC back to treasury
  app.post('/api/demo/reset', async (req, res) => {
    try {
      console.log('[Demo] Resetting demo - transferring funds back to treasury');
      const result = await resetDemoToTreasury();
      
      if (result.success) {
        res.json({
          success: true,
          message: `Recovered ${result.totalRecovered} USDC to treasury`,
          transfers: result.transfers,
          totalRecovered: result.totalRecovered
        });
      } else {
        res.json({
          success: false,
          message: 'No funds to recover or transfer failed',
          transfers: result.transfers
        });
      }
    } catch (error) {
      console.error('Demo reset error:', error);
      res.status(500).json({ error: 'Failed to reset demo' });
    }
  });

  // Create Arc testnet wallets for gasless USDC transfers
  app.post('/api/wallets/setup-arc', async (req, res) => {
    try {
      console.log('[Setup] Creating Arc testnet wallets for gasless transfers');
      const result = await createArcTestnetWallets();
      
      if (result.success) {
        res.json({
          success: true,
          message: `Created ${result.wallets.length} Arc testnet wallets`,
          wallets: result.wallets,
          faucetUrl: 'https://faucet.circle.com',
          note: 'Fund the Arc Treasury wallet from faucet.circle.com (select Arc Testnet)'
        });
      } else {
        res.json({
          success: false,
          error: result.error || 'Failed to create Arc wallets',
          wallets: result.wallets
        });
      }
    } catch (error) {
      console.error('Arc wallet setup error:', error);
      res.status(500).json({ error: 'Failed to create Arc wallets' });
    }
  });

  return httpServer;
}
