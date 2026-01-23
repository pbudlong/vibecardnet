import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkIntegrationStatus, getDeveloperWalletBalance, fundFromFaucet, getAllWalletsWithBalances, createArcTestnetWallets, generateNewEntitySecret, getTransactionStatus, getArcWallets, getArcUsdcBalanceBaseUnits, transferUSDCExact } from "./lib/circle-wallets";
import { GATEWAY_CONFIG, executeX402Payment, createViralRewardSplits } from "./lib/x402-gateway";

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
          configured: true,
          status: 'connected'
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

  // Run test transaction via x402 - transfer REAL USDC from treasury to user wallets
  app.post('/api/demo/test-transaction', async (req, res) => {
    try {
      console.log('[Demo] Running x402 test transaction on Arc');
      const { treasury, users } = await getArcWallets();
      
      if (!treasury) {
        return res.status(400).json({ error: 'No Arc treasury wallet found' });
      }
      
      if (users.length === 0) {
        return res.status(400).json({ error: 'No Arc user wallets found' });
      }

      const totalAmount = 1.00;
      const splits = [
        { recipient: users[0].address, recipientWalletId: users[0].id, amount: '0.60', role: 'creator' },
        { recipient: users[1]?.address || users[0].address, recipientWalletId: users[1]?.id || users[0].id, amount: '0.25', role: 'upstream' },
        { recipient: users[2]?.address || users[0].address, recipientWalletId: users[2]?.id || users[0].id, amount: '0.15', role: 'actor' },
      ].filter(s => s.recipient);

      const result = await executeX402Payment({
        totalAmount: totalAmount.toFixed(2),
        splits,
        sourceWalletId: treasury.id,
        reason: 'x402 Viral Reward Demo'
      });

      // Get updated treasury balance and calculate gas cost
      const { treasury: updatedTreasury } = await getArcWallets();
      const newBalance = parseFloat(updatedTreasury?.balance || '0');
      const expectedBalance = parseFloat(treasury.balance) - parseFloat(result.totalPaid);
      const gasCost = Math.max(0, expectedBalance - newBalance).toFixed(2);
      
      res.json({
        success: result.success,
        message: `x402 sent $${result.totalPaid} USDC to ${result.transfers.length} recipients`,
        transfers: result.transfers,
        totalSent: result.totalPaid,
        gasCost,
        newTreasuryBalance: updatedTreasury?.balance || '0',
        blockchain: 'ARC-TESTNET',
        x402Version: 2
      });
    } catch (error) {
      console.error('Test transaction error:', error);
      res.status(500).json({ error: 'Failed to run test transaction' });
    }
  });

  // Reset demo via x402 - transfer all user wallet USDC back to treasury using EXACT balances
  app.post('/api/demo/reset', async (req, res) => {
    try {
      console.log('[Demo] Resetting via x402 - transferring REAL funds back to treasury (EXACT BALANCE)');
      const { treasury, users } = await getArcWallets();
      
      if (!treasury) {
        return res.status(400).json({ error: 'No Arc treasury wallet found' });
      }

      // Get EXACT balance in base units for each user wallet
      // Subtract larger gas buffer since USDC is gas on Arc and transfer also costs gas
      // 0.10 USDC = 100000 base units - enough for gas + transfer fee
      const GAS_BUFFER = BigInt(100000); // 0.10 USDC for gas
      
      const usersWithExactBalance = await Promise.all(users.map(async (user) => {
        const exactBalanceRaw = await getArcUsdcBalanceBaseUnits(user.address);
        const rawBalance = BigInt(exactBalanceRaw);
        // Subtract gas buffer, but ensure we don't go negative
        const transferBalance = rawBalance > GAS_BUFFER ? (rawBalance - GAS_BUFFER).toString() : '0';
        return {
          ...user,
          exactBalance: transferBalance,
          displayBalance: (Number(transferBalance) / 1_000_000).toFixed(2)
        };
      }));

      const usersWithBalance = usersWithExactBalance.filter(u => Number(u.exactBalance) > 0);
      
      if (usersWithBalance.length === 0) {
        return res.json({
          success: true,
          message: 'No funds to recover - user wallets are empty',
          transfers: [],
          totalRecovered: '0.00'
        });
      }

      // Transfer in SMALL CHUNKS ($1 max per transfer) to avoid Arc transfer limit issues
      const MAX_CHUNK_BASE_UNITS = BigInt(1_000_000); // $1.00 max per transfer
      const transfers: Array<{ from: string; amount: string; status: string; txId?: string; error?: string }> = [];
      let totalRecoveredBaseUnits = BigInt(0);

      for (const user of usersWithBalance) {
        let remainingBalance = BigInt(user.exactBalance);
        console.log(`[x402 Reset] Recovering $${user.displayBalance} from ${user.name} in chunks`);
        
        while (remainingBalance > BigInt(0)) {
          // Transfer min of remaining balance or max chunk size
          const chunkAmount = remainingBalance > MAX_CHUNK_BASE_UNITS ? MAX_CHUNK_BASE_UNITS : remainingBalance;
          const chunkDisplay = (Number(chunkAmount) / 1_000_000).toFixed(2);
          
          console.log(`[x402 Reset] Chunk transfer: $${chunkDisplay} from ${user.name}`);
          
          const result = await transferUSDCExact(
            user.id,
            treasury.address,
            chunkAmount.toString(),
            'ARC-TESTNET'
          );

          if (result.success) {
            totalRecoveredBaseUnits += chunkAmount;
            remainingBalance -= chunkAmount;
            
            // Only record final transfer for this user
            if (remainingBalance <= BigInt(0)) {
              transfers.push({
                from: user.name,
                amount: user.displayBalance,
                status: 'success',
                txId: result.txId
              });
            }
            
            // Wait for blockchain confirmation between chunks
            await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
            transfers.push({
              from: user.name,
              amount: user.displayBalance,
              status: 'partial',
              error: result.error
            });
            break; // Stop trying for this user
          }
        }
      }

      const totalRecovered = (Number(totalRecoveredBaseUnits) / 1_000_000).toFixed(2);
      // Gas buffer is $0.10 per wallet that had funds
      const totalGasReserved = (usersWithBalance.length * 0.10).toFixed(2);

      // Wait for final transactions to confirm on blockchain before returning
      // Arc blockchain takes ~15s to confirm, so wait 20s to be safe
      if (transfers.some(t => t.status === 'success')) {
        console.log('[x402 Reset] Waiting 20s for Arc blockchain confirmations...');
        await new Promise(resolve => setTimeout(resolve, 20000));
      }

      // Fetch updated treasury balance
      const updatedWallets = await getArcWallets();
      const newTreasuryBalance = updatedWallets.treasury?.balance || '0';
      console.log(`[x402 Reset] New treasury balance: $${newTreasuryBalance}`);

      res.json({
        success: transfers.some(t => t.status === 'success'),
        message: `x402 recovered $${totalRecovered} USDC to treasury (exact balance)`,
        transfers,
        totalRecovered,
        totalGasReserved,
        newTreasuryBalance,
        x402Version: 2
      });
    } catch (error) {
      console.error('Demo reset error:', error);
      res.status(500).json({ error: 'Failed to reset demo' });
    }
  });

  // x402 Payment Trigger - Execute atomic multi-party payment splits
  app.post('/api/x402/pay', async (req, res) => {
    try {
      const { totalAmount, splits, sourceWalletId, reason } = req.body;
      
      if (!totalAmount || !splits || !sourceWalletId) {
        return res.status(400).json({ 
          error: 'Missing required fields: totalAmount, splits, sourceWalletId' 
        });
      }

      console.log(`[x402] Payment request: $${totalAmount} with ${splits.length} splits`);
      
      const result = await executeX402Payment({
        totalAmount,
        splits,
        sourceWalletId,
        reason: reason || 'Viral reward payment'
      });

      res.json({
        x402Version: 2,
        paymentType: 'atomic-split',
        blockchain: 'ARC-TESTNET',
        ...result
      });
    } catch (error) {
      console.error('x402 payment error:', error);
      res.status(500).json({ error: 'x402 payment execution failed' });
    }
  });

  // Check transaction status
  app.get('/api/transaction/:txId', async (req, res) => {
    try {
      const { txId } = req.params;
      const status = await getTransactionStatus(txId);
      res.json(status);
    } catch (error) {
      console.error('Transaction status error:', error);
      res.status(500).json({ error: 'Failed to get transaction status' });
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
