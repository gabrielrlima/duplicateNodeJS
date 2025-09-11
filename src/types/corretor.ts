// ----------------------------------------------------------------------

export type ICorretorStatus = 'ativo' | 'inativo' | 'ferias';

export type ICorretor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: ICorretorStatus;
  vendas: number;
  comissaoTotal: number;
  createdAt: Date | string;
  lastActivity?: Date | string;
  creci?: string;
  especialidade?: string;
  grupo?: string;
  meta?: number;
  performance?: number;
  leads?: number;
};

export type ICorretorTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type ICorretorTableFilterValue = string | Date | null;
