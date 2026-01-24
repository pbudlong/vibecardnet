import { motion } from "framer-motion";
import { Globe, ArrowRight, CreditCard } from "lucide-react";
import { SiReplit } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const platforms = [
  { name: "Lovable", icon: null, label: "Lovable" },
  { name: "Replit", icon: SiReplit },
  { name: "Bolt", icon: null, label: "Bolt" },
  { name: "Cursor", icon: null, label: "Cursor" },
];

const phases = [
  { phase: "Phase 1", title: "Platform Partners", description: "Integrated into dev tools & AI platforms", status: "current" },
  { phase: "Phase 2", title: "Individual Creators", description: "Any creator can become a publisher", status: "next" },
  { phase: "Phase 3", title: "Major Publishers", description: "Alternative organic channel", status: "future" },
  { phase: "Phase 4", title: "Agent-to-Agent", description: "When robot money takes over", status: "future" },
];

export function NetworkVisionScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
          The Network Vision
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          One wallet, all rewards. Cross-platform earnings unified by USDC.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl">
        {/* Multi-Platform Hub Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              {/* Platforms */}
              <div className="flex flex-wrap justify-center gap-3">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex flex-col items-center p-3 rounded-lg bg-muted/50 w-20"
                  >
                    {platform.icon ? (
                      <platform.icon className="h-6 w-6 text-foreground mb-1" />
                    ) : (
                      <span className="text-lg font-bold text-foreground mb-1">{platform.label?.charAt(0)}</span>
                    )}
                    <span className="text-xs text-muted-foreground">{platform.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <ArrowRight className="h-8 w-8 text-primary" />
              </motion.div>

              {/* Viral Network Hub */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.75 }}
                className="flex flex-col items-center p-4 rounded-xl bg-primary/10 border-2 border-primary"
              >
                <CreditCard className="h-8 w-8 text-primary mb-1" />
                <span className="font-display font-bold text-foreground">Viral Network</span>
                <span className="text-xs text-muted-foreground">Rewards Hub</span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.78 }}
              >
                <ArrowRight className="h-8 w-8 text-primary" />
              </motion.div>

              {/* User Wallet */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="flex flex-col items-center p-4 rounded-xl bg-accent/10 border-2 border-accent"
              >
                <CreditCard className="h-8 w-8 text-accent-foreground mb-1" />
                <span className="font-display font-bold text-foreground">Your Wallet</span>
                <span className="text-xs text-muted-foreground">USDC → USD</span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <ArrowRight className="h-8 w-8 text-primary" />
              </motion.div>

              {/* VibeCard Hub */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="flex flex-col items-center p-4 rounded-xl bg-primary/10 border-2 border-primary"
              >
                <Globe className="h-8 w-8 text-primary mb-1" />
                <span className="font-display font-bold text-foreground">VibeCard</span>
                <span className="text-xs text-muted-foreground">Actions to Cash</span>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Phased Rollout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <Card className="p-5">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
              Progression
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {phases.map((item, index) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-lg text-center ${
                    item.status === "current" 
                      ? "bg-primary/10 border-2 border-primary" 
                      : "bg-muted/30"
                  }`}
                >
                  <Badge 
                    variant={item.status === "current" ? "default" : "secondary"}
                    className="mb-2"
                  >
                    {item.phase}
                  </Badge>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Closing Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="p-6 bg-primary/5 border-primary border-2">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Built for Arc Hackathon
              </h2>
              <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
                VibeCard demonstrates the power of native USDC, embedded wallets, and atomic micropayments. 
                This wasn't possible before Arc. Now it's inevitable.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">Arc Native USDC</Badge>
                <Badge variant="outline">Circle Wallets</Badge>
                <Badge variant="outline">x402 Protocol</Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
