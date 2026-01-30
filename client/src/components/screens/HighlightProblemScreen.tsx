import { motion } from "framer-motion";
import { TrendingUp, Smartphone, Sparkles, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

const problemPoints = [
  {
    icon: TrendingUp,
    era: "The heyday of viral growth - Web 2.0 (2000s)",
    description: "Systematically engineered viral loops drove exponential growth for Facebook, LinkedIn, YouTube through measurement and A/B testing.",
  },
  {
    icon: Smartphone,
    era: "Last decade mobile killed it",
    description: "Email-based invite mechanics disappeared, spam filters rose, and SMS/contacts-based invites were throttled by anti-spam regs.",
  },
  {
    icon: Sparkles,
    era: "AI flash bringing it back but spiky",
    description: "Same pattern repeating with ChatGPT wrappers, Midjourney, Lensa—fast viral spikes, low retention. Simple tools, explosive growth, spiky engagement.",
  },
  {
    icon: Lightbulb,
    era: "Opportunity abounds - Andrew Chen (a16z)",
    description: "Time to revive the discipline and ",
    boldPart: "adapt it for modern product-led growth and AI-era growth loops.",
  },
];

export function HighlightProblemScreen() {
  return (
    <div className="w-full flex flex-col items-center justify-start px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          The Viral Problem
        </h1>
      </motion.div>

      <div className="w-full max-w-4xl space-y-4">
        {problemPoints.map((point, index) => (
          <motion.div
            key={point.era}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
          >
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <point.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-xl mb-1">
                    {point.era}
                  </h3>
                  <p className="text-muted-foreground text-base">
                    {point.description}
                    {point.boldPart && <span className="font-bold">{point.boldPart}</span>}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
