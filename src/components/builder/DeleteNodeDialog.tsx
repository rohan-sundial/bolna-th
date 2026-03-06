import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

function getTitle(nodeCount: number, edgeCount: number) {
  if (nodeCount > 0 && edgeCount > 0) {
    return "Delete selection?";
  }
  if (nodeCount === 1) {
    return "Delete node?";
  }
  if (nodeCount > 1) {
    return `Delete ${nodeCount} nodes?`;
  }
  if (edgeCount === 1) {
    return "Delete edge?";
  }
  return `Delete ${edgeCount} edges?`;
}

function getDescription(nodeCount: number, edgeCount: number) {
  const parts: string[] = [];

  if (nodeCount === 1) {
    parts.push("1 node");
  } else if (nodeCount > 1) {
    parts.push(`${nodeCount} nodes`);
  }

  if (edgeCount === 1) {
    parts.push("1 edge");
  } else if (edgeCount > 1) {
    parts.push(`${edgeCount} edges`);
  }

  const itemsText = parts.join(" and ");
  const hasNodes = nodeCount > 0;

  if (hasNodes) {
    return `Are you sure you want to delete ${itemsText}? Additional connected edges may also be removed.`;
  }
  return `Are you sure you want to delete ${itemsText}?`;
}

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
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle(nodeCount, edgeCount)}
      description={getDescription(nodeCount, edgeCount)}
      confirmLabel="Delete"
      onConfirm={onConfirm}
      variant="destructive"
    />
  );
}
