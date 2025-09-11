import { useRef, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { useAuthJWT } from '../hooks/use-auth-jwt';
import { SANCTUM_TOKEN_KEY } from '../context/jwt/constant';
import { jwtDecode, isValidToken } from '../context/jwt/utils';

// ----------------------------------------------------------------------

type JWTAuthGuardProps = {
  children: React.ReactNode;
  roles?: string[]; // Roles permitidas para acessar a rota
  requireEmailVerified?: boolean; // Requer email verificado
};

export function JWTAuthGuard({ 
  children, 
  roles = [], 
  requireEmailVerified = false 
}: JWTAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading, user } = useAuthContext();
  const { refreshToken } = useAuthJWT();

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const hasRedirectedRef = useRef<boolean>(false);
  const refreshAttemptedRef = useRef<boolean>(false);
  const pathnameRef = useRef<string>(pathname);

  const createRedirectPath = useCallback((currentPath: string) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  }, [pathname]);

  // Verificar se o usuário tem as roles necessárias
  const hasRequiredRole = useCallback(() => {
    if (roles.length === 0) return true;
    if (!user?.role) return false;
    return roles.includes(user.role);
  }, [roles, user?.role]);

  // Verificar se o email foi verificado
  const hasVerifiedEmail = useCallback(() => {
    if (!requireEmailVerified) return true;
    return !!user?.email_verified_at;
  }, [requireEmailVerified, user?.email_verified_at]);

  // Verificar se o token está próximo do vencimento
  const isTokenExpiringSoon = useCallback(() => {
    const token = sessionStorage.getItem(SANCTUM_TOKEN_KEY);
    if (!token) return false;

    const tokenData = jwtDecode(token);
    if (!tokenData?.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = tokenData.exp - currentTime;
    
    // Retorna true se o token expira em menos de 5 minutos (300 segundos)
    return timeUntilExpiry < 300 && timeUntilExpiry > 0;
  }, []);

  // Tentar renovar token se necessário
  const attemptTokenRefresh = useCallback(async () => {
    if (refreshAttemptedRef.current || isRefreshing) return false;

    const token = sessionStorage.getItem(SANCTUM_TOKEN_KEY);
    if (!token || !isValidToken(token)) return false;

    if (isTokenExpiringSoon()) {
      try {
        setIsRefreshing(true);
        refreshAttemptedRef.current = true;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 JWT Guard: Renovando token que está expirando...');
        }

        await refreshToken();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ JWT Guard: Token renovado com sucesso');
        }
        
        return true;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ JWT Guard: Falha ao renovar token:', error);
        }
        return false;
      } finally {
        setIsRefreshing(false);
      }
    }

    return true;
  }, [isTokenExpiringSoon, refreshToken, isRefreshing]);

  const checkPermissions = useCallback(async (): Promise<void> => {
    if (loading || isRefreshing) {
      return;
    }

    // Se não está autenticado, redirecionar para login
    if (!authenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      const redirectPath = createRedirectPath(paths.auth.signIn);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔒 JWT Guard: Usuário não autenticado, redirecionando para login');
      }
      
      router.replace(redirectPath);
      return;
    }

    // Se está autenticado, fazer verificações adicionais
    if (authenticated && user) {
      // Tentar renovar token se necessário
      const tokenRefreshSuccess = await attemptTokenRefresh();
      
      if (!tokenRefreshSuccess && !isValidToken(sessionStorage.getItem(SANCTUM_TOKEN_KEY) || '')) {
        // Token inválido e não foi possível renovar
        hasRedirectedRef.current = true;
        const redirectPath = createRedirectPath(paths.auth.signIn);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔒 JWT Guard: Token inválido, redirecionando para login');
        }
        
        router.replace(redirectPath);
        return;
      }

      // Verificar roles
      if (!hasRequiredRole()) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🚫 JWT Guard: Usuário não tem permissão para acessar esta rota');
        }
        
        router.replace('/403'); // Página de acesso negado
        return;
      }

      // Verificar email verificado
      if (!hasVerifiedEmail()) {
        if (process.env.NODE_ENV === 'development') {
          console.log('📧 JWT Guard: Email não verificado, redirecionando para verificação');
        }
        
        router.replace('/auth/verify-email');
        return;
      }

      // Todas as verificações passaram
      setIsChecking(false);
    }
  }, [loading, authenticated, user, attemptTokenRefresh, hasRequiredRole, hasVerifiedEmail, router, isRefreshing, createRedirectPath]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Reset refs apenas quando a rota muda para uma rota diferente
  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname;
      hasRedirectedRef.current = false;
      refreshAttemptedRef.current = false;
      // Não resetar isChecking para evitar loops
    }
  }, [pathname]);

  // Show loading apenas durante verificações iniciais ou quando explicitamente necessário
  if (loading || isRefreshing) {
    return <SplashScreen />;
  }

  // Se ainda está verificando permissões
  if (isChecking && authenticated) {
    return <SplashScreen />;
  }

  // Renderizar children se todas as verificações passaram
  return <>{children}</>;
}