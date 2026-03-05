import { useEffect, useCallback, useState } from "react";
import cx from "classnames";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { Node, Edge } from "@xyflow/react";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { NodeSidebar } from "@/components/builder/NodeSidebar";
import { ValidationPanel } from "@/components/builder/ValidationPanel";
import { JSONPreviewPanel } from "@/components/builder/JSONPreviewPanel";
import { EditDescriptionDialog } from "@/components/builder/EditDescriptionDialog";
import { DeleteWorkflowDialog } from "@/components/flows/DeleteWorkflowDialog";
import { ImportJSONDialog } from "@/components/builder/ImportJSONDialog";
import { useBuilderPageConfig, useValidation } from "@/hooks/builder";
import { useAutoLayout } from "@/hooks/builder/useAutoLayout";
import { ValidationProvider } from "@/contexts/ValidationContext";

export function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    workflow,
    isLoading,
    error,
    isUpdating,
    isDeleting,
    nodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    editingNode,
    openNodeForEditing,
    closeNodeEditor,
    updateNodeData,
    addNode,
    deleteNode,
    deleteEdge,
    addEdgeFromSidebar,
    setNodes,
    handleNameChange,
    handleDescriptionSave,
    handleDuplicate,
    handleDelete,
    descriptionDialogOpen,
    setDescriptionDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useBuilderPageConfig(id);

  const validation = useValidation(nodes, edges);
  const { getLayoutedElements } = useAutoLayout();
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [fitViewTrigger, setFitViewTrigger] = useState(0);

  // Close sidebar if editing node no longer exists (e.g., deleted via multi-select)
  useEffect(() => {
    if (editingNode && !nodes.find((n) => n.id === editingNode.id)) {
      closeNodeEditor();
    }
  }, [nodes, editingNode, closeNodeEditor]);

  // Clear focusNodeId after it's been used (one-time trigger)
  useEffect(() => {
    if (focusNodeId) {
      const timer = setTimeout(() => setFocusNodeId(null), 350);
      return () => clearTimeout(timer);
    }
  }, [focusNodeId]);

  // Handle clicking on a validation error - select node, focus, and open sidebar
  const handleValidationErrorClick = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        // Select the node
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            selected: n.id === nodeId,
          }))
        );
        // Focus on the node in the canvas
        setFocusNodeId(nodeId);
        // Open the sidebar for this node
        openNodeForEditing(node);
      }
    },
    [nodes, setNodes, openNodeForEditing]
  );

  // Handle JSON import
  const handleImport = useCallback(
    (data: {
      nodes: Node[];
      edges: Edge[];
      name: string;
      description: string;
    }) => {
      // Apply auto layout to imported nodes
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        data.nodes,
        data.edges
      );

      // Close any open sidebar
      closeNodeEditor();

      // Update workflow name and description
      handleNameChange(data.name);
      handleDescriptionSave(data.description);

      // Replace nodes and edges
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      // Trigger fitView after a short delay to let React Flow update
      setFitViewTrigger((prev) => prev + 1);
    },
    [
      getLayoutedElements,
      closeNodeEditor,
      handleNameChange,
      handleDescriptionSave,
      setNodes,
      setEdges,
    ]
  );

  if (isLoading) {
    return (
      <div className={cx("flex-1 flex items-center justify-center")}>
        <Loader2
          className={cx("w-6 h-6", "text-terracotta-500", "animate-spin")}
        />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div
        className={cx("flex-1 flex flex-col items-center justify-center gap-4")}
      >
        <p className="text-charcoal-700">Workflow not found</p>
        <button
          onClick={() => navigate("/flows")}
          className={cx("text-terracotta-600", "hover:underline")}
        >
          Back to workflows
        </button>
      </div>
    );
  }

  return (
    <ValidationProvider
      errorsByNodeId={validation.errorsByNodeId}
      onNodeErrorClick={handleValidationErrorClick}
    >
      <div className={cx("flex-1 flex flex-col", "min-h-0")}>
        <BuilderHeader
          name={workflow.name}
          onNameChange={handleNameChange}
          onDescriptionEdit={() => setDescriptionDialogOpen(true)}
          onDuplicate={handleDuplicate}
          onDelete={() => setDeleteDialogOpen(true)}
          onImportJSON={() => setImportDialogOpen(true)}
          isSaving={isUpdating}
        />

        <div className={cx("flex-1 flex flex-col", "min-h-0")}>
          {/* Canvas area - takes remaining space */}
          <div className={cx("flex-1", "min-h-0", "relative")}>
            <BuilderCanvas
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              setEdges={setEdges}
              onAddNode={addNode}
              onNodeDoubleClick={openNodeForEditing}
              editingNode={editingNode}
              focusNodeId={focusNodeId}
              fitViewTrigger={fitViewTrigger}
            />
            {editingNode && (
              <NodeSidebar
                node={editingNode}
                nodes={nodes}
                edges={edges}
                onClose={closeNodeEditor}
                onDelete={deleteNode}
                onUpdateData={updateNodeData}
                onDeleteEdge={deleteEdge}
                onAddEdge={addEdgeFromSidebar}
              />
            )}
          </div>

          {/* Validation Panel */}
          <ValidationPanel
            errors={validation.errors}
            onErrorClick={handleValidationErrorClick}
          />

          {/* JSON Panel at bottom */}
          <JSONPreviewPanel
            workflowName={workflow.name}
            workflowDescription={workflow.description}
            nodes={nodes}
            edges={edges}
          />
        </div>

        <EditDescriptionDialog
          open={descriptionDialogOpen}
          onOpenChange={setDescriptionDialogOpen}
          description={workflow.description}
          onSave={handleDescriptionSave}
        />

        <DeleteWorkflowDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          workflowName={workflow.name}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />

        <ImportJSONDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          onImport={handleImport}
        />
      </div>
    </ValidationProvider>
  );
}
