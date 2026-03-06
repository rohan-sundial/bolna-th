import { forwardRef } from "react";
import cx from "classnames";

interface ValidationPanelWrapperProps {
  height: number;
  isResizing: boolean;
  children: React.ReactNode;
}

export const ValidationPanelWrapper = forwardRef<
  HTMLDivElement,
  ValidationPanelWrapperProps
>(function ValidationPanelWrapper({ height, isResizing, children }, ref) {
  return (
    <div
      ref={ref}
      style={{ height }}
      className={cx(
        "relative shrink-0",
        "bg-cream-100/95",
        "backdrop-blur-sm",
        "border-t border-cream-300",
        "shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]",
        !isResizing && "transition-[height] duration-200 ease-in-out",
      )}
    >
      {children}
    </div>
  );
});
