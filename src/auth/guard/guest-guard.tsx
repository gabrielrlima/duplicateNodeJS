import { useRef, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, loading } = useAuthContext();
  const hasRedirectedRef = useRef<boolean>(false);

  const checkPermissions = (): void => {
    if (loading) {
      return;
    }

    if (authenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      
      // Verificar se há um returnTo na URL
      const returnTo = searchParams.get('returnTo');
      
      if (returnTo) {
        // Redirecionar para a página que o usuário tentou acessar
        router.replace(returnTo);
      } else {
        // Redirecionar para o dashboard padrão
        router.replace(paths.dashboard.root);
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('👤 Guest Guard: Usuário autenticado, redirecionando para dashboard');
      }
    }
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (loading) {
    return <SplashScreen />;
  }

  // Se foi redirecionado, mostrar loading
  if (hasRedirectedRef.current) {
    return <SplashScreen />;
  }

  // Se não está autenticado, renderizar children (páginas de login, registro, etc.)
  return <>{children}</>;
}