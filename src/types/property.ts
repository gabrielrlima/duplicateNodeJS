import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IPropertyTableFilters = {
  name: string;
  status: string;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IPropertyLocalizacao = {
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
};

export type IPropertyProprietario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  avatarUrl: string;
  documento: string;
};

export type IPropertyOwner = {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  document: string;
};

export type IPropertyCaracteristicas = {
  area: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagasGaragem: number;
  andar?: string;
  mobiliado: boolean;
  condicao: string;
  anoConstucao?: string;
  elevador?: boolean;
  sacada?: boolean;
  comodidades?: string[];
};

export type IPropertyValores = {
  valorVenda?: number;
  valorAluguel?: number;
  valorCondominio?: number;
  valorIPTU?: number;
  aceitaFinanciamento: boolean;
  aceitaFGTS?: boolean;
  aceitaPermuta?: boolean;
};

export type IPropertyReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export type IPropertyItem = {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  area: number;
  preco: number;
  precoM2: number;
  status: string;
  tipo: string;
  finalidade: string; // venda, aluguel, venda_aluguel
  createdAt: IDateValue;
  updatedAt: IDateValue;
  localizacao: IPropertyLocalizacao | string;
  proprietario: IPropertyProprietario;
  caracteristicas: IPropertyCaracteristicas;
  valores: IPropertyValores;
  imagens: string[];
  destaque: boolean;
  negociavel: boolean;
  observacoes?: string;
  corretor?: string;
  
  // Campos específicos de imóveis
  nomeEdificio?: string;
  posicaoSolar?: string;
  exclusivo?: boolean;
  
  // Campos de compatibilidade com estrutura existente
  name?: string;
  title?: string;
  value?: number;
  avatarUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  cep?: string;
  description?: string;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  condominiumFee?: number;
  iptuValue?: number;
  furnished?: boolean;
  acceptsFinancing?: boolean;
  acceptsExchange?: boolean;
  propertyCondition?: string;
  constructionYear?: string;
  buildingName?: string;
  neighborhood?: string;
  street?: string;
  streetNumber?: string;
  complement?: string;
  zipCode?: string;
  number?: string;
  latitude?: number;
  longitude?: number;
  salePrice?: number;
  rentPrice?: number;
  pricePerSquareMeter?: number;
  iptu?: number;
  elevator?: boolean;
  builtArea?: number;
  totalArea?: number;
  yearBuilt?: number;
  owner?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    avatarUrl?: string;
  };
};

export interface PropertyAmenity {
  id: string;
  name: string;
  checked: boolean;
}

export interface CondominiumAmenity {
  id: string;
  name: string;
  checked: boolean;
}

export default interface PropertyFormValues {
  // Property Information
  propertyCondition: string;
  propertyType: string;
  sunPosition: string;
  size: number;
  bedrooms: number;
  suites: number;
  floor: number | string;
  bathrooms: number;
  parkingSpots: number;
  iptuValue: number;
  propertyAmenities: PropertyAmenity[];

  // Condominium Information
  buildingName: string;
  constructionYear: string;
  condominiumFee: number;
  condominiumAmenities: CondominiumAmenity[];

  // Location
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;

  // Images
  images: string[];

  // Values
  purpose: string;
  salePrice: number;
  rentPrice: number;
  acceptsFinancing: boolean;
  acceptsExchange: boolean;
  condominiumValue: number;
  iptuValuePerYear: number;
  valueNotes: string;
  showPriceOnRequest: boolean;
  exclusiveProperty: boolean;
  highlightProperty: boolean;
}
