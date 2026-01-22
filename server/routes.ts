import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, getDemoTreasuryBalance, setDemoTreasuryBalance } from "./storage";
import { checkIntegrationStatus, getDeveloperWalletBalance, fundFromFaucet } from "./lib/circle-wallets";
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

  return httpServer;
}
