import { useState, DragEvent } from 'react';
import cx from 'classnames';
import { Play, Zap, GitBranch, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { NodeType } from './nodes';

interface NodeLibraryItem {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}

const libraryItems: NodeLibraryItem[] = [
  {
    type: 'start',
    label: 'Start',
    icon: <Play className="w-3 h-3 text-white" fill="currentColor" />,
    iconBg: 'bg-green-500',
  },
  {
    type: 'action',
    label: 'Action',
    icon: <Zap className="w-3 h-3 text-white" fill="currentColor" />,
    iconBg: 'bg-clay-500',
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: <GitBranch className="w-3 h-3 text-white" />,
    iconBg: 'bg-amber-500',
  },
];

interface NodeLibraryProps {
  onAddNode: (type: NodeType) => void;
}

export function NodeLibrary({ onAddNode }: NodeLibraryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, type: NodeType) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const CollapseIcon = isCollapsed ? ChevronsRight : ChevronsLeft;

  return (
    <div
      className={cx(
        'group',
        'absolute left-2 top-1/2 -translate-y-1/2 z-10',
        'bg-cream-200/60 backdrop-blur-[2px]',
        'rounded-xl',
        'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]',
        'border border-cream-300/50',
        'p-1.5',
        'flex flex-col gap-0.5'
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cx(
          'self-start',
          'p-1.5 mb-1',
          'rounded-lg',
          'text-charcoal-400 hover:text-charcoal-600',
          'hover:bg-cream-300/70',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-150'
        )}
      >
        <CollapseIcon className="w-3.5 h-3.5" />
      </button>

      {libraryItems.map((item) => (
        <div
          key={item.type}
          draggable
          onDragStart={(e) => handleDragStart(e, item.type)}
          onClick={() => onAddNode(item.type)}
          className={cx(
            'flex items-center h-10',
            'rounded-lg',
            'cursor-grab active:cursor-grabbing',
            'hover:bg-cream-300/70',
            'transition-colors duration-150',
            'select-none',
            isCollapsed ? 'justify-center px-2' : 'gap-2.5 pl-2 pr-3'
          )}
          title={isCollapsed ? item.label : undefined}
        >
          <span className={cx('flex items-center justify-center', 'w-6 h-6 rounded', item.iconBg)}>
            {item.icon}
          </span>
          {!isCollapsed && (
            <span className={cx('text-sm', 'text-charcoal-700')}>{item.label}</span>
          )}
        </div>
      ))}

      <div className="h-7" />
    </div>
  );
}
