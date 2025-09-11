import type { CardProps } from '@mui/material/Card';
import type { PaletteColorKey } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { fNumber, fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  icon: string;
  title: string;
  total: number;
  color?: PaletteColorKey;
  percent: number;
  price: number;
};

export function GruposAnalytic({
  icon,
  title,
  total,
  percent,
  price,
  color = 'primary',
  sx,
  ...other
}: Props) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        pl: 3,
        ...sx,
      }}
      {...other}
    >
      <Box>
        <Box sx={{ mb: 1, typography: 'h3' }}>{fNumber(total)}</Box>
        <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>{title}</Box>
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ typography: 'body2' }}>Comissão total:</Box>
          <Box sx={{ typography: 'subtitle2', color: `${color}.main` }}>{fCurrency(price)}</Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: 120,
          height: 120,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: `${color}.lighter`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Iconify icon={icon} width={32} sx={{ color: `${color}.main` }} />
      </Box>
    </Card>
  );
}
