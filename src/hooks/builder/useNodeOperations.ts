import { useCallback } from 'react';
import type { Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { calculateDefaultPosition } from '@/utils/canvasUtils';

type NodeType = 'start' | 'action' | 'condition';

function getDefaultNodeData(type: NodeType) {
  switch (type) {
    case 'start':
      return {};
    case 'action':
      return { label: 'Action' };
    case 'condition':
      return { label: 'Condition', branches: ['Yes', 'No'] };
  }
}

interface UseNodeOperationsOptions {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export function useNodeOperations({ nodes, setNodes }: UseNodeOperationsOptions) {
  const addNode = useCallback(
    (type: NodeType, position?: { x: number; y: number }) => {
      const newNode: Node = {
        id: uuidv4(),
        type,
        position: position || calculateDefaultPosition(nodes),
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    },
    [setNodes]
  );

  return {
    addNode,
    deleteNode,
  };
}
