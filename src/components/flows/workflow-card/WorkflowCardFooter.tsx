import cx from 'classnames';
import { formatRelativeDate, formatFullDate } from '@/utils/date';

interface WorkflowCardFooterProps {
  updatedAt: Date;
  createdBy: string;
}

export function WorkflowCardFooter({ updatedAt, createdBy }: WorkflowCardFooterProps) {
  return (
    <div className={cx('mt-4 pt-3', 'border-t border-cream-200', 'flex items-center justify-between')}>
      <p className={cx('text-xs', 'text-charcoal-700')}>
        <span title={formatFullDate(updatedAt)} className="cursor-help">
          {formatRelativeDate(updatedAt)}
        </span>
      </p>
      <p className={cx('text-xs', 'text-charcoal-700')}>
        {createdBy}
      </p>
    </div>
  );
}
