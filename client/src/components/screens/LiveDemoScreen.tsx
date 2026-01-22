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

  // Viral spread simulation state
  interface ViralNode {
    id: string;
    x: number;
    y: number;
    parentX: number;
    parentY: number;
    active: boolean;
    reward: string;
  }
  const [viralSpreadActive, setViralSpreadActive] = useState(false);
  const [viralNodes, setViralNodes] = useState<ViralNode[]>([]);

  const startViralSpread = () => {
    setViralSpreadActive(true);
    setViralNodes([]);
    
    // Generate tree of nodes based on K-factor
    const centerX = 160;
    const centerY = 160;
    const nodeQueue: { x: number; y: number; depth: number; angle: number }[] = [];
    const generatedNodes: ViralNode[] = [];
    
    // First generation from center
    const numChildren = Math.round(settings.kFactor * 2);
    for (let i = 0; i < numChildren; i++) {
      const angle = (i / numChildren) * Math.PI * 2;
      const radius = 80;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      nodeQueue.push({ x, y, depth: 1, angle });
      generatedNodes.push({
        id: `node-${generatedNodes.length}`,
        x, y,
        parentX: centerX,
        parentY: centerY,
        active: false,
        reward: (settings.conversionValue * 0.4 * Math.pow(settings.decayRate, 0)).toFixed(2),
      });
    }
    
    // Second and third generations
    let processed = 0;
    while (processed < nodeQueue.length && generatedNodes.length < 20) {
      const parent = nodeQueue[processed];
      if (parent.depth < 3) {
        const childCount = Math.max(1, Math.round(settings.kFactor));
        for (let i = 0; i < childCount && generatedNodes.length < 20; i++) {
          const spreadAngle = parent.angle + (i - (childCount - 1) / 2) * 0.5;
          const radius = 50;
          const x = parent.x + Math.cos(spreadAngle) * radius;
          const y = parent.y + Math.sin(spreadAngle) * radius;
          if (x > 10 && x < 310 && y > 10 && y < 310) {
            nodeQueue.push({ x, y, depth: parent.depth + 1, angle: spreadAngle });
            generatedNodes.push({
              id: `node-${generatedNodes.length}`,
              x, y,
              parentX: parent.x,
              parentY: parent.y,
              active: false,
              reward: (settings.conversionValue * 0.4 * Math.pow(settings.decayRate, parent.depth)).toFixed(2),
            });
          }
        }
      }
      processed++;
    }
    
    setViralNodes(generatedNodes);
    
    // Animate nodes appearing one by one
    generatedNodes.forEach((_, index) => {
      setTimeout(() => {
        setViralNodes(prev => prev.map((n, i) => i === index ? { ...n, active: true } : n));
      }, (index + 1) * 300);
    });
    
    // Stop animation after all nodes are active
    setTimeout(() => {
      setViralSpreadActive(false);
    }, (generatedNodes.length + 1) * 300);
  };

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
    setDemoState(prev => ({ ...prev, isLoading: true, currentStep: 0 }));
    setIsAnimating(true);
    
    try {
      // Reset and initialize
      await fetch("/api/demo/reset", { method: "POST" });
      
      const initRes = await fetch("/api/demo/init", { method: "POST" });
      const initData = await initRes.json();
      
      if (!initData.success) {
        throw new Error("Init failed");
      }
      
      setDemoState(prev => ({
        ...prev,
        initialized: true,
        treasury: initData.treasury,
      }));

      // Step 1: Create content (Matt P)
      const createRes = await fetch("/api/demo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorName: DEMO_PARTICIPANTS[0].name }),
      });
      const createData = await createRes.json();
      
      if (!createData.success) {
        throw new Error("Create failed");
      }
      
      const createActionId = createData.action.id;
      
      // Step 2: Remix (Pete)
      const remixRes = await fetch("/api/demo/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          actorName: DEMO_PARTICIPANTS[1].name,
          upstreamActionId: createActionId,
        }),
      });
      const remixData = await remixRes.json();
      
      if (!remixData.success) {
        throw new Error("Remix failed");
      }
      
      const remixActionId = remixData.action.id;
      
      // Step 3: Share (Manny) - This triggers rewards
      setDemoState(prev => ({ ...prev, currentStep: 1 }));
      
      const shareRes = await fetch("/api/demo/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          actorName: DEMO_PARTICIPANTS[2].name,
          upstreamActionId: remixActionId,
        }),
      });
      const shareData = await shareRes.json();
      logApiResponse("POST /api/demo/share", shareData);
      
      if (shareData.success) {
        setDemoState(prev => {
          const newParticipants = [...prev.participants];
          newParticipants[2] = {
            ...newParticipants[2],
            action: shareData.action,
            wallet: shareData.wallet,
          };
          return {
            ...prev,
            participants: newParticipants,
            currentStep: 2,
            latestSplits: shareData.splits || [],
          };
        });
        
      }
    } catch (error) {
      console.error("Demo error:", error);
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
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">VibeCard Live Demo</h1>
          <p className="text-white/70">Viral Rewards Network powered by Circle USDC on Base Sepolia (Testnet)</p>
        </motion.div>

        {/* SECTION 1: Tracking Mechanics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5 bg-[#0c0c14] border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${demoState.isLoading ? 'bg-amber-500 animate-pulse' : demoState.currentStep >= 2 ? 'bg-emerald-500' : 'bg-white/30'}`} />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">Step 1: Tracking Mechanics</span>
              </div>
              {demoState.currentStep >= 2 && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-xs">
                  Rewards Triggered
                </Badge>
              )}
            </div>

            {/* Pre-completed steps */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-white/80 text-sm">Create</span>
                <span className="text-white/50 text-xs">(Matt P)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-white/80 text-sm">Remix</span>
                <span className="text-white/50 text-xs">(Pete)</span>
              </div>
              <span className="text-white/30 text-xs ml-2">← Pre-completed for demo</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Button */}
              <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${demoState.isLoading || demoState.currentStep >= 1 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}>
                <div className="text-xs text-white/60 mb-2 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center text-white">1</span>
                  User Action
                </div>
                <Button 
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                  onClick={() => runFullShareDemo()}
                  disabled={demoState.isLoading}
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
                <p className="text-[10px] text-white/50 mt-2 text-center">Manny shares Pete's remix</p>
              </div>
              
              {/* Step 2: Code Executing */}
              <div className={`font-mono text-[11px] rounded-lg p-3 border transition-all ${demoState.currentStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/50' : demoState.isLoading ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-black/50 border-white/10'}`}>
                <div className="text-xs text-white/60 mb-2 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center text-white">2</span>
                  SDK Call
                  {demoState.isLoading && (
                    <Loader2 className="h-3 w-3 animate-spin ml-auto text-emerald-400" />
                  )}
                </div>
                {(demoState.isLoading || demoState.currentStep >= 1) ? (
                  <div className={demoState.isLoading ? 'animate-pulse' : ''}>
                    <div>
                      <span className="text-purple-400">await</span>
                      <span className="text-cyan-400"> vibecard</span>
                      <span className="text-white">.</span>
                      <span className="text-yellow-400">trackShare</span>
                      <span className="text-white">({"{"}</span>
                    </div>
                    <div className="pl-2">
                      <span className="text-emerald-400">contentId</span>
                      <span className="text-white">: </span>
                      <span className="text-amber-300">"remix-001"</span>
                    </div>
                    <div className="pl-2">
                      <span className="text-emerald-400">sharerId</span>
                      <span className="text-white">: </span>
                      <span className="text-amber-300">"manny"</span>
                    </div>
                    <div><span className="text-white">{"}"})</span></div>
                  </div>
                ) : (
                  <div className="text-white/30 italic">Click button to execute...</div>
                )}
              </div>

              {/* Step 3: Result */}
              <div className={`font-mono text-[11px] rounded-lg p-3 border transition-all ${demoState.currentStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-black/50 border-white/10'}`}>
                <div className="text-xs text-white/60 mb-2 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center text-white">3</span>
                  Response
                  {demoState.currentStep >= 2 && (
                    <CheckCircle className="h-3 w-3 ml-auto text-emerald-400" />
                  )}
                </div>
                {demoState.currentStep >= 2 ? (
                  <div className="space-y-1">
                    <div><span className="text-emerald-400">success</span>: <span className="text-cyan-400">true</span></div>
                    <div><span className="text-emerald-400">actionId</span>: <span className="text-amber-300">"{demoState.participants[2]?.action?.id?.slice(0, 8) || 'share-001'}"</span></div>
                    <div><span className="text-emerald-400">chain</span>: <span className="text-white">[Matt P, Pete, Manny]</span></div>
                    <div><span className="text-emerald-400">wallet</span>: <span className="text-cyan-400 text-[10px]">{demoState.participants[2]?.wallet?.address || '0x...'}</span></div>
                  </div>
                ) : (
                  <div className="text-white/30 italic">Waiting...</div>
                )}
              </div>
            </div>

            {/* Reward Distribution appears after share */}
            {demoState.latestSplits.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">Reward Distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {demoState.latestSplits.map(split => (
                    <div key={split.recipient} className="text-center">
                      <p className="text-xs text-white/50">{split.role}</p>
                      <p className="font-semibold text-sm text-white">{split.recipient}</p>
                      <p className="font-mono font-bold text-emerald-400">+${split.amount}</p>
                    </div>
                  ))}
                  <div className="text-center border-l border-white/10 pl-4">
                    <p className="text-xs text-white/50">Total</p>
                    <p className="font-mono font-bold text-lg text-cyan-400">${stats.totalDistributed.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* SECTION 2: Viral Spread Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 bg-[#0c0c14] border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${viralSpreadActive ? 'bg-cyan-500 animate-pulse' : 'bg-white/30'}`} />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">Step 2: Viral Spread Simulation</span>
              </div>
              <Button 
                className="gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                onClick={() => startViralSpread()}
                disabled={viralSpreadActive}
                data-testid="button-start-viral-spread"
              >
                {viralSpreadActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Start Viral Spread
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mind Map Visualization */}
              <div className="relative h-80 bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                <svg className="w-full h-full">
                  {/* Central node */}
                  <g>
                    <circle cx="160" cy="160" r="30" fill="#22c55e" opacity="0.8" />
                    <text x="160" y="165" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ORIGIN</text>
                  </g>
                  
                  {/* Spread nodes */}
                  {viralNodes.map((node, i) => (
                    <g key={node.id}>
                      {/* Connection line with animated synapse */}
                      <line 
                        x1={node.parentX} 
                        y1={node.parentY} 
                        x2={node.x} 
                        y2={node.y} 
                        stroke={node.active ? "#06b6d4" : "#ffffff20"} 
                        strokeWidth="1"
                      />
                      {node.active && (
                        <motion.circle
                          cx={node.parentX}
                          cy={node.parentY}
                          r="3"
                          fill="#06b6d4"
                          initial={{ cx: node.parentX, cy: node.parentY }}
                          animate={{ cx: node.x, cy: node.y }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      )}
                      {/* Node */}
                      <motion.circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.active ? 15 : 10} 
                        fill={node.active ? "#06b6d4" : "#ffffff20"}
                        initial={{ scale: 0 }}
                        animate={{ scale: node.active ? 1 : 0.5 }}
                        transition={{ duration: 0.3 }}
                      />
                      {node.active && (
                        <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                          ${node.reward}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
                
                {!viralSpreadActive && viralNodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/40 text-sm">Click "Start Viral Spread" to begin</p>
                  </div>
                )}
              </div>

              {/* Stats Panel */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs text-white/60 uppercase">K-Factor</span>
                  </div>
                  <span className={`font-mono text-3xl font-bold ${settings.kFactor >= 1 ? "text-emerald-400" : "text-white/60"}`}>
                    {settings.kFactor.toFixed(1)}
                  </span>
                  <p className="text-xs text-white/40 mt-1">Viral coefficient</p>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="h-4 w-4 text-purple-400" />
                    <span className="text-xs text-white/60 uppercase">Network Reach</span>
                  </div>
                  <span className="font-mono text-3xl font-bold text-white">
                    {viralNodes.filter(n => n.active).length + 1}
                  </span>
                  <p className="text-xs text-white/40 mt-1">Wallets created</p>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-white/60 uppercase">Total Distributed</span>
                  </div>
                  <span className="font-mono text-3xl font-bold text-emerald-400">
                    ${viralNodes.filter(n => n.active).reduce((sum, n) => sum + parseFloat(n.reward), 0).toFixed(2)}
                  </span>
                  <p className="text-xs text-white/40 mt-1">USDC rewards paid</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-[#0c0c14] border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Live Logs</span>
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
                  <p className="text-white/40">No transactions yet...</p>
                ) : (
                  demoState.latestSplits.map((split, i) => (
                    <div key={i} className="p-2 rounded bg-white/5 flex justify-between">
                      <span className="text-cyan-400">{split.role}</span>
                      <span className="text-white">{split.recipient}</span>
                      <span className="text-emerald-400">${split.amount}</span>
                      <span className={split.error ? "text-red-400" : "text-emerald-400"}>{split.error ? "Failed" : "OK"}</span>
                    </div>
                  ))
                )
              )}
              {activeLogTab === 'wallets' && (
                demoState.participants.filter(p => p.wallet).length === 0 ? (
                  <p className="text-white/40">No wallets created yet...</p>
                ) : (
                  demoState.participants.filter(p => p.wallet).map((p, i) => (
                    <div key={i} className="p-2 rounded bg-white/5">
                      <div className="flex justify-between">
                        <span className="text-white">{p.name}</span>
                        <span className="text-cyan-400">${p.wallet?.balance || '0.00'}</span>
                      </div>
                      <div className="text-white/50 truncate">{p.wallet?.address}</div>
                    </div>
                  ))
                )
              )}
              {activeLogTab === 'api' && (
                demoState.apiResponses.length === 0 ? (
                  <p className="text-white/40">No API calls yet...</p>
                ) : (
                  demoState.apiResponses.map((resp, i) => (
                    <div key={i} className="p-2 rounded bg-blue-500/10">
                      <div className="flex justify-between mb-1">
                        <span className="text-blue-400">{resp.endpoint}</span>
                        <span className="text-white/50">{new Date(resp.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <pre className="text-white/50 overflow-x-auto">{JSON.stringify(resp.data, null, 1).slice(0, 150)}...</pre>
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
