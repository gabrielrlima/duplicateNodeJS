'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { _recebimentos, RECEBIMENTOS_STATUS_OPTIONS } from 'src/_mock/_recebimentos';

import { Label } from 'src/components/label';

import { RecebimentosDetailsToolbar } from '../recebimentos-details-toolbar';
import { RecebimentosDetailsHistory } from '../recebimentos-details-history';
import { RecebimentosDetailsCustomer } from '../recebimentos-details-customer';
import { RecebimentosDetailsProperty } from '../recebimentos-details-property';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function RecebimentosDetailsView({ id }: Props) {
  const currentRecebimento = _recebimentos.find((recebimento) => recebimento.id === id);

  const [status, setStatus] = useState(currentRecebimento?.status);

  const [currentTab, setCurrentTab] = useState('details');

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderSummary = (
    <Grid size={{ xs: 12, md: 4 }}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Resumo</Typography>
            <Label
              variant="soft"
              color={
                (status === 'paid' && 'success') ||
                (status === 'confirmed' && 'info') ||
                (status === 'pending' && 'warning') ||
                (status === 'overdue' && 'error') ||
                (status === 'cancelled' && 'default') ||
                'default'
              }
            >
              {status === 'paid' && 'Pago'}
              {status === 'confirmed' && 'Confirmado'}
              {status === 'pending' && 'Pendente'}
              {status === 'overdue' && 'Vencido'}
              {status === 'cancelled' && 'Cancelado'}
            </Label>
          </Stack>

          <Stack spacing={1} sx={{ typography: 'body2' }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Número do Recibo:
              </Typography>
              <Typography variant="body2">{currentRecebimento?.receiptNumber}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Data de Vencimento:
              </Typography>
              <Typography variant="body2">{currentRecebimento?.dueDate}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Valor:
              </Typography>
              <Typography variant="body2">{currentRecebimento?.amount}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Método de Pagamento:
              </Typography>
              <Typography variant="body2">{currentRecebimento?.payment?.method}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );

  const renderDetails = (
    <Grid size={{ xs: 12, md: 8 }}>
      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.divider}`,
          }}
        >
          <Tab label="Detalhes" value="details" />
          <Tab label="Histórico" value="history" />
        </Tabs>

        {currentTab === 'details' && (
          <Stack spacing={3}>
            <RecebimentosDetailsCustomer customer={currentRecebimento?.customer} />
            <RecebimentosDetailsProperty property={currentRecebimento?.property} />
          </Stack>
        )}

        {currentTab === 'history' && (
          <RecebimentosDetailsHistory history={currentRecebimento?.history} />
        )}
      </Card>
    </Grid>
  );

  return (
    <DashboardContent>
      <Container maxWidth="lg">
        <RecebimentosDetailsToolbar
          backHref={paths.dashboard.recebimentos.root}
          receiptNumber={currentRecebimento?.receiptNumber}
          createdAt={currentRecebimento?.createdAt}
          status={status}
          onChangeStatus={handleChangeStatus}
          statusOptions={RECEBIMENTOS_STATUS_OPTIONS}
        />

        <Grid container spacing={3}>
          {renderSummary}
          {renderDetails}
        </Grid>
      </Container>
    </DashboardContent>
  );
}
