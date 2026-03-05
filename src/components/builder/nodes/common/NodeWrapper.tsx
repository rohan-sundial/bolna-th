import { ReactNode } from "react";
import cx from "classnames";

export type NodeColorScheme = "green" | "clay" | "amber";

const colorSchemes: Record<
  NodeColorScheme,
  { bg: string; borderDefault: string; borderSelected: string }
> = {
  green: {
    bg: "bg-green-50",
    borderDefault: "border-green-300",
    borderSelected: "border-green-500",
  },
  clay: {
    bg: "bg-cream-100",
    borderDefault: "border-cream-300",
    borderSelected: "border-clay-500",
  },
  amber: {
    bg: "bg-amber-50",
    borderDefault: "border-amber-300",
    borderSelected: "border-amber-500",
  },
};

interface NodeWrapperProps {
  children: ReactNode;
  colorScheme: NodeColorScheme;
  selected?: boolean;
  minWidth?: string;
}

export function NodeWrapper({
  children,
  colorScheme,
  selected,
  minWidth = "min-w-[120px]",
}: NodeWrapperProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <div
      className={cx(
        "px-4 py-3",
        colors.bg,
        "border-2 rounded-lg",
        minWidth,
        "shadow-sm",
        selected ? colors.borderSelected : colors.borderDefault,
      )}
    >
      {children}
    </div>
  );
}
