import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { UpdateWorkflowInput } from '@/types/workflow';

const AUTO_SAVE_DELAY_MS = 1500;

interface UseCanvasAutoSaveOptions {
  workflowId: string | undefined;
  nodes: Node[];
  edges: Edge[];
  isInitialized: boolean;
  onSave: (id: string, input: UpdateWorkflowInput) => void;
}

export function useCanvasAutoSave({
  workflowId,
  nodes,
  edges,
  isInitialized,
  onSave,
}: UseCanvasAutoSaveOptions) {
  const lastSavedRef = useRef<{ nodes: Node[]; edges: Edge[] } | null>(null);

  const debouncedSave = useRef(
    debounce((id: string, nodesToSave: Node[], edgesToSave: Edge[], save: typeof onSave) => {
      const currentState = { nodes: nodesToSave, edges: edgesToSave };
      if (!isEqual(currentState, lastSavedRef.current)) {
        save(id, currentState);
        lastSavedRef.current = currentState;
      }
    }, AUTO_SAVE_DELAY_MS)
  ).current;

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  // Reset when workflow changes
  useEffect(() => {
    lastSavedRef.current = null;
  }, [workflowId]);

  // Auto-save on changes (only after initialization)
  useEffect(() => {
    if (!workflowId || !isInitialized) return;

    // First run after init: set baseline and skip save
    if (lastSavedRef.current === null) {
      lastSavedRef.current = { nodes, edges };
      return;
    }

    debouncedSave(workflowId, nodes, edges, onSave);
  }, [nodes, edges, workflowId, isInitialized, debouncedSave, onSave]);
}
