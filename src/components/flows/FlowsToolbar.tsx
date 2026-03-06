import cx from 'classnames';
import { SearchInput } from './SearchInput';
import { SortDropdown } from './SortDropdown';
import { SortOption } from '@/types/workflow';

interface FlowsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function FlowsToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: FlowsToolbarProps) {
  return (
    <div className={cx('flex items-center justify-end gap-3')}>
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search workflows..."
      />
      <SortDropdown value={sortBy} onChange={onSortChange} />
    </div>
  );
}
