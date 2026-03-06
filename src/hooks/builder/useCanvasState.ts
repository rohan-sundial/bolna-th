import { useCallback, useState, useEffect } from 'react';
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
  const [editingNode, setEditingNode] = useState<Node | null>(null);

  // Close sidebar if editing node no longer exists (e.g., deleted via multi-select)
  useEffect(() => {
    if (editingNode && !nodes.find((n) => n.id === editingNode.id)) {
      setEditingNode(null);
    }
  }, [nodes, editingNode]);

  const openNodeForEditing = useCallback((node: Node) => {
    // Always look up fresh node from nodes array to ensure latest data
    setNodes((currentNodes) => {
      const freshNode = currentNodes.find((n) => n.id === node.id);
      setEditingNode(freshNode || node);
      return currentNodes;
    });
  }, [setNodes]);

  const closeNodeEditor = useCallback(() => {
    setEditingNode(null);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      setEditingNode((prev) =>
        prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...data } } : prev
      );
    },
    [setNodes]
  );

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

  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges]
  );

  const updateEdgeLabel = useCallback(
    (edgeId: string, label: string) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? { ...e, data: { ...e.data, label: label || undefined } }
            : e
        )
      );
    },
    [setEdges]
  );

  const addEdgeFromSidebar = useCallback(
    (sourceId: string, targetId: string, sourceHandle?: string) => {
      const connection: Connection = {
        source: sourceId,
        target: targetId,
        sourceHandle: sourceHandle || null,
        targetHandle: null,
      };

      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    editingNode,
    openNodeForEditing,
    closeNodeEditor,
    updateNodeData,
    addNode,
    deleteNode,
    deleteEdge,
    updateEdgeLabel,
    addEdgeFromSidebar,
  };
}
