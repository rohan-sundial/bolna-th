import { useCallback, useMemo, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import cx from 'classnames';
import { X, Trash2, Play, Zap, GitBranch, Plus, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TiptapEditor } from '@/components/ui/TiptapEditor';
import { ExpandableTextModal } from '@/components/ui/ExpandableTextModal';
import { DeleteNodeDialog } from './DeleteNodeDialog';
import { useNodeErrors } from '@/contexts/ValidationContext';

interface NodeData {
  label?: string;
  description?: string;
  prompt?: string;
  branches?: string[];
}

const nodeConfig: Record<string, { icon: React.ElementType; label: string; colorScheme: 'green' | 'clay' | 'amber'; bgColor: string; textColor: string; iconFill: string }> = {
  start: { icon: Play, label: 'Start', colorScheme: 'green', bgColor: 'bg-green-500', textColor: 'text-green-700', iconFill: 'white' },
  action: { icon: Zap, label: 'Action', colorScheme: 'clay', bgColor: 'bg-clay-500', textColor: 'text-clay-700', iconFill: 'white' },
  condition: { icon: GitBranch, label: 'Condition', colorScheme: 'amber', bgColor: 'bg-amber-500', textColor: 'text-amber-700', iconFill: 'none' },
};

interface NodeSidebarProps {
  node: Node;
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  onUpdateData: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddEdge: (sourceId: string, targetId: string, sourceHandle?: string) => void;
}

interface SectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function Section({ label, children, className }: SectionProps) {
  return (
    <div className={cx('space-y-1.5', className)}>
      <label className={cx('text-[10px] font-medium uppercase tracking-wide', 'text-charcoal-400')}>
        {label}
      </label>
      {children}
    </div>
  );
}

interface NodeChipProps {
  nodeId: string;
  nodes: Node[];
  onDelete?: () => void;
}

function NodeChip({ nodeId, nodes, onDelete }: NodeChipProps) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return <span className="text-xs text-charcoal-400">{nodeId}</span>;
  
  const nodeData = node.data as NodeData;
  const config = nodeConfig[node.type || 'action'] || nodeConfig.action;
  const Icon = config.icon;
  const label = nodeData.label || config.label;

  return (
    <span
      className={cx(
        'group inline-flex items-center gap-1.5 px-2 py-1 rounded-md',
        'bg-white border border-cream-300',
        'text-xs font-medium'
      )}
    >
      <span className={cx('p-0.5 rounded', config.bgColor)}>
        <Icon className="w-2.5 h-2.5 text-white" fill={config.iconFill} />
      </span>
      <span className={cx(config.textColor, 'truncate max-w-[100px]')}>{label}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cx(
            'p-0.5 -mr-1 rounded',
            'text-charcoal-300 hover:text-red-500',
            'opacity-0 group-hover:opacity-100',
            'transition-all'
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

function AddLink({ onSelect, options, placeholder = 'Add' }: { 
  onSelect: (value: string) => void; 
  options: { id: string; label: string }[];
  placeholder?: string;
}) {
  if (options.length === 0) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cx(
            'inline-flex items-center gap-0.5 px-1 py-0.5 text-xs',
            'text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-300/50',
            'rounded transition-colors'
          )}
        >
          <Plus className="w-3 h-3" />
          {placeholder}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.id} 
            className="text-xs cursor-pointer"
            onSelect={() => onSelect(opt.id)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NodeSidebar({
  node,
  nodes,
  edges,
  onClose,
  onDelete,
  onUpdateData,
  onDeleteEdge,
  onAddEdge,
}: NodeSidebarProps) {
  const nodeType = node.type || 'action';
  const config = nodeConfig[nodeType] || nodeConfig.action;
  const Icon = config.icon;
  const data = node.data as NodeData;
  const errors = useNodeErrors(node.id);
  const [copied, setCopied] = useState(false);

  const hasPromptError = useMemo(
    () => errors.some((e) => e.field === 'prompt'),
    [errors]
  );

  const incomingEdges = useMemo(
    () => edges.filter((e) => e.target === node.id),
    [edges, node.id]
  );

  const outgoingEdges = useMemo(
    () => edges.filter((e) => e.source === node.id),
    [edges, node.id]
  );

  const getNodeName = useCallback(
    (nodeId: string) => {
      const n = nodes.find((nd) => nd.id === nodeId);
      if (!n) return nodeId;
      const nodeData = n.data as NodeData;
      return nodeData.label || nodeConfig[n.type || 'action']?.label || 'Node';
    },
    [nodes]
  );

  const availableSources = useMemo(() => {
    return nodes.filter((n) => {
      if (n.id === node.id) return false;
      if (n.type === 'start') {
        const hasOutgoing = edges.some((e) => e.source === n.id);
        return !hasOutgoing;
      }
      if (n.type === 'condition') {
        const nodeData = n.data as NodeData;
        const branches = nodeData.branches || ['Yes', 'No'];
        const usedHandles = edges.filter((e) => e.source === n.id).map((e) => e.sourceHandle);
        return branches.some((_, i) => !usedHandles.includes(`branch-${i}`));
      } else {
        const hasOutgoing = edges.some((e) => e.source === n.id);
        return !hasOutgoing;
      }
    });
  }, [nodes, edges, node.id]);

  const availableTargets = useMemo(() => {
    return nodes.filter((n) => {
      if (n.id === node.id) return false;
      if (n.type === 'start') return false;
      return true;
    });
  }, [nodes, node.id]);

  const availableBranches = useMemo(() => {
    if (nodeType !== 'condition') return [];
    const branches = data.branches || ['Yes', 'No'];
    const usedHandles = new Set(outgoingEdges.map((e) => e.sourceHandle));
    return branches
      .map((name, index) => ({ name, handleId: `branch-${index}` }))
      .filter((b) => !usedHandles.has(b.handleId));
  }, [nodeType, data.branches, outgoingEdges]);

  const canAddOutgoing = useMemo(() => {
    if (nodeType === 'condition') {
      return availableBranches.length > 0 && availableTargets.length > 0;
    }
    return outgoingEdges.length === 0 && availableTargets.length > 0;
  }, [nodeType, availableBranches, availableTargets, outgoingEdges]);

  const handleCopyId = useCallback(async () => {
    await navigator.clipboard.writeText(node.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [node.id]);

  const handleAddIncoming = useCallback(
    (sourceId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceId);
      if (!sourceNode) return;

      let sourceHandle: string | undefined;
      if (sourceNode.type === 'condition') {
        const nodeData = sourceNode.data as NodeData;
        const branches = nodeData.branches || ['Yes', 'No'];
        const usedHandles = edges.filter((e) => e.source === sourceId).map((e) => e.sourceHandle);
        const availableIndex = branches.findIndex((_, i) => !usedHandles.includes(`branch-${i}`));
        if (availableIndex >= 0) {
          sourceHandle = `branch-${availableIndex}`;
        }
      }

      onAddEdge(sourceId, node.id, sourceHandle);
    },
    [nodes, edges, node.id, onAddEdge]
  );

  const handleAddOutgoing = useCallback(
    (targetId: string, branchHandleId?: string) => {
      onAddEdge(node.id, targetId, branchHandleId);
    },
    [node.id, onAddEdge]
  );

  const getBranchNameForNode = useCallback(
    (sourceNodeId: string, sourceHandle: string | null | undefined) => {
      if (!sourceHandle) return null;
      const match = sourceHandle.match(/^branch-(\d+)$/);
      if (!match) return null;
      const index = parseInt(match[1], 10);
      
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode || sourceNode.type !== 'condition') return null;
      
      const sourceData = sourceNode.data as NodeData;
      const branches = sourceData.branches || ['Yes', 'No'];
      return branches[index] || null;
    },
    [nodes]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateData(node.id, { label: e.target.value });
    },
    [node.id, onUpdateData]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateData(node.id, { description: e.target.value });
    },
    [node.id, onUpdateData]
  );

  const handlePromptChange = useCallback(
    (content: string) => {
      onUpdateData(node.id, { prompt: content });
    },
    [node.id, onUpdateData]
  );

  const handleBranchChange = useCallback(
    (index: number, value: string) => {
      const branches = [...(data.branches || ['Yes', 'No'])];
      branches[index] = value;
      onUpdateData(node.id, { branches });
    },
    [node.id, data.branches, onUpdateData]
  );

  const handleAddBranch = useCallback(() => {
    const branches = [...(data.branches || ['Yes', 'No']), `Branch ${(data.branches?.length || 2) + 1}`];
    onUpdateData(node.id, { branches });
  }, [node.id, data.branches, onUpdateData]);

  const handleRemoveBranch = useCallback(
    (index: number) => {
      const branches = (data.branches || ['Yes', 'No']).filter((_, i) => i !== index);
      if (branches.length >= 2) {
        onUpdateData(node.id, { branches });
      }
    },
    [node.id, data.branches, onUpdateData]
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(node.id);
    onClose();
  }, [node.id, onDelete, onClose]);

  const sourceOptions = useMemo(
    () => availableSources.map((n) => ({ id: n.id, label: getNodeName(n.id) })),
    [availableSources, getNodeName]
  );

  const targetOptions = useMemo(
    () => availableTargets.map((n) => ({ id: n.id, label: getNodeName(n.id) })),
    [availableTargets, getNodeName]
  );

  const showIncomingAdd = incomingEdges.length === 0 && sourceOptions.length > 0;

  return (
    <>
    <DeleteNodeDialog
      open={showDeleteDialog}
      onOpenChange={setShowDeleteDialog}
      nodeCount={1}
      onConfirm={handleConfirmDelete}
    />
    <div
      className={cx(
        'absolute right-3 top-3 bottom-3 z-20',
        'w-80',
        'bg-cream-200/90 backdrop-blur-sm',
        'rounded-xl',
        'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]',
        'border border-cream-300/50',
        'flex flex-col',
        'overflow-hidden',
        'text-xs'
      )}
    >
      {/* Header */}
      <div
        className={cx(
          'flex items-center gap-2 px-3 py-2',
          'border-b border-cream-300/50'
        )}
      >
        <span className={cx('p-1 rounded', config.bgColor)}>
          <Icon className="w-3 h-3 text-white" fill={config.iconFill} />
        </span>
        <span className={cx('flex-1 text-xs font-medium', config.textColor)}>
          {config.label}
        </span>
        <button
          onClick={handleDeleteClick}
          className={cx(
            'p-1 rounded-lg',
            'text-charcoal-400 hover:text-red-500',
            'hover:bg-cream-300/70',
            'transition-colors'
          )}
          title="Delete node"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          className={cx(
            'p-1 rounded-lg',
            'text-charcoal-400 hover:text-charcoal-600',
            'hover:bg-cream-300/70',
            'transition-colors'
          )}
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className={cx('flex-1 overflow-y-auto', 'p-3 space-y-3')}>
        {/* ID and Name grid */}
        <div className="grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-2 items-center">
          <label className={cx('text-[10px] font-medium uppercase tracking-wide', 'text-charcoal-400')}>
            ID
          </label>
          <div className="relative group">
            <Input
              value={node.id}
              readOnly
              className={cx(
                'h-7 text-xs font-mono pr-7',
                'bg-cream-100/50',
                'text-charcoal-500',
                'cursor-default select-all'
              )}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={handleCopyId}
              className={cx(
                'absolute right-1 top-1/2 -translate-y-1/2',
                'p-1 rounded',
                'text-charcoal-400 hover:text-charcoal-600',
                'hover:bg-cream-200',
                'opacity-0 group-hover:opacity-100',
                'transition-all'
              )}
              title="Copy ID"
            >
              {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {nodeType !== 'start' && (
            <>
              <label className={cx('text-[10px] font-medium uppercase tracking-wide', 'text-charcoal-400')}>
                Name
              </label>
              <Input
                value={data.label || ''}
                onChange={handleNameChange}
                placeholder={config.label}
                className={cx('h-7 text-xs', 'bg-white/80')}
              />
            </>
          )}
        </div>

        {/* Description Field (not for start node) */}
        {nodeType !== 'start' && (
          <Section label="Description">
            <Input
              value={data.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Brief description of what this node does"
              className={cx('h-7 text-xs', 'bg-white/80')}
            />
          </Section>
        )}

        {/* Prompt Field (not for start node) */}
        {nodeType !== 'start' && (
          <Section label="Prompt">
            <ExpandableTextModal
              title="Edit Prompt"
              expandedContent={
                <TiptapEditor
                  content={data.prompt || ''}
                  onChange={handlePromptChange}
                />
              }
            >
              <div className={cx(hasPromptError && 'ring-1 ring-red-400 rounded-md')}>
                <TiptapEditor
                  content={data.prompt || ''}
                  onChange={handlePromptChange}
                />
              </div>
            </ExpandableTextModal>
          </Section>
        )}

        {/* Divider after prompt */}
        {nodeType !== 'start' && (
          <div className="border-t border-cream-300/50" />
        )}

        {/* Incoming Connections */}
        {nodeType !== 'start' && (
          <Section label="Incoming">
            <div className="flex flex-wrap gap-2 items-center">
              {incomingEdges.map((edge) => {
                const sourceBranchName = getBranchNameForNode(edge.source, edge.sourceHandle);
                return (
                  <div key={edge.id} className="flex items-center gap-1">
                    {sourceBranchName && (
                      <span className={cx('text-[10px] px-1.5 py-0.5 rounded', 'bg-amber-100 text-amber-700 font-medium')}>
                        {sourceBranchName}
                      </span>
                    )}
                    <NodeChip 
                      nodeId={edge.source} 
                      nodes={nodes} 
                      onDelete={() => onDeleteEdge(edge.id)}
                    />
                  </div>
                );
              })}
              {incomingEdges.length === 0 && !showIncomingAdd && (
                <span className="text-xs text-charcoal-400">None</span>
              )}
              {showIncomingAdd && (
                <AddLink 
                  onSelect={handleAddIncoming} 
                  options={sourceOptions}
                  placeholder="Add"
                />
              )}
            </div>
          </Section>
        )}

        {/* Outgoing Connections */}
        <Section label="Outgoing">
          {nodeType === 'condition' ? (
            <div className="space-y-2">
              {(data.branches || ['Yes', 'No']).map((branchName, index) => {
                const handleId = `branch-${index}`;
                const edge = outgoingEdges.find((e) => e.sourceHandle === handleId);
                const isAvailable = availableBranches.some((b) => b.handleId === handleId);
                const canDelete = (data.branches?.length || 2) > 2;
                
                return (
                  <div key={handleId} className="flex items-center gap-2">
                    <Input
                      value={branchName}
                      onChange={(e) => handleBranchChange(index, e.target.value)}
                      className={cx('h-6 text-[11px] w-24 shrink-0', 'bg-amber-50 border-amber-200')}
                    />
                    <span className="text-charcoal-400 text-xs">→</span>
                    {edge ? (
                      <NodeChip 
                        nodeId={edge.target} 
                        nodes={nodes} 
                        onDelete={() => onDeleteEdge(edge.id)}
                      />
                    ) : isAvailable && availableTargets.length > 0 ? (
                      <AddLink
                        onSelect={(targetId) => handleAddOutgoing(targetId, handleId)}
                        options={targetOptions}
                        placeholder="Add"
                      />
                    ) : (
                      <span className="text-xs text-charcoal-400">—</span>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleRemoveBranch(index)}
                        className={cx(
                          'p-0.5 rounded ml-auto',
                          'text-charcoal-300 hover:text-red-500',
                          'transition-colors'
                        )}
                        title="Remove branch"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                onClick={handleAddBranch}
                className={cx(
                  'inline-flex items-center gap-0.5',
                  'text-xs text-charcoal-400 hover:text-charcoal-600',
                  'transition-colors'
                )}
              >
                <Plus className="w-3 h-3" />
                Add Branch
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {outgoingEdges.map((edge) => (
                <NodeChip 
                  key={edge.id}
                  nodeId={edge.target} 
                  nodes={nodes} 
                  onDelete={() => onDeleteEdge(edge.id)}
                />
              ))}
              {outgoingEdges.length === 0 && !canAddOutgoing && (
                <span className="text-xs text-charcoal-400">None</span>
              )}
              {canAddOutgoing && (
                <AddLink
                  onSelect={(targetId) => handleAddOutgoing(targetId)}
                  options={targetOptions}
                  placeholder="Add"
                />
              )}
            </div>
          )}
        </Section>
      </div>
    </div>
    </>
  );
}
