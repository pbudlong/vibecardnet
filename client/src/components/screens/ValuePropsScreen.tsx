import { motion } from "framer-motion";
import { User, ChevronDown, ChevronRight, Coins, Megaphone, Code2, Share2, RefreshCw, Building2, Users, Zap, TrendingUp, Wallet, Clock, DollarSign } from "lucide-react";
import { SiReplit } from "react-icons/si";
import { Code, FileText, Calculator, ListChecks, BookOpen, Wrench, BarChart3, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const platforms = [
  { name: "Replit", icon: SiReplit, color: "text-orange-500" },
  { name: "Lovable", initial: "L", color: "text-pink-500" },
  { name: "Bolt", initial: "B", color: "text-yellow-500" },
  { name: "Cursor", initial: "C", color: "text-blue-500" },
  { name: "Claude", initial: "C", color: "text-amber-600" },
  { name: "Circle App Builder", initial: "◎", color: "text-emerald-500" },
];

const useCasesWithPeople = [
  { icon: ListChecks, label: "Trackers" },
  { icon: Users2, label: "Teams" },
  { icon: FileText, label: "Planners" },
  { icon: BarChart3, label: "Dashboards" },
  { icon: Calculator, label: "Calculators" },
  { icon: BookOpen, label: "Learning" },
  { icon: Code, label: "Guides" },
  { icon: Wrench, label: "Tools" },
];

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
    <div className="h-full w-full flex flex-col items-center justify-start px-6 py-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
          The AI-era Solution
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          The first viral growth network backed by stablecoins.
          Members get paid to create, share and remix. Powered by USDC on Arc.
        </p>
      </motion.div>

      {/* Three Column Layout */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left - Network Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-shrink-0 flex items-center justify-center"
        >
          <div className="relative flex items-center justify-center" style={{ width: "280px", height: "280px" }}>
            {/* Outer Ring - Use Cases with People */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {useCasesWithPeople.map((useCase, index) => {
                  const angle = (index * 360) / useCasesWithPeople.length - 90;
                  const radius = 125;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <motion.div
                      key={useCase.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="absolute flex items-center gap-0.5"
                      style={{
                        left: `calc(50% + ${x}px - 32px)`,
                        top: `calc(50% + ${y}px - 14px)`,
                      }}
                    >
                      <User className="h-3 w-3 text-muted-foreground/60" />
                      <div className="flex flex-col items-center">
                        <div className="p-1.5 rounded-full bg-muted/50">
                          <useCase.icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-[8px] text-muted-foreground">{useCase.label}</span>
                      </div>
                      <User className="h-3 w-3 text-muted-foreground/60" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Middle Ring - Platforms */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {platforms.map((platform, index) => {
                  const angle = (index * 360) / platforms.length - 90;
                  const radius = 75;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <motion.div
                      key={platform.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.08 }}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `calc(50% + ${x}px - 18px)`,
                        top: `calc(50% + ${y}px - 18px)`,
                      }}
                    >
                      <div className="p-1.5 rounded-lg bg-card border shadow-sm">
                        {platform.icon ? (
                          <platform.icon className={`h-4 w-4 ${platform.color}`} />
                        ) : (
                          <span className={`text-sm font-bold ${platform.color}`}>{platform.initial}</span>
                        )}
                      </div>
                      <span className="text-[8px] text-muted-foreground mt-0.5 whitespace-nowrap max-w-12 truncate">{platform.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Center - VibeCard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 flex flex-col items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary"
            >
              <span className="font-display text-base font-bold text-primary leading-none">Vibe</span>
              <span className="font-display text-base font-bold text-primary leading-none">Card</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Middle - ICP Flywheel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-shrink-0 flex flex-col items-center"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-2">
            Beachhead ICP Flywheel
          </h2>
          
          <div className="relative flex flex-col items-center gap-0.5">
            <Card className="px-2 py-1.5 bg-card border text-center w-52">
              <div className="flex items-center justify-center gap-1.5">
                <Coins className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-[10px] font-medium text-foreground">Platform funds reward pool</span>
              </div>
            </Card>
            <ChevronDown className="h-3 w-3 text-primary" />

            <Card className="px-2 py-1.5 bg-card border text-center w-52">
              <div className="flex items-center justify-center gap-1.5">
                <Megaphone className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-[10px] font-medium text-foreground">Promotes to creators</span>
              </div>
              <p className="text-[8px] text-muted-foreground">"Add VibeCard to your app!"</p>
            </Card>
            <ChevronDown className="h-3 w-3 text-primary" />

            <Card className="px-2 py-1.5 bg-card border text-center w-52">
              <div className="flex items-center justify-center gap-1.5">
                <Code2 className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-[10px] font-medium text-foreground">Creators integrate snippet</span>
              </div>
              <p className="text-[8px] text-muted-foreground">Easy, platform-endorsed</p>
            </Card>
            <ChevronDown className="h-3 w-3 text-primary" />

            <Card className="px-2 py-1.5 bg-card border w-52">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Share2 className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-[10px] font-medium text-foreground">Content shared with rewards</span>
              </div>
              <div className="space-y-0 text-left pl-3">
                <div className="flex items-center gap-0.5">
                  <ChevronRight className="h-2 w-2 text-primary flex-shrink-0" />
                  <span className="text-[8px] text-muted-foreground">Sharers earn USDC</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <ChevronRight className="h-2 w-2 text-primary flex-shrink-0" />
                  <span className="text-[8px] text-muted-foreground">Some convert to platform users</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <ChevronRight className="h-2 w-2 text-primary flex-shrink-0" />
                  <span className="text-[8px] text-muted-foreground">Some remix, create more content</span>
                </div>
              </div>
            </Card>
            <ChevronDown className="h-3 w-3 text-primary" />

            <Card className="px-2 py-1.5 bg-primary/10 border-primary text-center w-52">
              <div className="flex items-center justify-center gap-1.5">
                <RefreshCw className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-[9px] font-medium text-primary">Cycle accelerates</span>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Right - Everyone Wins */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex-shrink-0 w-72 flex flex-col"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-2 text-center">
            Everyone Wins
          </h2>
          
          <div className="flex flex-col gap-2">
            {/* Publishers */}
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">For Publishers</h3>
              </div>
              <div className="space-y-2">
                {publisherBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="p-1 rounded-md bg-accent/20 mt-0.5">
                      <benefit.icon className="h-3 w-3 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-[11px]">
                        {benefit.title}
                      </h4>
                      <p className="text-[9px] text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Members */}
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">For Members</h3>
              </div>
              <div className="space-y-2">
                {memberBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="p-1 rounded-md bg-accent/20 mt-0.5">
                      <benefit.icon className="h-3 w-3 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-[11px]">
                        {benefit.title}
                      </h4>
                      <p className="text-[9px] text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
