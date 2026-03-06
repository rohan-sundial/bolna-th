import { useState, useEffect, useCallback } from 'react';
import { workflowStorageService } from '@/services/workflowStorageService';
import { IWorkflow } from '@/types/workflow';
import { toast } from 'sonner';

export function useWorkflow(id: string | undefined) {
  const [workflow, setWorkflow] = useState<IWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflow = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      const data = await workflowStorageService.getById(id);
      if (!data) {
        setError(new Error('Workflow not found'));
      } else {
        setWorkflow(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflow'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async () => {
    if (!id) return;

    try {
      const data = await workflowStorageService.getById(id);
      if (data) {
        setWorkflow(data);
      }
    } catch {
      toast.error('Failed to refresh workflow');
    }
  }, [id]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  return {
    workflow,
    setWorkflow,
    isLoading,
    error,
    refetch,
  };
}
