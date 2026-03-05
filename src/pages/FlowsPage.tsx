import { DeleteWorkflowDialog } from "@/components/flows/DeleteWorkflowDialog";
import { EmptyState } from "@/components/flows/EmptyState";
import { FlowsHeader } from "@/components/flows/FlowsHeader";
import { FlowsToolbar, SortOption } from "@/components/flows/FlowsToolbar";
import { WorkflowGrid } from "@/components/flows/WorkflowGrid";
import { WorkflowCard } from "@/components/flows/workflow-card";
import { useCreateWorkflow } from "@/hooks/useCreateWorkflow";
import { useDeleteWorkflow } from "@/hooks/useDeleteWorkflow";
import { useWorkflows } from "@/hooks/useWorkflows";
import { IWorkflow } from "@/types/workflow";
import cx from "classnames";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function FlowsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
  const [workflowToDelete, setWorkflowToDelete] = useState<IWorkflow | null>(
    null,
  );

  const { workflows, isLoading, isRefetching, refetch } = useWorkflows();
  const { createWorkflow, isCreating } = useCreateWorkflow({
    onSuccess: (workflow) => {
      navigate(`/flows/${workflow.id}`);
    },
  });
  const { deleteWorkflow, isDeleting } = useDeleteWorkflow({
    onSuccess: () => {
      refetch();
      setWorkflowToDelete(null);
    },
  });

  const filteredWorkflows = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query),
    );
  }, [workflows, searchQuery]);

  const sortedWorkflows = useMemo(() => {
    return [...filteredWorkflows].sort((a, b) => {
      const dateA = sortBy === "updatedAt" ? a.updatedAt : a.createdAt;
      const dateB = sortBy === "updatedAt" ? b.updatedAt : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredWorkflows, sortBy]);

  const handleCreateClick = async () => {
    await createWorkflow();
  };

  const handleDeleteConfirm = async () => {
    if (workflowToDelete) {
      await deleteWorkflow(workflowToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className={cx("flex items-center justify-center", "h-64")}>
        <Loader2
          className={cx("w-6 h-6", "text-terracotta-500", "animate-spin")}
        />
      </div>
    );
  }

  return (
    <div className={cx("max-w-6xl mx-auto", "px-6 pt-4 pb-8", "overflow-auto")}>
      <FlowsHeader onCreateClick={handleCreateClick} isCreating={isCreating} />

      <div className={cx("flex items-center justify-center gap-3", "mb-4")}>
        <div className="w-4">
          {isRefetching && (
            <Loader2
              className={cx("w-4 h-4", "text-charcoal-500", "animate-spin")}
            />
          )}
        </div>
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
              id={workflow.id}
              name={workflow.name}
              description={workflow.description}
              updatedAt={workflow.updatedAt}
              createdBy={workflow.createdBy}
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
  );
}
