import { useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import { useJSONPreviewPanelResize, COLLAPSED_HEIGHT } from "./useJSONPreviewPanelResize";
import { useJSONPreviewPanelToggle } from "./useJSONPreviewPanelToggle";
import { useJSONPreviewPanelExport } from "./useJSONPreviewPanelExport";

interface UseJSONPreviewPanelConfigProps {
  workflowName: string;
  workflowDescription: string;
  nodes: Node[];
  edges: Edge[];
}

/**
 * Main configuration hook for JSONPreviewPanel.
 * Composes resize, toggle, and export functionality.
 */
export function useJSONPreviewPanelConfig({
  workflowName,
  workflowDescription,
  nodes,
  edges,
}: UseJSONPreviewPanelConfigProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize functionality
  const { height, isResizing, handleResizeStart } = useJSONPreviewPanelResize({
    containerRef,
  });

  // Toggle functionality
  const { isExpanded, toggleExpanded } = useJSONPreviewPanelToggle();

  // Export functionality
  const { exportedJson, lineCount, copied, handleCopy, handleDownload } =
    useJSONPreviewPanelExport({
      workflowName,
      workflowDescription,
      nodes,
      edges,
    });

  // Computed panel height
  const panelHeight = isExpanded ? height : COLLAPSED_HEIGHT;

  return {
    // Refs
    containerRef,

    // Resize state & handlers
    isResizing,
    handleResizeStart,

    // Toggle state & handlers
    isExpanded,
    toggleExpanded,

    // Export state & handlers
    exportedJson,
    lineCount,
    copied,
    handleCopy,
    handleDownload,

    // Computed values
    panelHeight,
  };
}
