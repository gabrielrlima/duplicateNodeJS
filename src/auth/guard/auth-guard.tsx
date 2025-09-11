import { useRef, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

const signInPaths = {
  jwt: paths.auth.signIn,
  auth0: paths.auth.signIn,
  amplify: paths.auth.signIn,
  firebase: paths.auth.signIn,
  supabase: paths.auth.signIn,
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const hasRedirectedRef = useRef<boolean>(false);

  const createRedirectPath = useCallback((currentPath: string) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  }, [pathname]);

  useEffect(() => {
    const checkPermissions = async (): Promise<void> => {
      if (loading) {
        return;
      }

      if (!authenticated) {
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          const { method } = CONFIG.auth;

          const signInPath = signInPaths[method];
          const redirectPath = createRedirectPath(signInPath);

          router.replace(redirectPath);
        }
        return;
      }

      setIsChecking(false);
    };

    checkPermissions();
  }, [authenticated, loading, router, pathname, createRedirectPath]);

  // Simplified loading state - show loading only during initial auth check
  if (loading) {
    return <SplashScreen />;
  }

  // Show loading only during permission checks for authenticated users
  if (isChecking && authenticated) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
