import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Zap, Loader2, CheckCircle, Plus, Minus, Activity, DollarSign, GitBranch, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface WalletInfo {
  id: string;
  address: string;
  name: string;
  blockchain: string;
  state: string;
  balance?: string;
}

interface ViralAction {
  id: string;
  timestamp: number;
  actionType: string;
  actorName: string;
  actorWalletAddress?: string;
  upstreamActionId?: string;
  contentId: string;
  reward?: string;
}

interface TransactionLog {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  amount: string;
  status: string;
  txHash?: string;
}

interface PayoutSplit {
  recipient: string;
  recipientAddress: string;
  amount: string;
  role: string;
  error?: string;
  transaction?: TransactionLog;
}

interface DemoState {
  initialized: boolean;
  treasury: WalletInfo | null;
  participants: { name: string; action: ViralAction | null; wallet: WalletInfo | null }[];
  currentStep: number;
  isLoading: boolean;
  latestSplits: PayoutSplit[];
  transactionLogs: TransactionLog[];
  apiResponses: { endpoint: string; timestamp: number; data: any }[];
}

interface ControlSettings {
  kFactor: number;
  conversionValue: number;
  decayRate: number;
}

const DEMO_PARTICIPANTS = [
  { name: "Matt P", role: "Creator", color: "#22c55e" },
  { name: "Pete", role: "Remixer", color: "#3b82f6" },
  { name: "Manny", role: "Sharer", color: "#a855f7" },
  { name: "Francisco", role: "Converter", color: "#f59e0b" },
];

function FlowVisualization({ 
  treasury, 
  participants, 
  splits,
  isAnimating 
}: { 
  treasury: WalletInfo | null;
  participants: DemoState['participants'];
  splits: PayoutSplit[];
  isAnimating: boolean;
}) {
  const { width, height } = { width: 700, height: 300 };
  const centerX = 80;
  const centerY = height / 2;
  const nodeRadius = 35;

  const walletNodes = DEMO_PARTICIPANTS.map((p, i) => {
    const participant = participants[i];
    const split = splits.find(s => s.recipient === p.name);
    const angle = ((i - 1.5) / 3) * Math.PI * 0.6;
    const radius = 220;
    return {
      ...p,
      x: centerX + radius + Math.cos(angle) * radius * 0.8,
      y: centerY + Math.sin(angle) * radius * 0.6,
      participant,
      split,
      config: p,
    };
  });

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8"/>
        </linearGradient>
      </defs>

      {treasury && (
        <g filter="url(#glow)">
          <circle cx={centerX} cy={centerY} r={nodeRadius + 5} fill="#0f172a" stroke="#22c55e" strokeWidth="2"/>
          <text x={centerX} y={centerY - 8} textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">TREASURY</text>
          <text x={centerX} y={centerY + 8} textAnchor="middle" fill="#64748b" fontSize="9">
            {treasury.address.slice(0, 6)}...
          </text>
        </g>
      )}

      {walletNodes.map((node, i) => {
        const hasWallet = !!node.participant?.wallet;
        return (
          <g key={node.name}>
            <path
              d={`M ${centerX + nodeRadius + 5} ${centerY} Q ${(centerX + node.x) / 2} ${centerY} ${node.x - nodeRadius} ${node.y}`}
              fill="none"
              stroke={hasWallet ? node.config.color : "#334155"}
              strokeWidth="2"
              strokeDasharray={hasWallet ? "none" : "5,5"}
              opacity={hasWallet ? 0.8 : 0.3}
            />
            
            <g filter={hasWallet ? "url(#glow)" : undefined}>
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={nodeRadius} 
                fill="#0f172a" 
                stroke={hasWallet ? node.config.color : "#334155"} 
                strokeWidth="2"
              />
              <text x={node.x} y={node.y - 12} textAnchor="middle" fill="#64748b" fontSize="9">
                {node.config.role.toUpperCase()}
              </text>
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                {node.name}
              </text>
              {node.split && (
                <text x={node.x} y={node.y + 18} textAnchor="middle" fill={node.config.color} fontSize="10" fontWeight="bold">
                  +${node.split.amount}
                </text>
              )}
            </g>
          </g>
        );
      })}

      {!treasury && (
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#64748b" fontSize="14">
          Click "Initialize Demo" to start
        </text>
      )}
    </svg>
  );
}

export function LiveDemoScreen() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ControlSettings>({
    kFactor: 1.2,
    conversionValue: 20,
    decayRate: 0.5,
  });
  
  const [demoState, setDemoState] = useState<DemoState>({
    initialized: false,
    treasury: null,
    participants: DEMO_PARTICIPANTS.map(p => ({ name: p.name, action: null, wallet: null })),
    currentStep: -1,
    isLoading: false,
    latestSplits: [],
    transactionLogs: [],
    apiResponses: [],
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [activeLogTab, setActiveLogTab] = useState<'txs' | 'wallets' | 'api'>('txs');

  const stats = {
    totalDistributed: demoState.latestSplits.reduce((sum, s) => sum + parseFloat(s.amount || "0"), 0),
    avgLatency: 246,
    participantCount: demoState.participants.filter(p => p.action).length,
  };

  const calculateProjectedReach = (k: number, initialShares: number = 10, generations: number = 5) => {
    let total = initialShares;
    let current = initialShares;
    for (let i = 0; i < generations; i++) {
      current = current * k;
      total += current;
    }
    return Math.round(total);
  };

  const projectedReach = calculateProjectedReach(settings.kFactor);

  useEffect(() => {
    const syncSettings = async () => {
      try {
        await fetch("/api/demo/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversionValue: settings.conversionValue,
            decayRate: settings.decayRate,
          }),
        });
      } catch (error) {
        console.error("Failed to sync settings:", error);
      }
    };
    
    if (demoState.initialized) {
      syncSettings();
    }
  }, [settings.conversionValue, settings.decayRate, demoState.initialized]);

  const logApiResponse = useCallback((endpoint: string, data: any) => {
    setDemoState(prev => ({
      ...prev,
      apiResponses: [...prev.apiResponses, { endpoint, timestamp: Date.now(), data }].slice(-20),
    }));
  }, []);

  const initDemo = async () => {
    setDemoState(prev => ({ ...prev, isLoading: true }));
    try {
      const resetRes = await fetch("/api/demo/reset", { method: "POST" });
      await resetRes.json();
      
      const response = await fetch("/api/demo/init", { method: "POST" });
      const data = await response.json();
      logApiResponse("POST /api/demo/init", data);
      
      if (data.success) {
        setDemoState(prev => ({
          ...prev,
          initialized: true,
          treasury: data.treasury,
          isLoading: false,
          currentStep: -1,
          participants: DEMO_PARTICIPANTS.map(p => ({ name: p.name, action: null, wallet: null })),
          latestSplits: [],
        }));
        toast({ title: "Demo initialized!", description: `Treasury: ${data.treasury.address.slice(0, 10)}...` });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to initialize demo", variant: "destructive" });
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resetDemo = async () => {
    setDemoState(prev => ({ ...prev, isLoading: true }));
    try {
      await fetch("/api/demo/reset", { method: "POST" });
      setDemoState({
        initialized: false,
        treasury: null,
        participants: DEMO_PARTICIPANTS.map(p => ({ name: p.name, action: null, wallet: null })),
        currentStep: -1,
        isLoading: false,
        latestSplits: [],
        transactionLogs: [],
        apiResponses: [],
      });
      toast({ title: "Demo reset" });
    } catch (error) {
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const runStep = async (stepIndex: number) => {
    const participant = DEMO_PARTICIPANTS[stepIndex];
    const endpoints = ["/api/demo/create", "/api/demo/remix", "/api/demo/share", "/api/demo/convert"];
    
    setDemoState(prev => ({ ...prev, isLoading: true }));
    setIsAnimating(true);
    
    try {
      const response = await fetch(endpoints[stepIndex], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorName: participant.name }),
      });
      const data = await response.json();
      logApiResponse(`POST ${endpoints[stepIndex]}`, data);
      
      if (data.success) {
        setDemoState(prev => {
          const newParticipants = [...prev.participants];
          newParticipants[stepIndex] = {
            ...newParticipants[stepIndex],
            action: data.action,
            wallet: data.wallet,
          };
          
          return {
            ...prev,
            participants: newParticipants,
            currentStep: stepIndex,
            isLoading: false,
            latestSplits: data.splits || prev.latestSplits,
          };
        });
        
        const actionType = stepIndex === 0 ? "created content" : stepIndex === 3 ? "converted" : stepIndex === 1 ? "remixed" : "shared";
        toast({ 
          title: `${participant.name} ${actionType}!`, 
          description: stepIndex === 3 ? "Rewards distributed!" : `Wallet: ${data.wallet.address.slice(0, 10)}...` 
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
    
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const runFullShareDemo = async () => {
    setDemoState(prev => ({ ...prev, isLoading: true }));
    setIsAnimating(true);
    
    try {
      // Step 0: Initialize if needed
      if (!demoState.initialized) {
        const resetRes = await fetch("/api/demo/reset", { method: "POST" });
        await resetRes.json();
        
        const initRes = await fetch("/api/demo/init", { method: "POST" });
        const initData = await initRes.json();
        logApiResponse("POST /api/demo/init", initData);
        
        if (initData.success) {
          setDemoState(prev => ({
            ...prev,
            initialized: true,
            treasury: initData.treasury,
          }));
        }
      }

      // Run steps 0, 1, 2 (Create, Remix, Share)
      const endpoints = ["/api/demo/create", "/api/demo/remix", "/api/demo/share"];
      const participants = DEMO_PARTICIPANTS;
      
      for (let i = 0; i <= 2; i++) {
        const response = await fetch(endpoints[i], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actorName: participants[i].name }),
        });
        const data = await response.json();
        logApiResponse(`POST ${endpoints[i]}`, data);
        
        if (data.success) {
          setDemoState(prev => {
            const newParticipants = [...prev.participants];
            newParticipants[i] = {
              ...newParticipants[i],
              action: data.action,
              wallet: data.wallet,
            };
            return {
              ...prev,
              participants: newParticipants,
              currentStep: i,
              latestSplits: data.splits || prev.latestSplits,
            };
          });
        }
        
        // Small delay between steps for visual effect
        await new Promise(r => setTimeout(r, 400));
      }
      
      toast({ title: "Share tracked!", description: "SDK call completed - chain recorded" });
    } catch (error) {
      toast({ title: "Error", description: "Demo failed", variant: "destructive" });
    }
    
    setDemoState(prev => ({ ...prev, isLoading: false }));
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0a0a0f] px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">VibeCard Live Demo</h1>
          <p className="text-muted-foreground">Viral Rewards Network powered by Circle USDC on Base Sepolia</p>
          <Badge variant="outline" className="mt-2 border-cyan-500/50 text-cyan-400">
            Testnet Mode
          </Badge>
        </motion.div>

        {/* Tracking Code Demo - 3 Column Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-[#0c0c14] border-border/30">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${demoState.isLoading ? 'bg-amber-500 animate-pulse' : demoState.currentStep >= 2 ? 'bg-emerald-500' : 'bg-slate-500'}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">SDK Integration Demo</span>
              {demoState.currentStep >= 2 && (
                <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-xs">
                  trackShare() Complete
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Button */}
              <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${demoState.isLoading ? 'bg-amber-500/10 border-amber-500/50' : demoState.currentStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800/30 border-border/30'}`}>
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] flex items-center justify-center">1</span>
                  User Action
                </div>
                <Button 
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                  onClick={() => runFullShareDemo()}
                  disabled={demoState.isLoading || demoState.currentStep >= 2}
                  data-testid="button-share-demo"
                >
                  {demoState.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : demoState.currentStep >= 2 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {demoState.currentStep >= 2 ? 'Shared!' : 'Share & Earn'}
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">Pete's Remix</p>
              </div>
              
              {/* Step 2: Code Executing */}
              <div className={`font-mono text-[11px] rounded-lg p-3 border transition-all ${demoState.isLoading && demoState.currentStep === 1 ? 'bg-amber-500/10 border-amber-500/50' : demoState.currentStep >= 2 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/80 border-border/30'}`}>
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] flex items-center justify-center">2</span>
                  SDK Call
                  {demoState.isLoading && demoState.currentStep === 1 && (
                    <Loader2 className="h-3 w-3 animate-spin ml-auto text-amber-400" />
                  )}
                </div>
                <div className={demoState.isLoading && demoState.currentStep === 1 ? 'animate-pulse' : ''}>
                  <span className="text-purple-400">await</span>
                  <span className="text-cyan-400"> vibecard</span>
                  <span className="text-foreground">.</span>
                  <span className="text-yellow-400">trackShare</span>
                  <span className="text-foreground">({"{"}</span>
                </div>
                <div className="pl-2">
                  <span className="text-emerald-400">contentId</span>
                  <span className="text-foreground">: </span>
                  <span className="text-amber-300">"remix-001"</span>
                </div>
                <div className="pl-2">
                  <span className="text-emerald-400">sharerId</span>
                  <span className="text-foreground">: </span>
                  <span className="text-amber-300">"manny"</span>
                </div>
                <div><span className="text-foreground">{"}"})</span></div>
              </div>

              {/* Step 3: Result */}
              <div className={`font-mono text-[11px] rounded-lg p-3 border transition-all ${demoState.currentStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900/80 border-border/30'}`}>
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] flex items-center justify-center">3</span>
                  Response
                  {demoState.currentStep >= 2 && (
                    <CheckCircle className="h-3 w-3 ml-auto text-emerald-400" />
                  )}
                </div>
                {demoState.currentStep >= 2 ? (
                  <div className="space-y-1">
                    <div><span className="text-emerald-400">success</span>: <span className="text-cyan-400">true</span></div>
                    <div><span className="text-emerald-400">actionId</span>: <span className="text-amber-300">"{demoState.participants[2]?.action?.id?.slice(0, 8) || 'share-001'}"</span></div>
                    <div><span className="text-emerald-400">chain</span>: <span className="text-foreground">[Matt P, Pete, Manny]</span></div>
                    <div><span className="text-emerald-400">wallet</span>: <span className="text-cyan-400">{demoState.participants[2]?.wallet?.address?.slice(0, 10) || '0x...'}...</span></div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">Waiting for action...</div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Visualization Section with Initialize Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-4 bg-[#0c0c14] border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                USDC Flow Visualization
              </h3>
              <div className="flex items-center gap-3">
                {stats.totalDistributed > 0 && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                    Total: ${stats.totalDistributed.toFixed(2)} USDC
                  </Badge>
                )}
                {!demoState.initialized ? (
                  <Button onClick={initDemo} disabled={demoState.isLoading} className="gap-2" data-testid="button-init-demo">
                    {demoState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Initialize Demo
                  </Button>
                ) : (
                  <Button variant="outline" onClick={resetDemo} disabled={demoState.isLoading} className="gap-2" data-testid="button-reset-demo">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
            
            <FlowVisualization
              treasury={demoState.treasury}
              participants={demoState.participants}
              splits={demoState.latestSplits}
              isAnimating={isAnimating}
            />

            {demoState.initialized && (
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="text-xs text-center text-muted-foreground mb-3">
                  Treasury: <span className="text-cyan-400 font-mono">{demoState.treasury?.address.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-center gap-3 flex-wrap">
                  {DEMO_PARTICIPANTS.map((p, index) => (
                    <Button
                      key={p.name}
                      onClick={() => runStep(index)}
                      disabled={demoState.isLoading || demoState.currentStep >= index || (index > 0 && demoState.currentStep < index - 1)}
                      variant={demoState.currentStep >= index ? "secondary" : "default"}
                      className="gap-2"
                      style={{ borderColor: demoState.currentStep >= index ? p.color : undefined }}
                      data-testid={`button-step-${index}`}
                    >
                      {demoState.isLoading && demoState.currentStep === index - 1 ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : demoState.currentStep >= index ? (
                        <CheckCircle className="h-4 w-4" style={{ color: p.color }} />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      {p.name} ({p.role})
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* K-Factor Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-[#0c0c14] border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* K-Factor */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase">K-Factor (Viral Coefficient)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSettings(s => ({ ...s, kFactor: Math.max(0.5, s.kFactor - 0.1) }))} data-testid="button-kfactor-minus">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className={`font-mono text-xl font-bold flex-1 text-center ${settings.kFactor >= 1 ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {settings.kFactor.toFixed(1)}
                  </span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSettings(s => ({ ...s, kFactor: Math.min(2.0, s.kFactor + 0.1) }))} data-testid="button-kfactor-plus">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">Projected Reach: {projectedReach}</p>
              </div>

              {/* Conversion Value */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase">Conversion Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSettings(s => ({ ...s, conversionValue: Math.max(5, s.conversionValue - 5) }))} data-testid="button-conversion-minus">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-mono text-xl font-bold flex-1 text-center text-foreground">${settings.conversionValue}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSettings(s => ({ ...s, conversionValue: Math.min(100, s.conversionValue + 5) }))} data-testid="button-conversion-plus">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Slider value={[settings.conversionValue]} min={5} max={100} step={5} onValueChange={([v]) => setSettings(s => ({ ...s, conversionValue: v }))} className="mt-2" />
              </div>

              {/* Decay Rate */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase">Decay Rate</span>
                </div>
                <span className="font-mono text-xl font-bold block text-center text-foreground">{(settings.decayRate * 100).toFixed(0)}%</span>
                <Slider value={[settings.decayRate]} min={0.3} max={0.7} step={0.05} onValueChange={([v]) => setSettings(s => ({ ...s, decayRate: v }))} className="mt-2" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payout Summary */}
        {demoState.latestSplits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
              <h3 className="text-sm font-semibold text-foreground mb-3">Reward Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {demoState.latestSplits.map(split => (
                  <div key={split.recipient} className="text-center">
                    <p className="text-xs text-muted-foreground">{split.role}</p>
                    <p className="font-semibold text-sm text-foreground">{split.recipient}</p>
                    <p className="font-mono font-bold text-emerald-400">+${split.amount}</p>
                    {split.error && <p className="text-xs text-red-400 mt-1">Needs USDC</p>}
                  </div>
                ))}
                <div className="text-center border-l border-border/50 pl-4">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-mono font-bold text-lg text-cyan-400">${stats.totalDistributed.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-[#0c0c14] border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Live Logs</span>
              <div className="flex gap-1 ml-auto">
                {(['txs', 'wallets', 'api'] as const).map(tab => (
                  <Button
                    key={tab}
                    variant={activeLogTab === tab ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setActiveLogTab(tab)}
                  >
                    {tab === 'txs' ? 'Splits' : tab === 'wallets' ? 'Wallets' : 'API'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-40 overflow-y-auto font-mono text-xs space-y-2">
              {activeLogTab === 'txs' && (
                demoState.latestSplits.length === 0 ? (
                  <p className="text-muted-foreground">No transactions yet...</p>
                ) : (
                  demoState.latestSplits.map((split, i) => (
                    <div key={i} className="p-2 rounded bg-slate-800/50 flex justify-between">
                      <span className="text-cyan-400">{split.role}</span>
                      <span className="text-foreground">{split.recipient}</span>
                      <span className="text-emerald-400">${split.amount}</span>
                      <span className={split.error ? "text-red-400" : "text-emerald-400"}>{split.error ? "Failed" : "OK"}</span>
                    </div>
                  ))
                )
              )}
              {activeLogTab === 'wallets' && (
                demoState.participants.filter(p => p.wallet).length === 0 ? (
                  <p className="text-muted-foreground">No wallets created yet...</p>
                ) : (
                  demoState.participants.filter(p => p.wallet).map((p, i) => (
                    <div key={i} className="p-2 rounded bg-slate-800/50">
                      <div className="flex justify-between">
                        <span className="text-foreground">{p.name}</span>
                        <span className="text-cyan-400">${p.wallet?.balance || '0.00'}</span>
                      </div>
                      <div className="text-muted-foreground truncate">{p.wallet?.address}</div>
                    </div>
                  ))
                )
              )}
              {activeLogTab === 'api' && (
                demoState.apiResponses.length === 0 ? (
                  <p className="text-muted-foreground">No API calls yet...</p>
                ) : (
                  demoState.apiResponses.map((resp, i) => (
                    <div key={i} className="p-2 rounded bg-blue-500/10">
                      <div className="flex justify-between mb-1">
                        <span className="text-blue-400">{resp.endpoint}</span>
                        <span className="text-muted-foreground">{new Date(resp.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <pre className="text-muted-foreground overflow-x-auto">{JSON.stringify(resp.data, null, 1).slice(0, 150)}...</pre>
                    </div>
                  ))
                )
              )}
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
