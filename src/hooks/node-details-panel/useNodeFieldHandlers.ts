import { useCallback } from "react";

interface UseNodeFieldHandlersProps {
  nodeId: string;
  onUpdateData: (nodeId: string, data: Record<string, unknown>) => void;
}

export function useNodeFieldHandlers({
  nodeId,
  onUpdateData,
}: UseNodeFieldHandlersProps) {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateData(nodeId, { label: e.target.value });
    },
    [nodeId, onUpdateData],
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateData(nodeId, { description: e.target.value });
    },
    [nodeId, onUpdateData],
  );

  const handlePromptChange = useCallback(
    (content: string) => {
      onUpdateData(nodeId, { prompt: content });
    },
    [nodeId, onUpdateData],
  );

  return {
    handleNameChange,
    handleDescriptionChange,
    handlePromptChange,
  };
}
