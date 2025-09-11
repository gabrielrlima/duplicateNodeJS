import type { ILeadItem } from 'src/types/lead';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { LeadQuickEditForm } from './lead-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: ILeadItem;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function LeadTableRow({ row, selected, editHref, onSelectRow, onDeleteRow }: Props) {
  const router = useRouter();
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const handleRowClick = () => {
    router.push(paths.dashboard.lead.details(row.id));
  };

  const renderQuickEditForm = () => (
    <LeadQuickEditForm
      currentLead={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          component={RouterLink}
          href={paths.dashboard.lead.details(row.id)}
          onClick={() => menuActions.onClose()}
        >
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Apagar
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Você tem certeza que deseja apagar este lead?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Apagar
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        onClick={handleRowClick}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell
          padding="checkbox"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
            inputProps={{
              id: `${row.id}-checkbox`,
              'aria-label': `${row.id} checkbox`,
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" sx={{ cursor: 'pointer' }}>
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.phoneNumber}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.productInterest}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.broker}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'ativo' && 'success') ||
              (row.status === 'convertido' && 'info') ||
              (row.status === 'perdido' && 'error') ||
              (row.status === 'desativados' && 'default') ||
              'default'
            }
          >
            {row.status === 'ativo' && 'Ativo'}
            {row.status === 'convertido' && 'Convertido'}
            {row.status === 'perdido' && 'Perdido'}
            {row.status === 'desativados' && 'Desativado'}
          </Label>
        </TableCell>

        <TableCell
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={(e) => {
                e.stopPropagation();
                menuActions.onOpen(e);
              }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
