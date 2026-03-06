import { useRef } from "react";
import type { ValidationError } from "@/lib/validation";
import { useValidationPanelResize, COLLAPSED_HEIGHT } from "./useValidationPanelResize";
import { useValidationPanelToggle } from "./useValidationPanelToggle";

interface UseValidationPanelConfigProps {
  errors: ValidationError[];
}

/**
 * Main configuration hook for ValidationPanel.
 * Composes resize and toggle functionality, provides computed state.
 */
export function useValidationPanelConfig({
  errors,
}: UseValidationPanelConfigProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize functionality
  const { height, isResizing, handleResizeStart } = useValidationPanelResize({
    containerRef,
  });

  // Toggle functionality
  const { isExpanded, toggleExpanded } = useValidationPanelToggle();

  // Computed values
  const errorCount = errors.length;
  const hasErrors = errorCount > 0;
  const panelHeight = isExpanded ? height : COLLAPSED_HEIGHT;

  return {
    // Refs
    containerRef,

    // Resize state & handlers
    height,
    isResizing,
    handleResizeStart,

    // Toggle state & handlers
    isExpanded,
    toggleExpanded,

    // Computed values
    errorCount,
    hasErrors,
    panelHeight,
  };
}
