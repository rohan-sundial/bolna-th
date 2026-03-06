import { ReactNode } from 'react';
import type { ValidationError } from '@/lib/validation';
import { ValidationContext } from './validationContextDef';

interface ValidationProviderProps {
  children: ReactNode;
  errorsByNodeId: Map<string, ValidationError[]>;
  onNodeErrorClick?: (nodeId: string) => void;
}

export function ValidationProvider({
  children,
  errorsByNodeId,
  onNodeErrorClick,
}: ValidationProviderProps) {
  return (
    <ValidationContext.Provider value={{ errorsByNodeId, onNodeErrorClick }}>
      {children}
    </ValidationContext.Provider>
  );
}
