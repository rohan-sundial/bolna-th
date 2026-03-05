import { useState } from 'react';

export function useBuilderDialogs() {
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return {
    descriptionDialogOpen,
    setDescriptionDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  };
}
