import { memo } from 'react';
import { Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { NodeWrapper, NodeHeader, NodeHandle } from './common';

export const StartNode = memo(function StartNode({ selected }: NodeProps) {
  return (
    <NodeWrapper colorScheme="green" selected={selected}>
      <NodeHeader
        icon={<Play className="w-3 h-3 text-white" fill="white" />}
        label="Start"
        colorScheme="green"
      />
      <NodeHandle type="source" position={Position.Right} colorScheme="green" />
    </NodeWrapper>
  );
});
