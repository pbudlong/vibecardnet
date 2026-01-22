import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Wallet, ArrowRight, Zap, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const kFactorData = [
  { label: "Without VibeCard", value: 0.5, color: "bg-muted-foreground/30", description: "Viral decay, limited reach" },
  { label: "With VibeCard", value: 1.2, color: "bg-primary", description: "Viral growth, exponential reach" },
];

const projectionData = [
  { actions: 1, withoutVibeCard: 1, withVibeCard: 1 },
  { actions: 10, withoutVibeCard: 5, withVibeCard: 12 },
  { actions: 50, withoutVibeCard: 18, withVibeCard: 89 },
  { actions: 100, withoutVibeCard: 32, withVibeCard: 248 },
  { actions: 500, withoutVibeCard: 87, withVibeCard: 1847 },
  { actions: 1000, withoutVibeCard: 156, withVibeCard: 8932 },
];

const windfallPotential = [
  { role: "Creator", earnings: "$1,600", description: "40% of all conversions", icon: TrendingUp },
  { role: "First Sharer", earnings: "$320", description: "Highest upstream share", icon: Users },
  { role: "Early Adopters (top 10)", earnings: "$80-160 each", description: "Upstream decay rewards", icon: DollarSign },
];

interface Participant {
  name: string;
  role: string;
  wallet: string;
  balance: number;
  earnings: number;
}

interface DemoStep {
  action: string;
  description: string;
  payout: {
    creator: number;
    upstream: { name: string; amount: number }[];
    actor: number;
    fee: number;
  };
}

const initialParticipants: Participant[] = [
  { name: "Creator", role: "Original Creator", wallet: "0x1a2b...3c4d", balance: 0, earnings: 0 },
  { name: "Alice", role: "First Sharer", wallet: "0x5e6f...7g8h", balance: 0, earnings: 0 },
  { name: "Bob", role: "Second Sharer", wallet: "0x9i0j...1k2l", balance: 0, earnings: 0 },
  { name: "Carol", role: "Converter", wallet: "0x3m4n...5o6p", balance: 0, earnings: 0 },
];

const demoSteps: DemoStep[] = [
  {
    action: "Alice shares",
    description: "Alice discovers and shares the Vibe Project",
    payout: { creator: 0, upstream: [], actor: 0, fee: 0 },
  },
  {
    action: "Bob shares via Alice",
    description: "Bob finds it through Alice's link and shares",
    payout: { creator: 0, upstream: [], actor: 0, fee: 0 },
  },
  {
    action: "Carol converts via Bob",
    description: "Carol converts through Bob's link — $10 action triggers x402 payout",
    payout: {
      creator: 4.00,      // 40%
      upstream: [
        { name: "Alice", amount: 2.00 },  // 40% × 0.5^1 = 20%
        { name: "Bob", amount: 1.00 },    // 40% × 0.5^0 × 0.5 = 10% (remaining upstream)
      ],
      actor: 2.40,        // 20% + bonus
      fee: 0.60,          // VibeCard fee
    },
  },
];

export function LiveDemoScreen() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [isAnimating, setIsAnimating] = useState(false);

  const resetDemo = () => {
    setCurrentStep(-1);
    setParticipants(initialParticipants);
  };

  const runNextStep = async () => {
    if (currentStep >= demoSteps.length - 1 || isAnimating) return;
    
    setIsAnimating(true);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // If this step has payouts, animate them
    const step = demoSteps[nextStep];
    if (step.payout.creator > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setParticipants(prev => {
        const updated = [...prev];
        // Creator payout
        updated[0] = { ...updated[0], balance: updated[0].balance + step.payout.creator, earnings: updated[0].earnings + step.payout.creator };
        // Upstream payouts
        step.payout.upstream.forEach(up => {
          const idx = updated.findIndex(p => p.name === up.name);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], balance: updated[idx].balance + up.amount, earnings: updated[idx].earnings + up.amount };
          }
        });
        // Actor payout (Carol)
        updated[3] = { ...updated[3], balance: updated[3].balance + step.payout.actor, earnings: updated[3].earnings + step.payout.actor };
        return updated;
      });
    }

    setIsAnimating(false);
  };

  const totalPaid = participants.reduce((sum, p) => sum + p.earnings, 0);
  const currentStepData = currentStep >= 0 ? demoSteps[currentStep] : null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
          Live Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch the viral chain in action: Creator → Alice → Bob → Carol
        </p>
      </motion.div>

      <div className="w-full max-w-5xl">
        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center gap-3 mb-6"
        >
          <Button
            onClick={runNextStep}
            disabled={currentStep >= demoSteps.length - 1 || isAnimating}
            className="gap-2"
            data-testid="button-next-step"
          >
            <Play className="h-4 w-4" />
            {currentStep < 0 ? "Start Demo" : "Next Action"}
          </Button>
          <Button
            variant="outline"
            onClick={resetDemo}
            className="gap-2"
            data-testid="button-reset-demo"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </motion.div>

        {/* Current Action Display */}
        {currentStepData && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="p-4 border-primary border-2 bg-primary/5">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{currentStepData.action}</p>
                  <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Viral Chain Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {participants.map((participant, index) => (
              <div key={participant.name} className="flex items-center">
                <motion.div
                  animate={{
                    scale: participant.earnings > 0 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`p-3 w-32 md:w-36 text-center ${
                    participant.earnings > 0 ? "border-primary border-2" : ""
                  }`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Wallet className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {participant.wallet}
                      </span>
                    </div>
                    <p className="font-semibold text-sm">{participant.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{participant.role}</p>
                    <Badge variant={participant.earnings > 0 ? "default" : "secondary"} className="font-mono">
                      ${participant.balance.toFixed(2)}
                    </Badge>
                  </Card>
                </motion.div>
                {index < participants.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payout Breakdown */}
        {currentStepData && currentStepData.payout.creator > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="p-4">
              <h3 className="font-display font-semibold text-foreground mb-3 text-center">
                x402 Atomic Split Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Creator (40%)</p>
                  <p className="font-mono font-semibold text-primary">+${currentStepData.payout.creator.toFixed(2)}</p>
                </div>
                {currentStepData.payout.upstream.map(up => (
                  <div key={up.name}>
                    <p className="text-xs text-muted-foreground mb-1">{up.name} (upstream)</p>
                    <p className="font-mono font-semibold text-primary">+${up.amount.toFixed(2)}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Carol (actor)</p>
                  <p className="font-mono font-semibold text-primary">+${currentStepData.payout.actor.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">VibeCard Fee</p>
                  <p className="font-mono font-semibold text-accent-foreground">${currentStepData.payout.fee.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Total distributed: <span className="font-mono font-semibold text-foreground">${totalPaid.toFixed(2)} USDC</span>
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Waiting state */}
        {currentStep < 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-muted-foreground"
          >
            <p>Click "Start Demo" to begin the viral chain simulation</p>
          </motion.div>
        )}

        {/* Viral Projection Components */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {/* K-Factor Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-4 h-full">
              <h2 className="font-display text-lg font-bold text-foreground mb-3 text-center">
                K-Factor Comparison
              </h2>
              <div className="space-y-3">
                {kFactorData.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <Badge variant={item.value >= 1 ? "default" : "secondary"} className="font-mono">
                        K = {item.value}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.value / 1.5 * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  <span className="font-semibold text-primary">K &gt; 1</span> = Each share generates more than one new share
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Growth Projection Table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-4 h-full">
              <h2 className="font-display text-lg font-bold text-foreground mb-3 text-center">
                Path to 1,000 Actions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1.5 text-muted-foreground font-medium text-xs">Initial</th>
                      <th className="text-right py-1.5 text-muted-foreground font-medium text-xs">Without</th>
                      <th className="text-right py-1.5 text-primary font-medium text-xs">With VibeCard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionData.map((row, index) => (
                      <motion.tr
                        key={row.actions}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        className="border-b border-muted/50"
                      >
                        <td className="py-1.5 font-mono text-xs">{row.actions}</td>
                        <td className="py-1.5 text-right font-mono text-xs text-muted-foreground">{row.withoutVibeCard}</td>
                        <td className="py-1.5 text-right font-mono text-xs font-semibold text-primary">{row.withVibeCard.toLocaleString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Windfall Potential */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4"
        >
          <Card className="p-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 text-center">
              Windfall Potential (1,000 conversions @ $10 each)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {windfallPotential.map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="text-center p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex justify-center mb-1">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">{item.role}</p>
                  <p className="font-display text-xl font-bold text-foreground">{item.earnings}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
