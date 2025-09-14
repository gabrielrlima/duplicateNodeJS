import { useState, useCallback } from 'react';
import { useBoolean , usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { PlantaItem } from './planta-item';
import { PlantaNewForm } from './planta-new-form';
import { PlantaListDialog } from './planta-list-dialog';

import type { PlantaItemType } from './planta-item';

// ----------------------------------------------------------------------

type Props = {
  plantas: PlantaItemType[];
  onPlantas: (plantas: PlantaItemType[]) => void;
  title?: string;
  subheader?: string;
};

export function PlantaBook({ 
  plantas, 
  onPlantas, 
  title = 'Plantas do Empreendimento',
  subheader = 'Gerencie as plantas disponíveis'
}: Props) {
  const [selectedPlantaId, setSelectedPlantaId] = useState<string | null>(null);
  
  const newForm = useBoolean();
  const selectDialog = useBoolean();
  const popover = usePopover();

  const selectedPlanta = plantas.find((planta) => planta.id === selectedPlantaId);

  const handleAddPlanta = useCallback(
    (newPlanta: PlantaItemType) => {
      console.log('🌱 PLANTA BOOK - Adicionando nova planta:', newPlanta);
      console.log('🌱 PLANTA BOOK - Plantas atuais:', plantas.length);
      
      try {
        const novasPlantas = [...plantas, newPlanta];
        console.log('🌱 PLANTA BOOK - Novas plantas (total):', novasPlantas.length);
        console.log('🌱 PLANTA BOOK - Chamando onPlantas...');
        
        onPlantas(novasPlantas);
        
        console.log('✅ PLANTA BOOK - onPlantas executado com sucesso');
      } catch (error) {
        console.error('❌ PLANTA BOOK - Erro ao adicionar planta:', error);
        throw error; // Re-throw para não mascarar o erro
      }
    },
    [plantas, onPlantas]
  );

  const handleEditPlanta = useCallback(
    (editedPlanta: PlantaItemType) => {
      const updatedPlantas = plantas.map((planta) =>
        planta.id === editedPlanta.id ? editedPlanta : planta
      );
      
      onPlantas(updatedPlantas);
      setSelectedPlantaId(null);
    },
    [plantas, onPlantas]
  );

  const handleDeletePlanta = useCallback(
    (plantaId: string) => {
      console.log('🗑️ Tentando excluir planta:', plantaId);
      console.log('📋 Plantas atuais:', plantas);
      const updatedPlantas = plantas.filter((planta) => planta.id !== plantaId);
      console.log('📋 Plantas após filtro:', updatedPlantas);
      onPlantas(updatedPlantas);
      popover.onClose();
      setSelectedPlantaId(null);
      console.log('✅ Exclusão concluída');
    },
    [plantas, onPlantas, popover]
  );



  const handleSelectFromDialog = useCallback(
    (planta: PlantaItemType) => {
      handleAddPlanta(planta);
    },
    [handleAddPlanta]
  );

  const handleEditClick = useCallback(
    (plantaId: string) => {
      setSelectedPlantaId(plantaId);
      newForm.onTrue();
      popover.onClose();
    },
    [newForm, popover]
  );

  const renderPlanta = (planta: PlantaItemType, index: number) => {
    const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (planta.id) {
        setSelectedPlantaId(planta.id);
        popover.onOpen(event);
      }
    };

    return (
      <PlantaItem
        key={planta.id || index}
        planta={planta}
        action={
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />
    );
  };

  const totalPlantas = plantas.length;

  return (
    <>
      <Card>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setSelectedPlantaId(null);
                newForm.onTrue();
              }}
            >
              Nova Planta
            </Button>
          }
        />



        <Stack spacing={2.5} sx={{ p: 3, pt: totalPlantas > 0 ? 1 : 3 }}>
          {plantas.length ? (
            plantas.map(renderPlanta)
          ) : (
            <Box
              sx={{
                py: 6,
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Nenhuma planta cadastrada
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Adicione plantas para definir as opções disponíveis no empreendimento
              </Typography>
              
              <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => {
                    setSelectedPlantaId(null);
                    newForm.onTrue();
                  }}
                >
                  Adicionar Primeira Planta
                </Button>
            </Box>
          )}
        </Stack>
      </Card>

      <PlantaNewForm
        open={newForm.value}
        onClose={() => {
          newForm.onFalse();
          setSelectedPlantaId(null);
        }}
        onCreate={selectedPlanta ? handleEditPlanta : handleAddPlanta}
        currentPlanta={selectedPlanta}
      />

      <PlantaListDialog
        open={selectDialog.value}
        onClose={selectDialog.onFalse}
        list={plantas}
        onSelect={handleSelectFromDialog}
      />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => selectedPlantaId && handleEditClick(selectedPlantaId)}
            disabled={!selectedPlantaId}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              console.log('🖱️ Clique no botão Excluir');
              console.log('🆔 selectedPlantaId:', selectedPlantaId);
              if (selectedPlantaId) {
                console.log('✅ ID válido, chamando handleDeletePlanta');
                handleDeletePlanta(selectedPlantaId);
              } else {
                console.log('❌ ID inválido ou nulo');
              }
            }}
            disabled={!selectedPlantaId}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Excluir
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}