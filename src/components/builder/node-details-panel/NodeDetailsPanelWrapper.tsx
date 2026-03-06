import cx from "classnames";

interface NodeDetailsPanelWrapperProps {
  children: React.ReactNode;
}

export function NodeDetailsPanelWrapper({
  children,
}: NodeDetailsPanelWrapperProps) {
  return (
    <div
      className={cx(
        "absolute right-3 top-3 bottom-3 z-20",
        "w-80",
        "bg-cream-200/90 backdrop-blur-sm",
        "rounded-xl",
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]",
        "border border-cream-300/50",
        "flex flex-col",
        "overflow-hidden",
        "text-xs",
      )}
    >
      {children}
    </div>
  );
}
