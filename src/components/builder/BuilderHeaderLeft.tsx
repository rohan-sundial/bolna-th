import cx from 'classnames';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Check } from 'lucide-react';
import { InlineEdit } from '@/components/ui/InlineEdit';

interface BuilderHeaderLeftProps {
  name: string;
  onNameChange: (name: string) => void;
  isSaving?: boolean;
  showSaved: boolean;
}

export function BuilderHeaderLeft({
  name,
  onNameChange,
  isSaving,
  showSaved,
}: BuilderHeaderLeftProps) {
  return (
    <nav className={cx('flex items-center gap-1', 'text-sm')}>
      <Link
        to="/flows"
        className={cx(
          'text-charcoal-600',
          'hover:text-charcoal-800 hover:underline',
          'transition-colors'
        )}
      >
        Workflows
      </Link>
      <ChevronRight className={cx('w-4 h-4', 'text-charcoal-400')} />
      <InlineEdit
        value={name}
        onSave={onNameChange}
        placeholder="Untitled Workflow"
        className="font-medium text-charcoal-800"
        inputClassName="font-medium"
      />
      {isSaving && (
        <Loader2 className={cx('ml-2 w-4 h-4', 'text-charcoal-500', 'animate-spin')} />
      )}
      {!isSaving && showSaved && (
        <Check
          className={cx(
            'ml-2 w-4 h-4',
            'text-green-600',
            'animate-in fade-in duration-200'
          )}
        />
      )}
    </nav>
  );
}
