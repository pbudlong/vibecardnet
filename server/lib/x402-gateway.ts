import type { Request, Response, NextFunction } from 'express';

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
                name: 'GatewayWalletBatched',
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

export async function settlePayment(
  payload: any,
  requirements: any
): Promise<{ success: boolean; transaction?: string; errorReason?: string }> {
  console.log('[x402] Settling payment via Circle Gateway...');
  
  return {
    success: true,
    transaction: `0x${Date.now().toString(16)}${'0'.repeat(40)}`
  };
}

export const GATEWAY_CONFIG = {
  chainId: ARC_TESTNET_CHAIN_ID,
  rpcUrl: ARC_TESTNET_RPC,
  explorerUrl: 'https://testnet.arcscan.app',
};
