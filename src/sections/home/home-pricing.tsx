import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { varFade, varScale, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatXIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function HomePricing({ sx, ...other }: BoxProps) {
  const tabs = useTabs('BASIC');

  const renderDescription = () => (
    <SectionTitle
      caption="planos"
      title="Planos que crescem com você"
      description="Escolha o plano ideal para o tamanho da sua operação. Todos incluem 14 dias grátis."
      sx={{ mb: 8, textAlign: 'center' }}
    />
  );

  const renderContentDesktop = () => (
    <Box gridTemplateColumns="repeat(3, 1fr)" sx={{ display: { xs: 'none', md: 'grid' } }}>
      {PLANS.map((plan) => (
        <PlanCard
          key={plan.license}
          plan={plan}
          sx={(theme) => ({
            ...(plan.license === 'Plus' && {
              [theme.breakpoints.down(1440)]: {
                borderLeft: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
                borderRight: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
              },
            }),
          })}
        />
      ))}
    </Box>
  );

  const renderContentMobile = () => (
    <Stack spacing={5} alignItems="center" sx={{ display: { md: 'none' } }}>
      <Tabs
        value={tabs.value}
        onChange={tabs.onChange}
        sx={[
          (theme) => ({
            boxShadow: `0px -2px 0px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)} inset`,
          }),
        ]}
      >
        {PLANS.map((tab) => (
          <Tab key={tab.license} value={tab.license} label={tab.license} />
        ))}
      </Tabs>

      <Box
        sx={[
          (theme) => ({
            width: 1,
            borderRadius: 2,
            border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          }),
        ]}
      >
        {PLANS.map(
          (tab) => tab.license === tabs.value && <PlanCard key={tab.license} plan={tab} />
        )}
      </Box>
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[{ py: 10, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        <FloatLine vertical sx={{ top: 0, left: 80 }} />

        <Container>{renderDescription()}</Container>

        <Box
          sx={(theme) => ({
            position: 'relative',
            '&::before, &::after': {
              width: 64,
              height: 64,
              content: "''",
              [theme.breakpoints.up(1440)]: { display: 'block' },
            },
          })}
        >
          <Container>{renderContentDesktop()}</Container>

          <FloatLine sx={{ top: 64, left: 0 }} />
          <FloatLine sx={{ bottom: 64, left: 0 }} />
        </Box>

        <Container>{renderContentMobile()}</Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

interface Feature {
  text: string;
  slashed?: boolean;
  isDivider?: boolean;
}

interface Plan {
  license: string;
  name: string;
  price: number;
  color: string;
  subtitle: string;
  features: Feature[];
}

type PlanCardProps = BoxProps & {
  plan: Plan;
};

const renderLines = () => (
  <>
    <FloatLine vertical sx={{ top: -64, left: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatLine vertical sx={{ top: -64, right: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatXIcon sx={{ top: -8, left: -8 }} />
    <FloatXIcon sx={{ top: -8, right: -8 }} />
    <FloatXIcon sx={{ bottom: -8, left: -8 }} />
    <FloatXIcon sx={{ bottom: -8, right: -8 }} />
  </>
);

function PlanCard({ plan, sx, ...other }: PlanCardProps) {
  const plusLicense = plan.license === 'PRO';

  return (
    <MotionViewport>
      <Box
        sx={[
          () => ({
            px: 6,
            py: 8,
            gap: 5,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {plusLicense && renderLines()}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack flexGrow={1}>
            <m.div variants={varFade('inLeft', { distance: 24 })}>
              <Typography variant="h4" component="h6">
                {plan.name}
              </Typography>
            </m.div>

            <m.div variants={varScale('inX')}>
              <Box
                sx={{
                  width: 32,
                  height: 6,
                  opacity: 0.24,
                  borderRadius: 1,
                  bgcolor: plan.color,
                }}
              />
            </m.div>
          </Stack>

          <m.div variants={varFade('inLeft', { distance: 24 })}>
            <Box component="span" sx={{ typography: 'h3' }}>
              R${plan.price}
            </Box>
          </m.div>
        </Box>

        <Box sx={{ gap: 2, display: 'flex' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plan.subtitle}
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {plan.features.map((option) => {
            const disabled = option.slashed;
            const divider = option.isDivider;

            if (divider)
              return (
                <m.div variants={varFade('inLeft', { distance: 24 })} key={option.text}>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                </m.div>
              );

            if (disabled)
              return (
                <Box
                  key={option.text}
                  component={m.div}
                  variants={varFade('in')}
                  sx={{
                    gap: 1.5,
                    display: 'flex',
                    typography: 'body2',
                    alignItems: 'center',
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                  }}
                >
                  <Iconify width={18} icon="mingcute:close-line" />
                  {option.text}
                </Box>
              );

            return (
              <Box
                key={option.text}
                component={m.div}
                variants={varFade('in')}
                sx={{
                  gap: 1.5,
                  display: 'flex',
                  typography: 'body2',
                  alignItems: 'center',
                }}
              >
                <Iconify width={16} icon="eva:checkmark-fill" />
                {option.text}
              </Box>
            );
          })}
        </Stack>

        <m.div variants={varFade('inUp', { distance: 24 })}>
          <Button
            fullWidth
            variant={plusLicense ? 'contained' : 'outlined'}
            color="inherit"
            size="large"
            target="_blank"
            rel="noopener"
            href={paths.minimalStore}
          >
            Começar grátis
          </Button>
        </m.div>
      </Box>
    </MotionViewport>
  );
}

// ----------------------------------------------------------------------

const PLANS: Plan[] = [
  {
    license: 'BASIC',
    name: 'Básico',
    price: 97,
    subtitle: 'Ideal para corretores autônomos',
    color: 'primary.main',
    features: [
      { text: 'Até 100 imóveis cadastrados' },
      { text: 'Funil de vendas básico' },
      { text: 'Agenda pessoal' },
      { text: 'Relatórios básicos' },
      { text: 'Módulo bancário' },
      { text: 'Suporte por email' },
      { text: '', isDivider: true },
      { text: '1 Usuário' },
      { text: 'Contratos digitais', slashed: true },
      { text: 'Inteligência Artificial especializada', slashed: true },
      { text: 'Suporte prioritário', slashed: true },
    ],
  },
  {
    license: 'PRO',
    name: 'Pro',
    price: 197,
    subtitle: 'Para pequenas e médias imobiliárias',
    color: 'secondary.main',
    features: [
      { text: 'Imóveis ilimitados' },
      { text: 'Funil de vendas avançado' },
      { text: 'Agenda da equipe' },
      { text: 'Relatórios detalhados' },
      { text: 'Controle financeiro completo com repasses e comissões' },
      { text: 'Automações básicas' },
      { text: '', isDivider: true },
      { text: 'Até 5 usuários' },
      { text: 'Contratos digitais' },
      { text: 'Agente de IA' },
      { text: 'Suporte prioritário', slashed: true },
    ],
  },
  {
    license: 'TEAM',
    name: 'Equipe',
    price: 397,
    subtitle: 'Para grandes imobiliárias',
    color: 'error.main',
    features: [
      { text: 'Tudo do plano Pro' },
      { text: 'Usuários ilimitados' },
      { text: 'Automações avançadas' },
      { text: 'API personalizada' },
      { text: 'Relatórios customizados' },
      {
        text: 'Infraestrutura bancária integrada, API de pagamentos e controle financeiro multiusuário',
      },
      { text: '', isDivider: true },
      { text: 'Integração com CRM' },
      { text: 'Suporte 24/7' },
      { text: 'Gerente de sucesso' },
    ],
  },
];
