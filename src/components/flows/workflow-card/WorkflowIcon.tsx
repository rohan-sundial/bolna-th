import cx from 'classnames';
import { Workflow } from 'lucide-react';

export function WorkflowIcon() {
  return (
    <div
      className={cx(
        'w-8 h-8',
        'flex items-center justify-center',
        'rounded-md',
        'bg-terracotta-500/15'
      )}
    >
      <Workflow className={cx('w-4 h-4', 'text-terracotta-600')} />
    </div>
  );
}
