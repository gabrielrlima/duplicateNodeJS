import type { LinkProps } from '@mui/material/Link';

import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type BackLinkProps = LinkProps & {
  label?: string;
};

export function BackLink({ sx, label, ...other }: BackLinkProps) {
  return (
    <Link
      component={RouterLink}
      color="inherit"
      underline="none"
      sx={[
        (theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconButton
        sx={{
          bgcolor: 'action.hover',
          '&:hover': {
            bgcolor: 'action.selected',
          },
        }}
      >
        <Iconify icon="eva:arrow-back-fill" />
      </IconButton>
      {label}
    </Link>
  );
}
