import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = CardProps & {
  area?: number;
  dimensions?: string;
  topography?: string;
  access?: string;
};

export function TerrenoDetailsCharacteristics({
  sx,
  area,
  dimensions,
  topography,
  access,
  ...other
}: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Características" />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Área Total
            </Typography>
            <Typography variant="subtitle2">
              {area ? `${area.toLocaleString()} m²` : 'Não informado'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Dimensões
            </Typography>
            <Typography variant="subtitle2">{dimensions || 'Não informado'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Topografia
            </Typography>
            <Typography variant="subtitle2">{topography || 'Não informado'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Acesso
            </Typography>
            <Typography variant="subtitle2">{access || 'Não informado'}</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
