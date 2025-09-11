import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type VendasPropertyData = {
  name?: string;
  developer?: string;
  pricePerM2?: number;
  size?: number;
  unit?: string;
  totalValue?: number;
  image?: string;
};

type Props = CardProps & {
  propertyData?: VendasPropertyData;
};

export function VendasDetailsProperty({ propertyData, sx, ...other }: Props) {
  if (!propertyData) {
    return null;
  }

  const property = propertyData;

  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Detalhes do imóvel" />

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
          <Avatar
            src={property.image}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
            }}
          >
            🏢
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {property.name || 'Nome do imóvel'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {property.developer || 'Incorporadora'}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Valor do m2
            </Typography>
            <Typography variant="h6">
              {property.pricePerM2 ? fCurrency(property.pricePerM2) : 'R$0,00'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Tamanho
            </Typography>
            <Typography variant="h6">{property.size || 0}m2</Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Unidade
            </Typography>
            <Typography variant="h6">{property.unit || '0000'}</Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
            Total
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {property.totalValue ? fCurrency(property.totalValue) : 'R$0,00'}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
