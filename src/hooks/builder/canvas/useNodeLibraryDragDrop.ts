import { NodeType } from "@/components/builder/nodes";
import { useReactFlow } from "@xyflow/react";
import { DragEvent, RefObject, useCallback } from "react";

interface UseNodeLibraryDragDropParams {
  containerRef: RefObject<HTMLDivElement>;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
}

export function useNodeLibraryDragDrop({
  containerRef,
  onAddNode,
}: UseNodeLibraryDragDropParams) {
  const { screenToFlowPosition } = useReactFlow();

  const handleDragNodeFromLibrary = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    [],
  );

  const handleDropNodeFromLibraryToCanvas = useCallback(
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

  const handleClickNodeInLibrary = useCallback(
    (type: NodeType) => {
      if (containerRef.current) {
        // Get the canvas container's bounding rect to find its visible center
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Add random offset (-20 to +20 pixels) to prevent nodes from stacking
        // exactly on top of each other when clicking multiple times
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;

        // Convert screen coordinates to flow coordinates (accounts for zoom/pan)
        const position = screenToFlowPosition({
          x: centerX + offsetX,
          y: centerY + offsetY,
        });

        onAddNode(type, position);
      } else {
        onAddNode(type);
      }
    },
    [onAddNode, screenToFlowPosition, containerRef],
  );

  return {
    handleClickNodeInLibrary,
    handleDragNodeFromLibrary,
    handleDropNodeFromLibraryToCanvas,
  };
}
