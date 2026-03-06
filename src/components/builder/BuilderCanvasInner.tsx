import { useBuilderCanvasInnerConfig } from "@/hooks/builder/canvas";
import { BuilderCanvasInnerProps } from "@/types/builderCanvasInner";
import {
  Background,
  ControlButton,
  Controls,
  MarkerType,
  ReactFlow,
  SelectionMode,
} from "@xyflow/react";
import cx from "classnames";
import { LayoutGrid } from "lucide-react";
import { DeleteNodeDialog } from "./DeleteNodeDialog";
import { InteractionModeToolbar } from "./InteractionModeToolbar";
import { NodeLibrary } from "./NodeLibrary";
import { edgeTypes } from "./edges";
import { nodeTypes } from "./nodes";

export type { BuilderCanvasInnerProps };

export function BuilderCanvasInner(props: BuilderCanvasInnerProps) {
  const {
    // Refs
    containerRef,

    // Props passthrough
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,

    // Node library drag & drop
    handleClickNodeInLibrary,
    handleDragNodeFromLibrary,
    handleDropNodeFromLibraryToCanvas,

    // Interactions
    interactionMode,
    setInteractionMode,
    onReconnect,
    isValidConnection,
    handleNodeDoubleClick,
    handleNodeClick,

    // Delete confirmation
    pendingDelete,
    onBeforeDelete,
    handleConfirmDelete,
    handleCancelDelete,

    // Auto layout
    handleAutoLayout,
  } = useBuilderCanvasInnerConfig(props);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onDragOver={handleDragNodeFromLibrary}
      onDrop={handleDropNodeFromLibraryToCanvas}
    >
      {/* React Flow */}
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

      {/* Node Library */}
      <NodeLibrary onAddNode={handleClickNodeInLibrary} />

      {/* Interaction Mode Toolbar */}
      <InteractionModeToolbar
        mode={interactionMode}
        onModeChange={setInteractionMode}
      />

      {/* Delete Confirmation Dialog */}
      {pendingDelete && (
        <DeleteNodeDialog
          open
          onOpenChange={handleCancelDelete}
          nodeCount={pendingDelete.nodes.length}
          edgeCount={pendingDelete.edges.length}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
