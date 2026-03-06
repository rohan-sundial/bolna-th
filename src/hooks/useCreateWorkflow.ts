import { useState, useCallback } from 'react';
import { workflowStorageService } from '@/services/workflowStorageService';
import { IWorkflow } from '@/types/workflow';
import { useAuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';

interface UseCreateWorkflowOptions {
  onSuccess?: (workflow: IWorkflow) => void;
}

export function useCreateWorkflow(options?: UseCreateWorkflowOptions) {
  const { user } = useAuthContext();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createWorkflow = useCallback(async () => {
    try {
      setError(null);
      setIsCreating(true);
      const newWorkflow = await workflowStorageService.create(user?.name);
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
  }, [options, user]);

  return { createWorkflow, isCreating, error };
}
