import { ReactNode } from 'react';
import cx from 'classnames';

export type NodeIconColor = 'green' | 'clay' | 'amber';

const iconColors: Record<NodeIconColor, string> = {
  green: 'bg-green-500',
  clay: 'bg-clay-500',
  amber: 'bg-amber-500',
};

const labelColors: Record<NodeIconColor, string> = {
  green: 'text-green-800',
  clay: 'text-charcoal-800',
  amber: 'text-amber-800',
};

interface NodeHeaderProps {
  icon: ReactNode;
  label: string;
  colorScheme: NodeIconColor;
}

export function NodeHeader({ icon, label, colorScheme }: NodeHeaderProps) {
  return (
    <div className={cx('flex items-center gap-2')}>
      <div className={cx('p-1 rounded', iconColors[colorScheme])}>
        {icon}
      </div>
      <span className={cx('text-sm font-medium', labelColors[colorScheme])}>
        {label}
      </span>
    </div>
  );
}
