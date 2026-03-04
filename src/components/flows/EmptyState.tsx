import cx from 'classnames';
import { FolderOpen } from 'lucide-react';

export function EmptyState() {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center',
        'py-16'
      )}
    >
      <div
        className={cx(
          'w-16 h-16',
          'flex items-center justify-center',
          'rounded-full',
          'bg-cream-200'
        )}
      >
        <FolderOpen className={cx('w-8 h-8', 'text-charcoal-700')} />
      </div>
      <h3 className={cx('mt-4', 'text-lg font-medium', 'text-charcoal-800')}>
        No workflows yet
      </h3>
      <p className={cx('mt-1', 'text-sm', 'text-charcoal-700')}>
        Create your first workflow to get started
      </p>
    </div>
  );
}
