import type { PaperProps } from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


export type PlantaItemType = {
  id?: string;
  area: number;
  precoPorM2: number;
  descricao?: string;
};

// ----------------------------------------------------------------------

type Props = PaperProps & {
  action?: React.ReactNode;
  planta: PlantaItemType;
};

export function PlantaItem({ planta, action, sx, ...other }: Props) {
  const area = planta.area || 0;
  const precoPorM2 = planta.precoPorM2 || 0;
  const precoTotal = (area && precoPorM2) ? area * precoPorM2 : 0;

  return (
    <Paper
      sx={[
        () => ({
          gap: 2,
          display: 'flex',
          position: 'relative',
          alignItems: { md: 'flex-end' },
          flexDirection: { xs: 'column', md: 'row' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2">
            Planta {area}m²
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Área: {(area || 0).toLocaleString('pt-BR')} m²
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Preço por m²: R$ {(precoPorM2 || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>

        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Total: R$ {(precoTotal || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>

        {planta.descricao && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {planta.descricao}
          </Typography>
        )}
      </Stack>

      {action && action}
    </Paper>
  );
}