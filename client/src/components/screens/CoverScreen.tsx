import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CoverScreenProps {
  onStart: () => void;
}

function FloatingNode({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/10 border border-primary/20"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function ConnectionLine({ x1, y1, x2, y2, delay }: { x1: string; y1: string; x2: string; y2: string; delay: number }) {
  return (
    <motion.div
      className="absolute h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      style={{
        left: x1,
        top: y1,
        width: `calc(${x2} - ${x1})`,
        transformOrigin: "left center",
      }}
      animate={{
        opacity: [0, 0.5, 0],
        scaleX: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function CoverScreen({ onStart }: CoverScreenProps) {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingNode delay={0} x="10%" y="20%" size={60} />
        <FloatingNode delay={0.5} x="85%" y="15%" size={40} />
        <FloatingNode delay={1} x="75%" y="70%" size={50} />
        <FloatingNode delay={1.5} x="15%" y="75%" size={35} />
        <FloatingNode delay={2} x="50%" y="10%" size={45} />
        <FloatingNode delay={2.5} x="90%" y="45%" size={30} />
        <FloatingNode delay={0.8} x="5%" y="50%" size={55} />
        <FloatingNode delay={1.2} x="60%" y="85%" size={38} />
        
        <ConnectionLine x1="15%" y1="22%" x2="50%" y2="12%" delay={0.3} />
        <ConnectionLine x1="52%" y1="12%" x2="85%" y2="17%" delay={1.2} />
        <ConnectionLine x1="78%" y1="72%" x2="92%" y2="47%" delay={2.1} />
      </div>

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
          The first viral rewards network powered by stablecoins.
          <br />
          Get paid to share. Powered by USDC on Arc.
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
