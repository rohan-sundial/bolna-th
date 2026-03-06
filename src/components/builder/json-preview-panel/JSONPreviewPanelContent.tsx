import Editor from "@monaco-editor/react";

interface JSONPreviewPanelContentProps {
  json: string;
}

export function JSONPreviewPanelContent({ json }: JSONPreviewPanelContentProps) {
  return (
    <div className="h-[calc(100%-1.75rem)]">
      <Editor
        height="100%"
        language="json"
        value={json}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          folding: true,
          foldingStrategy: "indentation",
          showFoldingControls: "always",
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: false,
          fontSize: 13,
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          lineHeight: 20,
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          wordWrap: "off",
          renderLineHighlight: "none",
          occurrencesHighlight: "off",
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
  );
}
