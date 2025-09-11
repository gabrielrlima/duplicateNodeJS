import type { IRecebimentosItem } from 'src/types/recebimentos';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IRecebimentosItem;
  selected: boolean;
  detailsHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function RecebimentosTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  detailsHref,
}: Props) {
  const confirmDialog = useBoolean();
  const menuActions = usePopover();
  const collapseRow = useBoolean();

  const renderPrimaryRow = () => (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ cursor: 'pointer' }} onClick={collapseRow.onToggle}>
          <Box sx={{ typography: 'body2', color: 'text.primary' }}>{row.receiptNumber}</Box>
        </Box>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={row.customer.name} src={row.customer.avatarUrl} />
          <Box>
            <Box sx={{ typography: 'subtitle2' }}>{row.customer.name}</Box>
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{row.customer.email}</Box>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.dueDate)}
          secondary={fTime(row.dueDate)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Box sx={{ typography: 'body2' }}>
          {row.installment}/{row.totalInstallments}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'subtitle2' }}>{fCurrency(row.amount)}</Box>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'paid' && 'success') ||
            (row.status === 'confirmed' && 'info') ||
            (row.status === 'pending' && 'warning') ||
            (row.status === 'overdue' && 'error') ||
            (row.status === 'cancelled' && 'default') ||
            'default'
          }
        >
          {row.status === 'paid' && 'Pago'}
          {row.status === 'confirmed' && 'Confirmado'}
          {row.status === 'pending' && 'Pendente'}
          {row.status === 'overdue' && 'Vencido'}
          {row.status === 'cancelled' && 'Cancelado'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapseRow.value ? 'inherit' : 'default'}
          onClick={collapseRow.onToggle}
          sx={{ ...(collapseRow.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={[
                (theme) => ({
                  p: theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }),
              ]}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ typography: 'subtitle2' }}>{row.description}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                  Imóvel: {row.property.name}
                </Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                  Endereço: {row.property.address}
                </Box>
                {row.payment && (
                  <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                    Método: {row.payment.method} - Ref: {row.payment.reference}
                  </Box>
                )}
              </Box>

              <Box sx={{ width: 110, textAlign: 'right' }}>
                <Button
                  component={RouterLink}
                  href={detailsHref}
                  color="inherit"
                  variant="outlined"
                  size="small"
                >
                  Ver detalhes
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}

      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            component={RouterLink}
            href={detailsHref}
            onClick={() => {
              menuActions.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Ver detalhes
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirmDialog.onTrue();
              menuActions.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Excluir
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Excluir recebimento"
        content="Tem certeza que deseja excluir este recebimento?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirmDialog.onFalse();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}
