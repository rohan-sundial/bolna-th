import { z } from 'zod';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import { validateWorkflow } from './validation';

// Zod schemas matching our export format

const StartNodeDataSchema = z.object({}).strict().optional().default({});

const ActionNodeDataSchema = z.object({
  label: z.string().default(''),
  description: z.string().default(''),
  prompt: z.string().default(''),
});

const ConditionNodeDataSchema = z.object({
  label: z.string().default(''),
  description: z.string().default(''),
  prompt: z.string().default(''),
  branches: z.array(z.string()).default(['Yes', 'No']),
});

const StartNodeSchema = z.object({
  id: z.string(),
  type: z.literal('start'),
  data: StartNodeDataSchema,
});

const ActionNodeSchema = z.object({
  id: z.string(),
  type: z.literal('action'),
  data: ActionNodeDataSchema,
});

const ConditionNodeSchema = z.object({
  id: z.string(),
  type: z.literal('condition'),
  data: ConditionNodeDataSchema,
});

const ImportedNodeSchema = z.discriminatedUnion('type', [
  StartNodeSchema,
  ActionNodeSchema,
  ConditionNodeSchema,
]);

const ImportedEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional().default(null),
  label: z.string().nullable().optional().default(null),
});

const ImportedWorkflowSchema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  nodes: z.array(ImportedNodeSchema),
  edges: z.array(ImportedEdgeSchema),
});

export type ImportedWorkflow = z.infer<typeof ImportedWorkflowSchema>;
export type ImportedNode = z.infer<typeof ImportedNodeSchema>;
export type ImportedEdge = z.infer<typeof ImportedEdgeSchema>;

export interface ValidationResult {
  success: boolean;
  data?: ImportedWorkflow;
  errors?: string[];
  workflowErrors?: string[];
}

export function validateImport(jsonString: string): ValidationResult {
  // First, try to parse as JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    const message = e instanceof SyntaxError ? e.message : 'Unknown parse error';
    return {
      success: false,
      errors: [`Invalid JSON: ${message}`],
    };
  }

  // Then validate with Zod
  const result = ImportedWorkflowSchema.safeParse(parsed);

  if (!result.success) {
    // Format Zod errors into readable messages
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
      return `${path}: ${issue.message}`;
    });

    return {
      success: false,
      errors,
    };
  }

  // Schema is valid, now run workflow validation
  const converted = convertToReactFlow(result.data);
  const workflowValidation = validateWorkflow(converted.nodes, converted.edges);

  // Return success with optional workflow warnings
  return {
    success: true,
    data: result.data,
    workflowErrors: workflowValidation.errors.map((e) => e.message),
  };
}

export function convertToReactFlow(imported: ImportedWorkflow): {
  nodes: Node[];
  edges: Edge[];
  name: string;
  description: string;
} {
  // Convert nodes (position 0,0 - will be auto-layouted)
  const nodes: Node[] = imported.nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: { x: 0, y: 0 },
    data: n.data,
  }));

  // Convert edges with proper styling
  const edges: Edge[] = imported.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    type: 'labeled',
    data: e.label ? { label: e.label } : undefined,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#9a8478',
    },
    style: { stroke: '#9a8478', strokeWidth: 1.5 },
  }));

  return {
    nodes,
    edges,
    name: imported.name,
    description: imported.description,
  };
}
