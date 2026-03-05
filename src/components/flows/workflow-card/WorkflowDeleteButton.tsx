import cx from 'classnames';
import { Trash2 } from 'lucide-react';

interface WorkflowDeleteButtonProps {
  onDelete: () => void;
}

export function WorkflowDeleteButton({ onDelete }: WorkflowDeleteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete();
      }}
      className={cx(
        'absolute top-3 right-3',
        'p-1.5',
        'rounded-lg',
        'text-charcoal-700',
        'opacity-0 group-hover:opacity-100',
        'hover:bg-cream-300 hover:text-terracotta-600',
        'transition-all'
      )}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
