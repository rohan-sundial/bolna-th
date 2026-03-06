import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import cx from 'classnames';
import { GitBranch } from 'lucide-react';
import { NodeWrapper, NodeHeader, NodeHandle } from './common';
import { useNodeErrors, useValidationContext } from '@/contexts/useValidation';

export const ConditionNode = memo(function ConditionNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as { label?: string; branches?: string[] };
  const label = nodeData?.label || 'Condition';
  const branches = nodeData?.branches || ['Yes', 'No'];
  const errors = useNodeErrors(id);
  const { onNodeErrorClick } = useValidationContext();
  const errorMessages = errors.map((e) => e.message);

  return (
    <NodeWrapper
      colorScheme="amber"
      selected={selected}
      minWidth="min-w-[140px]"
      errors={errorMessages}
      onErrorClick={() => onNodeErrorClick?.(id)}
    >
      <NodeHandle type="target" position={Position.Left} colorScheme="amber" />
      <NodeHeader
        icon={<GitBranch className="w-3 h-3 text-white" />}
        label={label}
        colorScheme="amber"
      />

      <div className={cx('flex flex-col gap-3 mt-3')}>
        {branches.map((branch, index) => (
          <div key={branch} className={cx('flex items-center justify-end pr-4 relative')}>
            <span className={cx('text-xs', 'text-amber-700')}>{branch}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={`branch-${index}`}
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              className={cx(
                'w-2.5! h-2.5!',
                'bg-amber-500!',
                'border-2! border-white!'
              )}
            />
          </div>
        ))}
      </div>
    </NodeWrapper>
  );
});
