import cx from "classnames";
import { X } from "lucide-react";

interface NodeDetailsPanelCloseButtonProps {
  onClose: () => void;
}

export function NodeDetailsPanelCloseButton({
  onClose,
}: NodeDetailsPanelCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className={cx(
        "p-1 rounded-lg",
        "text-charcoal-400 hover:text-charcoal-600",
        "hover:bg-cream-300/70",
        "transition-colors",
      )}
      title="Close"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
}
