import { MouseEvent, useCallback, useState } from 'react';
import { Connection, Edge, Node, reconnectEdge } from '@xyflow/react';

interface UseCanvasInteractionsParams {
  nodes: Node[];
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  editingNode: Node | null;
  onNodeDoubleClick: (node: Node) => void;
}

export function useCanvasInteractions({
  nodes,
  edges,
  setEdges,
  editingNode,
  onNodeDoubleClick,
}: UseCanvasInteractionsParams) {
  const [interactionMode, setInteractionMode] = useState<'pan' | 'select'>('pan');

  // Handles dragging an existing edge to reconnect it to a different node
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((edges) => reconnectEdge(oldEdge, newConnection, edges));
    },
    [setEdges],
  );

  // Validates whether a new connection between nodes is allowed
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // No self-connections
      if (connection.source === connection.target) {
        return false;
      }

      // Start node cannot be a target
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (targetNode?.type === 'start') {
        return false;
      }

      // Check if there's already an edge from this sourceHandle
      const existingEdge = edges.find(
        (e) =>
          e.source === connection.source &&
          e.sourceHandle === connection.sourceHandle,
      );
      if (existingEdge) {
        return false;
      }

      return true;
    },
    [nodes, edges],
  );

  // Opens the node sidebar for editing on double-click
  const handleNodeDoubleClick = useCallback(
    (_event: MouseEvent, node: Node) => {
      onNodeDoubleClick(node);
    },
    [onNodeDoubleClick],
  );

  // Switches sidebar to clicked node if sidebar is already open
  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: Node) => {
      // If sidebar is open, switch to clicked node
      if (editingNode) {
        onNodeDoubleClick(node);
      }
    },
    [editingNode, onNodeDoubleClick],
  );

  return {
    interactionMode,
    setInteractionMode,
    onReconnect,
    isValidConnection,
    handleNodeDoubleClick,
    handleNodeClick,
  };
}
