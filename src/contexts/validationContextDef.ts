import { createContext } from 'react';
import type { ValidationError } from '@/lib/validation';

export interface ValidationContextValue {
  errorsByNodeId: Map<string, ValidationError[]>;
  onNodeErrorClick?: (nodeId: string) => void;
}

export const ValidationContext = createContext<ValidationContextValue>({
  errorsByNodeId: new Map(),
});
