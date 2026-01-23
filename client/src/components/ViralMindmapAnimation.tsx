import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Node {
  id: string;
  label: string;
  type: "creator" | "remix" | "share";
  x: number;
  y: number;
  parentId: string | null;
  delay: number;
}

interface Branch {
  id: string;
  fromId: string;
  toId: string;
  delay: number;
}

const nodeColors = {
  creator: "rgb(244, 63, 94)", // rose-500
  remix: "rgb(139, 92, 246)", // violet-500
  share: "rgb(14, 165, 233)", // sky-500
};

const nodeLabels = {
  creator: "Creator",
  remix: "Remix",
  share: "Share",
};

function generateViralTree(): { nodes: Node[]; branches: Branch[] } {
  const nodes: Node[] = [];
  const branches: Branch[] = [];
  
  // Central creator node
  nodes.push({
    id: "root",
    label: "Original",
    type: "creator",
    x: 400,
    y: 200,
    parentId: null,
    delay: 0,
  });

  // First generation - remixes and shares from creator
  const gen1Angles = [-45, -15, 15, 45];
  const gen1Types: ("remix" | "share")[] = ["remix", "share", "remix", "share"];
  let nodeId = 1;
  let delay = 0.5;

  gen1Angles.forEach((angle, i) => {
    const radians = (angle * Math.PI) / 180;
    const distance = 120;
    const x = 400 + Math.cos(radians) * distance;
    const y = 200 + Math.sin(radians) * distance;
    const id = `node-${nodeId++}`;
    
    nodes.push({
      id,
      label: nodeLabels[gen1Types[i]],
      type: gen1Types[i],
      x,
      y,
      parentId: "root",
      delay: delay + i * 0.3,
    });
    
    branches.push({
      id: `branch-root-${id}`,
      fromId: "root",
      toId: id,
      delay: delay + i * 0.3 - 0.2,
    });
  });

  // Second generation - more branches
  delay = 2;
  const gen1Nodes = nodes.filter(n => n.parentId === "root");
  gen1Nodes.forEach((parent, pi) => {
    const numChildren = Math.random() > 0.5 ? 2 : 3;
    const baseAngle = Math.atan2(parent.y - 200, parent.x - 400) * (180 / Math.PI);
    
    for (let i = 0; i < numChildren; i++) {
      const spreadAngle = baseAngle + (i - (numChildren - 1) / 2) * 25;
      const radians = (spreadAngle * Math.PI) / 180;
      const distance = 80 + Math.random() * 20;
      const x = parent.x + Math.cos(radians) * distance;
      const y = parent.y + Math.sin(radians) * distance;
      const id = `node-${nodeId++}`;
      const type: "remix" | "share" = Math.random() > 0.5 ? "share" : "remix";
      
      nodes.push({
        id,
        label: nodeLabels[type],
        type,
        x,
        y,
        parentId: parent.id,
        delay: delay + pi * 0.4 + i * 0.15,
      });
      
      branches.push({
        id: `branch-${parent.id}-${id}`,
        fromId: parent.id,
        toId: id,
        delay: delay + pi * 0.4 + i * 0.15 - 0.1,
      });
    }
  });

  // Third generation - even more spread
  delay = 4;
  const gen2Nodes = nodes.filter(n => n.parentId?.startsWith("node-") && parseInt(n.parentId.split("-")[1]) < 5);
  gen2Nodes.slice(0, 6).forEach((parent, pi) => {
    const numChildren = Math.random() > 0.6 ? 1 : 2;
    const baseAngle = Math.atan2(parent.y - 200, parent.x - 400) * (180 / Math.PI);
    
    for (let i = 0; i < numChildren; i++) {
      const spreadAngle = baseAngle + (i - (numChildren - 1) / 2) * 20;
      const radians = (spreadAngle * Math.PI) / 180;
      const distance = 60 + Math.random() * 15;
      const x = parent.x + Math.cos(radians) * distance;
      const y = parent.y + Math.sin(radians) * distance;
      const id = `node-${nodeId++}`;
      const type: "remix" | "share" = Math.random() > 0.4 ? "share" : "remix";
      
      nodes.push({
        id,
        label: nodeLabels[type],
        type,
        x,
        y,
        parentId: parent.id,
        delay: delay + pi * 0.2 + i * 0.1,
      });
      
      branches.push({
        id: `branch-${parent.id}-${id}`,
        fromId: parent.id,
        toId: id,
        delay: delay + pi * 0.2 + i * 0.1 - 0.1,
      });
    }
  });

  return { nodes, branches };
}

function CurvedBranch({ from, to, delay, color }: { from: Node; to: Node; delay: number; color: string }) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  // Add some curve by offsetting the control point perpendicular to the line
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const perpX = -dy * 0.2;
  const perpY = dx * 0.2;
  
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
      animate={{ pathLength: 1, opacity: 0.7 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    />
  );
}

function NodeCircle({ node }: { node: Node }) {
  const isRoot = node.id === "root";
  const size = isRoot ? 50 : node.parentId === "root" ? 35 : 25;
  
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: node.delay, type: "spring", stiffness: 200 }}
    >
      <circle
        cx={node.x}
        cy={node.y}
        r={size / 2}
        fill={nodeColors[node.type]}
        opacity={0.9}
      />
      {isRoot && (
        <text
          x={node.x}
          y={node.y + 4}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          {node.label}
        </text>
      )}
    </motion.g>
  );
}

export function ViralMindmapAnimation() {
  const [treeData, setTreeData] = useState<{ nodes: Node[]; branches: Branch[] } | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setTreeData(generateViralTree());
  }, [key]);

  useEffect(() => {
    // Restart animation every 8 seconds
    const interval = setInterval(() => {
      setKey(k => k + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!treeData) return null;

  const { nodes, branches } = treeData;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <svg
        key={key}
        viewBox="0 0 800 400"
        className="w-full max-w-3xl h-auto"
        style={{ overflow: "visible" }}
      >
        {/* Branches */}
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
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map(node => (
          <NodeCircle key={node.id} node={node} />
        ))}
      </svg>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex gap-6 mt-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: nodeColors.creator }} />
          <span className="text-sm text-muted-foreground">Creator</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: nodeColors.remix }} />
          <span className="text-sm text-muted-foreground">Remix</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: nodeColors.share }} />
          <span className="text-sm text-muted-foreground">Share</span>
        </div>
      </motion.div>
    </div>
  );
}
