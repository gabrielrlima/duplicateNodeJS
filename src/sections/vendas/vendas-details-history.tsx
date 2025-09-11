import type { IVendas } from 'src/types/vendas';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  history?: IVendas['history'];
  visitaAgendada?: boolean;
  dataVisitaAgendada?: Date | string | number;
};

export function VendasDetailsHistory({ history, visitaAgendada, dataVisitaAgendada }: Props) {
  if (!history) {
    return (
      <Card>
        <CardHeader title="Histórico" />
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Histórico não disponível
          </Typography>
        </Box>
      </Card>
    );
  }

  const renderSummary = () =>
    visitaAgendada && dataVisitaAgendada ? (
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          gap: 2,
          minWidth: 260,
          flexShrink: 0,
          borderRadius: 2,
          display: 'flex',
          typography: 'body2',
          borderStyle: 'dashed',
          flexDirection: 'column',
        }}
      >
        <Stack spacing={0.5}>
          <Box sx={{ color: 'text.disabled' }}>Visita agendada para</Box>
          <Box sx={{ color: 'primary.main', fontWeight: 'medium' }}>
            {fDateTime(dataVisitaAgendada)}
          </Box>
        </Stack>
      </Paper>
    ) : null;

  // Mapeamento dos títulos para o novo formato
  const getFormattedTitle = (title: string) => {
    const titleMap: Record<string, string> = {
      'Atendimento criado': 'Atendimento iniciado',
      'Status alterado para Atendimento': 'Atendimento iniciado',
      'Status alterado para Visita': 'Agendamento de visita',
      'Visita agendada para': 'Agendamento de visita',
      'Visita concluída': 'Visita realizada',
      'Status alterado para Interesse': 'Interesse confirmado',
      'Status alterado para Proposta': 'Proposta enviada',
      'Status alterado para Assinatura/Pagamento': 'Assinatura/Pagamento em andamento',
      'Status alterado para Cancelado': 'Atendimento cancelado',
    };

    // Verifica se o título contém "Visita agendada para" (caso específico)
    if (title.includes('Visita agendada para')) {
      return 'Agendamento de visita';
    }

    return titleMap[title] || title;
  };

  const formatDateTime = (dateTime: any) => {
    const date = new Date(dateTime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  const renderTimeline = () => (
    <Timeline
      sx={{ p: 0, m: 0, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}
    >
      {history?.timeline?.map((item, index) => {
        const firstTime = index === 0;
        const lastTime = index === (history?.timeline?.length || 0) - 1;
        const formattedTitle = getFormattedTitle(item.title);
        const formattedDateTime = formatDateTime(item.time);

        return (
          <TimelineItem key={`${index}-${item.title}-${item.time}`}>
            <TimelineSeparator>
              <TimelineDot color={(firstTime && 'primary') || 'grey'} />
              {lastTime ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">
                {formattedTitle} — {formattedDateTime}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );

  return (
    <Card>
      <CardHeader title="Histórico" />
      <Box
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          alignItems: { md: 'flex-start' },
          flexDirection: { xs: 'column-reverse', md: 'row' },
        }}
      >
        {renderTimeline()}
        {renderSummary()}
      </Box>
    </Card>
  );
}
