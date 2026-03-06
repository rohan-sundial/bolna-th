import { useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { OptionsMenu } from '@/components/ui/OptionsMenu';
import { EditDescriptionDialog } from './EditDescriptionDialog';
import { DeleteWorkflowDialog } from '@/components/flows/DeleteWorkflowDialog';
import { ImportJSONDialog } from './ImportJSONDialog';

interface BuilderHeaderRightProps {
  name: string;
  description: string;
  onDescriptionSave: (description: string) => Promise<void>;
  onDuplicate: () => void;
  onDelete: () => void;
  onImport: (data: { nodes: Node[]; edges: Edge[]; name: string; description: string }) => void;
  isDeleting?: boolean;
}

type DialogType = 'description' | 'delete' | 'import' | null;

export function BuilderHeaderRight({
  name,
  description,
  onDescriptionSave,
  onDuplicate,
  onDelete,
  onImport,
  isDeleting,
}: BuilderHeaderRightProps) {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const closeDialog = () => setOpenDialog(null);

  return (
    <>
      <OptionsMenu
        options={[
          {
            id: 'edit-description',
            label: 'Edit Description',
            onClick: () => setOpenDialog('description'),
          },
          {
            id: 'import-json',
            label: 'Import JSON',
            onClick: () => setOpenDialog('import'),
          },
          {
            id: 'duplicate',
            label: 'Duplicate',
            onClick: onDuplicate,
          },
          { type: 'separator' },
          {
            id: 'delete',
            label: 'Delete',
            onClick: () => setOpenDialog('delete'),
            variant: 'destructive',
          },
        ]}
      />

      <EditDescriptionDialog
        open={openDialog === 'description'}
        onOpenChange={closeDialog}
        description={description}
        onSave={onDescriptionSave}
      />

      <DeleteWorkflowDialog
        open={openDialog === 'delete'}
        onOpenChange={closeDialog}
        workflowName={name}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />

      <ImportJSONDialog
        open={openDialog === 'import'}
        onOpenChange={closeDialog}
        onImport={onImport}
      />
    </>
  );
}
