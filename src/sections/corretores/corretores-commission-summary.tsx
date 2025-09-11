import type { CardProps } from '@mui/material/Card';
import type { ICorretor } from 'src/types/corretor';

import { sumBy } from 'es-toolkit';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent, fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  corretores: ICorretor[];
};

export function CorretoresCommissionSummary({ corretores, sx, ...other }: Props) {
  // Cálculos das métricas
  const totalCorretores = corretores.length;
  const corretoresAtivos = corretores.filter((c) => c.status === 'ativo').length;
  const totalComissao = sumBy(corretores, (corretor) => corretor.comissaoTotal);
  const totalVendas = sumBy(corretores, (corretor) => corretor.vendas);
  const comissaoMedia = totalCorretores > 0 ? totalComissao / totalCorretores : 0;
  const vendasMedia = totalCorretores > 0 ? totalVendas / totalCorretores : 0;

  // Top performer
  const topPerformer = corretores.reduce(
    (prev, current) => (prev.comissaoTotal > current.comissaoTotal ? prev : current),
    corretores[0] || ({} as ICorretor)
  );

  const summaryCards = [
    {
      title: 'Comissão Total',
      value: fCurrency(totalComissao),
      icon: 'solar:dollar-minimalistic-bold-duotone',
      subtitle: `${fNumber(totalCorretores)} corretores`,
    },
    {
      title: 'Total de Vendas',
      value: fNumber(totalVendas),
      icon: 'solar:chart-square-bold-duotone',
      subtitle: `Média: ${fNumber(vendasMedia)} por corretor`,
    },
    {
      title: 'Comissão Média',
      value: fCurrency(comissaoMedia),
      icon: 'solar:pie-chart-2-bold-duotone',
      subtitle: 'Por corretor',
    },
    {
      title: 'Corretores Ativos',
      value: fNumber(corretoresAtivos),
      icon: 'solar:users-group-rounded-bold-duotone',
      subtitle: `${fPercent((corretoresAtivos / totalCorretores) * 100)} do total`,
    },
  ];

  return (
    <Stack spacing={3} sx={sx} {...other}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Resumo de Comissões
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Visão geral do desempenho da equipe de corretores
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {summaryCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  color: 'text.secondary',
                }}
              >
                <Iconify icon={card.icon} width={24} sx={{ mr: 1 }} />
              </Box>

              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {card.value}
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary' }}>
                {card.title}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {card.subtitle}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {topPerformer?.name && (
        <Card sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'warning.main',
              }}
            >
              <Iconify icon="solar:crown-star-bold-duotone" width={24} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                🏆 Top Performer
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>{topPerformer.name}</strong> • {fCurrency(topPerformer.comissaoTotal)} em
                comissões • {fNumber(topPerformer.vendas)} vendas
              </Typography>
            </Box>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
