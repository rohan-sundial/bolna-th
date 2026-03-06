import type { Node, Edge } from "@xyflow/react";
import {
  nodeTypeStyles,
  NodeData,
} from "@/components/builder/node-details-panel/nodeTypeStyles";
import { useNodeValidation } from "./useNodeValidation";
import { useNodeCopyId } from "./useNodeCopyId";
import { useNodeFieldHandlers } from "./useNodeFieldHandlers";
import { useNodeConnections } from "./useNodeConnections";
import { useNodeBranches } from "./useNodeBranches";

export interface NodeDetailsPanelContentConfigProps {
  node: Node;
  nodes: Node[];
  edges: Edge[];
  onUpdateData: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddEdge: (
    sourceId: string,
    targetId: string,
    sourceHandle?: string,
  ) => void;
}

export function useNodeDetailsPanelContentConfig({
  node,
  nodes,
  edges,
  onUpdateData,
  onDeleteEdge,
  onAddEdge,
}: NodeDetailsPanelContentConfigProps) {
  // Node data
  const nodeType = node.type;
  const style = nodeType ? nodeTypeStyles[nodeType] : undefined;
  const data = node.data as NodeData;

  // Validation
  const { hasNameError, hasPromptError } = useNodeValidation(node.id);

  // Copy ID functionality
  const { copied, handleCopyId } = useNodeCopyId(node.id);

  // Field change handlers
  const { handleNameChange, handleDescriptionChange, handlePromptChange } =
    useNodeFieldHandlers({
      nodeId: node.id,
      onUpdateData,
    });

  // Edge connections
  const {
    incomingEdges,
    outgoingEdges,
    getBranchNameForNode,
    sourceOptions,
    targetOptions,
    showIncomingAdd,
    availableTargets,
    handleAddIncoming,
    handleAddOutgoing,
  } = useNodeConnections({
    node,
    nodes,
    edges,
    onAddEdge,
  });

  // Branch management (for condition nodes)
  const {
    availableBranches,
    canAddOutgoing,
    handleBranchChange,
    handleAddBranch,
    handleRemoveBranch,
  } = useNodeBranches({
    nodeId: node.id,
    nodeType,
    data,
    outgoingEdges,
    availableTargetsCount: availableTargets.length,
    onUpdateData,
  });

  return {
    // Node info
    nodeType,
    style,
    data,

    // Validation
    hasNameError,
    hasPromptError,

    // Copy ID
    copied,
    handleCopyId,

    // Field handlers
    handleNameChange,
    handleDescriptionChange,
    handlePromptChange,

    // Connections
    incomingEdges,
    outgoingEdges,
    getBranchNameForNode,
    sourceOptions,
    targetOptions,
    showIncomingAdd,
    availableTargets,
    handleAddIncoming,
    handleAddOutgoing,

    // Branches
    availableBranches,
    canAddOutgoing,
    handleBranchChange,
    handleAddBranch,
    handleRemoveBranch,

    // Pass through for JSX usage
    onDeleteEdge,
    nodes,
  };
}
