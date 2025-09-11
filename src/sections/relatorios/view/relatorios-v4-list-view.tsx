import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { _dadosZeradosDashboard } from 'src/_mock/_dados-zerados';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DashboardStatsCard from '../../overview/app/components/dashboard-stats-card';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function RelatoriosV4ListView() {
  const [filterValue, setFilterValue] = useState('visao-geral');
  const [periodFilter, setPeriodFilter] = useState('30-dias');
  const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [customEndDate, setCustomEndDate] = useState<Dayjs | null>(dayjs());

  const handleFilterChange = (event: any) => {
    setFilterValue(event.target.value);
  };

  const handlePeriodChange = (event: any) => {
    const value = event.target.value;
    setPeriodFilter(value);

    // Atualizar datas baseado na seleção
    const today = dayjs();
    switch (value) {
      case '7-dias':
        setCustomStartDate(today.subtract(7, 'day'));
        setCustomEndDate(today);
        break;
      case '30-dias':
        setCustomStartDate(today.subtract(30, 'day'));
        setCustomEndDate(today);
        break;
      case '90-dias':
        setCustomStartDate(today.subtract(90, 'day'));
        setCustomEndDate(today);
        break;
      case '1-ano':
        setCustomStartDate(today.subtract(1, 'year'));
        setCustomEndDate(today);
        break;
      case 'personalizado':
        // Manter as datas atuais para período personalizado
        break;
      default:
        break;
    }
  };

  // Função para ajustar dados baseado no período selecionado
  const adjustDataByPeriod = (baseValue: number | string, isPercentage = false) => {
    if (typeof baseValue === 'string') {
      // Para valores monetários (R$ X.XM, R$ XXXk)
      const numericValue = parseFloat(
        baseValue
          .replace(/[R$\s]/g, '')
          .replace('M', '')
          .replace('K', '')
          .replace('k', '')
      );
      let multiplier = 1;

      switch (periodFilter) {
        case '7-dias':
          multiplier = 0.25; // ~1/4 do valor mensal
          break;
        case '30-dias':
          multiplier = 1; // valor base
          break;
        case '90-dias':
          multiplier = 3; // 3 meses
          break;
        case '1-ano':
          multiplier = 12; // 12 meses
          break;
        case 'personalizado':
          // Calcular baseado na diferença de dias
          if (customStartDate && customEndDate) {
            const days = customEndDate.diff(customStartDate, 'day');
            multiplier = days / 30; // proporção baseada em 30 dias
          } else {
            multiplier = 1;
          }
          break;
        default:
          multiplier = 1;
          break;
      }

      const adjustedValue = numericValue * multiplier;
      if (baseValue.includes('M')) {
        return adjustedValue >= 1
          ? `R$ ${adjustedValue.toFixed(1)}M`
          : `R$ ${(adjustedValue * 1000).toFixed(0)}K`;
      } else if (baseValue.includes('K') || baseValue.includes('k')) {
        return `R$ ${adjustedValue.toFixed(0)}K`;
      }
      return `R$ ${adjustedValue.toFixed(2)}`;
    } else {
      // Para valores numéricos
      let multiplier = 1;

      switch (periodFilter) {
        case '7-dias':
          multiplier = isPercentage ? 0.8 : 0.25; // Percentuais reduzem menos
          break;
        case '30-dias':
          multiplier = 1;
          break;
        case '90-dias':
          multiplier = isPercentage ? 1.2 : 3;
          break;
        case '1-ano':
          multiplier = isPercentage ? 1.5 : 12;
          break;
        case 'personalizado':
          if (customStartDate && customEndDate) {
            const days = customEndDate.diff(customStartDate, 'day');
            multiplier = isPercentage ? Math.min(1 + days / 365, 2) : days / 30;
          } else {
            multiplier = 1;
          }
          break;
        default:
          multiplier = 1;
          break;
      }

      const result = Math.round(baseValue * multiplier);
      return isPercentage ? `${result}%` : result;
    }
  };

  // Mock data for statistics cards with trend comparison - USANDO DADOS ZERADOS
  const getStatsData = () => {
    const visaoGeralData = [
      {
        title: 'Vendas Realizadas',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.totalRelatorios),
        icon: 'solar:cart-check-bold-duotone',
        color: 'primary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Receita Gerada',
        value: 'R$ 0',
        icon: 'solar:dollar-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Comissões Geradas',
        value: 'R$ 0',
        icon: 'solar:wallet-money-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Taxa de Conversão',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.taxaConversao, true),
        icon: 'solar:target-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Leads Convertidos',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.relatoriosAtivos),
        icon: 'solar:user-check-bold-duotone',
        color: 'secondary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Pipelines Ganhos',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.relatoriosDesativados),
        icon: 'solar:graph-up-bold-duotone',
        color: 'grey' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Ciclo da Venda',
        value: '0 dias',
        icon: 'solar:clock-circle-bold-duotone',
        color: 'primary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Novos Clientes',
        value: adjustDataByPeriod(_dadosZeradosDashboard.userEngagement.newUsers),
        icon: 'solar:users-group-two-rounded-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Taxa de Cancelamento',
        value: adjustDataByPeriod(0, true),
        icon: 'solar:close-circle-bold-duotone',
        color: 'error' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Valor Total em Pipeline',
        value: 'R$ 0',
        icon: 'solar:pie-chart-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Meta vs Realizado',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.mediaPerformance, true),
        icon: 'solar:target-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
    ];

    const painelPipelinesData = [
      {
        title: 'Cadastros Criados',
        value: adjustDataByPeriod(_dadosZeradosDashboard.userEngagement.totalUsers),
        icon: 'solar:user-plus-bold-duotone',
        color: 'primary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Pipeline de Ganhos',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.relatoriosAtivos),
        icon: 'solar:graph-up-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Pipeline Perdidos',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.relatoriosArquivados),
        icon: 'solar:graph-down-bold-duotone',
        color: 'error' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Lançamentos Cadastrados',
        value: adjustDataByPeriod(0),
        icon: 'solar:buildings-2-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Vendas Realizadas',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.totalRelatorios),
        icon: 'solar:cart-check-bold-duotone',
        color: 'primary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Comissões Geradas',
        value: 'R$ 0',
        icon: 'solar:wallet-money-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Leads Convertidos',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.relatoriosAtivos),
        icon: 'solar:user-check-bold-duotone',
        color: 'secondary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Ciclo da Venda',
        value: '0 dias',
        icon: 'solar:clock-circle-bold-duotone',
        color: 'grey' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Taxa de Cancelamento',
        value: adjustDataByPeriod(0, true),
        icon: 'solar:close-circle-bold-duotone',
        color: 'error' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Valor Total em Pipeline',
        value: 'R$ 0',
        icon: 'solar:pie-chart-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Meta vs Realizado',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.mediaPerformance, true),
        icon: 'solar:target-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
    ];

    const painelEventosData = [
      {
        title: 'Visitas Agendadas',
        value: adjustDataByPeriod(0),
        icon: 'solar:calendar-add-bold-duotone',
        color: 'primary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Visitas Canceladas',
        value: adjustDataByPeriod(0),
        icon: 'solar:calendar-cross-bold-duotone',
        color: 'error' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Visitas Concluídas',
        value: adjustDataByPeriod(0),
        icon: 'solar:calendar-check-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Cliente Desmarcou',
        value: adjustDataByPeriod(0),
        icon: 'solar:user-cross-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Corretor Desmarcou',
        value: adjustDataByPeriod(0),
        icon: 'solar:user-block-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Taxa de Cancelamento',
        value: adjustDataByPeriod(0, true),
        icon: 'solar:close-circle-bold-duotone',
        color: 'error' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Valor Total em Pipeline',
        value: 'R$ 0',
        icon: 'solar:pie-chart-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Meta vs Realizado',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.mediaPerformance, true),
        icon: 'solar:target-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
    ];

    const gruposData = [
      {
        title: 'Total de Grupos',
        value: adjustDataByPeriod(0),
        icon: 'solar:users-group-two-rounded-bold-duotone',
        color: 'primary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Grupos Ativos',
        value: adjustDataByPeriod(0),
        icon: 'solar:check-circle-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Performance Média',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.mediaPerformance, true),
        icon: 'solar:chart-2-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Vendas Totais',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.totalRelatorios),
        icon: 'solar:cart-check-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Comissão Total',
        value: 'R$ 0',
        icon: 'solar:wallet-money-bold-duotone',
        color: 'secondary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Membros Totais',
        value: adjustDataByPeriod(_dadosZeradosDashboard.userEngagement.totalUsers),
        icon: 'solar:user-bold-duotone',
        color: 'grey' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Taxa de Cancelamento',
        value: adjustDataByPeriod(0, true),
        icon: 'solar:close-circle-bold-duotone',
        color: 'error' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Valor Total em Pipeline',
        value: 'R$ 0',
        icon: 'solar:pie-chart-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Meta vs Realizado',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.mediaPerformance, true),
        icon: 'solar:target-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Grupos que Bateram Meta',
        value: '0 de 0',
        icon: 'solar:medal-star-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
    ];

    const corretoresData = [
      {
        title: 'Total de Corretores',
        value: adjustDataByPeriod(_dadosZeradosDashboard.userEngagement.totalUsers),
        icon: 'solar:user-id-bold-duotone',
        color: 'primary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Corretores Ativos',
        value: adjustDataByPeriod(_dadosZeradosDashboard.userEngagement.activeUsers),
        icon: 'solar:user-check-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Performance Média',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.mediaPerformance, true),
        icon: 'solar:chart-2-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Vendas Totais',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.totalRelatorios),
        icon: 'solar:cart-check-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Comissão Total',
        value: 'R$ 0',
        icon: 'solar:wallet-money-bold-duotone',
        color: 'secondary' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Leads Totais',
        value: adjustDataByPeriod(_dadosZeradosDashboard.userEngagement.newUsers),
        icon: 'solar:user-plus-bold-duotone',
        color: 'grey' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Taxa de Cancelamento',
        value: adjustDataByPeriod(0, true),
        icon: 'solar:close-circle-bold-duotone',
        color: 'error' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Valor Total em Pipeline',
        value: 'R$ 0',
        icon: 'solar:pie-chart-bold-duotone',
        color: 'info' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Meta vs Realizado',
        value: adjustDataByPeriod(_dadosZeradosDashboard.analytics.mediaPerformance, true),
        icon: 'solar:target-bold-duotone',
        color: 'success' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
      {
        title: 'Corretores que Bateram Meta',
        value: '0 de 0',
        icon: 'solar:medal-star-bold-duotone',
        color: 'warning' as const,
        trend: {
          value: 0,
          label: `vs período anterior`,
        },
      },
    ];

    if (filterValue === 'painel-pipelines') {
      return painelPipelinesData;
    }

    if (filterValue === 'painel-eventos') {
      return painelEventosData;
    }

    if (filterValue === 'grupos') {
      return gruposData;
    }

    if (filterValue === 'corretores') {
      return corretoresData;
    }

    return visaoGeralData;
  };

  const statsData = getStatsData();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Relatórios"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Relatórios', href: paths.dashboard.relatorios.root },
          { name: 'Lista' },
        ]}
        action={
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:export-bold" />}
              sx={{
                minWidth: 'auto',
                px: 2,
                '& .MuiButton-startIcon': {
                  mr: 1,
                },
              }}
            >
              Exportar
            </Button>
          </Box>
        }
        sx={{ mb: { xs: 2, sm: { xs: 3, md: 5 } } }}
      />

      <Box sx={{ mb: { xs: 3, md: 5 }, display: { xs: 'block', sm: 'none' } }}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:export-bold" />}
          fullWidth
          sx={{
            '& .MuiButton-startIcon': {
              mr: 1,
            },
          }}
        >
          Exportar
        </Button>
      </Box>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Relatórios
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Aqui você pode gerenciar seus relatórios.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-label">Filtrar por</InputLabel>
              <Select
                labelId="filter-label"
                value={filterValue}
                label="Filtrar por"
                onChange={handleFilterChange}
              >
                <MenuItem value="visao-geral">Visão geral</MenuItem>
                <MenuItem value="painel-pipelines">Painel de pipelines</MenuItem>
                <MenuItem value="painel-eventos">Painel de eventos</MenuItem>
                <MenuItem value="grupos">Grupos</MenuItem>
                <MenuItem value="corretores">Corretores</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="period-label">Período</InputLabel>
              <Select
                labelId="period-label"
                value={periodFilter}
                label="Período"
                onChange={handlePeriodChange}
              >
                <MenuItem value="7-dias">Últimos 7 dias</MenuItem>
                <MenuItem value="30-dias">Últimos 30 dias</MenuItem>
                <MenuItem value="90-dias">Últimos 90 dias</MenuItem>
                <MenuItem value="1-ano">Último ano</MenuItem>
                <MenuItem value="personalizado">Período personalizado</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {periodFilter === 'personalizado' && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={1}>
                <DatePicker
                  label="Data início"
                  value={customStartDate}
                  onChange={(newValue) => setCustomStartDate(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 140 },
                    },
                  }}
                />
                <DatePicker
                  label="Data fim"
                  value={customEndDate}
                  onChange={(newValue) => setCustomEndDate(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 140 },
                    },
                  }}
                />
              </Stack>
            </LocalizationProvider>
          )}
        </Stack>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {statsData.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
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
    </DashboardContent>
  );
}
