import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Play, RefreshCw, Wallet, ArrowDown, Zap, Video, Users, Share2, ExternalLink, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DemoPlaygroundScreenProps {
  isActive: boolean;
}

interface IntegrationStatus {
  circleWallets: { configured: boolean; connected: boolean; status: string };
  x402Batching: { configured: boolean; status: string };
  arcNetwork: { configured: boolean; chainId: number; rpcUrl: string; status: string };
  conversionTracking: { configured: boolean; status: string; dependencies: string[] };
}

// Get current PST time formatted as HH:MM:SS
function getPSTTime(): string {
  return new Date().toLocaleTimeString('en-US', { 
    timeZone: 'America/Los_Angeles', 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

interface WalletBalance {
  address: string | null;
  balance: string;
  currency: string;
  blockchain: string;
  error?: string;
}

function getInitialLogs(status: IntegrationStatus | undefined, treasuryBalance: number): Array<{time: string; type: string; message: string}> {
  const time = getPSTTime();
  if (!status) {
    return [
      { time, type: "info", message: "Initializing VibeCard Demo Environment..." },
      { time, type: "info", message: "Fetching integration status..." },
    ];
  }
  
  const logs = [
    { time, type: "info", message: "Initializing VibeCard Demo Environment..." },
    { time, type: "info", message: "Checking integrations..." },
  ];

  if (status.circleWallets.status === 'connected') {
    logs.push({ time, type: "success", message: "Circle Wallets: Connected" });
  } else if (status.circleWallets.configured) {
    logs.push({ time, type: "warn", message: "Circle Wallets: Configured (pending connection)" });
  } else {
    logs.push({ time, type: "warn", message: "Circle Wallets: Not configured" });
  }

  if (status.x402Batching.status === 'connected') {
    logs.push({ time, type: "success", message: "Circle x402 Gateway: Connected" });
  } else {
    logs.push({ time, type: "warn", message: "Circle x402 Gateway: Not configured" });
  }

  if (status.arcNetwork.status === 'connected') {
    logs.push({ time, type: "success", message: `Arc Network: Connected (Chain ${status.arcNetwork.chainId})` });
  } else {
    logs.push({ time, type: "warn", message: "Arc Network: Not connected" });
  }

  // Conversion tracking is enabled when both Circle Wallets and x402 are connected
  if (status.circleWallets.status === 'connected' && status.x402Batching.status === 'connected') {
    logs.push({ time, type: "success", message: "Conversion Tracking: Enabled" });
  } else {
    logs.push({ time, type: "info", message: "Conversion Tracking: Pending" });
  }
  
  if (treasuryBalance > 0) {
    logs.push({ time, type: "success", message: `Treasury Funded: $${treasuryBalance.toFixed(2)} USDC` });
  }
  
  logs.push({ time, type: "info", message: "Ready for testing..." });

  return logs;
}

const testTransactionLogs = [
  { time: "00:00:04", type: "event", message: "Simulating viral share event..." },
  { time: "00:00:05", type: "info", message: "Processing reward calculation (decay: 0.7)" },
  { time: "00:00:05", type: "info", message: "x402 Facilitator: Creator 50% | Remixer 35% | Sharer 15%" },
  { time: "00:00:06", type: "success", message: "Non-Custodial payout queued: 3 recipients" },
  { time: "00:00:07", type: "success", message: "[OK] Transaction confirmed on Arc Network" },
];

const defaultPayouts = [
  { label: "Creator", amount: "$0.00", address: "0x1a2b...3c4d", txId: "" },
  { label: "Remixer", amount: "$0.00", address: "0x5e6f...7g8h", txId: "" },
  { label: "Sharer", amount: "$0.00", address: "0x9i0j...1k2l", txId: "" },
];

const ARC_EXPLORER_URL = "https://testnet.arcscan.app/tx/";

export default function DemoPlaygroundScreen({ isActive }: DemoPlaygroundScreenProps) {
  const [logs, setLogs] = useState<Array<{time: string; type: string; message: string}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showPayouts, setShowPayouts] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [isSimulated, setIsSimulated] = useState(false);
  const [walletPayouts, setWalletPayouts] = useState(defaultPayouts);
  const [isResetting, setIsResetting] = useState(false);
  const [isSynapseAnimating, setIsSynapseAnimating] = useState(false);
  const [synapseKey, setSynapseKey] = useState(0);
  const synapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-scroll log container
  const logContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  const queryClient = useQueryClient();

  const { data: integrationStatus, isLoading: statusLoading } = useQuery<IntegrationStatus>({
    queryKey: ['/api/integrations/status'],
    enabled: isActive,
    refetchInterval: 10000,
  });

  const { data: walletBalance } = useQuery<WalletBalance>({
    queryKey: ['/api/wallet/balance'],
    enabled: isActive,
    refetchInterval: 15000,
  });

  // Fetch all wallets to show user wallet balances
  interface WalletInfo {
    id: string;
    name: string;
    address: string;
    blockchain: string;
    usdcBalance: string;
  }
  const { data: allWallets } = useQuery<{ wallets: WalletInfo[] }>({
    queryKey: ['/api/wallets'],
    enabled: isActive,
    refetchInterval: 10000,
  });

  // Fetch Circle diagnostics for hackathon judges
  interface CircleDiagnostics {
    configured: boolean;
    apiKeyPrefix: string | null;
    entitySecretConfigured: boolean;
    entity: { id: string; name: string; appId: string } | null;
    walletSet: { id: string; name: string; custodyType: string; createDate: string } | null;
    arcNetwork: { chainId: number; name: string; rpcUrl: string; explorerUrl: string; usdcContract: string };
    wallets: Array<{ id: string; name: string; address: string; balance: string; explorerUrl: string; isTreasury: boolean }>;
  }
  const { data: circleDiagnostics } = useQuery<CircleDiagnostics>({
    queryKey: ['/api/circle/diagnostics'],
    enabled: isActive,
    refetchInterval: 30000,
  });

  // Get Arc user wallets with balances
  const arcUserWallets = allWallets?.wallets?.filter(
    w => w.blockchain === 'ARC-TESTNET' && w.name.includes('Arc') && !w.name.includes('Treasury')
  ) || [];

  // Map wallets by name: Creator=Matt, Remixer=Pete, Sharer=Manny
  const mattWallet = arcUserWallets.find(w => w.name.toLowerCase().includes('matt'));
  const peteWallet = arcUserWallets.find(w => w.name.toLowerCase().includes('pete'));
  const mannyWallet = arcUserWallets.find(w => w.name.toLowerCase().includes('manny'));

  // Create display payouts - use walletPayouts during animation, otherwise use live wallet balances
  // Preserve txId from walletPayouts when showing live balances
  const displayPayouts = isSynapseAnimating ? walletPayouts : (mattWallet && peteWallet && mannyWallet ? [
    { label: "Creator", amount: `$${parseFloat(mattWallet.usdcBalance || '0').toFixed(2)}`, address: mattWallet.address ? `${mattWallet.address.slice(0, 6)}...${mattWallet.address.slice(-4)}` : "0x...", txId: walletPayouts[0]?.txId || "" },
    { label: "Remixer", amount: `$${parseFloat(peteWallet.usdcBalance || '0').toFixed(2)}`, address: peteWallet.address ? `${peteWallet.address.slice(0, 6)}...${peteWallet.address.slice(-4)}` : "0x...", txId: walletPayouts[1]?.txId || "" },
    { label: "Sharer", amount: `$${parseFloat(mannyWallet.usdcBalance || '0').toFixed(2)}`, address: mannyWallet.address ? `${mannyWallet.address.slice(0, 6)}...${mannyWallet.address.slice(-4)}` : "0x...", txId: walletPayouts[2]?.txId || "" },
  ] : walletPayouts);

  // Check if any user wallet has balance above the gas buffer ($0.15)
  // Only enable reset if there's actually something to recover
  const GAS_BUFFER = 0.15;
  const hasUserFunds = arcUserWallets.some(w => parseFloat(w.usdcBalance || '0') > GAS_BUFFER);

  const testTransactionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/demo/test-transaction');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        const simLabel = data.simulated ? "[SIM] " : "";
        setIsSimulated(data.simulated || false);
        const gasMsg = data.gasCost && parseFloat(data.gasCost) > 0 
          ? ` (gas: $${data.gasCost})` 
          : '';
        const time = getPSTTime();
        setLogs(prev => [
          ...prev,
          { time, type: "success", message: `${simLabel}Sent $${data.totalSent} USDC to ${data.transfers.length} recipients` },
          ...data.transfers.map((t: any) => ({
            time,
            type: t.status === 'success' ? 'success' : 'error',
            message: `${simLabel}${t.to ? `${t.to.slice(0, 6)}...${t.to.slice(-4)}` : 'unknown'}: $${t.amount} ${t.status === 'success' ? '(confirmed)' : '(failed)'}${t.txId ? ` [tx:${t.txId.slice(0, 8)}...]` : ''}`
          })),
          { time, type: "info", message: `Treasury balance: $${data.newTreasuryBalance}${gasMsg}` },
          { time, type: "success", message: `Test completed - see Treasury, Logs and Wallet Payouts for latest status` }
        ]);
        setTransactionCount(prev => prev + 1);
        if (synapseTimerRef.current) clearTimeout(synapseTimerRef.current);
        setIsSynapseAnimating(false);
        setSynapseKey(k => k + 1);
        
        // Reset all wallet amounts to pending state before animation starts
        setWalletPayouts([
          { label: "Creator", amount: "$--", address: "0x...", txId: "" },
          { label: "Remixer", amount: "$--", address: "0x...", txId: "" },
          { label: "Sharer", amount: "$--", address: "0x...", txId: "" }
        ]);
        setShowPayouts(true);
        
        requestAnimationFrame(() => {
          setIsSynapseAnimating(true);
          synapseTimerRef.current = setTimeout(() => setIsSynapseAnimating(false), 5500);
        });
        // Update wallet payouts with delays matching animation arrival times
        if (data.transfers && data.transfers.length >= 3) {
          const transfers = data.transfers.slice(0, 3);
          const labels = ["Creator", "Remixer", "Sharer"];
          // Animation: dur=1s, begin=i*1.1s, so ends at 1s, 2.1s, 3.2s
          // Creator (i=0): animation ends at 1000ms
          setTimeout(() => {
            const t = transfers[0];
            const addr = t.to || t.address || "";
            setWalletPayouts(prev => [
              { label: labels[0], amount: `$${parseFloat(t.amount).toFixed(2)}`, address: addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "0x...", txId: t.txId || "" },
              prev[1],
              prev[2]
            ]);
          }, 1000);
          // Remixer (i=1): animation ends at 2100ms
          setTimeout(() => {
            const t = transfers[1];
            const addr = t.to || t.address || "";
            setWalletPayouts(prev => [
              prev[0],
              { label: labels[1], amount: `$${parseFloat(t.amount).toFixed(2)}`, address: addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "0x...", txId: t.txId || "" },
              prev[2]
            ]);
          }, 2100);
          // Sharer (i=2): animation ends at 3200ms
          setTimeout(() => {
            const t = transfers[2];
            const addr = t.to || t.address || "";
            setWalletPayouts(prev => [
              prev[0],
              prev[1],
              { label: labels[2], amount: `$${parseFloat(t.amount).toFixed(2)}`, address: addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "0x...", txId: t.txId || "" }
            ]);
          }, 3200);
          // Refresh wallet balances after all animations complete
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
            queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
            queryClient.refetchQueries({ queryKey: ['/api/wallet/balance'] });
            queryClient.refetchQueries({ queryKey: ['/api/wallets'] });
          }, 5000);
        }
      } else {
        setLogs(prev => [...prev, { time: getPSTTime(), type: "warn", message: data.message || 'Transfer failed' }]);
      }
      setIsRunning(false);
    },
    onError: (error) => {
      setLogs(prev => [...prev, { time: getPSTTime(), type: "error", message: `Transaction error: ${error}` }]);
      setIsRunning(false);
    }
  });

  const runTestTransaction = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowPayouts(false);
    
    // Add initial logs showing SDK call and pixel firing
    const time = getPSTTime();
    const creatorAddr = arcUserWallets[0]?.address || '0x1a2b...3c4d';
    const shortAddr = `${creatorAddr.slice(0, 6)}...${creatorAddr.slice(-4)}`;
    
    setLogs(prev => [
      ...prev,
      { time, type: "event", message: `vibe.trackShare({ contentId: 'vid-${Math.random().toString(36).slice(2, 8)}', sharerId: '${shortAddr}' })` },
      { time, type: "info", message: "Pixel fired: vibecard.io/t.gif?event=share&ref=abc123" },
    ]);
    
    // Add conversion event after short delay
    setTimeout(() => {
      const time2 = getPSTTime();
      setLogs(prev => [
        ...prev,
        { time: time2, type: "success", message: "Conversion tracked: SHARE_COMPLETE" },
        { time: time2, type: "event", message: "x402 Facilitator activated..." },
        { time: time2, type: "info", message: "Atomic split: Creator 50% | Remixer 35% | Sharer 15%" },
      ]);
    }, 600);
    
    // Execute real transfer after log animation
    setTimeout(() => {
      testTransactionMutation.mutate();
    }, 1500);
  };


  // Track if we've initialized logs to prevent resetting on balance updates
  const logsInitialized = useRef(false);
  
  useEffect(() => {
    if (isActive && integrationStatus && !logsInitialized.current) {
      const balance = walletBalance?.balance ? parseFloat(walletBalance.balance) : 0;
      setLogs(getInitialLogs(integrationStatus, balance));
      setShowPayouts(false);
      logsInitialized.current = true;
    }
    // Reset when becoming inactive so logs reinitialize on next visit
    if (!isActive) {
      logsInitialized.current = false;
    }
  }, [isActive, integrationStatus, walletBalance]);

  // Auto-scroll to bottom when logs change (if user is already at bottom)
  useEffect(() => {
    const container = logContainerRef.current;
    if (container && shouldAutoScroll.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logs]);

  // Cleanup synapse animation timer on unmount
  useEffect(() => {
    return () => {
      if (synapseTimerRef.current) clearTimeout(synapseTimerRef.current);
    };
  }, []);

  // Handle scroll to detect if user scrolled up
  const handleLogScroll = () => {
    const container = logContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 20;
      shouldAutoScroll.current = isAtBottom;
    }
  };


  const fundTreasuryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/wallet/fund');
      return response.json();
    },
    onSuccess: () => {
      setLogs(prev => [...prev, { time: getPSTTime(), type: "success", message: "Faucet request submitted - USDC incoming!" }]);
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
    },
    onError: () => {
      setLogs(prev => [...prev, { time: getPSTTime(), type: "warn", message: "Faucet failed - visit faucet.circle.com" }]);
    }
  });

  const resetDemoMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/demo/reset');
      return response.json();
    },
    onMutate: () => {
      setIsResetting(true);
      setLogs(prev => [...prev, { time: getPSTTime(), type: "info", message: "Recovering funds from user wallets..." }]);
    },
    onSuccess: (data) => {
      if (data.success) {
        // Show per-user recovery with gas
        const newLogs: Array<{time: string; type: string; message: string}> = [];
        if (data.transfers && data.transfers.length > 0) {
          for (const transfer of data.transfers) {
            const addr = transfer.fromAddress ? `${transfer.fromAddress.slice(0, 6)}...${transfer.fromAddress.slice(-4)}` : transfer.from;
            const gasInfo = parseFloat(transfer.gasSpent || '0') > 0 ? ` (gas: $${transfer.gasSpent})` : '';
            newLogs.push({ 
              time: getPSTTime(), 
              type: "event", 
              message: `${addr}: recovered $${transfer.amount}${gasInfo}` 
            });
          }
        }
        // Summary line
        const totalGas = data.totalUserGasSpent && parseFloat(data.totalUserGasSpent) > 0 ? ` (total gas: $${data.totalUserGasSpent})` : '';
        const newBalance = data.newTreasuryBalance ? ` Treasury: $${parseFloat(data.newTreasuryBalance).toFixed(2)}` : '';
        newLogs.push({ time: getPSTTime(), type: "success", message: `Recovered $${data.totalRecovered} USDC${totalGas}${newBalance}` });
        setLogs(prev => [...prev, ...newLogs]);
      } else {
        setLogs(prev => [...prev, { time: getPSTTime(), type: "info", message: "No funds to recover from user wallets" }]);
      }
      // Force immediate refresh of wallet balances
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.refetchQueries({ queryKey: ['/api/wallet/balance'] });
      queryClient.refetchQueries({ queryKey: ['/api/wallets'] });
      setShowPayouts(false);
      setTransactionCount(0);
      setIsResetting(false);
    },
    onError: () => {
      setLogs(prev => [...prev, { time: getPSTTime(), type: "warn", message: "Reset failed" }]);
      setIsResetting(false);
    }
  });

  const treasuryBalance = walletBalance?.balance ? parseFloat(walletBalance.balance) : 0;
  const isTreasuryFunded = treasuryBalance > 0;
  const walletAddress = walletBalance?.address;

  return (
    <div className="h-full flex flex-col items-center justify-start py-6 px-8 overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
      >
        Live Demo
      </motion.h1>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-4xl flex-1 flex flex-col gap-4"
      >
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col gap-2 w-1/2">
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
                      Run Demo
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-[10px]"
                  onClick={() => resetDemoMutation.mutate()}
                  disabled={resetDemoMutation.isPending || isResetting || !hasUserFunds}
                  data-testid="button-reset-demo"
                >
                  {(resetDemoMutation.isPending || isResetting) ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Recovering funds...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset Demo (Recover USDC)
                    </>
                  )}
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

            {/* Circle Integration Details for Hackathon Judges */}
            {circleDiagnostics && (
              <Card className="p-3 border-blue-500/30 bg-blue-500/5" data-testid="card-circle-diagnostics">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-foreground">Circle Integration Details</span>
                  <Badge variant="outline" className="text-[8px] ml-auto border-blue-500/50 text-blue-400">
                    For Judges
                  </Badge>
                </div>
                <div className="text-[9px]">
                  <div className="p-1 rounded bg-muted/30">
                    <span className="text-muted-foreground">API Key: </span>
                    {circleDiagnostics.apiKeyPrefix ? (
                      <>
                        <span className="text-foreground font-mono">{circleDiagnostics.apiKeyPrefix}</span>
                        <span className="text-emerald-400 ml-2">configured</span>
                      </>
                    ) : (
                      <span className="text-amber-400">not configured</span>
                    )}
                  </div>
                  <div className="p-1 rounded bg-muted/30">
                    <span className="text-muted-foreground">Entity Secret: </span>
                    <span className={circleDiagnostics.entitySecretConfigured ? "text-emerald-400" : "text-amber-400"}>
                      {circleDiagnostics.entitySecretConfigured ? "configured" : "not configured"}
                    </span>
                  </div>
                  {circleDiagnostics.entity && (
                    <div className="p-1 rounded bg-muted/30">
                      <span className="text-muted-foreground">Entity ID: </span>
                      <span className="text-foreground font-mono">{circleDiagnostics.entity.id}</span>
                      {circleDiagnostics.entity.appId && (
                        <span className="text-muted-foreground ml-2">(App: {circleDiagnostics.entity.appId})</span>
                      )}
                    </div>
                  )}
                  {circleDiagnostics.walletSet && (
                    <div className="p-1 rounded bg-muted/30">
                      <span className="text-muted-foreground">Wallet Set: </span>
                      <span className="text-foreground font-mono">{circleDiagnostics.walletSet.name || circleDiagnostics.walletSet.id}</span>
                      <span className="text-muted-foreground ml-2">({circleDiagnostics.walletSet.custodyType})</span>
                    </div>
                  )}
                  <div className="p-1 rounded bg-muted/30">
                    <span className="text-muted-foreground">Network: </span>
                    <span className="text-foreground">{circleDiagnostics.arcNetwork.name} (Chain {circleDiagnostics.arcNetwork.chainId})</span>
                  </div>
                  <div className="p-1 rounded bg-muted/30">
                    <span className="text-muted-foreground">USDC Contract: </span>
                    <a 
                      href={`${circleDiagnostics.arcNetwork.explorerUrl}/address/${circleDiagnostics.arcNetwork.usdcContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline font-mono"
                    >
                      {circleDiagnostics.arcNetwork.usdcContract}
                      <ExternalLink className="h-2.5 w-2.5 inline ml-0.5" />
                    </a>
                  </div>
                  <div className="pt-1 border-t border-muted/50">
                    <p className="text-muted-foreground">Arc Testnet Wallets:</p>
                    <div className="space-y-1">
                      {circleDiagnostics.wallets.map(w => (
                        <div key={w.id} className="flex items-center justify-between p-1 rounded bg-muted/20">
                          <div className="flex items-center gap-1.5">
                            {w.isTreasury ? (
                              <Badge className="text-[7px] bg-sky-500/20 text-sky-400 px-1 py-0">Treasury</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[7px] px-1 py-0">{w.name.replace(' Arc', '')}</Badge>
                            )}
                            <a 
                              href={w.explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline font-mono"
                            >
                              {w.address}
                              <ExternalLink className="h-2.5 w-2.5 inline ml-0.5" />
                            </a>
                          </div>
                          <span className="font-mono text-foreground">${parseFloat(w.balance).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-3" data-testid="card-transaction-flow">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-medium text-foreground">Transaction Flow</span>
              </div>
              <div className="space-y-2 text-center">
                <div className="p-2 rounded bg-sky-400/10 border border-sky-400/30" data-testid="flow-reward-pool">
                  <span className="text-[9px] text-sky-400 font-medium">Reward Pool Treasury - Developer Wallet</span>
                  <p className="text-sm font-bold text-foreground">${treasuryBalance.toFixed(2)} USDC</p>
                  {walletAddress && (
                    <p className="text-[8px] text-muted-foreground font-mono mt-1">
                      {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                    </p>
                  )}
                </div>
                <ArrowDown className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30" data-testid="flow-conversion-tracking">
                  <span className="text-[9px] text-amber-400 font-medium">Conversion Tracking</span>
                  <p className="text-[10px] text-muted-foreground">Pixel + Event Attribution</p>
                </div>
                <ArrowDown className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30" data-testid="flow-reward-calculator">
                  <span className="text-[9px] text-purple-400 font-medium">Reward Calculator</span>
                  <p className="text-[10px] text-muted-foreground">Viral Decay + Split Logic</p>
                </div>
                <ArrowDown className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30" data-testid="flow-x402-split">
                  <span className="text-[9px] text-emerald-400 font-medium">x402 Facilitator</span>
                  <p className="text-[10px] text-muted-foreground">Atomic Multi-Party Split</p>
                </div>
                <ArrowDown className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="p-2 rounded bg-sky-400/10 border border-sky-400/30" data-testid="flow-user-wallets">
                  <span className="text-[9px] text-sky-400 font-medium">Non-Custodial Wallets (Using Developer for Hackathon)</span>
                  <p className="text-[10px] text-muted-foreground">User Payouts</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <Card className="p-3 bg-zinc-950 border-zinc-800" data-testid="card-terminal">
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
              <div 
                ref={logContainerRef}
                onScroll={handleLogScroll}
                className="min-h-[423px] max-h-[516px] overflow-y-auto font-mono text-[10px] space-y-1" 
                data-testid="logs-container"
              >
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
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <Card className="p-3 h-full" data-testid="card-wallet-payouts">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-medium text-foreground">Wallet Payouts</span>
                  </div>
                  {hasUserFunds && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px]" data-testid="badge-distributed">
                      <Check className="h-2 w-2 mr-1" />
                      Distributed
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center justify-center mt-[5px]">
                    <motion.div 
                      className="h-12 w-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                      animate={isSynapseAnimating ? { 
                        boxShadow: ['0 0 0px rgba(16, 185, 129, 0)', '0 0 20px rgba(16, 185, 129, 0.8)', '0 0 0px rgba(16, 185, 129, 0)']
                      } : {}}
                      transition={{ duration: 0.8 }}
                    >
                      <span className="text-[8px] font-bold text-emerald-400">x402</span>
                    </motion.div>
                  </div>
                  <div className="flex-1 relative h-36">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" key={synapseKey}>
                      {[
                        { yEnd: 0, color: '#f43f5e', amount: displayPayouts[0]?.amount || '$1.00' },
                        { yEnd: 50, color: '#8b5cf6', amount: displayPayouts[1]?.amount || '$0.70' },
                        { yEnd: 100, color: '#0ea5e9', amount: displayPayouts[2]?.amount || '$0.30' }
                      ].map((path, i) => {
                        const pathD = `M 0 50 Q 50 ${path.yEnd}, 100 ${path.yEnd}`;
                        return (
                          <g key={i}>
                            <path
                              d={pathD}
                              fill="none"
                              stroke={path.color}
                              strokeWidth="2.5"
                              strokeOpacity="0.4"
                            />
                            {isSynapseAnimating && (
                              <>
                                <circle r="5" fill={path.color}>
                                  <animateMotion
                                    dur="1s"
                                    begin={`${i * 1.1}s`}
                                    fill="freeze"
                                    path={pathD}
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0;1;1;0"
                                    dur="1s"
                                    begin={`${i * 1.1}s`}
                                    fill="freeze"
                                  />
                                </circle>
                                <text
                                  fill={path.color}
                                  fontSize="8"
                                  fontWeight="bold"
                                  opacity="0"
                                >
                                  {path.amount}
                                  <animateMotion
                                    dur="1s"
                                    begin={`${i * 1.1}s`}
                                    fill="freeze"
                                    path={pathD}
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0;1;1;0.8"
                                    dur="1s"
                                    begin={`${i * 1.1}s`}
                                    fill="freeze"
                                  />
                                </text>
                              </>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    {displayPayouts.map((payout, i) => {
                      const hasFunds = parseFloat(payout.amount.replace('$', '')) > 0.02;
                      const roleConfig = {
                        Creator: { name: 'Matt', displayLabel: 'Creator', color: 'text-rose-400', bgColor: 'bg-rose-500/20', borderColor: 'border-rose-500/50', glowColor: 'rgba(244, 63, 94, 0.6)', split: '50%' },
                        Remixer: { name: 'Pete', displayLabel: 'First Remixer', color: 'text-violet-400', bgColor: 'bg-violet-500/20', borderColor: 'border-violet-500/50', glowColor: 'rgba(139, 92, 246, 0.6)', split: '35%' },
                        Sharer: { name: 'Manny', displayLabel: 'First Sharer', color: 'text-sky-400', bgColor: 'bg-sky-500/20', borderColor: 'border-sky-500/50', glowColor: 'rgba(14, 165, 233, 0.6)', split: '15%' }
                      }[payout.label] || { name: '?', displayLabel: payout.label, color: 'text-sky-400', bgColor: 'bg-sky-500/20', borderColor: 'border-sky-500/50', glowColor: 'rgba(14, 165, 233, 0.6)', split: '' };
                      return (
                        <div key={payout.label} className="flex flex-col items-center">
                          <motion.div
                            initial={{ opacity: 0.4 }}
                            animate={{ 
                              opacity: hasFunds ? 1 : 0.4,
                              scale: hasFunds ? 1 : 0.98,
                              boxShadow: isSynapseAnimating ? [
                                '0 0 0px transparent',
                                `0 0 15px ${roleConfig.glowColor}`,
                                '0 0 0px transparent'
                              ] : '0 0 0px transparent'
                            }}
                            transition={{ 
                              duration: 0.3,
                              boxShadow: { duration: 0.8, delay: i * 0.15 + 0.6 }
                            }}
                            className={`p-2 rounded ${roleConfig.bgColor} border ${roleConfig.borderColor} w-24 text-center`}
                            data-testid={`payout-wallet-${payout.label.toLowerCase()}`}
                          >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${roleConfig.bgColor} border ${roleConfig.borderColor}`}>
                              <span className={`text-[9px] font-bold ${roleConfig.color}`}>{roleConfig.name}</span>
                            </div>
                            <div className={`text-[9px] font-medium ${roleConfig.color}`}>{roleConfig.displayLabel}</div>
                            <div className="text-[7px] text-muted-foreground">({roleConfig.split})</div>
                            <div className={`text-xs font-bold mt-1 ${hasFunds ? 'text-emerald-400' : 'text-zinc-600'}`} data-testid={`text-payout-${payout.label.toLowerCase()}`}>
                              {payout.amount}
                            </div>
                          </motion.div>
                          {/* Transaction record - shows below box after animation completes */}
                          {!isSynapseAnimating && payout.txId && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              className="mt-2 text-center"
                            >
                              <div className="text-[10px] text-muted-foreground">tx confirmed</div>
                              <div 
                                className="text-xs font-mono font-medium text-foreground"
                                data-testid={`text-tx-${payout.label.toLowerCase()}`}
                              >
                                {payout.txId.slice(0, 8)}...
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
