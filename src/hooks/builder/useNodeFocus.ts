import { useEffect, useCallback, useState } from 'react';
import type { Node } from '@xyflow/react';

interface UseNodeFocusParams {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  openNodeForEditing: (node: Node) => void;
}

export function useNodeFocus({
  nodes,
  setNodes,
  openNodeForEditing,
}: UseNodeFocusParams) {
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [fitViewTrigger, setFitViewTrigger] = useState(0);

  // Clear focusNodeId after it's been used (one-time trigger)
  useEffect(() => {
    if (focusNodeId) {
      const timer = setTimeout(() => setFocusNodeId(null), 350);
      return () => clearTimeout(timer);
    }
  }, [focusNodeId]);

  // Handle clicking on a validation error - select node, focus, and open sidebar
  const handleValidationErrorClick = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            selected: n.id === nodeId,
          }))
        );
        setFocusNodeId(nodeId);
        openNodeForEditing(node);
      }
    },
    [nodes, setNodes, openNodeForEditing]
  );

  // Trigger fit view (e.g., after import)
  const triggerFitView = useCallback(() => {
    setFitViewTrigger((prev) => prev + 1);
  }, []);

  return {
    focusNodeId,
    fitViewTrigger,
    handleValidationErrorClick,
    triggerFitView,
  };
}
