import { Handle, Position } from '@xyflow/react';
import cx from 'classnames';

export type HandleColor = 'green' | 'clay' | 'amber';

const handleColors: Record<HandleColor, string> = {
  green: 'bg-green-500!',
  clay: 'bg-clay-500!',
  amber: 'bg-amber-500!',
};

interface NodeHandleProps {
  type: 'source' | 'target';
  position: Position;
  colorScheme: HandleColor;
  id?: string;
}

export function NodeHandle({ type, position, colorScheme, id }: NodeHandleProps) {
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      className={cx('w-3! h-3!', handleColors[colorScheme], 'border-2! border-white!')}
    />
  );
}
