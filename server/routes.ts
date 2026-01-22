import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkIntegrationStatus, getDeveloperWalletBalance, fundFromFaucet, resetDemoToTreasury, getAllWalletsWithBalances, runTestTransaction, createArcTestnetWallets, generateNewEntitySecret } from "./lib/circle-wallets";
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
        // Real blockchain balance - no caching
        res.json({
          address: wallet.address,
          balance: wallet.balance.available,
          currency: wallet.balance.currency,
          blockchain: wallet.blockchain
        });
      } else {
        res.json({
          address: null,
          balance: '0',
          currency: 'USDC',
          blockchain: 'ARC-TESTNET',
          error: 'No wallet found'
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

  // Run test transaction - transfer REAL USDC from treasury to user wallets
  app.post('/api/demo/test-transaction', async (req, res) => {
    try {
      console.log('[Demo] Running REAL test transaction on Arc');
      const result = await runTestTransaction();
      
      if (result.success) {
        res.json({
          success: true,
          message: `Sent $${result.totalSent} USDC to ${result.transfers.length} recipients`,
          transfers: result.transfers,
          totalSent: result.totalSent,
          newTreasuryBalance: result.newTreasuryBalance,
          blockchain: result.blockchain
        });
      } else {
        res.json({
          success: false,
          message: 'Transfer failed - check treasury balance',
          transfers: result.transfers,
          newTreasuryBalance: result.newTreasuryBalance
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
      console.log('[Demo] Resetting - transferring REAL funds back to treasury');
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

  // Generate a new entity secret for Circle SDK
  // User needs to copy this and register it at console.circle.com
  app.get('/api/circle/generate-entity-secret', (req, res) => {
    const newSecret = generateNewEntitySecret();
    res.json({
      entitySecret: newSecret,
      instructions: [
        '1. Copy this 64-character hex string',
        '2. Go to console.circle.com/wallets/dev/configurator',
        '3. Click "Register New Entity Secret"',
        '4. Paste the secret and download the recovery file',
        '5. Add the secret to CIRCLE_ENTITY_SECRET in your Replit secrets'
      ],
      note: 'This is a 32-byte (256-bit) hex-encoded secret. Keep it safe!'
    });
  });

  return httpServer;
}
