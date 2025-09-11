import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  area?: number;
  price?: number;
  description?: string;
};

export function TerrenoDetailsInfo({ sx, title, area, price, description, ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Informações Gerais" />

      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {title || 'Não informado'}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Área
              </Typography>
              <Typography variant="subtitle2">
                {area ? `${area.toLocaleString()} m²` : 'Não informado'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Preço
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                {price ? fCurrency(price) : 'Não informado'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Descrição
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {description || 'Não informado'}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
