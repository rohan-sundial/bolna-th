import { useState } from 'react';
import cx from 'classnames';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface JSONPreviewPanelProps {
  data: object;
}

export function JSONPreviewPanel({ data }: JSONPreviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cx('border-t border-cream-200', 'bg-cream-100')}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cx(
          'w-full',
          'flex items-center justify-between',
          'px-4 py-2',
          'text-sm font-medium text-charcoal-700',
          'hover:bg-cream-200',
          'transition-colors'
        )}
      >
        <span>JSON Preview</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className={cx('px-4 pb-4', 'max-h-64 overflow-auto')}>
          <pre
            className={cx(
              'p-3',
              'text-xs font-mono',
              'bg-charcoal-800 text-cream-100',
              'rounded-lg',
              'overflow-x-auto'
            )}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
