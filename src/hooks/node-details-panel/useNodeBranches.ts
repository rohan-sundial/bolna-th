import { useCallback, useMemo } from "react";
import type { Edge } from "@xyflow/react";
import type { NodeData } from "@/components/builder/node-details-panel/nodeTypeStyles";

interface UseNodeBranchesProps {
  nodeId: string;
  nodeType: string | undefined;
  data: NodeData;
  outgoingEdges: Edge[];
  availableTargetsCount: number;
  onUpdateData: (nodeId: string, data: Record<string, unknown>) => void;
}

/**
 * Hook for managing branches on condition nodes.
 * Provides computed branch state and handlers for adding/removing/editing branches.
 */
export function useNodeBranches({
  nodeId,
  nodeType,
  data,
  outgoingEdges,
  availableTargetsCount,
  onUpdateData,
}: UseNodeBranchesProps) {
  // ─────────────────────────────────────────────────────────────────────────────
  // Computed State
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Branches that don't have an outgoing edge connected yet.
   * Only relevant for condition nodes. Returns empty array for other node types.
   */
  const availableBranches = useMemo(() => {
    if (nodeType !== "condition" || !data.branches) return [];

    const usedHandles = new Set(outgoingEdges.map((e) => e.sourceHandle));

    // Map branches to objects with name and handleId, then filter out used ones
    return data.branches
      .map((name, index) => ({ name, handleId: `branch-${index}` }))
      .filter((b) => !usedHandles.has(b.handleId));
  }, [nodeType, data.branches, outgoingEdges]);

  /**
   * Whether this node can have more outgoing edges added.
   * - Condition nodes: can add if there are unused branches AND available targets
   * - Other nodes: can add if no outgoing edges yet AND available targets
   */
  const canAddOutgoing = useMemo(() => {
    if (nodeType === "condition") {
      return availableBranches.length > 0 && availableTargetsCount > 0;
    }
    return outgoingEdges.length === 0 && availableTargetsCount > 0;
  }, [nodeType, availableBranches, availableTargetsCount, outgoingEdges]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Branch Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Updates the name of a branch at the specified index.
   */
  const handleBranchChange = useCallback(
    (index: number, value: string) => {
      if (!data.branches) return;
      const branches = [...data.branches];
      branches[index] = value;
      onUpdateData(nodeId, { branches });
    },
    [nodeId, data.branches, onUpdateData],
  );

  /**
   * Adds a new branch with an auto-generated name (e.g., "Branch 3").
   */
  const handleAddBranch = useCallback(() => {
    if (!data.branches) return;
    const newBranchName = `Branch ${data.branches.length + 1}`;

    onUpdateData(nodeId, {
      branches: [...data.branches, newBranchName],
    });
  }, [nodeId, data.branches, onUpdateData]);

  /**
   * Removes a branch at the specified index.
   * Enforces minimum of 2 branches for condition nodes.
   */
  const handleRemoveBranch = useCallback(
    (index: number) => {
      if (!data.branches) return;
      const newBranches = data.branches.filter((_, i) => i !== index);

      // Condition nodes must have at least 2 branches
      if (newBranches.length >= 2) {
        onUpdateData(nodeId, { branches: newBranches });
      }
    },
    [nodeId, data.branches, onUpdateData],
  );

  return {
    // Computed state
    availableBranches,
    canAddOutgoing,

    // Handlers
    handleBranchChange,
    handleAddBranch,
    handleRemoveBranch,
  };
}
