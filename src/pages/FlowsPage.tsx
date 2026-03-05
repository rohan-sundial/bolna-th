import cx from 'classnames';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { FlowsHeader } from '@/components/flows/FlowsHeader';
import { FlowsToolbar, SortOption } from '@/components/flows/FlowsToolbar';
import { WorkflowCard } from '@/components/flows/workflow-card';
import { WorkflowGrid } from '@/components/flows/WorkflowGrid';
import { EmptyState } from '@/components/flows/EmptyState';
import { DeleteWorkflowDialog } from '@/components/flows/DeleteWorkflowDialog';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useCreateWorkflow } from '@/hooks/useCreateWorkflow';
import { useDeleteWorkflow } from '@/hooks/useDeleteWorkflow';
import { IWorkflow } from '@/types/workflow';

export function FlowsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');

  const { workflows, isLoading, isRefetching, refetch } = useWorkflows();
  const { createWorkflow, isCreating } = useCreateWorkflow({
    onSuccess: (workflow) => {
      navigate(`/flows/${workflow.id}`);
    },
  });
  const { deleteWorkflow, isDeleting } = useDeleteWorkflow({
    onSuccess: () => {
      refetch();
      setDeleteDialog({ open: false, workflow: null });
    },
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    workflow: IWorkflow | null;
  }>({ open: false, workflow: null });

  const filteredWorkflows = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query)
    );
  }, [workflows, searchQuery]);

  const sortedWorkflows = useMemo(() => {
    return [...filteredWorkflows].sort((a, b) => {
      const dateA = sortBy === 'updatedAt' ? a.updatedAt : a.createdAt;
      const dateB = sortBy === 'updatedAt' ? b.updatedAt : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredWorkflows, sortBy]);

  const handleCreateClick = async () => {
    await createWorkflow();
  };

  const handleWorkflowClick = (id: string) => {
    navigate(`/flows/${id}`);
  };

  const handleDeleteClick = (workflow: IWorkflow) => {
    setDeleteDialog({ open: true, workflow });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.workflow) {
      await deleteWorkflow(deleteDialog.workflow.id);
    }
  };

  if (isLoading) {
    return (
      <div className={cx('flex items-center justify-center', 'h-64')}>
        <Loader2 className={cx('w-6 h-6', 'text-terracotta-500', 'animate-spin')} />
      </div>
    );
  }

  return (
    <div className={cx('px-6 pt-4 pb-8')}>
      <FlowsHeader onCreateClick={handleCreateClick} isCreating={isCreating} />

      <div className={cx('flex items-center justify-end gap-3', 'mb-4')}>
        {isRefetching && (
          <Loader2 className={cx('w-4 h-4', 'text-charcoal-500', 'animate-spin')} />
        )}
        <FlowsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {sortedWorkflows.length === 0 ? (
        <EmptyState />
      ) : (
        <WorkflowGrid>
          {sortedWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              id={workflow.id}
              name={workflow.name}
              description={workflow.description}
              updatedAt={workflow.updatedAt}
              createdBy={workflow.createdBy}
              searchQuery={searchQuery}
              onClick={() => handleWorkflowClick(workflow.id)}
              onDelete={() => handleDeleteClick(workflow)}
            />
          ))}
        </WorkflowGrid>
      )}

      <DeleteWorkflowDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, workflow: open ? deleteDialog.workflow : null })}
        workflowName={deleteDialog.workflow?.name ?? ''}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
