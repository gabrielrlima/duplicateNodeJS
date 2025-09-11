import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export function SignUpTerms({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="span"
      sx={[
        () => ({
          mt: 3,
          display: 'block',
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {'Ao me inscrever, concordo com os '}
      <Link underline="always" color="text.primary">
        termos de uso
      </Link>
      {' e a '}
      <Link underline="always" color="text.primary">
        política de privacidade
      </Link>
      .
    </Box>
  );
}
