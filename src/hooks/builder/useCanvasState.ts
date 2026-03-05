import { useCallback } from 'react';
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from '@xyflow/react';
import { IWorkflow, UpdateWorkflowInput } from '@/types/workflow';
import { useCanvasInit } from './useCanvasInit';
import { useCanvasAutoSave } from './useCanvasAutoSave';
import { useNodeOperations } from './useNodeOperations';

interface UseCanvasStateOptions {
  workflow: IWorkflow | null;
  workflowId: string | undefined;
  onSave: (id: string, input: UpdateWorkflowInput) => void;
}

export function useCanvasState({ workflow, workflowId, onSave }: UseCanvasStateOptions) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { isInitialized } = useCanvasInit({
    workflow,
    setNodes,
    setEdges,
  });

  useCanvasAutoSave({
    workflowId,
    nodes,
    edges,
    isInitialized,
    onSave,
  });

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const { addNode, deleteNode } = useNodeOperations({ nodes, setNodes });

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
  };
}
