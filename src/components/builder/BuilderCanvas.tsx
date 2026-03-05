import { DragEvent, useCallback, useState, MouseEvent, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  reconnectEdge,
  SelectionMode,
  OnBeforeDelete,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import cx from "classnames";
import { LayoutGrid, Hand, MousePointer2 } from "lucide-react";
import { nodeTypes, NodeType } from "./nodes";
import { edgeTypes } from "./edges";
import { NodeLibrary } from "./NodeLibrary";
import { DeleteNodeDialog } from "./DeleteNodeDialog";
import { useAutoLayout } from "@/hooks/builder/useAutoLayout";

interface BuilderCanvasInnerProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
  onNodeDoubleClick: (node: Node) => void;
  editingNode: Node | null;
  focusNodeId: string | null;
  fitViewTrigger: number;
}

function BuilderCanvasInner({
  nodes,
  edges,
  setNodes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setEdges,
  onAddNode,
  onNodeDoubleClick,
  editingNode,
  focusNodeId,
  fitViewTrigger,
}: BuilderCanvasInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const { getLayoutedElements } = useAutoLayout();
  const [interactionMode, setInteractionMode] = useState<"pan" | "select">(
    "pan",
  );

  // Focus on node when focusNodeId changes (from validation panel click)
  useEffect(() => {
    if (focusNodeId) {
      const node = nodes.find((n) => n.id === focusNodeId);
      if (node) {
        fitView({
          nodes: [node],
          duration: 300,
          padding: 0.5,
          maxZoom: 1.5,
        });
      }
    }
  }, [focusNodeId, nodes, fitView]);

  // Fit view when fitViewTrigger changes (e.g., after JSON import)
  useEffect(() => {
    if (fitViewTrigger > 0) {
      setTimeout(() => {
        fitView({ duration: 300, padding: 0.2 });
      }, 50);
    }
  }, [fitViewTrigger, fitView]);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    nodes: Node[];
    edges: Edge[];
  } | null>(null);
  const deleteResolverRef = useRef<((value: boolean) => void) | null>(null);

  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Fit view after a short delay to allow React to update
    setTimeout(() => {
      fitView({ padding: 0.3, duration: 300, maxZoom: 1 });
    }, 50);
  }, [nodes, edges, getLayoutedElements, setNodes, setEdges, fitView]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const type = e.dataTransfer.getData("application/reactflow") as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      onAddNode(type, position);
    },
    [screenToFlowPosition, onAddNode],
  );

  const handleAddNodeClick = useCallback(
    (type: NodeType) => {
      // Calculate center of viewport
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Add small random offset to avoid perfect stacking
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;

        const position = screenToFlowPosition({
          x: centerX + offsetX,
          y: centerY + offsetY,
        });

        onAddNode(type, position);
      } else {
        onAddNode(type);
      }
    },
    [onAddNode, screenToFlowPosition],
  );

  // Handle delete confirmation for keyboard delete
  const onBeforeDelete: OnBeforeDelete = useCallback(
    ({ nodes: nodesToDelete, edges: edgesToDelete }) => {
      // If nothing to delete, allow (shouldn't happen but safe guard)
      if (nodesToDelete.length === 0 && edgesToDelete.length === 0) {
        return Promise.resolve(true);
      }

      return new Promise<boolean>((resolve) => {
        setPendingDelete({ nodes: nodesToDelete, edges: edgesToDelete });
        deleteResolverRef.current = resolve;
        setDeleteDialogOpen(true);
      });
    },
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteResolverRef.current) {
      deleteResolverRef.current(true);
      deleteResolverRef.current = null;
    }
    setDeleteDialogOpen(false);
    setPendingDelete(null);
  }, []);

  const handleCancelDelete = useCallback((open: boolean) => {
    if (!open && deleteResolverRef.current) {
      deleteResolverRef.current(false);
      deleteResolverRef.current = null;
    }
    setDeleteDialogOpen(open);
    if (!open) {
      setPendingDelete(null);
    }
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((edges) => reconnectEdge(oldEdge, newConnection, edges));
    },
    [setEdges],
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // No self-connections
      if (connection.source === connection.target) {
        return false;
      }

      // Start node cannot be a target
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (targetNode?.type === "start") {
        return false;
      }

      // Check if there's already an edge from this sourceHandle
      const existingEdge = edges.find(
        (e) =>
          e.source === connection.source &&
          e.sourceHandle === connection.sourceHandle,
      );
      if (existingEdge) {
        return false;
      }

      return true;
    },
    [nodes, edges],
  );

  const handleNodeDoubleClick = useCallback(
    (_event: MouseEvent, node: Node) => {
      onNodeDoubleClick(node);
    },
    [onNodeDoubleClick],
  );

  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: Node) => {
      // If sidebar is open, switch to clicked node
      if (editingNode) {
        onNodeDoubleClick(node);
      }
    },
    [editingNode, onNodeDoubleClick],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeClick={handleNodeClick}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "labeled",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#9a8478",
          },
          style: { stroke: "#9a8478", strokeWidth: 1.5 },
        }}
        deleteKeyCode={["Backspace", "Delete"]}
        onBeforeDelete={onBeforeDelete}
        connectionRadius={40}
        fitView
        fitViewOptions={{ padding: 0.5, maxZoom: 1 }}
        maxZoom={1.2}
        proOptions={{ hideAttribution: true }}
        panOnDrag={interactionMode === "pan"}
        selectionOnDrag={interactionMode === "select"}
        selectionMode={SelectionMode.Partial}
      >
        <Background color="#d4c4b5" gap={16} />
        <Controls>
          <ControlButton onClick={handleAutoLayout} title="Auto Layout">
            <LayoutGrid className={cx("w-4 h-4")} />
          </ControlButton>
        </Controls>
      </ReactFlow>
      <NodeLibrary onAddNode={handleAddNodeClick} />

      {/* Interaction Mode Toolbar */}
      <div
        className={cx(
          "absolute bottom-4 left-1/2 -translate-x-1/2",
          "flex items-center gap-1 p-1.5",
          "bg-cream-200/95 backdrop-blur-sm rounded-full",
          "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.15)]",
          "border border-cream-300/50",
        )}
      >
        <button
          onClick={() => setInteractionMode("pan")}
          className={cx(
            "p-2 rounded-full transition-colors",
            interactionMode === "pan"
              ? "bg-terracotta-500 text-white"
              : "text-charcoal-500 hover:bg-cream-300 hover:text-charcoal-700",
          )}
          title="Pan mode (drag to move canvas)"
        >
          <Hand className="w-4 h-4" />
        </button>
        <button
          onClick={() => setInteractionMode("select")}
          className={cx(
            "p-2 rounded-full transition-colors",
            interactionMode === "select"
              ? "bg-terracotta-500 text-white"
              : "text-charcoal-500 hover:bg-cream-300 hover:text-charcoal-700",
          )}
          title="Select mode (drag to select multiple)"
        >
          <MousePointer2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteNodeDialog
        open={deleteDialogOpen}
        onOpenChange={handleCancelDelete}
        nodeCount={pendingDelete?.nodes.length || 0}
        edgeCount={pendingDelete?.edges.length || 0}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

interface BuilderCanvasProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
  onNodeDoubleClick: (node: Node) => void;
  editingNode?: Node | null;
  focusNodeId?: string | null;
  fitViewTrigger?: number;
}

export function BuilderCanvas({ editingNode = null, focusNodeId = null, fitViewTrigger = 0, ...props }: BuilderCanvasProps) {
  return (
    <ReactFlowProvider>
      <BuilderCanvasInner {...props} editingNode={editingNode} focusNodeId={focusNodeId} fitViewTrigger={fitViewTrigger} />
    </ReactFlowProvider>
  );
}
