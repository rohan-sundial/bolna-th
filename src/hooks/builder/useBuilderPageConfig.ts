import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useWorkflowActions } from './useWorkflowActions';
import { useCanvasState } from './useCanvasState';
import { useValidation } from './useValidation';
import { useAutoLayout } from './useAutoLayout';
import { useNodeFocus } from './useNodeFocus';

export function useBuilderPageConfig() {
  const { id: workflowId } = useParams<{ id: string }>();

  const {
    workflow,
    isLoading,
    error,
    isUpdating,
    isDeleting,
    updateWorkflow,
    handleNameChange,
    handleDescriptionSave,
    handleDuplicate,
    handleDelete,
  } = useWorkflowActions(workflowId);

  const {
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
    addEdgeFromSidebar,
  } = useCanvasState({
    workflow,
    workflowId,
    onSave: updateWorkflow,
  });

  const validation = useValidation(nodes, edges);
  const { getLayoutedElements } = useAutoLayout();

  const {
    focusNodeId,
    fitViewTrigger,
    handleValidationErrorClick,
    triggerFitView,
  } = useNodeFocus({
    nodes,
    setNodes,
    openNodeForEditing,
  });

  usePageTitle(workflow?.name);

  // Handle JSON import
  const handleImport = useCallback(
    (data: {
      nodes: Node[];
      edges: Edge[];
      name: string;
      description: string;
    }) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        data.nodes,
        data.edges
      );

      closeNodeEditor();
      handleNameChange(data.name);
      handleDescriptionSave(data.description);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      triggerFitView();
    },
    [
      getLayoutedElements,
      closeNodeEditor,
      handleNameChange,
      handleDescriptionSave,
      setNodes,
      setEdges,
      triggerFitView,
    ]
  );

  return {
    // Loading & error state
    isLoading,
    error,
    workflow,

    // Saving & deleting state
    isUpdating,
    isDeleting,

    // Canvas state
    nodes,
    edges,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setEdges,
    focusNodeId,
    fitViewTrigger,

    // Node editing
    editingNode,
    openNodeForEditing,
    closeNodeEditor,
    updateNodeData,
    addNode,
    deleteNode,
    deleteEdge,
    addEdgeFromSidebar,

    // Validation
    validationErrors: validation.errors,
    errorsByNodeId: validation.errorsByNodeId,
    handleValidationErrorClick,

    // Workflow actions
    handleNameChange,
    handleDescriptionSave,
    handleDuplicate,
    handleDelete,
    handleImport,
  };
}
