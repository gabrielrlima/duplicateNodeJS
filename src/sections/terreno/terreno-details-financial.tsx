import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  price?: number;
  pricePerSqm?: number;
  taxes?: number;
  documentation?: string;
  priceNegotiable?: boolean;
  ituAnual?: number;
};

export function TerrenoDetailsFinancial({ price, pricePerSqm, taxes, documentation, priceNegotiable, ituAnual }: Props) {
  return (
    <>
      <CardHeader title="Informações Financeiras" />
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Preço Total
            </Typography>
            <Typography variant="h6" sx={{ color: 'success.main' }}>
              {price ? fCurrency(price) : 'Não informado'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Preço por m²
            </Typography>
            <Typography variant="subtitle2">
              {pricePerSqm ? fCurrency(pricePerSqm) : 'Não informado'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Preço Negociável
            </Typography>
            <Typography variant="subtitle2">
              {priceNegotiable !== undefined ? (priceNegotiable ? 'Sim' : 'Não') : 'Não informado'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              ITU Anual
            </Typography>
            <Typography variant="subtitle2">{ituAnual ? fCurrency(ituAnual) : 'Não informado'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Impostos
            </Typography>
            <Typography variant="subtitle2">{taxes ? fCurrency(taxes) : 'Não informado'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Documentação
            </Typography>
            <Typography variant="subtitle2">{documentation || 'Não informado'}</Typography>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
