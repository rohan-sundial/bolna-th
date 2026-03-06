import cx from 'classnames';
import { ReactNode } from 'react';

interface WorkflowGridProps {
  children: ReactNode;
}

export function WorkflowGrid({ children }: WorkflowGridProps) {
  return (
    <div
      className={cx(
        'grid gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      )}
    >
      {children}
    </div>
  );
}
