import { memo } from 'react';
import { Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { NodeWrapper, NodeHeader, NodeHandle } from './common';
import { useNodeErrors, useValidationContext } from '@/contexts/ValidationContext';

export const StartNode = memo(function StartNode({ id, selected }: NodeProps) {
  const errors = useNodeErrors(id);
  const { onNodeErrorClick } = useValidationContext();
  const errorMessages = errors.map((e) => e.message);

  return (
    <NodeWrapper
      colorScheme="green"
      selected={selected}
      errors={errorMessages}
      onErrorClick={() => onNodeErrorClick?.(id)}
    >
      <NodeHeader
        icon={<Play className="w-3 h-3 text-white" fill="white" />}
        label="Start"
        colorScheme="green"
      />
      <NodeHandle type="source" position={Position.Right} colorScheme="green" />
    </NodeWrapper>
  );
});
