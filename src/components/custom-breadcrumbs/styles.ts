import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const BreadcrumbsRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const BreadcrumbsHeading = styled('h6')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
  padding: 0,
  display: 'inline-flex',
}));

export const BreadcrumbsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  position: 'sticky',
  top: 'var(--layout-header-mobile-height)',
  zIndex: theme.zIndex.appBar - 1,
  backgroundColor: theme.vars.palette.background.default,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.up('lg')]: {
    top: 'var(--layout-header-desktop-height)',
  },
}));

export const BreadcrumbsContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  gap: theme.spacing(2),
  flexDirection: 'column',
}));

export const BreadcrumbsSeparator = styled('span')(({ theme }) => ({
  width: 4,
  height: 4,
  borderRadius: '50%',
  backgroundColor: theme.vars.palette.text.disabled,
}));
