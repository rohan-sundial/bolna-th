import { useState, useCallback } from 'react';
import { workflowStorageService } from '@/services/workflowStorageService';
import { toast } from 'sonner';

interface UseDeleteWorkflowOptions {
  onSuccess?: (id: string) => void;
}

export function useDeleteWorkflow(options?: UseDeleteWorkflowOptions) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteWorkflow = useCallback(
    async (id: string) => {
      try {
        setError(null);
        setIsDeleting(true);
        await workflowStorageService.delete(id);
        toast.success('Workflow deleted');
        options?.onSuccess?.(id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete workflow');
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [options]
  );

  return { deleteWorkflow, isDeleting, error };
}
