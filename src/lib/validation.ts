import type { Node, Edge } from '@xyflow/react';

export interface ValidationError {
  id: string;
  nodeId: string | null;
  message: string;
  field?: string;
}

export interface ValidationResult {
  errors: ValidationError[];
  errorsByNodeId: Map<string, ValidationError[]>;
  isValid: boolean;
}

interface NodeData {
  label?: string;
  description?: string;
  prompt?: string;
  branches?: string[];
}

function getNodeData(node: Node): NodeData {
  return (node.data || {}) as NodeData;
}

function generateErrorId(type: string, nodeId?: string): string {
  return nodeId ? `${type}-${nodeId}` : type;
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];

  // Build helper maps
  const incomingEdges = new Map<string, Edge[]>();
  const outgoingEdges = new Map<string, Edge[]>();

  for (const edge of edges) {
    if (!incomingEdges.has(edge.target)) {
      incomingEdges.set(edge.target, []);
    }
    incomingEdges.get(edge.target)!.push(edge);

    if (!outgoingEdges.has(edge.source)) {
      outgoingEdges.set(edge.source, []);
    }
    outgoingEdges.get(edge.source)!.push(edge);
  }

  // 1. Check for duplicate node IDs
  const nodeIdCounts = new Map<string, number>();
  for (const node of nodes) {
    nodeIdCounts.set(node.id, (nodeIdCounts.get(node.id) || 0) + 1);
  }
  for (const [id, count] of nodeIdCounts) {
    if (count > 1) {
      errors.push({
        id: generateErrorId('duplicate-id', id),
        nodeId: id,
        message: `Duplicate ID "${id}" (×${count})`,
        field: 'id',
      });
    }
  }

  // 2. Check if start node exists
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      id: generateErrorId('no-start'),
      nodeId: null,
      message: 'Missing Start node',
    });
  } else if (startNodes.length > 1) {
    for (const startNode of startNodes.slice(1)) {
      errors.push({
        id: generateErrorId('multiple-start', startNode.id),
        nodeId: startNode.id,
        message: 'Multiple Start nodes not allowed',
      });
    }
  }

  // 3. Validate each node
  for (const node of nodes) {
    const data = getNodeData(node);
    const nodeOutgoing = outgoingEdges.get(node.id) || [];
    const nodeIncoming = incomingEdges.get(node.id) || [];

    const nodeName = data.label || 'Untitled';
    const nodeType = node.type ? node.type.charAt(0).toUpperCase() + node.type.slice(1) : 'Node';

    if (node.type === 'start') {
      if (nodeOutgoing.length === 0) {
        errors.push({
          id: generateErrorId('start-no-outgoing', node.id),
          nodeId: node.id,
          message: '[Start][Start]: missing outgoing connection',
        });
      }
    }

    if (node.type === 'action') {
      if (!data.label || data.label.trim() === '') {
        errors.push({
          id: generateErrorId('action-no-name', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: missing name`,
          field: 'label',
        });
      }

      if (!data.prompt || data.prompt.trim() === '' || data.prompt === '<p></p>') {
        errors.push({
          id: generateErrorId('action-no-prompt', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: missing prompt`,
          field: 'prompt',
        });
      }

      if (nodeIncoming.length === 0) {
        errors.push({
          id: generateErrorId('action-no-incoming', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: no incoming connection`,
        });
      }
    }

    if (node.type === 'condition') {
      if (!data.label || data.label.trim() === '') {
        errors.push({
          id: generateErrorId('condition-no-name', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: missing name`,
          field: 'label',
        });
      }

      if (!data.prompt || data.prompt.trim() === '' || data.prompt === '<p></p>') {
        errors.push({
          id: generateErrorId('condition-no-prompt', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: missing prompt`,
          field: 'prompt',
        });
      }

      if (nodeIncoming.length === 0) {
        errors.push({
          id: generateErrorId('condition-no-incoming', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: no incoming connection`,
        });
      }

      if (nodeOutgoing.length < 2) {
        errors.push({
          id: generateErrorId('condition-insufficient-branches', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: needs ≥2 branch connections (has ${nodeOutgoing.length})`,
        });
      }
    }
  }

  // 4. Check for orphaned nodes (not reachable from start)
  if (startNodes.length > 0) {
    const startNode = startNodes[0];
    const reachable = new Set<string>();
    const queue = [startNode.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (reachable.has(currentId)) continue;
      reachable.add(currentId);

      const outgoing = outgoingEdges.get(currentId) || [];
      for (const edge of outgoing) {
        if (!reachable.has(edge.target)) {
          queue.push(edge.target);
        }
      }
    }

    for (const node of nodes) {
      if (node.type !== 'start' && !reachable.has(node.id)) {
        const data = getNodeData(node);
        const nodeName = data.label || 'Untitled';
        const nodeType = node.type ? node.type.charAt(0).toUpperCase() + node.type.slice(1) : 'Node';
        errors.push({
          id: generateErrorId('orphaned', node.id),
          nodeId: node.id,
          message: `[${nodeType}][${nodeName}]: unreachable from Start`,
        });
      }
    }
  }

  // Build errors by node ID map
  const errorsByNodeId = new Map<string, ValidationError[]>();
  for (const error of errors) {
    if (error.nodeId) {
      if (!errorsByNodeId.has(error.nodeId)) {
        errorsByNodeId.set(error.nodeId, []);
      }
      errorsByNodeId.get(error.nodeId)!.push(error);
    }
  }

  return {
    errors,
    errorsByNodeId,
    isValid: errors.length === 0,
  };
}
