import { useState, useCallback } from 'react';
import { workflowStorageService } from '@/services/workflowStorageService';
import { IWorkflow } from '@/types/workflow';
import { toast } from 'sonner';

interface UseCreateWorkflowOptions {
  onSuccess?: (workflow: IWorkflow) => void;
}

export function useCreateWorkflow(options?: UseCreateWorkflowOptions) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createWorkflow = useCallback(async () => {
    try {
      setError(null);
      setIsCreating(true);
      const newWorkflow = await workflowStorageService.create();
      toast.success('Workflow created');
      options?.onSuccess?.(newWorkflow);
      return newWorkflow;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create workflow');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [options]);

  return { createWorkflow, isCreating, error };
}
