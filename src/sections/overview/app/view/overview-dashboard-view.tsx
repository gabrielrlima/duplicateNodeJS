import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { Iconify } from 'src/components/iconify';

import DashboardStatsCard from '../components/dashboard-stats-card';
import DashboardSalesChart from '../components/dashboard-sales-chart';
import DashboardRecentActivity from '../components/dashboard-recent-activity';

// ----------------------------------------------------------------------

// Função para gerar dados baseados na imobiliária selecionada
const getStatsDataForRealEstate = (realEstateId: string | null) => {
  // Se não há imobiliária selecionada, retornar dados zerados
  if (!realEstateId) {
    return [
      {
        title: 'Produtos cadastrados',
        value: 0,
        icon: 'solar:home-bold-duotone',
        color: 'grey' as const,
        trend: { value: 0, label: 'sem dados suficiente' },
      },
      {
        title: 'Clientes Ativos',
        value: 0,
        icon: 'solar:users-group-rounded-bold-duotone',
        color: 'grey' as const,
        trend: { value: 0, label: 'sem dados suficiente' },
      },
      {
        title: 'Vendas do Mês',
        value: 'R$ 0',
        icon: 'solar:cart-check-bold-duotone',
        color: 'grey' as const,
        trend: { value: 0, label: 'sem dados suficiente' },
      },
      {
        title: 'Leads Capturados',
        value: 0,
        icon: 'solar:star-bold-duotone',
        color: 'grey' as const,
        trend: { value: 0, label: 'sem dados suficiente' },
      },
    ];
  }

  // TODO: Aqui seria feita a busca real dos dados da imobiliária
  // Por enquanto, retornando dados mock para demonstração
  return [
    {
      title: 'Produtos cadastrados',
      value: 0,
      icon: 'solar:home-bold-duotone',
      color: 'grey' as const,
      trend: { value: 0, label: 'sem dados suficiente' },
    },
    {
      title: 'Clientes Ativos',
      value: 0,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'grey' as const,
      trend: { value: 0, label: 'sem dados suficiente' },
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 0',
      icon: 'solar:cart-check-bold-duotone',
      color: 'grey' as const,
      trend: { value: 0, label: 'sem dados suficiente' },
    },
    {
      title: 'Leads Capturados',
      value: 0,
      icon: 'solar:star-bold-duotone',
      color: 'grey' as const,
      trend: { value: 0, label: 'sem dados suficiente' },
    },
  ];
};

const getSalesChartDataForRealEstate = (realEstateId: string | null) => {
  // Se não há imobiliária selecionada, retornar dados zerados
  if (!realEstateId) {
    return {
      colors: ['#FF9800', '#1976D2'],
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      series: [
        {
          name: 'Atendimentos',
          data: [0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Vendas',
          data: [0, 0, 0, 0, 0, 0],
        },
      ],
    };
  }

  // TODO: Aqui seria feita a busca real dos dados da imobiliária
  // Por enquanto, retornando dados zerados
  return {
    colors: ['#FF9800', '#1976D2'],
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    series: [
      {
        name: 'Atendimentos',
        data: [0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Vendas',
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
  };
};

const getRecentActivitiesForRealEstate = (realEstateId: string | null) => {
  // Se não há imobiliária selecionada, retornar array vazio
  if (!realEstateId) {
    return [];
  }

  // TODO: Aqui seria feita a busca real das atividades da imobiliária
  // Por enquanto, retornando array vazio para mostrar a mensagem de "sem atividades"
  return [];
};

export default function OverviewDashboardView() {
  const theme = useTheme();
  const { currentRealEstate } = useRealEstateContext();

  // Gerar dados baseados na imobiliária selecionada
  const statsData = getStatsDataForRealEstate(currentRealEstate?.id || null);
  const salesChartData = getSalesChartDataForRealEstate(currentRealEstate?.id || null);
  const recentActivities = getRecentActivitiesForRealEstate(currentRealEstate?.id || null);

  const quickActions = [
    {
      title: 'Cadastrar Imóvel',
      description: 'Adicione um novo imóvel ao sistema',
      icon: 'solar:home-add-bold-duotone',
      color: 'grey' as const,
      path: paths.dashboard.property.new,
    },
    {
      title: 'Novo Atendimento',
      description: 'Cadastre um novo cliente',
      icon: 'solar:user-plus-bold-duotone',
      color: 'grey' as const,
      path: paths.dashboard.client.new,
    },
    {
      title: 'Capturar Lead',
      description: 'Registre um novo lead',
      icon: 'solar:star-bold-duotone',
      color: 'grey' as const,
      path: paths.dashboard.lead.new,
    },
  ];

  return (
    <DashboardContent>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Visão Geral
          </Typography>
          <Grid container spacing={3}>
            {statsData.map((stat) => (
              <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardStatsCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  trend={stat.trend}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sales Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <DashboardSalesChart
            title="Desempenho Comercial"
            subheader="Atendimentos e vendas nos últimos 6 meses"
            chart={salesChartData}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardRecentActivity title="Atividades Recentes" activities={recentActivities} />
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ações Rápidas
              </Typography>

              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid key={action.title} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      component={RouterLink}
                      href={action.path}
                      variant="outlined"
                      size="large"
                      startIcon={<Iconify icon={action.icon} width={20} />}
                      sx={{
                        width: '100%',
                        height: 56,
                        justifyContent: 'flex-start',
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          borderColor: theme.palette.text.secondary,
                        },
                      }}
                    >
                      {action.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
