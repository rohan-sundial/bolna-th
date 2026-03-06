import cx from "classnames";
import { labelStyles } from "./nodeDetailsPanelStyles";

interface NodeDetailsPanelLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function NodeDetailsPanelLabel({
  children,
  className,
}: NodeDetailsPanelLabelProps) {
  return <label className={cx(labelStyles, className)}>{children}</label>;
}
