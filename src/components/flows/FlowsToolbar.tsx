import cx from 'classnames';
import { SearchInput } from './SearchInput';
import { SortDropdown, SortOption } from './SortDropdown';

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
    <div className={cx('flex items-center justify-end gap-3', 'mb-4')}>
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search workflows..."
      />
      <SortDropdown value={sortBy} onChange={onSortChange} />
    </div>
  );
}

export type { SortOption };
