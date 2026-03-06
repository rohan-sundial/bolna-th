import { useCallback } from "react";
import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useAutoLayout } from "@/hooks/builder/useAutoLayout";

/**
 * Canvas-specific wrapper around useAutoLayout that applies the layout
 * to the current canvas state and adjusts the viewport to fit all nodes.
 */

interface UseCanvasAutoLayoutParams {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export function useCanvasAutoLayout({
  nodes,
  edges,
  setNodes,
  setEdges,
}: UseCanvasAutoLayoutParams) {
  const { fitView } = useReactFlow();
  const { getLayoutedElements } = useAutoLayout();

  // Applies auto-layout to nodes and fits the viewport to show all nodes
  const handleAutoLayout = useCallback(() => {
    // Calculate new positions using dagre layout algorithm
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
    );

    // Update canvas with new node positions
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Delay fitView to allow React to render the new positions first
    setTimeout(() => {
      fitView({ padding: 0.3, duration: 300, maxZoom: 1 });
    }, 50);
  }, [nodes, edges, getLayoutedElements, setNodes, setEdges, fitView]);

  return {
    handleAutoLayout,
  };
}
