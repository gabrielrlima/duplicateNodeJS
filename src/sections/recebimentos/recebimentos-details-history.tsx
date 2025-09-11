import type { IRecebimentosHistory } from 'src/types/recebimentos';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Avatar from '@mui/material/Avatar';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  history?: IRecebimentosHistory[];
};

export function RecebimentosDetailsHistory({ history = [] }: Props) {
  const renderItem = (item: IRecebimentosHistory, index: number) => (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot
          color={
            (item.type === 'payment_received' && 'success') ||
            (item.type === 'payment_confirmed' && 'info') ||
            (item.type === 'payment_pending' && 'warning') ||
            (item.type === 'payment_overdue' && 'error') ||
            'primary'
          }
        />
        {index < history.length - 1 && <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              color: 'text.secondary',
              bgcolor: 'background.neutral',
            }}
          >
            {item.by?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{item.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.message}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {fDateTime(item.time)}
            </Typography>
          </Box>
        </Stack>
      </TimelineContent>
    </TimelineItem>
  );

  return (
    <>
      <CardHeader title="Histórico" />

      <Timeline
        sx={{
          p: 3,
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        {history.map(renderItem)}
      </Timeline>
    </>
  );
}
