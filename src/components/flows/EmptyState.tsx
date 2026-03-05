import cx from 'classnames';
import { FolderOpen, Search } from 'lucide-react';

interface EmptyStateProps {
  variant?: 'no-workflows' | 'no-results';
}

export function EmptyState({ variant = 'no-workflows' }: EmptyStateProps) {
  const isNoResults = variant === 'no-results';

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
        {isNoResults ? (
          <Search className={cx('w-8 h-8', 'text-charcoal-700')} />
        ) : (
          <FolderOpen className={cx('w-8 h-8', 'text-charcoal-700')} />
        )}
      </div>
      <h3 className={cx('mt-4', 'text-lg font-medium', 'text-charcoal-800')}>
        {isNoResults ? 'No matching workflows' : 'No workflows yet'}
      </h3>
      <p className={cx('mt-1', 'text-sm', 'text-charcoal-700')}>
        {isNoResults
          ? 'Try a different search term'
          : 'Create your first workflow to get started'}
      </p>
    </div>
  );
}
