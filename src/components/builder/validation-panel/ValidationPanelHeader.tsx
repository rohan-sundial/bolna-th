import cx from "classnames";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ValidationPanelHeaderProps {
  isExpanded: boolean;
  hasErrors: boolean;
  errorCount: number;
  onToggle: () => void;
}

export function ValidationPanelHeader({
  isExpanded,
  hasErrors,
  errorCount,
  onToggle,
}: ValidationPanelHeaderProps) {
  const ChevronIcon = isExpanded ? ChevronDown : ChevronUp;

  return (
    <div
      className={cx(
        "flex items-center justify-between px-3 h-7",
        "border-b",
        hasErrors
          ? "bg-red-50 border-red-200/50"
          : "bg-green-50 border-green-200/50",
        "cursor-pointer select-none",
      )}
      onClick={onToggle}
    >
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center justify-center">
              <ChevronIcon
                className={cx(
                  "w-3.5 h-3.5",
                  hasErrors ? "text-red-500" : "text-green-600",
                )}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isExpanded ? "Collapse panel" : "Expand panel"}
          </TooltipContent>
        </Tooltip>
        <span
          className={cx(
            "text-xs font-medium",
            hasErrors ? "text-red-700" : "text-green-700",
          )}
        >
          Validation Errors ({errorCount})
        </span>
      </div>
    </div>
  );
}
