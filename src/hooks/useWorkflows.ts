import { useState, useEffect, useCallback } from 'react';
import { workflowStorageService } from '@/services/workflowStorageService';
import { IWorkflow } from '@/types/workflow';
import { toast } from 'sonner';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await workflowStorageService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      setIsRefetching(true);
      const data = await workflowStorageService.getAll();
      setWorkflows(data);
    } catch {
      toast.error('Failed to refresh workflows');
    } finally {
      setIsRefetching(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return {
    workflows,
    isLoading,
    isRefetching,
    error,
    refetch,
  };
}
