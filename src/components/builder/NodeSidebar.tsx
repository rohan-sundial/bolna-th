import { useCallback, useMemo, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import cx from 'classnames';
import { X, Trash2, Play, Zap, GitBranch, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TiptapEditor } from '@/components/ui/TiptapEditor';
import { DeleteNodeDialog } from './DeleteNodeDialog';
import { useNodeErrors } from '@/contexts/ValidationContext';

interface NodeData {
  label?: string;
  description?: string;
  prompt?: string;
  branches?: string[];
}

interface EdgeData {
  label?: string;
}

const nodeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  start: { icon: Play, label: 'Start', color: 'text-green-600' },
  action: { icon: Zap, label: 'Action', color: 'text-clay-600' },
  condition: { icon: GitBranch, label: 'Condition', color: 'text-amber-600' },
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

  const hasDescriptionError = useMemo(
    () => errors.some((e) => e.field === 'description'),
    [errors]
  );
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

  // Available sources for incoming connections (nodes that can connect TO this node)
  const availableSources = useMemo(() => {
    return nodes.filter((n) => {
      if (n.id === node.id) return false;
      if (n.type === 'start') {
        // Start can connect if it doesn't already have an outgoing edge
        const hasOutgoing = edges.some((e) => e.source === n.id);
        return !hasOutgoing;
      }
      // For other nodes, check if they can still connect
      if (n.type === 'condition') {
        // Condition nodes can have multiple outputs
        const nodeData = n.data as NodeData;
        const branches = nodeData.branches || ['Yes', 'No'];
        const usedHandles = edges.filter((e) => e.source === n.id).map((e) => e.sourceHandle);
        return branches.some((_, i) => !usedHandles.includes(`branch-${i}`));
      } else {
        // Non-condition nodes can only have one outgoing
        const hasOutgoing = edges.some((e) => e.source === n.id);
        return !hasOutgoing;
      }
    });
  }, [nodes, edges, node.id]);

  // Available targets for outgoing connections
  const availableTargets = useMemo(() => {
    return nodes.filter((n) => {
      if (n.id === node.id) return false;
      if (n.type === 'start') return false;
      return true;
    });
  }, [nodes, node.id]);

  // For condition nodes, get available branches
  const availableBranches = useMemo(() => {
    if (nodeType !== 'condition') return [];
    const branches = data.branches || ['Yes', 'No'];
    const usedHandles = new Set(outgoingEdges.map((e) => e.sourceHandle));
    return branches
      .map((name, index) => ({ name, handleId: `branch-${index}` }))
      .filter((b) => !usedHandles.has(b.handleId));
  }, [nodeType, data.branches, outgoingEdges]);

  // Can add outgoing connection?
  const canAddOutgoing = useMemo(() => {
    if (nodeType === 'condition') {
      return availableBranches.length > 0 && availableTargets.length > 0;
    }
    return outgoingEdges.length === 0 && availableTargets.length > 0;
  }, [nodeType, availableBranches, availableTargets, outgoingEdges]);

  const handleAddIncoming = useCallback(
    (sourceId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceId);
      if (!sourceNode) return;

      let sourceHandle: string | undefined;
      if (sourceNode.type === 'condition') {
        // Find first available branch
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

  // Get branch name from sourceHandle for condition nodes
  const getBranchNameForNode = useCallback(
    (sourceNodeId: string, sourceHandle: string | null | undefined) => {
      if (!sourceHandle) return null;
      const match = sourceHandle.match(/^branch-(\d+)$/);
      if (!match) return null;
      const index = parseInt(match[1], 10);
      
      // Get the source node's branches
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode || sourceNode.type !== 'condition') return null;
      
      const sourceData = sourceNode.data as NodeData;
      const branches = sourceData.branches || ['Yes', 'No'];
      return branches[index] || null;
    },
    [nodes]
  );
  
  // Get branch name for current condition node's outgoing edges
  const getBranchName = useCallback(
    (sourceHandle: string | null | undefined) => {
      if (!sourceHandle) return null;
      const match = sourceHandle.match(/^branch-(\d+)$/);
      if (!match) return null;
      const index = parseInt(match[1], 10);
      const branches = data.branches || ['Yes', 'No'];
      return branches[index] || null;
    },
    [data.branches]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateData(node.id, { label: e.target.value });
    },
    [node.id, onUpdateData]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        'w-72',
        'bg-cream-200/90 backdrop-blur-sm',
        'rounded-xl',
        'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]',
        'border border-cream-300/50',
        'flex flex-col',
        'overflow-hidden'
      )}
    >
      {/* Header */}
      <div
        className={cx(
          'flex items-center gap-2 px-4 py-3',
          'border-b border-cream-300/50'
        )}
      >
        <Icon className={cx('w-4 h-4', config.color)} />
        <span className={cx('flex-1 text-sm font-medium', 'text-charcoal-700')}>
          {config.label}
        </span>
        <button
          onClick={handleDeleteClick}
          className={cx(
            'p-1.5 rounded-lg',
            'text-charcoal-400 hover:text-red-500',
            'hover:bg-cream-300/70',
            'transition-colors'
          )}
          title="Delete node"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className={cx(
            'p-1.5 rounded-lg',
            'text-charcoal-400 hover:text-charcoal-600',
            'hover:bg-cream-300/70',
            'transition-colors'
          )}
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className={cx('flex-1 overflow-y-auto', 'p-4 space-y-4')}>
        {/* ID Field */}
        <div className="space-y-1.5">
          <label className={cx('text-xs font-medium', 'text-charcoal-500')}>
            ID
          </label>
          <Input
            value={node.id}
            disabled
            className={cx(
              'text-xs font-mono',
              'bg-cream-100/50',
              'text-charcoal-400',
              'cursor-not-allowed'
            )}
          />
        </div>

        {/* Name Field (not for start node) */}
        {nodeType !== 'start' && (
          <div className="space-y-1.5">
            <label className={cx('text-xs font-medium', 'text-charcoal-500')}>
              Name
            </label>
            <Input
              value={data.label || ''}
              onChange={handleNameChange}
              placeholder={config.label}
              className={cx('text-sm', 'bg-white/80')}
            />
          </div>
        )}

        {/* Description Field (not for start node) */}
        {nodeType !== 'start' && (
          <div className="space-y-1.5">
            <label className={cx('text-xs font-medium', 'text-charcoal-500')}>
              Description
              <span className={cx('ml-1 text-red-500')}>*</span>
            </label>
            <textarea
              value={data.description || ''}
              onChange={handleDescriptionChange}
              rows={2}
              className={cx(
                'w-full px-3 py-2',
                'text-sm',
                'bg-white/80',
                'border rounded-md',
                hasDescriptionError ? 'border-red-400' : 'border-input',
                'focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent',
                'placeholder:text-charcoal-400',
                'resize-none'
              )}
            />
          </div>
        )}

        {/* Prompt Field (not for start node) */}
        {nodeType !== 'start' && (
          <div className="space-y-1.5">
            <label className={cx('text-xs font-medium', 'text-charcoal-500')}>
              Prompt
              <span className={cx('ml-1 text-red-500')}>*</span>
            </label>
            <div className={cx(hasPromptError && 'ring-1 ring-red-400 rounded-md')}>
              <TiptapEditor
                content={data.prompt || ''}
                onChange={handlePromptChange}
              />
            </div>
          </div>
        )}

        {/* Branches (Condition only) */}
        {nodeType === 'condition' && (
          <div className="space-y-1.5">
            <label className={cx('text-xs font-medium', 'text-charcoal-500')}>
              Branches
            </label>
            <div className="space-y-2">
              {(data.branches || ['Yes', 'No']).map((branch, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={branch}
                    onChange={(e) => handleBranchChange(index, e.target.value)}
                    className={cx('text-sm', 'bg-white/80', 'flex-1')}
                  />
                  {(data.branches?.length || 2) > 2 && (
                    <button
                      onClick={() => handleRemoveBranch(index)}
                      className={cx(
                        'p-1.5 rounded-lg',
                        'text-charcoal-400 hover:text-red-500',
                        'hover:bg-cream-300/70',
                        'transition-colors'
                      )}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddBranch}
                className={cx('w-full', 'text-xs')}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Branch
              </Button>
            </div>
          </div>
        )}

        {/* Incoming Connections */}
        {nodeType !== 'start' && (
          <div className="space-y-1.5">
            <label className={cx('text-xs font-medium', 'text-charcoal-500')}>
              Incoming Connections
            </label>
            <div className="space-y-2">
              {incomingEdges.map((edge) => {
                const sourceBranchName = getBranchNameForNode(edge.source, edge.sourceHandle);
                return (
                <div
                  key={edge.id}
                  className={cx(
                    'flex items-center gap-2 p-2',
                    'bg-white/60 rounded-lg',
                    'border border-cream-300/50'
                  )}
                >
                  <span className={cx('text-xs flex-1 truncate font-medium', 'text-charcoal-600')}>
                    {getNodeName(edge.source)}
                  </span>
                  {sourceBranchName && (
                    <span className={cx('text-xs px-1.5 py-0.5 rounded shrink-0', 'bg-amber-100 text-amber-700 font-medium')}>
                      {sourceBranchName}
                    </span>
                  )}
                  <span className={cx('text-xs text-charcoal-400')}>→</span>
                  {(edge.data as EdgeData)?.label && (
                    <span className={cx('text-xs px-1.5 py-0.5 rounded', 'bg-cream-300/70 text-charcoal-600')}>
                      {(edge.data as EdgeData).label}
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteEdge(edge.id)}
                    className={cx(
                      'p-1 rounded',
                      'text-charcoal-400 hover:text-red-500',
                      'hover:bg-cream-300/70',
                      'transition-colors'
                    )}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                );
              })}
              {/* Add incoming connection */}
              {availableSources.length > 0 && (
                <Select value="" onValueChange={handleAddIncoming}>
                  <SelectTrigger className={cx('h-8 text-xs', 'bg-white/60 border-dashed')}>
                    <SelectValue placeholder="+ Add incoming..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSources.map((n) => (
                      <SelectItem key={n.id} value={n.id} className="text-xs">
                        {getNodeName(n.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Outgoing Connections */}
        <div className="space-y-1.5">
          <label className={cx('text-xs font-medium', 'text-charcoal-500')}>
            Outgoing Connections
          </label>
          <div className="space-y-2">
            {outgoingEdges.map((edge) => {
              const branchName = nodeType === 'condition' ? getBranchName(edge.sourceHandle) : null;
              return (
                <div
                  key={edge.id}
                  className={cx(
                    'flex items-center gap-2 p-2',
                    'bg-white/60 rounded-lg',
                    'border border-cream-300/50'
                  )}
                >
                  {branchName && (
                    <span className={cx('text-xs px-1.5 py-0.5 rounded shrink-0', 'bg-amber-100 text-amber-700 font-medium')}>
                      {branchName}
                    </span>
                  )}
                  <span className={cx('text-xs text-charcoal-400')}>→</span>
                  <span className={cx('text-xs flex-1 truncate font-medium', 'text-charcoal-600')}>
                    {getNodeName(edge.target)}
                  </span>
                  {(edge.data as EdgeData)?.label && (
                    <span className={cx('text-xs px-1.5 py-0.5 rounded', 'bg-cream-300/70 text-charcoal-600')}>
                      {(edge.data as EdgeData).label}
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteEdge(edge.id)}
                    className={cx(
                      'p-1 rounded',
                      'text-charcoal-400 hover:text-red-500',
                      'hover:bg-cream-300/70',
                      'transition-colors'
                    )}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            {/* Add outgoing connection */}
            {canAddOutgoing && nodeType === 'condition' && (
              // Condition node: show branch-specific dropdowns
              availableBranches.map((branch) => (
                <Select
                  key={branch.handleId}
                  value=""
                  onValueChange={(targetId) => handleAddOutgoing(targetId, branch.handleId)}
                >
                  <SelectTrigger className={cx('h-8 text-xs', 'bg-white/60 border-dashed')}>
                    <SelectValue placeholder={`+ ${branch.name} →`} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTargets.map((n) => (
                      <SelectItem key={n.id} value={n.id} className="text-xs">
                        {getNodeName(n.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))
            )}
            {canAddOutgoing && nodeType !== 'condition' && (
              <Select value="" onValueChange={(targetId) => handleAddOutgoing(targetId)}>
                <SelectTrigger className={cx('h-8 text-xs', 'bg-white/60 border-dashed')}>
                  <SelectValue placeholder="+ Add outgoing..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTargets.map((n) => (
                    <SelectItem key={n.id} value={n.id} className="text-xs">
                      {getNodeName(n.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
