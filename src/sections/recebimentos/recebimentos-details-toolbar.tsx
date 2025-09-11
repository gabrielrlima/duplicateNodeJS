import type { IDateValue } from 'src/types/common';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type Props = {
  status?: string;
  backHref: string;
  createdAt?: IDateValue;
  receiptNumber?: string;
  onChangeStatus?: (newValue: string) => void;
  statusOptions?: { value: string; label: string }[];
};

export function RecebimentosDetailsToolbar({
  status,
  backHref,
  createdAt,
  receiptNumber,
  onChangeStatus,
  statusOptions = [],
}: Props) {
  const menuActions = usePopover();

  return (
    <>
      <CustomBreadcrumbs
        heading={receiptNumber}
        links={[
          { name: 'Dashboard' },
          { name: 'Recebimentos', href: backHref },
          { name: receiptNumber },
        ]}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component={RouterLink}
              href={backHref}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Voltar
            </Button>

            <IconButton onClick={menuActions.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="h4"> Recebimento #{receiptNumber} </Typography>
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

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(event) => onChangeStatus?.(event.target.value)}
            sx={{ maxWidth: { sm: 240 } }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ typography: 'body2', color: 'text.disabled', flexShrink: 0 }}>
            {createdAt && fDate(createdAt)}
          </Box>
        </Stack>
      </Stack>

      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={menuActions.onClose}>
            <Iconify icon="solar:printer-minimalistic-bold" />
            Imprimir
          </MenuItem>

          <MenuItem onClick={menuActions.onClose}>
            <Iconify icon="solar:download-minimalistic-bold" />
            Download
          </MenuItem>

          <MenuItem onClick={menuActions.onClose} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Excluir
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
