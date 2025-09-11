import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

/** **************************************
 * Centered layout
 *************************************** */
const CenteredLayout = {
  SignInPage: lazy(() => import('src/pages/auth-demo/centered/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth-demo/centered/sign-up')),
  VerifyPage: lazy(() => import('src/pages/auth-demo/centered/verify')),
  ResetPasswordPage: lazy(() => import('src/pages/auth-demo/centered/reset-password')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth-demo/centered/update-password')),
};

/** **************************************
 * JWT layout
 *************************************** */
const JWTLayout = {
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
};

const auth = {
  path: '',
  element: (
    <AuthCenteredLayout>
      <Outlet />
    </AuthCenteredLayout>
  ),
  children: [
    { path: 'sign-in', element: <CenteredLayout.SignInPage /> },
    { path: 'sign-up', element: <JWTLayout.SignUpPage /> },
    { path: 'verify', element: <CenteredLayout.VerifyPage /> },
    { path: 'reset-password', element: <CenteredLayout.ResetPasswordPage /> },
    { path: 'update-password', element: <CenteredLayout.UpdatePasswordPage /> },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [auth],
  },
];
