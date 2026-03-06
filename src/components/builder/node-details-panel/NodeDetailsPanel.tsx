import type { Node, Edge } from "@xyflow/react";
import { NodeDetailsPanelWrapper } from "./NodeDetailsPanelWrapper";
import { NodeDetailsPanelHeader } from "./NodeDetailsPanelHeader";
import { NodeDetailsPanelContent } from "./NodeDetailsPanelContent";

interface NodeDetailsPanelProps {
  node: Node;
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  onUpdateData: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddEdge: (
    sourceId: string,
    targetId: string,
    sourceHandle?: string,
  ) => void;
}

export function NodeDetailsPanel({
  node,
  nodes,
  edges,
  onClose,
  onDelete,
  onUpdateData,
  onDeleteEdge,
  onAddEdge,
}: NodeDetailsPanelProps) {
  return (
    <NodeDetailsPanelWrapper>
      <NodeDetailsPanelHeader
        node={node}
        onDelete={onDelete}
        onClose={onClose}
      />

      <NodeDetailsPanelContent
        node={node}
        nodes={nodes}
        edges={edges}
        onUpdateData={onUpdateData}
        onDeleteEdge={onDeleteEdge}
        onAddEdge={onAddEdge}
      />
    </NodeDetailsPanelWrapper>
  );
}
