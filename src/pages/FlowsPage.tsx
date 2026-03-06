import { DeleteWorkflowDialog } from "@/components/flows/DeleteWorkflowDialog";
import { EmptyState } from "@/components/flows/EmptyState";
import { FlowsHeader } from "@/components/flows/FlowsHeader";
import { FlowsPageLoader } from "@/components/flows/FlowsPageLoader";
import { FlowsToolbar } from "@/components/flows/FlowsToolbar";
import { RefetchingIndicator } from "@/components/flows/RefetchingIndicator";
import { WorkflowGrid } from "@/components/flows/WorkflowGrid";
import { WorkflowCard } from "@/components/flows/workflow-card";
import { useFlowsPageConfig } from "@/hooks/useFlowsPageConfig";
import cx from "classnames";

export function FlowsPage() {
  const {
    isLoading,
    isRefetching,
    isCreating,
    isDeleting,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    workflows,
    sortedWorkflows,
    workflowToDelete,
    setWorkflowToDelete,
    handleCreateClick,
    handleDeleteConfirm,
  } = useFlowsPageConfig();

  return (
    <>
      {isLoading ? (
        <FlowsPageLoader />
      ) : (
        <div
          className={cx("max-w-6xl mx-auto", "px-6 pt-4 pb-8", "overflow-auto")}
        >
          <FlowsHeader
            onCreateClick={handleCreateClick}
            isCreating={isCreating}
          />

          <div className={cx("flex items-center justify-center gap-3", "mb-4")}>
            <RefetchingIndicator isRefetching={isRefetching} />
            <FlowsToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {sortedWorkflows.length === 0 ? (
            <EmptyState
              variant={workflows.length === 0 ? "no-workflows" : "no-results"}
            />
          ) : (
            <WorkflowGrid>
              {sortedWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  {...workflow}
                  searchQuery={searchQuery}
                  onDelete={() => setWorkflowToDelete(workflow)}
                />
              ))}
            </WorkflowGrid>
          )}

          {workflowToDelete && (
            <DeleteWorkflowDialog
              open
              onOpenChange={() => setWorkflowToDelete(null)}
              workflowName={workflowToDelete.name}
              onConfirm={handleDeleteConfirm}
              isDeleting={isDeleting}
            />
          )}
        </div>
      )}
    </>
  );
}
