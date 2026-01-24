import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, GitBranch, TrendingUp, Zap, DollarSign, Share2, Wallet, Clock, Users, Building2 } from "lucide-react";
import andromedaImg from "@assets/Screen_Shot_2026-01-21_at_3.01.09_PM_1769047486512.png";
import atlasImg from "@assets/Screen_Shot_2026-01-21_at_5.53.22_PM_1769047494023.png";

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
    description: "DeFi protocols enable instant rewards",
  },
];

const codeSnippet = `// Initialize VibeCard
import { VibeCard } from '@vibecard/sdk';

const vibe = new VibeCard({
  publisherId: 'your-project-id',
  budget: 1000,  // USDC budget
});

// Track a remix action
vibe.trackRemix({
  originalId: 'project-123',
  remixId: 'remix-456',
  remixerId: user.walletAddress,
  upstreamRef: referralCode,
});

// Track a share action
vibe.trackShare({
  contentId: 'project-123',
  sharerId: user.walletAddress,
  upstreamRef: referralCode,
});`;

export function PublisherIntegrationScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-6 py-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Content Tracking
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Platforms and creators can add viral rewards to projects in minutes.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-[1fr_1.5fr_1fr] gap-4">
        {/* Everyone Wins - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          <h2 className="font-display text-sm font-bold text-foreground text-center">
            Everyone Wins
          </h2>
          
          {/* Publishers */}
          <Card className="p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="p-1 rounded-md bg-primary/10">
                <Building2 className="h-3 w-3 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-xs">For Publishers</h3>
            </div>
            <div className="space-y-1">
              {publisherBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-1.5"
                >
                  <div className="p-0.5 rounded bg-accent/20 mt-0.5">
                    <benefit.icon className="h-2.5 w-2.5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-[9px] leading-tight">
                      {benefit.title}
                    </h4>
                    <p className="text-[7px] text-muted-foreground leading-tight">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Members */}
          <Card className="p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="p-1 rounded-md bg-primary/10">
                <Users className="h-3 w-3 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-xs">For Members</h3>
            </div>
            <div className="space-y-1">
              {memberBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-start gap-1.5"
                >
                  <div className="p-0.5 rounded bg-accent/20 mt-0.5">
                    <benefit.icon className="h-2.5 w-2.5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-[9px] leading-tight">
                      {benefit.title}
                    </h4>
                    <p className="text-[7px] text-muted-foreground leading-tight">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Content Examples - Middle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          {/* Andromeda Example */}
          <Card className="p-3 overflow-hidden">
            <div className="mb-2">
              <h3 className="font-display font-bold text-foreground text-sm">Solar System Visualization</h3>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">Interactive 3D solar system visualization</p>
                <span className="text-[10px] text-muted-foreground">Created by Matt P.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Button size="sm" variant="outline" className="text-[10px] h-7 px-3 text-orange-500 border-orange-500">
                View App
              </Button>
              <Button size="sm" variant="outline" className="text-[10px] h-7 px-3 ring-2 ring-red-500 ring-offset-2 ring-offset-background">
                Remix Template
              </Button>
              <div className="flex items-center gap-2 ml-auto text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> 3,214
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" /> 6
                </span>
              </div>
            </div>
            <div className="rounded-md overflow-hidden">
              <img 
                src={andromedaImg} 
                alt="Andromeda Galaxy Visualization" 
                className="w-full h-28 object-cover object-bottom"
              />
            </div>
          </Card>

          {/* 3iAtlas Example */}
          <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 relative">
            <img 
              src={atlasImg} 
              alt="3iAtlas Provenance Tracker" 
              className="w-full h-52 object-cover object-top"
            />
            {/* Highlight overlay for entire share bar */}
            <div className="absolute top-0 left-0 right-0 h-[26px] pointer-events-none ring-2 ring-red-500 ring-inset" />
          </Card>
        </motion.div>

        {/* Code Block - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-3 bg-slate-950 border-slate-800 h-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] text-slate-400 ml-1">vibecard-integration.ts</span>
            </div>
            <pre className="text-[8px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
              <code>{codeSnippet}</code>
            </pre>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
