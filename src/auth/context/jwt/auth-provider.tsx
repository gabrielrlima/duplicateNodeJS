import { useSetState } from 'minimal-shared/hooks';
import { useRef, useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { AuthContext } from '../auth-context';
import { SANCTUM_TOKEN_KEY } from './constant';
import { setSession, isValidToken } from './utils';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });
  const isCheckingRef = useRef<boolean>(false);

  const checkUserSession = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (isCheckingRef.current) {
      console.log('🔄 AuthProvider - Verificação já em andamento, aguardando...');
      // Aguardar a verificação atual terminar
      while (isCheckingRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    isCheckingRef.current = true;

    try {
      const accessToken = sessionStorage.getItem(SANCTUM_TOKEN_KEY);

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 AuthProvider - Verificando sessão do usuário:', {
          hasToken: !!accessToken,
          tokenValid: accessToken ? isValidToken(accessToken) : false,
        });
      }

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // Busca os dados do usuário usando o token na rota get-me
        const res = await axios.get(endpoints.auth.me);

        if (process.env.NODE_ENV === 'development') {
          console.log('📡 AuthProvider - Estrutura completa da resposta:', JSON.stringify(res.data, null, 2));
        }

        // Corrigir estrutura da resposta: backend retorna { success: true, data: userData }
        const userData = res.data.data;

        if (process.env.NODE_ENV === 'development') {
          console.log('👤 AuthProvider - Dados do usuário do backend:', {
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            email: userData?.email,
            phone: userData?.phone,
            photoURL: userData?.photoURL,
            id: userData?.id,
            businessId: userData?.businessId
          });
        }

        const finalUserData = { ...userData, accessToken };

        // Forçar atualização do estado
        setState({ user: finalUserData, loading: false });

        // Aguardar um pouco para garantir que o estado foi atualizado
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ AuthProvider - Erro ao verificar sessão:', {
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }

      // Se o token for inválido, remove da sessão
      sessionStorage.removeItem(SANCTUM_TOKEN_KEY);
      delete axios.defaults.headers.common.Authorization;

      setState({ user: null, loading: false });
    } finally {
      isCheckingRef.current = false;
    }
  }, [setState]);

  useEffect(() => {
    // Only check session once on mount
    if (!isCheckingRef.current) {
      checkUserSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(() => {
    const user = state.user
      ? {
          ...state.user,
          role: state.user?.role ?? 'admin',
          // Mapear apenas firstName do backend para displayName do frontend
          displayName: state.user?.firstName || 'Usuário',
          // Mapear email do backend
          email: state.user?.email || '',
          // Mapear phone do backend para phoneNumber do frontend
          phoneNumber: state.user?.phone || '',
          // Mapear photoURL corretamente
          photoURL: state.user?.photoURL || null,
        }
      : null;

    if (process.env.NODE_ENV === 'development' && user) {
      console.log('🔄 AuthProvider - Mapeamento final dos dados do usuário:', {
        originalFirstName: state.user?.firstName,
        originalLastName: state.user?.lastName,
        originalEmail: state.user?.email,
        originalPhone: state.user?.phone,
        finalDisplayName: user.displayName,
        finalEmail: user.email,
        finalPhoneNumber: user.phoneNumber,
        finalPhotoURL: user.photoURL,
        timestamp: new Date().toISOString()
      });
    }

    return {
      user,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    };
  }, [checkUserSession, state.user, status]);

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
