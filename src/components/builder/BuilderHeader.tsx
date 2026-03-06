import { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import type { Node, Edge } from '@xyflow/react';
import { BuilderHeaderLeft } from './BuilderHeaderLeft';
import { BuilderHeaderRight } from './BuilderHeaderRight';

interface BuilderHeaderProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionSave: (description: string) => Promise<void>;
  onDuplicate: () => void;
  onDelete: () => void;
  onImport: (data: { nodes: Node[]; edges: Edge[]; name: string; description: string }) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function BuilderHeader({
  name,
  description,
  onNameChange,
  onDescriptionSave,
  onDuplicate,
  onDelete,
  onImport,
  isSaving,
  isDeleting,
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

  return (
    <header
      className={cx(
        'h-14 px-4',
        'flex items-center justify-between',
        'border-b border-cream-300',
        'bg-cream-50'
      )}
    >
      <BuilderHeaderLeft
        name={name}
        onNameChange={onNameChange}
        isSaving={isSaving}
        showSaved={showSaved}
      />

      <BuilderHeaderRight
        name={name}
        description={description}
        onDescriptionSave={onDescriptionSave}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onImport={onImport}
        isDeleting={isDeleting}
      />
    </header>
  );
}
