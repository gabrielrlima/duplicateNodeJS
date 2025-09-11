import type { IVendas } from 'src/types/vendas';

import { useState } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IVendas;
  editHref: string;
  detailsHref: string;
  onDeleteRow: () => void;
};

export function VendasTableRow({ row, editHref, onDeleteRow, detailsHref }: Props) {
  const router = useRouter();
  const menuActions = usePopover();
  const [openModal, setOpenModal] = useState(false);

  const handleRowClick = (event: React.MouseEvent) => {
    // Evita navegação se o clique foi em um botão ou link
    if ((event.target as HTMLElement).closest('button, a')) {
      return;
    }
    router.push(detailsHref);
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={menuActions.onClose}>
            <Iconify icon="solar:eye-bold" />
            Ver
          </MenuItem>
        </li>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            setOpenModal(true);
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Desistiu
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const handleConfirmDesistir = () => {
    setOpenModal(false);
    onDeleteRow();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const renderConfirmDialog = () => (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar Desistência</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Tem certeza que deseja marcar este atendimento como desistente?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Atenção:</strong> Esta ação não poderá ser desfeita. O atendimento passará para o
          status &quot;Cancelado&quot; e não será mais possível alterar o status.
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
  );

  return (
    <>
      <TableRow hover onClick={handleRowClick} sx={{ cursor: 'pointer' }}>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.invoiceTo.name}>{row.invoiceTo.name.charAt(0).toUpperCase()}</Avatar>

            <ListItemText
              primary={row.invoiceTo.name}
              secondary={
                <Link component={RouterLink} href={detailsHref} color="inherit">
                  {row.invoiceNumber}
                </Link>
              }
              slotProps={{
                primary: { noWrap: true, sx: { typography: 'body2' } },
                secondary: {
                  sx: { color: 'text.disabled', '&:hover': { color: 'text.secondary' } },
                },
              }}
            />
          </Box>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.createDate)}
            secondary={fTime(row.createDate)}
            slotProps={{
              primary: { noWrap: true, sx: { typography: 'body2' } },
              secondary: { sx: { mt: 0.5, typography: 'caption' } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.dueDate)}
            secondary={fTime(row.dueDate)}
            slotProps={{
              primary: { noWrap: true, sx: { typography: 'body2' } },
              secondary: { sx: { mt: 0.5, typography: 'caption' } },
            }}
          />
        </TableCell>

        <TableCell>{fCurrency(row.totalAmount)}</TableCell>

        <TableCell align="center">{row.formData?.propertyName || '-'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'atendimento' && 'warning') ||
              (row.status === 'visita' && 'info') ||
              (row.status === 'interesse' && 'primary') ||
              (row.status === 'proposta' && 'secondary') ||
              (row.status === 'assinatura_pagamento' && 'success') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
