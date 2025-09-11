import type { IRelatorio } from 'src/types/relatorios';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { _relatorios, _relatoriosAnalytics } from 'src/_mock/_relatorios';

import { Chart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function RelatoriosEnhancedDashboard() {
  const [reports] = useState<IRelatorio[]>(_relatorios);
  const analytics = _relatoriosAnalytics;

  const recentReports = reports.slice(0, 6);
  const topPerforming = reports.filter((r) => (r.metrics?.performance || 0) > 85).slice(0, 4);

  const engagementData = [
    { name: 'Visualizações', data: [120, 150, 180, 220, 280, 350, 420, 380, 450, 520, 480, 550] },
    { name: 'Downloads', data: [45, 60, 75, 90, 110, 135, 160, 145, 170, 190, 175, 200] },
    { name: 'Compartilhamentos', data: [12, 18, 25, 32, 40, 48, 55, 50, 58, 65, 60, 70] },
  ];

  const categoryData = [
    { category: 'Vendas', count: 445, growth: 12.5, color: '#00ab55' },
    { category: 'Performance', count: 298, growth: 8.3, color: '#2065d1' },
    { category: 'Financeiro', count: 234, growth: -2.1, color: '#ffab00' },
    { category: 'Geral', count: 270, growth: 15.7, color: '#8c33ff' },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Dashboard Inteligente de Relatórios"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Relatórios', href: paths.dashboard.relatorios.root },
          { name: 'Análise Visual' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              component={RouterLink}
              href={paths.dashboard.relatorios.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Criar Relatório
            </Button>
          </Stack>
        }
      />

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              height: 160,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.200',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'grey.300',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:document-bold-duotone" width={24} sx={{ color: 'grey.700' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 600, mb: 0.5 }}>
                  {analytics.totalRelatorios.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 500 }}>
                  Total de Relatórios
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              height: 160,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.200',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'grey.300',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="solar:graph-new-bold-duotone"
                  width={24}
                  sx={{ color: 'grey.700' }}
                />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 600, mb: 0.5 }}>
                  87%
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 500 }}>
                  Performance Média
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              height: 160,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.200',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'grey.300',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:eye-bold-duotone" width={24} sx={{ color: 'grey.700' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 600, mb: 0.5 }}>
                  45.8K
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 500 }}>
                  Visualizações
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              height: 160,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.200',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'grey.300',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="solar:clock-circle-bold-duotone"
                  width={24}
                  sx={{ color: 'grey.700' }}
                />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 600, mb: 0.5 }}>
                  4.2 min
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 500 }}>
                  Tempo Médio
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Performance Overview */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              p: 3,
              height: 400,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'grey.300',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
            >
              <Typography variant="h6" sx={{ color: 'grey.900', fontWeight: 600 }}>
                Engajamento ao Longo do Tempo
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Visualizações"
                  size="small"
                  sx={{
                    bgcolor: 'grey.100',
                    color: 'grey.800',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                />
                <Chip
                  label="Downloads"
                  size="small"
                  sx={{
                    bgcolor: 'grey.100',
                    color: 'grey.800',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                />
                <Chip
                  label="Compartilhamentos"
                  size="small"
                  sx={{
                    bgcolor: 'grey.100',
                    color: 'grey.800',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                />
              </Stack>
            </Box>
            <Chart
              type="line"
              series={engagementData}
              options={{
                xaxis: {
                  categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                },
                colors: ['#374151', '#6b7280', '#9ca3af'],
                stroke: { curve: 'smooth', width: 3 },
                markers: { size: 5 },
                grid: { strokeDashArray: 3 },
                legend: { show: false },
                yaxis: {
                  labels: { formatter: (value) => `${value}` },
                },
              }}
            />
          </Card>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              p: 3,
              height: 400,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'grey.300',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'grey.900', fontWeight: 600 }}>
              Distribuição por Status
            </Typography>
            <Chart
              type="donut"
              series={[892, 156, 199]}
              options={{
                labels: ['Ativos', 'Desativado', 'Arquivados'],
                colors: ['#6b7280', '#9ca3af', '#d1d5db'],
                legend: { position: 'bottom' },
                dataLabels: { enabled: false },
                plotOptions: {
                  pie: {
                    donut: {
                      size: '60%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Total',
                          formatter: () => '1,247',
                        },
                      },
                    },
                  },
                },
              }}
            />
          </Card>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              p: 3,
              height: 350,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'grey.300',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'grey.900', fontWeight: 600 }}>
              Desempenho por Categoria
            </Typography>
            <Stack spacing={2}>
              {categoryData.map((item) => (
                <Box key={item.category}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'grey.900' }}>
                      {item.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>
                      {item.count.toLocaleString()} relatórios
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((item.count / 500) * 100, 100)}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'grey.600',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'grey.600', fontWeight: 500 }}>
                      {item.growth > 0 ? '+' : ''}
                      {item.growth}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Atividade Recente
            </Typography>
            <Stack spacing={2}>
              {recentReports.map((report) => (
                <Box key={report.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor:
                        report.type === 'vendas'
                          ? 'success.main'
                          : report.type === 'performance'
                            ? 'info.main'
                            : report.type === 'financeiro'
                              ? 'warning.main'
                              : 'secondary.main',
                    }}
                  >
                    <Iconify
                      icon={
                        report.type === 'vendas'
                          ? 'solar:trend-up-bold-duotone'
                          : report.type === 'performance'
                            ? 'solar:graph-new-bold-duotone'
                            : report.type === 'financeiro'
                              ? 'solar:wallet-bold-duotone'
                              : 'solar:document-bold-duotone'
                      }
                      width={20}
                    />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {report.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {report.metrics?.totalVendas || 0} vendas • {report.type}
                    </Typography>
                  </Box>
                  <Chip
                    label={report.status}
                    size="small"
                    color={
                      report.status === 'ativo'
                        ? 'success'
                        : report.status === 'desativados'
                          ? 'warning'
                          : 'default'
                    }
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Top Performing Reports */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Relatórios de Alto Desempenho
            </Typography>
            <Grid container spacing={2}>
              {topPerforming.map((report) => (
                <Grid item xs={12} md={6} lg={3} key={report.id}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {report.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="success.main">
                          {report.metrics?.performance || 0}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          performance
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {report.metrics?.totalVendas || 0} vendas
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={report.metrics?.performance || 0}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'success.main',
                          },
                        }}
                      />
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
