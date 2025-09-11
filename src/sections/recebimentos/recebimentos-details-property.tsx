import type { IRecebimentosProperty } from 'src/types/recebimentos';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  property?: IRecebimentosProperty;
};

export function RecebimentosDetailsProperty({ property }: Props) {
  return (
    <>
      <CardHeader title="Propriedade" />

      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Endereço:
          </Box>
          <Typography variant="body2">{property?.address}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Cidade:
          </Box>
          <Typography variant="body2">{property?.city}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Estado:
          </Box>
          <Typography variant="body2">{property?.state}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            CEP:
          </Box>
          <Typography variant="body2">{property?.zipCode}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Tipo:
          </Box>
          <Typography variant="body2">{property?.type}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Valor do Aluguel:
          </Box>
          <Typography variant="body2">{property?.rentValue}</Typography>
        </Stack>
      </Stack>
    </>
  );
}
