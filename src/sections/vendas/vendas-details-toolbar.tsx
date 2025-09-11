import type { IDateValue } from 'src/types/common';

import { useState } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { CalendarForm } from '../calendar/calendar-form';

// ----------------------------------------------------------------------

type Props = {
  status?: string;
  backHref: string;
  orderNumber?: string;
  clientName?: string;
  createdAt?: IDateValue;
  onChangeStatus: (newValue: string) => void;
  statusOptions: { value: string; label: string }[];
  disableStatusMenu?: boolean;
  onScheduleVisit?: (date: Date) => void;
  onCancelVisit?: (isCancellation?: boolean) => void;
  onCompleteVisit?: () => void;
  visitaAgendada?: boolean;
  dataVisitaAgendada?: Date | null;
};

export function VendasDetailsToolbar({
  status,
  backHref,
  createdAt,
  orderNumber,
  clientName,
  statusOptions,
  onChangeStatus,
  disableStatusMenu = false,
  onScheduleVisit,
  onCancelVisit,
  onCompleteVisit,
  visitaAgendada = false,
  dataVisitaAgendada = null,
}: Props) {
  const theme = useTheme();
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const menuActions = usePopover();

  const handleOpenCalendarModal = () => {
    console.log('Botão clicado! visitaAgendada:', visitaAgendada);
    if (visitaAgendada) {
      // Se já tem visita agendada, cancela a visita
      console.log('Cancelando visita agendada');
      onCancelVisit?.();
    } else {
      // Se não tem visita agendada, abre o modal para agendar
      console.log('Abrindo modal de agendamento');
      setOpenCalendarModal(true);
    }
  };

  const handleCloseCalendarModal = () => {
    setOpenCalendarModal(false);
  };

  const handleVisitaAgendada = (date: Date) => {
    console.log('handleVisitaAgendada chamada - mudando estado para true');
    onScheduleVisit?.(date);
    setOpenCalendarModal(false);
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'top-right' } }}
    >
      <MenuList>
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            disabled={option.value === status}
            onClick={() => {
              if (option.value !== status) {
                menuActions.onClose();
                onChangeStatus(option.value);
              }
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          mb: { xs: 3, md: 5 },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ gap: 1, display: 'flex', alignItems: 'flex-start' }}>
          <IconButton component={RouterLink} href={backHref}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4">
                Atendimento #{orderNumber}
                {clientName ? ` - ${clientName}` : ''}
              </Typography>
              <Label
                variant="soft"
                color={
                  (status === 'atendimento' && 'warning') ||
                  (status === 'visita' && 'info') ||
                  (status === 'interesse' && 'primary') ||
                  (status === 'proposta' && 'secondary') ||
                  (status === 'assinatura_pagamento' && 'success') ||
                  (status === 'cancelado' && 'error') ||
                  'default'
                }
              >
                {status === 'atendimento' && 'Atendimento'}
                {status === 'visita' && 'Visita'}
                {status === 'interesse' && 'Interesse'}
                {status === 'proposta' && 'Proposta'}
                {status === 'assinatura_pagamento' && 'Pagamento'}
                {status === 'cancelado' && 'Cancelado'}
              </Label>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Última atualização {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            gap: 1.5,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {status === 'visita' && (
            <Button
              variant="contained"
              color={visitaAgendada ? 'error' : 'primary'}
              startIcon={<Iconify icon={visitaAgendada ? 'eva:close-fill' : 'eva:calendar-fill'} />}
              onClick={handleOpenCalendarModal}
              sx={{ mr: 1 }}
            >
              {visitaAgendada ? 'Cancelar visita agendada' : 'Agendar Visita'}
            </Button>
          )}

          {!disableStatusMenu && !visitaAgendada && (
            <Button
              color="inherit"
              variant="outlined"
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={menuActions.onOpen}
              sx={{ textTransform: 'capitalize' }}
            >
              {' '}
              {statusOptions.find((option) => option.value === status)?.label ||
                status ||
                'Status'}{' '}
            </Button>
          )}

          {visitaAgendada && status === 'visita' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
              onClick={() => {
                onChangeStatus('interesse');
                onCompleteVisit?.();
              }}
            >
              Concluir visita
            </Button>
          )}
        </Box>
      </Box>

      {renderMenuActions()}

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
          redirectToOrder
        />
      </Dialog>
    </>
  );
}
