// Dados originais da dashboard com valores zerados
// Este arquivo mostra como seria a dashboard sem nenhum número cadastrado

// ----------------------------------------------------------------------

export const _dadosZeradosDashboard = {
  // Analytics para dashboard - TODOS ZERADOS
  analytics: {
    totalRelatorios: 0,
    relatoriosAtivos: 0,
    relatoriosDesativados: 0,
    relatoriosArquivados: 0,
    totalAcessos: 0,
    mediaPerformance: 0,
    taxaConversao: 0,
    tempoMedioLeitura: 0,
  },

  // Distribuição de status - TODOS ZERADOS
  statusDistribution: [
    { label: 'Ativos', value: 0, color: '#00ab55', percentage: 0 },
    { label: 'Desativado', value: 0, color: '#ffab00', percentage: 0 },
    { label: 'Arquivados', value: 0, color: '#ff5630', percentage: 0 },
  ],

  // Distribuição por tipo - TODOS ZERADOS
  typeDistribution: [
    { name: 'Vendas', value: 0, color: '#00ab55' },
    { name: 'Performance', value: 0, color: '#2065d1' },
    { name: 'Financeiro', value: 0, color: '#ffab00' },
    { name: 'Geral', value: 0, color: '#8c33ff' },
  ],

  // Tendência mensal - TODOS ZERADOS
  monthlyTrend: [
    { month: 'Jan', relatorios: 0, acessos: 0, performance: 0 },
    { month: 'Feb', relatorios: 0, acessos: 0, performance: 0 },
    { month: 'Mar', relatorios: 0, acessos: 0, performance: 0 },
    { month: 'Apr', relatorios: 0, acessos: 0, performance: 0 },
    { month: 'May', relatorios: 0, acessos: 0, performance: 0 },
    { month: 'Jun', relatorios: 0, acessos: 0, performance: 0 },
    { month: 'Jul', relatorios: 0, acessos: 0, performance: 0 },
  ],

  // Performance por tipo - TODOS ZERADOS
  performanceByType: [
    { type: 'Vendas', performance: 0, color: '#00ab55' },
    { type: 'Performance', performance: 0, color: '#2065d1' },
    { type: 'Financeiro', performance: 0, color: '#ffab00' },
    { type: 'Geral', performance: 0, color: '#8c33ff' },
  ],

  // Top relatórios - LISTA VAZIA
  topReports: [],

  // Engajamento de usuários - TODOS ZERADOS
  userEngagement: {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    returningUsers: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
  },

  // Insights de tempo - TODOS ZERADOS
  timeInsights: {
    peakHours: [
      { hour: '09:00', usage: 0 },
      { hour: '10:00', usage: 0 },
      { hour: '11:00', usage: 0 },
      { hour: '14:00', usage: 0 },
      { hour: '15:00', usage: 0 },
      { hour: '16:00', usage: 0 },
    ],
    weekDays: [
      { day: 'Seg', reports: 0 },
      { day: 'Ter', reports: 0 },
      { day: 'Qua', reports: 0 },
      { day: 'Qui', reports: 0 },
      { day: 'Sex', reports: 0 },
      { day: 'Sáb', reports: 0 },
      { day: 'Dom', reports: 0 },
    ],
  },
};

// Dados de vendas zerados
export const _vendasZeradas = {
  totalVendas: 0,
  vendasMes: 0,
  ticketMedio: 0,
  conversao: 0,
  vendedores: [],
  produtos: [],
  clientes: [],
};

// Dados de propriedades zerados
export const _propriedadesZeradas = {
  totalPropriedades: 0,
  propriedadesAtivas: 0,
  propriedadesVendidas: 0,
  propriedadesAlugadas: 0,
  valorMedio: 0,
  propriedades: [],
};

// Dados de overview zerados
export const _overviewZerado = {
  salesFunnelData: [],
  analyticTasks: [],
  analyticPosts: [],
  analyticTraffic: [
    { value: 'facebook', label: 'Facebook', total: 0 },
    { value: 'google', label: 'Google', total: 0 },
    { value: 'linkedin', label: 'Linkedin', total: 0 },
    { value: 'twitter', label: 'Twitter', total: 0 },
  ],
  ecommerceSalesOverview: [
    { label: 'Total profit', totalAmount: 0, value: 0 },
    { label: 'Total income', totalAmount: 0, value: 0 },
    { label: 'Total expenses', totalAmount: 0, value: 0 },
  ],
  bankingContacts: [],
  bankingCreditCard: [],
  bankingRecentTransitions: [],
  bookings: [],
  bookingsOverview: [
    { status: 'Pending', quantity: 0, value: 0 },
    { status: 'Canceled', quantity: 0, value: 0 },
    { status: 'Sold', quantity: 0, value: 0 },
  ],
};

// Dados de preços originais (do arquivo assets.ts)
export const _precosOriginais = [
  83.74, 97.14, 68.71, 85.21, 52.17, 25.18, 43.84, 60.98, 98.42, 53.37, 72.75, 56.61, 64.55, 77.32,
  60.62, 79.81, 93.68, 47.44, 76.24, 92.87, 72.91, 20.54, 94.25, 37.51,
];

// Dados de números nativos originais
export const _numerosOriginais = {
  nativeS: [11, 10, 7, 10, 12, 5, 10, 1, 8, 8, 10, 11, 12, 8, 4, 11, 8, 9, 4, 9, 2, 6, 3, 7],
  nativeM: [
    497, 763, 684, 451, 433, 463, 951, 194, 425, 435, 807, 521, 538, 839, 394, 269, 453, 821, 364,
    849, 804, 776, 263, 239,
  ],
  nativeL: [
    9911, 1947, 9124, 6984, 8488, 2034, 3364, 8401, 8996, 5271, 8478, 1139, 8061, 3035, 6733, 3952,
    2405, 3127, 6843, 4672, 6995, 6053, 5192, 9686,
  ],
};

// Dados de percentuais originais
export const _percentuaisOriginais = [
  10.1, 13.6, 28.2, 42.1, 37.2, 18.5, 40.1, 94.8, 91.4, 53.0, 25.4, 62.9, 86.6, 62.4, 35.4, 17.6,
  52.0, 6.8, 95.3, 26.6, 69.9, 92.1, 46.2, 85.6,
];

// Dados de ratings originais
export const _ratingsOriginais = [
  4.2, 3.7, 4.5, 3.5, 0.5, 3.0, 2.5, 2.8, 4.9, 3.6, 2.5, 1.7, 3.9, 2.8, 4.1, 4.5, 2.2, 3.2, 0.6,
  1.3, 3.8, 3.8, 3.8, 2.0,
];
