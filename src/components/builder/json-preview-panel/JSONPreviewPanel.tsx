import type { Node, Edge } from "@xyflow/react";
import { useJSONPreviewPanelConfig } from "@/hooks/json-preview-panel";
import { JSONPreviewPanelWrapper } from "./JSONPreviewPanelWrapper";
import { JSONPreviewPanelResizeHandle } from "./JSONPreviewPanelResizeHandle";
import { JSONPreviewPanelHeader } from "./JSONPreviewPanelHeader";
import { JSONPreviewPanelContent } from "./JSONPreviewPanelContent";

interface JSONPreviewPanelProps {
  workflowName: string;
  workflowDescription: string;
  nodes: Node[];
  edges: Edge[];
}

export function JSONPreviewPanel({
  workflowName,
  workflowDescription,
  nodes,
  edges,
}: JSONPreviewPanelProps) {
  const {
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
  } = useJSONPreviewPanelConfig({
    workflowName,
    workflowDescription,
    nodes,
    edges,
  });

  return (
    <JSONPreviewPanelWrapper
      ref={containerRef}
      height={panelHeight}
      isResizing={isResizing}
    >
      {isExpanded && (
        <JSONPreviewPanelResizeHandle onResizeStart={handleResizeStart} />
      )}

      <JSONPreviewPanelHeader
        isExpanded={isExpanded}
        lineCount={lineCount}
        copied={copied}
        onToggle={toggleExpanded}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {isExpanded && <JSONPreviewPanelContent json={exportedJson} />}
    </JSONPreviewPanelWrapper>
  );
}
