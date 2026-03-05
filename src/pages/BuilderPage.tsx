import { useState, useEffect } from 'react';
import cx from 'classnames';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { JSONPreviewPanel } from '@/components/builder/JSONPreviewPanel';
import { EditDescriptionDialog } from '@/components/builder/EditDescriptionDialog';
import { DeleteWorkflowDialog } from '@/components/flows/DeleteWorkflowDialog';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useUpdateWorkflow } from '@/hooks/useUpdateWorkflow';
import { useDeleteWorkflow } from '@/hooks/useDeleteWorkflow';
import { workflowStorageService } from '@/services/workflowStorageService';

export function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workflow, setWorkflow, isLoading, error } = useWorkflow(id);
  const { updateWorkflow, isUpdating } = useUpdateWorkflow({
    onSuccess: (updated) => {
      setWorkflow(updated);
    },
  });
  const { deleteWorkflow, isDeleting } = useDeleteWorkflow({
    onSuccess: () => {
      navigate('/flows');
    },
  });

  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (workflow) {
      document.title = `${workflow.name} | Workflow Builder`;
    }
    return () => {
      document.title = 'Workflow Builder';
    };
  }, [workflow?.name]);

  const handleNameChange = async (name: string) => {
    if (id && name !== workflow?.name) {
      await updateWorkflow(id, { name });
    }
  };

  const handleDescriptionSave = async (description: string) => {
    if (id) {
      await updateWorkflow(id, { description });
      toast.success('Description updated');
    }
  };

  const handleDuplicate = async () => {
    if (!workflow) return;

    try {
      const newWorkflow = await workflowStorageService.create();
      await workflowStorageService.update(newWorkflow.id, {
        name: `${workflow.name} (Copy)`,
        description: workflow.description,
      });
      toast.success('Workflow duplicated');
      navigate(`/flows/${newWorkflow.id}`);
    } catch {
      toast.error('Failed to duplicate workflow');
    }
  };

  const handleDeleteConfirm = async () => {
    if (id) {
      await deleteWorkflow(id);
    }
  };

  if (isLoading) {
    return (
      <div className={cx('flex-1 flex items-center justify-center')}>
        <Loader2 className={cx('w-6 h-6', 'text-terracotta-500', 'animate-spin')} />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className={cx('flex-1 flex flex-col items-center justify-center gap-4')}>
        <p className="text-charcoal-700">Workflow not found</p>
        <button
          onClick={() => navigate('/flows')}
          className={cx('text-terracotta-600', 'hover:underline')}
        >
          Back to workflows
        </button>
      </div>
    );
  }

  const jsonData = {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    nodes: [],
    edges: [],
  };

  return (
    <div className={cx('flex-1 flex flex-col', 'min-h-0')}>
      <BuilderHeader
        name={workflow.name}
        onNameChange={handleNameChange}
        onDescriptionEdit={() => setDescriptionDialogOpen(true)}
        onDuplicate={handleDuplicate}
        onDelete={() => setDeleteDialogOpen(true)}
        isSaving={isUpdating}
      />

      <div className={cx('flex-1', 'bg-cream-100', 'relative', 'min-h-0')}>
        <div
          className={cx(
            'absolute inset-0',
            'flex items-center justify-center',
            'text-charcoal-500'
          )}
        >
          Canvas placeholder - React Flow will go here
        </div>
      </div>

      <JSONPreviewPanel data={jsonData} />

      <EditDescriptionDialog
        open={descriptionDialogOpen}
        onOpenChange={setDescriptionDialogOpen}
        description={workflow.description}
        onSave={handleDescriptionSave}
      />

      <DeleteWorkflowDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        workflowName={workflow.name}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
