import { useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Grid2,
  Avatar,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (terreno: any) => void;
};

export function TerrenoCloneSelector({ open, onClose, onSelect }: Props) {
  const [selectedTerreno, setSelectedTerreno] = useState<any | null>(null);

  const availableTerrenos: any[] = [];

  const handleSelect = (terreno: any) => {
    setSelectedTerreno(terreno);
  };

  const handleConfirm = () => {
    if (selectedTerreno) {
      onSelect(selectedTerreno);
      onClose();
      setSelectedTerreno(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedTerreno(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:copy-bold" width={24} />
          <Typography variant="h6">Clonar Terreno para Imóvel</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selecione um terreno para usar como base na criação do novo imóvel
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <Grid2 container spacing={2}>
          {availableTerrenos.map((terreno) => {
            const isSelected = selectedTerreno?.id === terreno.id;

            return (
              <Grid2 key={terreno.id} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: 2,
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.lighter',
                    },
                  }}
                  onClick={() => handleSelect(terreno)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      src={terreno.proprietario.avatarUrl}
                      alt={terreno.proprietario.nome}
                      sx={{ width: 48, height: 48 }}
                    />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {terreno.codigo}
                        </Typography>
                        <Chip label={terreno.tipo} size="small" color="primary" variant="soft" />
                      </Box>

                      <Typography variant="h6" sx={{ mb: 1 }} noWrap>
                        {terreno.titulo}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Área
                          </Typography>
                          <Typography variant="subtitle2">
                            {terreno.area.toLocaleString()} m²
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Preço
                          </Typography>
                          <Typography variant="subtitle2" color="success.main">
                            {fCurrency(terreno.preco)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" noWrap>
                        {terreno.localizacao.bairro}, {terreno.localizacao.cidade}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Proprietário: {terreno.proprietario.nome}
                      </Typography>
                    </Box>

                    {isSelected && (
                      <IconButton
                        size="small"
                        color="primary"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <Iconify icon="eva:checkmark-fill" width={16} />
                      </IconButton>
                    )}
                  </Box>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>

        {availableTerrenos.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 6,
              color: 'text.secondary',
            }}
          >
            <Iconify icon="solar:home-smile-angle-outline" width={64} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Nenhum terreno disponível
            </Typography>
            <Typography variant="body2">
              Não há terrenos disponíveis para clonagem no momento.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedTerreno}
          startIcon={<Iconify icon="solar:copy-bold" />}
        >
          Clonar Terreno
        </Button>
      </DialogActions>
    </Dialog>
  );
}
