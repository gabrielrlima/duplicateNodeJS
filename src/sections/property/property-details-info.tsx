import type { CardProps } from '@mui/material/Card';
import type { IPropertyItem } from 'src/types/property';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  property?: IPropertyItem;
  propertyData?: IPropertyItem;
};

export function PropertyDetailsInfo({ sx, property, propertyData, ...other }: Props) {
  const propertyItem = propertyData || property;

  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Informações Gerais" />

      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {propertyItem?.titulo || 'Não informado'}
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
                {propertyItem?.area ? `${propertyItem.area.toLocaleString()} m²` : 'Não informado'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Preço
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                {propertyItem?.preco ? fCurrency(propertyItem.preco) : 'Não informado'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Quartos
              </Typography>
              <Typography variant="subtitle2">
                {propertyItem?.caracteristicas?.quartos || 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Banheiros
              </Typography>
              <Typography variant="subtitle2">
                {propertyItem?.caracteristicas?.banheiros || 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Suítes
              </Typography>
              <Typography variant="subtitle2">
                {propertyItem?.suites || 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Vagas Garagem
              </Typography>
              <Typography variant="subtitle2">
                {propertyItem?.caracteristicas?.vagasGaragem || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Descrição
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {propertyItem?.descricao || 'Não informado'}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}