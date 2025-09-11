import { useState } from 'react';
import { sumBy } from 'es-toolkit';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { Grid2 as Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useGrupo } from 'src/hooks/use-grupos';

import { fDate } from 'src/utils/format-time';
import { fNumber, fPercent, fCurrency } from 'src/utils/format-number';

import { _vendas } from 'src/_mock';
import { _userList } from 'src/_mock/_user';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { GrupoVendasTable } from '../grupo-vendas-table';
import { VendasAnalytic } from '../../vendas/vendas-analytic';
import { GrupoDetailsToolbar } from '../grupo-details-toolbar';

// ----------------------------------------------------------------------

export function GrupoDetailsView() {
  const router = useRouter();
  const { id } = useParams();
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [novaMeta, setNovaMeta] = useState('');
  const [openMembrosModal, setOpenMembrosModal] = useState(false);

  const [searchMembro, setSearchMembro] = useState('');
  const [pendingChanges, setPendingChanges] = useState<{
    toAdd: string[];
    toRemove: string[];
  }>({ toAdd: [], toRemove: [] });

  // Status options para o grupo
  const statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'suspenso', label: 'Suspenso' },
    { value: 'inativo', label: 'Inativo' },
  ];

  const handleChangeStatus = (newStatus: string) => {
    // Aqui você implementaria a lógica para alterar o status do grupo
    console.log('Alterando status para:', newStatus);
    toast.success(`Status alterado para ${newStatus}`);
  };

  // Busca o grupo pelos dados mock
  const { grupo, loading, error } = useGrupo(id as string);

  // Filtrar vendas do grupo (simulando vendas dos membros do grupo)
  const tableData = _vendas.filter((venda) => {
    // Simular que algumas vendas pertencem ao grupo
    // Em um cenário real, você teria uma relação entre vendas e grupos
    const vendasDoGrupo = ['1', '2', '3', '4', '5', '6', '7', '8'];
    return vendasDoGrupo.includes(venda.id);
  });

  const getVendasLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (venda) => venda.totalAmount
    );

  const getPercentByStatus = (status: string) =>
    tableData.length > 0 ? (getVendasLength(status) / tableData.length) * 100 : 0;

  // Filtrar usuários baseado na pesquisa
  const usuariosFiltrados = _userList.filter(
    (usuario) =>
      usuario.name.toLowerCase().includes(searchMembro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchMembro.toLowerCase())
  );

  // Simular membros atuais do grupo (baseado no leaderId e alguns membros fictícios)
  const membrosAtuais = _userList.filter(
    (user) => user.id === grupo.leaderId || ['1', '2', '3'].includes(user.id)
  );

  const handleOpenMembrosModal = () => {
    setOpenMembrosModal(true);
  };

  const handleCloseMembrosModal = () => {
    setOpenMembrosModal(false);
    setSearchMembro('');
    setPendingChanges({ toAdd: [], toRemove: [] });
  };

  const handleSelectMembro = (userId: string) => {
    const isCurrentMember = membrosAtuais.some((m) => m.id === userId);
    const isPendingAdd = pendingChanges.toAdd.includes(userId);
    const isPendingRemove = pendingChanges.toRemove.includes(userId);

    if (isCurrentMember) {
      if (isPendingRemove) {
        // Cancelar remoção
        setPendingChanges((prev) => ({
          ...prev,
          toRemove: prev.toRemove.filter((memberId) => memberId !== userId),
        }));
      } else {
        // Marcar para remoção
        setPendingChanges((prev) => ({
          ...prev,
          toRemove: [...prev.toRemove, userId],
        }));
      }
    } else {
      if (isPendingAdd) {
        // Cancelar adição
        setPendingChanges((prev) => ({
          ...prev,
          toAdd: prev.toAdd.filter((memberId) => memberId !== userId),
        }));
      } else {
        // Marcar para adição
        setPendingChanges((prev) => ({
          ...prev,
          toAdd: [...prev.toAdd, userId],
        }));
      }
    }
  };

  const handleConfirmMembrosChanges = () => {
    // Simular aplicação das mudanças
    const addedCount = pendingChanges.toAdd.length;
    const removedCount = pendingChanges.toRemove.length;

    if (addedCount > 0 && removedCount > 0) {
      toast.success(`${addedCount} membro(s) adicionado(s) e ${removedCount} removido(s)`);
    } else if (addedCount > 0) {
      toast.success(`${addedCount} membro(s) adicionado(s)`);
    } else if (removedCount > 0) {
      toast.success(`${removedCount} membro(s) removido(s)`);
    }

    handleCloseMembrosModal();
  };

  // Renderizar loading
  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardContent>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <DashboardContent>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Button
            variant="contained"
            onClick={() => router.push(paths.dashboard.grupos.list)}
            sx={{ mt: 2 }}
          >
            Voltar para lista
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  if (!grupo) {
    return (
      <DashboardContent>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6">Grupo não encontrado</Typography>
          <Button
            variant="contained"
            onClick={() => router.push(paths.dashboard.grupos.list)}
            sx={{ mt: 2 }}
          >
            Voltar para lista
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <GrupoDetailsToolbar
        status={grupo.status}
        backHref={paths.dashboard.grupos.list}
        grupoId={grupo.id}
        grupoName={grupo.name}
        createdAt={grupo.createdAt as string}
        statusOptions={statusOptions}
        onChangeStatus={handleChangeStatus}
        onManageMembers={handleOpenMembrosModal}
      />

      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={grupo.avatarUrl || undefined}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
            >
              {grupo.avatarUrl ? null : (
                <Iconify icon="solar:users-group-rounded-bold" width={60} />
              )}
            </Avatar>

            <Typography variant="h5" sx={{ mb: 1 }}>
              {grupo.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {grupo.description}
            </Typography>

            <Label
              variant="soft"
              color={
                (grupo.status === 'ativo' && 'success') ||
                (grupo.status === 'suspenso' && 'warning') ||
                (grupo.status === 'inativo' && 'error') ||
                'default'
              }
              sx={{ mb: 3 }}
            >
              {grupo.status === 'ativo' && 'Ativo'}
              {grupo.status === 'suspenso' && 'Suspenso'}
              {grupo.status === 'inativo' && 'Inativo'}
            </Label>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:user-bold" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">Líder: {grupo.leader}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="solar:users-group-rounded-bold"
                  sx={{ mr: 1, color: 'text.secondary' }}
                />
                <Typography variant="body2">{grupo.members} membros</Typography>
              </Box>
            </Stack>
          </Card>

          {/* Card de Taxa de Performance */}
          <Card
            sx={{
              p: 3,
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: 140,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Iconify
                icon="solar:chart-2-bold-duotone"
                width={28}
                sx={{ color: 'secondary.main' }}
              />
            </Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              {fPercent(grupo.performance)}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Performance Geral
            </Typography>
          </Card>
        </Grid>

        {/* Métricas de Performance */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Cards de Métricas */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Iconify
                      icon="solar:chart-square-bold-duotone"
                      width={24}
                      sx={{ color: 'primary.main', mr: 1 }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                    {fNumber(grupo.vendas)}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Vendas
                    <br />
                    Realizadas
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Iconify
                      icon="solar:dollar-minimalistic-bold-duotone"
                      width={24}
                      sx={{ color: 'success.main', mr: 1 }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.1rem' }}>
                    {fCurrency(grupo.comissaoTotal)}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Comissão
                    <br />
                    Total
                  </Typography>
                </Card>
              </Grid>

              {grupo.meta && (
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Iconify
                        icon="solar:target-bold-duotone"
                        width={24}
                        sx={{ color: 'warning.main', mr: 1 }}
                      />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                      {fNumber(grupo.meta)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Meta
                      <br />
                      Mensal
                    </Typography>
                  </Card>
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Iconify
                      icon="solar:pie-chart-2-bold-duotone"
                      width={24}
                      sx={{ color: 'info.main', mr: 1 }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                    {fPercent(grupo.performance)}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Performance
                    <br />
                    Total
                  </Typography>
                </Card>
              </Grid>
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
                    setNovaMeta(grupo.meta?.toString() || '');
                    setOpenModal(true);
                  }}
                >
                  {grupo.meta ? 'Editar Meta' : 'Definir Meta'}
                </Button>
              </Box>

              {grupo.meta && grupo.performance !== undefined ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Vendas: {grupo.vendas} / {grupo.meta}
                      </Typography>
                      <Typography variant="body2">{fPercent(grupo.performance)}</Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={grupo.performance}
                      color={
                        (grupo.performance >= 80 && 'success') ||
                        (grupo.performance >= 60 && 'warning') ||
                        'error'
                      }
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {grupo.performance >= 100
                      ? '🎉 Meta superada! Parabéns ao grupo!'
                      : grupo.performance >= 80
                        ? '🔥 Muito próximo da meta!'
                        : grupo.performance >= 60
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
                    Bem-vindo! 👋
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Para começar a acompanhar o progresso do grupo, é necessário definir uma meta de
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
                    Data de Criação
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {fDate(grupo.createdAt)}
                  </Typography>
                </Grid>

                {grupo.lastActivity && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Última Atividade
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {fDate(grupo.lastActivity)}
                    </Typography>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Tipo de Grupo
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {grupo.tipo}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Região de Atuação
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {grupo.regiao}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </Grid>

        {/* Métricas de Vendas por Status */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <Scrollbar sx={{ minHeight: 92 }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                <VendasAnalytic
                  title="Todos"
                  total={tableData.length}
                  percent={100}
                  price={sumBy(tableData, (venda) => venda.totalAmount)}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.vars.palette.info.main}
                />

                <VendasAnalytic
                  title="Atendimento"
                  total={getVendasLength('atendimento')}
                  percent={getPercentByStatus('atendimento')}
                  price={getTotalAmount('atendimento')}
                  icon="solar:user-speak-bold-duotone"
                  color={theme.vars.palette.warning.main}
                />

                <VendasAnalytic
                  title="Visita"
                  total={getVendasLength('visita')}
                  percent={getPercentByStatus('visita')}
                  price={getTotalAmount('visita')}
                  icon="solar:home-bold-duotone"
                  color={theme.vars.palette.info.main}
                />

                <VendasAnalytic
                  title="Interesse"
                  total={getVendasLength('interesse')}
                  percent={getPercentByStatus('interesse')}
                  price={getTotalAmount('interesse')}
                  icon="solar:heart-bold-duotone"
                  color={theme.vars.palette.primary.main}
                />

                <VendasAnalytic
                  title="Proposta"
                  total={getVendasLength('proposta')}
                  percent={getPercentByStatus('proposta')}
                  price={getTotalAmount('proposta')}
                  icon="solar:document-text-bold-duotone"
                  color={theme.vars.palette.secondary.main}
                />

                <VendasAnalytic
                  title="Pagamento"
                  total={getVendasLength('assinatura_pagamento')}
                  percent={getPercentByStatus('assinatura_pagamento')}
                  price={getTotalAmount('assinatura_pagamento')}
                  icon="solar:file-check-bold-duotone"
                  color={theme.vars.palette.success.main}
                />

                <VendasAnalytic
                  title="Cancelado"
                  total={getVendasLength('cancelado')}
                  percent={getPercentByStatus('cancelado')}
                  price={getTotalAmount('cancelado')}
                  icon="solar:close-circle-bold-duotone"
                  color={theme.vars.palette.error.main}
                />
              </Stack>
            </Scrollbar>
          </Card>
        </Grid>

        {/* Tabela de Vendas do Grupo */}
        <Grid size={{ xs: 12 }}>
          <GrupoVendasTable grupoId={grupo.id} />
        </Grid>
      </Grid>

      {/* Modal de Edição da Meta */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Meta do Grupo</DialogTitle>
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
              toast.success('Meta do grupo atualizada com sucesso!');
              setOpenModal(false);
            }}
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Gerenciar Membros */}
      <Dialog open={openMembrosModal} onClose={handleCloseMembrosModal} maxWidth="sm" fullWidth>
        <DialogTitle>Gerenciar Membros do Grupo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Pesquisar membro por nome..."
            value={searchMembro}
            onChange={(e) => setSearchMembro(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => {
                const isCurrentMember = membrosAtuais.some((m) => m.id === usuario.id);
                const isPendingAdd = pendingChanges.toAdd.includes(usuario.id);
                const isPendingRemove = pendingChanges.toRemove.includes(usuario.id);
                const isLeader = usuario.id === grupo.leaderId;

                let buttonText = 'Adicionar';
                let buttonColor: 'primary' | 'error' | 'success' = 'primary';
                let buttonIcon = 'mingcute:add-line';
                let statusText = '';

                if (isLeader) {
                  buttonText = 'Líder';
                  buttonColor = 'success';
                  buttonIcon = 'solar:crown-bold';
                  statusText = 'Líder do grupo';
                } else if (isPendingRemove) {
                  buttonText = 'Cancelar Remoção';
                  buttonColor = 'primary';
                  buttonIcon = 'eva:undo-fill';
                  statusText = 'Será removido';
                } else if (isPendingAdd) {
                  buttonText = 'Remover';
                  buttonColor = 'error';
                  buttonIcon = 'eva:close-fill';
                  statusText = 'Será adicionado';
                } else if (isCurrentMember) {
                  buttonText = 'Remover';
                  buttonColor = 'error';
                  buttonIcon = 'solar:trash-bin-trash-bold';
                  statusText = 'Membro atual';
                }

                return (
                  <ListItem
                    key={usuario.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: isPendingAdd
                        ? 'success.lighter'
                        : isPendingRemove
                          ? 'error.lighter'
                          : 'background.paper',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={usuario.avatarUrl}>
                        {usuario.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={usuario.name}
                      secondary={
                        statusText && (
                          <Typography
                            variant="caption"
                            color={
                              isPendingAdd
                                ? 'success.main'
                                : isPendingRemove
                                  ? 'error.main'
                                  : 'primary.main'
                            }
                          >
                            {statusText}
                          </Typography>
                        )
                      }
                    />

                    <Button
                      size="small"
                      variant="outlined"
                      color={buttonColor}
                      startIcon={<Iconify icon={buttonIcon} />}
                      onClick={() => handleSelectMembro(usuario.id)}
                      disabled={isLeader}
                    >
                      {buttonText}
                    </Button>
                  </ListItem>
                );
              })
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 3 }}
              >
                Nenhum usuário encontrado
              </Typography>
            )}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseMembrosModal} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmMembrosChanges}
            variant="contained"
            disabled={pendingChanges.toAdd.length === 0 && pendingChanges.toRemove.length === 0}
          >
            Confirmar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
