import cx from "classnames";
import { NodeDetailsPanelLabel } from "./NodeDetailsPanelLabel";

interface NodeDetailsPanelSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function NodeDetailsPanelSection({
  label,
  children,
  className,
}: NodeDetailsPanelSectionProps) {
  return (
    <div className={cx("space-y-1.5", className)}>
      <NodeDetailsPanelLabel>{label}</NodeDetailsPanelLabel>
      {children}
    </div>
  );
}
