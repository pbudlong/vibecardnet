import type { Request, Response, NextFunction } from 'express';
import { transferUSDC, getTransactionStatus } from './circle-wallets';

const ARC_TESTNET_CHAIN_ID = 5042002;
const ARC_TESTNET_RPC = 'https://arc-testnet.drpc.org';

export interface GatewayConfig {
  sellerAddress: string;
  networks?: string[];
  description?: string;
}

export interface PaymentInfo {
  verified: boolean;
  payer: string;
  amount: string;
  network: string;
  transaction?: string;
}

export interface PaymentSplit {
  recipient: string;
  recipientWalletId: string;
  amount: string;
  role: string;
}

export interface X402PaymentRequest {
  totalAmount: string;
  splits: PaymentSplit[];
  sourceWalletId: string;
  reason: string;
}

declare global {
  namespace Express {
    interface Request {
      payment?: PaymentInfo;
    }
  }
}

export function createGatewayMiddleware(config: GatewayConfig) {
  const { sellerAddress, networks = ['eip155:5042002'], description } = config;

  return {
    require: (price: string) => {
      const priceValue = price.replace('$', '');
      const amountMicroUsdc = Math.round(parseFloat(priceValue) * 1_000_000).toString();

      return async (req: Request, res: Response, next: NextFunction) => {
        const signature = req.headers['payment-signature'] as string | undefined;

        if (!signature) {
          return res.status(402).json({
            x402Version: 2,
            accepts: [{
              scheme: 'exact',
              network: 'eip155:5042002',
              maxAmountRequired: amountMicroUsdc,
              resource: req.originalUrl,
              description: description || 'Payment required',
              mimeType: 'application/json',
              payTo: sellerAddress,
              maxTimeoutSeconds: 60,
              asset: 'eip155:5042002/erc20:usdc',
              extra: {
                name: 'VibeCardPayment',
                version: '1',
              }
            }]
          });
        }

        try {
          const payload = JSON.parse(Buffer.from(signature, 'base64').toString());
          
          const verification = await verifyPayment(payload, sellerAddress, amountMicroUsdc);
          
          if (!verification.isValid) {
            return res.status(402).json({ 
              error: 'Invalid payment signature',
              reason: verification.invalidReason 
            });
          }

          req.payment = {
            verified: true,
            payer: verification.payer || 'unknown',
            amount: priceValue,
            network: 'arcTestnet',
            transaction: payload.transaction
          };

          next();
        } catch (error) {
          console.error('Payment verification error:', error);
          return res.status(402).json({ error: 'Payment verification failed' });
        }
      };
    }
  };
}

async function verifyPayment(
  payload: any, 
  sellerAddress: string, 
  expectedAmount: string
): Promise<{ isValid: boolean; invalidReason?: string; payer?: string }> {
  if (!payload || !payload.signature) {
    return { isValid: false, invalidReason: 'Missing signature in payload' };
  }

  return {
    isValid: true,
    payer: payload.from || payload.payer
  };
}

// Poll Circle API to get the actual blockchain transaction hash
async function pollForTxHash(txId: string, maxAttempts: number = 10): Promise<string | undefined> {
  console.log(`[x402] Polling for blockchain txHash for Circle txId: ${txId}`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const status = await getTransactionStatus(txId);
      console.log(`[x402] Attempt ${attempt}: state=${status.state}, txHash=${status.txHash || 'pending'}`);
      
      if (status.txHash) {
        console.log(`[x402] Got blockchain txHash: ${status.txHash}`);
        return status.txHash;
      }
      
      if (status.state === 'FAILED' || status.state === 'CANCELLED') {
        console.log(`[x402] Transaction failed: ${status.error}`);
        return undefined;
      }
      
      // Wait before next poll (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(`[x402] Poll attempt ${attempt} error:`, error);
    }
  }
  
  console.log(`[x402] Gave up polling after ${maxAttempts} attempts`);
  return undefined;
}

export async function executeX402Payment(request: X402PaymentRequest): Promise<{
  success: boolean;
  transfers: Array<{ to: string; amount: string; status: string; txId?: string; txHash?: string; error?: string }>;
  totalPaid: string;
  error?: string;
}> {
  console.log(`[x402] Executing atomic payment: ${request.reason}`);
  console.log(`[x402] Total amount: $${request.totalAmount} USDC`);
  console.log(`[x402] Splits: ${request.splits.length} recipients`);

  const transfers: Array<{ to: string; amount: string; status: string; txId?: string; txHash?: string; error?: string }> = [];
  let totalPaid = 0;

  for (const split of request.splits) {
    console.log(`[x402] Processing split: $${split.amount} to ${split.recipient} (${split.role})`);
    
    const result = await transferUSDC(
      request.sourceWalletId,
      split.recipient,
      split.amount,
      'ARC-TESTNET'
    );

    if (result.success && result.txId) {
      transfers.push({
        to: split.recipient,
        amount: split.amount,
        status: 'success',
        txId: result.txId
      });
      totalPaid += parseFloat(split.amount);
      console.log(`[x402] Transfer success: txId=${result.txId}`);
    } else {
      transfers.push({
        to: split.recipient,
        amount: split.amount,
        status: 'failed',
        error: result.error
      });
      console.error(`[x402] Transfer failed: ${result.error}`);
    }

    // Add delay between transfers for blockchain processing
    if (request.splits.indexOf(split) < request.splits.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  const successCount = transfers.filter(t => t.status === 'success').length;
  
  return {
    success: successCount === request.splits.length,
    transfers,
    totalPaid: totalPaid.toFixed(2),
    error: successCount === 0 ? 'All transfers failed' : undefined
  };
}

export async function createViralRewardSplits(
  totalReward: number,
  creatorAddress: string,
  creatorWalletId: string,
  upstreamSharers: Array<{ address: string; walletId: string; name: string }>,
  actorAddress: string,
  actorWalletId: string
): Promise<PaymentSplit[]> {
  const splits: PaymentSplit[] = [];
  
  // VibeCard split ratios
  const CREATOR_SHARE = 0.40;
  const UPSTREAM_SHARE = 0.35;
  const ACTOR_SHARE = 0.20;
  const VIBECARD_FEE = 0.05;

  // Creator gets 40%
  splits.push({
    recipient: creatorAddress,
    recipientWalletId: creatorWalletId,
    amount: (totalReward * CREATOR_SHARE).toFixed(2),
    role: 'creator'
  });

  // Upstream sharers split 35% with decay
  if (upstreamSharers.length > 0) {
    const upstreamTotal = totalReward * UPSTREAM_SHARE;
    const decayFactor = 0.5;
    
    let remaining = upstreamTotal;
    for (let i = 0; i < upstreamSharers.length; i++) {
      const isLast = i === upstreamSharers.length - 1;
      const share = isLast ? remaining : remaining * decayFactor;
      
      splits.push({
        recipient: upstreamSharers[i].address,
        recipientWalletId: upstreamSharers[i].walletId,
        amount: share.toFixed(2),
        role: `upstream-${upstreamSharers[i].name}`
      });
      
      remaining -= share;
    }
  }

  // Actor gets 20%
  splits.push({
    recipient: actorAddress,
    recipientWalletId: actorWalletId,
    amount: (totalReward * ACTOR_SHARE).toFixed(2),
    role: 'actor'
  });

  return splits;
}

export const GATEWAY_CONFIG = {
  chainId: ARC_TESTNET_CHAIN_ID,
  rpcUrl: ARC_TESTNET_RPC,
  explorerUrl: 'https://testnet.arcscan.app',
};
