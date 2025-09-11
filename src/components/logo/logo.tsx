import type { LinkProps } from '@mui/material/Link';

import { forwardRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>((props, ref) => {
  const { className, href = '/', isSingle = true, disabled, sx, ...other } = props;
  const { authenticated } = useAuthContext();

  // Redirect to dashboard when authenticated, otherwise to landing page
  const redirectHref = authenticated ? paths.dashboard.root : href;

  const singleLogo = (
    <img
      src="/logo/logo-single.svg"
      alt="Logo"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );

  const fullLogo = (
    <img
      src="/logo/logo-full.svg"
      alt="Logo"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );

  return (
    <LogoRoot
      ref={ref}
      component={RouterLink}
      href={redirectHref}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          width: 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          ...(!isSingle && { width: 102, height: 36, minWidth: 102, minHeight: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
