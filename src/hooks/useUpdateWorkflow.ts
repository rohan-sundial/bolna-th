import { useState, useCallback } from 'react';
import { workflowStorageService } from '@/services/workflowStorageService';
import { IWorkflow, UpdateWorkflowInput } from '@/types/workflow';
import { toast } from 'sonner';

interface UseUpdateWorkflowOptions {
  onSuccess?: (workflow: IWorkflow) => void;
}

export function useUpdateWorkflow(options?: UseUpdateWorkflowOptions) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateWorkflow = useCallback(
    async (id: string, input: UpdateWorkflowInput) => {
      try {
        setError(null);
        setIsUpdating(true);
        const updated = await workflowStorageService.update(id, input);
        options?.onSuccess?.(updated);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update workflow');
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [options]
  );

  return { updateWorkflow, isUpdating, error };
}
