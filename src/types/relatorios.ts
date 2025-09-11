// ----------------------------------------------------------------------

export type IRelatorioStatus = 'ativo' | 'inativo' | 'desativados' | 'arquivado';

export type IRelatorioType = 'vendas' | 'performance' | 'financeiro' | 'geral';

// ----------------------------------------------------------------------

export interface IRelatorio {
  id: string;
  name: string;
  description: string;
  type: IRelatorioType;
  status: IRelatorioStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastAccessedAt: Date;
  parameters: IRelatorioParameters;
  metrics: IRelatorioMetrics;
}

export interface IRelatorioParameters {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  filters: {
    region?: string;
    segment?: string;
    team?: string;
    corretor?: string;
  };
}

export interface IRelatorioMetrics {
  totalVendas: number;
  totalCommission: number;
  totalCorretores: number;
  totalImoveis: number;
  performance: number;
  conversionRate: number;
}

// ----------------------------------------------------------------------

export interface IRelatorioTableFilters {
  name: string;
  type: string[];
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

export type IRelatorioTableFilterValue = string | string[] | Date | null;

// ----------------------------------------------------------------------

export interface IRelatoriosAnalytic {
  totalRelatorios: number;
  relatoriosAtivos: number;
  relatoriosDesativados: number;
  relatoriosArquivados: number;
  totalAcessos: number;
  mediaPerformance: number;
}
