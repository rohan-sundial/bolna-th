import type { Node, Edge } from "@xyflow/react";
import cx from "classnames";
import { useNodeDetailsPanelContentConfig } from "@/hooks/node-details-panel";
import { NodeDetailsPanelIdAndName } from "./NodeDetailsPanelIdAndName";
import { NodeDetailsPanelDescription } from "./NodeDetailsPanelDescription";
import { NodeDetailsPanelPrompt } from "./NodeDetailsPanelPrompt";
import { NodeDetailsPanelIncomingConnections } from "./NodeDetailsPanelIncomingConnections";
import { NodeDetailsPanelOutgoingConnections } from "./NodeDetailsPanelOutgoingConnections";

interface NodeDetailsPanelContentProps {
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

export function NodeDetailsPanelContent(props: NodeDetailsPanelContentProps) {
  const { node } = props;

  const {
    // Node info
    nodeType,
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

    // Pass through
    onDeleteEdge,
    nodes,
  } = useNodeDetailsPanelContentConfig(props);

  return (
    <div className={cx("flex-1 overflow-y-auto", "p-3 space-y-3")}>
      <NodeDetailsPanelIdAndName
        nodeId={node.id}
        nodeType={nodeType}
        data={data}
        copied={copied}
        hasNameError={hasNameError}
        onCopyId={handleCopyId}
        onNameChange={handleNameChange}
      />

      {nodeType !== "start" && (
        <>
          <NodeDetailsPanelDescription
            description={data.description || ""}
            onChange={handleDescriptionChange}
          />

          <NodeDetailsPanelPrompt
            prompt={data.prompt || ""}
            hasError={hasPromptError}
            onChange={handlePromptChange}
          />

          <div className="border-t border-cream-300/50" />

          <NodeDetailsPanelIncomingConnections
            incomingEdges={incomingEdges}
            nodes={nodes}
            sourceOptions={sourceOptions}
            showIncomingAdd={showIncomingAdd}
            getBranchNameForNode={getBranchNameForNode}
            onDeleteEdge={onDeleteEdge}
            onAddIncoming={handleAddIncoming}
          />
        </>
      )}

      <NodeDetailsPanelOutgoingConnections
        nodeType={nodeType}
        data={data}
        outgoingEdges={outgoingEdges}
        nodes={nodes}
        targetOptions={targetOptions}
        availableTargets={availableTargets}
        availableBranches={availableBranches}
        canAddOutgoing={canAddOutgoing}
        onDeleteEdge={onDeleteEdge}
        onAddOutgoing={handleAddOutgoing}
        onBranchChange={handleBranchChange}
        onAddBranch={handleAddBranch}
        onRemoveBranch={handleRemoveBranch}
      />
    </div>
  );
}
