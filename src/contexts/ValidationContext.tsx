import { createContext, useContext, ReactNode } from 'react';
import type { ValidationError } from '@/lib/validation';

interface ValidationContextValue {
  errorsByNodeId: Map<string, ValidationError[]>;
  onNodeErrorClick?: (nodeId: string) => void;
}

const ValidationContext = createContext<ValidationContextValue>({
  errorsByNodeId: new Map(),
});

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

export function useValidationContext() {
  return useContext(ValidationContext);
}

export function useNodeErrors(nodeId: string): ValidationError[] {
  const { errorsByNodeId } = useValidationContext();
  return errorsByNodeId.get(nodeId) || [];
}
