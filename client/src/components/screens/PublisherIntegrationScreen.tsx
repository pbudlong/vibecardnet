import { motion } from "framer-motion";
import { Code, Zap, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const codeSnippet = `// Initialize VibeCard for your project
import { VibeCard } from '@vibecard/sdk';

const vibe = new VibeCard({
  publisherId: 'your-project-id',
  budget: 1000,  // USDC budget
});

// Track a share action
vibe.trackShare({
  contentId: 'tutorial-123',
  sharerId: user.walletAddress,
  upstreamRef: referralCode,  // who referred them
});

// Track a conversion (triggers x402 payout)
vibe.trackConversion({
  contentId: 'tutorial-123',
  userId: user.walletAddress,
  value: 10.00,  // USDC value of conversion
});`;

const features = [
  {
    icon: Code,
    title: "3 Lines to Integrate",
    description: "Drop in the SDK and start tracking shares and conversions",
  },
  {
    icon: Zap,
    title: "x402 Atomic Splits",
    description: "Payouts happen instantly to all participants in one transaction",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track viral spread, conversion rates, and budget utilization",
  },
];

export function PublisherIntegrationScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Publisher Integration
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Add viral rewards to any project in minutes. Any creator can become a publisher.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        {/* Code Block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-4 bg-slate-950 border-slate-800 h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-slate-400 ml-2">vibecard-integration.ts</span>
            </div>
            <pre className="text-xs md:text-sm text-slate-300 overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </Card>
        </motion.div>

        {/* Features + Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Features */}
          <Card className="p-5">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              Why Publishers Love VibeCard
            </h2>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Dashboard Preview */}
          <Card className="p-5 flex-1">
            <h2 className="font-display text-lg font-bold text-foreground mb-3">
              Live Dashboard Preview
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Budget Remaining</span>
                <span className="font-mono text-sm font-semibold text-primary">$847.20 USDC</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <p className="font-mono text-xl font-bold text-foreground">2,847</p>
                  <p className="text-xs text-muted-foreground">Total Shares</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-xl font-bold text-foreground">342</p>
                  <p className="text-xs text-muted-foreground">Conversions</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-xl font-bold text-foreground">12%</p>
                  <p className="text-xs text-muted-foreground">Conv. Rate</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
