import { useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';

interface UseAutoLayoutOptions {
  direction?: 'LR' | 'TB' | 'RL' | 'BT';
  nodeWidth?: number;
  nodeHeight?: number;
  rankSep?: number;
  nodeSep?: number;
}

const DEFAULT_OPTIONS: Required<UseAutoLayoutOptions> = {
  direction: 'LR',
  nodeWidth: 150,
  nodeHeight: 60,
  rankSep: 150,  // Horizontal gap between node columns
  nodeSep: 60,   // Vertical gap between nodes in same column
};

export function useAutoLayout(options: UseAutoLayoutOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } => {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));

      dagreGraph.setGraph({
        rankdir: config.direction,
        ranksep: config.rankSep,
        nodesep: config.nodeSep,
      });

      nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
          width: config.nodeWidth,
          height: config.nodeHeight,
        });
      });

      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

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
    [config.direction, config.nodeWidth, config.nodeHeight, config.rankSep, config.nodeSep]
  );

  return { getLayoutedElements };
}
