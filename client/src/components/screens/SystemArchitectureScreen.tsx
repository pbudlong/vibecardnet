import { motion } from "framer-motion";
import { ArrowRight, Wallet, GitBranch, Zap, CreditCard } from "lucide-react";
import { SiStripe } from "react-icons/si";
import { Card } from "@/components/ui/card";

export function SystemArchitectureScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          VibeCard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          End-to-end payment flow from reward pool funding to participant issuance of VibeCard
        </p>
      </motion.div>

      {/* Horizontal Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl"
      >
        <div className="flex items-center justify-center gap-3">
          {/* Step 1: Stripe */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="p-4 w-36 text-center">
              <SiStripe className="h-8 w-8 mx-auto mb-2 text-[#635BFF]" />
              <p className="text-xs font-medium text-foreground">Stripe</p>
              <p className="text-[10px] text-muted-foreground whitespace-nowrap">Platform/Content Owner</p>
            </Card>
          </motion.div>

          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Step 2: Circle Mint (In) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="p-4 w-32 text-center border-sky-400/50">
              <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-sky-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">◎</span>
              </div>
              <p className="text-xs font-medium text-foreground">Circle Mint</p>
              <p className="text-[10px] text-muted-foreground">Fiat → USDC</p>
            </Card>
          </motion.div>

          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Step 3: VibeCard Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-4 border-2 border-primary bg-primary/5">
              <p className="text-sm font-bold text-primary text-center mb-3">VibeCard Network Core</p>
              <div className="flex flex-col gap-2">
                {/* Top row - Reward Pool */}
                <div className="flex justify-center">
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36">
                    <Wallet className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">Reward Pool</p>
                    <p className="text-[8px] text-muted-foreground">USDC Treasury</p>
                  </div>
                </div>
                
                {/* Middle row - Parallel: Viral Chain & x402 */}
                <div className="flex gap-2 justify-center">
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-28">
                    <GitBranch className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">Viral Chain</p>
                    <p className="text-[8px] text-muted-foreground">Attribution</p>
                  </div>
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-28">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">x402 Splits</p>
                    <p className="text-[8px] text-muted-foreground">Atomic Payouts</p>
                  </div>
                </div>

                {/* Bottom row - Circle Embedded Wallets */}
                <div className="flex justify-center">
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36 border-sky-400/30">
                    <div className="h-4 w-4 mx-auto mb-1 rounded-full bg-sky-400 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">◎</span>
                    </div>
                    <p className="text-[10px] font-medium">Embedded Wallets</p>
                    <p className="text-[8px] text-muted-foreground">Participant Custody</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Step 4: Circle Mint (Out) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card className="p-4 w-32 text-center border-sky-400/50">
              <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-sky-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">◎</span>
              </div>
              <p className="text-xs font-medium text-foreground">Circle Mint</p>
              <p className="text-[10px] text-muted-foreground">USDC → Fiat</p>
            </Card>
          </motion.div>

          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Step 5: Stripe or Lithic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Card className="p-4 w-32 text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-[#635BFF]" />
              <p className="text-xs font-medium text-foreground">Stripe or Lithic</p>
              <p className="text-[10px] text-muted-foreground">VibeCard member</p>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 flex gap-6 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#635BFF]" />
          <span>Fiat Rails</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-sky-400" />
          <span>Circle / USDC</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>VibeCard</span>
        </div>
      </motion.div>
    </div>
  );
}
