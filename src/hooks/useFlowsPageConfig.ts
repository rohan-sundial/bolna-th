import { useCreateWorkflow } from "@/hooks/useCreateWorkflow";
import { useDeleteWorkflow } from "@/hooks/useDeleteWorkflow";
import { useWorkflowFiltering } from "@/hooks/useWorkflowFiltering";
import { useWorkflowSorting } from "@/hooks/useWorkflowSorting";
import { useWorkflows } from "@/hooks/useWorkflows";
import { IWorkflow } from "@/types/workflow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useFlowsPageConfig() {
  const navigate = useNavigate();

  const [workflowToDelete, setWorkflowToDelete] = useState<IWorkflow | null>(
    null,
  );

  const { workflows, isLoading, isRefetching, refetch } = useWorkflows();

  const { searchQuery, setSearchQuery, filteredWorkflows } =
    useWorkflowFiltering(workflows);

  const { sortBy, setSortBy, sortedWorkflows } =
    useWorkflowSorting(filteredWorkflows);

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

  const handleCreateClick = async () => {
    await createWorkflow();
  };

  const handleDeleteConfirm = async () => {
    if (workflowToDelete) {
      await deleteWorkflow(workflowToDelete.id);
    }
  };

  return {
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
  };
}
