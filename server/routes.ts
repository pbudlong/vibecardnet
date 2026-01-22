import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { circleWalletService } from "./services/circleWalletService";
import { viralTrackingService } from "./services/viralTrackingService";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Circle wallet service
  await circleWalletService.initialize();

  // === DEMO API ROUTES ===

  // Initialize demo - creates treasury wallet
  app.post("/api/demo/init", async (req: Request, res: Response) => {
    try {
      const treasury = await circleWalletService.createTreasuryWallet();
      viralTrackingService.reset();
      res.json({ 
        success: true, 
        treasury,
        message: 'Demo initialized with treasury wallet' 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create content (first action in viral chain)
  app.post("/api/demo/create", async (req: Request, res: Response) => {
    try {
      const { creatorName } = req.body;
      if (!creatorName) {
        return res.status(400).json({ success: false, error: 'creatorName required' });
      }

      // Create wallet for creator
      const wallet = await circleWalletService.createUserWallet(creatorName);
      
      // Record content creation
      const action = viralTrackingService.createContent(creatorName, wallet.address);

      res.json({ 
        success: true, 
        action,
        wallet,
        message: `Content created by ${creatorName}` 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Remix content
  app.post("/api/demo/remix", async (req: Request, res: Response) => {
    try {
      const { actorName, upstreamActionId } = req.body;
      if (!actorName || !upstreamActionId) {
        return res.status(400).json({ success: false, error: 'actorName and upstreamActionId required' });
      }

      // Create wallet for remixer
      const wallet = await circleWalletService.createUserWallet(actorName);
      
      // Record remix
      const action = viralTrackingService.recordAction('remix', actorName, upstreamActionId, wallet.address);

      if (!action) {
        return res.status(400).json({ success: false, error: 'Invalid upstream action' });
      }

      res.json({ 
        success: true, 
        action,
        wallet,
        message: `${actorName} remixed the content` 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Share content
  app.post("/api/demo/share", async (req: Request, res: Response) => {
    try {
      const { actorName, upstreamActionId } = req.body;
      if (!actorName || !upstreamActionId) {
        return res.status(400).json({ success: false, error: 'actorName and upstreamActionId required' });
      }

      // Create wallet for sharer
      const wallet = await circleWalletService.createUserWallet(actorName);
      
      // Record share
      const action = viralTrackingService.recordAction('share', actorName, upstreamActionId, wallet.address);

      if (!action) {
        return res.status(400).json({ success: false, error: 'Invalid upstream action' });
      }

      res.json({ 
        success: true, 
        action,
        wallet,
        message: `${actorName} shared the content` 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Convert (triggers payout)
  app.post("/api/demo/convert", async (req: Request, res: Response) => {
    try {
      const { actorName, upstreamActionId } = req.body;
      if (!actorName || !upstreamActionId) {
        return res.status(400).json({ success: false, error: 'actorName and upstreamActionId required' });
      }

      // Create wallet for converter
      const wallet = await circleWalletService.createUserWallet(actorName);
      
      // Record conversion
      const action = viralTrackingService.recordAction('convert', actorName, upstreamActionId, wallet.address);

      if (!action) {
        return res.status(400).json({ success: false, error: 'Invalid upstream action' });
      }

      // Calculate reward splits
      const splits = viralTrackingService.calculateRewardSplits(action.id);

      // Execute payouts from treasury
      const wallets = await circleWalletService.getAllWallets();
      const treasury = wallets.treasury;
      
      if (!treasury) {
        return res.status(500).json({ success: false, error: 'Treasury not initialized' });
      }

      const payouts = [];
      for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        if (split.recipientAddress) {
          try {
            const tx = await circleWalletService.transferUSDC(
              treasury.id,
              split.recipientAddress,
              split.amount,
              `${split.role} reward to ${split.recipient}`
            );
            payouts.push({ ...split, transaction: tx });
          } catch (err: any) {
            console.error(`Payout failed for ${split.recipient}:`, err.message);
            payouts.push({ ...split, error: err.message });
          }
        }
      }

      res.json({ 
        success: true, 
        action,
        wallet,
        splits,
        payouts,
        message: `Conversion by ${actorName} - rewards distributed!` 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update settings (conversion value, decay rate)
  app.post("/api/demo/settings", async (req: Request, res: Response) => {
    try {
      const { conversionValue, decayRate } = req.body;
      
      if (conversionValue !== undefined) {
        viralTrackingService.setConversionValue(conversionValue);
      }
      if (decayRate !== undefined) {
        viralTrackingService.setDecayFactor(decayRate);
      }
      
      const settings = viralTrackingService.getSettings();
      res.json({ success: true, settings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get current settings
  app.get("/api/demo/settings", async (req: Request, res: Response) => {
    try {
      const settings = viralTrackingService.getSettings();
      res.json({ success: true, settings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all viral chains
  app.get("/api/demo/chains", async (req: Request, res: Response) => {
    try {
      const chains = viralTrackingService.getAllChains();
      const markmap = viralTrackingService.getMarkmapData();
      res.json({ success: true, chains, markmap });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all wallets with balances
  app.get("/api/demo/wallets", async (req: Request, res: Response) => {
    try {
      const wallets = await circleWalletService.getAllWallets();
      res.json({ success: true, ...wallets });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get transaction logs
  app.get("/api/demo/transactions", async (req: Request, res: Response) => {
    try {
      const logs = circleWalletService.getTransactionLogs();
      res.json({ success: true, transactions: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Reset demo
  app.post("/api/demo/reset", async (req: Request, res: Response) => {
    try {
      circleWalletService.resetDemo();
      viralTrackingService.reset();
      res.json({ success: true, message: 'Demo reset' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return httpServer;
}
