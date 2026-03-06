import cx from "classnames";
import type { ValidationError } from "@/lib/validation";

interface ValidationPanelContentProps {
  errors: ValidationError[];
  hasErrors: boolean;
  onErrorClick: (nodeId: string) => void;
}

export function ValidationPanelContent({
  errors,
  hasErrors,
  onErrorClick,
}: ValidationPanelContentProps) {
  if (!hasErrors) {
    return (
      <div className="h-[calc(100%-1.75rem)] overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-green-600">All validations passed!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-1.75rem)] overflow-y-auto">
      <div className="py-1">
        {errors.map((error, index) => (
          <div
            key={error.id}
            className={cx(
              "px-3 py-0.5",
              "hover:bg-cream-200/50",
              error.nodeId && "cursor-pointer",
            )}
            onClick={() => error.nodeId && onErrorClick(error.nodeId)}
          >
            <span className="text-xs text-charcoal-600 font-mono">
              <span className="text-charcoal-400 mr-2">{index + 1}.</span>
              {error.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
