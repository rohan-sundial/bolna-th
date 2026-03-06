import { useState, useCallback, useEffect, RefObject } from "react";

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 500;
const DEFAULT_HEIGHT = 280;
const STORAGE_KEY = "json-panel-height";

interface UseJSONPreviewPanelResizeProps {
  containerRef: RefObject<HTMLDivElement>;
}

/**
 * Hook for managing the resizable height of the JSON preview panel.
 * Persists height to localStorage and handles mouse drag resizing.
 */
export function useJSONPreviewPanelResize({
  containerRef,
}: UseJSONPreviewPanelResizeProps) {
  const [height, setHeight] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, parseInt(saved, 10)))
      : DEFAULT_HEIGHT;
  });
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      const clampedHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight));
      setHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      localStorage.setItem(STORAGE_KEY, height.toString());
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, height, containerRef]);

  return {
    height,
    isResizing,
    handleResizeStart,
  };
}

export const COLLAPSED_HEIGHT = 28;
