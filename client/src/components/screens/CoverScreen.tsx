import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CoverScreenProps {
  onStart: () => void;
}

export function CoverScreen({ onStart }: CoverScreenProps) {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge 
            variant="outline" 
            className="mb-6 px-4 py-1.5 text-sm font-medium border-accent bg-accent/10 text-accent-foreground"
            data-testid="badge-hackathon"
          >
            Agentic Commerce On Arc Hackathon - Jan 9 - 23, 2026
          </Badge>
        </motion.div>

        <motion.h1
          className="font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-testid="text-title"
        >
          VibeCard
        </motion.h1>

        <motion.h2
          className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-testid="text-subtitle"
        >
          Viral Rewards Network
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          data-testid="text-tagline"
        >
          The first viral growth network backed by stablecoins.
          <br />
          Members get paid to create, share and remix.
          <br />
          Powered by USDC on Arc.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            size="lg" 
            onClick={onStart}
            className="px-8 py-6 text-lg font-semibold gap-2"
            data-testid="button-start-demo"
          >
            Start Demo
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 flex items-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Best Vibecoded Application Track</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
