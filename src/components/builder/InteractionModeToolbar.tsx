import { Hand, LucideIcon, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

type InteractionMode = "pan" | "select";

interface ModeOption {
  mode: InteractionMode;
  icon: LucideIcon;
  title: string;
}

const modeOptions: ModeOption[] = [
  { mode: "pan", icon: Hand, title: "Pan mode (drag to move canvas)" },
  {
    mode: "select",
    icon: MousePointer2,
    title: "Select mode (drag to select multiple)",
  },
];

interface InteractionModeToolbarProps {
  mode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
}

export function InteractionModeToolbar({
  mode,
  onModeChange,
}: InteractionModeToolbarProps) {
  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2",
        "flex items-center gap-1 p-1.5",
        "bg-cream-200/95 backdrop-blur-sm rounded-full",
        "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.15)]",
        "border border-cream-300/50",
      )}
    >
      {modeOptions.map(({ mode: optionMode, icon: Icon, title }) => (
        <button
          key={optionMode}
          onClick={() => onModeChange(optionMode)}
          className={cn(
            "p-2 rounded-full transition-colors",
            "bg-transparent hover:bg-cream-300",
            "text-charcoal-500 hover:text-charcoal-700",
            {
              "bg-terracotta-500 hover:bg-terracotta-500": mode === optionMode,
              "text-white hover:text-white": mode === optionMode,
            },
          )}
          title={title}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
