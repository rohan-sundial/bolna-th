import cx from "classnames";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { BuilderPageLoader } from "@/components/builder/BuilderPageLoader";
import { BuilderPageError } from "@/components/builder/BuilderPageError";
import { NodeDetailsPanel } from "@/components/builder/node-details-panel";
import { ValidationPanel } from "@/components/builder/validation-panel";
import { JSONPreviewPanel } from "@/components/builder/json-preview-panel";
import { useBuilderPageConfig } from "@/hooks/builder";
import { ValidationProvider } from "@/contexts/ValidationContext";

export function BuilderPage() {
  const {
    // Loading & error state
    isLoading,
    error,
    workflow,

    // Saving & deleting state
    isUpdating,
    isDeleting,

    // Canvas state
    nodes,
    edges,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setEdges,
    focusNodeId,
    fitViewTrigger,

    // Node editing
    editingNode,
    openNodeForEditing,
    closeNodeEditor,
    updateNodeData,
    addNode,
    deleteNode,
    deleteEdge,
    addEdgeFromSidebar,

    // Validation
    validationErrors,
    errorsByNodeId,
    handleValidationErrorClick,

    // Workflow actions
    handleNameChange,
    handleDescriptionSave,
    handleDuplicate,
    handleDelete,
    handleImport,
  } = useBuilderPageConfig();

  return (
    <>
      {isLoading ? (
        <BuilderPageLoader />
      ) : error || !workflow ? (
        <BuilderPageError />
      ) : (
        <ValidationProvider
          errorsByNodeId={errorsByNodeId}
          onNodeErrorClick={handleValidationErrorClick}
        >
          <div className={cx("flex-1 flex flex-col", "min-h-0")}>
            <BuilderHeader
              name={workflow.name}
              description={workflow.description}
              onNameChange={handleNameChange}
              onDescriptionSave={handleDescriptionSave}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onImport={handleImport}
              isSaving={isUpdating}
              isDeleting={isDeleting}
            />

            <div className={cx("flex-1 flex flex-col", "min-h-0")}>
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
                  <NodeDetailsPanel
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

              <ValidationPanel
                errors={validationErrors}
                onErrorClick={handleValidationErrorClick}
              />

              <JSONPreviewPanel
                workflowName={workflow.name}
                workflowDescription={workflow.description}
                nodes={nodes}
                edges={edges}
              />
            </div>
          </div>
        </ValidationProvider>
      )}
    </>
  );
}
