import { useCallback, useState } from "react";
import cx from "classnames";
import { Trash2 } from "lucide-react";
import { DeleteNodeDialog } from "../DeleteNodeDialog";

interface NodeDetailsPanelDeleteButtonProps {
  nodeId: string;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export function NodeDetailsPanelDeleteButton({
  nodeId,
  onDelete,
  onClose,
}: NodeDetailsPanelDeleteButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(nodeId);
    onClose();
  }, [nodeId, onDelete, onClose]);

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className={cx(
          "p-1 rounded-lg",
          "text-charcoal-400 hover:text-red-500",
          "hover:bg-cream-300/70",
          "transition-colors",
        )}
        title="Delete node"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {showDeleteDialog && (
        <DeleteNodeDialog
          open
          onOpenChange={() => setShowDeleteDialog(false)}
          nodeCount={1}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
