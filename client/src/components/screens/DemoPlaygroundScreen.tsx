import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, Play, RefreshCw, Wallet, ArrowDown, Zap, DollarSign, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface DemoPlaygroundScreenProps {
  isActive: boolean;
}

const initialLogs = [
  { time: "00:00:01", type: "info", message: "Initializing VibeCard Demo Environment..." },
  { time: "00:00:02", type: "info", message: "Checking integrations..." },
  { time: "00:00:02", type: "warn", message: "Circle Wallets: Not configured" },
  { time: "00:00:02", type: "warn", message: "x402 Batching SDK: Not configured" },
  { time: "00:00:02", type: "warn", message: "Viral Tracking: Pending (requires wallets + x402)" },
  { time: "00:00:03", type: "info", message: "Waiting for integration setup..." },
];

const testTransactionLogs = [
  { time: "00:00:04", type: "event", message: "Simulating viral share event..." },
  { time: "00:00:05", type: "info", message: "Processing reward calculation (decay: 0.7)" },
  { time: "00:00:05", type: "info", message: "x402 Batching: Creator 60% | Sharer 25% | Platform 15%" },
  { time: "00:00:06", type: "success", message: "Non-Custodial payout queued: 3 recipients" },
  { time: "00:00:07", type: "success", message: "[OK] Transaction confirmed on Arc Network" },
];

const walletPayouts = [
  { label: "Creator", amount: "$3.00", address: "0x1a2b...3c4d" },
  { label: "Sharer", amount: "$1.25", address: "0x5e6f...7g8h" },
  { label: "Platform", amount: "$0.75", address: "0x9i0j...1k2l" },
];

export default function DemoPlaygroundScreen({ isActive }: DemoPlaygroundScreenProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [isRunning, setIsRunning] = useState(false);
  const [showPayouts, setShowPayouts] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);

  const runTestTransaction = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowPayouts(false);
    
    let currentIndex = 0;
    const addNextLog = () => {
      if (currentIndex < testTransactionLogs.length) {
        const logToAdd = testTransactionLogs[currentIndex];
        setLogs(prev => [...prev, logToAdd]);
        currentIndex++;
        setTimeout(addNextLog, 600);
      } else {
        setIsRunning(false);
        setShowPayouts(true);
        setTransactionCount(prev => prev + 1);
      }
    };
    setTimeout(addNextLog, 600);
  };

  const resetDemo = () => {
    setLogs(initialLogs);
    setShowPayouts(false);
    setTransactionCount(0);
  };

  useEffect(() => {
    if (isActive) {
      setLogs(initialLogs);
      setShowPayouts(false);
    }
  }, [isActive]);

  return (
    <div className="h-full flex flex-col items-center justify-start py-6 px-8 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-foreground font-display mb-4"
      >
        Demo Playground
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 mb-4"
      >
        <Badge variant="outline" className="bg-zinc-400/10 border-zinc-400/50 text-zinc-400 px-3 py-1" data-testid="badge-reward-pool">
          <DollarSign className="h-4 w-4 mr-2 text-zinc-400" />
          Reward Pool: $0.00 USDC
          <Clock className="h-3 w-3 ml-2 text-yellow-500" />
        </Badge>
        <span className="text-[10px] text-muted-foreground">Treasury Not Funded</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-4xl flex-1 flex flex-col gap-4"
      >
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col gap-2 w-1/2">
            <Card className="p-3 border-zinc-500/30 bg-zinc-500/5" data-testid="card-integration-status">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-zinc-400" />
                <span className="text-xs font-medium text-foreground">Integration Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2" data-testid="status-circle-wallets">
                  <Clock className="h-3 w-3 text-yellow-500" />
                  <Wallet className="h-3 w-3 text-sky-400/50" />
                  <span className="text-[10px] text-muted-foreground">Circle Wallets</span>
                </div>
                <div className="flex items-center gap-2" data-testid="status-x402">
                  <Clock className="h-3 w-3 text-yellow-500" />
                  <Circle className="h-3 w-3 text-sky-400/50" />
                  <span className="text-[10px] text-muted-foreground">x402 Batching SDK</span>
                </div>
                <div className="flex items-center gap-2" data-testid="status-arc">
                  <Clock className="h-3 w-3 text-yellow-500" />
                  <Zap className="h-3 w-3 text-emerald-500/50" />
                  <span className="text-[10px] text-muted-foreground">Arc Network</span>
                </div>
                <div className="flex items-center gap-2" data-testid="status-viral-tracking">
                  <Clock className="h-3 w-3 text-yellow-500" />
                  <ArrowDown className="h-3 w-3 text-emerald-500/50" />
                  <span className="text-[10px] text-muted-foreground">Viral Tracking</span>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-foreground">Test Controls</span>
              </div>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full text-[10px] bg-emerald-600"
                  onClick={runTestTransaction}
                  disabled={isRunning}
                  data-testid="button-run-test"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Run Test Transaction
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-[10px]"
                  onClick={resetDemo}
                  data-testid="button-reset-demo"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset Demo
                </Button>
              </div>
              {transactionCount > 0 && (
                <div className="mt-2 text-center">
                  <Badge variant="secondary" className="text-[9px]">
                    {transactionCount} test{transactionCount > 1 ? 's' : ''} completed
                  </Badge>
                </div>
              )}
            </Card>

            <Card className="p-3" data-testid="card-transaction-flow">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-medium text-foreground">Transaction Flow</span>
              </div>
              <div className="space-y-2 text-center">
                <div className="p-2 rounded bg-sky-400/10 border border-sky-400/30" data-testid="flow-reward-pool">
                  <span className="text-[9px] text-sky-400 font-medium">Developer Wallet</span>
                  <p className="text-sm font-bold text-foreground">$500.00</p>
                </div>
                <ArrowDown className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30" data-testid="flow-x402-split">
                  <span className="text-[9px] text-emerald-400 font-medium">x402 Batching</span>
                  <p className="text-[10px] text-muted-foreground">Atomic Multi-Party Split</p>
                </div>
                <ArrowDown className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="p-2 rounded bg-sky-400/10 border border-sky-400/30" data-testid="flow-user-wallets">
                  <span className="text-[9px] text-sky-400 font-medium">Non-Custodial Wallets</span>
                  <p className="text-[10px] text-muted-foreground">User Payouts</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <Card className="flex-1 p-3 bg-zinc-950 border-zinc-800" data-testid="card-terminal">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">vibecard-demo.log</span>
                </div>
                <Badge variant="outline" className="text-[8px] border-zinc-700 text-zinc-500" data-testid="badge-live">
                  LIVE
                </Badge>
              </div>
              <div className="h-40 overflow-y-auto font-mono text-[10px] space-y-1" data-testid="logs-container">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2"
                  >
                    <span className="text-zinc-600">[{log.time}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'event' ? 'text-sky-400' :
                      log.type === 'warn' ? 'text-yellow-500' :
                      'text-zinc-400'
                    }>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-emerald-400"
                  >
                    _
                  </motion.div>
                )}
              </div>
            </Card>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showPayouts ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <Card className="p-3 h-full" data-testid="card-wallet-payouts">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-medium text-foreground">Wallet Payouts</span>
                  </div>
                  {showPayouts && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px]" data-testid="badge-distributed">
                      <Check className="h-2 w-2 mr-1" />
                      Distributed
                    </Badge>
                  )}
                </div>
                <div className="flex justify-center gap-4">
                  {walletPayouts.map((payout, i) => (
                    <motion.div
                      key={payout.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: showPayouts ? 1 : 0.4, 
                        y: showPayouts ? 0 : 10,
                        scale: showPayouts ? 1 : 0.95
                      }}
                      transition={{ duration: 0.3, delay: showPayouts ? i * 0.1 : 0 }}
                      className="flex flex-col items-center gap-1"
                      data-testid={`payout-wallet-${payout.label.toLowerCase()}`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        showPayouts ? 'bg-sky-400/20 border-2 border-sky-400' : 'bg-zinc-800 border-2 border-zinc-700'
                      }`}>
                        <Wallet className={`h-4 w-4 ${showPayouts ? 'text-sky-400' : 'text-zinc-600'}`} />
                      </div>
                      <span className="text-[9px] font-medium text-foreground">{payout.label}</span>
                      <span className={`text-xs font-bold ${showPayouts ? 'text-emerald-400' : 'text-zinc-600'}`} data-testid={`text-payout-${payout.label.toLowerCase()}`}>
                        {payout.amount}
                      </span>
                      <span className="text-[7px] text-muted-foreground font-mono">{payout.address}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
