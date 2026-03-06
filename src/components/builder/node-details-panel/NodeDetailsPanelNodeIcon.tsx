import type { Node } from "@xyflow/react";
import cx from "classnames";
import { nodeTypeStyles } from "./nodeTypeStyles";

interface NodeDetailsPanelNodeIconProps {
  node: Node;
}

export function NodeDetailsPanelNodeIcon({
  node,
}: NodeDetailsPanelNodeIconProps) {
  const style = node.type ? nodeTypeStyles[node.type] : undefined;

  if (!style) return null;

  const Icon = style.icon;

  return (
    <span className={cx("p-1 rounded", style.bgColor)}>
      <Icon className="w-3 h-3 text-white" fill={style.iconFill} />
    </span>
  );
}
