import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import cx from 'classnames';
import { ChevronUp, ChevronDown, Copy, Check, Download } from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';
import { exportWorkflow } from '@/lib/exportWorkflow';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 500;
const DEFAULT_HEIGHT = 280;
const COLLAPSED_HEIGHT = 28;
const STORAGE_KEY = 'json-panel-height';

interface JSONPreviewPanelProps {
  workflowName: string;
  workflowDescription: string;
  nodes: Node[];
  edges: Edge[];
}

export function JSONPreviewPanel({
  workflowName,
  workflowDescription,
  nodes,
  edges,
}: JSONPreviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [height, setHeight] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, parseInt(saved, 10))) : DEFAULT_HEIGHT;
  });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const exportedData = useMemo(() => {
    return exportWorkflow(workflowName, workflowDescription, nodes, edges);
  }, [workflowName, workflowDescription, nodes, edges]);

  const exportedJson = useMemo(() => {
    return JSON.stringify(exportedData, null, 2);
  }, [exportedData]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [exportedJson]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([exportedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportedJson, workflowName]);

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

  const lineCount = exportedJson.split('\n').length;

  return (
    <div
      ref={containerRef}
      style={{ height: isExpanded ? height : COLLAPSED_HEIGHT }}
      className={cx(
        'relative shrink-0',
        'bg-cream-100/95 backdrop-blur-sm',
        'border-t border-cream-300',
        'shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]',
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
          'border-b border-cream-300/50',
          'cursor-pointer select-none'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-500" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-charcoal-500" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isExpanded ? 'Collapse panel' : 'Expand panel'}
            </TooltipContent>
          </Tooltip>
          <span className={cx('text-xs font-medium', 'text-charcoal-700')}>
            JSON
          </span>
          <span className={cx('text-xs', 'text-charcoal-400')}>
            ({lineCount} lines)
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className={cx(
                  'flex items-center justify-center p-1 rounded',
                  'transition-colors',
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-cream-200 text-charcoal-600 hover:bg-cream-300'
                )}
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className={cx(
                  'flex items-center justify-center p-1 rounded',
                  'bg-cream-200 text-charcoal-600 hover:bg-cream-300',
                  'transition-colors'
                )}
              >
                <Download className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Download JSON
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="h-[calc(100%-1.75rem)]">
          <Editor
            height="100%"
            language="json"
            value={exportedJson}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              lineNumbers: 'on',
              lineNumbersMinChars: 3,
              glyphMargin: false,
              fontSize: 13,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              lineHeight: 20,
              padding: { top: 12, bottom: 12 },
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              wordWrap: 'off',
              renderLineHighlight: 'none',
              occurrencesHighlight: 'off',
              selectionHighlight: false,
              contextmenu: false,
              overviewRulerBorder: false,
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              guides: {
                indentation: true,
                bracketPairs: false,
              },
            }}
            theme="vs"
          />
        </div>
      )}
    </div>
  );
}
