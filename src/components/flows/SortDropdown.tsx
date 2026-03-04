import cx from 'classnames';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'updatedAt' | 'createdAt';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updatedAt', label: 'Last edited' },
  { value: 'createdAt', label: 'Date created' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger
        className={cx(
          'w-auto gap-2',
          'bg-cream-50',
          'border-cream-300',
          'text-charcoal-800'
        )}
      >
        <span className="text-charcoal-700">Sort by:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={cx('bg-cream-50', 'border-cream-300')}>
        {SORT_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={cx('text-charcoal-800', 'focus:bg-cream-200')}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
