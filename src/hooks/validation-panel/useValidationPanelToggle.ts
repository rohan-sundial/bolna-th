import { useState, useCallback } from "react";

/**
 * Hook for managing the expanded/collapsed state of the validation panel.
 */
export function useValidationPanelToggle() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return {
    isExpanded,
    toggleExpanded,
  };
}
