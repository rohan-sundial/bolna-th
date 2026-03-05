import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { IWorkflow } from '@/types/workflow';

interface UseCanvasInitOptions {
  workflow: IWorkflow | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export function useCanvasInit({
  workflow,
  setNodes,
  setEdges,
}: UseCanvasInitOptions) {
  const lastInitializedIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (workflow && workflow.id !== lastInitializedIdRef.current) {
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      lastInitializedIdRef.current = workflow.id;
    }
  }, [workflow, setNodes, setEdges]);

  return { isInitialized: lastInitializedIdRef.current === workflow?.id };
}
