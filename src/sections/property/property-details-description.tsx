import type { Theme, SxProps } from '@mui/material/styles';

import { Box, Typography } from '@mui/material';

import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

type Props = {
  description?: string;
  sx?: SxProps<Theme>;
};

export function PropertyDetailsDescription({ description, sx }: Props) {
  const defaultDescription = `
## Sobre este Imóvel

Este belo imóvel oferece uma oportunidade única de moradia em uma localização privilegiada. Com acabamentos de qualidade e uma distribuição inteligente dos ambientes, proporciona conforto e funcionalidade para toda a família.

### Características Principais

- **Localização privilegiada** - Próximo a centros comerciais, escolas e transporte público
- **Acabamentos de qualidade** - Materiais selecionados e acabamentos refinados
- **Ambientes integrados** - Plantas bem aproveitadas e ambientes funcionais
- **Área de lazer** - Espaços pensados para o seu bem-estar e entretenimento

### Documentação

Toda a documentação do imóvel está em dia e regularizada, proporcionando segurança jurídica na transação.

### Localização

Situado em uma região de fácil acesso, com infraestrutura completa e valorização imobiliária crescente.
  `;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Descrição do Imóvel
      </Typography>

      <Markdown
        children={description || defaultDescription}
        sx={[
          () => ({
            '& p, li, ol, table': { typography: 'body2' },
            '& h2': {
              typography: 'h6',
              mt: 3,
              mb: 2,
              color: 'text.primary',
            },
            '& h3': {
              typography: 'subtitle1',
              mt: 2,
              mb: 1,
              color: 'text.primary',
            },
            '& ul': {
              pl: 2,
              '& li': {
                mb: 0.5,
                '&::marker': {
                  color: 'primary.main',
                },
              },
            },
            '& table': {
              mt: 2,
              maxWidth: 640,
              '& td': { px: 2 },
              '& td:first-of-type': { color: 'text.secondary' },
              'tbody tr:nth-of-type(odd)': { bgcolor: 'transparent' },
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
    </Box>
  );
}
