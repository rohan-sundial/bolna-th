import type { Node } from "@xyflow/react";
import cx from "classnames";
import { NodeDetailsPanelCloseButton } from "./NodeDetailsPanelCloseButton";
import { NodeDetailsPanelDeleteButton } from "./NodeDetailsPanelDeleteButton";
import { NodeDetailsPanelNodeIcon } from "./NodeDetailsPanelNodeIcon";
import { nodeTypeStyles } from "./nodeTypeStyles";

interface NodeDetailsPanelHeaderProps {
  node: Node;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export function NodeDetailsPanelHeader({
  node,
  onDelete,
  onClose,
}: NodeDetailsPanelHeaderProps) {
  const style = node.type ? nodeTypeStyles[node.type] : undefined;

  return (
    <div
      className={cx(
        "flex items-center gap-2",
        "px-3 py-2",
        "border-b border-cream-300/50",
      )}
    >
      <NodeDetailsPanelNodeIcon node={node} />

      <span className={cx("flex-1", "text-xs font-medium", style?.textColor)}>
        {style?.label || node.type || "Node"}
      </span>

      <NodeDetailsPanelDeleteButton
        nodeId={node.id}
        onDelete={onDelete}
        onClose={onClose}
      />

      <NodeDetailsPanelCloseButton onClose={onClose} />
    </div>
  );
}
