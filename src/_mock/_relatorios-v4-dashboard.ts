// ----------------------------------------------------------------------

export const _relatoriosV4DashboardData = {
  // Analytics for dashboard
  analytics: {
    totalRelatorios: 1247,
    relatoriosAtivos: 892,
    relatoriosDesativados: 156,
    relatoriosArquivados: 199,
    totalAcessos: 45832,
    mediaPerformance: 87,
    taxaConversao: 23.5,
    tempoMedioLeitura: 4.2,
  },

  // Status distribution for charts
  statusDistribution: [
    { label: 'Ativos', value: 892, color: '#00ab55', percentage: 71.5 },
    { label: 'Desativado', value: 156, color: '#ffab00', percentage: 12.5 },
    { label: 'Arquivados', value: 199, color: '#ff5630', percentage: 16.0 },
  ],

  // Type distribution
  typeDistribution: [
    { name: 'Vendas', value: 445, color: '#00ab55' },
    { name: 'Performance', value: 298, color: '#2065d1' },
    { name: 'Financeiro', value: 234, color: '#ffab00' },
    { name: 'Geral', value: 270, color: '#8c33ff' },
  ],

  // Monthly trend data
  monthlyTrend: [
    { month: 'Jan', relatorios: 145, acessos: 3200, performance: 82 },
    { month: 'Feb', relatorios: 167, acessos: 3800, performance: 85 },
    { month: 'Mar', relatorios: 189, acessos: 4200, performance: 88 },
    { month: 'Apr', relatorios: 201, acessos: 5100, performance: 91 },
    { month: 'May', relatorios: 223, acessos: 5800, performance: 89 },
    { month: 'Jun', relatorios: 245, acessos: 6500, performance: 93 },
    { month: 'Jul', relatorios: 267, acessos: 7200, performance: 95 },
  ],

  // Performance by type
  performanceByType: [
    { type: 'Vendas', performance: 92, color: '#00ab55' },
    { type: 'Performance', performance: 87, color: '#2065d1' },
    { type: 'Financeiro', performance: 84, color: '#ffab00' },
    { type: 'Geral', performance: 79, color: '#8c33ff' },
  ],

  // Top reports
  topReports: [
    {
      id: '1',
      name: 'Análise de Vendas Q2',
      type: 'vendas',
      status: 'ativo',
      views: 1247,
      performance: 94,
      lastAccess: new Date('2024-01-15T10:30:00Z'),
      trend: 'up',
    },
    {
      id: '2',
      name: 'Performance de Equipes',
      type: 'performance',
      status: 'ativo',
      views: 892,
      performance: 91,
      lastAccess: new Date('2024-01-14T14:45:00Z'),
      trend: 'up',
    },
    {
      id: '3',
      name: 'Fluxo de Caixa Mensal',
      type: 'financeiro',
      status: 'ativo',
      views: 756,
      performance: 88,
      lastAccess: new Date('2024-01-13T09:15:00Z'),
      trend: 'down',
    },
    {
      id: '4',
      name: 'Relatório Executivo',
      type: 'geral',
      status: 'ativo',
      views: 634,
      performance: 85,
      lastAccess: new Date('2024-01-12T16:20:00Z'),
      trend: 'up',
    },
    {
      id: '5',
      name: 'Análise de Mercado',
      type: 'vendas',
      status: 'desativados',
      views: 423,
      performance: 76,
      lastAccess: new Date('2024-01-11T11:00:00Z'),
      trend: 'down',
    },
  ],

  // User engagement metrics
  userEngagement: {
    totalUsers: 342,
    activeUsers: 287,
    newUsers: 45,
    returningUsers: 242,
    avgSessionDuration: 5.7,
    bounceRate: 18.5,
  },

  // Time-based insights
  timeInsights: {
    peakHours: [
      { hour: '09:00', usage: 85 },
      { hour: '10:00', usage: 92 },
      { hour: '11:00', usage: 78 },
      { hour: '14:00', usage: 88 },
      { hour: '15:00', usage: 95 },
      { hour: '16:00', usage: 82 },
    ],
    weekDays: [
      { day: 'Seg', reports: 156 },
      { day: 'Ter', reports: 189 },
      { day: 'Qua', reports: 201 },
      { day: 'Qui', reports: 178 },
      { day: 'Sex', reports: 234 },
      { day: 'Sáb', reports: 89 },
      { day: 'Dom', reports: 45 },
    ],
  },
};
