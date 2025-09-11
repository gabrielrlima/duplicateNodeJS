import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useCorretor } from 'src/hooks/use-corretores';

import { fDate } from 'src/utils/format-time';
import { fNumber, fPercent, fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { CorretorVendasTable } from '../corretor-vendas-table';
import { CorretorDetailsToolbar } from '../corretor-details-toolbar';

// ----------------------------------------------------------------------

export function CorretorDetailsView() {
  const router = useRouter();
  const { id } = useParams();

  const [openModal, setOpenModal] = useState(false);
  const [novaMeta, setNovaMeta] = useState('');

  // Status options para o corretor
  const statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'suspenso', label: 'Suspenso' },
    { value: 'inativo', label: 'Inativo' },
  ];

  const handleChangeStatus = (newStatus: string) => {
    // Aqui você implementaria a lógica para alterar o status do corretor
    console.log('Alterando status para:', newStatus);
    toast.success(`Status alterado para ${newStatus}`);
  };

  // Busca o corretor pela API
  const { corretor, loading, error } = useCorretor(id!);

  if (loading) {
    return (
      <DashboardContent>
        <EmptyContent
          title="Carregando corretor..."
          description="Aguarde enquanto buscamos os dados"
          sx={{ py: 10 }}
        />
      </DashboardContent>
    );
  }

  if (error || !corretor) {
    return (
      <DashboardContent>
        <EmptyContent
          filled
          title="Corretor não encontrado"
          description={error || "O corretor solicitado não foi encontrado"}
          action={
            <Button
              variant="contained"
              onClick={() => router.push(paths.dashboard.corretores.list)}
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
            >
              Voltar para lista
            </Button>
          }
          sx={{ py: 10 }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CorretorDetailsToolbar
        status={corretor.status}
        backHref={paths.dashboard.corretores.list}
        corretorId={corretor.id}
        corretorName={corretor.name}
        createdAt={corretor.createdAt as string}
        statusOptions={statusOptions}
        onChangeStatus={handleChangeStatus}
      />

      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              alt={corretor.name}
              src={corretor.avatarUrl}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {corretor.name
                .split(' ')
                .map((word) => word.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </Avatar>

            <Typography variant="h5" sx={{ mb: 1 }}>
              {corretor.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {corretor.especialidade || 'Corretor Imobiliário'}
            </Typography>

            <Label
              variant="soft"
              color={
                (corretor.status === 'ativo' && 'success') ||
                (corretor.status === 'ferias' && 'warning') ||
                (corretor.status === 'inativo' && 'error') ||
                'default'
              }
              sx={{ mb: 3 }}
            >
              {corretor.status === 'ativo' && 'Ativo'}
              {corretor.status === 'ferias' && 'Férias'}
              {corretor.status === 'inativo' && 'Inativo'}
            </Label>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:phone-bold" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{corretor.phone}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:letter-bold" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{corretor.email}</Typography>
              </Box>

              {corretor.creci && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="solar:document-text-bold"
                    sx={{ mr: 1, color: 'text.secondary' }}
                  />
                  <Typography variant="body2">{corretor.creci}</Typography>
                </Box>
              )}
            </Stack>
          </Card>

          {/* Card de Taxa de Conversão */}
          {corretor.leads && (
            <Card sx={{ p: 2.5, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Iconify
                  icon="solar:chart-2-bold-duotone"
                  width={24}
                  sx={{ color: 'secondary.main', mr: 1 }}
                />
              </Box>
              <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                {fPercent((corretor.vendas / corretor.leads) * 100)}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Taxa de Conversão
              </Typography>
            </Card>
          )}
        </Grid>

        {/* Métricas de Performance */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Cards de Métricas */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Iconify
                      icon="solar:chart-square-bold-duotone"
                      width={24}
                      sx={{ color: 'primary.main', mr: 1 }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                    {fNumber(corretor.vendas)}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Vendas
                    <br />
                    Realizadas
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Iconify
                      icon="solar:dollar-minimalistic-bold-duotone"
                      width={24}
                      sx={{ color: 'success.main', mr: 1 }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.1rem' }}>
                    {fCurrency(corretor.comissaoTotal)}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Comissão
                    <br />
                    Total
                  </Typography>
                </Card>
              </Grid>

              {corretor.meta && (
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Iconify
                        icon="solar:target-bold-duotone"
                        width={24}
                        sx={{ color: 'warning.main', mr: 1 }}
                      />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                      {fNumber(corretor.meta)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Meta
                      <br />
                      Mensal
                    </Typography>
                  </Card>
                </Grid>
              )}

              {corretor.performance && (
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Iconify
                        icon="solar:pie-chart-2-bold-duotone"
                        width={24}
                        sx={{ color: 'info.main', mr: 1 }}
                      />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                      {fPercent(corretor.performance)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Performance
                      <br />
                      Total
                    </Typography>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Gráfico de Performance */}
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6">Progresso da Meta</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Iconify icon="solar:pen-bold" />}
                  onClick={() => {
                    setNovaMeta(corretor.meta?.toString() || '');
                    setOpenModal(true);
                  }}
                >
                  {corretor.meta ? 'Editar Meta' : 'Definir Meta'}
                </Button>
              </Box>

              {corretor.meta && corretor.performance !== undefined ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Vendas: {corretor.vendas} / {corretor.meta}
                      </Typography>
                      <Typography variant="body2">{fPercent(corretor.performance)}</Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={corretor.performance}
                      color={
                        (corretor.performance >= 80 && 'success') ||
                        (corretor.performance >= 60 && 'warning') ||
                        'error'
                      }
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {corretor.performance >= 100
                      ? '🎉 Meta superada! Parabéns!'
                      : corretor.performance >= 80
                        ? '🔥 Muito próximo da meta!'
                        : corretor.performance >= 60
                          ? '⚡ No caminho certo!'
                          : '💪 Vamos acelerar!'}
                  </Typography>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Iconify
                    icon="solar:target-bold"
                    sx={{
                      width: 64,
                      height: 64,
                      color: 'primary.main',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
                    Bem-vindo(a)! 👋
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Para começar a acompanhar seu progresso, é necessário definir uma meta de
                    vendas.
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Clique no botão &quot;Definir Meta&quot; acima para começar!
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Informações Adicionais */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Informações Adicionais
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Data de Cadastro
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {fDate(corretor.createdAt)}
                  </Typography>
                </Grid>

                {corretor.lastActivity && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Última Atividade
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {fDate(corretor.lastActivity)}
                    </Typography>
                  </Grid>
                )}

                {corretor.especialidade && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Especialidade
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {corretor.especialidade}
                    </Typography>
                  </Grid>
                )}

                {corretor.grupo && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Grupo
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {corretor.grupo}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Stack>
        </Grid>

        {/* Tabela de Vendas do Corretor */}
        <Grid size={{ xs: 12 }}>
          <CorretorVendasTable corretorId={corretor.id} />
        </Grid>
      </Grid>

      {/* Modal de Edição da Meta */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Meta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nova Meta"
            type="number"
            fullWidth
            variant="outlined"
            value={novaMeta}
            onChange={(e) => setNovaMeta(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              // Aqui você pode implementar a lógica para salvar a nova meta
              console.log('Nova meta:', novaMeta);
              toast.success('Meta atualizada com sucesso!');
              setOpenModal(false);
            }}
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
