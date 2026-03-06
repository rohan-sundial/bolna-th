import type { Node, Edge } from "@xyflow/react";
import { NodeDetailsPanelSection } from "./NodeDetailsPanelSection";
import { NodeDetailsPanelNodeChip } from "./NodeDetailsPanelNodeChip";
import { NodeDetailsPanelAddLink } from "./NodeDetailsPanelAddLink";

interface NodeDetailsPanelSimpleOutgoingProps {
  outgoingEdges: Edge[];
  nodes: Node[];
  targetOptions: { id: string; label: string }[];
  canAddOutgoing: boolean;
  onDeleteEdge: (edgeId: string) => void;
  onAddOutgoing: (targetId: string) => void;
}

export function NodeDetailsPanelSimpleOutgoing({
  outgoingEdges,
  nodes,
  targetOptions,
  canAddOutgoing,
  onDeleteEdge,
  onAddOutgoing,
}: NodeDetailsPanelSimpleOutgoingProps) {
  return (
    <NodeDetailsPanelSection label="Outgoing">
      <div className="flex flex-wrap gap-2 items-center">
        {outgoingEdges.map((edge) => (
          <NodeDetailsPanelNodeChip
            key={edge.id}
            nodeId={edge.target}
            nodes={nodes}
            onDelete={() => onDeleteEdge(edge.id)}
          />
        ))}

        {outgoingEdges.length === 0 && !canAddOutgoing && (
          <span className="text-xs text-charcoal-400">None</span>
        )}

        {canAddOutgoing && (
          <NodeDetailsPanelAddLink
            onSelect={(targetId) => onAddOutgoing(targetId)}
            options={targetOptions}
            placeholder="Add"
          />
        )}
      </div>
    </NodeDetailsPanelSection>
  );
}
