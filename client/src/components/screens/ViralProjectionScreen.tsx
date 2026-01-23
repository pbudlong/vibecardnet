import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViralMindmapAnimation } from "@/components/ViralMindmapAnimation";

const USE_MINDMAP_ANIMATION = true;

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
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
          Viral Growth Projections
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Paid sharing boosts the k-factor. The earlier you get in, the more you get.
        </p>
      </motion.div>

      {USE_MINDMAP_ANIMATION ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl h-[350px]"
        >
          <ViralMindmapAnimation />
        </motion.div>
      ) : (
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
          {/* K-Factor Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-5 h-full">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
                K-Factor Comparison
              </h2>
              <div className="space-y-4">
                {kFactorData.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <Badge variant={item.value >= 1 ? "default" : "secondary"} className="font-mono">
                        K = {item.value}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
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
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-center text-muted-foreground">
                  <span className="font-semibold text-primary">K &gt; 1</span> = Each share generates more than one new share
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Growth Projection Table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-5 h-full">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
                Path to 1,000 Actions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-muted-foreground font-medium">Initial</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Without</th>
                      <th className="text-right py-2 text-primary font-medium">With VibeCard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionData.map((row, index) => (
                      <motion.tr
                        key={row.actions}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                        className="border-b border-muted/50"
                      >
                        <td className="py-2 font-mono">{row.actions}</td>
                        <td className="py-2 text-right font-mono text-muted-foreground">{row.withoutVibeCard}</td>
                        <td className="py-2 text-right font-mono font-semibold text-primary">{row.withVibeCard.toLocaleString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Windfall Potential */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-5xl mt-6"
      >
        <Card className="p-5">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
            Windfall Potential (1,000 conversions @ $10 each)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {windfallPotential.map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="text-center p-4 rounded-lg bg-muted/30"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.role}</p>
                <p className="font-display text-2xl font-bold text-foreground">{item.earnings}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
