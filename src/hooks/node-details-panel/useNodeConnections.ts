import { useCallback, useMemo } from "react";
import type { Edge, Node } from "@xyflow/react";
import {
  nodeTypeStyles,
  NodeData,
} from "@/components/builder/node-details-panel/nodeTypeStyles";

interface UseNodeConnectionsProps {
  node: Node;
  nodes: Node[];
  edges: Edge[];
  onAddEdge: (
    sourceId: string,
    targetId: string,
    sourceHandle?: string,
  ) => void;
}

/**
 * Hook for managing node connections in the details panel.
 * Provides edge data, available connection options, and handlers for adding edges.
 */
export function useNodeConnections({
  node,
  nodes,
  edges,
  onAddEdge,
}: UseNodeConnectionsProps) {
  // ─────────────────────────────────────────────────────────────────────────────
  // Edge Filtering
  // ─────────────────────────────────────────────────────────────────────────────

  /** Edges pointing TO this node */
  const incomingEdges = useMemo(
    () => edges.filter((e) => e.target === node.id),
    [edges, node.id],
  );

  /** Edges pointing FROM this node */
  const outgoingEdges = useMemo(
    () => edges.filter((e) => e.source === node.id),
    [edges, node.id],
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper Functions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Gets the display name for a node.
   * Returns the node's custom label, or falls back to the node type's default label, or "Node".
   */
  const getNodeName = useCallback(
    (nodeId: string) => {
      const n = nodes.find((nd) => nd.id === nodeId);
      if (!n) return nodeId;
      const nodeData = n.data as NodeData;
      return (
        nodeData.label || (n.type && nodeTypeStyles[n.type]?.label) || "Node"
      );
    },
    [nodes],
  );

  /**
   * Gets the branch name for a condition node's outgoing edge.
   * Parses the sourceHandle (e.g., "branch-0") to find the corresponding branch name.
   * Returns null if the sourceHandle is invalid or the source node is not a condition.
   */
  const getBranchNameForNode = useCallback(
    (sourceNodeId: string, sourceHandle: string | null | undefined) => {
      if (!sourceHandle) return null;

      // Parse the branch index from the handle ID (e.g., "branch-0" -> 0)
      const match = sourceHandle.match(/^branch-(\d+)$/);
      if (!match) return null;
      const index = parseInt(match[1], 10);

      // Find the source node and verify it's a condition
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode || sourceNode.type !== "condition") return null;

      // Get the branch name at the specified index
      const sourceData = sourceNode.data as NodeData;
      if (!sourceData.branches) return null;
      return sourceData.branches[index] || null;
    },
    [nodes],
  );

  /**
   * Checks if a node has any available outgoing slots.
   * For condition nodes, checks if any branch handles are unused.
   * For other nodes, checks if there are no outgoing edges.
   */
  const hasAvailableOutgoingSlot = useCallback(
    (n: Node) => {
      const nodeOutgoingEdges = edges.filter((e) => e.source === n.id);

      if (n.type === "condition") {
        const nodeData = n.data as NodeData;
        if (!nodeData.branches) return false;
        const usedHandles = nodeOutgoingEdges.map((e) => e.sourceHandle);
        return nodeData.branches.some(
          (_, i) => !usedHandles.includes(`branch-${i}`),
        );
      }

      return nodeOutgoingEdges.length === 0;
    },
    [edges],
  );

  /**
   * Finds the first available branch handle for a condition node.
   * Returns the handle ID (e.g., "branch-0") or undefined if all branches are used.
   */
  const findAvailableBranchHandle = useCallback(
    (sourceNodeId: string): string | undefined => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode || sourceNode.type !== "condition") return undefined;

      const nodeData = sourceNode.data as NodeData;
      if (!nodeData.branches) return undefined;
      const usedHandles = edges
        .filter((e) => e.source === sourceNodeId)
        .map((e) => e.sourceHandle);

      const availableIndex = nodeData.branches.findIndex(
        (_, i) => !usedHandles.includes(`branch-${i}`),
      );

      return availableIndex >= 0 ? `branch-${availableIndex}` : undefined;
    },
    [nodes, edges],
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Available Connections
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Nodes that can be sources for incoming edges to this node.
   * Excludes: self, nodes with no available outgoing slots.
   */
  const availableSources = useMemo(() => {
    return nodes.filter((n) => {
      if (n.id === node.id) return false;
      return hasAvailableOutgoingSlot(n);
    });
  }, [nodes, node.id, hasAvailableOutgoingSlot]);

  /**
   * Nodes that can be targets for outgoing edges from this node.
   * Excludes: self, start nodes (can't have incoming edges).
   */
  const availableTargets = useMemo(() => {
    return nodes.filter((n) => {
      if (n.id === node.id) return false;
      if (n.type === "start") return false;
      return true;
    });
  }, [nodes, node.id]);

  /** Available sources formatted as dropdown options */
  const sourceOptions = useMemo(
    () => availableSources.map((n) => ({ id: n.id, label: getNodeName(n.id) })),
    [availableSources, getNodeName],
  );

  /** Available targets formatted as dropdown options */
  const targetOptions = useMemo(
    () => availableTargets.map((n) => ({ id: n.id, label: getNodeName(n.id) })),
    [availableTargets, getNodeName],
  );

  /** Whether to show the "Add incoming" link (no incoming edges + sources available) */
  const showIncomingAdd =
    incomingEdges.length === 0 && sourceOptions.length > 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // Edge Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Adds an incoming edge from a source node to this node.
   * For condition sources, automatically selects the first available branch handle.
   */
  const handleAddIncoming = useCallback(
    (sourceId: string) => {
      const sourceHandle = findAvailableBranchHandle(sourceId);
      onAddEdge(sourceId, node.id, sourceHandle);
    },
    [node.id, onAddEdge, findAvailableBranchHandle],
  );

  /**
   * Adds an outgoing edge from this node to a target node.
   * For condition nodes, the branchHandleId specifies which branch to use.
   */
  const handleAddOutgoing = useCallback(
    (targetId: string, branchHandleId?: string) => {
      onAddEdge(node.id, targetId, branchHandleId);
    },
    [node.id, onAddEdge],
  );

  return {
    // Edge data
    incomingEdges,
    outgoingEdges,

    // Helper functions
    getNodeName,
    getBranchNameForNode,

    // Available connections
    availableSources,
    availableTargets,
    sourceOptions,
    targetOptions,
    showIncomingAdd,

    // Handlers
    handleAddIncoming,
    handleAddOutgoing,
  };
}
