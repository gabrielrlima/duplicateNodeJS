import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  value: string | number;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'grey';
  trend?: {
    value: number;
    label: string;
  };
};

export default function DashboardStatsCard({
  title,
  value,
  icon,
  color = 'primary',
  trend,
}: Props) {
  const theme = useTheme();

  const isPositiveTrend = trend && trend.value > 0;

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
              color: theme.palette.text.primary,
            }}
          >
            <Iconify icon={icon} width={24} />
          </Box>

          {trend && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify
                icon={isPositiveTrend ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
                sx={{
                  color: isPositiveTrend ? theme.palette.success.main : theme.palette.error.main,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                }}
              >
                {Math.abs(trend.value)}%
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack spacing={1}>
          <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {title}
          </Typography>
          {trend && (
            <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
              {trend.label}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
