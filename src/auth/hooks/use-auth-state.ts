import { useState, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { SANCTUM_TOKEN_KEY } from 'src/auth/context/jwt/constant';
import { jwtDecode, setSession, isValidToken } from 'src/auth/context/jwt/utils';

import type { AuthState } from '../types';

// ----------------------------------------------------------------------

export function useAuthState() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  // Verificar sessão do usuário
  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(SANCTUM_TOKEN_KEY);

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Verificando sessão JWT:', {
          hasToken: !!accessToken,
          tokenValid: accessToken ? isValidToken(accessToken) : false,
        });
      }

      if (accessToken && isValidToken(accessToken)) {
        // Configurar token no axios
        await setSession(accessToken);

        // Buscar dados atualizados do usuário
        const response = await axios.get(endpoints.auth.me);
        const userData = response.data;

        if (process.env.NODE_ENV === 'development') {
          console.log('👤 Dados do usuário JWT:', {
            displayName: userData?.displayName,
            email: userData?.email,
            role: userData?.role,
          });
        }

        // Decodificar token para obter informações adicionais
        const tokenData = jwtDecode(accessToken);
        
        const finalUserData = {
          ...userData,
          accessToken,
          tokenExp: tokenData?.exp,
          tokenIat: tokenData?.iat,
        };

        setState({ user: finalUserData, loading: false });
      } else {
        // Token inválido ou não existe
        await setSession(null);
        setState({ user: null, loading: false });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Erro ao verificar sessão JWT:', error);
      }

      // Em caso de erro, limpar sessão
      await setSession(null);
      setState({ user: null, loading: false });
    }
  }, []);

  // Atualizar dados do usuário
  const updateUser = useCallback((userData: any) => {
    setState(prev => ({
      ...prev,
      user: userData ? { ...prev.user, ...userData } : null,
    }));
  }, []);

  // Limpar estado de autenticação
  const clearAuth = useCallback(async () => {
    await setSession(null);
    setState({ user: null, loading: false });
  }, []);

  // Verificar se o token está próximo do vencimento (5 minutos)
  const isTokenExpiringSoon = useCallback(() => {
    if (!state.user?.tokenExp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = state.user.tokenExp - currentTime;
    
    // Retorna true se o token expira em menos de 5 minutos (300 segundos)
    return timeUntilExpiry < 300;
  }, [state.user?.tokenExp]);

  // Verificar se o token expirou
  const isTokenExpired = useCallback(() => {
    if (!state.user?.tokenExp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return state.user.tokenExp < currentTime;
  }, [state.user?.tokenExp]);

  // Efeito para verificar sessão na inicialização
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  // Removido o setInterval que causava recarregamentos automáticos
  // O sistema principal de autenticação no jwt/auth-provider.tsx já gerencia a sessão

  return {
    state,
    checkUserSession,
    updateUser,
    clearAuth,
    isTokenExpiringSoon,
    isTokenExpired,
    // Estados derivados
    authenticated: !!state.user,
    unauthenticated: !state.user && !state.loading,
  };
}