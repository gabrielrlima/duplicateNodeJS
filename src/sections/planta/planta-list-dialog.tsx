import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

import type { PlantaItemType } from './planta-item';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  selected?: (plantaId: string) => boolean;
  onSelect?: (planta: PlantaItemType) => void;
  list: PlantaItemType[];
  action?: React.ReactNode;
  title?: string;
};

export function PlantaListDialog({
  open,
  list,
  onClose,
  onSelect,
  selected,
  action,
  title = 'Selecionar Planta',
}: Props) {
  const [searchPlanta, setSearchPlanta] = useState('');

  const dataFiltered = applyFilter({ inputData: list, query: searchPlanta });

  const notFound = !dataFiltered.length && !!searchPlanta;

  const handleSearchPlanta = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPlanta(event.target.value);
  }, []);

  const handleSelectPlanta = useCallback(
    (planta: PlantaItemType) => {
      onSelect?.(planta);
      setSearchPlanta('');
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Scrollbar sx={{ height: 480 }}>
      {dataFiltered.map((planta) => {
        const isSelected = selected ? selected(planta.id!) : false;
        const area = planta.area || 0;
        const precoPorM2 = planta.precoPorM2 || 0;
        const precoTotal = (area && precoPorM2) ? area * precoPorM2 : 0;

        return (
          <Box
            key={planta.id}
            onClick={() => handleSelectPlanta(planta)}
            sx={[
              {
                p: 2,
                gap: 2,
                display: 'flex',
                cursor: 'pointer',
                borderRadius: 1,
                flexDirection: 'column',
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
              },
              isSelected && {
                bgcolor: 'action.selected',
              },
            ]}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">
                Planta {area}m²
              </Typography>
              
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                R$ {(precoTotal || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </Box>

            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Área: {(planta.area || 0).toLocaleString('pt-BR')} m²
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Preço por m²: R$ {(planta.precoPorM2 || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </Typography>
              
              {planta.descricao && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    fontStyle: 'italic',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {planta.descricao}
                </Typography>
              )}
            </Stack>
          </Box>
        );
      })}
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>{title}</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <TextField
          fullWidth
          value={searchPlanta}
          onChange={handleSearchPlanta}
          placeholder="Buscar por área, preço ou descrição..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2.5 }}
        />

        {notFound ? <SearchNotFound query={searchPlanta} sx={{ mt: 3, mb: 10 }} /> : renderList}
      </DialogContent>

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: PlantaItemType[];
  query: string;
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (!query) return inputData;

  return inputData.filter((planta) => {
    const searchQuery = query.toLowerCase();
    
    return (
      planta.area.toString().includes(searchQuery) ||
      planta.precoPorM2.toString().includes(searchQuery) ||
      (planta.descricao && planta.descricao.toLowerCase().includes(searchQuery))
    );
  });
}