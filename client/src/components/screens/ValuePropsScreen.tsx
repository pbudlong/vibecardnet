import { motion } from "framer-motion";
import { Building2, Users, Zap, TrendingUp, Wallet, Clock, Code, FileText, Calculator, ListChecks } from "lucide-react";
import { SiReplit, SiOpenai } from "react-icons/si";
import { Card } from "@/components/ui/card";

const platforms = [
  { name: "Replit", icon: SiReplit },
  { name: "Lovable", icon: null },
  { name: "Bolt", icon: null },
  { name: "Cursor", icon: null },
  { name: "Claude", icon: SiOpenai },
  { name: "Circle CAB", icon: null },
];

const useCases = [
  { icon: ListChecks, label: "Trackers" },
  { icon: FileText, label: "Planners" },
  { icon: Calculator, label: "Calculators" },
  { icon: Code, label: "Guides" },
];

const publisherBenefits = [
  {
    icon: TrendingUp,
    title: "Pay for Results",
    description: "Budget flows to actual conversions, not impressions",
  },
  {
    icon: Zap,
    title: "Atomic Splits",
    description: "Instant multi-party payouts via x402",
  },
];

const memberBenefits = [
  {
    icon: Wallet,
    title: "Instant Earnings",
    description: "Real USDC, no minimums, no delays",
  },
  {
    icon: Clock,
    title: "Earn First, Verify Later",
    description: "DeFi protocols enable instant rewards—KYC later",
  },
];

export function ValuePropsScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          The AI Loops Solution
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The first viral growth network backed by stablecoins.
          <br />
          Members get paid to create, share and remix.
          <br />
          Powered by USDC on Arc.
        </p>
      </motion.div>

      {/* Network Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-4xl mb-6"
      >
        <Card className="p-6">
          <div className="relative flex flex-col items-center">
            {/* Outer Ring - Use Cases */}
            <div className="flex justify-center gap-4 mb-4">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="flex flex-col items-center p-2 rounded-lg bg-muted/30 w-20"
                >
                  <useCase.icon className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">{useCase.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Middle Ring - Platforms */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="flex flex-col items-center p-3 rounded-lg bg-muted/50 w-20"
                >
                  {platform.icon ? (
                    <platform.icon className="h-5 w-5 text-foreground mb-1" />
                  ) : (
                    <span className="text-sm font-bold text-foreground mb-1">{platform.name.charAt(0)}</span>
                  )}
                  <span className="text-xs text-muted-foreground">{platform.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Center - VibeCard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex flex-col items-center p-4 rounded-xl bg-primary/10 border-2 border-primary"
            >
              <span className="font-display text-xl font-bold text-primary">VibeCard</span>
              <span className="text-xs text-muted-foreground">Rewards Hub</span>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Everyone Wins - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
          Everyone Wins
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Publishers */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">For Publishers</h3>
            </div>
            <div className="space-y-2">
              {publisherBenefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-2">
                  <benefit.icon className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-foreground">{benefit.title}: </span>
                    <span className="text-xs text-muted-foreground">{benefit.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Members */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">For Members</h3>
            </div>
            <div className="space-y-2">
              {memberBenefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-2">
                  <benefit.icon className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-foreground">{benefit.title}: </span>
                    <span className="text-xs text-muted-foreground">{benefit.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
