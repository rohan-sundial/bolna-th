import type { Node, Edge } from "@xyflow/react";
import cx from "classnames";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NodeDetailsPanelSection } from "./NodeDetailsPanelSection";
import { NodeDetailsPanelNodeChip } from "./NodeDetailsPanelNodeChip";
import { NodeDetailsPanelAddLink } from "./NodeDetailsPanelAddLink";

interface NodeDetailsPanelConditionOutgoingProps {
  branches: string[];
  outgoingEdges: Edge[];
  nodes: Node[];
  targetOptions: { id: string; label: string }[];
  availableTargets: Node[];
  availableBranches: { name: string; handleId: string }[];
  onDeleteEdge: (edgeId: string) => void;
  onAddOutgoing: (targetId: string, branchHandleId?: string) => void;
  onBranchChange: (index: number, value: string) => void;
  onAddBranch: () => void;
  onRemoveBranch: (index: number) => void;
}

export function NodeDetailsPanelConditionOutgoing({
  branches,
  outgoingEdges,
  nodes,
  targetOptions,
  availableTargets,
  availableBranches,
  onDeleteEdge,
  onAddOutgoing,
  onBranchChange,
  onAddBranch,
  onRemoveBranch,
}: NodeDetailsPanelConditionOutgoingProps) {
  return (
    <NodeDetailsPanelSection label="Outgoing">
      <div className="space-y-2">
        {branches.map((branchName, index) => {
          const handleId = `branch-${index}`;
          const edge = outgoingEdges.find((e) => e.sourceHandle === handleId);
          const isAvailable = availableBranches.some(
            (b) => b.handleId === handleId,
          );
          const canDelete = branches.length > 2;

          return (
            <div key={handleId} className="flex items-center gap-2">
              <Input
                value={branchName}
                onChange={(e) => onBranchChange(index, e.target.value)}
                className={cx(
                  "h-6 text-[11px] w-24 shrink-0",
                  "bg-amber-50 border-amber-200",
                )}
              />
              <span className="text-charcoal-400 text-xs">→</span>

              {edge ? (
                <NodeDetailsPanelNodeChip
                  nodeId={edge.target}
                  nodes={nodes}
                  onDelete={() => onDeleteEdge(edge.id)}
                />
              ) : isAvailable && availableTargets.length > 0 ? (
                <NodeDetailsPanelAddLink
                  onSelect={(targetId) => onAddOutgoing(targetId, handleId)}
                  options={targetOptions}
                  placeholder="Add"
                />
              ) : (
                <span className="text-xs text-charcoal-400">—</span>
              )}

              {canDelete && (
                <button
                  onClick={() => onRemoveBranch(index)}
                  className={cx(
                    "p-0.5 rounded ml-auto",
                    "text-charcoal-300 hover:text-red-500",
                    "transition-colors",
                  )}
                  title="Remove branch"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onAddBranch}
          className={cx(
            "inline-flex items-center gap-0.5",
            "text-xs text-charcoal-400 hover:text-charcoal-600",
            "transition-colors",
          )}
        >
          <Plus className="w-3 h-3" />
          Add Branch
        </button>
      </div>
    </NodeDetailsPanelSection>
  );
}
