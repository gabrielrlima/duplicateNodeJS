// ----------------------------------------------------------------------

// Tipos para estrutura hierárquica de comissões
export type TipoComissao = 'total_imobiliaria' | 'distribuicao_interna';
export type TipoProduto = 'imovel' | 'terreno' | 'empreendimento';
export type TipoParticipante =
  | 'imobiliaria'
  | 'corretor_principal'
  | 'corretor_suporte'
  | 'coordenador'
  | 'grupo'
  | 'captador';
export type StatusComissao = 'ativo' | 'inativo' | 'pendente';

// Nível 1: Comissão Total da Imobiliária
export type ComissaoTotalImobiliaria = {
  id: string;
  nome: string;
  descricao?: string;
  tipoProduto: TipoProduto;
  percentualTotal: number; // % total que a imobiliária recebe
  status: StatusComissao;
  // Regras específicas opcionais
  empreendimentoId?: string; // Para regras específicas por empreendimento
  produtoId?: string; // Para regras específicas por produto individual
  // Período de validade
  dataInicio?: Date;
  dataFim?: Date;
  createdAt: Date;
  updatedAt: Date;
};

// Participante Unificado (pode ser fixo ou variável)
export type ParticipanteComissao = {
  tipo: TipoParticipante;
  percentual: number; // % da comissão
  ativo: boolean; // Se está ativo no cálculo
  fixo: boolean; // Se é participante fixo ou variável
  obrigatorio: boolean; // Se é obrigatório ter esse participante
  grupoId?: string; // ID do grupo/equipe específico
  percentualMinimo?: number; // % mínimo garantido
  percentualMaximo?: number; // % máximo permitido
};

// Nível 2: Distribuição Interna (Rateio)
export type DistribuicaoInterna = {
  id: string;
  nome: string;
  descricao?: string;
  comissaoTotalId: string; // Referência à comissão total
  // Lista unificada de participantes
  participantes: ParticipanteComissao[];
  status: StatusComissao;
  createdAt: Date;
  updatedAt: Date;
};

// Tipo principal que pode ser qualquer um dos dois níveis
export type IComissaoItem = ComissaoTotalImobiliaria | DistribuicaoInterna;

// Type guards para diferenciar os tipos
export const isComissaoTotal = (item: IComissaoItem): item is ComissaoTotalImobiliaria =>
  'percentualTotal' in item && 'tipoProduto' in item;

export const isDistribuicaoInterna = (item: IComissaoItem): item is DistribuicaoInterna =>
  'comissaoTotalId' in item && 'participantes' in item;

export type IComissaoFilters = {
  status: string;
  tipo: string[];
  categoriaProduto: string[];
  tiposParticipante: string[];
  percentualMinimo: number | null;
  percentualMaximo: number | null;
};

export type IComissaoTableFilters = {
  nome: string;
  status: string;
  tipo: string[];
};

export type IComissaoTableFilterValue = string | string[];
