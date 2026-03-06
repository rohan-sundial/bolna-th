import { IWorkflow, SortOption } from "@/types/workflow";
import { useMemo, useState } from "react";

export function useWorkflowSorting(workflows: IWorkflow[]) {
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");

  const sortedWorkflows = useMemo(() => {
    return [...workflows].sort((a, b) => {
      const dateA = sortBy === "updatedAt" ? a.updatedAt : a.createdAt;
      const dateB = sortBy === "updatedAt" ? b.updatedAt : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [workflows, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedWorkflows,
  };
}
