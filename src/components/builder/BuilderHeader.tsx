import { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Check, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InlineEdit } from '@/components/ui/InlineEdit';

interface BuilderHeaderProps {
  name: string;
  onNameChange: (name: string) => void;
  onDescriptionEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isSaving?: boolean;
}

export function BuilderHeader({
  name,
  onNameChange,
  onDescriptionEdit,
  onDuplicate,
  onDelete,
  isSaving,
}: BuilderHeaderProps) {
  const [showSaved, setShowSaved] = useState(false);
  const prevSavingRef = useRef(isSaving);

  useEffect(() => {
    if (prevSavingRef.current && !isSaving) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 1500);
      return () => clearTimeout(timer);
    }
    prevSavingRef.current = isSaving;
  }, [isSaving]);

  const menuItemClass = cx('text-xs', 'opacity-80');

  return (
    <header
      className={cx(
        'h-14 px-4',
        'flex items-center justify-between',
        'border-b border-cream-300',
        'bg-cream-50'
      )}
    >
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

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cx(
            'p-2 rounded-md',
            'text-charcoal-600',
            'hover:bg-cream-200 hover:text-charcoal-800',
            'transition-colors'
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDescriptionEdit} className={menuItemClass}>
            Edit Description
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate} className={menuItemClass}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} variant="destructive" className={menuItemClass}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
