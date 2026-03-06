import type { Node, Edge } from "@xyflow/react";
import cx from "classnames";
import { NodeDetailsPanelSection } from "./NodeDetailsPanelSection";
import { NodeDetailsPanelNodeChip } from "./NodeDetailsPanelNodeChip";
import { NodeDetailsPanelAddLink } from "./NodeDetailsPanelAddLink";

interface NodeDetailsPanelIncomingConnectionsProps {
  incomingEdges: Edge[];
  nodes: Node[];
  sourceOptions: { id: string; label: string }[];
  showIncomingAdd: boolean;
  getBranchNameForNode: (
    sourceNodeId: string,
    sourceHandle: string | null | undefined,
  ) => string | null;
  onDeleteEdge: (edgeId: string) => void;
  onAddIncoming: (sourceId: string) => void;
}

export function NodeDetailsPanelIncomingConnections({
  incomingEdges,
  nodes,
  sourceOptions,
  showIncomingAdd,
  getBranchNameForNode,
  onDeleteEdge,
  onAddIncoming,
}: NodeDetailsPanelIncomingConnectionsProps) {
  return (
    <NodeDetailsPanelSection label="Incoming">
      <div className="flex flex-wrap gap-2 items-center">
        {incomingEdges.map((edge) => {
          const sourceBranchName = getBranchNameForNode(
            edge.source,
            edge.sourceHandle,
          );
          return (
            <div key={edge.id} className="flex items-center gap-1">
              {sourceBranchName && (
                <span
                  className={cx(
                    "text-[10px] px-1.5 py-0.5 rounded",
                    "bg-amber-100 text-amber-700 font-medium",
                  )}
                >
                  {sourceBranchName}
                </span>
              )}
              <NodeDetailsPanelNodeChip
                nodeId={edge.source}
                nodes={nodes}
                onDelete={() => onDeleteEdge(edge.id)}
              />
            </div>
          );
        })}

        {incomingEdges.length === 0 && !showIncomingAdd && (
          <span className="text-xs text-charcoal-400">None</span>
        )}

        {showIncomingAdd && (
          <NodeDetailsPanelAddLink
            onSelect={onAddIncoming}
            options={sourceOptions}
            placeholder="Add"
          />
        )}
      </div>
    </NodeDetailsPanelSection>
  );
}
