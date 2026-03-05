import type { Node, Edge } from '@xyflow/react';
import type { ExportedWorkflow, ExportedNode, ExportedEdge } from '@/types/export';

interface NodeData {
  label?: string;
  description?: string;
  prompt?: string;
  branches?: string[];
}

interface EdgeData {
  label?: string;
}

export function exportWorkflow(
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[]
): ExportedWorkflow {
  const exportedNodes: ExportedNode[] = nodes.map((node): ExportedNode => {
    const data = node.data as NodeData;
    const type = node.type as 'start' | 'action' | 'condition';

    switch (type) {
      case 'start':
        return {
          id: node.id,
          type: 'start',
          data: {} as Record<string, never>,
        };
      case 'action':
        return {
          id: node.id,
          type: 'action',
          data: {
            label: data.label || '',
            description: data.description || '',
            prompt: data.prompt || '',
          },
        };
      case 'condition':
        return {
          id: node.id,
          type: 'condition',
          data: {
            label: data.label || '',
            description: data.description || '',
            prompt: data.prompt || '',
            branches: data.branches || ['Yes', 'No'],
          },
        };
      default:
        return {
          id: node.id,
          type: 'action',
          data: {
            label: data.label || '',
            description: data.description || '',
            prompt: data.prompt || '',
          },
        };
    }
  });

  const exportedEdges: ExportedEdge[] = edges.map((edge) => {
    const data = edge.data as EdgeData | undefined;
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || null,
      label: data?.label || null,
    };
  });

  return {
    name,
    description,
    nodes: exportedNodes,
    edges: exportedEdges,
  };
}
