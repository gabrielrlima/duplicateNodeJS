import { useMemo, createContext } from 'react';

import { useAuthState } from '../hooks/use-auth-state';

import type { AuthContextValue } from '../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { state, checkUserSession, updateUser } = useAuthState();

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      loading: state.loading,
      authenticated: !!state.user,
      unauthenticated: !state.user && !state.loading,
      checkUserSession,
      updateUser,
    }),
    [state.user, state.loading, checkUserSession, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
