import type { IGrupo } from 'src/types/grupo';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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


import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IGrupo;
  editHref: string;
  detailsHref: string;
};

export function GruposTableRow({ row, editHref, detailsHref }: Props) {
  const router = useRouter();

  const popover = usePopover();

  const handleRowClick = () => {
    router.push(detailsHref);
  };

  const renderPrimary = (
    <TableRow hover onClick={handleRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={row.name}
            src={row.avatarUrl || undefined}
            sx={{ mr: 2, width: 40, height: 40, bgcolor: 'primary.main' }}
          >
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
                {row.description}
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
        <Box sx={{ typography: 'body2' }}>{row.leader}</Box>
        <Box sx={{ typography: 'caption', color: 'text.disabled' }}>{row.regiao}</Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ typography: 'body2', fontWeight: 'bold' }}>{row.members}</Box>
        <Box sx={{ typography: 'caption', color: 'text.disabled' }}>membros</Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ minWidth: 35, mr: 1 }}>
            <Box sx={{ typography: 'body2', fontWeight: 'bold' }}>{row.vendas || 0}</Box>
            {row.meta && (
              <Box sx={{ typography: 'caption', color: 'text.disabled' }}>/{row.meta}</Box>
            )}
          </Box>
        </Box>
      </TableCell>

      <TableCell align="center">
        {row.performance && (
          <Box sx={{ width: 80 }}>
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
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'ativo' && 'success') ||
            (row.status === 'suspenso' && 'warning') ||
            (row.status === 'inativo' && 'error') ||
            'default'
          }
        >
          {row.status === 'ativo' && 'Ativo'}
          {row.status === 'suspenso' && 'Suspenso'}
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
        </MenuList>
      </CustomPopover>
    </>
  );
}
