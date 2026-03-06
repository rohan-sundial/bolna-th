import { ReactNode, useState, useCallback } from 'react';
import { Expand } from 'lucide-react';
import cx from 'classnames';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExpandableTextModalProps {
  title: string;
  children: ReactNode;
  expandedContent: ReactNode;
  className?: string;
}

export function ExpandableTextModal({
  title,
  children,
  expandedContent,
  className,
}: ExpandableTextModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <div className={cx('relative', className)}>
        {children}
        <button
          type="button"
          onClick={handleOpen}
          className={cx(
            'absolute top-1.5 right-1.5',
            'p-1 rounded',
            'text-charcoal-400 hover:text-charcoal-600',
            'hover:bg-cream-200/80',
            'transition-colors',
            'z-10'
          )}
          title="Expand"
        >
          <Expand className="w-3.5 h-3.5" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl h-[70vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 *:h-full">
            {expandedContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
