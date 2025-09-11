import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type ITerrenoTableFilters = {
  name: string;
  status: string;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type ITerrenoLocalizacao = {
  endereco: string;
  numero?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
};

export type ITerrenoProprietario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  avatarUrl: string;
  documento: string;
};

export type ITerrenoOwner = {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  document: string;
};

export type ITerrenoCaracteristicas = {
  area: number;
  formato: string;
  topografia: string;
  acesso: string;
  documentacao: string;
  restricoes?: string[];
};

export type ITerrenoItem = {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  area: number;
  preco: number;
  precoM2: number;
  status: string;
  tipo: string;
  createdAt: IDateValue;
  updatedAt: IDateValue;
  localizacao: ITerrenoLocalizacao;
  proprietario: ITerrenoProprietario;
  caracteristicas: ITerrenoCaracteristicas;
  imagens: string[];
  destaque: boolean;
  negociavel: boolean;
  observacoes?: string;
  corretor?: string;
  dimensoes?: string;
  preco_negociavel?: boolean;
  itu_anual?: number;
};
