import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
};

export default function DashboardSalesChart({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  // Verificar se há dados no gráfico
  const hasData = chart.series && chart.series.length > 0 && chart.series.some(serie => 
    serie.data && serie.data.length > 0 && serie.data.some(value => value > 0)
  );

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.primary.dark, 0.24),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}: ` },
      },
    },
    xaxis: { categories: chart.categories },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: { fontSize: '10px', colors: ['#FFFFFF', theme.palette.text.primary] },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: '48%',
        dataLabels: { position: 'top' },
      },
    },
    ...chart.options,
  });

  return (
    <Card
      sx={{
        height: 480,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
        ...sx,
      }}
      {...other}
    >
      <CardHeader title={title} subheader={subheader} />

      {hasData ? (
        <Chart
          type="bar"
          series={chart.series}
          options={chartOptions}
          slotProps={{ loading: { p: 2.5 } }}
          sx={{
            pl: 1,
            py: 2.5,
            pr: 2.5,
            height: 360,
          }}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 360,
            color: 'text.disabled',
          }}
        >
          <Iconify icon="solar:chart-2-bold-duotone" width={48} sx={{ mb: 2 }} />
          <Typography variant="body2">Não existe dados de desempenho registrados</Typography>
        </Box>
      )}
    </Card>
  );
}
