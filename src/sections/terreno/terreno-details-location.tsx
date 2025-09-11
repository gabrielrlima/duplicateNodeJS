import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export function TerrenoDetailsLocation({
  sx,
  address,
  city,
  state,
  zipCode,
  coordinates,
  ...other
}: Props) {
  const handleOpenMap = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Localização" />

      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            Endereço
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {address || 'Não informado'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Cidade
              </Typography>
              <Typography variant="subtitle2">{city || 'Não informado'}</Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Estado
              </Typography>
              <Typography variant="subtitle2">{state || 'Não informado'}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              CEP
            </Typography>
            <Typography variant="subtitle2">{zipCode || 'Não informado'}</Typography>
          </Box>
        </Box>

        {coordinates && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:map-point-bold" />}
              onClick={handleOpenMap}
              fullWidth
            >
              Ver no Mapa
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
}
