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
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex flex-col items-center gap-2"
          data-testid="badge-hackathon"
        >
          <Badge 
            variant="outline" 
            className="px-4 py-1.5 text-sm font-medium border-accent bg-accent/10 text-accent-foreground"
          >
            Agentic Commerce On Arc Hackathon - January 23, 2026
          </Badge>
          <Badge 
            variant="outline" 
            className="px-4 py-1.5 text-sm font-bold border-primary bg-primary/10 text-primary"
          >
            On-site Hackathon Winner - 3rd place - $1,000 in USDC
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
          className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-testid="text-subtitle"
        >
          Viral Growth Network
        </motion.h2>

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
          className="mt-16 flex flex-col items-center gap-1 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span className="font-bold mb-2">Track: Best Gateway-Based Micropayments Integration</span>
          <span>Pete Budlong</span>
          <span>100% Vibecoded on Replit</span>
        </motion.div>
      </div>
    </div>
  );
}
