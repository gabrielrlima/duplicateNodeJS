import type { IRelatorio } from 'src/types/relatorios';

import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const today = dayjs();

export const _relatorios: IRelatorio[] = [
  {
    id: 'rel-001',
    name: 'Relatório de Vendas Mensal',
    description: 'Análise detalhada das vendas do mês com métricas de performance',
    type: 'vendas',
    status: 'ativo',
    createdAt: today.subtract(5, 'day').toDate(),
    updatedAt: today.subtract(2, 'day').toDate(),
    createdBy: 'João Silva',
    lastAccessedAt: today.subtract(1, 'day').toDate(),
    parameters: {
      dateRange: {
        startDate: today.subtract(30, 'day').toDate(),
        endDate: today.toDate(),
      },
      filters: {
        region: 'Sudeste',
        segment: 'Residencial',
      },
    },
    metrics: {
      totalVendas: 145,
      totalCommission: 125000,
      totalCorretores: 12,
      totalImoveis: 89,
      performance: 87.5,
      conversionRate: 23.5,
    },
  },
  {
    id: 'rel-002',
    name: 'Performance da Equipe',
    description: 'Dashboard de performance dos corretores por região',
    type: 'performance',
    status: 'ativo',
    createdAt: today.subtract(10, 'day').toDate(),
    updatedAt: today.subtract(3, 'day').toDate(),
    createdBy: 'Maria Santos',
    lastAccessedAt: today.subtract(1, 'day').toDate(),
    parameters: {
      dateRange: {
        startDate: today.subtract(60, 'day').toDate(),
        endDate: today.toDate(),
      },
      filters: {
        team: 'Equipe Alpha',
      },
    },
    metrics: {
      totalVendas: 267,
      totalCommission: 245000,
      totalCorretores: 8,
      totalImoveis: 156,
      performance: 92.3,
      conversionRate: 31.2,
    },
  },
  {
    id: 'rel-003',
    name: 'Análise Financeira Trimestral',
    description: 'Relatório financeiro completo com projeções',
    type: 'financeiro',
    status: 'desativados',
    createdAt: today.subtract(2, 'day').toDate(),
    updatedAt: today.subtract(1, 'day').toDate(),
    createdBy: 'Carlos Oliveira',
    lastAccessedAt: today.subtract(1, 'day').toDate(),
    parameters: {
      dateRange: {
        startDate: today.subtract(90, 'day').toDate(),
        endDate: today.toDate(),
      },
      filters: {
        segment: 'Comercial',
      },
    },
    metrics: {
      totalVendas: 89,
      totalCommission: 89000,
      totalCorretores: 15,
      totalImoveis: 45,
      performance: 78.9,
      conversionRate: 18.7,
    },
  },
  {
    id: 'rel-004',
    name: 'Dashboard Geral de Vendas',
    description: 'Visão geral consolidada de todas as vendas',
    type: 'geral',
    status: 'ativo',
    createdAt: today.subtract(15, 'day').toDate(),
    updatedAt: today.subtract(5, 'day').toDate(),
    createdBy: 'Ana Costa',
    lastAccessedAt: today.subtract(1, 'day').toDate(),
    parameters: {
      dateRange: {
        startDate: today.subtract(180, 'day').toDate(),
        endDate: today.toDate(),
      },
      filters: {},
    },
    metrics: {
      totalVendas: 512,
      totalCommission: 445000,
      totalCorretores: 25,
      totalImoveis: 234,
      performance: 85.2,
      conversionRate: 27.8,
    },
  },
  {
    id: 'rel-005',
    name: 'Relatório Regional',
    description: 'Análise de performance por região geográfica',
    type: 'performance',
    status: 'arquivado',
    createdAt: today.subtract(45, 'day').toDate(),
    updatedAt: today.subtract(30, 'day').toDate(),
    createdBy: 'Pedro Lima',
    lastAccessedAt: today.subtract(25, 'day').toDate(),
    parameters: {
      dateRange: {
        startDate: today.subtract(365, 'day').toDate(),
        endDate: today.subtract(180, 'day').toDate(),
      },
      filters: {
        region: 'Nordeste',
      },
    },
    metrics: {
      totalVendas: 234,
      totalCommission: 189000,
      totalCorretores: 18,
      totalImoveis: 123,
      performance: 81.4,
      conversionRate: 22.1,
    },
  },
];

export const _relatoriosAnalytics = {
  totalRelatorios: 45,
  relatoriosAtivos: 28,
  relatoriosDesativados: 12,
  relatoriosArquivados: 5,
  totalAcessos: 1234,
  mediaPerformance: 85.6,
};
