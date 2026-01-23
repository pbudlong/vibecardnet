import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Node {
  id: string;
  label: string;
  type: "creator" | "remix" | "share";
  x: number;
  y: number;
  parentId: string | null;
  delay: number;
  generation: number;
}

interface Branch {
  id: string;
  fromId: string;
  toId: string;
  delay: number;
}

interface TreeState {
  nodes: Node[];
  branches: Branch[];
  scale: number;
  generation: number;
  fading: boolean;
}

const nodeColors = {
  creator: "rgb(244, 63, 94)",
  remix: "rgb(139, 92, 246)",
  share: "rgb(14, 165, 233)",
};

function addGeneration(
  existingNodes: Node[],
  generation: number,
  kFactor: number
): { newNodes: Node[]; newBranches: Branch[] } {
  const newNodes: Node[] = [];
  const newBranches: Branch[] = [];
  const parentNodes = existingNodes.filter(n => n.generation === generation - 1);
  let nodeId = existingNodes.length;

  parentNodes.forEach((parent, pi) => {
    const numChildren = kFactor >= 1 
      ? (Math.random() > 0.3 ? 3 : 2)
      : (generation <= 1 ? (Math.random() > 0.5 ? 2 : 1) : 0);
    
    if (numChildren === 0) return;

    const baseAngle = parent.parentId 
      ? Math.atan2(parent.y - 200, parent.x - 400) * (180 / Math.PI)
      : -90 + (pi - (parentNodes.length - 1) / 2) * 60;
    
    const distance = Math.max(45, 95 - generation * 8);

    for (let i = 0; i < numChildren; i++) {
      const spreadAngle = baseAngle + (i - (numChildren - 1) / 2) * (32 - generation * 3);
      const radians = (spreadAngle * Math.PI) / 180;
      const x = parent.x + Math.cos(radians) * distance;
      const y = parent.y + Math.sin(radians) * distance;
      const id = `node-${nodeId++}`;
      const type: "remix" | "share" = Math.random() > 0.5 ? "share" : "remix";
      const delay = pi * 0.08 + i * 0.06;
      
      newNodes.push({
        id,
        label: type === "remix" ? "Remix" : "Share",
        type,
        x,
        y,
        parentId: parent.id,
        delay,
        generation,
      });
      
      newBranches.push({
        id: `branch-${parent.id}-${id}`,
        fromId: parent.id,
        toId: id,
        delay: delay - 0.03,
      });
    }
  });

  return { newNodes, newBranches };
}

function CurvedBranch({ from, to, delay, color, fading }: { 
  from: Node; to: Node; delay: number; color: string; fading: boolean 
}) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const perpX = -dy * 0.15;
  const perpY = dx * 0.15;
  const controlX = midX + perpX;
  const controlY = midY + perpY;
  const pathD = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
  
  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: fading ? 0 : 1, opacity: fading ? 0 : 0.7 }}
      transition={{ duration: fading ? 0.6 : 0.3, delay: fading ? 0 : delay, ease: "easeOut" }}
    />
  );
}

function NodeCircle({ node, fading }: { node: Node; fading: boolean }) {
  const isRoot = node.id === "root";
  const size = isRoot ? 42 : Math.max(14, 28 - node.generation * 2);
  
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: fading ? 0 : 1, opacity: fading ? 0 : 1 }}
      transition={{ 
        duration: fading ? 0.6 : 0.2, 
        delay: fading ? 0 : node.delay, 
        type: fading ? "tween" : "spring", 
        stiffness: 280 
      }}
    >
      <circle cx={node.x} cy={node.y} r={size / 2} fill={nodeColors[node.type]} opacity={0.9} />
      {isRoot && (
        <text x={node.x} y={node.y + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          Original
        </text>
      )}
    </motion.g>
  );
}

const initialState: TreeState = {
  nodes: [{
    id: "root",
    label: "Original",
    type: "creator",
    x: 400,
    y: 200,
    parentId: null,
    delay: 0,
    generation: 0,
  }],
  branches: [],
  scale: 1,
  generation: 0,
  fading: false,
};

export function ViralMindmapAnimation() {
  const [kFactor, setKFactor] = useState<0.5 | 1.2>(1.2);
  const [state, setState] = useState<TreeState>(initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTree = useCallback(() => {
    setState({ ...initialState, nodes: [...initialState.nodes] });
  }, []);

  useEffect(() => {
    resetTree();
  }, [kFactor, resetTree]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const tick = () => {
      setState(prev => {
        const nextGen = prev.generation + 1;

        if (kFactor < 1) {
          // Decay mode
          if (nextGen <= 2) {
            const { newNodes, newBranches } = addGeneration(prev.nodes, nextGen, kFactor);
            timerRef.current = setTimeout(tick, 1100);
            return {
              ...prev,
              nodes: [...prev.nodes, ...newNodes],
              branches: [...prev.branches, ...newBranches],
              generation: nextGen,
            };
          } else if (!prev.fading) {
            timerRef.current = setTimeout(() => {
              resetTree();
              timerRef.current = setTimeout(tick, 500);
            }, 1200);
            return { ...prev, fading: true };
          }
          return prev;
        } else {
          // Growth mode: keep growing, zoom out, prune old generations when too many
          const { newNodes, newBranches } = addGeneration(prev.nodes, nextGen, kFactor);
          let updatedNodes = [...prev.nodes, ...newNodes];
          let updatedBranches = [...prev.branches, ...newBranches];
          let newScale = prev.scale;

          // Zoom out as we grow
          if (nextGen >= 2) {
            newScale = Math.max(0.28, prev.scale * 0.84);
          }

          // Prune oldest generation when we have too many nodes (keep tree visible)
          const maxNodes = 120;
          if (updatedNodes.length > maxNodes) {
            const minGen = Math.min(...updatedNodes.filter(n => n.id !== "root").map(n => n.generation));
            const nodesToRemove = new Set(updatedNodes.filter(n => n.generation === minGen).map(n => n.id));
            updatedNodes = updatedNodes.filter(n => !nodesToRemove.has(n.id));
            updatedBranches = updatedBranches.filter(b => !nodesToRemove.has(b.toId));
          }

          timerRef.current = setTimeout(tick, 800);

          return {
            ...prev,
            nodes: updatedNodes,
            branches: updatedBranches,
            scale: newScale,
            generation: nextGen,
          };
        }
      });
    };

    timerRef.current = setTimeout(tick, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [kFactor, resetTree]);

  const { nodes, branches, scale, fading } = state;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start">
      {/* K-Factor Toggle */}
      <div className="flex items-center gap-4 mb-3">
        <Button
          variant={kFactor === 0.5 ? "default" : "outline"}
          size="sm"
          onClick={() => setKFactor(0.5)}
          className="min-w-[130px]"
          data-testid="button-kfactor-decay"
        >
          <Badge variant="secondary" className="mr-2 font-mono text-xs">K = 0.5</Badge>
          Decay
        </Button>
        <Button
          variant={kFactor === 1.2 ? "default" : "outline"}
          size="sm"
          onClick={() => setKFactor(1.2)}
          className="min-w-[130px]"
          data-testid="button-kfactor-growth"
        >
          <Badge variant="default" className="mr-2 font-mono text-xs">K = 1.2</Badge>
          Growth
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-2 text-center">
        {kFactor < 1 
          ? "Without incentives, viral chains die quickly" 
          : "With paid sharing, every share spawns more shares"}
      </p>

      {/* Mindmap SVG */}
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        <motion.svg
          viewBox="0 0 800 400"
          className="w-full max-w-3xl h-auto"
          style={{ overflow: "visible" }}
          animate={{ scale }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatePresence>
            {branches.map(branch => {
              const fromNode = nodes.find(n => n.id === branch.fromId);
              const toNode = nodes.find(n => n.id === branch.toId);
              if (!fromNode || !toNode) return null;
              return (
                <CurvedBranch
                  key={branch.id}
                  from={fromNode}
                  to={toNode}
                  delay={branch.delay}
                  color={nodeColors[toNode.type]}
                  fading={fading}
                />
              );
            })}
          </AnimatePresence>
          <AnimatePresence>
            {nodes.map(node => (
              <NodeCircle key={node.id} node={node} fading={fading && node.id !== "root"} />
            ))}
          </AnimatePresence>
        </motion.svg>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.creator }} />
          <span className="text-xs text-muted-foreground">Creator</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.remix }} />
          <span className="text-xs text-muted-foreground">Remix</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.share }} />
          <span className="text-xs text-muted-foreground">Share</span>
        </div>
      </div>
    </div>
  );
}
