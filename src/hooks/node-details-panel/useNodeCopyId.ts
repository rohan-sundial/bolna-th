import { useCallback, useState } from "react";

export function useNodeCopyId(nodeId: string) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = useCallback(async () => {
    await navigator.clipboard.writeText(nodeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [nodeId]);

  return {
    copied,
    handleCopyId,
  };
}
