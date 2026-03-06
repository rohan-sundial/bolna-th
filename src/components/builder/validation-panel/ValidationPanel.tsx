import type { ValidationError } from "@/lib/validation";
import { useValidationPanelConfig } from "@/hooks/validation-panel";
import { ValidationPanelWrapper } from "./ValidationPanelWrapper";
import { ValidationPanelResizeHandle } from "./ValidationPanelResizeHandle";
import { ValidationPanelHeader } from "./ValidationPanelHeader";
import { ValidationPanelContent } from "./ValidationPanelContent";

interface ValidationPanelProps {
  errors: ValidationError[];
  onErrorClick: (nodeId: string) => void;
}

export function ValidationPanel({ errors, onErrorClick }: ValidationPanelProps) {
  const {
    // Refs
    containerRef,

    // Resize state & handlers
    isResizing,
    handleResizeStart,

    // Toggle state & handlers
    isExpanded,
    toggleExpanded,

    // Computed values
    errorCount,
    hasErrors,
    panelHeight,
  } = useValidationPanelConfig({ errors });

  return (
    <ValidationPanelWrapper
      ref={containerRef}
      height={panelHeight}
      isResizing={isResizing}
    >
      {isExpanded && (
        <ValidationPanelResizeHandle onResizeStart={handleResizeStart} />
      )}

      <ValidationPanelHeader
        isExpanded={isExpanded}
        hasErrors={hasErrors}
        errorCount={errorCount}
        onToggle={toggleExpanded}
      />

      {isExpanded && (
        <ValidationPanelContent
          errors={errors}
          hasErrors={hasErrors}
          onErrorClick={onErrorClick}
        />
      )}
    </ValidationPanelWrapper>
  );
}
