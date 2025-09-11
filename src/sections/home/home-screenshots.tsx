import type { BoxProps } from '@mui/material';

import { m } from 'framer-motion';
import { CONFIG } from '@/global-config';
import { varFade, MotionViewport } from '@/components/animate';

import { Box, Grid2, Stack, Container, Typography } from '@mui/material';

import { SectionTitle } from './components/section-title';
import { CircleSvg, FloatLine, FloatTriangleDownIcon } from './components/svg-elements';

const renderLines = () => (
  <>
    <Stack
      spacing={8}
      alignItems="center"
      sx={{
        top: 64,
        left: 80,
        position: 'absolute',
        transform: 'translateX(-50%)',
      }}
    >
      <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
      <FloatTriangleDownIcon
        sx={{
          width: 30,
          height: 15,
          opacity: 0.24,
          position: 'static',
        }}
      />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

export const HomeScreenshots = ({ sx, ...other }: BoxProps) => {
  const renderText = () => (
    <>
      <SectionTitle
        caption="Financeiro como você nunca viu"
        title="Controle o dinheiro com inteligência de verdade"
        sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
      />

      <Stack
        spacing={6}
        sx={{
          maxWidth: { sm: 560, md: 400 },
          mx: { xs: 'auto', md: 'unset' },
          color: 'text.secondary',
        }}
      >
        <Typography variant="body1">Com o Duplicate, você pode:</Typography>

        <Typography variant="body1" component="ul">
          {FINANCE_FEATURES.map((item, index) => (
            <Typography variant="body1" component="li" sx={{ listStyle: 'inside' }} key={index}>
              {item}
            </Typography>
          ))}
        </Typography>

        <Typography variant="body1">
          Tudo dentro da própria plataforma. Sem planilhas. Sem sistemas paralelos.
        </Typography>
      </Stack>
    </>
  );

  const renderImage = () => (
    <Stack
      component={m.div}
      variants={varFade('inRight', { distance: 24 })}
      sx={{
        height: 1,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          left: 0,
          width: 720,
          height: '100%',
          borderRadius: 2,
          position: 'absolute',
          bgcolor: 'background.default',
        }}
      >
        <Box
          component="img"
          alt="Home chart"
          src={`${CONFIG.assetsDir}/assets/Duplicate/screenshot-back.svg`}
          sx={{ position: 'absolute', zIndex: 1, top: '-10%', right: '40%' }}
        />
        <Box
          component="img"
          alt="Home chart"
          src={`${CONFIG.assetsDir}/assets/Duplicate/screenshot-middle.svg`}
          sx={{ position: 'absolute', zIndex: 2, left: '5%' }}
        />
        <Box
          component="img"
          alt="Home chart"
          src={`${CONFIG.assetsDir}/assets/Duplicate/screenshot-front.svg`}
          sx={{ position: 'absolute', zIndex: 3, left: '5%', bottom: '0' }}
        />
      </Box>
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[
        {
          overflow: 'hidden',
          position: 'relative',
          py: { sx: 10, md: 20 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container sx={{ position: 'relative' }}>
          <Grid2
            container
            columnSpacing={{ xs: 0, md: 8 }}
            sx={{ position: 'relative', zIndex: 9 }}
          >
            <Grid2 size={{ xs: 12, md: 6, lg: 7 }}>{renderText()}</Grid2>

            <Grid2 sx={{ display: { xs: 'none', md: 'block' } }} size={{ md: 6, lg: 5 }}>
              {renderImage()}
            </Grid2>
          </Grid2>

          <CircleSvg variants={varFade('in')} sx={{ display: { xs: 'none', md: 'block' } }} />
        </Container>
      </MotionViewport>
    </Box>
  );
};

const FINANCE_FEATURES = [
  'Emitir cobranças automáticas',
  'Receber pagamentos via Pix',
  'Controlar o repasse de comissões',
  'Acompanhar fluxo de caixa da imobiliária',
  'Ter transparência total nas transações',
];
