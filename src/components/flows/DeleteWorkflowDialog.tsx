import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface DeleteWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteWorkflowDialog({
  open,
  onOpenChange,
  workflowName,
  onConfirm,
  isDeleting,
}: DeleteWorkflowDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete workflow?"
      description={`Are you sure you want to delete "${workflowName}"? This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={onConfirm}
      isLoading={isDeleting}
      variant="destructive"
    />
  );
}
