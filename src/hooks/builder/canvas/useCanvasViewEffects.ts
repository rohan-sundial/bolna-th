import { useEffect } from 'react';
import { Node, useReactFlow } from '@xyflow/react';

interface UseCanvasViewEffectsParams {
  nodes: Node[];
  focusNodeId: string | null;
  fitViewTrigger: number;
}

export function useCanvasViewEffects({
  nodes,
  focusNodeId,
  fitViewTrigger,
}: UseCanvasViewEffectsParams) {
  const { fitView } = useReactFlow();

  // Focus on node when focusNodeId changes (from validation panel click)
  useEffect(() => {
    if (focusNodeId) {
      const node = nodes.find((n) => n.id === focusNodeId);
      if (node) {
        fitView({
          nodes: [node],
          duration: 300,
          padding: 0.5,
          maxZoom: 1.5,
        });
      }
    }
  }, [focusNodeId, nodes, fitView]);

  // Fit view when fitViewTrigger changes (e.g., after JSON import)
  useEffect(() => {
    if (fitViewTrigger > 0) {
      setTimeout(() => {
        fitView({ duration: 300, padding: 0.2 });
      }, 50);
    }
  }, [fitViewTrigger, fitView]);
}
