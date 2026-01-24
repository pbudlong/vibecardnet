import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViralMindmapAnimation } from "@/components/ViralMindmapAnimation";

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

export function ViralProjectionScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-6 py-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
          Viral Growth Projections
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Paid sharing boosts the k-factor. The earlier you get in, the more you get.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl flex flex-col gap-0">
        {/* Top Row: K-Factor + Tree - align items to top */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
          {/* Top Left: K-Factor Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-4">
              <h2 className="font-display text-base font-bold text-foreground mb-3 text-center">
                K-Factor Comparison
              </h2>
              <div className="space-y-3">
                {kFactorData.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <Badge variant={item.value >= 1 ? "default" : "secondary"} className="font-mono">
                        K = {item.value}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.value / 1.5 * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2 pt-2 border-t">
                <span className="font-semibold text-primary">K &gt; 1</span> = Each share generates more than one new share
              </p>
            </Card>
          </motion.div>

          {/* Top Right: Viral Mindmap Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="min-h-[220px] flex items-start justify-center"
          >
            <ViralMindmapAnimation />
          </motion.div>
        </div>

        {/* Bottom Row: Path to 1k + Windfall - align items to bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-end" style={{ marginTop: '-20px' }}>
          {/* Bottom Left: Path to 1,000 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="font-display text-base font-bold text-foreground mb-3 text-center">
                Path to 1,000 Actions
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Initial</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Without</th>
                    <th className="text-right py-1.5 text-primary font-medium">With VibeCard</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.map((row, index) => (
                    <motion.tr
                      key={row.actions}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      className="border-b border-muted/50"
                    >
                      <td className="py-1.5 font-mono">{row.actions}</td>
                      <td className="py-1.5 text-right font-mono text-muted-foreground">{row.withoutVibeCard}</td>
                      <td className="py-1.5 text-right font-mono font-semibold text-primary">{row.withVibeCard.toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>

          {/* Bottom Right: Windfall Potential */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-4">
              <h2 className="font-display text-base font-bold text-foreground mb-3 text-center">
                Windfall Potential <span className="text-xs font-normal text-muted-foreground">(1,000 conversions @ $10)</span>
              </h2>
              <div className="space-y-2">
                {windfallPotential.map((item, index) => (
                  <motion.div
                    key={item.role}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.role}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <p className="font-display text-lg font-bold text-foreground">{item.earnings}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
