import { useState, useEffect } from 'react';
import cx from 'classnames';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EditDescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
  onSave: (description: string) => Promise<void>;
}

export function EditDescriptionDialog({
  open,
  onOpenChange,
  description,
  onSave,
}: EditDescriptionDialogProps) {
  const [value, setValue] = useState(description);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(description);
    }
  }, [open, description]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(value);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={isSaving ? undefined : onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit description</AlertDialogTitle>
        </AlertDialogHeader>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a description for this workflow..."
          rows={4}
          className={cx(
            'w-full px-3 py-2',
            'text-sm',
            'border border-cream-300 rounded-md',
            'bg-white',
            'placeholder:text-charcoal-400',
            'focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent',
            'resize-none'
          )}
        />
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
