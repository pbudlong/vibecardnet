import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, CreditCard, Wallet, GitBranch, Zap } from "lucide-react";
import { SiStripe } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function SimpleView() {
  return (
    <>
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
                <p className="text-xs font-medium text-foreground">Arc Onramp</p>
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
                <p className="text-sm font-bold text-primary text-center mb-3">VibeCard Onchain Core</p>
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
                    <p className="text-[10px] font-medium">Viral Network</p>
                    <p className="text-[8px] text-muted-foreground">Arc Blockchain</p>
                  </div>
                  
                  <ArrowDown className="h-3 w-3 text-primary/60" />
                  
                  {/* Step 3 - x402 Splits */}
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">x402 Splits</p>
                    <p className="text-[8px] text-muted-foreground">Circle Gateway SDK</p>
                  </div>
                  
                  <ArrowDown className="h-3 w-3 text-primary/60" />
                  
                  {/* Step 4 - Non-custodial Wallets */}
                  <div className="bg-card border rounded-md px-3 py-2 text-center w-36">
                    <Wallet className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] font-medium">User Payouts</p>
                    <p className="text-[8px] text-muted-foreground">Circle Non-custodial Wallets</p>
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
                <p className="text-xs font-medium text-foreground">Arc Onramp</p>
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
          <span>USDC Bridge</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Onchain Core</span>
        </div>
      </motion.div>
    </>
  );
}

function DetailedView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-6xl"
    >
      <div className="flex justify-center items-stretch gap-2">
        {/* Left Column - Funding In (aligned to top) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center pt-12 self-start"
        >
          <div className="flex flex-col items-center gap-2" style={{ marginTop: '-35px' }}>
            <Card className="p-3 w-28 text-center">
              <SiStripe className="h-6 w-6 mx-auto mb-1 text-[#635BFF]" />
              <p className="text-[10px] font-medium text-foreground">Stripe Payments</p>
              <p className="text-[8px] text-muted-foreground">USD funding</p>
            </Card>
            
            <ArrowDown className="h-3 w-3 text-muted-foreground" />
            
            <Card className="p-3 w-28 text-center border-sky-400/50">
              <div className="h-6 w-6 mx-auto mb-1 rounded-full bg-sky-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">◎</span>
              </div>
              <p className="text-[10px] font-medium text-foreground">Circle Mint</p>
              <p className="text-[8px] text-muted-foreground">USD → USDC</p>
            </Card>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground ml-1 mt-16" />
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

        {/* Right Column - Payout Out (aligned to bottom) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex items-center pb-12 self-end"
        >
          <ArrowRight className="h-4 w-4 text-muted-foreground mr-1 mb-16" />
          <div className="flex flex-col items-center gap-2" style={{ marginTop: '45px' }}>
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SystemArchitectureScreen() {
  const [viewMode, setViewMode] = useState<"simple" | "detailed">("simple");

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
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-3">
          {viewMode === "simple" 
            ? "End-to-end payment flow from campaign funding to participant rewards"
            : "End-to-end payment flow from reward pool funding to VibeCard spending"
          }
        </p>
        
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-2">
          <Button
            variant={viewMode === "simple" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("simple")}
            data-testid="button-simple-view"
          >
            Simple
          </Button>
          <Button
            variant={viewMode === "detailed" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("detailed")}
            data-testid="button-detailed-view"
          >
            Detailed
          </Button>
        </div>
      </motion.div>

      {viewMode === "simple" ? <SimpleView /> : <DetailedView />}
    </div>
  );
}
