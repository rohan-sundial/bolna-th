import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useUpdateWorkflow } from '@/hooks/useUpdateWorkflow';
import { useDeleteWorkflow } from '@/hooks/useDeleteWorkflow';
import { workflowStorageService } from '@/services/workflowStorageService';

export function useWorkflowActions(workflowId: string | undefined) {
  const navigate = useNavigate();
  const { workflow, setWorkflow, isLoading, error } = useWorkflow(workflowId);

  const onUpdateSuccess = useCallback(
    (updated: Parameters<typeof setWorkflow>[0]) => {
      setWorkflow(updated);
    },
    [setWorkflow]
  );

  const updateOptions = useMemo(
    () => ({ onSuccess: onUpdateSuccess }),
    [onUpdateSuccess]
  );

  const { updateWorkflow, isUpdating } = useUpdateWorkflow(updateOptions);

  const onDeleteSuccess = useCallback(() => {
    navigate('/flows');
  }, [navigate]);

  const deleteOptions = useMemo(
    () => ({ onSuccess: onDeleteSuccess }),
    [onDeleteSuccess]
  );

  const { deleteWorkflow, isDeleting } = useDeleteWorkflow(deleteOptions);

  const handleNameChange = useCallback(
    async (name: string) => {
      if (workflowId && name !== workflow?.name) {
        await updateWorkflow(workflowId, { name });
      }
    },
    [workflowId, workflow?.name, updateWorkflow]
  );

  const handleDescriptionSave = useCallback(
    async (description: string) => {
      if (workflowId) {
        await updateWorkflow(workflowId, { description });
        toast.success('Description updated');
      }
    },
    [workflowId, updateWorkflow]
  );

  const handleDuplicate = useCallback(async () => {
    if (!workflow) return;

    try {
      const newWorkflow = await workflowStorageService.create();
      await workflowStorageService.update(newWorkflow.id, {
        name: `${workflow.name} (Copy)`,
        description: workflow.description,
        nodes: workflow.nodes,
        edges: workflow.edges,
      });
      toast.success('Workflow duplicated');
      navigate(`/flows/${newWorkflow.id}`);
    } catch {
      toast.error('Failed to duplicate workflow');
    }
  }, [workflow, navigate]);

  const handleDelete = useCallback(async () => {
    if (workflowId) {
      await deleteWorkflow(workflowId);
    }
  }, [workflowId, deleteWorkflow]);

  return {
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
  };
}
