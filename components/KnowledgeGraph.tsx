"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { GraphData, GraphNode, GraphLink } from "@/lib/interfaces";
import { CATEGORY_COLORS } from "@/lib/utils";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Loading graph...
    </div>
  ),
});

interface KnowledgeGraphProps {
  graphData: GraphData;
  width?: number;
  height?: number;
  highlightSlug?: string;
  mini?: boolean;
}

export function KnowledgeGraph({
  graphData,
  width,
  height = 500,
  highlightSlug,
  mini = false,
}: KnowledgeGraphProps) {
  const router = useRouter();
  const graphRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: width || 800, height });
  const timeRef = useRef(0);
  const particleParamsRef = useRef<
    Map<
      string,
      { angle: number; angularVel: number; speed: number; phaseZ: number; freqZ: number }
    >
  >(new Map());

  useEffect(() => {
    if (!width && containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height,
          });
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [width, height]);

  // Initialize particle parameters — each node gets a travel direction, turn rate, and speed
  useEffect(() => {
    const params = particleParamsRef.current;
    const tau = Math.PI * 2;
    const scale = mini ? 0.5 : 1;
    for (const node of graphData.nodes) {
      if (!params.has(node.id)) {
        params.set(node.id, {
          angle: Math.random() * tau,
          angularVel: (Math.random() - 0.5) * 0.03 * scale,
          speed: (0.08 + Math.random() * 0.06) * scale,
          phaseZ: Math.random() * tau,
          freqZ: 0.001 + Math.random() * 0.002,
        });
      }
    }
  }, [graphData.nodes, mini]);

  // Register particle drift force + periodic reheat to keep simulation alive
  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;

    const timer = setTimeout(() => {
      fg.d3Force("drift", () => {
        const t = timeRef.current++;
        for (const node of graphData.nodes) {
          const n = node as any; // eslint-disable-line @typescript-eslint/no-explicit-any
          const p = particleParamsRef.current.get(node.id);
          if (n.vx !== undefined && p) {
            p.angle += p.angularVel + (Math.random() - 0.5) * 0.01;
            n.vx += Math.cos(p.angle) * p.speed;
            n.vy += Math.sin(p.angle) * p.speed;
            n._z = Math.sin(p.phaseZ + t * p.freqZ);
          }
        }
      });
    }, 500);

    // Reheat every 3s so charge/center forces stay active and nodes keep repelling
    const reheat = setInterval(() => {
      fg.d3ReheatSimulation?.();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(reheat);
    };
  }, [graphData.nodes]);

  // Build set of connected nodes for highlighting
  const getConnectedNodes = useCallback(
    (nodeId: string): Set<string> => {
      const connected = new Set<string>([nodeId]);
      for (const link of graphData.links) {
        const source = typeof link.source === "object" ? (link.source as any).id : link.source;
        const target = typeof link.target === "object" ? (link.target as any).id : link.target;
        if (source === nodeId) connected.add(target);
        if (target === nodeId) connected.add(source);
      }
      return connected;
    },
    [graphData.links]
  );

  const activeNode = hoveredNode || highlightSlug;
  const connectedNodes = activeNode ? getConnectedNodes(activeNode) : null;

  const handleNodeClick = useCallback(
    (node: any) => {
      router.push(`/blog/${node.id}`);
    },
    [router]
  );

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name as string;
      const category = node.category as string;
      const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "#6B7280";
      const nodeId = node.id as string;

      const isActive = activeNode === nodeId;
      const isConnected = connectedNodes ? connectedNodes.has(nodeId) : true;
      const dimmed = connectedNodes && !isConnected;

      // Simulated z-depth: modulates size and opacity for 3D feel
      const z = (node._z as number) || 0; // -1 to 1
      const depthScale = 0.85 + 0.15 * z; // 0.85–1.0
      const depthAlpha = 0.8 + 0.2 * z; // 0.6–1.0

      const baseRadius = (mini ? 4 : 5 + (node.val || 1) * 1.5) * depthScale;
      const radius = isActive ? baseRadius * 1.3 : baseRadius;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
      if (dimmed) {
        ctx.fillStyle = `${color}30`;
      } else {
        ctx.globalAlpha = depthAlpha;
        ctx.fillStyle = color;
      }
      ctx.fill();
      ctx.globalAlpha = 1;

      if (isActive) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw label (skip in mini mode unless hovered)
      if (!mini || isActive) {
        const fontSize = Math.max(mini ? 6 : 8, (mini ? 7 : 9) / globalScale);
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const labelAlpha = dimmed ? 0.15 : 0.35 + 0.2 * z;
        ctx.fillStyle = `rgba(0,0,0,${labelAlpha})`;
        ctx.fillText(label, node.x!, node.y! + radius + 3);
      }
    },
    [mini, activeNode, connectedNodes]
  );

  const linkCanvasObject = useCallback(
    (link: any, ctx: CanvasRenderingContext2D) => {
      const source = link.source;
      const target = link.target;
      if (!source.x || !target.x) return;

      const sourceId = typeof source === "object" ? source.id : source;
      const targetId = typeof target === "object" ? target.id : target;
      const isConnected =
        !connectedNodes ||
        (connectedNodes.has(sourceId) && connectedNodes.has(targetId));

      const linkType = link.type as string;
      const strength = link.strength as number;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);

      if (linkType === "shared-tags") {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isConnected
          ? `rgba(0,0,0,${0.1 + strength * 0.15})`
          : "rgba(0,0,0,0.03)";
        ctx.lineWidth = 0.8;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = isConnected ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)";
        ctx.lineWidth = 1.5;
      }

      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    [connectedNodes]
  );

  if (graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No articles yet to visualize.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#FDF8F0"
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeClick={handleNodeClick}
        onNodeHover={(node: any) => setHoveredNode(node?.id || null)}
        d3AlphaDecay={0.002}
        d3AlphaMin={0}
        d3VelocityDecay={0.15}
        cooldownTicks={Infinity}
        enableZoomInteraction={!mini}
        enablePanInteraction={!mini}
        linkDirectionalParticles={0}
        nodeRelSize={6}
      />
    </div>
  );
}
