import cx from "classnames";
import { ChevronUp, ChevronDown, Copy, Check, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JSONPreviewPanelHeaderProps {
  isExpanded: boolean;
  lineCount: number;
  copied: boolean;
  onToggle: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export function JSONPreviewPanelHeader({
  isExpanded,
  lineCount,
  copied,
  onToggle,
  onCopy,
  onDownload,
}: JSONPreviewPanelHeaderProps) {
  const ChevronIcon = isExpanded ? ChevronDown : ChevronUp;

  return (
    <div
      className={cx(
        "flex items-center justify-between px-3 h-7",
        "border-b border-cream-300/50",
        "cursor-pointer select-none",
      )}
      onClick={onToggle}
    >
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center justify-center">
              <ChevronIcon className="w-3.5 h-3.5 text-charcoal-500" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isExpanded ? "Collapse panel" : "Expand panel"}
          </TooltipContent>
        </Tooltip>
        <span className="text-xs font-medium text-charcoal-700">JSON</span>
        <span className="text-xs text-charcoal-400">({lineCount} lines)</span>
      </div>

      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
              className={cx(
                "flex items-center justify-center p-1 rounded",
                "transition-colors",
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-cream-200 text-charcoal-600 hover:bg-cream-300",
              )}
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {copied ? "Copied!" : "Copy to clipboard"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className={cx(
                "flex items-center justify-center p-1 rounded",
                "bg-cream-200 text-charcoal-600 hover:bg-cream-300",
                "transition-colors",
              )}
            >
              <Download className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Download JSON</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
