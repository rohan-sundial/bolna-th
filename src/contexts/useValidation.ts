import type { ValidationError } from "@/lib/validation";
import { useContext } from "react";
import { ValidationContext } from "./validationContextDef";

export function useValidationContext() {
  return useContext(ValidationContext);
}

export function useNodeErrors(nodeId: string): ValidationError[] {
  const { errorsByNodeId } = useValidationContext();
  return errorsByNodeId.get(nodeId) || [];
}
