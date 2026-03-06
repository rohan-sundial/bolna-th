import cx from "classnames";

interface JSONPreviewPanelResizeHandleProps {
  onResizeStart: (e: React.MouseEvent) => void;
}

export function JSONPreviewPanelResizeHandle({
  onResizeStart,
}: JSONPreviewPanelResizeHandleProps) {
  return (
    <div
      onMouseDown={onResizeStart}
      className={cx(
        "absolute top-0 left-0 right-0 h-2 -translate-y-1",
        "cursor-ns-resize",
        "flex items-center justify-center",
        "group z-10",
      )}
    >
      <div
        className={cx(
          "w-12 h-1 rounded-full",
          "bg-cream-400/50 group-hover:bg-cream-500",
          "transition-colors",
        )}
      />
    </div>
  );
}
