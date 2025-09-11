import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  total: number;
  unit?: string;
  icon: ReactNode;
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export function AnalyticsWidget({ title, total, unit, icon, color = 'primary' }: Props) {
  const formattedValue = unit === '%' ? fPercent(total) : fNumber(total);

  return (
    <Card
      sx={{
        p: 3,
        height: 160,
        border: '1px solid',
        borderColor: 'grey.200',
        bgcolor: 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderColor: 'grey.300',
        },
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ color: 'grey.700', '& svg': { width: 24, height: 24 } }}>{icon}</Box>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 600, mb: 0.5 }}>
            {formattedValue}
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
