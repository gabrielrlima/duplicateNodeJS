import type { Theme, SxProps } from '@mui/material/styles';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { usePopover } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ButtonBase from '@mui/material/ButtonBase';

import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { AddRealEstateDialog } from 'src/components/real-estate/add-real-estate-dialog';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
    plan: string;
  }[];
};

export function WorkspacesPopover({ sx, ...other }: Omit<WorkspacesPopoverProps, 'data'>) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();
  const { realEstates, currentRealEstate, setCurrentRealEstate, switchRealEstate } = useRealEstateContext();

  const [workspace, setWorkspace] = useState<any>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Atualizar workspace quando currentRealEstate mudar
  useEffect(() => {
    if (currentRealEstate) {
       setWorkspace({
         id: currentRealEstate.id,
         name: currentRealEstate.name,
         logo: currentRealEstate.logo || '/assets/icons/workspaces/logo-1.webp',
         plan: 'Pro'
       });
    } else if (realEstates.length > 0) {
      // Se não há imobiliária selecionada, selecionar a primeira
      setCurrentRealEstate(realEstates[0]);
    }
  }, [currentRealEstate, realEstates, setCurrentRealEstate]);

  const handleChangeWorkspace = useCallback(
    async (realEstate: any) => {
      // Só trocar se for uma imobiliária diferente da atual
      if (realEstate.id !== currentRealEstate?.id) {
        onClose();
        await switchRealEstate(realEstate);
      } else {
        onClose();
      }
    },
    [onClose, switchRealEstate, currentRealEstate]
  );

  const buttonBg: SxProps<Theme> = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderAddButton = () => (
    <ButtonBase
      onClick={() => setOpenAddDialog(true)}
      sx={[
        {
          py: 0.5,
          px: 1.5,
          gap: 0.5,
          borderRadius: 1,
          color: 'inherit',
          border: '1px solid',
          borderColor: 'inherit',
          bgcolor: 'transparent',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify icon="mingcute:add-line" sx={{ width: 16, height: 16 }} />
      <Box
        component="span"
        sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
      >
        Adicionar Imobiliária
      </Box>
    </ButtonBase>
  );

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt={workspace?.name}
        src={workspace?.logo}
        sx={{ width: 24, height: 24, borderRadius: '50%' }}
      />

      <Box
        component="span"
        sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
      >
        {workspace?.name}
      </Box>

      <Label
        color={workspace?.plan === 'Free' ? 'default' : 'info'}
        sx={{
          height: 22,
          cursor: 'inherit',
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {workspace?.plan}
      </Label>

      <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55 } },
      }}
    >
      <MenuList sx={{ width: 240 }}>
        {realEstates.map((realEstate) => {
          const workspaceData = {
            id: realEstate.id,
            name: realEstate.name,
            logo: realEstate.logo || '/assets/icons/workspaces/logo-1.webp',
            plan: 'Pro'
          };
          
          return (
            <MenuItem
              key={realEstate.id}
              selected={realEstate.id === workspace?.id}
              onClick={() => handleChangeWorkspace(realEstate)}
              sx={{ height: 48 }}
            >
              <Avatar alt={workspaceData.name} src={workspaceData.logo} sx={{ width: 24, height: 24 }} />

              <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
                {workspaceData.name}
              </Box>

              <Label color={workspaceData.plan === 'Free' ? 'default' : 'info'}>{workspaceData.plan}</Label>
            </MenuItem>
          );
        })}
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem
          onClick={() => {
            onClose();
            setOpenAddDialog(true);
          }}
          sx={{ 
            height: 48,
            color: 'inherit',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <Iconify icon="mingcute:add-line" sx={{ width: 24, height: 24, mr: 1 }} />
          
          <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
            Adicionar imobiliária
          </Box>
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {realEstates.length === 0 ? renderAddButton() : (
        <>
          {renderButton()}
          {renderMenuList()}
        </>
      )}
      
      <AddRealEstateDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </Box>
  );
}
