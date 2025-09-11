import { Card, Stack, Typography, Box } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

export function ImagesStep() {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Imagens do Terreno
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adicione fotos que destacam as características do terreno
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {/* Upload de imagens */}
          <Field.Upload
            name="imagens"
            multiple
            thumbnail
            accept={{
              'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
            }}
            helperText="Arraste e solte as imagens aqui ou clique para selecionar"
            sx={{
              '& .MuiBox-root': {
                minHeight: 200,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              },
            }}
          />

          {/* Dicas para boas fotos */}
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.neutral',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:camera-bold" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" color="primary.main">
                  Dicas para boas fotos
                </Typography>
              </Box>
              
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  • Tire fotos em diferentes ângulos do terreno
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Inclua fotos da frente, fundos e laterais
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Fotografe durante o dia com boa iluminação
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Mostre a vista e o entorno do terreno
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Destaque características especiais (árvores, declive, etc.)
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}