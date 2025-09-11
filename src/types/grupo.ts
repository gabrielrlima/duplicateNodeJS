// ----------------------------------------------------------------------

export type IGrupoStatus = 'ativo' | 'inativo' | 'suspenso';

export type IGrupo = {
  id: string;
  avatarUrl?: string | null;
  name: string;
  description: string;
  leader: string;
  leaderId: string;
  members: number;
  status: IGrupoStatus;
  createdAt: Date | string;
  lastActivity?: Date | string;
  meta?: number;
  performance?: number;
  vendas?: number;
  comissaoTotal?: number;
  tipo?: string;
  regiao?: string;
};

export type IGrupoTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type IGrupoTableFilterValue = string | Date | null;
