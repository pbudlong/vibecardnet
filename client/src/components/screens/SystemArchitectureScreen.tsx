import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Wallet, GitBranch, Zap, CreditCard } from "lucide-react";
import { SiStripe } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          System Architecture
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
          End-to-end payment flow from reward pool funding to issuance of VibeCard
        </p>
      </motion.div>

      {/* Horizontal Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl"
      >
        <div className="flex justify-center gap-3">
          {/* Left Column - Input flow (aligned to Reward Pool) */}
          <div className="flex items-center gap-3 self-start mt-[42px]">
            {/* Step 1: Stripe */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="p-4 w-36 text-center">
                <SiStripe className="h-8 w-8 mx-auto mb-2 text-[#635BFF]" />
                <p className="text-xs font-medium text-foreground">Stripe Payments</p>
                <p className="text-[10px] text-muted-foreground text-center whitespace-nowrap">Platform/Content Owner</p>
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
          </div>

          {/* Center - VibeCard Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative">
              <Badge 
                variant="outline" 
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-background border-primary/50 text-primary whitespace-nowrap z-10"
              >
                ACOA Hackathon Build Scope
              </Badge>
              <Card className="p-4 border-2 border-primary bg-primary/5">
                <p className="text-sm font-bold text-primary text-center mb-3">VibeCard Network Core</p>
                <div className="flex flex-col items-center gap-1">
                  {/* Step 1 - Reward Pool */}
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36">
                    <Wallet className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">Reward Pool</p>
                    <p className="text-[8px] text-muted-foreground">USDC Treasury</p>
                  </div>
                  
                  <ArrowDown className="h-3 w-3 text-primary/60" />
                  
                  {/* Step 2 - Viral Chain */}
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36">
                    <GitBranch className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">Viral Chain</p>
                    <p className="text-[8px] text-muted-foreground">Attribution</p>
                  </div>
                  
                  <ArrowDown className="h-3 w-3 text-primary/60" />
                  
                  {/* Step 3 - x402 Splits */}
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">x402 Splits</p>
                    <p className="text-[8px] text-muted-foreground">Atomic Payouts</p>
                  </div>
                  
                  <ArrowDown className="h-3 w-3 text-primary/60" />
                  
                  {/* Step 4 - Embedded Wallets */}
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36 border-sky-400/30">
                    <div className="h-4 w-4 mx-auto mb-1 rounded-full bg-sky-400 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">◎</span>
                    </div>
                    <p className="text-[10px] font-medium">Embedded Wallets</p>
                    <p className="text-[8px] text-muted-foreground">USDC Payouts</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Right Column - Output flow (aligned to Embedded Wallets) */}
          <div className="flex items-center gap-3 self-end mb-[4px]">
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

            {/* Step 5: Stripe Issuance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Card className="p-4 w-36 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-[#635BFF]" />
                <p className="text-xs font-medium text-foreground">Stripe Issuance</p>
                <p className="text-[10px] text-muted-foreground">VibeCard Member</p>
              </Card>
            </motion.div>
          </div>
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
