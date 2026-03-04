import cx from 'classnames';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FlowsHeader } from '@/components/flows/FlowsHeader';
import { FlowsToolbar, SortOption } from '@/components/flows/FlowsToolbar';
import { WorkflowCard } from '@/components/flows/workflow-card';
import { WorkflowGrid } from '@/components/flows/WorkflowGrid';
import { EmptyState } from '@/components/flows/EmptyState';
import { MOCK_WORKFLOWS } from '@/data/mockWorkflows';

export function FlowsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');

  const filteredWorkflows = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return MOCK_WORKFLOWS.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const sortedWorkflows = useMemo(() => {
    return [...filteredWorkflows].sort((a, b) => {
      const dateA = sortBy === 'updatedAt' ? a.updatedAt : a.createdAt;
      const dateB = sortBy === 'updatedAt' ? b.updatedAt : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredWorkflows, sortBy]);

  const handleCreateClick = () => {
    const newId = uuidv4();
    navigate(`/flows/${newId}`);
  };

  const handleWorkflowClick = (id: string) => {
    navigate(`/flows/${id}`);
  };

  const handleDeleteWorkflow = (id: string) => {
    console.log('Delete workflow:', id);
  };

  return (
    <div className={cx('px-6 pt-4 pb-8')}>
      <FlowsHeader onCreateClick={handleCreateClick} />

      <FlowsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {sortedWorkflows.length === 0 ? (
        <EmptyState />
      ) : (
        <WorkflowGrid>
          {sortedWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              id={workflow.id}
              name={workflow.name}
              description={workflow.description}
              updatedAt={workflow.updatedAt}
              createdBy={workflow.createdBy}
              searchQuery={searchQuery}
              onClick={() => handleWorkflowClick(workflow.id)}
              onDelete={() => handleDeleteWorkflow(workflow.id)}
            />
          ))}
        </WorkflowGrid>
      )}
    </div>
  );
}
