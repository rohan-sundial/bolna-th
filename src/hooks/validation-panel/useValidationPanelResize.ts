import { useState, useCallback, useEffect, RefObject } from "react";

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 300;
const DEFAULT_HEIGHT = 150;
const STORAGE_KEY = "validation-panel-height";

interface UseValidationPanelResizeProps {
  containerRef: RefObject<HTMLDivElement>;
}

/**
 * Hook for managing the resizable height of the validation panel.
 * Persists height to localStorage and handles mouse drag resizing.
 */
export function useValidationPanelResize({
  containerRef,
}: UseValidationPanelResizeProps) {
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
