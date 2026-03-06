import type { Edge, Node } from "@xyflow/react";
import dagre from "dagre";
import { useCallback } from "react";

/**
 * Hook that uses the Dagre library to automatically arrange nodes
 * in a hierarchical/directed graph layout (like a flowchart).
 */

interface UseAutoLayoutOptions {
  direction?: "LR" | "TB" | "RL" | "BT"; // LR=left-to-right, TB=top-to-bottom, etc.
  nodeWidth?: number;
  nodeHeight?: number;
  rankSep?: number; // Gap between columns (ranks) of nodes
  nodeSep?: number; // Gap between nodes in the same column
}

const DEFAULT_OPTIONS: Required<UseAutoLayoutOptions> = {
  direction: "LR",
  nodeWidth: 150,
  nodeHeight: 60,
  rankSep: 150, // Horizontal gap between node columns
  nodeSep: 60, // Vertical gap between nodes in same column
};

export function useAutoLayout(options: UseAutoLayoutOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  // Takes React Flow nodes/edges and returns them with calculated positions
  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } => {
      // Create a new directed graph instance
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));

      // Configure the graph layout direction and spacing
      dagreGraph.setGraph({
        rankdir: config.direction,
        ranksep: config.rankSep,
        nodesep: config.nodeSep,
      });

      // Register all nodes with their dimensions
      nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
          width: config.nodeWidth,
          height: config.nodeHeight,
        });
      });

      // Register all edges (connections between nodes)
      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      // Run the dagre layout algorithm to calculate positions
      dagre.layout(dagreGraph);

      // Map the calculated positions back to React Flow node format
      // Dagre returns center positions, so we offset by half width/height
      const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - config.nodeWidth / 2,
            y: nodeWithPosition.y - config.nodeHeight / 2,
          },
        };
      });

      return { nodes: layoutedNodes, edges };
    },
    [
      config.direction,
      config.nodeWidth,
      config.nodeHeight,
      config.rankSep,
      config.nodeSep,
    ],
  );

  return { getLayoutedElements };
}
