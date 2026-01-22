import { motion } from "framer-motion";
import { User, ChevronDown, ChevronRight, Coins, Megaphone, Code2, Share2, RefreshCw } from "lucide-react";
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

export function ValuePropsScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          The AI-era Solution
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The first viral growth network backed by stablecoins.
          <br />
          Members get paid to create, share and remix.
          <br />
          Powered by USDC on Arc.
        </p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-center">
        {/* Left - Network Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="relative flex items-center justify-center" style={{ width: "380px", height: "380px" }}>
            {/* Outer Ring - Use Cases with People */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {useCasesWithPeople.map((useCase, index) => {
                  const angle = (index * 360) / useCasesWithPeople.length - 90;
                  const radius = 170;
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
                        left: `calc(50% + ${x}px - 40px)`,
                        top: `calc(50% + ${y}px - 18px)`,
                      }}
                    >
                      <User className="h-4 w-4 text-muted-foreground/60" />
                      <div className="flex flex-col items-center">
                        <div className="p-2 rounded-full bg-muted/50">
                          <useCase.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{useCase.label}</span>
                      </div>
                      <User className="h-4 w-4 text-muted-foreground/60" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Middle Ring - Platforms */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {platforms.map((platform, index) => {
                  const angle = (index * 360) / platforms.length - 90;
                  const radius = 105;
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
                        left: `calc(50% + ${x}px - 24px)`,
                        top: `calc(50% + ${y}px - 24px)`,
                      }}
                    >
                      <div className="p-2.5 rounded-lg bg-card border shadow-sm">
                        {platform.icon ? (
                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                        ) : (
                          <span className={`text-lg font-bold ${platform.color}`}>{platform.initial}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap max-w-16 truncate">{platform.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Center - VibeCard stacked in circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full bg-primary/10 border-2 border-primary"
            >
              <span className="font-display text-xl font-bold text-primary leading-none">Vibe</span>
              <span className="font-display text-xl font-bold text-primary leading-none">Card</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Right - ICP Flywheel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 flex flex-col items-center"
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            Beachhead ICP Flywheel
          </h2>
          
          <div className="relative flex flex-col items-center gap-1">
            {/* Step 1 */}
            <Card className="px-3 py-2 bg-card border text-center w-64">
              <div className="flex items-center justify-center gap-2">
                <Coins className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Platform funds reward pool</span>
              </div>
            </Card>
            <ChevronDown className="h-4 w-4 text-primary" />

            {/* Step 2 */}
            <Card className="px-3 py-2 bg-card border text-center w-64">
              <div className="flex items-center justify-center gap-2">
                <Megaphone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Promotes to creators</span>
              </div>
              <p className="text-[10px] text-muted-foreground">"Add VibeCard to your app!"</p>
            </Card>
            <ChevronDown className="h-4 w-4 text-primary" />

            {/* Step 3 */}
            <Card className="px-3 py-2 bg-card border text-center w-64">
              <div className="flex items-center justify-center gap-2">
                <Code2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Creators integrate snippet</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Easy, platform-endorsed</p>
            </Card>
            <ChevronDown className="h-4 w-4 text-primary" />

            {/* Step 4 - Branching */}
            <Card className="px-3 py-2 bg-card border w-64">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Share2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Content shared with rewards</span>
              </div>
              <div className="space-y-0.5 text-left pl-4">
                <div className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground">Sharers earn USDC</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground">Some convert to platform users</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground">Some remix, create more content</span>
                </div>
              </div>
            </Card>
            <ChevronDown className="h-4 w-4 text-primary" />

            {/* Step 5 - Loop */}
            <Card className="px-3 py-2 bg-primary/10 border-primary text-center w-64">
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-primary">Platform grows, funds more rewards, cycle accelerates, more platforms and creators join</span>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
