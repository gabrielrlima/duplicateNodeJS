import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento Terreno no MongoDB
export interface ITerreno extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  title?: string;
  description?: string;
  terrainDescription?: string;
  type: string; // 'residential', 'commercial', 'industrial', 'rural', 'mixed'
  status: string; // 'available', 'sold', 'reserved', 'inactive'
  condition?: string; // 'ready_to_build', 'with_project', 'with_construction', 'clean'
  
  // Área e medidas
  totalArea: number; // área total do terreno em m²
  usableArea?: number; // área útil em m²
  frontage?: number; // testada em metros
  depth?: number; // profundidade em metros
  dimensoes?: string; // dimensões do terreno
  
  // Características do terreno
  topography?: string; // 'flat', 'sloped', 'irregular'
  soilType?: string; // 'clay', 'sand', 'rock', 'mixed'
  vegetation?: string; // 'none', 'grass', 'trees', 'forest'
  waterAccess?: boolean;
  electricityAccess?: boolean;
  sewerAccess?: boolean;
  gasAccess?: boolean;
  internetAccess?: boolean;
  
  // Zoneamento e regulamentações
  zoning?: string; // 'residential', 'commercial', 'industrial', 'mixed'
  buildingCoefficient?: number; // coeficiente de aproveitamento
  occupancyRate?: number; // taxa de ocupação
  setbackFront?: number; // recuo frontal em metros
  setbackSide?: number; // recuo lateral em metros
  setbackRear?: number; // recuo de fundos em metros
  maxHeight?: number; // altura máxima permitida em metros
  
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
  pricePerSquareMeter?: number;
  ituValue?: number;
  itu?: number;
  totalCost?: number;
  preco_negociavel?: boolean; // preço negociável
  itu_anual?: number; // ITU anual
  
  // Características adicionais
  sunPosition?: string;
  nearbyAmenities?: string[];
  accessType?: string; // 'paved', 'dirt', 'cobblestone'
  
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
  
  // Relacionamentos
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
  
  // Estatísticas
  viewsCount?: number;
  favoritesCount?: number;
  contactsCount?: number;
  totalRatings?: number;
  totalReviews?: number;
  
  // Datas
  availableFrom?: Date;
  lastUpdated?: Date;
  
  // Relacionamentos obrigatórios
  realEstateId: mongoose.Types.ObjectId; // Relacionamento com RealEstate
  ownerId: mongoose.Types.ObjectId; // Relacionamento com User
  
  // Controle
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  toTerrenoResponse(): TerrenoResponse;
}

// Interface para resposta da API
export interface Terreno {
  id: string;
  name: string;
  title?: string;
  description?: string;
  terrainDescription?: string;
  type: string;
  status: string;
  condition?: string;
  totalArea: number;
  usableArea?: number;
  frontage?: number;
  depth?: number;
  dimensoes?: string;
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
  pricePerSquareMeter?: number;
  ituValue?: number;
  itu?: number;
  totalCost?: number;
  preco_negociavel?: boolean;
  itu_anual?: number;
  sunPosition?: string;
  nearbyAmenities?: string[];
  accessType?: string;
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

export interface CreateTerrenoData {
  name: string;
  title?: string;
  description?: string;
  terrainDescription?: string;
  type: string;
  status: string;
  condition?: string;
  totalArea: number;
  usableArea?: number;
  frontage?: number;
  depth?: number;
  dimensoes?: string;
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
  pricePerSquareMeter?: number;
  ituValue?: number;
  preco_negociavel?: boolean;
  itu_anual?: number;
  sunPosition?: string;
  nearbyAmenities?: string[];
  accessType?: string;
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

export interface TerrenoResponse {
  id: string;
  name: string;
  title?: string;
  description?: string;
  terrainDescription?: string;
  type: string;
  status: string;
  condition?: string;
  totalArea: number;
  usableArea?: number;
  frontage?: number;
  depth?: number;
  dimensoes?: string;
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
  value: number;
  salePrice?: number;
  pricePerSquareMeter?: number;
  ituValue?: number;
  itu?: number;
  totalCost?: number;
  preco_negociavel?: boolean;
  itu_anual?: number;
  sunPosition?: string;
  nearbyAmenities?: string[];
  accessType?: string;
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

// Schema do MongoDB
const terrenoSchema = new Schema<ITerreno>({
  name: {
    type: String,
    trim: true,
    maxlength: [200, 'Nome deve ter no máximo 200 caracteres'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Título deve ter no máximo 200 caracteres'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Descrição deve ter no máximo 2000 caracteres'],
  },
  terrainDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Descrição do terreno deve ter no máximo 2000 caracteres'],
  },
  type: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'rural', 'mixed'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'inactive'],
    default: 'available',
    trim: true,
  },
  condition: {
    type: String,
    enum: ['ready_to_build', 'with_project', 'with_construction', 'clean'],
    trim: true,
  },
  totalArea: {
    type: Number,
    min: [0, 'Área total não pode ser negativa'],
  },
  usableArea: {
    type: Number,
    min: [0, 'Área útil não pode ser negativa'],
  },
  frontage: {
    type: Number,
    min: [0, 'Testada não pode ser negativa'],
  },
  depth: {
    type: Number,
    min: [0, 'Profundidade não pode ser negativa'],
  },
  dimensoes: {
    type: String,
    trim: true,
    maxlength: [100, 'Dimensões deve ter no máximo 100 caracteres'],
  },
  topography: {
    type: String,
    enum: ['flat', 'sloped', 'irregular'],
    trim: true,
  },
  soilType: {
    type: String,
    enum: ['clay', 'sand', 'rock', 'mixed'],
    trim: true,
  },
  vegetation: {
    type: String,
    enum: ['none', 'grass', 'trees', 'forest'],
    trim: true,
  },
  waterAccess: {
    type: Boolean,
    default: false,
  },
  electricityAccess: {
    type: Boolean,
    default: false,
  },
  sewerAccess: {
    type: Boolean,
    default: false,
  },
  gasAccess: {
    type: Boolean,
    default: false,
  },
  internetAccess: {
    type: Boolean,
    default: false,
  },
  zoning: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'mixed'],
    trim: true,
  },
  buildingCoefficient: {
    type: Number,
    min: [0, 'Coeficiente de aproveitamento não pode ser negativo'],
    max: [10, 'Coeficiente de aproveitamento não pode exceder 10'],
  },
  occupancyRate: {
    type: Number,
    min: [0, 'Taxa de ocupação não pode ser negativa'],
    max: [1, 'Taxa de ocupação não pode exceder 100%'],
  },
  setbackFront: {
    type: Number,
    min: [0, 'Recuo frontal não pode ser negativo'],
  },
  setbackSide: {
    type: Number,
    min: [0, 'Recuo lateral não pode ser negativo'],
  },
  setbackRear: {
    type: Number,
    min: [0, 'Recuo de fundos não pode ser negativo'],
  },
  maxHeight: {
    type: Number,
    min: [0, 'Altura máxima não pode ser negativa'],
  },
  address: {
    street: {
      type: String,
      trim: true,
    },
    number: {
      type: String,
      trim: true,
    },
    complement: {
      type: String,
      trim: true,
    },
    neighborhood: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      maxlength: [2, 'Estado deve ter 2 caracteres'],
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'Brasil',
    },
  },
  latitude: {
    type: Number,
    min: [-90, 'Latitude deve estar entre -90 e 90'],
    max: [90, 'Latitude deve estar entre -90 e 90'],
  },
  longitude: {
    type: Number,
    min: [-180, 'Longitude deve estar entre -180 e 180'],
    max: [180, 'Longitude deve estar entre -180 e 180'],
  },
  value: {
    type: Number,
    min: [0, 'Valor não pode ser negativo'],
  },
  salePrice: {
    type: Number,
    min: [0, 'Preço de venda não pode ser negativo'],
  },
  pricePerSquareMeter: {
    type: Number,
    min: [0, 'Preço por m² não pode ser negativo'],
  },
  ituValue: {
    type: Number,
    min: [0, 'Valor do ITU não pode ser negativo'],
  },
  itu: {
    type: Number,
    min: [0, 'ITU não pode ser negativo'],
  },
  totalCost: {
    type: Number,
    min: [0, 'Custo total não pode ser negativo'],
  },
  preco_negociavel: {
    type: Boolean,
    default: false,
  },
  itu_anual: {
    type: Number,
    min: [0, 'ITU anual não pode ser negativo'],
  },
  sunPosition: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'],
    trim: true,
  },
  nearbyAmenities: [{
    type: String,
    trim: true,
  }],
  accessType: {
    type: String,
    enum: ['paved', 'dirt', 'cobblestone'],
    trim: true,
  },
  hasDocumentation: {
    type: Boolean,
    default: false,
  },
  registrationNumber: {
    type: String,
    trim: true,
  },
  acceptsFinancing: {
    type: Boolean,
    default: false,
  },
  acceptsExchange: {
    type: Boolean,
    default: false,
  },
  exclusiveProperty: {
    type: Boolean,
    default: false,
  },
  highlightProperty: {
    type: Boolean,
    default: false,
  },
  images: [{
    type: String,
    trim: true,
  }],
  avatarUrl: {
    type: String,
    trim: true,
  },
  agent: {
    id: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
  },
  owner: {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    document: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
  },
  viewsCount: {
    type: Number,
    default: 0,
    min: [0, 'Contagem de visualizações não pode ser negativa'],
  },
  favoritesCount: {
    type: Number,
    default: 0,
    min: [0, 'Contagem de favoritos não pode ser negativa'],
  },
  contactsCount: {
    type: Number,
    default: 0,
    min: [0, 'Contagem de contatos não pode ser negativa'],
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: [0, 'Total de avaliações não pode ser negativo'],
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total de reviews não pode ser negativo'],
  },
  availableFrom: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  realEstateId: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstate',
    required: [true, 'Imobiliária é obrigatória'],
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Proprietário é obrigatório'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para otimização de consultas
terrenoSchema.index({ realEstateId: 1 });
terrenoSchema.index({ ownerId: 1 });
terrenoSchema.index({ type: 1 });
terrenoSchema.index({ status: 1 });
terrenoSchema.index({ 'address.city': 1 });
terrenoSchema.index({ 'address.state': 1 });
terrenoSchema.index({ 'address.neighborhood': 1 });
terrenoSchema.index({ value: 1 });
terrenoSchema.index({ totalArea: 1 });
terrenoSchema.index({ isActive: 1 });
terrenoSchema.index({ createdAt: -1 });
terrenoSchema.index({ lastUpdated: -1 });

// Método para converter para resposta da API
terrenoSchema.methods.toTerrenoResponse = function(): TerrenoResponse {
  const terreno = this.toObject();
  
  return {
    id: this._id.toString(),
    name: terreno.name,
    title: terreno.title,
    description: terreno.description,
    terrainDescription: terreno.terrainDescription,
    type: terreno.type,
    status: terreno.status,
    condition: terreno.condition,
    totalArea: terreno.totalArea,
    usableArea: terreno.usableArea,
    frontage: terreno.frontage,
    depth: terreno.depth,
    dimensoes: terreno.dimensoes,
    topography: terreno.topography,
    soilType: terreno.soilType,
    vegetation: terreno.vegetation,
    waterAccess: terreno.waterAccess,
    electricityAccess: terreno.electricityAccess,
    sewerAccess: terreno.sewerAccess,
    gasAccess: terreno.gasAccess,
    internetAccess: terreno.internetAccess,
    zoning: terreno.zoning,
    buildingCoefficient: terreno.buildingCoefficient,
    occupancyRate: terreno.occupancyRate,
    setbackFront: terreno.setbackFront,
    setbackSide: terreno.setbackSide,
    setbackRear: terreno.setbackRear,
    maxHeight: terreno.maxHeight,
    address: terreno.address,
    latitude: terreno.latitude,
    longitude: terreno.longitude,
    value: terreno.value,
    salePrice: terreno.salePrice,
    pricePerSquareMeter: terreno.pricePerSquareMeter,
    ituValue: terreno.ituValue,
    itu: terreno.itu,
    totalCost: terreno.totalCost,
    preco_negociavel: terreno.preco_negociavel,
    itu_anual: terreno.itu_anual,
    sunPosition: terreno.sunPosition,
    nearbyAmenities: terreno.nearbyAmenities,
    accessType: terreno.accessType,
    hasDocumentation: terreno.hasDocumentation,
    registrationNumber: terreno.registrationNumber,
    acceptsFinancing: terreno.acceptsFinancing,
    acceptsExchange: terreno.acceptsExchange,
    exclusiveProperty: terreno.exclusiveProperty,
    highlightProperty: terreno.highlightProperty,
    images: terreno.images || [],
    avatarUrl: terreno.avatarUrl,
    agent: terreno.agent,
    owner: terreno.owner,
    viewsCount: terreno.viewsCount,
    favoritesCount: terreno.favoritesCount,
    contactsCount: terreno.contactsCount,
    totalRatings: terreno.totalRatings,
    totalReviews: terreno.totalReviews,
    availableFrom: terreno.availableFrom,
    lastUpdated: terreno.lastUpdated,
    realEstateId: this.realEstateId.toString(),
    ownerId: this.ownerId.toString(),
    createdAt: terreno.createdAt,
    updatedAt: terreno.updatedAt,
  };
};

export const TerrenoModel = mongoose.model<ITerreno>('Terreno', terrenoSchema);

// Função utilitária para converter documento para interface Terreno
export const toTerreno = (terrenoDoc: ITerreno): Terreno => {
  const addressFormatted = `${terrenoDoc.address.street}, ${terrenoDoc.address.number}${terrenoDoc.address.complement ? ', ' + terrenoDoc.address.complement : ''}, ${terrenoDoc.address.neighborhood}, ${terrenoDoc.address.city} - ${terrenoDoc.address.state}, ${terrenoDoc.address.zipCode}`;
  
  return {
    id: terrenoDoc._id.toString(),
    name: terrenoDoc.name,
    title: terrenoDoc.title,
    description: terrenoDoc.description,
    terrainDescription: terrenoDoc.terrainDescription,
    type: terrenoDoc.type,
    status: terrenoDoc.status,
    condition: terrenoDoc.condition,
    totalArea: terrenoDoc.totalArea,
    usableArea: terrenoDoc.usableArea,
    frontage: terrenoDoc.frontage,
    depth: terrenoDoc.depth,
    dimensoes: terrenoDoc.dimensoes,
    topography: terrenoDoc.topography,
    soilType: terrenoDoc.soilType,
    vegetation: terrenoDoc.vegetation,
    waterAccess: terrenoDoc.waterAccess,
    electricityAccess: terrenoDoc.electricityAccess,
    sewerAccess: terrenoDoc.sewerAccess,
    gasAccess: terrenoDoc.gasAccess,
    internetAccess: terrenoDoc.internetAccess,
    zoning: terrenoDoc.zoning,
    buildingCoefficient: terrenoDoc.buildingCoefficient,
    occupancyRate: terrenoDoc.occupancyRate,
    setbackFront: terrenoDoc.setbackFront,
    setbackSide: terrenoDoc.setbackSide,
    setbackRear: terrenoDoc.setbackRear,
    maxHeight: terrenoDoc.maxHeight,
    address: addressFormatted,
    city: terrenoDoc.address.city,
    state: terrenoDoc.address.state,
    cep: terrenoDoc.address.zipCode,
    neighborhood: terrenoDoc.address.neighborhood,
    street: terrenoDoc.address.street,
    streetNumber: terrenoDoc.address.number,
    complement: terrenoDoc.address.complement,
    zipCode: terrenoDoc.address.zipCode,
    number: terrenoDoc.address.number,
    latitude: terrenoDoc.latitude,
    longitude: terrenoDoc.longitude,
    value: terrenoDoc.value,
    salePrice: terrenoDoc.salePrice,
    pricePerSquareMeter: terrenoDoc.pricePerSquareMeter,
    ituValue: terrenoDoc.ituValue,
    itu: terrenoDoc.itu,
    totalCost: terrenoDoc.totalCost,
    preco_negociavel: terrenoDoc.preco_negociavel,
    itu_anual: terrenoDoc.itu_anual,
    sunPosition: terrenoDoc.sunPosition,
    nearbyAmenities: terrenoDoc.nearbyAmenities,
    accessType: terrenoDoc.accessType,
    hasDocumentation: terrenoDoc.hasDocumentation,
    registrationNumber: terrenoDoc.registrationNumber,
    acceptsFinancing: terrenoDoc.acceptsFinancing,
    acceptsExchange: terrenoDoc.acceptsExchange,
    exclusiveProperty: terrenoDoc.exclusiveProperty,
    highlightProperty: terrenoDoc.highlightProperty,
    images: terrenoDoc.images || [],
    avatarUrl: terrenoDoc.avatarUrl,
    agent: terrenoDoc.agent,
    owner: terrenoDoc.owner,
    viewsCount: terrenoDoc.viewsCount,
    favoritesCount: terrenoDoc.favoritesCount,
    contactsCount: terrenoDoc.contactsCount,
    totalRatings: terrenoDoc.totalRatings,
    totalReviews: terrenoDoc.totalReviews,
    availableFrom: terrenoDoc.availableFrom,
    lastUpdated: terrenoDoc.lastUpdated,
    realEstateId: terrenoDoc.realEstateId.toString(),
    ownerId: terrenoDoc.ownerId.toString(),
    createdAt: terrenoDoc.createdAt,
    updatedAt: terrenoDoc.updatedAt,
  };
};