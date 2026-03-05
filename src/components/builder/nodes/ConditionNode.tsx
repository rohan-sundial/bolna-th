import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import cx from 'classnames';
import { GitBranch } from 'lucide-react';
import { NodeWrapper, NodeHeader, NodeHandle } from './common';

export const ConditionNode = memo(function ConditionNode({
  data,
  selected,
}: NodeProps) {
  const nodeData = data as { label?: string; branches?: string[] };
  const label = nodeData?.label || 'Condition';
  const branches = nodeData?.branches || ['Yes', 'No'];

  return (
    <NodeWrapper colorScheme="amber" selected={selected} minWidth="min-w-[140px]">
      <NodeHandle type="target" position={Position.Left} colorScheme="amber" />
      <NodeHeader
        icon={<GitBranch className="w-3 h-3 text-white" />}
        label={label}
        colorScheme="amber"
      />

      <div className={cx('flex flex-col gap-1 mt-2')}>
        {branches.map((branch, index) => (
          <div key={branch} className={cx('flex items-center justify-end gap-1.5')}>
            <span className={cx('text-xs', 'text-amber-700')}>{branch}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={`branch-${index}`}
              className={cx('w-2.5! h-2.5!', 'bg-amber-500!', 'border-2! border-white!', 'relative! transform-none! right-auto! top-auto!')}
              style={{ position: 'relative' }}
            />
          </div>
        ))}
      </div>
    </NodeWrapper>
  );
});
