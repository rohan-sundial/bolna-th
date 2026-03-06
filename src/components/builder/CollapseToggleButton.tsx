import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface CollapseToggleButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function CollapseToggleButton({
  isCollapsed,
  onToggle,
}: CollapseToggleButtonProps) {
  const Icon = isCollapsed ? ChevronsRight : ChevronsLeft;

  return (
    <button
      onClick={onToggle}
      className={cn(
        "self-start p-1.5 mb-1 rounded-lg",
        "text-charcoal-400 hover:text-charcoal-600",
        "hover:bg-cream-300/70",
        "opacity-0 group-hover:opacity-100",
        "transition-all duration-150",
      )}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}
