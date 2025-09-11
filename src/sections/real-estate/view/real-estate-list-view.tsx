import type { RealEstate } from 'src/hooks/use-real-estate';

import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useRealEstate } from 'src/hooks/use-real-estate';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AddRealEstateDialog } from 'src/components/real-estate/add-real-estate-dialog';



// ----------------------------------------------------------------------

export function RealEstateListView() {
  const router = useRouter();
  const { realEstates, deleteRealEstate, fetchRealEstates } = useRealEstate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [realEstateToDelete, setRealEstateToDelete] = useState<RealEstate | null>(null);

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>, realEstateId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setOpenMenuId(realEstateId);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuAnchorEl(null);
    setOpenMenuId(null);
  }, []);

  const handleEditClick = useCallback((realEstate: RealEstate) => {
    setSelectedRealEstate(realEstate);
    setEditDialogOpen(true);
    handleCloseMenu();
  }, [handleCloseMenu]);

  const handleEditDialogClose = useCallback(async () => {
    setEditDialogOpen(false);
    setSelectedRealEstate(null);
    // Recarrega a lista para refletir as alterações
    await fetchRealEstates();
  }, [fetchRealEstates]);

  const handleDeleteClick = useCallback((realEstate: RealEstate) => {
    setRealEstateToDelete(realEstate);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  }, [handleCloseMenu]);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setRealEstateToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!realEstateToDelete) return;

    try {
      await deleteRealEstate(realEstateToDelete.id);
      toast.success('Imobiliária excluída com sucesso!');
      handleDeleteDialogClose();
    } catch (error) {
      toast.error('Erro ao excluir imobiliária');
      console.error('Erro ao excluir imobiliária:', error);
    }
  }, [realEstateToDelete, deleteRealEstate, handleDeleteDialogClose]);

  const renderRealEstateCard = useCallback((realEstate: RealEstate) => {

    const renderMenuActions = () => (
      <CustomPopover
        open={openMenuId === realEstate.id}
        anchorEl={menuAnchorEl}
        onClose={handleCloseMenu}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => handleEditClick(realEstate)}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem onClick={() => handleDeleteClick(realEstate)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Excluir
          </MenuItem>
        </MenuList>
      </CustomPopover>
    );

    return (
      <React.Fragment key={realEstate.id}>
        <Card 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            height: '100%',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: { xs: 1.5, sm: 2 },
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'grey.300',
              transform: { xs: 'translateY(-1px)', sm: 'translateY(-2px)' },
              boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.08)', sm: '0 4px 20px rgba(0,0,0,0.1)' },
            },
          }}
        >
          <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ height: '100%' }}>
            {/* Header com nome e menu */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 2 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 1.5, sm: 2 }, 
                flex: 1,
                minWidth: 0
              }}>
                <Avatar
                  src={realEstate.logo}
                  alt={realEstate.name}
                  sx={{ 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 40, sm: 48 },
                    flexShrink: 0
                  }}
                >
                  {realEstate.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="h6" 
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      lineHeight: { xs: 1.3, sm: 1.6 },
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: { xs: 2, sm: 1 },
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {realEstate.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      wordBreak: 'break-all',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' }
                    }}
                  >
                    CNPJ: {realEstate.cnpj}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={(event) => handleOpenMenu(event, realEstate.id)}
                sx={{
                  color: openMenuId === realEstate.id ? 'text.primary' : 'grey.600',
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: 'grey.100',
                    color: 'grey.800',
                  },
                }}
              >
                <Iconify 
                  icon="eva:more-horizontal-fill" 
                  sx={{ fontSize: { xs: 18, sm: 20 } }}
                />
              </IconButton>
            </Box>

            {/* Informações */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                {realEstate.email && (
                  <Grid size={12}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        wordBreak: 'break-word',
                        lineHeight: { xs: 1.4, sm: 1.5 }
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Email:</Box> {realEstate.email}
                    </Typography>
                  </Grid>
                )}
                {realEstate.phone && (
                  <Grid size={12}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        wordBreak: 'break-word',
                        lineHeight: { xs: 1.4, sm: 1.5 }
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Telefone:</Box> {realEstate.phone}
                    </Typography>
                  </Grid>
                )}
                {realEstate.website && (
                  <Grid size={12}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        wordBreak: 'break-all',
                        lineHeight: { xs: 1.4, sm: 1.5 }
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Website:</Box> {realEstate.website}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Estatísticas */}
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: { xs: 1.5, sm: 2 }, 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Estatísticas
              </Typography>
              
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.4, sm: 1.5 }
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Corretores:</Box> 0
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.4, sm: 1.5 }
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Grupos:</Box> 0
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.4, sm: 1.5 }
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Propriedades:</Box> 0
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.4, sm: 1.5 }
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Clientes:</Box> 0
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Descrição */}
            {realEstate.description && (
              <Box sx={{ py: { xs: 0.5, sm: 1 } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: { xs: 0.5, sm: 0.5 },
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Descrição
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    lineHeight: { xs: 1.4, sm: 1.5 },
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 3, sm: 4 },
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {realEstate.description}
                </Typography>
              </Box>
            )}

            {/* Valor geral de vendas */}
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: { xs: 1.4, sm: 1.5 }
                }}
              >
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>Valor geral de vendas:</Box> R$ 0,00
              </Typography>
            </Box>
          </Stack>
        </Card>
        {renderMenuActions()}
      </React.Fragment>
    );
  }, [openMenuId, menuAnchorEl, handleCloseMenu, handleEditClick, handleDeleteClick]);

  const renderEditDialog = () => {
    if (!selectedRealEstate) return null;

    return (
      <AddRealEstateDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
      />
    );
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Minhas Imobiliárias"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Minhas Imobiliárias' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.realEstate.new)}
          >
            Nova Imobiliária
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {realEstates.length === 0 ? (
        <EmptyContent
          filled
          title="Nenhuma imobiliária cadastrada"
          description="Comece adicionando sua primeira imobiliária para gerenciar seus imóveis."
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.realEstate.new)}
            >
              Adicionar Primeira Imobiliária
            </Button>
          }
        />
      ) : (
        <Box
          sx={{
            gap: { xs: 2, sm: 3 },
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            px: { xs: 0, sm: 0 },
            py: { xs: 0, sm: 0 }
          }}
        >
          {realEstates.map((realEstate) => renderRealEstateCard(realEstate))}
        </Box>
      )}

      {renderEditDialog()}

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        title="Excluir Imobiliária"
        content={
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Tem certeza que deseja excluir a imobiliária <strong>{realEstateToDelete?.name}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Esta ação é <strong>irreversível</strong> e você perderá todas as informações registradas, incluindo:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Dados da imobiliária
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Propriedades associadas
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Histórico de transações
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Configurações personalizadas
              </Typography>
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Excluir Permanentemente
          </Button>
        }
      />
    </DashboardContent>
  );
}