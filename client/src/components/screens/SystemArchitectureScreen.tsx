import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Wallet, GitBranch, Zap, CreditCard, Share2, Target, BarChart3, Cpu, Calculator, Send } from "lucide-react";
import { SiStripe } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

          {/* Center - VibeCard Onchain Core (Expanded) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 max-w-lg"
          >
            <div className="relative">
              <Badge 
                variant="outline" 
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-background border-primary/50 text-primary whitespace-nowrap z-10 px-2 py-0.5"
              >
                ACOA Hackathon Build Scope
              </Badge>
              <Card className="p-3 border-2 border-primary bg-primary/5">
                <p className="text-xs font-bold text-primary text-center mb-2">VibeCard Onchain Core</p>
                
                {/* Snippet Integration Layer */}
                <div className="flex justify-center gap-2 mb-2">
                  <div className="bg-card border rounded px-2 py-1 text-center flex-1">
                    <Share2 className="h-3 w-3 mx-auto mb-0.5 text-primary" />
                    <p className="text-[8px] font-medium">Share Button</p>
                  </div>
                  <div className="bg-card border rounded px-2 py-1 text-center flex-1">
                    <Target className="h-3 w-3 mx-auto mb-0.5 text-primary" />
                    <p className="text-[8px] font-medium">Conversion</p>
                  </div>
                  <div className="bg-card border rounded px-2 py-1 text-center flex-1">
                    <BarChart3 className="h-3 w-3 mx-auto mb-0.5 text-primary" />
                    <p className="text-[8px] font-medium">Status API</p>
                  </div>
                </div>

                <ArrowDown className="h-3 w-3 mx-auto text-primary/60" />

                {/* VibeCard Backend */}
                <div className="bg-card/50 border border-primary/30 rounded p-2 my-1">
                  <p className="text-[8px] font-semibold text-primary text-center mb-1">VibeCard Backend</p>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center gap-1">
                      <div className="bg-background border rounded px-1.5 py-1 text-center">
                        <Cpu className="h-2.5 w-2.5 mx-auto mb-0.5 text-muted-foreground" />
                        <p className="text-[7px]">Event</p>
                      </div>
                      <ArrowRight className="h-2 w-2 text-primary/40" />
                      <div className="bg-background border rounded px-1.5 py-1 text-center">
                        <Calculator className="h-2.5 w-2.5 mx-auto mb-0.5 text-muted-foreground" />
                        <p className="text-[7px]">Reward</p>
                      </div>
                      <ArrowRight className="h-2 w-2 text-primary/40" />
                      <div className="bg-background border rounded px-1.5 py-1 text-center">
                        <Send className="h-2.5 w-2.5 mx-auto mb-0.5 text-muted-foreground" />
                        <p className="text-[7px]">x402</p>
                      </div>
                    </div>
                    <div className="bg-background border rounded px-2 py-0.5 text-center">
                      <p className="text-[7px] text-muted-foreground">Conversion Attribution</p>
                    </div>
                  </div>
                </div>

                <ArrowDown className="h-3 w-3 mx-auto text-primary/60" />

                {/* Circle Embedded Wallets - Reward Pool */}
                <div className="bg-card border border-sky-400/50 rounded px-2 py-1.5 text-center mb-1">
                  <Wallet className="h-3 w-3 mx-auto mb-0.5 text-sky-400" />
                  <p className="text-[9px] font-medium">Reward Pool</p>
                  <p className="text-[7px] text-sky-400">Circle Embedded Wallets</p>
                </div>

                <ArrowDown className="h-3 w-3 mx-auto text-primary/60" />

                {/* Circle Batching SDK */}
                <div className="bg-card border border-sky-400/50 rounded px-2 py-1.5 text-center mb-1">
                  <Zap className="h-3 w-3 mx-auto mb-0.5 text-sky-400" />
                  <p className="text-[9px] font-medium">x402 Atomic Splits</p>
                  <p className="text-[7px] text-sky-400">Circle Batching SDK</p>
                </div>

                <ArrowDown className="h-3 w-3 mx-auto text-primary/60" />

                {/* Circle Non-custodial Wallets - User Payouts */}
                <div className="flex justify-center gap-2 mb-1">
                  <div className="bg-card border border-sky-400/30 rounded px-2 py-1 text-center flex-1">
                    <p className="text-[8px] font-medium">Creator</p>
                    <p className="text-[7px] text-emerald-500">40%</p>
                  </div>
                  <div className="bg-card border border-sky-400/30 rounded px-2 py-1 text-center flex-1">
                    <p className="text-[8px] font-medium">Sharers</p>
                    <p className="text-[7px] text-emerald-500">30%</p>
                  </div>
                  <div className="bg-card border border-sky-400/30 rounded px-2 py-1 text-center flex-1">
                    <p className="text-[8px] font-medium">Actor</p>
                    <p className="text-[7px] text-emerald-500">24%</p>
                  </div>
                </div>
                <p className="text-[7px] text-sky-400 text-center mb-1">Circle Non-custodial Wallets</p>

                <ArrowDown className="h-3 w-3 mx-auto text-primary/60" />

                {/* Arc Blockchain */}
                <div className="bg-primary/10 border border-primary rounded px-2 py-1.5 text-center">
                  <GitBranch className="h-3 w-3 mx-auto mb-0.5 text-primary" />
                  <p className="text-[9px] font-medium text-primary">Arc Blockchain</p>
                  <p className="text-[7px] text-muted-foreground">USDC Settlement</p>
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
