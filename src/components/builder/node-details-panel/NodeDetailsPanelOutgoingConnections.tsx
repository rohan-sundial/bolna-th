import type { Node, Edge } from "@xyflow/react";
import type { NodeData } from "./nodeTypeStyles";
import { NodeDetailsPanelConditionOutgoing } from "./NodeDetailsPanelConditionOutgoing";
import { NodeDetailsPanelSimpleOutgoing } from "./NodeDetailsPanelSimpleOutgoing";

interface NodeDetailsPanelOutgoingConnectionsProps {
  nodeType: string | undefined;
  data: NodeData;
  outgoingEdges: Edge[];
  nodes: Node[];
  targetOptions: { id: string; label: string }[];
  availableTargets: Node[];
  availableBranches: { name: string; handleId: string }[];
  canAddOutgoing: boolean;
  onDeleteEdge: (edgeId: string) => void;
  onAddOutgoing: (targetId: string, branchHandleId?: string) => void;
  onBranchChange: (index: number, value: string) => void;
  onAddBranch: () => void;
  onRemoveBranch: (index: number) => void;
}

export function NodeDetailsPanelOutgoingConnections({
  nodeType,
  data,
  outgoingEdges,
  nodes,
  targetOptions,
  availableTargets,
  availableBranches,
  canAddOutgoing,
  onDeleteEdge,
  onAddOutgoing,
  onBranchChange,
  onAddBranch,
  onRemoveBranch,
}: NodeDetailsPanelOutgoingConnectionsProps) {
  if (nodeType === "condition" && data.branches) {
    return (
      <NodeDetailsPanelConditionOutgoing
        branches={data.branches}
        outgoingEdges={outgoingEdges}
        nodes={nodes}
        targetOptions={targetOptions}
        availableTargets={availableTargets}
        availableBranches={availableBranches}
        onDeleteEdge={onDeleteEdge}
        onAddOutgoing={onAddOutgoing}
        onBranchChange={onBranchChange}
        onAddBranch={onAddBranch}
        onRemoveBranch={onRemoveBranch}
      />
    );
  }

  return (
    <NodeDetailsPanelSimpleOutgoing
      outgoingEdges={outgoingEdges}
      nodes={nodes}
      targetOptions={targetOptions}
      canAddOutgoing={canAddOutgoing}
      onDeleteEdge={onDeleteEdge}
      onAddOutgoing={onAddOutgoing}
    />
  );
}
