import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  plantas?: IEmpreendimentoItem['plantas'];
};

export function EmpreendimentoDetailsPlantas({ plantas }: Props) {
  if (!plantas || plantas.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Iconify icon="solar:document-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nenhuma planta disponível
        </Typography>
        <Typography variant="body2" color="text.disabled">
          As plantas deste empreendimento ainda não foram cadastradas.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {plantas.map((planta, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              {planta.imagens && planta.imagens.length > 0 && (
                <Image
                  src={planta.imagens[0]}
                  alt={planta.nome || `Planta ${index + 1}`}
                  ratio="4/3"
                  sx={{ borderRadius: '8px 8px 0 0' }}
                />
              )}

              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">{planta.nome || `Planta ${index + 1}`}</Typography>

                  {planta.descricao && (
                    <Typography variant="body2" color="text.secondary">
                      {planta.descricao}
                    </Typography>
                  )}

                  <Stack spacing={1}>
                    {planta.quartos && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="solar:bed-bold" width={16} />
                        <Typography variant="body2">
                          {planta.quartos} {planta.quartos === 1 ? 'quarto' : 'quartos'}
                        </Typography>
                      </Box>
                    )}

                    {planta.banheiros && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="solar:bath-bold" width={16} />
                        <Typography variant="body2">
                          {planta.banheiros} {planta.banheiros === 1 ? 'banheiro' : 'banheiros'}
                        </Typography>
                      </Box>
                    )}

                    {planta.area && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="solar:ruler-bold" width={16} />
                        <Typography variant="body2">{planta.area}m²</Typography>
                      </Box>
                    )}

                    {planta.vagas && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="solar:car-bold" width={16} />
                        <Typography variant="body2">
                          {planta.vagas} {planta.vagas === 1 ? 'vaga' : 'vagas'}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {planta.preco && (
                    <Box sx={{ pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="h6" color="primary">
                        {fCurrency(planta.preco.valor)}
                        {planta.preco.negociavel && (
                          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                            (Negociável)
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
