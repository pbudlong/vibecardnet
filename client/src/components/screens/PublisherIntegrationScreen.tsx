import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, GitBranch } from "lucide-react";
import { useState, useEffect } from "react";
import andromedaImg from "@assets/Screen_Shot_2026-01-21_at_3.01.09_PM_1769047486512.png";
import atlasImg from "@assets/Screen_Shot_2026-01-21_at_5.53.22_PM_1769047494023.png";
import mattProfileImg from "@assets/Screen_Shot_2026-01-21_at_6.31.11_PM_1769049114232.png";

const codeSnippet = `// Initialize VibeCard for your project
import { VibeCard } from '@vibecard/sdk';

const vibe = new VibeCard({
  publisherId: 'your-project-id',
  budget: 1000,  // USDC budget
});

// Track a remix action
vibe.trackRemix({
  originalId: 'project-123',
  remixId: 'remix-456',
  remixerId: user.walletAddress,
  upstreamRef: referralCode,
});
// Track a share action
vibe.trackShare({
  contentId: 'project-123',
  sharerId: user.walletAddress,
  upstreamRef: referralCode,
});
// Track a conversion (triggers x402 payout)
vibe.trackConversion({
  contentId: 'project-123',
  userId: user.walletAddress,
  value: 10.00,  // USDC value
});`;

export function PublisherIntegrationScreen() {
  const [highlightPhase, setHighlightPhase] = useState<'remix' | 'share' | 'pause'>('remix');
  
  useEffect(() => {
    const cycle = () => {
      setHighlightPhase('remix');
      setTimeout(() => setHighlightPhase('share'), 2000);
      setTimeout(() => setHighlightPhase('pause'), 4000);
    };
    cycle();
    const interval = setInterval(cycle, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Content Tracking
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Platforms and creators can add viral rewards to projects in minutes.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        {/* Content Examples - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Andromeda Example */}
          <Card className="p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-foreground text-base">Solar System Visualization</h3>
                <p className="text-xs text-muted-foreground">Interactive 3D solar system visualization</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Created by</span>
                <img src={mattProfileImg} alt="Matt" className="h-6 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Button size="sm" variant="outline" className="text-xs h-8 px-4 text-orange-500 border-orange-500">
                View App
              </Button>
              <Button size="sm" variant="outline" className={`text-xs h-8 px-4 transition-all duration-300 ${highlightPhase === 'remix' ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-background' : ''}`}>
                Remix Template
              </Button>
              <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> 3,214
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" /> 6
                </span>
              </div>
            </div>
            <div className="rounded-md overflow-hidden">
              <img 
                src={andromedaImg} 
                alt="Andromeda Galaxy Visualization" 
                className="w-full h-32 object-cover object-bottom"
              />
            </div>
          </Card>

          {/* 3iAtlas Example */}
          <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 relative">
            <img 
              src={atlasImg} 
              alt="3iAtlas Provenance Tracker" 
              className="w-full h-60 object-cover object-top"
            />
            {/* Highlight overlay for Share on X button */}
            <div className={`absolute top-[5px] left-[72px] w-[82px] h-[24px] rounded-sm transition-all duration-300 pointer-events-none ${highlightPhase === 'share' ? 'ring-2 ring-red-500' : 'ring-0'}`} />
          </Card>
        </motion.div>

        {/* Code Block - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-4 bg-slate-950 border-slate-800 h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-slate-400 ml-2">vibecard-integration.ts</span>
            </div>
            <pre className="text-[9px] md:text-[11px] text-slate-300 overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
