import type { IRelatoriosAnalytic } from 'src/types/relatorios';

import Grid from '@mui/material/Grid';

import { Iconify } from 'src/components/iconify';
import { AnalyticsWidget } from 'src/components/analytics-widget';

// ----------------------------------------------------------------------

type Props = {
  analytics: IRelatoriosAnalytic;
  sx?: object;
};

export function RelatoriosV4Analytic({ analytics, sx }: Props) {
  return (
    <Grid container spacing={3} sx={sx}>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsWidget
          title="Relatórios Gerados"
          total={analytics.totalRelatorios}
          icon={<Iconify icon="solar:document-bold-duotone" width={32} />}
          color="primary"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsWidget
          title="Relatórios Ativos"
          total={analytics.relatoriosAtivos}
          icon={<Iconify icon="solar:check-circle-bold-duotone" width={32} />}
          color="success"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsWidget
          title="Visualizações"
          total={analytics.totalAcessos}
          icon={<Iconify icon="solar:eye-bold-duotone" width={32} />}
          color="info"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsWidget
          title="Taxa de Uso"
          total={analytics.mediaPerformance}
          unit="%"
          icon={<Iconify icon="solar:graph-new-bold-duotone" width={32} />}
          color="secondary"
        />
      </Grid>
    </Grid>
  );
}
