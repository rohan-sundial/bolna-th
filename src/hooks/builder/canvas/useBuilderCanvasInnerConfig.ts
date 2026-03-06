import { BuilderCanvasInnerProps } from "@/types/builderCanvasInner";
import { useRef } from "react";
import { useCanvasAutoLayout } from "./useCanvasAutoLayout";
import { useCanvasDeleteConfirmation } from "./useCanvasDeleteConfirmation";
import { useCanvasInteractions } from "./useCanvasInteractions";
import { useCanvasViewEffects } from "./useCanvasViewEffects";
import { useNodeLibraryDragDrop } from "./useNodeLibraryDragDrop";

export function useBuilderCanvasInnerConfig({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onAddNode,
  onNodeDoubleClick,
  editingNode,
  focusNodeId,
  fitViewTrigger,
}: BuilderCanvasInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useCanvasViewEffects({
    nodes,
    focusNodeId,
    fitViewTrigger,
  });

  const {
    pendingDelete,
    onBeforeDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useCanvasDeleteConfirmation();

  const {
    handleClickNodeInLibrary,
    handleDragNodeFromLibrary,
    handleDropNodeFromLibraryToCanvas,
  } = useNodeLibraryDragDrop({
    containerRef,
    onAddNode,
  });

  const {
    interactionMode,
    setInteractionMode,
    onReconnect,
    isValidConnection,
    handleNodeDoubleClick,
    handleNodeClick,
  } = useCanvasInteractions({
    nodes,
    edges,
    setEdges,
    editingNode,
    onNodeDoubleClick,
  });

  const { handleAutoLayout } = useCanvasAutoLayout({
    nodes,
    edges,
    setNodes,
    setEdges,
  });

  return {
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
  };
}
