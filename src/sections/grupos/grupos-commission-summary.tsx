import type { IGrupo } from 'src/types/grupo';
import type { CardProps } from '@mui/material/Card';

import { sumBy } from 'es-toolkit';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fNumber, fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  grupos: IGrupo[];
};

export function GruposCommissionSummary({ grupos, sx, ...other }: Props) {
  // Cálculos das métricas
  const totalGrupos = grupos.length;
  const gruposAtivos = grupos.filter((g) => g.status === 'ativo').length;
  const totalComissao = sumBy(grupos, (grupo) => grupo.comissaoTotal);
  const totalVendas = sumBy(grupos, (grupo) => grupo.vendas);
  const totalMembros = sumBy(grupos, (grupo) => grupo.members);
  const comissaoMedia = totalGrupos > 0 ? totalComissao / totalGrupos : 0;
  const vendasMedia = totalGrupos > 0 ? totalVendas / totalGrupos : 0;

  // Top performer
  const topPerformer = grupos.reduce(
    (prev, current) => (prev.comissaoTotal > current.comissaoTotal ? prev : current),
    grupos[0] || ({} as IGrupo)
  );

  const summaryCards = [
    {
      title: 'Comissão Total',
      value: fCurrency(totalComissao),
      icon: 'solar:dollar-minimalistic-bold-duotone',
      subtitle: `${fNumber(totalGrupos)} grupos`,
    },
    {
      title: 'Total de Vendas',
      value: fNumber(totalVendas),
      icon: 'solar:chart-square-bold-duotone',
      subtitle: `Média: ${fNumber(vendasMedia)} por grupo`,
    },
    {
      title: 'Comissão Média',
      value: fCurrency(comissaoMedia),
      icon: 'solar:pie-chart-2-bold-duotone',
      subtitle: 'Por grupo',
    },
    {
      title: 'Total de Membros',
      value: fNumber(totalMembros),
      icon: 'solar:users-group-rounded-bold-duotone',
      subtitle: `${fNumber(gruposAtivos)} grupos ativos`,
    },
  ];

  return (
    <Stack spacing={3} sx={sx} {...other}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Resumo de Performance dos Grupos
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Visão geral do desempenho dos grupos de vendas
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
                🏆 Grupo Top Performer
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>{topPerformer.name}</strong> • {fCurrency(topPerformer.comissaoTotal)} em
                comissões • {fNumber(topPerformer.vendas)} vendas • {fNumber(topPerformer.members)}{' '}
                membros
              </Typography>
            </Box>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
