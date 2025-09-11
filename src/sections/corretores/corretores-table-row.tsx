import type { ICorretor } from 'src/types/corretor';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: ICorretor;
  onDeleteRow: () => void;
  editHref: string;
  detailsHref: string;
};

export function CorretoresTableRow({ row, onDeleteRow, editHref, detailsHref }: Props) {
  const router = useRouter();
  const confirmDialog = useBoolean();
  const popover = usePopover();

  const handleRowClick = () => {
    router.push(detailsHref);
  };

  const renderPrimary = (
    <TableRow hover onClick={handleRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} sx={{ mr: 2, width: 40, height: 40 }}>
            {row.name
              .split(' ')
              .map((word) => word.charAt(0))
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </Avatar>

          <ListItemText
            primary={
              <Link color="inherit" sx={{ cursor: 'pointer' }}>
                {row.name}
              </Link>
            }
            secondary={
              <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
                {row.creci}
              </Box>
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
        <Box sx={{ typography: 'body2' }}>{row.email}</Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>{row.phone}</Box>
      </TableCell>

      <TableCell>
        {row.lastActivity ? (
          <Box>
            <Box sx={{ typography: 'body2' }}>{fDate(row.lastActivity)}</Box>
            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fTime(row.lastActivity)}
            </Box>
          </Box>
        ) : (
          <Box sx={{ typography: 'body2', color: 'text.disabled' }}>-</Box>
        )}
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ minWidth: 35, mr: 1 }}>
            <Box sx={{ typography: 'body2', fontWeight: 'bold' }}>{row.vendas}</Box>
            {row.meta && (
              <Box sx={{ typography: 'caption', color: 'text.disabled' }}>/{row.meta}</Box>
            )}
          </Box>
          {row.performance && (
            <Box sx={{ width: 60 }}>
              <LinearProgress
                variant="determinate"
                value={row.performance}
                color={
                  (row.performance >= 80 && 'success') ||
                  (row.performance >= 60 && 'warning') ||
                  'error'
                }
                sx={{ height: 6, borderRadius: 1 }}
              />
              <Box sx={{ typography: 'caption', textAlign: 'center', mt: 0.5 }}>
                {row.performance}%
              </Box>
            </Box>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'ativo' && 'success') ||
            (row.status === 'ferias' && 'warning') ||
            (row.status === 'inativo' && 'error') ||
            'default'
          }
        >
          {row.status === 'ativo' && 'Ativo'}
          {row.status === 'ferias' && 'Férias'}
          {row.status === 'inativo' && 'Inativo'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Ações" placement="top" arrow>
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={(e) => {
              e.stopPropagation();
              popover.onOpen(e);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(detailsHref);
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Visualizar
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(editHref);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirmDialog.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remover
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Remover corretor"
        content={`Tem certeza que deseja remover o corretor ${row.name}?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirmDialog.onFalse();
            }}
          >
            Remover
          </Button>
        }
      />
    </>
  );
}
