import cx from 'classnames';
import { Link } from 'react-router-dom';
import { WorkflowIcon } from './WorkflowIcon';
import { WorkflowCardContent } from './WorkflowCardContent';
import { WorkflowCardFooter } from './WorkflowCardFooter';
import { WorkflowDeleteButton } from './WorkflowDeleteButton';

interface WorkflowCardProps {
  id: string;
  name: string;
  description: string;
  updatedAt: Date;
  createdBy: string;
  searchQuery?: string;
  onDelete: () => void;
}

export function WorkflowCard({
  id,
  name,
  description,
  updatedAt,
  createdBy,
  searchQuery = '',
  onDelete,
}: WorkflowCardProps) {
  return (
    <Link
      to={`/flows/${id}`}
      className={cx(
        'group',
        'relative',
        'block p-4',
        'rounded-xl',
        'bg-cream-100 hover:bg-cream-200',
        'border border-cream-200 hover:border-cream-300',
        'transition-all',
        'no-underline'
      )}
    >
      <WorkflowDeleteButton onDelete={onDelete} />
      <WorkflowIcon />
      <WorkflowCardContent
        name={name}
        description={description}
        searchQuery={searchQuery}
      />
      <WorkflowCardFooter updatedAt={updatedAt} createdBy={createdBy} />
    </Link>
  );
}
