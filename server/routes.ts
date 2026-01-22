import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkIntegrationStatus, getDeveloperWalletBalance } from "./lib/circle-wallets";
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
          blockchain: 'ARC',
          error: 'Wallet not configured or not accessible'
        });
      }
    } catch (error) {
      console.error('Wallet balance error:', error);
      res.status(500).json({ error: 'Failed to fetch wallet balance' });
    }
  });

  return httpServer;
}
