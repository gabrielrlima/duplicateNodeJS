import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { EMPREENDIMENTO_PUBLISH_OPTIONS } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { EmpreendimentoDetailsToolbar } from '../empreendimento-details-toolbar';
import { EmpreendimentoDetailsSummary } from '../empreendimento-details-summary';
import { EmpreendimentoDetailsPlantas } from '../empreendimento-details-plantas';
import { EmpreendimentoDetailsCarousel } from '../empreendimento-details-carousel';
import { EmpreendimentoDetailsDescription } from '../empreendimento-details-description';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: 'Localização privilegiada',
    description: 'Empreendimento localizado em área nobre com fácil acesso a comércios e serviços.',
    icon: 'solar:map-point-bold',
  },
  {
    title: 'Entrega garantida',
    description: 'Cronograma de entrega rigorosamente cumprido pela construtora.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Qualidade certificada',
    description: 'Materiais de primeira qualidade e acabamentos premium.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

type Props = {
  empreendimento?: IEmpreendimentoItem;
  loading?: boolean;
  error?: any;
};

export function EmpreendimentoDetailsView({ empreendimento, error, loading }: Props) {
  const tabs = useTabs('description');

  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (empreendimento) {
      setPublish(empreendimento?.publish || 'published');
    }
  }, [empreendimento]);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  if (loading) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <Typography>Carregando...</Typography>
      </DashboardContent>
    );
  }

  if (error || !empreendimento) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Empreendimento não encontrado!"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.empreendimentos.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Voltar para lista
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <EmpreendimentoDetailsToolbar
        backHref={paths.dashboard.empreendimentos.root}
        editHref={paths.dashboard.empreendimentos.edit(empreendimento.id)}
        publish={publish}
        onChangePublish={handleChangePublish}
        publishOptions={EMPREENDIMENTO_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <EmpreendimentoDetailsCarousel
            images={empreendimento?.avatar ? [empreendimento.avatar] : []}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <EmpreendimentoDetailsSummary empreendimento={empreendimento} />
        </Grid>
      </Grid>

      <Box
        sx={{
          gap: 5,
          my: 10,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={[
            (theme) => ({
              px: 3,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {[
            { value: 'description', label: 'Descrição' },
            { value: 'plantas', label: `Plantas (${empreendimento?.plantas?.length || 0})` },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <EmpreendimentoDetailsDescription description={empreendimento?.descricao} />
        )}

        {tabs.value === 'plantas' && (
          <EmpreendimentoDetailsPlantas plantas={empreendimento?.plantas} />
        )}
      </Card>
    </DashboardContent>
  );
}
