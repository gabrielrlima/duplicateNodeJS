import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento Product unificado no MongoDB
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  title?: string;
  description?: string;
  
  // Tipo do produto (categorias brasileiras)
  type: 'imovel' | 'terreno' | 'empreendimento';
  status: 'available' | 'sold' | 'rented' | 'reserved' | 'inactive';
  condition?: 'new' | 'used' | 'under_construction' | 'to_renovate' | 'ready_to_build' | 'with_project' | 'clean';
  
  // Área e medidas (campos unificados)
  area: number; // área principal em m²
  builtArea?: number; // área construída (para imóveis)
  totalArea?: number; // área total do terreno
  usableArea?: number; // área útil (para terrenos)
  frontage?: number; // testada em metros (para terrenos)
  depth?: number; // profundidade em metros (para terrenos)
  
  // Características específicas de imóveis
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: string;
  totalFloors?: number;
  elevator?: boolean;
  furnished?: boolean;
  hasBalcony?: boolean;
  
  // Características específicas de terrenos
  topography?: 'flat' | 'sloped' | 'irregular';
  soilType?: 'clay' | 'sand' | 'rock' | 'mixed';
  vegetation?: 'none' | 'grass' | 'trees' | 'forest';
  waterAccess?: boolean;
  electricityAccess?: boolean;
  sewerAccess?: boolean;
  gasAccess?: boolean;
  internetAccess?: boolean;
  zoning?: 'residential' | 'commercial' | 'industrial' | 'mixed';
  buildingCoefficient?: number;
  occupancyRate?: number;
  setbackFront?: number;
  setbackSide?: number;
  setbackRear?: number;
  maxHeight?: number;
  accessType?: 'paved' | 'dirt' | 'cobblestone';
  
  // Características específicas de empreendimentos
  totalUnits?: number;
  availableUnits?: number;
  soldUnits?: number;
  reservedUnits?: number;
  unitsPerFloor?: number;
  elevators?: number;
  commonArea?: number;
  constructionProgress?: number; // percentual 0-100
  
  // Cronograma (para empreendimentos)
  timeline?: {
    launchDate?: Date;
    constructionStart?: Date;
    expectedCompletion?: Date;
    deliveryDate?: Date;
  };
  
  // Construtora/Incorporadora (para empreendimentos)
  developer?: {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // Campos específicos para empreendimentos
  construtora?: string;
  previsaoEntrega?: string;
  unidadesDisponiveis?: number;
  plantas?: Array<{
    id?: string;
    area: number;
    precoPorM2: number;
    descricao?: string;
  }>;
  
  // Campos específicos para terrenos
  frente?: number;
  tipoSolo?: 'plano' | 'inclinado' | 'irregular';
  zoneamento?: string;
  
  // Localização
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  latitude?: number;
  longitude?: number;
  
  // Valores
  value: number; // valor principal
  salePrice?: number;
  rentPrice?: number;
  pricePerSquareMeter?: number;
  condominiumFee?: number;
  iptuValue?: number;
  ituValue?: number; // para terrenos
  totalCost?: number;
  
  // Características adicionais
  sunPosition?: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  constructionYear?: string;
  yearBuilt?: number;
  buildingName?: string;
  
  // Comodidades
  amenities?: Record<string, boolean>;
  condominiumAmenities?: string[];
  nearbyAmenities?: string[]; // para terrenos
  
  // Documentação
  hasDocumentation?: boolean;
  registrationNumber?: string;
  
  // Negociação
  acceptsFinancing?: boolean;
  acceptsExchange?: boolean;
  exclusiveProperty?: boolean;
  highlightProperty?: boolean;
  
  // Mídia
  images: string[];
  avatarUrl?: string;
  
  // Agente responsável
  agent?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatarUrl?: string;
  };
  
  // Proprietário
  owner?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    avatarUrl?: string;
  };
  
  // Estatísticas
  viewsCount?: number;
  favoritesCount?: number;
  contactsCount?: number;
  totalRatings?: number;
  totalReviews?: number;
  
  // Datas
  availableFrom?: Date;
  lastUpdated?: Date;
  
  // Relacionamentos
  realEstateId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  
  // Controle
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  toProductResponse(): ProductResponse;
}

// Interface para resposta da API
export interface ProductResponse {
  id: string;
  name: string;
  title?: string;
  description?: string;
  type: 'imovel' | 'terreno' | 'empreendimento';
  status: string;
  condition?: string;
  area: number;
  builtArea?: number;
  totalArea?: number;
  usableArea?: number;
  frontage?: number;
  depth?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: string;
  totalFloors?: number;
  elevator?: boolean;
  furnished?: boolean;
  hasBalcony?: boolean;
  topography?: string;
  soilType?: string;
  vegetation?: string;
  waterAccess?: boolean;
  electricityAccess?: boolean;
  sewerAccess?: boolean;
  gasAccess?: boolean;
  internetAccess?: boolean;
  zoning?: string;
  buildingCoefficient?: number;
  occupancyRate?: number;
  setbackFront?: number;
  setbackSide?: number;
  setbackRear?: number;
  maxHeight?: number;
  accessType?: string;
  totalUnits?: number;
  availableUnits?: number;
  soldUnits?: number;
  reservedUnits?: number;
  unitsPerFloor?: number;
  elevators?: number;
  commonArea?: number;
  constructionProgress?: number;
  timeline?: {
    launchDate?: Date;
    constructionStart?: Date;
    expectedCompletion?: Date;
    deliveryDate?: Date;
  };
  developer?: {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // Campos específicos para empreendimentos
  construtora?: string;
  previsaoEntrega?: string;
  unidadesDisponiveis?: number;
  plantas?: Array<{
    area: number;
    pricePerSquareMeter: number;
    totalPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    suites?: number;
    parkingSpaces?: number;
    description?: string;
  }>;
  
  // Campos específicos para terrenos
  frente?: number;
  tipoSolo?: string;
  zoneamento?: string;
  
  address: string; // endereço formatado
  city: string;
  state: string;
  cep: string;
  neighborhood?: string;
  street?: string;
  streetNumber?: string;
  complement?: string;
  zipCode?: string;
  number?: string;
  latitude?: number;
  longitude?: number;
  value: number;
  salePrice?: number;
  rentPrice?: number;
  pricePerSquareMeter?: number;
  condominiumFee?: number;
  iptuValue?: number;
  ituValue?: number;
  totalCost?: number;
  sunPosition?: string;
  constructionYear?: string;
  yearBuilt?: number;
  buildingName?: string;
  amenities?: Record<string, boolean>;
  condominiumAmenities?: string[];
  nearbyAmenities?: string[];
  hasDocumentation?: boolean;
  registrationNumber?: string;
  acceptsFinancing?: boolean;
  acceptsExchange?: boolean;
  exclusiveProperty?: boolean;
  highlightProperty?: boolean;
  images: string[];
  avatarUrl?: string;
  agent?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatarUrl?: string;
  };
  owner?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    avatarUrl?: string;
  };
  viewsCount?: number;
  favoritesCount?: number;
  contactsCount?: number;
  totalRatings?: number;
  totalReviews?: number;
  availableFrom?: Date;
  lastUpdated?: Date;
  realEstateId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para criação de produto
export interface CreateProductData {
  name: string;
  title?: string;
  description?: string;
  type: 'imovel' | 'terreno' | 'empreendimento';
  status?: 'available' | 'sold' | 'rented' | 'reserved' | 'inactive';
  condition?: string;
  area: number;
  builtArea?: number;
  totalArea?: number;
  usableArea?: number;
  frontage?: number;
  depth?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: string;
  totalFloors?: number;
  elevator?: boolean;
  furnished?: boolean;
  hasBalcony?: boolean;
  topography?: string;
  soilType?: string;
  vegetation?: string;
  waterAccess?: boolean;
  electricityAccess?: boolean;
  sewerAccess?: boolean;
  gasAccess?: boolean;
  internetAccess?: boolean;
  zoning?: string;
  buildingCoefficient?: number;
  occupancyRate?: number;
  setbackFront?: number;
  setbackSide?: number;
  setbackRear?: number;
  maxHeight?: number;
  accessType?: string;
  totalUnits?: number;
  availableUnits?: number;
  soldUnits?: number;
  reservedUnits?: number;
  unitsPerFloor?: number;
  elevators?: number;
  commonArea?: number;
  constructionProgress?: number;
  timeline?: {
    launchDate?: Date;
    constructionStart?: Date;
    expectedCompletion?: Date;
    deliveryDate?: Date;
  };
  developer?: {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  latitude?: number;
  longitude?: number;
  value: number;
  salePrice?: number;
  rentPrice?: number;
  pricePerSquareMeter?: number;
  condominiumFee?: number;
  iptuValue?: number;
  ituValue?: number;
  totalCost?: number;
  sunPosition?: string;
  constructionYear?: string;
  yearBuilt?: number;
  buildingName?: string;
  amenities?: Record<string, boolean>;
  condominiumAmenities?: string[];
  nearbyAmenities?: string[];
  hasDocumentation?: boolean;
  registrationNumber?: string;
  acceptsFinancing?: boolean;
  acceptsExchange?: boolean;
  exclusiveProperty?: boolean;
  highlightProperty?: boolean;
  images?: string[];
  avatarUrl?: string;
  agent?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatarUrl?: string;
  };
  owner?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    avatarUrl?: string;
  };
  availableFrom?: Date;
  realEstateId: string;
}

// Schema do MongoDB
const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [200, 'Nome deve ter no máximo 200 caracteres']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Título deve ter no máximo 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Descrição deve ter no máximo 2000 caracteres']
  },
  type: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    enum: {
      values: ['imovel', 'terreno', 'empreendimento'],
      message: 'Tipo deve ser imovel, terreno ou empreendimento'
    }
  },
  status: {
    type: String,
    required: [true, 'Status é obrigatório'],
    enum: {
      values: ['available', 'sold', 'rented', 'reserved', 'inactive'],
      message: 'Status inválido'
    },
    default: 'available'
  },
  condition: {
    type: String,
    enum: {
      values: ['new', 'used', 'under_construction', 'to_renovate', 'ready_to_build', 'with_project', 'clean'],
      message: 'Condição inválida'
    }
  },
  
  // Área e medidas
  area: {
    type: Number,
    required: [true, 'Área é obrigatória'],
    min: [0.01, 'Área deve ser maior que zero']
  },
  builtArea: {
    type: Number,
    min: [0, 'Área construída não pode ser negativa']
  },
  totalArea: {
    type: Number,
    min: [0, 'Área total não pode ser negativa']
  },
  usableArea: {
    type: Number,
    min: [0, 'Área útil não pode ser negativa']
  },
  frontage: {
    type: Number,
    min: [0, 'Testada não pode ser negativa']
  },
  depth: {
    type: Number,
    min: [0, 'Profundidade não pode ser negativa']
  },
  
  // Características de imóveis
  bedrooms: {
    type: Number,
    min: [0, 'Número de quartos não pode ser negativo'],
    max: [50, 'Número de quartos não pode exceder 50']
  },
  suites: {
    type: Number,
    min: [0, 'Número de suítes não pode ser negativo'],
    max: [20, 'Número de suítes não pode exceder 20']
  },
  bathrooms: {
    type: Number,
    min: [0, 'Número de banheiros não pode ser negativo'],
    max: [20, 'Número de banheiros não pode exceder 20']
  },
  parkingSpaces: {
    type: Number,
    min: [0, 'Número de vagas não pode ser negativo'],
    max: [20, 'Número de vagas não pode exceder 20']
  },
  floor: String,
  totalFloors: {
    type: Number,
    min: [1, 'Número total de andares deve ser pelo menos 1'],
    max: [200, 'Número total de andares não pode exceder 200']
  },
  elevator: {
    type: Boolean,
    default: false
  },
  furnished: {
    type: Boolean,
    default: false
  },
  hasBalcony: {
    type: Boolean,
    default: false
  },
  
  // Características de terrenos
  topography: {
    type: String,
    enum: ['flat', 'sloped', 'irregular']
  },
  soilType: {
    type: String,
    enum: ['clay', 'sand', 'rock', 'mixed']
  },
  vegetation: {
    type: String,
    enum: ['none', 'grass', 'trees', 'forest']
  },
  waterAccess: {
    type: Boolean,
    default: false
  },
  electricityAccess: {
    type: Boolean,
    default: false
  },
  sewerAccess: {
    type: Boolean,
    default: false
  },
  gasAccess: {
    type: Boolean,
    default: false
  },
  internetAccess: {
    type: Boolean,
    default: false
  },
  zoning: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'mixed']
  },
  buildingCoefficient: {
    type: Number,
    min: [0, 'Coeficiente de aproveitamento não pode ser negativo'],
    max: [10, 'Coeficiente de aproveitamento não pode exceder 10']
  },
  occupancyRate: {
    type: Number,
    min: [0, 'Taxa de ocupação não pode ser negativa'],
    max: [1, 'Taxa de ocupação não pode exceder 100%']
  },
  setbackFront: {
    type: Number,
    min: [0, 'Recuo frontal não pode ser negativo']
  },
  setbackSide: {
    type: Number,
    min: [0, 'Recuo lateral não pode ser negativo']
  },
  setbackRear: {
    type: Number,
    min: [0, 'Recuo de fundos não pode ser negativo']
  },
  maxHeight: {
    type: Number,
    min: [0, 'Altura máxima não pode ser negativa']
  },
  accessType: {
    type: String,
    enum: ['paved', 'dirt', 'cobblestone']
  },
  
  // Características de empreendimentos
  totalUnits: {
    type: Number,
    min: [0, 'Total de unidades não pode ser negativo']
  },
  availableUnits: {
    type: Number,
    min: [0, 'Unidades disponíveis não pode ser negativo']
  },
  soldUnits: {
    type: Number,
    min: [0, 'Unidades vendidas não pode ser negativo']
  },
  reservedUnits: {
    type: Number,
    min: [0, 'Unidades reservadas não pode ser negativo']
  },
  unitsPerFloor: {
    type: Number,
    min: [0, 'Unidades por andar não pode ser negativo']
  },
  elevators: {
    type: Number,
    min: [0, 'Número de elevadores não pode ser negativo']
  },
  commonArea: {
    type: Number,
    min: [0, 'Área comum não pode ser negativa']
  },
  constructionProgress: {
    type: Number,
    min: [0, 'Progresso da construção não pode ser negativo'],
    max: [100, 'Progresso da construção não pode exceder 100%']
  },
  
  // Cronograma
  timeline: {
    launchDate: Date,
    constructionStart: Date,
    expectedCompletion: Date,
    deliveryDate: Date
  },
  
  // Construtora/Incorporadora
  developer: {
    name: String,
    cnpj: String,
    phone: String,
    email: String,
    website: String
  },
  
  // Campos específicos para empreendimentos
  construtora: {
    type: String,
    trim: true
  },
  previsaoEntrega: {
    type: String
  },
  unidadesDisponiveis: {
    type: Number,
    min: [0, 'Unidades disponíveis não pode ser negativo']
  },
  plantas: [{
    id: String,
    area: {
      type: Number,
      required: true,
      min: [0.01, 'Área da planta deve ser maior que zero']
    },
    precoPorM2: {
      type: Number,
      required: true,
      min: [0.01, 'Preço por m² deve ser maior que zero']
    },
    descricao: {
      type: String,
      trim: true
    }
  }],
  
  // Campos específicos para terrenos
  frente: {
    type: Number,
    min: [0, 'Frente não pode ser negativa']
  },
  tipoSolo: {
    type: String,
    enum: ['plano', 'inclinado', 'irregular']
  },
  zoneamento: {
    type: String,
    trim: true
  },
  
  // Localização
  address: {
    street: {
      type: String,
      required: [true, 'Rua é obrigatória'],
      trim: true
    },
    number: {
      type: String,
      required: [true, 'Número é obrigatório'],
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório'],
      trim: true,
      maxlength: [2, 'Estado deve ter no máximo 2 caracteres']
    },
    zipCode: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      trim: true
    },
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    }
  },
  latitude: {
    type: Number,
    min: [-90, 'Latitude deve estar entre -90 e 90'],
    max: [90, 'Latitude deve estar entre -90 e 90']
  },
  longitude: {
    type: Number,
    min: [-180, 'Longitude deve estar entre -180 e 180'],
    max: [180, 'Longitude deve estar entre -180 e 180']
  },
  
  // Valores
  value: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo']
  },
  salePrice: {
    type: Number,
    min: [0, 'Preço de venda não pode ser negativo']
  },
  rentPrice: {
    type: Number,
    min: [0, 'Preço de aluguel não pode ser negativo']
  },
  pricePerSquareMeter: {
    type: Number,
    min: [0, 'Preço por m² não pode ser negativo']
  },
  condominiumFee: {
    type: Number,
    min: [0, 'Taxa de condomínio não pode ser negativa']
  },
  iptuValue: {
    type: Number,
    min: [0, 'Valor do IPTU não pode ser negativo']
  },
  ituValue: {
    type: Number,
    min: [0, 'Valor do ITU não pode ser negativo']
  },
  totalCost: {
    type: Number,
    min: [0, 'Custo total não pode ser negativo']
  },
  
  // Características adicionais
  sunPosition: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest']
  },
  constructionYear: String,
  yearBuilt: {
    type: Number,
    min: [1800, 'Ano de construção deve ser posterior a 1800'],
    max: [new Date().getFullYear() + 10, 'Ano de construção não pode ser muito futuro']
  },
  buildingName: {
    type: String,
    maxlength: [200, 'Nome do edifício deve ter no máximo 200 caracteres']
  },
  
  // Comodidades
  amenities: {
    type: Map,
    of: Boolean
  },
  condominiumAmenities: [String],
  nearbyAmenities: [String],
  
  // Documentação
  hasDocumentation: {
    type: Boolean,
    default: false
  },
  registrationNumber: String,
  
  // Negociação
  acceptsFinancing: {
    type: Boolean,
    default: false
  },
  acceptsExchange: {
    type: Boolean,
    default: false
  },
  exclusiveProperty: {
    type: Boolean,
    default: false
  },
  highlightProperty: {
    type: Boolean,
    default: false
  },
  
  // Mídia
  images: {
    type: [String],
    default: []
  },
  avatarUrl: String,
  
  // Agente responsável
  agent: {
    id: String,
    name: String,
    phone: String,
    email: String,
    avatarUrl: String
  },
  
  // Proprietário
  owner: {
    name: String,
    email: String,
    phone: String,
    document: String,
    avatarUrl: String
  },
  
  // Estatísticas
  viewsCount: {
    type: Number,
    default: 0,
    min: [0, 'Número de visualizações não pode ser negativo']
  },
  favoritesCount: {
    type: Number,
    default: 0,
    min: [0, 'Número de favoritos não pode ser negativo']
  },
  contactsCount: {
    type: Number,
    default: 0,
    min: [0, 'Número de contatos não pode ser negativo']
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: [0, 'Total de avaliações não pode ser negativo']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total de reviews não pode ser negativo']
  },
  
  // Datas
  availableFrom: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Relacionamentos
  realEstateId: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstate',
    required: [true, 'ID da imobiliária é obrigatório']
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID do proprietário é obrigatório']
  },
  
  // Controle
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para otimização de consultas
ProductSchema.index({ realEstateId: 1, ownerId: 1, isActive: 1 });
ProductSchema.index({ type: 1, status: 1 });
ProductSchema.index({ 'address.city': 1, 'address.state': 1 });
ProductSchema.index({ value: 1 });
ProductSchema.index({ area: 1 });
ProductSchema.index({ createdAt: -1 });

// Método para converter para resposta da API
ProductSchema.methods.toProductResponse = function(): ProductResponse {
  const product = this.toObject();
  
  // Formatar endereço
  const addressParts = [
    product.address.street,
    product.address.number,
    product.address.complement,
    product.address.neighborhood,
    product.address.city,
    product.address.state
  ].filter(Boolean);
  
  return {
    id: product._id.toString(),
    name: product.name,
    title: product.title,
    description: product.description,
    type: product.type,
    status: product.status,
    condition: product.condition,
    area: product.area,
    builtArea: product.builtArea,
    totalArea: product.totalArea,
    usableArea: product.usableArea,
    frontage: product.frontage,
    depth: product.depth,
    bedrooms: product.bedrooms,
    suites: product.suites,
    bathrooms: product.bathrooms,
    parkingSpaces: product.parkingSpaces,
    floor: product.floor,
    totalFloors: product.totalFloors,
    elevator: product.elevator,
    furnished: product.furnished,
    hasBalcony: product.hasBalcony,
    topography: product.topography,
    soilType: product.soilType,
    vegetation: product.vegetation,
    waterAccess: product.waterAccess,
    electricityAccess: product.electricityAccess,
    sewerAccess: product.sewerAccess,
    gasAccess: product.gasAccess,
    internetAccess: product.internetAccess,
    zoning: product.zoning,
    buildingCoefficient: product.buildingCoefficient,
    occupancyRate: product.occupancyRate,
    setbackFront: product.setbackFront,
    setbackSide: product.setbackSide,
    setbackRear: product.setbackRear,
    maxHeight: product.maxHeight,
    accessType: product.accessType,
    totalUnits: product.totalUnits,
    availableUnits: product.availableUnits,
    soldUnits: product.soldUnits,
    reservedUnits: product.reservedUnits,
    unitsPerFloor: product.unitsPerFloor,
    elevators: product.elevators,
    commonArea: product.commonArea,
    constructionProgress: product.constructionProgress,
    timeline: product.timeline,
    developer: product.developer,
    
    // Campos específicos para empreendimentos
    construtora: product.construtora,
    previsaoEntrega: product.previsaoEntrega,
    unidadesDisponiveis: product.unidadesDisponiveis,
    plantas: product.plantas,
    
    // Campos específicos para terrenos
    frente: product.frente,
    tipoSolo: product.tipoSolo,
    zoneamento: product.zoneamento,
    
    address: addressParts.join(', '),
    city: product.address.city,
    state: product.address.state,
    cep: product.address.zipCode,
    neighborhood: product.address.neighborhood,
    street: product.address.street,
    streetNumber: product.address.number,
    complement: product.address.complement,
    zipCode: product.address.zipCode,
    number: product.address.number,
    latitude: product.latitude,
    longitude: product.longitude,
    value: product.value,
    salePrice: product.salePrice,
    rentPrice: product.rentPrice,
    pricePerSquareMeter: product.pricePerSquareMeter,
    condominiumFee: product.condominiumFee,
    iptuValue: product.iptuValue,
    ituValue: product.ituValue,
    totalCost: product.totalCost,
    sunPosition: product.sunPosition,
    constructionYear: product.constructionYear,
    yearBuilt: product.yearBuilt,
    buildingName: product.buildingName,
    amenities: product.amenities ? Object.fromEntries(product.amenities) : undefined,
    condominiumAmenities: product.condominiumAmenities,
    nearbyAmenities: product.nearbyAmenities,
    hasDocumentation: product.hasDocumentation,
    registrationNumber: product.registrationNumber,
    acceptsFinancing: product.acceptsFinancing,
    acceptsExchange: product.acceptsExchange,
    exclusiveProperty: product.exclusiveProperty,
    highlightProperty: product.highlightProperty,
    images: product.images,
    avatarUrl: product.avatarUrl,
    agent: product.agent,
    owner: product.owner,
    viewsCount: product.viewsCount,
    favoritesCount: product.favoritesCount,
    contactsCount: product.contactsCount,
    totalRatings: product.totalRatings,
    totalReviews: product.totalReviews,
    availableFrom: product.availableFrom,
    lastUpdated: product.lastUpdated,
    realEstateId: product.realEstateId.toString(),
    ownerId: product.ownerId.toString(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

// Middleware para atualizar lastUpdated
ProductSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  next();
});

// Middleware para incrementar visualizações
ProductSchema.methods.incrementViews = function() {
  this.viewsCount = (this.viewsCount || 0) + 1;
  return this.save();
};

// Middleware para incrementar favoritos
ProductSchema.methods.incrementFavorites = function() {
  this.favoritesCount = (this.favoritesCount || 0) + 1;
  return this.save();
};

// Middleware para incrementar contatos
ProductSchema.methods.incrementContacts = function() {
  this.contactsCount = (this.contactsCount || 0) + 1;
  return this.save();
};

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
export default ProductModel;