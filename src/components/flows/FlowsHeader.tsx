import cx from 'classnames';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlowsHeaderProps {
  onCreateClick: () => void;
}

export function FlowsHeader({ onCreateClick }: FlowsHeaderProps) {
  return (
    <div className={cx('flex flex-col items-center', 'pt-6 pb-10')}>
      <h1 className={cx('text-xl font-semibold', 'text-charcoal-800')}>
        Create a workflow
      </h1>
      <p className={cx('mt-1', 'text-sm text-charcoal-700')}>
        Build a custom workflow with ease
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateClick}
        className={cx(
          'mt-4',
          'rounded-full',
          'border-terracotta-500',
          'bg-terracotta-500/10',
          'text-terracotta-700',
          'hover:bg-terracotta-500/20 hover:text-terracotta-700'
        )}
      >
        <Plus className="w-4 h-4" />
        Create
      </Button>
    </div>
  );
}
