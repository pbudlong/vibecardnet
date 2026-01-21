import { motion } from "framer-motion";
import { Building2, Users, Zap, TrendingUp, Wallet, Clock, Code, FileText, Calculator, ListChecks, BookOpen, Wrench, BarChart3, Users2, User, ArrowLeftRight } from "lucide-react";
import { SiReplit } from "react-icons/si";
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
        className="text-center mb-4"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
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

      {/* Circular Network Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-3xl mb-4"
      >
        <Card className="p-6">
          <div className="relative flex items-center justify-center" style={{ minHeight: "280px" }}>
            {/* Outer Ring - Use Cases with People feeling */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                {useCasesWithPeople.map((useCase, index) => {
                  const angle = (index * 360) / useCasesWithPeople.length - 90;
                  const radius = 140;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <motion.div
                      key={useCase.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="absolute flex items-center gap-1"
                      style={{
                        left: `calc(50% + ${x}px - 36px)`,
                        top: `calc(50% + ${y}px - 16px)`,
                      }}
                    >
                      <User className="h-4 w-4 text-muted-foreground/60" />
                      <div className="flex flex-col items-center">
                        <div className="p-1.5 rounded-full bg-muted/50">
                          <useCase.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-[9px] text-muted-foreground">{useCase.label}</span>
                      </div>
                      <User className="h-4 w-4 text-muted-foreground/60" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Middle Ring - Platforms */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                {platforms.map((platform, index) => {
                  const angle = (index * 360) / platforms.length - 90;
                  const radius = 90;
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
                        left: `calc(50% + ${x}px - 22px)`,
                        top: `calc(50% + ${y}px - 22px)`,
                      }}
                    >
                      <div className="p-2 rounded-lg bg-card border shadow-sm">
                        {platform.icon ? (
                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                        ) : (
                          <span className={`text-lg font-bold ${platform.color}`}>{platform.initial}</span>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-0.5 whitespace-nowrap max-w-14 truncate">{platform.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Center - VibeCard stacked */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary"
            >
              <span className="font-display text-lg font-bold text-primary leading-none">Vibe</span>
              <span className="font-display text-lg font-bold text-primary leading-none">Card</span>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Everyone Wins - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-3 text-center">
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
