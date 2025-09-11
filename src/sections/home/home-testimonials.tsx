import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { _mock } from 'src/_mock';

import { varFade, MotionViewport } from 'src/components/animate';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  carouselBreakpoints,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatTriangleDownIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

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

export function HomeTestimonials({ sx, ...other }: BoxProps) {
  const carousel = useCarousel({
    align: 'start',
    slidesToShow: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
    },
    breakpoints: {
      [carouselBreakpoints.sm]: { slideSpacing: '24px' },
      [carouselBreakpoints.md]: { slideSpacing: '40px' },
      [carouselBreakpoints.lg]: { slideSpacing: '64px' },
    },
  });

  const renderDescription = () => (
    <SectionTitle
      caption="mais de 100 imobiliárias já transformaram suas vendas com o duplicate"
      title="O que nossos clientes estão dizendo"
      sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}
    />
  );

  const horizontalDivider = (position: 'top' | 'bottom') => (
    <Divider
      component="div"
      sx={[
        (theme) => ({
          width: 1,
          opacity: 0.16,
          height: '1px',
          border: 'none',
          position: 'absolute',
          background: `linear-gradient(to right, transparent 0%, ${theme.vars.palette.grey[500]} 50%, transparent 100%)`,
          ...(position === 'top' && { top: 0 }),
          ...(position === 'bottom' && { bottom: 0 }),
        }),
      ]}
    />
  );

  const verticalDivider = () => (
    <Divider
      component="div"
      orientation="vertical"
      flexItem
      sx={[
        (theme) => ({
          width: '1px',
          opacity: 0.16,
          border: 'none',
          background: `linear-gradient(to bottom, transparent 0%, ${theme.vars.palette.grey[500]} 50%, transparent 100%)`,
          display: { xs: 'none', md: 'block' },
        }),
      ]}
    />
  );

  const renderContent = () => (
    <Stack sx={{ position: 'relative', py: { xs: 5, md: 8 } }}>
      {horizontalDivider('top')}

      <Carousel carousel={carousel}>
        {TESTIMONIALS.map((item) => (
          <Stack key={item.id} component={m.div} variants={varFade('in')}>
            <Stack sx={{ typography: 'subtitle2' }}>
              <Rating size="small" name="read-only" value={item.rating} precision={0.5} readOnly />
              {item.position}
            </Stack>

            <Typography
              sx={(theme) => ({
                ...theme.mixins.maxLine({ line: 4, persistent: theme.typography.body1 }),
                mt: 2,
                mb: 3,
              })}
            >
              {item.content}
            </Typography>

            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar alt={item.name} src={item.avatar} sx={{ width: 48, height: 48 }} />
              <Stack sx={{ typography: 'subtitle1' }}>
                <Box component="span">{item.name}</Box>

                <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>
                  {fToNow(new Date(item.postedAt))}
                </Box>
              </Stack>
            </Box>
          </Stack>
        ))}
      </Carousel>

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <CarouselDotButtons
          variant="rounded"
          scrollSnaps={carousel.dots.scrollSnaps}
          selectedIndex={carousel.dots.selectedIndex}
          onClickDot={carousel.dots.onClickDot}
        />

        <CarouselArrowBasicButtons {...carousel.arrows} options={carousel.options} />
      </Box>
    </Stack>
  );

  const renderNumber = () => (
    <Stack sx={{ py: { xs: 5, md: 8 }, position: 'relative' }}>
      {horizontalDivider('top')}

      <Stack
        divider={verticalDivider()}
        sx={{ gap: 5, flexDirection: { xs: 'column', md: 'row' } }}
      >
        {[
          { label: 'Avaliação média', value: '4.9/5' },
          { label: 'Clientes ativos', value: '100+' },
          { label: 'Aumento médio em vendas', value: '40%' },
        ].map((item) => (
          <Stack key={item.label} spacing={2} sx={{ textAlign: 'center', width: 1 }}>
            <m.div variants={varFade('inUp', { distance: 24 })}>
              <Box
                component="span"
                sx={[
                  (theme) => ({
                    fontWeight: 'fontWeightBold',
                    fontSize: { xs: 40, md: 64 },
                    lineHeight: { xs: 50 / 40, md: 80 / 64 },
                    fontFamily: theme.typography.fontSecondaryFamily,
                  }),
                ]}
              >
                {item.value}
              </Box>
            </m.div>

            <m.div variants={varFade('inUp', { distance: 24 })}>
              <Box component="span" sx={{ opacity: 0.4, typography: 'h6' }}>
                {item.label}
              </Box>
            </m.div>
          </Stack>
        ))}
      </Stack>

      {horizontalDivider('bottom')}
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[{ py: 10, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container>
          {renderDescription()}
          {renderContent()}
          {renderNumber()}
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const createReview = (index: number) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  avatar: _mock.image.avatar(index),
  rating: 5,
});

const TESTIMONIALS = [
  {
    ...createReview(1),
    position: 'Diretora Comercial',
    content: `Desde que implementamos o Duplicate, nossas vendas aumentaram 40%. A organização dos leads e o acompanhamento são excepcionais!`,
    postedAt: 'April 20, 2024 23:15:30',
  },
  {
    ...createReview(2),
    position: 'Corretor Autônomo',
    content: `Como corretor autônomo, o Duplicate me deu a estrutura que eu precisava. Agora consigo acompanhar todos os meus clientes sem qualquer dificuldade.`,
    postedAt: 'March 19, 2024 23:15:30',
  },
  {
    ...createReview(3),
    position: 'Gestora de Vendas',
    content: `A plataforma é incrivelmente intuitiva. Em poucos dias nossa equipe já estava usando todas as funcionalidades. Os relatórios já geraram inúmeras métricas importantes.`,
    postedAt: 'April 19, 2023 23:15:30',
  },
  {
    ...createReview(4),
    position: 'Coordenadora de Vendas',
    content: `O Duplicate revolucionou a forma como gerenciamos nossas negociações. Hoje temos total visibilidade sobre o funil que tipicamente não fazemos idéia de como funciona.`,
    postedAt: 'May 19, 2023 23:15:30',
  },
  {
    ...createReview(5),
    position: 'Diretora Comercial',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet tempor justo.',
    postedAt: 'June 19, 2023 23:15:30',
  },
  {
    ...createReview(6),
    position: 'Corretor Autônomo',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet tempor justo.',
    postedAt: 'July 19, 2023 23:15:30',
  },
  {
    ...createReview(7),
    position: 'Coordenadora de Vendas',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet tempor justo.',
    postedAt: 'August 19, 2023 23:15:30',
  },
  {
    ...createReview(8),
    position: 'Diretora Comercial',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet tempor justo.',
    postedAt: 'September 19, 2023 23:15:30',
  },
];
