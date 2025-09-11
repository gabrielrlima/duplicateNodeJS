import type { IDateValue } from 'src/types/common';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  status?: string;
  backHref: string;
  terrenoId: string;
  terrenoCode?: string;
  createdAt?: IDateValue;
  onChangeStatus: (newValue: string) => void;
  statusOptions: { value: string; label: string }[];
};

export function TerrenoDetailsToolbar({
  status,
  backHref,
  terrenoId,
  createdAt,
  terrenoCode,
  statusOptions,
  onChangeStatus,
}: Props) {
  const menuActions = usePopover();

  const renderMenuActions = () => {
    // Mapeamento reverso: inglês para português
    const reverseStatusMap: { [key: string]: string } = {
      'available': 'disponivel',
      'reserved': 'reservado',
      'sold': 'vendido',
      'inactive': 'suspenso'
    };
    
    const currentStatusInPortuguese = reverseStatusMap[status || ''] || status;
    
    return (
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {statusOptions.map((option) => {
            const isCurrentStatus = option.value === currentStatusInPortuguese;
            return (
              <MenuItem
                key={option.value}
                selected={isCurrentStatus}
                disabled={isCurrentStatus}
                onClick={isCurrentStatus ? undefined : () => {
                  menuActions.onClose();
                  onChangeStatus(option.value);
                }}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </MenuList>
      </CustomPopover>
    );
  };

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
              <Typography variant="h4"> Terreno {terrenoCode} </Typography>
              <Label
                variant="soft"
                color={
                  (status === 'available' && 'success') ||
                  (status === 'reserved' && 'warning') ||
                  (status === 'sold' && 'info') ||
                  (status === 'inactive' && 'error') ||
                  'default'
                }
              >
                {status === 'available' ? 'Disponível' :
                 status === 'reserved' ? 'Reservado' :
                 status === 'sold' ? 'Vendido' :
                 status === 'inactive' ? 'Inativo' :
                 status}
              </Label>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
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
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={menuActions.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {status === 'available' ? 'Disponível' :
             status === 'reserved' ? 'Reservado' :
             status === 'sold' ? 'Vendido' :
             status === 'inactive' ? 'Inativo' :
             status}
          </Button>

          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            component={RouterLink}
            href={paths.dashboard.terrenos.edit(terrenoId)}
          >
            Editar
          </Button>
        </Box>
      </Box>

      {renderMenuActions()}
    </>
  );
}
