import { ReactNode } from 'react';
import cx from 'classnames';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type MenuOption =
  | {
      type?: 'item';
      id: string;
      label: string;
      onClick: () => void;
      variant?: 'default' | 'destructive';
    }
  | {
      type: 'separator';
    };

interface OptionsMenuProps {
  options: MenuOption[];
  trigger?: ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function OptionsMenu({
  options,
  trigger,
  align = 'end',
}: OptionsMenuProps) {
  const menuItemClass = cx('text-xs', 'opacity-80');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cx(
          'p-2 rounded-md',
          'text-charcoal-600',
          'hover:bg-cream-200 hover:text-charcoal-800',
          'transition-colors'
        )}
      >
        {trigger ?? <MoreHorizontal className="w-4 h-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {options.map((option, index) =>
          option.type === 'separator' ? (
            <DropdownMenuSeparator key={`separator-${index}`} />
          ) : (
            <DropdownMenuItem
              key={option.id}
              onClick={option.onClick}
              variant={option.variant}
              className={menuItemClass}
            >
              {option.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
