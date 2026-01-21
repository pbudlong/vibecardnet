import { motion } from "framer-motion";
import { Building2, Users, Zap, TrendingUp, Wallet, Clock, Sparkles } from "lucide-react";
import { SiReplit } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const platforms = ["Replit", "Lovable", "Bolt", "Axyen"];

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
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          The Solution
        </h1>
        <p className="text-lg text-primary font-semibold max-w-3xl mx-auto">
          New AI viral loops powered by crypto
        </p>
      </motion.div>

      {/* Vibe Coding Explosion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-4xl mb-6"
      >
        <Card className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-3">
                Initially targeted at the Cambrian explosion of long-tail, user-generated programmatic content from vibe coding platforms:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {platforms.map((platform) => (
                  <Badge key={platform} variant="secondary">{platform}</Badge>
                ))}
                <Badge variant="outline">+ many others</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-foreground font-medium">Not every app needs a million users.</p>
                <p className="text-muted-foreground">But what about the apps just for you?</p>
                <p className="text-muted-foreground">
                  The trackers, planners, calculators and guides that <span className="text-foreground font-medium">everyone</span> is now building.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Everyone Wins - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
