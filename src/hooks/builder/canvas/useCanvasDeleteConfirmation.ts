import { Edge, Node, OnBeforeDelete } from "@xyflow/react";
import { useCallback, useRef, useState } from "react";

export function useCanvasDeleteConfirmation() {
  const [pendingDelete, setPendingDelete] = useState<{
    nodes: Node[];
    edges: Edge[];
  } | null>(null);
  const deleteResolverRef = useRef<((value: boolean) => void) | null>(null);

  const onBeforeDelete: OnBeforeDelete = useCallback(
    ({ nodes: nodesToDelete, edges: edgesToDelete }) => {
      if (nodesToDelete.length === 0 && edgesToDelete.length === 0) {
        return Promise.resolve(true);
      }

      return new Promise<boolean>((resolve) => {
        setPendingDelete({ nodes: nodesToDelete, edges: edgesToDelete });
        deleteResolverRef.current = resolve;
      });
    },
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteResolverRef.current) {
      deleteResolverRef.current(true);
      deleteResolverRef.current = null;
    }
    setPendingDelete(null);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deleteResolverRef.current) {
      deleteResolverRef.current(false);
      deleteResolverRef.current = null;
    }
    setPendingDelete(null);
  }, []);

  return {
    pendingDelete,
    onBeforeDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
