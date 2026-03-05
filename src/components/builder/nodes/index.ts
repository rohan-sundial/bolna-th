import type { NodeTypes } from '@xyflow/react';
import { StartNode } from './StartNode';
import { ActionNode } from './ActionNode';
import { ConditionNode } from './ConditionNode';

export const nodeTypes: NodeTypes = {
  start: StartNode,
  action: ActionNode,
  condition: ConditionNode,
};

export type NodeType = 'start' | 'action' | 'condition';

export { StartNode, ActionNode, ConditionNode };
