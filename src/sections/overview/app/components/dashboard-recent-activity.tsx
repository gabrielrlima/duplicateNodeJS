import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ActivityItem = {
  id: string;
  type: 'property' | 'client' | 'sale' | 'lead';
  title: string;
  description: string;
  time: string;
  avatar?: string;
};

type Props = {
  title: string;
  activities: ActivityItem[];
};

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'property':
      return 'solar:home-bold-duotone';
    case 'client':
      return 'solar:user-bold-duotone';
    case 'sale':
      return 'solar:cart-check-bold-duotone';
    case 'lead':
      return 'solar:star-bold-duotone';
    default:
      return 'solar:bell-bold-duotone';
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'property':
      return 'info';
    case 'client':
      return 'success';
    case 'sale':
      return 'warning';
    case 'lead':
      return 'primary';
    default:
      return 'default';
  }
};

export default function DashboardRecentActivity({ title, activities }: Props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: 480,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Stack spacing={2}>
          {activities.map((activity) => {
            const color = getActivityColor(activity.type);
            const icon = getActivityIcon(activity.type);

            return (
              <Stack key={activity.id} direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor:
                      activity.type === 'lead' && theme.palette.mode === 'dark'
                        ? theme.palette.grey[700]
                        : alpha(theme.palette[color].main, 0.12),
                    color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette[color].main,
                  }}
                >
                  <Iconify icon={icon} width={20} />
                </Avatar>

                <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {activity.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {activity.description}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {activity.time}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        {activities.length === 0 && (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="solar:inbox-bold-duotone" width={48} sx={{ mb: 2 }} />
            <Typography variant="body2">Nenhuma atividade recente registrada</Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
