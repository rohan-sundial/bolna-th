/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from 'react';
import { IAuthState } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext<IAuthState | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): IAuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
