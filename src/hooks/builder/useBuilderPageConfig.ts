import { useEffect } from 'react';
import { useWorkflowActions } from './useWorkflowActions';
import { useCanvasState } from './useCanvasState';
import { useBuilderDialogs } from './useBuilderDialogs';

export function useBuilderPageConfig(workflowId: string | undefined) {
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

  const {
    descriptionDialogOpen,
    setDescriptionDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useBuilderDialogs();

  // Document title
  useEffect(() => {
    if (workflow?.name) {
      document.title = `${workflow.name} | Workflow Builder`;
    }
    return () => {
      document.title = 'Workflow Builder';
    };
  }, [workflow?.name]);

  return {
    // Workflow state
    workflow,
    isLoading,
    error,
    isUpdating,
    isDeleting,

    // Canvas
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

    // Actions
    handleNameChange,
    handleDescriptionSave,
    handleDuplicate,
    handleDelete,

    // Dialogs
    descriptionDialogOpen,
    setDescriptionDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  };
}
