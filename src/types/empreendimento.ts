// ----------------------------------------------------------------------

export type IEmpreendimentoTableFilters = {
  tipos: string[];
  status: string[];
};

export type IEmpreendimentoFilters = {
  tipos: string[];
  status: string;
  caracteristicas: string[];
  cidade: string[];
  estado: string[];
  faixaPreco: string[];
  diferenciaisEdificio: string[];
  diferenciaisApartamento: string[];
  areaMinima: number | null;
  areaMaxima: number | null;
  precoMinimo: number | null;
  precoMaximo: number | null;
  tipoApartamento: string[];
  tipoSacada: string[];
  oportunidadesDisponiveis: string[];
  tiposUnidade: string[];
  beneficios: string[];
};

export type IEmpreendimentoInteressado = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type IEmpreendimentoConstrutora = {
  name: string;
  logo: string;
  phoneNumber: string;
  fullAddress: string;
};

export type IEmpreendimentoPreco = {
  type: string;
  valor: number;
  negociavel: boolean;
};

export type IEmpreendimentoPlanta = {
  id: string;
  nome: string;
  descricao?: string;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  suites?: number;
  preco?: {
    valor: number;
    negociavel: boolean;
  };
  imagens?: string[];
  disponivel: boolean;
  caracteristicas?: string[];
};

export type IEmpreendimentoItem = {
  id: string;
  nome: string;
  titulo: string;
  descricao: string;
  book?: string;
  avatar?: string;
  publish: string;
  status: string;
  caracteristicas: string[];
  totalVisualizacoes: number;
  tipoEmpreendimento: string;
  preco: IEmpreendimentoPreco;
  beneficios: string[];
  cidade: string;
  estado: string;
  diferenciaisEdificio: string[];
  diferenciaisApartamento: string[];
  tipoApartamento: string[];
  tipoSacada: string[];
  oportunidadesDisponiveis: string[];
  construtora: IEmpreendimentoConstrutora;
  criadoEm: string | null;
  tiposUnidade: string[];
  cronogramaEntrega: string[];
  dataEntrega: string | null;
  interessados: IEmpreendimentoInteressado[];
  plantas: IEmpreendimentoPlanta[];
};
