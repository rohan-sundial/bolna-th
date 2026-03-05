import { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import cx from 'classnames';
import { Upload, Loader2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { validateImport, convertToReactFlow, type ImportedWorkflow } from '@/lib/importWorkflow';
import type { Node, Edge } from '@xyflow/react';

interface ImportJSONDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: {
    nodes: Node[];
    edges: Edge[];
    name: string;
    description: string;
  }) => void;
}

export function ImportJSONDialog({
  open,
  onOpenChange,
  onImport,
}: ImportJSONDialogProps) {
  const [jsonContent, setJsonContent] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [workflowErrors, setWorkflowErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [parsedWorkflow, setParsedWorkflow] = useState<ImportedWorkflow | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const validateContent = useCallback((content: string) => {
    if (!content.trim()) {
      setValidationErrors([]);
      setWorkflowErrors([]);
      setIsValid(false);
      setParsedWorkflow(null);
      return;
    }

    setIsValidating(true);
    
    const result = validateImport(content);

    if (result.success && result.data) {
      setValidationErrors([]);
      setWorkflowErrors(result.workflowErrors || []);
      setIsValid(true);
      setParsedWorkflow(result.data);
    } else {
      setValidationErrors(result.errors || ['Unknown validation error']);
      setWorkflowErrors([]);
      setIsValid(false);
      setParsedWorkflow(null);
    }

    setIsValidating(false);
  }, []);

  const handleContentChange = useCallback((value: string | undefined) => {
    const content = value || '';
    setJsonContent(content);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      validateContent(content);
    }, 300);
  }, [validateContent]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
      validateContent(content);
    };
    reader.readAsText(file);

    e.target.value = '';
  }, [validateContent]);

  const handleImport = useCallback(() => {
    if (!parsedWorkflow) return;

    const converted = convertToReactFlow(parsedWorkflow);
    onImport(converted);
    onOpenChange(false);
  }, [parsedWorkflow, onImport, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setJsonContent('');
      setValidationErrors([]);
      setWorkflowErrors([]);
      setIsValid(false);
      setParsedWorkflow(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const hasContent = jsonContent.trim().length > 0;
  const nodeCount = parsedWorkflow?.nodes.length ?? 0;
  const edgeCount = parsedWorkflow?.edges.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import JSON</DialogTitle>
          <DialogDescription>
            Import a workflow from a JSON file or paste JSON directly. This will replace your current workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </Button>
            <span className="text-xs text-muted-foreground">
              or paste JSON below
            </span>
          </div>

          <div className={cx(
            'h-[350px] border rounded-md overflow-hidden',
            validationErrors.length > 0 && hasContent && 'border-red-300',
            isValid && hasContent && 'border-green-300',
            !hasContent && 'border-cream-300'
          )}>
            <Editor
              height="350px"
              language="json"
              value={jsonContent}
              onChange={handleContentChange}
              options={{
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
                padding: { top: 8, bottom: 8 },
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
                wordWrap: 'off',
                renderLineHighlight: 'line',
                contextmenu: true,
                guides: {
                  indentation: true,
                  bracketPairs: false,
                },
                tabSize: 2,
                formatOnPaste: true,
              }}
              theme="vs"
            />
          </div>

          {/* Validation Status */}
          <div className="space-y-2">
            {isValidating && (
              <div className="flex items-center gap-2 text-charcoal-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating...</span>
              </div>
            )}

            {!isValidating && hasContent && validationErrors.length > 0 && (
              <div className="border border-cream-300 rounded-md overflow-hidden">
                <div className="px-3 py-1.5 bg-cream-100 border-b border-cream-300">
                  <span className="text-xs font-medium text-red-600">
                    Schema Errors ({validationErrors.length})
                  </span>
                </div>
                <div className="max-h-24 overflow-y-auto p-2">
                  {validationErrors.map((error, idx) => (
                    <div key={idx} className="text-xs font-mono text-charcoal-600 py-0.5">
                      <span className="text-charcoal-400 mr-2">{idx + 1}.</span>
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isValidating && hasContent && isValid && parsedWorkflow && (
              <>
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Valid JSON</span>
                  <span className="text-charcoal-400">
                    &middot; {nodeCount} node{nodeCount !== 1 && 's'}, {edgeCount} edge{edgeCount !== 1 && 's'}
                  </span>
                </div>

                {workflowErrors.length > 0 && (
                  <div className="border border-cream-300 rounded-md overflow-hidden">
                    <div className="px-3 py-1.5 bg-cream-100 border-b border-cream-300">
                      <span className="text-xs font-medium text-amber-600">
                        Workflow Issues ({workflowErrors.length})
                      </span>
                    </div>
                    <div className="max-h-24 overflow-y-auto p-2">
                      {workflowErrors.map((error, idx) => (
                        <div key={idx} className="text-xs font-mono text-charcoal-600 py-0.5">
                          <span className="text-charcoal-400 mr-2">{idx + 1}.</span>
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!hasContent && !isValidating && (
              <p className="text-xs text-muted-foreground">
                Paste or upload a valid workflow JSON to continue
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!isValid || !parsedWorkflow}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
