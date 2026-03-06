import type { Node } from "@xyflow/react";
import cx from "classnames";
import { X } from "lucide-react";
import { nodeTypeStyles, NodeData } from "./nodeTypeStyles";

interface NodeDetailsPanelNodeChipProps {
  nodeId: string;
  nodes: Node[];
  onDelete?: () => void;
}

export function NodeDetailsPanelNodeChip({
  nodeId,
  nodes,
  onDelete,
}: NodeDetailsPanelNodeChipProps) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return <span className="text-xs text-charcoal-400">{nodeId}</span>;

  const nodeData = node.data as NodeData;
  const style = node.type ? nodeTypeStyles[node.type] : undefined;
  const label = nodeData.label || style?.label || "Node";

  return (
    <span
      className={cx(
        "group inline-flex items-center gap-1.5 px-2 py-1 rounded-md",
        "bg-white border border-cream-300",
        "text-xs font-medium",
      )}
    >
      {style && (
        <span className={cx("p-0.5 rounded", style.bgColor)}>
          <style.icon className="w-2.5 h-2.5 text-white" fill={style.iconFill} />
        </span>
      )}
      <span className={cx(style?.textColor, "truncate max-w-[100px]")}>
        {label}
      </span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cx(
            "p-0.5 -mr-1 rounded",
            "text-charcoal-300 hover:text-red-500",
            "opacity-0 group-hover:opacity-100",
            "transition-all",
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
