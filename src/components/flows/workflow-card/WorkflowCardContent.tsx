import cx from 'classnames';
import Highlighter from 'react-highlight-words';

interface WorkflowCardContentProps {
  name: string;
  description: string;
  searchQuery: string;
}

export function WorkflowCardContent({ name, description, searchQuery }: WorkflowCardContentProps) {
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <>
      <h3
        className={cx(
          'mt-3',
          'text-base font-semibold',
          'text-charcoal-800',
          'truncate'
        )}
      >
        {hasSearch ? (
          <Highlighter
            searchWords={[searchQuery]}
            autoEscape
            textToHighlight={name}
            highlightClassName="search-highlight"
          />
        ) : (
          name
        )}
      </h3>

      <p
        className={cx(
          'mt-1',
          'text-sm',
          'text-charcoal-700',
          'line-clamp-2'
        )}
      >
        {hasSearch ? (
          <Highlighter
            searchWords={[searchQuery]}
            autoEscape
            textToHighlight={description}
            highlightClassName="search-highlight"
          />
        ) : (
          description
        )}
      </p>
    </>
  );
}
