import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import cx from 'classnames';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function InlineEdit({
  value,
  onSave,
  placeholder = 'Click to edit',
  className,
  inputClassName,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cx(
          'px-2 py-1 -mx-2 -my-1',
          'bg-white',
          'border-2 border-terracotta-400 rounded',
          'outline-none',
          'text-charcoal-800',
          inputClassName
        )}
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={cx(
        'px-2 py-1 -mx-2 -my-1',
        'rounded',
        'cursor-pointer',
        'hover:bg-cream-200',
        'transition-colors',
        className
      )}
      title="Double-click to edit"
    >
      {value || placeholder}
    </span>
  );
}
