import cx from 'classnames';
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
  onClick: () => void;
  onDelete: () => void;
}

export function WorkflowCard({
  name,
  description,
  updatedAt,
  createdBy,
  searchQuery = '',
  onClick,
  onDelete,
}: WorkflowCardProps) {
  return (
    <div
      onClick={onClick}
      className={cx(
        'group',
        'relative',
        'p-4',
        'rounded-xl',
        'bg-cream-100 hover:bg-cream-200',
        'border border-cream-200 hover:border-cream-300',
        'cursor-pointer',
        'transition-all'
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
    </div>
  );
}
