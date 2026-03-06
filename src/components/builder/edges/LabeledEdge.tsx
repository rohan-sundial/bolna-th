import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import cx from 'classnames';

export function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = (data as { label?: string })?.label || '';
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setEdges } = useReactFlow();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const saveLabel = () => {
    const trimmedValue = editValue.trim();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, label: trimmedValue || undefined } }
          : edge
      )
    );
    setIsEditing(false);
  };

  const handleBlur = () => {
    saveLabel();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveLabel();
    } else if (e.key === 'Escape') {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  const showLabel = label || isEditing;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 2 : 1.5,
        }}
        markerEnd={markerEnd}
      />
      {/* Invisible wider path for easier double-click to add label */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        onDoubleClick={handleDoubleClick}
        style={{ cursor: 'pointer' }}
      />
      {showLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={cx(
              'text-xs font-medium',
              'rounded',
              'shadow-sm',
              isEditing
                ? 'bg-white border-2 border-terracotta-400'
                : 'bg-cream-100 border border-cream-300'
            )}
            onDoubleClick={handleDoubleClick}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cx(
                  'w-20 px-2 py-0.5',
                  'text-xs font-medium',
                  'bg-transparent outline-none',
                  'text-charcoal-700'
                )}
                placeholder="Label"
              />
            ) : (
              <span className={cx('px-2 py-0.5 block', 'text-charcoal-600')}>
                {label}
              </span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
