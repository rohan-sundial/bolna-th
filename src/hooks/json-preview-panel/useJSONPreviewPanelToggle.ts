import { useState, useCallback } from "react";

/**
 * Hook for managing the expanded/collapsed state of the JSON preview panel.
 */
export function useJSONPreviewPanelToggle() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return {
    isExpanded,
    toggleExpanded,
  };
}
