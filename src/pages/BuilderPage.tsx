import cx from 'classnames';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { JSONPreviewPanel } from '@/components/builder/JSONPreviewPanel';
import { EditDescriptionDialog } from '@/components/builder/EditDescriptionDialog';
import { DeleteWorkflowDialog } from '@/components/flows/DeleteWorkflowDialog';
import { useBuilderPageConfig } from '@/hooks/builder';

export function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    workflow,
    isLoading,
    error,
    isUpdating,
    isDeleting,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    handleNameChange,
    handleDescriptionSave,
    handleDuplicate,
    handleDelete,
    descriptionDialogOpen,
    setDescriptionDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useBuilderPageConfig(id);

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
    nodes,
    edges,
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

      <div className={cx('flex-1', 'min-h-0')}>
        <BuilderCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onAddNode={addNode}
        />
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
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
