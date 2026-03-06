import { useState, useEffect } from 'react';
import { IUser, IAuthState } from '../types/auth';

const MOCK_USER: IUser = {
  id: 'usr_1234567890',
  name: 'Rohan',
  email: 'rohan@example.com',
};

const SIMULATED_DELAY_MS = 2000;

export function useAuth(): IAuthState {
  const [state, setState] = useState<IAuthState>({
    user: null,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setState({
        user: MOCK_USER,
        isLoading: false,
        isError: false,
      });
    }, SIMULATED_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return state;
}
