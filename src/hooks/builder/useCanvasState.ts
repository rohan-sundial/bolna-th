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
      const sourceNode = nodes.find((n) => n.id === connection.source);
      let label: string | undefined;

      if (sourceNode?.type === 'condition' && connection.sourceHandle) {
        const branchIndex = parseInt(connection.sourceHandle.replace('branch-', ''), 10);
        const branches = (sourceNode.data as { branches?: string[] })?.branches || ['Yes', 'No'];
        label = branches[branchIndex];
      }

      const edge = {
        ...connection,
        data: label ? { label } : undefined,
      };

      setEdges((eds) => addEdge(edge, eds));
    },
    [nodes, setEdges]
  );

  const { addNode, deleteNode } = useNodeOperations({ nodes, setNodes });

  return {
    nodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
  };
}
