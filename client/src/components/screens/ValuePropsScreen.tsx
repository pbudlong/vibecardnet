import { motion } from "framer-motion";
import { Building2, Users, Zap, TrendingUp, Wallet, Clock, DollarSign, Share2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const publisherBenefits = [
  {
    icon: TrendingUp,
    title: "Better CAC Economics",
    description: "Pay only for results, not impressions or clicks",
  },
  {
    icon: Zap,
    title: "x402 Atomic Splits",
    description: "Instant multi-party payouts in a single transaction",
  },
  {
    icon: DollarSign,
    title: "Pay for Performance",
    description: "Budget flows to actual conversions, not promises",
  },
  {
    icon: Share2,
    title: "Viral Distribution",
    description: "Your best customers become your sales force",
  },
];

const memberBenefits = [
  {
    icon: Wallet,
    title: "Instant USDC Earnings",
    description: "No minimums, no delays, real money in your wallet",
  },
  {
    icon: Clock,
    title: "Early Bird Advantage",
    description: "First sharers earn more through upstream rewards",
  },
  {
    icon: Users,
    title: "One Wallet, All Rewards",
    description: "Earnings from every publisher in one place",
  },
  {
    icon: Zap,
    title: "Earn First, Verify Later",
    description: "DeFi protocols enable instant rewards—KYC only when you're ready to spend",
  },
];

export function ValuePropsScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Everyone Wins
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A rewards network that aligns incentives for publishers and members alike.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Publisher Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                For Publishers
              </h2>
            </div>
            <div className="space-y-4">
              {publisherBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-1.5 rounded-md bg-accent/20 mt-0.5">
                    <benefit.icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Member Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                For Members
              </h2>
            </div>
            <div className="space-y-4">
              {memberBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-1.5 rounded-md bg-accent/20 mt-0.5">
                    <benefit.icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
