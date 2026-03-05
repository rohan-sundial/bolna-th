export type ExportedNode =
  | { id: string; type: 'start'; data: Record<string, never> }
  | { id: string; type: 'action'; data: { label: string; description: string; prompt: string } }
  | { id: string; type: 'condition'; data: { label: string; description: string; prompt: string; branches: string[] } };

export interface ExportedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  label: string | null;
}

export interface ExportedWorkflow {
  name: string;
  description: string;
  nodes: ExportedNode[];
  edges: ExportedEdge[];
}
