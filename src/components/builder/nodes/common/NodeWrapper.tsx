import { ReactNode } from "react";
import cx from "classnames";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type NodeColorScheme = "green" | "clay" | "amber";

const colorSchemes: Record<
  NodeColorScheme,
  { bg: string; borderDefault: string; borderSelected: string }
> = {
  green: {
    bg: "bg-green-50",
    borderDefault: "border-charcoal-300",
    borderSelected: "border-purple-500",
  },
  clay: {
    bg: "bg-cream-100",
    borderDefault: "border-charcoal-300",
    borderSelected: "border-purple-500",
  },
  amber: {
    bg: "bg-amber-50",
    borderDefault: "border-charcoal-300",
    borderSelected: "border-purple-500",
  },
};

interface NodeWrapperProps {
  children: ReactNode;
  colorScheme: NodeColorScheme;
  selected?: boolean;
  minWidth?: string;
  errors?: string[];
  onErrorClick?: () => void;
}

export function NodeWrapper({
  children,
  colorScheme,
  selected,
  minWidth = "min-w-[120px]",
  errors = [],
  onErrorClick,
}: NodeWrapperProps) {
  const colors = colorSchemes[colorScheme];
  const hasErrors = errors.length > 0;

  return (
    <div
      className={cx(
        "px-4 py-3",
        colors.bg,
        "border-2 rounded-lg",
        minWidth,
        "shadow-sm",
        "relative",
        selected ? colors.borderSelected : colors.borderDefault
      )}
    >
      {hasErrors && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onErrorClick?.();
              }}
              className={cx(
                "absolute -top-1.5 -right-1.5",
                "w-4 h-4",
                "cursor-pointer",
                "flex items-center justify-center"
              )}
            >
              {/* Pulsing rings */}
              <span className="absolute w-full h-full rounded-full bg-red-400 animate-ping opacity-75" />
              <span className="absolute w-full h-full rounded-full bg-red-400 animate-ping opacity-50 animation-delay-300" />
              {/* Center dot */}
              <span className="relative w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <ul className="text-xs space-y-1">
              {errors.map((error, i) => {
                // Strip [Type][Name]: prefix for cleaner tooltip
                const cleanMessage = error.replace(/^\[.*?\]\[.*?\]:\s*/, '');
                return (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-red-400">•</span>
                    <span>{cleanMessage}</span>
                  </li>
                );
              })}
            </ul>
          </TooltipContent>
        </Tooltip>
      )}
      {children}
    </div>
  );
}
