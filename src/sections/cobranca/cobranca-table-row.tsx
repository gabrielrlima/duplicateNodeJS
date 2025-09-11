import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import type { ICobranca } from './types';

// ----------------------------------------------------------------------

type Props = {
  row: ICobranca;
  onViewRow: () => void;
  onDeleteRow: () => void;
};

export function CobrancaTableRow({ row, onViewRow, onDeleteRow }: Props) {
  const { cliente, produto, valor, vencimento, status, recebimentos } = row;

  const parcelasPagas = recebimentos.filter((r) => r.status === 'Pago').length;
  const totalParcelas = recebimentos.length;

  const confirm = useBoolean();

  const popover = usePopover();

  const renderStatus = (
    <Label
      variant="soft"
      color={
        (status === 'Pago' && 'success') ||
        (status === 'Pendente' && 'warning') ||
        (status === 'Vencido' && 'error') ||
        'default'
      }
    >
      {status}
    </Label>
  );

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{cliente}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{produto}</TableCell>

        <TableCell>R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>

        <TableCell>{new Date(vencimento).toLocaleDateString('pt-BR')}</TableCell>

        <TableCell>
          {parcelasPagas}/{totalParcelas}
        </TableCell>

        <TableCell>{renderStatus}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Ver Recebimentos
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Excluir
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Excluir"
        content="Tem certeza que deseja excluir esta cobrança?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Excluir
          </Button>
        }
      />
    </>
  );
}
