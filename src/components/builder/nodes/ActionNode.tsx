import { memo } from "react";
import { Position, NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { NodeWrapper, NodeHeader, NodeHandle } from "./common";

export const ActionNode = memo(function ActionNode({
  data,
  selected,
}: NodeProps) {
  const label = (data as { label?: string })?.label || "Action";

  return (
    <NodeWrapper colorScheme="clay" selected={selected}>
      <NodeHandle type="target" position={Position.Left} colorScheme="clay" />
      <NodeHeader
        icon={<Zap className="w-3 h-3 text-white" fill="white" />}
        label={label}
        colorScheme="clay"
      />
      <NodeHandle type="source" position={Position.Right} colorScheme="clay" />
    </NodeWrapper>
  );
});
