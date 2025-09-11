import { m } from 'framer-motion';
import { Iconify } from '@/components/iconify';
import { varAlpha } from 'minimal-shared/utils';
import { varFade, MotionViewport } from '@/components/animate';

import { Box, Grid2, Stack, Container, Typography, type BoxProps } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { SectionTitle } from './components/section-title';
import { CircleSvg, FloatLine, FloatPlusIcon } from './components/svg-elements';

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: 72, left: 72 }} />
    <FloatLine sx={{ top: 80, left: 0 }} />
    <FloatLine sx={{ bottom: 80, left: 0 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

export const HomeFeatures = ({ sx, ...other }: BoxProps) => {
  const renderDescription = () => (
    <>
      <SectionTitle
        caption="Uma plataforma completa"
        title="Tudo que você precisa e o que nenhuma outra oferece"
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
        slotProps={{
          title: { sx: { mb: { xs: 5, md: 8 } } },
        }}
      />

      <Stack spacing={6} sx={{ maxWidth: { sm: 560, md: 400 }, mx: { xs: 'auto', md: 'unset' } }}>
        {ITEMS.map((item) => (
          <Box
            component={m.div}
            variants={varFade('inUp', { distance: 24 })}
            key={item.title}
            sx={{ gap: 3, display: 'flex' }}
          >
            {item.icon}
            <Stack spacing={1}>
              <Typography variant="h5" component="h6">
                {item.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
            </Stack>
          </Box>
        ))}
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
        sx={[
          (theme) => ({
            left: 0,
            width: 720,
            borderRadius: 2,
            position: 'absolute',
            bgcolor: 'background.default',
            boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            ...theme.applyStyles('dark', {
              boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
            }),
          }),
        ]}
      >
        <Box
          component="img"
          alt="Home chart"
          src={`${CONFIG.assetsDir}/assets/Duplicate/TotalInstalled.svg`}
          sx={{ width: 720 }}
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
            <Grid2 size={{ xs: 12, md: 6, lg: 7 }}>{renderDescription()}</Grid2>

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

const ITEMS = [
  {
    icon: <Iconify icon="solar:home-angle-bold-duotone" />,
    title: 'Gestão de Imóveis',
    description: 'Cadastre, organize e publique imóveis com fotos, descrições e dados técnicos.',
  },
  {
    icon: <Iconify icon="solar:wallet-bold-duotone" />,
    title: 'Carteira Financeira Inteligente (BAAS)',
    description:
      'Centralize cobranças, envie e receba Pix, controle comissões, e faça a gestão completa de pagamentos da sua imobiliária direto pelo Duplicate.',
  },
  {
    icon: <Iconify icon="mingcute:filter-2-fill" />,
    title: 'Funil de Vendas com IA',
    description:
      'Visualize cada etapa da negociação e acompanhe leads até o fechamento com agilidade. E tenha um assistente de IA para te auxiliar.',
  },
  {
    icon: <Iconify icon="carbon:skill-level-basic" />,
    title: 'Relatórios e Dashboards',
    description:
      'Performance em tempo real com relatórios automáticos e indicadores por corretor, imóvel ou canal.',
  },
  {
    icon: <Iconify icon="solar:calendar-mark-bold-duotone" />,
    title: 'Agenda Integrada',
    description: 'Visitas, reuniões, follow-ups e compromissos sincronizados com sua operação.',
  },
];
