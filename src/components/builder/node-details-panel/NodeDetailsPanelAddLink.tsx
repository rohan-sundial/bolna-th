import cx from "classnames";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NodeDetailsPanelAddLinkProps {
  onSelect: (value: string) => void;
  options: { id: string; label: string }[];
  placeholder?: string;
}

export function NodeDetailsPanelAddLink({
  onSelect,
  options,
  placeholder = "Add",
}: NodeDetailsPanelAddLinkProps) {
  if (options.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cx(
            "inline-flex items-center gap-0.5 px-1 py-0.5 text-xs",
            "text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-300/50",
            "rounded transition-colors",
          )}
        >
          <Plus className="w-3 h-3" />
          {placeholder}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.id}
            className="text-xs cursor-pointer"
            onSelect={() => onSelect(opt.id)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
