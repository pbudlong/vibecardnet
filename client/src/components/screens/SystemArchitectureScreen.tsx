import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, CreditCard } from "lucide-react";
import { SiStripe } from "react-icons/si";
import { Card } from "@/components/ui/card";

export function SystemArchitectureScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-4 py-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          System Architecture
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          End-to-end payment flow from reward pool funding to VibeCard spending
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl"
      >
        <div className="flex justify-center items-stretch gap-4">
          {/* Left Column - Funding In (Stacked) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Card className="p-3 w-28 text-center">
              <SiStripe className="h-6 w-6 mx-auto mb-1 text-[#635BFF]" />
              <p className="text-[10px] font-medium text-foreground">Stripe</p>
              <p className="text-[8px] text-muted-foreground">Fiat In</p>
            </Card>
            
            <ArrowDown className="h-3 w-3 text-muted-foreground" />
            
            <Card className="p-3 w-28 text-center border-sky-400/50">
              <div className="h-6 w-6 mx-auto mb-1 rounded-full bg-sky-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">◎</span>
              </div>
              <p className="text-[10px] font-medium text-foreground">Circle Mint</p>
              <p className="text-[8px] text-muted-foreground">USD → USDC</p>
            </Card>

            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-0" />
          </motion.div>

          {/* Center - VibeCard Onchain Core (ASCII-style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 max-w-xl"
          >
            <div className="relative">
              <Card className="p-4 border-2 border-primary bg-primary/5 font-mono text-[9px] leading-tight">
                <div className="text-center text-primary font-bold mb-2 text-[10px]">VibeCard Onchain Core — Build Scope for ACOA Hackathon</div>
                
                {/* AI Creator's App */}
                <div className="flex justify-center mb-1">
                  <div className="border border-foreground/40 px-3 py-1 text-center">
                    <div className="font-semibold">AI CREATOR'S</div>
                    <div>APP / ARTIFACT</div>
                  </div>
                </div>
                <div className="text-center text-foreground/60">│</div>
                <div className="text-center text-foreground/60">┌──────────┼──────────┐</div>
                <div className="text-center text-foreground/60">│{"          "}│{"          "}│</div>
                <div className="text-center text-foreground/60">▼{"          "}▼{"          "}▼</div>
                
                {/* Three modules */}
                <div className="flex justify-center gap-2 mb-1">
                  <div className="border border-foreground/40 px-2 py-1 text-center text-[8px]">
                    <div>Share</div>
                    <div>Button</div>
                    <div className="text-muted-foreground">(visual)</div>
                  </div>
                  <div className="border border-foreground/40 px-2 py-1 text-center text-[8px]">
                    <div>Conversion</div>
                    <div>Tracking</div>
                    <div className="text-muted-foreground">(signup,</div>
                    <div className="text-muted-foreground">purchase)</div>
                  </div>
                  <div className="border border-foreground/40 px-2 py-1 text-center text-[8px]">
                    <div>Reward</div>
                    <div>Status API</div>
                    <div className="text-muted-foreground">(budget,</div>
                    <div className="text-muted-foreground">trending)</div>
                  </div>
                </div>
                
                <div className="text-center text-foreground/60">│{"          "}│{"          "}│</div>
                <div className="text-center text-foreground/60">└──────────┼──────────┘</div>
                <div className="text-center text-foreground/60">│ Events</div>
                <div className="text-center text-foreground/60">▼</div>
                
                {/* VibeCard Backend */}
                <div className="border border-foreground/40 mx-4 p-2 mb-1">
                  <div className="text-center font-semibold mb-1">VIBECARD BACKEND</div>
                  <div className="flex justify-center items-center gap-1 text-[8px]">
                    <div className="border border-foreground/30 px-1.5 py-0.5">
                      <div>Event</div>
                      <div>Processor</div>
                    </div>
                    <span>─▶</span>
                    <div className="border border-foreground/30 px-1.5 py-0.5">
                      <div>Reward</div>
                      <div>Calculator</div>
                    </div>
                    <span>─▶</span>
                    <div className="border border-foreground/30 px-1.5 py-0.5">
                      <div>x402 Payment</div>
                      <div>Trigger</div>
                    </div>
                  </div>
                  <div className="text-center text-foreground/60 mt-1">│</div>
                  <div className="text-center text-foreground/60">▼</div>
                  <div className="flex justify-center">
                    <div className="border border-foreground/30 px-2 py-0.5 text-[8px]">
                      <div>Conversion Attribution</div>
                      <div className="text-muted-foreground">(tracks CAC)</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-foreground/60">│</div>
                <div className="text-center text-foreground/60">▼</div>
                
                {/* Circle Batching SDK */}
                <div className="flex justify-center mb-1">
                  <div className="border border-sky-400/60 px-4 py-1 text-center">
                    <div className="font-semibold text-sky-400">Circle Batching SDK</div>
                    <div className="text-muted-foreground">(x402 atomic splits)</div>
                  </div>
                </div>
                
                <div className="text-center text-foreground/60">│</div>
                <div className="text-center text-foreground/60">┌──────────┼──────────┐</div>
                <div className="text-center text-foreground/60">│{"          "}│{"          "}│</div>
                <div className="text-center text-foreground/60">▼{"          "}▼{"          "}▼</div>
                
                {/* Wallets */}
                <div className="flex justify-center gap-2 mb-1">
                  <div className="border border-sky-400/40 px-2 py-1 text-center text-[8px]">
                    <div>Creator</div>
                    <div>Wallet</div>
                  </div>
                  <div className="border border-sky-400/40 px-2 py-1 text-center text-[8px]">
                    <div>Sharer</div>
                    <div>Wallet</div>
                  </div>
                  <div className="border border-sky-400/40 px-2 py-1 text-center text-[8px]">
                    <div>Actor</div>
                    <div>Wallet</div>
                  </div>
                </div>
                <div className="text-center text-sky-400 text-[8px] mb-1">Circle Non-custodial Wallets</div>
                
                <div className="text-center text-foreground/60">│{"          "}│{"          "}│</div>
                <div className="text-center text-foreground/60">└──────────┼──────────┘</div>
                <div className="text-center text-foreground/60">│</div>
                <div className="text-center text-foreground/60">▼</div>
                
                {/* Arc Blockchain */}
                <div className="flex justify-center">
                  <div className="border border-primary px-4 py-1 text-center bg-primary/10">
                    <div className="font-semibold text-primary">ARC BLOCKCHAIN</div>
                    <div className="text-muted-foreground">(USDC Settlement)</div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Right Column - Payout Out (Stacked) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-2"
          >
            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-0" />

            <Card className="p-3 w-28 text-center border-sky-400/50">
              <div className="h-6 w-6 mx-auto mb-1 rounded-full bg-sky-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">◎</span>
              </div>
              <p className="text-[10px] font-medium text-foreground">Circle Mint</p>
              <p className="text-[8px] text-muted-foreground">USDC → USD</p>
            </Card>

            <ArrowDown className="h-3 w-3 text-muted-foreground" />

            <Card className="p-3 w-28 text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-1 text-[#635BFF]" />
              <p className="text-[10px] font-medium text-foreground">Stripe Issue</p>
              <p className="text-[8px] text-muted-foreground">VibeCard</p>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-4 flex gap-4 text-[10px] text-muted-foreground"
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#635BFF]" />
          <span>Fiat Rails</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <span>Circle/USDC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span>VibeCard Core</span>
        </div>
      </motion.div>
    </div>
  );
}
