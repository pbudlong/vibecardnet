import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Wallet, ArrowRight, Zap, TrendingUp, Users, DollarSign, Loader2, CheckCircle, AlertCircle, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
}

const DEMO_PARTICIPANTS = [
  { name: "Matt P", role: "Creator" },
  { name: "Pete", role: "Remixer" },
  { name: "Manny", role: "Sharer" },
  { name: "Francisco", role: "Converter" },
];

export function LiveDemoScreen() {
  const { toast } = useToast();
  const [demoState, setDemoState] = useState<DemoState>({
    initialized: false,
    treasury: null,
    participants: DEMO_PARTICIPANTS.map(p => ({ name: p.name, action: null, wallet: null })),
    currentStep: -1,
    isLoading: false,
    latestSplits: [],
    transactionLogs: [],
  });

  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToLogs = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initDemo = async () => {
    setDemoState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch("/api/demo/init", { method: "POST" });
      const data = await response.json();
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
      await fetch("/api/demo/reset", { method: "POST" });
      setDemoState({
        initialized: false,
        treasury: null,
        participants: DEMO_PARTICIPANTS.map(p => ({ name: p.name, action: null, wallet: null })),
        currentStep: -1,
        isLoading: false,
        latestSplits: [],
        transactionLogs: [],
      });
    } catch (error) {
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const runStep = async (stepIndex: number) => {
    if (demoState.isLoading) return;
    setDemoState(prev => ({ ...prev, isLoading: true }));

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

        if (stepIndex === 3) {
          scrollToLogs();
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
      setDemoState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({ title: "Copied!", description: address.slice(0, 20) + "..." });
  };

  const totalPaid = demoState.latestSplits.reduce((sum, s) => sum + parseFloat(s.amount || "0"), 0);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
          Live Onchain Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Real wallets on Base Sepolia: Matt P → Pete → Manny → Francisco
        </p>
      </motion.div>

      <div className="w-full max-w-6xl">
        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center gap-3 mb-6 flex-wrap"
        >
          {!demoState.initialized ? (
            <Button
              onClick={initDemo}
              disabled={demoState.isLoading}
              className="gap-2"
              data-testid="button-init-demo"
            >
              {demoState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Initialize Demo
            </Button>
          ) : (
            <>
              {DEMO_PARTICIPANTS.map((p, index) => (
                <Button
                  key={p.name}
                  onClick={() => runStep(index)}
                  disabled={demoState.isLoading || demoState.currentStep >= index || (index > 0 && demoState.currentStep < index - 1)}
                  variant={demoState.currentStep >= index ? "secondary" : "default"}
                  className="gap-2"
                  data-testid={`button-step-${index}`}
                >
                  {demoState.isLoading && demoState.currentStep === index - 1 ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : demoState.currentStep >= index ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {p.name}: {p.role}
                </Button>
              ))}
            </>
          )}
          <Button
            variant="outline"
            onClick={resetDemo}
            disabled={demoState.isLoading}
            className="gap-2"
            data-testid="button-reset-demo"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </motion.div>

        {/* Treasury Info */}
        {demoState.treasury && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <Card className="p-3 border-sky-400/50 bg-sky-400/5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-sky-400 text-sky-400">USDC Treasury</Badge>
                  <span className="font-mono text-sm text-muted-foreground">{demoState.treasury.address}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => copyAddress(demoState.treasury!.address)}
                    data-testid="button-copy-treasury"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Badge variant="secondary" className="font-mono">
                  Balance: ${demoState.treasury.balance || "0.00"} USDC
                </Badge>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Viral Chain Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {demoState.participants.map((participant, index) => {
              const role = DEMO_PARTICIPANTS[index].role;
              const isActive = participant.action !== null;
              const split = demoState.latestSplits.find(s => s.recipient === participant.name);
              
              return (
                <div key={participant.name} className="flex items-center">
                  <motion.div
                    animate={{
                      scale: isActive ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`p-3 w-36 md:w-40 text-center ${
                      isActive ? "border-primary border-2" : ""
                    }`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Wallet className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-mono">
                          {participant.wallet?.address 
                            ? `${participant.wallet.address.slice(0, 6)}...${participant.wallet.address.slice(-4)}` 
                            : "—"}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{participant.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{role}</p>
                      <AnimatePresence mode="wait">
                        {split ? (
                          <motion.div
                            key="reward"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Badge variant="default" className="font-mono bg-primary">
                              +${split.amount} USDC
                            </Badge>
                            {split.error && (
                              <div className="mt-1 flex items-center justify-center gap-1 text-destructive">
                                <AlertCircle className="h-3 w-3" />
                                <span className="text-xs">Pending fund</span>
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <Badge variant="secondary" className="font-mono">
                            {isActive ? "Active" : "Waiting"}
                          </Badge>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                  {index < demoState.participants.length - 1 && (
                    <ArrowRight className={`h-5 w-5 mx-1 flex-shrink-0 ${
                      demoState.participants[index + 1]?.action ? "text-primary" : "text-muted-foreground"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* x402 Payout Breakdown */}
        {demoState.latestSplits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <Card className="p-4 border-emerald-500/30 bg-emerald-500/5">
              <h3 className="font-display font-semibold text-foreground mb-3 text-center flex items-center justify-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                x402 Atomic Split Breakdown ($20 Conversion)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {demoState.latestSplits.map(split => (
                  <div key={split.recipient} className="p-2 rounded bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">{split.role}</p>
                    <p className="font-semibold text-sm">{split.recipient}</p>
                    <p className="font-mono font-bold text-primary text-lg">+${split.amount}</p>
                    {split.error ? (
                      <Badge variant="destructive" className="text-xs mt-1">Needs USDC</Badge>
                    ) : split.transaction ? (
                      <Badge variant="secondary" className="text-xs mt-1">{split.transaction.status}</Badge>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Total distributed: <span className="font-mono font-semibold text-foreground">${totalPaid.toFixed(2)} USDC</span>
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Raw Logs Panel */}
        {(demoState.transactionLogs.length > 0 || demoState.latestSplits.some(s => s.error)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6"
          >
            <Card className="p-4 bg-black/80 text-green-400 font-mono text-xs">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE Transaction Log
              </h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {demoState.latestSplits.map((split, i) => (
                  <div key={i} className={split.error ? "text-yellow-400" : "text-green-400"}>
                    {split.error ? (
                      <span>[PENDING] {split.recipient}: ${split.amount} USDC - Treasury needs funding</span>
                    ) : split.transaction ? (
                      <span>[{split.transaction.status}] {split.recipient}: ${split.amount} USDC - {split.transaction.txHash?.slice(0, 16)}...</span>
                    ) : null}
                  </div>
                ))}
              </div>
              <div ref={logsEndRef} />
            </Card>
          </motion.div>
        )}

        {/* Waiting state */}
        {!demoState.initialized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-muted-foreground mb-6"
          >
            <p>Click "Initialize Demo" to create wallets on Base Sepolia testnet</p>
          </motion.div>
        )}

        {/* Viral Projection Components */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {/* K-Factor Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-4 h-full">
              <h2 className="font-display text-lg font-bold text-foreground mb-3 text-center">
                K-Factor Comparison
              </h2>
              <div className="space-y-3">
                {kFactorData.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <Badge variant={item.value >= 1 ? "default" : "secondary"} className="font-mono">
                        K = {item.value}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.value / 1.5 * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  <span className="font-semibold text-primary">K &gt; 1</span> = Each share generates more than one new share
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Growth Projection Table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-4 h-full">
              <h2 className="font-display text-lg font-bold text-foreground mb-3 text-center">
                Path to 1,000 Actions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1.5 text-muted-foreground font-medium text-xs">Initial</th>
                      <th className="text-right py-1.5 text-muted-foreground font-medium text-xs">Without</th>
                      <th className="text-right py-1.5 text-primary font-medium text-xs">With VibeCard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionData.map((row, index) => (
                      <motion.tr
                        key={row.actions}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        className="border-b border-muted/50"
                      >
                        <td className="py-1.5 font-mono text-xs">{row.actions}</td>
                        <td className="py-1.5 text-right font-mono text-xs text-muted-foreground">{row.withoutVibeCard}</td>
                        <td className="py-1.5 text-right font-mono text-xs font-semibold text-primary">{row.withVibeCard.toLocaleString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Windfall Potential */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4"
        >
          <Card className="p-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 text-center">
              Windfall Potential (1,000 conversions @ $20 each)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {windfallPotential.map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="text-center p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex justify-center mb-1">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">{item.role}</p>
                  <p className="font-display text-xl font-bold text-foreground">{item.earnings}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
