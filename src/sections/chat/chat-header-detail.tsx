import type { IChatParticipant } from 'src/types/chat';

import { useState, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fToNow } from 'src/utils/format-time';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { ChatHeaderSkeleton } from './chat-skeleton';
import { CalendarForm } from '../calendar/calendar-form';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  participants: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  vendaStatus?: string;
  onStatusChange?: (newStatus: string) => void;
  onAddParticipant?: (participant: IChatParticipant) => void;
  onRemoveParticipant?: (participantId: string) => void;
};

export function ChatHeaderDetail({
  collapseNav,
  participants,
  loading,
  vendaStatus,
  onStatusChange,
  onAddParticipant,
  onRemoveParticipant,
}: Props) {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const menuActions = usePopover();
  const [openModal, setOpenModal] = useState(false);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [visitaAgendada, setVisitaAgendada] = useState(false);

  const [currentStatus, setCurrentStatus] = useState(vendaStatus || 'atendimento');
  const [botoesDesabilitados, setBotoesDesabilitados] = useState(false);
  const [openCorretorModal, setOpenCorretorModal] = useState(false);
  const [searchCorretor, setSearchCorretor] = useState('');
  const [pendingChanges, setPendingChanges] = useState<{
    toAdd: IChatParticipant[];
    toRemove: string[];
  }>({ toAdd: [], toRemove: [] });

  // Mock de corretores
  const mockCorretores = [
    {
      id: '1',
      name: 'Maria Santos',
      email: 'maria.santos@imobiliaria.com',
      phone: '+55 21 98888-5678',
    },
    {
      id: '2',
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@imobiliaria.com',
      phone: '+55 31 97777-9012',
    },
    {
      id: '3',
      name: 'Pedro Ferreira',
      email: 'pedro.ferreira@imobiliaria.com',
      phone: '+55 71 95555-7890',
    },
    { id: '4', name: 'Ana Costa', email: 'ana.costa@imobiliaria.com', phone: '+55 51 96666-3456' },
    {
      id: '5',
      name: 'João Silva',
      email: 'joao.silva@imobiliaria.com',
      phone: '+55 11 99999-1234',
    },
    {
      id: '6',
      name: 'Fernanda Lima',
      email: 'fernanda.lima@imobiliaria.com',
      phone: '+55 85 94444-5678',
    },
    {
      id: '7',
      name: 'Roberto Santos',
      email: 'roberto.santos@imobiliaria.com',
      phone: '+55 47 93333-9012',
    },
  ];

  // Filtrar corretores baseado na pesquisa
  const corretoresFiltrados = mockCorretores.filter(
    (corretor) =>
      corretor.name.toLowerCase().includes(searchCorretor.toLowerCase()) ||
      corretor.email.toLowerCase().includes(searchCorretor.toLowerCase())
  );

  const isGroup = participants.length > 1;

  const singleParticipant = participants[0];

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const handleDesistir = () => {
    menuActions.onClose();
    setOpenModal(true);
  };

  const handleConfirmDesistir = () => {
    setOpenModal(false);
    setCurrentStatus('cancelado');
    setBotoesDesabilitados(true);
    if (onStatusChange) {
      onStatusChange('cancelado');
    }
    console.log('Atendimento marcado como desistente');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenCalendarModal = () => {
    if (visitaAgendada) {
      // Se já tem visita agendada, abre modal de confirmação para cancelar
      setOpenCancelModal(true);
    } else {
      // Se não tem visita agendada, abre o modal para agendar
      setOpenCalendarModal(true);
    }
  };

  const handleConfirmCancelVisita = () => {
    setVisitaAgendada(false);
    setOpenCancelModal(false);
    console.log('Visita cancelada');
  };

  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
  };

  const handleCloseCalendarModal = () => {
    setOpenCalendarModal(false);
  };

  const handleVisitaAgendada = (date: Date) => {
    console.log('Visita agendada para:', date);
    setVisitaAgendada(true);
    setCurrentStatus('visita');
    setOpenCalendarModal(false);
    if (onStatusChange) {
      onStatusChange('visita');
    }
  };

  const handleConcluirVisita = () => {
    setVisitaAgendada(false);
    setCurrentStatus('interesse');
    if (onStatusChange) {
      onStatusChange('interesse');
    }
    console.log('Visita concluída');
  };

  const handleOpenCorretorModal = () => {
    menuActions.onClose();
    setOpenCorretorModal(true);
  };

  const handleCloseCorretorModal = () => {
    setOpenCorretorModal(false);
    setSearchCorretor('');
  };

  const handleConfirmChanges = () => {
    // Aplica todas as mudanças
    pendingChanges.toAdd.forEach((participant) => {
      if (onAddParticipant) {
        onAddParticipant(participant);
      }
    });

    pendingChanges.toRemove.forEach((participantId) => {
      if (onRemoveParticipant) {
        onRemoveParticipant(participantId);
      }
    });

    // Mostra mensagem de sucesso
    const addedCount = pendingChanges.toAdd.length;
    const removedCount = pendingChanges.toRemove.length;

    if (addedCount > 0 && removedCount > 0) {
      toast.success(`${addedCount} corretor(es) adicionado(s) e ${removedCount} removido(s)`);
    } else if (addedCount > 0) {
      toast.success(`${addedCount} corretor(es) adicionado(s)`);
    } else if (removedCount > 0) {
      toast.success(`${removedCount} corretor(es) removido(s)`);
    }

    // Limpa mudanças pendentes e fecha modal
    setPendingChanges({ toAdd: [], toRemove: [] });
    setOpenCorretorModal(false);
    setSearchCorretor('');
  };

  const handleCancelChanges = () => {
    // Limpa mudanças pendentes e fecha modal sem salvar
    setPendingChanges({ toAdd: [], toRemove: [] });
    setOpenCorretorModal(false);
    setSearchCorretor('');
  };

  const handleSelectCorretor = (corretor: any) => {
    // Verifica se o corretor já está na lista de participantes ou nas mudanças pendentes
    // Na renderização de cada corretor, modificar a lógica:
    const isAlreadyParticipant = participants.some((p) => p.email === corretor.email);
    const isPendingAdd = pendingChanges.toAdd.some((p) => p.email === corretor.email);

    if (isAlreadyParticipant || isPendingAdd) {
      return;
    }

    // Cria um novo participante baseado no corretor selecionado
    const newParticipant: IChatParticipant = {
      id: corretor.id,
      name: corretor.name,
      role: 'Corretor',
      email: corretor.email,
      address: 'Imobiliária',
      avatarUrl: '',
      phoneNumber: corretor.phone,
      lastActivity: new Date().toISOString(),
      status: 'online',
    };

    // Adiciona às mudanças pendentes
    setPendingChanges((prev) => ({
      ...prev,
      toAdd: [...prev.toAdd, newParticipant],
    }));
  };

  const handleRemoveCorretor = (corretor: any) => {
    const participant = participants.find((p) => p.email === corretor.email);
    const isPendingRemove = pendingChanges.toRemove.includes(participant?.id || '');

    if (participant && !isPendingRemove) {
      // Adiciona às remoções pendentes
      setPendingChanges((prev) => ({
        ...prev,
        toRemove: [...prev.toRemove, participant.id],
      }));

      toast.success(`${corretor.name} foi adicionado à lista de remoção`);
    }
  };

  const renderGroup = () => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <AvatarGroup max={3} sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}>
        {participants.map((participant) => {
          const nameParts = participant.name.split(' ');
          const initials =
            nameParts.length > 1
              ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
              : participant.name.charAt(0);

          return (
            <Avatar key={participant.id} alt={participant.name}>
              {initials.toUpperCase()}
            </Avatar>
          );
        })}
      </AvatarGroup>

      {currentStatus && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            Status da Venda
          </Typography>
          <Label
            variant="soft"
            color={
              (currentStatus === 'atendimento' && 'warning') ||
              (currentStatus === 'visita' && 'info') ||
              (currentStatus === 'interesse' && 'primary') ||
              (currentStatus === 'proposta' && 'secondary') ||
              (currentStatus === 'assinatura_pagamento' && 'success') ||
              (currentStatus === 'cancelado' && 'error') ||
              'default'
            }
          >
            {currentStatus === 'atendimento' && 'Atendimento'}
            {currentStatus === 'visita' && 'Visita'}
            {currentStatus === 'interesse' && 'Interesse'}
            {currentStatus === 'proposta' && 'Proposta'}
            {currentStatus === 'assinatura_pagamento' && 'Pagamento'}
            {currentStatus === 'cancelado' && 'Cancelado'}
          </Label>
        </Box>
      )}
    </Box>
  );

  const renderSingle = () => {
    const nameParts = singleParticipant?.name.split(' ') || [];
    const initials =
      nameParts.length > 1
        ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
        : singleParticipant?.name.charAt(0) || '';

    return (
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Badge variant={singleParticipant?.status} badgeContent="">
          <Avatar alt={singleParticipant?.name}>{initials.toUpperCase()}</Avatar>
        </Badge>

        <ListItemText
          primary={singleParticipant?.name}
          secondary={
            singleParticipant?.status === 'offline'
              ? fToNow(singleParticipant?.lastActivity)
              : singleParticipant?.status
          }
        />
      </Box>
    );
  };

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  // Verifica se já existe um corretor nos participantes
  const hasCorretor = participants.some(
    (participant) => participant.role === 'Corretor' || participant.role === 'Corretora'
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem onClick={handleOpenCorretorModal}>
          <Iconify icon={hasCorretor ? 'solar:pen-bold' : 'mingcute:add-line'} />
          {hasCorretor ? 'Gerenciar corretores' : 'Adicionar corretor'}
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDesistir} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Desistiu
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      {isGroup ? renderGroup() : renderSingle()}

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {visitaAgendada && (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
            onClick={handleConcluirVisita}
            disabled={botoesDesabilitados}
            sx={{ mr: 1 }}
          >
            Concluir visita
          </Button>
        )}

        <Button
          variant="contained"
          color={visitaAgendada ? 'error' : 'primary'}
          size="small"
          startIcon={
            <Iconify icon={visitaAgendada ? 'eva:close-fill' : 'solar:calendar-add-bold'} />
          }
          onClick={handleOpenCalendarModal}
          disabled={botoesDesabilitados}
          sx={{ mr: 1 }}
        >
          {visitaAgendada ? 'Cancelar visita' : 'Agendar visita'}
        </Button>

        <IconButton onClick={handleToggleNav}>
          <Iconify icon={!collapseDesktop ? 'ri:sidebar-unfold-fill' : 'ri:sidebar-fold-fill'} />
        </IconButton>

        <IconButton onClick={menuActions.onOpen} disabled={botoesDesabilitados}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Box>

      {renderMenuActions()}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Desistência</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tem certeza que deseja marcar este atendimento como desistente?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Atenção:</strong> Esta ação não poderá ser desfeita. O atendimento passará para
            o status &quot;Cancelado&quot; e não será mais possível alterar o status.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDesistir} color="error" variant="contained">
            Confirmar Desistência
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openCalendarModal}
        onClose={handleCloseCalendarModal}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            '& form': {
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            },
          },
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>Agendar Visita</DialogTitle>

        <CalendarForm
          colorOptions={CALENDAR_COLOR_OPTIONS}
          onClose={handleCloseCalendarModal}
          onSuccess={handleVisitaAgendada}
        />
      </Dialog>

      <Dialog open={openCancelModal} onClose={handleCloseCancelModal} maxWidth="sm" fullWidth>
        <DialogTitle>Cancelar Visita Agendada</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tem certeza que deseja cancelar a visita agendada?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Atenção:</strong> Esta ação não poderá ser desfeita e uma nova visita deverá ser
            registrada caso necessário.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelModal} color="inherit">
            Manter Visita
          </Button>
          <Button onClick={handleConfirmCancelVisita} color="error" variant="contained">
            Cancelar Visita
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Adicionar Corretor */}
      <Dialog open={openCorretorModal} onClose={handleCloseCorretorModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {hasCorretor
            ? 'Gerenciar corretores do atendimento'
            : 'Adicionar corretor ao atendimento'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Pesquisar corretor por nome ou email..."
            value={searchCorretor}
            onChange={(e) => setSearchCorretor(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {corretoresFiltrados.length > 0 ? (
              corretoresFiltrados.map((corretor) => {
                const isAlreadyParticipant = participants.some((p) => p.email === corretor.email);
                const isPendingAdd = pendingChanges.toAdd.some((p) => p.email === corretor.email);
                const isPendingRemove = pendingChanges.toRemove.includes(
                  participants.find((p) => p.email === corretor.email)?.id || ''
                );

                // Determinar o estado do corretor
                let buttonText = 'Adicionar';
                let buttonColor: 'primary' | 'error' | 'success' = 'primary';
                let buttonIcon = 'mingcute:add-line';
                let labelText = '';
                let labelColor: 'success' | 'warning' | 'error' = 'success';

                if (isPendingRemove) {
                  buttonText = 'Cancelar Remoção';
                  buttonColor = 'success';
                  buttonIcon = 'mingcute:refresh-2-line';
                  labelText = 'Será removido';
                  labelColor = 'error';
                } else if (isPendingAdd) {
                  buttonText = 'Cancelar';
                  buttonColor = 'error';
                  buttonIcon = 'mingcute:close-line';
                  labelText = 'Será adicionado';
                  labelColor = 'warning';
                } else if (isAlreadyParticipant) {
                  buttonText = 'Remover';
                  buttonColor = 'error';
                  buttonIcon = 'mingcute:delete-2-line';
                  labelText = 'Participando';
                  labelColor = 'success';
                }

                return (
                  <ListItem key={corretor.id} disablePadding>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 1 }}>
                      <Avatar
                        sx={{ mr: 2, bgcolor: isAlreadyParticipant ? 'grey.400' : 'primary.main' }}
                      >
                        {corretor.name
                          .split(' ')
                          .map((word) => word.charAt(0))
                          .slice(0, 2)
                          .join('')}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">{corretor.name}</Typography>
                          {labelText && <Label color={labelColor}>{labelText}</Label>}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {corretor.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {corretor.phone}
                        </Typography>
                      </Box>
                      <Button
                        variant={buttonColor === 'primary' ? 'contained' : 'outlined'}
                        color={buttonColor}
                        size="small"
                        onClick={() =>
                          buttonText === 'Remover' ||
                          buttonText === 'Cancelar' ||
                          buttonText === 'Cancelar Remoção'
                            ? handleRemoveCorretor(corretor)
                            : handleSelectCorretor(corretor)
                        }
                        startIcon={<Iconify icon={buttonIcon} />}
                      >
                        {buttonText}
                      </Button>
                    </Box>
                  </ListItem>
                );
              })
            ) : (
              <ListItem>
                <ListItemText
                  primary="Nenhum corretor encontrado"
                  secondary="Tente ajustar os termos da pesquisa"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelChanges} color="inherit">
            Cancelar
          </Button>
          {(pendingChanges.toAdd.length > 0 || pendingChanges.toRemove.length > 0) && (
            <Button onClick={handleConfirmChanges} color="primary" variant="contained">
              Confirmar ({pendingChanges.toAdd.length + pendingChanges.toRemove.length})
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
