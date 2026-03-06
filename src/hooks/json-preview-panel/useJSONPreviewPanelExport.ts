import { useMemo, useState, useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import { exportWorkflow } from "@/lib/exportWorkflow";

interface UseJSONPreviewPanelExportProps {
  workflowName: string;
  workflowDescription: string;
  nodes: Node[];
  edges: Edge[];
}

/**
 * Hook for managing JSON export functionality.
 * Handles data conversion, copy to clipboard, and file download.
 */
export function useJSONPreviewPanelExport({
  workflowName,
  workflowDescription,
  nodes,
  edges,
}: UseJSONPreviewPanelExportProps) {
  const [copied, setCopied] = useState(false);

  // Convert workflow to export format
  const exportedData = useMemo(() => {
    return exportWorkflow(workflowName, workflowDescription, nodes, edges);
  }, [workflowName, workflowDescription, nodes, edges]);

  // Stringify for display
  const exportedJson = useMemo(() => {
    return JSON.stringify(exportedData, null, 2);
  }, [exportedData]);

  // Line count for display
  const lineCount = exportedJson.split("\n").length;

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [exportedJson]);

  // Download as file
  const handleDownload = useCallback(() => {
    const blob = new Blob([exportedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportedJson, workflowName]);

  return {
    exportedJson,
    lineCount,
    copied,
    handleCopy,
    handleDownload,
  };
}
