import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface DeleteNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeCount: number;
  edgeCount?: number;
  onConfirm: () => void;
}

export function DeleteNodeDialog({
  open,
  onOpenChange,
  nodeCount,
  edgeCount = 0,
  onConfirm,
}: DeleteNodeDialogProps) {
  const getTitle = () => {
    if (nodeCount > 0 && edgeCount > 0) {
      return 'Delete selection?';
    }
    if (nodeCount === 1) {
      return 'Delete node?';
    }
    if (nodeCount > 1) {
      return `Delete ${nodeCount} nodes?`;
    }
    if (edgeCount === 1) {
      return 'Delete edge?';
    }
    return `Delete ${edgeCount} edges?`;
  };

  const getDescription = () => {
    const parts: string[] = [];
    
    if (nodeCount === 1) {
      parts.push('1 node');
    } else if (nodeCount > 1) {
      parts.push(`${nodeCount} nodes`);
    }
    
    if (edgeCount === 1) {
      parts.push('1 edge');
    } else if (edgeCount > 1) {
      parts.push(`${edgeCount} edges`);
    }
    
    const itemsText = parts.join(' and ');
    const hasNodes = nodeCount > 0;
    
    if (hasNodes) {
      return `Are you sure you want to delete ${itemsText}? Additional connected edges may also be removed.`;
    }
    return `Are you sure you want to delete ${itemsText}?`;
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      description={getDescription()}
      confirmLabel="Delete"
      onConfirm={onConfirm}
      variant="destructive"
    />
  );
}
