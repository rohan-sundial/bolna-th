import { useState, useCallback, useRef, useEffect } from 'react';
import cx from 'classnames';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { ValidationError } from '@/lib/validation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 300;
const DEFAULT_HEIGHT = 150;
const COLLAPSED_HEIGHT = 28;
const STORAGE_KEY = 'validation-panel-height';

interface ValidationPanelProps {
  errors: ValidationError[];
  onErrorClick: (nodeId: string) => void;
}

export function ValidationPanel({ errors, onErrorClick }: ValidationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, parseInt(saved, 10))) : DEFAULT_HEIGHT;
  });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, height]);

  const errorCount = errors.length;
  const hasErrors = errorCount > 0;

  return (
    <div
      ref={containerRef}
      style={{ height: isExpanded ? height : COLLAPSED_HEIGHT }}
      className={cx(
        'relative shrink-0',
        'bg-cream-100/95',
        'backdrop-blur-sm',
        'border-t border-cream-300',
        'shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]',
        !isResizing && 'transition-[height] duration-200 ease-in-out'
      )}
    >
      {/* Resize Handle */}
      {isExpanded && (
        <div
          onMouseDown={handleResizeStart}
          className={cx(
            'absolute top-0 left-0 right-0 h-2 -translate-y-1',
            'cursor-ns-resize',
            'flex items-center justify-center',
            'group z-10'
          )}
        >
          <div
            className={cx(
              'w-12 h-1 rounded-full',
              'bg-cream-400/50 group-hover:bg-cream-500',
              'transition-colors'
            )}
          />
        </div>
      )}

      {/* Header */}
      <div
        className={cx(
          'flex items-center justify-between px-3 h-7',
          'border-b',
          hasErrors ? 'bg-red-50 border-red-200/50' : 'bg-green-50 border-green-200/50',
          'cursor-pointer select-none'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className={cx('w-3.5 h-3.5', hasErrors ? 'text-red-500' : 'text-green-600')} />
                ) : (
                  <ChevronUp className={cx('w-3.5 h-3.5', hasErrors ? 'text-red-500' : 'text-green-600')} />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isExpanded ? 'Collapse panel' : 'Expand panel'}
            </TooltipContent>
          </Tooltip>
          <span className={cx('text-xs font-medium', hasErrors ? 'text-red-700' : 'text-green-700')}>
            Validation Errors ({errorCount})
          </span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="h-[calc(100%-1.75rem)] overflow-y-auto">
          {hasErrors ? (
            <div className="py-1">
              {errors.map((error, index) => (
                <div
                  key={error.id}
                  className={cx(
                    'px-3 py-0.5',
                    'hover:bg-cream-200/50',
                    error.nodeId && 'cursor-pointer'
                  )}
                  onClick={() => error.nodeId && onErrorClick(error.nodeId)}
                >
                  <span className="text-xs text-charcoal-600 font-mono">
                    <span className="text-charcoal-400 mr-2">{index + 1}.</span>
                    {error.message}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-green-600">All validations passed!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
