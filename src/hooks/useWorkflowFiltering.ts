import { IWorkflow } from "@/types/workflow";
import { useMemo, useState } from "react";

export function useWorkflowFiltering(workflows: IWorkflow[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkflows = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query),
    );
  }, [workflows, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredWorkflows,
  };
}
