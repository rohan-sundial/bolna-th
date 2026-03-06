import { useMemo } from "react";
import { useNodeErrors } from "@/contexts/useValidation";

export function useNodeValidation(nodeId: string) {
  const errors = useNodeErrors(nodeId);

  const hasNameError = useMemo(
    () => errors.some((e) => e.field === "label"),
    [errors],
  );

  const hasPromptError = useMemo(
    () => errors.some((e) => e.field === "prompt"),
    [errors],
  );

  return {
    errors,
    hasNameError,
    hasPromptError,
  };
}
