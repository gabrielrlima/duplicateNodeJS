import type { CardProps } from '@mui/material/Card';

import { sumBy } from 'es-toolkit';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent, fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import type { ICobranca } from './types';

type Props = CardProps & {
  cobrancas: ICobranca[];
};

export function CobrancaReceivablesSummary({ cobrancas, sx, ...other }: Props) {
  const totalCobrancas = cobrancas.length;
  const cobrancasPagas = cobrancas.filter((c) => c.status === 'Pago').length;
  const cobrancasPendentes = cobrancas.filter((c) => c.status === 'Pendente').length;
  const cobrancasVencidas = cobrancas.filter((c) => c.status === 'Vencido').length;

  const totalRecebimentos = sumBy(cobrancas, (cobranca) => cobranca.valor);
  const recebimentosPagos = sumBy(
    cobrancas.filter((c) => c.status === 'Pago'),
    (cobranca) => cobranca.valor
  );
  const recebimentosPendentes = sumBy(
    cobrancas.filter((c) => c.status === 'Pendente'),
    (cobranca) => cobranca.valor
  );
  const recebimentosVencidos = sumBy(
    cobrancas.filter((c) => c.status === 'Vencido'),
    (cobranca) => cobranca.valor
  );

  const recebimentoMedio = totalCobrancas > 0 ? totalRecebimentos / totalCobrancas : 0;
  const taxaRecebimento = totalCobrancas > 0 ? (cobrancasPagas / totalCobrancas) * 100 : 0;

  const summaryCards = [
    {
      title: 'Total a Receber',
      value: fCurrency(totalRecebimentos),
      icon: 'solar:dollar-minimalistic-bold-duotone',
      subtitle: `${fNumber(totalCobrancas)} cobranças`,
    },
    {
      title: 'Recebido',
      value: fCurrency(recebimentosPagos),
      icon: 'solar:check-circle-bold-duotone',
      subtitle: `${fNumber(cobrancasPagas)} cobranças pagas`,
    },
    {
      title: 'Pendente',
      value: fCurrency(recebimentosPendentes),
      icon: 'solar:clock-circle-bold-duotone',
      subtitle: `${fNumber(cobrancasPendentes)} cobranças pendentes`,
    },
    {
      title: 'Vencido',
      value: fCurrency(recebimentosVencidos),
      icon: 'solar:danger-circle-bold-duotone',
      subtitle: `${fNumber(cobrancasVencidas)} cobranças vencidas`,
    },
  ];

  return (
    <Stack spacing={3} sx={sx} {...other}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Resumo de Recebimentos
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Visão geral dos recebimentos e cobranças
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Ticket Médio
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>{fCurrency(recebimentoMedio)}</strong> por cobrança
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'success.main',
                }}
              >
                <Iconify icon="solar:percent-circle-bold-duotone" width={24} />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Taxa de Recebimento
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>{fPercent(taxaRecebimento)}</strong> das cobranças foram pagas
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'warning.main',
            }}
          >
            <Iconify icon="solar:crown-bold-duotone" width={24} />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Oportunidade de revenda
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>4</strong> imóveis estão com mais de 90 dias de atraso, indicando possível
              necessidade de revenda.
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}

export default CobrancaReceivablesSummary;
