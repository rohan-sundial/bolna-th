import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { validateWorkflow, ValidationResult } from '@/lib/validation';

export function useValidation(nodes: Node[], edges: Edge[]): ValidationResult {
  return useMemo(() => {
    return validateWorkflow(nodes, edges);
  }, [nodes, edges]);
}
