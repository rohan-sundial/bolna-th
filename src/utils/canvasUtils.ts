import type { Node } from '@xyflow/react';

const NODE_SPACING = 200;
const DEFAULT_POSITION = { x: 100, y: 100 };

export function calculateDefaultPosition(nodes: Node[]): { x: number; y: number } {
  if (nodes.length === 0) {
    return DEFAULT_POSITION;
  }

  const rightmostNode = nodes.reduce((rightmost, node) =>
    node.position.x > rightmost.position.x ? node : rightmost
  );

  return {
    x: rightmostNode.position.x + NODE_SPACING,
    y: rightmostNode.position.y,
  };
}
