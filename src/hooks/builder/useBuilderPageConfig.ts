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
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
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
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,

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
