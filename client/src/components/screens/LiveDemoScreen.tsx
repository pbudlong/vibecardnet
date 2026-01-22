import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Wallet, Zap, Loader2, CheckCircle, AlertCircle, Plus, Minus, Activity, Clock, DollarSign, GitBranch, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: Math.max(width, 400), height: Math.max(height, 300) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;
  const centerX = 80;
  const centerY = height / 2;
  const nodeRadius = 32;
  const endX = width - 80;
  
  const nodePositions = DEMO_PARTICIPANTS.map((_, index) => ({
    x: endX,
    y: 60 + (index * (height - 120) / 3),
  }));

  const getSplit = (name: string) => splits.find(s => s.recipient === name);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full" 
      viewBox={`0 0 ${width} ${height}`}
      style={{ minHeight: 300 }}
      data-testid="flow-visualization"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4"/>
        </linearGradient>
        {DEMO_PARTICIPANTS.map((p, i) => (
          <linearGradient key={p.name} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6"/>
            <stop offset="100%" stopColor={p.color} stopOpacity="0.8"/>
          </linearGradient>
        ))}
      </defs>

      {treasury && nodePositions.map((pos, index) => {
        const split = getSplit(DEMO_PARTICIPANTS[index].name);
        const isActive = !!split;
        const controlX1 = centerX + (endX - centerX) * 0.3;
        const controlY1 = centerY;
        const controlX2 = centerX + (endX - centerX) * 0.7;
        const controlY2 = pos.y;
        
        const pathD = `M ${centerX} ${centerY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${pos.x} ${pos.y}`;
        
        return (
          <g key={index}>
            <path
              d={pathD}
              fill="none"
              stroke={isActive ? `url(#gradient-${index})` : "#334155"}
              strokeWidth={isActive ? 3 : 1.5}
              strokeOpacity={isActive ? 1 : 0.3}
              filter={isActive ? "url(#glow)" : undefined}
            />
            {isActive && (
              <>
                <circle r="4" fill="#22d3ee" filter="url(#glow)">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={pathD}
                  />
                </circle>
                <circle r="3" fill="#22d3ee" filter="url(#glow)">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={pathD}
                    begin="0.5s"
                  />
                </circle>
              </>
            )}
          </g>
        );
      })}

      {treasury && (
        <g filter="url(#glowStrong)">
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={nodeRadius + 8} 
            fill="#0ea5e9" 
            fillOpacity="0.2"
          />
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={nodeRadius} 
            fill="#0c1929" 
            stroke="#22d3ee" 
            strokeWidth="2"
          />
          <text 
            x={centerX} 
            y={centerY - 8} 
            textAnchor="middle" 
            fill="#22d3ee" 
            fontSize="10" 
            fontFamily="monospace"
          >
            TREASURY
          </text>
          <text 
            x={centerX} 
            y={centerY + 8} 
            textAnchor="middle" 
            fill="#ffffff" 
            fontSize="11" 
            fontWeight="bold"
          >
            ${treasury.balance || "0.00"}
          </text>
        </g>
      )}

      {nodePositions.map((pos, index) => {
        const participant = participants[index];
        const config = DEMO_PARTICIPANTS[index];
        const split = getSplit(config.name);
        const isActive = !!participant?.action;
        const hasReward = !!split;

        return (
          <g key={config.name} filter={hasReward ? "url(#glowStrong)" : isActive ? "url(#glow)" : undefined}>
            {hasReward && (
              <circle 
                cx={pos.x} 
                cy={pos.y} 
                r={nodeRadius + 12} 
                fill={config.color} 
                fillOpacity="0.15"
              >
                <animate
                  attributeName="r"
                  values={`${nodeRadius + 8};${nodeRadius + 16};${nodeRadius + 8}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  values="0.15;0.25;0.15"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle 
              cx={pos.x} 
              cy={pos.y} 
              r={nodeRadius} 
              fill="#0c1929" 
              stroke={isActive ? config.color : "#334155"}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.5}
            />
            <text 
              x={pos.x} 
              y={pos.y - 10} 
              textAnchor="middle" 
              fill={isActive ? config.color : "#64748b"} 
              fontSize="9" 
              fontFamily="monospace"
            >
              {config.role.toUpperCase()}
            </text>
            <text 
              x={pos.x} 
              y={pos.y + 6} 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="10" 
              fontWeight="500"
            >
              {config.name}
            </text>
            {hasReward && (
              <text 
                x={pos.x} 
                y={pos.y + 20} 
                textAnchor="middle" 
                fill={config.color} 
                fontSize="11" 
                fontWeight="bold"
              >
                +${split.amount}
              </text>
            )}
            {participant?.wallet && (
              <text 
                x={pos.x} 
                y={pos.y + nodeRadius + 16} 
                textAnchor="middle" 
                fill="#64748b" 
                fontSize="8" 
                fontFamily="monospace"
              >
                {participant.wallet.address.slice(0, 6)}...{participant.wallet.address.slice(-4)}
              </text>
            )}
          </g>
        );
      })}

      {!treasury && (
        <text 
          x={width / 2} 
          y={height / 2} 
          textAnchor="middle" 
          fill="#64748b" 
          fontSize="14"
        >
          Initialize demo to start visualization
        </text>
      )}
    </svg>
  );
}

function ViralTreeVisualization({ 
  participants, 
  splits 
}: { 
  participants: DemoState['participants'];
  splits: PayoutSplit[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: Math.max(width, 400), height: Math.max(height, 300) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;
  const nodeRadius = 28;
  const horizontalSpacing = (width - 160) / 3;
  const startX = 80;
  const centerY = height / 2;

  const getSplit = (name: string) => splits.find(s => s.recipient === name);

  const nodes = DEMO_PARTICIPANTS.map((config, index) => ({
    x: startX + index * horizontalSpacing,
    y: centerY,
    config,
    participant: participants[index],
    split: getSplit(config.name),
  }));

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full" 
      viewBox={`0 0 ${width} ${height}`}
      style={{ minHeight: 300 }}
      data-testid="tree-visualization"
    >
      <defs>
        <filter id="treeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <marker 
          id="arrowhead" 
          markerWidth="10" 
          markerHeight="7" 
          refX="9" 
          refY="3.5" 
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
        </marker>
      </defs>

      {nodes.map((node, index) => {
        if (index === nodes.length - 1) return null;
        const nextNode = nodes[index + 1];
        const isActive = node.participant?.action && nextNode.participant?.action;
        
        return (
          <g key={`link-${index}`}>
            <line
              x1={node.x + nodeRadius}
              y1={node.y}
              x2={nextNode.x - nodeRadius - 10}
              y2={nextNode.y}
              stroke={isActive ? "#22d3ee" : "#334155"}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 0.8 : 0.3}
              markerEnd={isActive ? "url(#arrowhead)" : undefined}
              filter={isActive ? "url(#treeGlow)" : undefined}
            />
            {isActive && (
              <text
                x={(node.x + nextNode.x) / 2}
                y={node.y - 20}
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
                fontFamily="monospace"
              >
                {index === 0 ? "remix" : index === 1 ? "share" : "convert"}
              </text>
            )}
          </g>
        );
      })}

      {nodes.map((node, index) => {
        const isActive = !!node.participant?.action;
        const hasReward = !!node.split;
        
        return (
          <g key={node.config.name} filter={isActive ? "url(#treeGlow)" : undefined}>
            {hasReward && (
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={nodeRadius + 10} 
                fill={node.config.color} 
                fillOpacity="0.15"
              >
                <animate
                  attributeName="r"
                  values={`${nodeRadius + 6};${nodeRadius + 14};${nodeRadius + 6}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle 
              cx={node.x} 
              cy={node.y} 
              r={nodeRadius} 
              fill="#0c1929" 
              stroke={isActive ? node.config.color : "#334155"}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.4}
            />
            <text 
              x={node.x} 
              y={node.y - 6} 
              textAnchor="middle" 
              fill={isActive ? node.config.color : "#64748b"} 
              fontSize="8" 
              fontFamily="monospace"
            >
              {node.config.role.toUpperCase()}
            </text>
            <text 
              x={node.x} 
              y={node.y + 8} 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="10" 
              fontWeight="500"
            >
              {node.config.name}
            </text>
            {hasReward && (
              <text 
                x={node.x} 
                y={node.y + nodeRadius + 18} 
                textAnchor="middle" 
                fill={node.config.color} 
                fontSize="12" 
                fontWeight="bold"
              >
                +${node.split?.amount}
              </text>
            )}
            {node.participant?.wallet && (
              <text 
                x={node.x} 
                y={node.y - nodeRadius - 10} 
                textAnchor="middle" 
                fill="#64748b" 
                fontSize="7" 
                fontFamily="monospace"
              >
                {node.participant.wallet.address.slice(0, 8)}...
              </text>
            )}
          </g>
        );
      })}

      <text 
        x={width / 2} 
        y={height - 30} 
        textAnchor="middle" 
        fill="#64748b" 
        fontSize="11"
      >
        Viral Chain: Create → Remix → Share → Convert
      </text>
    </svg>
  );
}

function ControlPanel({ 
  settings, 
  onSettingsChange, 
  stats,
  onInit,
  onReset,
  isInitialized,
  isLoading,
  participants
}: {
  settings: ControlSettings;
  onSettingsChange: (settings: ControlSettings) => void;
  stats: { totalDistributed: number; avgLatency: number; participantCount: number };
  onInit: () => void;
  onReset: () => void;
  isInitialized: boolean;
  isLoading: boolean;
  participants: DemoState['participants'];
}) {
  const calculateProjectedReach = (k: number, initialShares: number = 1, generations: number = 5) => {
    let total = initialShares;
    let current = initialShares;
    for (let i = 0; i < generations; i++) {
      current = current * k;
      total += current;
    }
    return Math.round(total);
  };

  const projectedReach10 = calculateProjectedReach(settings.kFactor, 10, 5);
  const projectedReach100 = calculateProjectedReach(settings.kFactor, 100, 5);
  const projectedEarnings = (projectedReach100 * settings.conversionValue * 0.1).toFixed(0);

  return (
    <div className="flex flex-col h-full p-4 space-y-5 overflow-y-auto">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Latency</span>
          <span className="font-mono text-sm text-foreground">{stats.avgLatency}<span className="text-xs text-muted-foreground">ms</span></span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</span>
          <span className="font-mono text-sm text-cyan-400">${stats.totalDistributed.toFixed(2)}<span className="text-xs text-muted-foreground">USDC</span></span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Participants</span>
          <span className="font-mono text-sm text-foreground">{stats.participantCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Proj. Reach (10)</span>
          <span className={`font-mono text-sm ${settings.kFactor >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>{projectedReach10.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Proj. Earnings</span>
          <span className="font-mono text-sm text-emerald-400">${projectedEarnings}</span>
        </div>
      </div>

      <div className="border-t border-border/50 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">K-Factor</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onSettingsChange({ ...settings, kFactor: Math.max(0.5, settings.kFactor - 0.1) })}
            data-testid="button-kfactor-minus"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="flex-1 text-center">
            <span className={`font-mono text-2xl font-bold ${settings.kFactor >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              {settings.kFactor.toFixed(1)}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onSettingsChange({ ...settings, kFactor: Math.min(2.0, settings.kFactor + 0.1) })}
            data-testid="button-kfactor-plus"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Slider
          value={[settings.kFactor]}
          min={0.5}
          max={2.0}
          step={0.1}
          onValueChange={([v]) => onSettingsChange({ ...settings, kFactor: v })}
          className="mt-2"
          data-testid="slider-kfactor"
        />
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {settings.kFactor >= 1 ? "Viral growth" : "Viral decay"}
        </p>
      </div>

      <div className="border-t border-border/50 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Conversion Value</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onSettingsChange({ ...settings, conversionValue: Math.max(5, settings.conversionValue - 5) })}
            data-testid="button-conversion-minus"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="flex-1 text-center">
            <span className="font-mono text-2xl font-bold text-foreground">${settings.conversionValue}</span>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onSettingsChange({ ...settings, conversionValue: Math.min(100, settings.conversionValue + 5) })}
            data-testid="button-conversion-plus"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Slider
          value={[settings.conversionValue]}
          min={5}
          max={100}
          step={5}
          onValueChange={([v]) => onSettingsChange({ ...settings, conversionValue: v })}
          className="mt-2"
          data-testid="slider-conversion"
        />
      </div>

      <div className="border-t border-border/50 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Decay Rate</span>
        </div>
        <div className="text-center mb-2">
          <span className="font-mono text-xl font-bold text-foreground">{(settings.decayRate * 100).toFixed(0)}%</span>
        </div>
        <Slider
          value={[settings.decayRate]}
          min={0.3}
          max={0.7}
          step={0.05}
          onValueChange={([v]) => onSettingsChange({ ...settings, decayRate: v })}
          data-testid="slider-decay"
        />
        <p className="text-xs text-muted-foreground mt-1 text-center">Per-hop reduction</p>
      </div>

      <div className="border-t border-border/50 pt-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Participants</span>
        <div className="space-y-2">
          {DEMO_PARTICIPANTS.map((p, i) => {
            const participant = participants[i];
            const hasWallet = !!participant?.wallet;
            return (
              <div key={p.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: hasWallet ? p.color : '#334155' }}
                  />
                  <span className="text-sm text-foreground">{p.name}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {participant?.wallet ? `${participant.wallet.address.slice(0, 6)}...` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      <div className="space-y-2 pt-4 border-t border-border/50">
        {!isInitialized ? (
          <Button 
            onClick={onInit} 
            disabled={isLoading} 
            className="w-full gap-2"
            data-testid="button-init-demo"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Initialize Demo
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={onReset} 
            disabled={isLoading} 
            className="w-full gap-2"
            data-testid="button-reset-demo"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo
          </Button>
        )}
      </div>
    </div>
  );
}

function TransactionPanel({
  splits,
  transactionLogs,
  apiResponses,
  participants
}: {
  splits: PayoutSplit[];
  transactionLogs: TransactionLog[];
  apiResponses: DemoState['apiResponses'];
  participants: DemoState['participants'];
}) {
  const [activeTab, setActiveTab] = useState<'txs' | 'wallets' | 'deltas' | 'api'>('txs');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [splits, transactionLogs, apiResponses]);

  const tabs = [
    { id: 'txs', label: 'Transactions' },
    { id: 'wallets', label: 'Wallets' },
    { id: 'deltas', label: 'Deltas' },
    { id: 'api', label: 'API' },
  ] as const;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 p-2 border-b border-border/50">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider ml-1">Live Logs</span>
      </div>

      <div className="flex border-b border-border/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs bg-black/40">
        {activeTab === 'txs' && (
          <div className="space-y-2">
            {splits.length === 0 ? (
              <p className="text-muted-foreground">No transactions yet...</p>
            ) : (
              splits.map((split, i) => (
                <div key={i} className={`p-2 rounded ${split.error ? 'bg-yellow-500/10' : 'bg-emerald-500/10'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={split.error ? 'text-yellow-400' : 'text-emerald-400'}>
                      {split.error ? 'PENDING' : 'CONFIRMED'}
                    </span>
                    <span className="text-foreground font-semibold">+${split.amount}</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="text-cyan-400">{split.role}</span> → {split.recipient}
                  </div>
                  {split.transaction?.txHash && (
                    <div className="text-muted-foreground truncate mt-1">
                      {split.transaction.txHash.slice(0, 24)}...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="space-y-2">
            {participants.filter(p => p.wallet).map((p, i) => (
              <div key={i} className="p-2 rounded bg-slate-800/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-cyan-400">${p.wallet?.balance || '0.00'}</span>
                </div>
                <div className="text-muted-foreground truncate">
                  {p.wallet?.address}
                </div>
              </div>
            ))}
            {participants.filter(p => p.wallet).length === 0 && (
              <p className="text-muted-foreground">No wallets created yet...</p>
            )}
          </div>
        )}

        {activeTab === 'deltas' && (
          <div className="space-y-2">
            {splits.length === 0 ? (
              <p className="text-muted-foreground">No deltas recorded...</p>
            ) : (
              splits.map((split, i) => (
                <div key={i} className="p-2 rounded bg-purple-500/10">
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span className="text-muted-foreground">depositor:</span>
                    <span className="text-purple-400 truncate">{split.recipientAddress.slice(0, 10)}...</span>
                    <span className="text-muted-foreground">raw_value:</span>
                    <span className="text-foreground">{(parseFloat(split.amount) * 1e6).toFixed(0)}</span>
                    <span className="text-muted-foreground">amount:</span>
                    <span className="text-primary">${split.amount} USDC</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-2">
            {apiResponses.length === 0 ? (
              <p className="text-muted-foreground">No API calls yet...</p>
            ) : (
              apiResponses.map((response, i) => (
                <div key={i} className="p-2 rounded bg-blue-500/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-400">{response.endpoint}</span>
                    <span className="text-muted-foreground">
                      {new Date(response.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    {JSON.stringify(response.data, null, 1).slice(0, 200)}...
                  </pre>
                </div>
              ))
            )}
          </div>
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
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
  const [viewMode, setViewMode] = useState<'flow' | 'chain'>('flow');

  const stats = {
    totalDistributed: demoState.latestSplits.reduce((sum, s) => sum + parseFloat(s.amount || "0"), 0),
    avgLatency: 246,
    participantCount: demoState.participants.filter(p => p.action).length,
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
          transactionLogs: [],
        }));
        toast({ title: "Demo initialized", description: `Treasury: ${data.treasury.address.slice(0, 10)}...` });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to initialize demo", variant: "destructive" });
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resetDemo = async () => {
    setDemoState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch("/api/demo/reset", { method: "POST" });
      const data = await response.json();
      logApiResponse("POST /api/demo/reset", data);
      
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
    } catch (error) {
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const runStep = async (stepIndex: number) => {
    if (demoState.isLoading) return;
    setDemoState(prev => ({ ...prev, isLoading: true }));
    setIsAnimating(true);

    try {
      let endpoint = "";
      let body: any = {};
      const participant = DEMO_PARTICIPANTS[stepIndex];

      if (stepIndex === 0) {
        endpoint = "/api/demo/create";
        body = { creatorName: participant.name };
      } else {
        const upstreamAction = demoState.participants[stepIndex - 1].action;
        if (!upstreamAction) {
          toast({ title: "Error", description: "Previous step not completed", variant: "destructive" });
          setDemoState(prev => ({ ...prev, isLoading: false }));
          setIsAnimating(false);
          return;
        }

        if (stepIndex === 1) {
          endpoint = "/api/demo/remix";
        } else if (stepIndex === 2) {
          endpoint = "/api/demo/share";
        } else {
          endpoint = "/api/demo/convert";
        }
        body = { actorName: participant.name, upstreamActionId: upstreamAction.id };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      logApiResponse(`POST ${endpoint}`, data);

      if (data.success) {
        setDemoState(prev => {
          const newParticipants = [...prev.participants];
          newParticipants[stepIndex] = {
            name: participant.name,
            action: data.action,
            wallet: data.wallet,
          };

          return {
            ...prev,
            participants: newParticipants,
            currentStep: stepIndex,
            isLoading: false,
            latestSplits: data.splits || prev.latestSplits,
            transactionLogs: data.payouts 
              ? [...prev.transactionLogs, ...data.payouts.filter((p: any) => p.transaction).map((p: any) => p.transaction)]
              : prev.transactionLogs,
          };
        });

        const actionType = stepIndex === 0 ? "created content" 
          : stepIndex === 1 ? "remixed" 
          : stepIndex === 2 ? "shared" 
          : "converted";
        
        toast({ 
          title: `${participant.name} ${actionType}!`, 
          description: stepIndex === 3 ? "Rewards distributed via x402!" : `Wallet: ${data.wallet.address.slice(0, 10)}...` 
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
    
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="h-full w-full flex bg-[#0a0a0f] pb-16">
      <div className="w-[250px] flex-shrink-0 border-r border-border/30 bg-[#0c0c14]">
        <div className="p-4 pt-6 border-b border-border/30">
          <h1 className="font-display text-lg font-bold text-foreground">VibeCard</h1>
          <p className="text-xs text-muted-foreground">Viral Rewards Network</p>
        </div>
        <ControlPanel
          settings={settings}
          onSettingsChange={setSettings}
          stats={stats}
          onInit={initDemo}
          onReset={resetDemo}
          isInitialized={demoState.initialized}
          isLoading={demoState.isLoading}
          participants={demoState.participants}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Base Sepolia
            </Badge>
            <div className="flex items-center gap-1 bg-muted/30 rounded-md p-1">
              <Button
                variant={viewMode === 'flow' ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-1 h-7 px-2"
                onClick={() => setViewMode('flow')}
                data-testid="button-view-flow"
              >
                <Banknote className="h-3 w-3" />
                USDC Flow
              </Button>
              <Button
                variant={viewMode === 'chain' ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-1 h-7 px-2"
                onClick={() => setViewMode('chain')}
                data-testid="button-view-chain"
              >
                <GitBranch className="h-3 w-3" />
                Viral Chain
              </Button>
            </div>
          </div>
          
          {demoState.initialized && (
            <div className="flex gap-2 flex-wrap">
              {DEMO_PARTICIPANTS.map((p, index) => (
                <Button
                  key={p.name}
                  onClick={() => runStep(index)}
                  disabled={demoState.isLoading || demoState.currentStep >= index || (index > 0 && demoState.currentStep < index - 1)}
                  variant={demoState.currentStep >= index ? "secondary" : "default"}
                  size="sm"
                  className="gap-1"
                  data-testid={`button-step-${index}`}
                >
                  {demoState.isLoading && demoState.currentStep === index - 1 ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : demoState.currentStep >= index ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Zap className="h-3 w-3" />
                  )}
                  {p.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 p-4 overflow-hidden">
          {viewMode === 'flow' ? (
            <FlowVisualization
              treasury={demoState.treasury}
              participants={demoState.participants}
              splits={demoState.latestSplits}
              isAnimating={isAnimating}
            />
          ) : (
            <ViralTreeVisualization
              participants={demoState.participants}
              splits={demoState.latestSplits}
            />
          )}
        </div>

        {demoState.latestSplits.length > 0 && (
          <div className="p-4 border-t border-border/30 bg-emerald-500/5">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {demoState.latestSplits.map(split => (
                <div key={split.recipient} className="text-center">
                  <p className="text-xs text-muted-foreground">{split.role}</p>
                  <p className="font-semibold text-sm text-foreground">{split.recipient}</p>
                  <p className="font-mono font-bold text-primary">+${split.amount}</p>
                </div>
              ))}
              <div className="text-center border-l border-border/50 pl-6">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-mono font-bold text-lg text-cyan-400">${stats.totalDistributed.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">USDC</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-[280px] flex-shrink-0 border-l border-border/30 bg-[#0c0c14]">
        <TransactionPanel
          splits={demoState.latestSplits}
          transactionLogs={demoState.transactionLogs}
          apiResponses={demoState.apiResponses}
          participants={demoState.participants}
        />
      </div>
    </div>
  );
}
