import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento Property no MongoDB
export interface IProperty extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  title?: string;
  description?: string;
  propertyDescription?: string;
  type: string; // 'apartment', 'house', 'commercial', 'land', etc.
  status: string; // 'available', 'sold', 'rented', 'reserved'
  condition?: string; // 'new', 'used', 'under_construction'
  
  // Área e medidas
  area: number; // área total em m²
  builtArea?: number; // área construída em m²
  totalArea?: number; // área total do terreno em m²
  
  // Características do imóvel
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: string;
  totalFloors?: number;
  elevator?: boolean;
  furnished?: boolean;
  hasBalcony?: boolean;
  
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
  iptu?: number;
  totalCost?: number;
  
  // Características adicionais
  sunPosition?: string;
  constructionYear?: string;
  yearBuilt?: number;
  buildingName?: string;
  
  // Comodidades
  amenities?: Record<string, boolean>;
  condominiumAmenities?: string[];
  
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
  realEstateId: mongoose.Types.ObjectId; // Relacionamento com RealEstate
  ownerId: mongoose.Types.ObjectId; // Relacionamento com User
  
  // Controle
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  toPropertyResponse(): PropertyResponse;
}

// Interface para compatibilidade com frontend
export interface Property {
  id: string;
  name: string;
  title?: string;
  description?: string;
  propertyDescription?: string;
  type: string;
  status: string;
  condition?: string;
  area: number;
  builtArea?: number;
  totalArea?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: string;
  totalFloors?: number;
  elevator?: boolean;
  furnished?: boolean;
  hasBalcony?: boolean;
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
  iptu?: number;
  totalCost?: number;
  sunPosition?: string;
  constructionYear?: string;
  yearBuilt?: number;
  buildingName?: string;
  amenities?: Record<string, boolean>;
  condominiumAmenities?: string[];
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

export interface CreatePropertyData {
  name: string;
  title?: string;
  description?: string;
  propertyDescription?: string;
  type: string;
  status: string;
  condition?: string;
  area: number;
  builtArea?: number;
  totalArea?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: string;
  totalFloors?: number;
  elevator?: boolean;
  furnished?: boolean;
  hasBalcony?: boolean;
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
  sunPosition?: string;
  constructionYear?: string;
  yearBuilt?: number;
  buildingName?: string;
  amenities?: Record<string, boolean>;
  condominiumAmenities?: string[];
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

export interface PropertyResponse {
  id: string;
  name: string;
  title?: string;
  description?: string;
  propertyDescription?: string;
  type: string;
  status: string;
  condition?: string;
  area: number;
  builtArea?: number;
  totalArea?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: string;
  totalFloors?: number;
  elevator?: boolean;
  furnished?: boolean;
  hasBalcony?: boolean;
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
  rentPrice?: number;
  pricePerSquareMeter?: number;
  condominiumFee?: number;
  iptuValue?: number;
  iptu?: number;
  totalCost?: number;
  sunPosition?: string;
  constructionYear?: string;
  yearBuilt?: number;
  buildingName?: string;
  amenities?: Record<string, boolean>;
  condominiumAmenities?: string[];
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
const propertySchema = new Schema<IProperty>({
  name: {
    type: String,
    required: [true, 'Nome do imóvel é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
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
  propertyDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Descrição da propriedade deve ter no máximo 2000 caracteres'],
  },
  type: {
    type: String,
    required: [true, 'Tipo do imóvel é obrigatório'],
    enum: ['apartment', 'house', 'commercial', 'land', 'penthouse', 'studio', 'loft', 'farm', 'warehouse', 'office'],
    trim: true,
  },
  status: {
    type: String,
    required: [true, 'Status do imóvel é obrigatório'],
    enum: ['available', 'sold', 'rented', 'reserved', 'inactive'],
    default: 'available',
    trim: true,
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'under_construction', 'to_renovate'],
    trim: true,
  },
  area: {
    type: Number,
    required: [true, 'Área é obrigatória'],
    min: [1, 'Área deve ser maior que 0'],
  },
  builtArea: {
    type: Number,
    min: [1, 'Área construída deve ser maior que 0'],
  },
  totalArea: {
    type: Number,
    min: [1, 'Área total deve ser maior que 0'],
  },
  bedrooms: {
    type: Number,
    min: [0, 'Número de quartos não pode ser negativo'],
    max: [50, 'Número de quartos não pode exceder 50'],
  },
  suites: {
    type: Number,
    min: [0, 'Número de suítes não pode ser negativo'],
    max: [20, 'Número de suítes não pode exceder 20'],
  },
  bathrooms: {
    type: Number,
    min: [0, 'Número de banheiros não pode ser negativo'],
    max: [20, 'Número de banheiros não pode exceder 20'],
  },
  parkingSpaces: {
    type: Number,
    min: [0, 'Número de vagas não pode ser negativo'],
    max: [20, 'Número de vagas não pode exceder 20'],
  },
  floor: {
    type: String,
    trim: true,
  },
  totalFloors: {
    type: Number,
    min: [1, 'Número total de andares deve ser pelo menos 1'],
    max: [200, 'Número total de andares não pode exceder 200'],
  },
  elevator: {
    type: Boolean,
    default: false,
  },
  furnished: {
    type: Boolean,
    default: false,
  },
  hasBalcony: {
    type: Boolean,
    default: false,
  },
  address: {
    street: {
      type: String,
      required: [true, 'Rua é obrigatória'],
      trim: true,
    },
    number: {
      type: String,
      required: [true, 'Número é obrigatório'],
      trim: true,
    },
    complement: {
      type: String,
      trim: true,
    },
    neighborhood: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório'],
      trim: true,
      maxlength: [2, 'Estado deve ter 2 caracteres'],
    },
    zipCode: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      trim: true,
      match: [/^\d{5}-?\d{3}$/, 'CEP inválido'],
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
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo'],
  },
  salePrice: {
    type: Number,
    min: [0, 'Preço de venda não pode ser negativo'],
  },
  rentPrice: {
    type: Number,
    min: [0, 'Preço de aluguel não pode ser negativo'],
  },
  pricePerSquareMeter: {
    type: Number,
    min: [0, 'Preço por m² não pode ser negativo'],
  },
  condominiumFee: {
    type: Number,
    min: [0, 'Taxa de condomínio não pode ser negativa'],
  },
  iptuValue: {
    type: Number,
    min: [0, 'Valor do IPTU não pode ser negativo'],
  },
  iptu: {
    type: Number,
    min: [0, 'IPTU não pode ser negativo'],
  },
  totalCost: {
    type: Number,
    min: [0, 'Custo total não pode ser negativo'],
  },
  sunPosition: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'],
    trim: true,
  },
  constructionYear: {
    type: String,
    trim: true,
  },
  yearBuilt: {
    type: Number,
    min: [1800, 'Ano de construção deve ser posterior a 1800'],
    max: [new Date().getFullYear() + 10, 'Ano de construção não pode ser muito futuro'],
  },
  buildingName: {
    type: String,
    trim: true,
    maxlength: [200, 'Nome do edifício deve ter no máximo 200 caracteres'],
  },
  amenities: {
    type: Schema.Types.Mixed,
    default: {},
  },
  condominiumAmenities: [{
    type: String,
    trim: true,
  }],
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
propertySchema.index({ realEstateId: 1 });
propertySchema.index({ ownerId: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ 'address.city': 1 });
propertySchema.index({ 'address.state': 1 });
propertySchema.index({ 'address.neighborhood': 1 });
propertySchema.index({ value: 1 });
propertySchema.index({ area: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ lastUpdated: -1 });

// Método para converter para resposta da API
propertySchema.methods.toPropertyResponse = function(): PropertyResponse {
  return {
    id: this._id.toString(),
    name: this.name,
    title: this.title,
    description: this.description,
    propertyDescription: this.propertyDescription,
    type: this.type,
    status: this.status,
    condition: this.condition,
    area: this.area,
    builtArea: this.builtArea,
    totalArea: this.totalArea,
    bedrooms: this.bedrooms,
    suites: this.suites,
    bathrooms: this.bathrooms,
    parkingSpaces: this.parkingSpaces,
    floor: this.floor,
    totalFloors: this.totalFloors,
    elevator: this.elevator,
    furnished: this.furnished,
    hasBalcony: this.hasBalcony,
    address: this.address,
    latitude: this.latitude,
    longitude: this.longitude,
    value: this.value,
    salePrice: this.salePrice,
    rentPrice: this.rentPrice,
    pricePerSquareMeter: this.pricePerSquareMeter,
    condominiumFee: this.condominiumFee,
    iptuValue: this.iptuValue,
    iptu: this.iptu,
    totalCost: this.totalCost,
    sunPosition: this.sunPosition,
    constructionYear: this.constructionYear,
    yearBuilt: this.yearBuilt,
    buildingName: this.buildingName,
    amenities: this.amenities,
    condominiumAmenities: this.condominiumAmenities,
    acceptsFinancing: this.acceptsFinancing,
    acceptsExchange: this.acceptsExchange,
    exclusiveProperty: this.exclusiveProperty,
    highlightProperty: this.highlightProperty,
    images: this.images || [],
    avatarUrl: this.avatarUrl,
    agent: this.agent,
    owner: this.owner,
    viewsCount: this.viewsCount,
    favoritesCount: this.favoritesCount,
    contactsCount: this.contactsCount,
    totalRatings: this.totalRatings,
    totalReviews: this.totalReviews,
    availableFrom: this.availableFrom,
    lastUpdated: this.lastUpdated,
    realEstateId: this.realEstateId.toString(),
    ownerId: this.ownerId.toString(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const PropertyModel = mongoose.model<IProperty>('Property', propertySchema);

// Função utilitária para converter documento para interface Property
export const toProperty = (propertyDoc: IProperty): Property => {
  const addressFormatted = `${propertyDoc.address.street}, ${propertyDoc.address.number}${propertyDoc.address.complement ? ', ' + propertyDoc.address.complement : ''}, ${propertyDoc.address.neighborhood}, ${propertyDoc.address.city} - ${propertyDoc.address.state}, ${propertyDoc.address.zipCode}`;
  
  return {
    id: propertyDoc._id.toString(),
    name: propertyDoc.name,
    title: propertyDoc.title,
    description: propertyDoc.description,
    propertyDescription: propertyDoc.propertyDescription,
    type: propertyDoc.type,
    status: propertyDoc.status,
    condition: propertyDoc.condition,
    area: propertyDoc.area,
    builtArea: propertyDoc.builtArea,
    totalArea: propertyDoc.totalArea,
    bedrooms: propertyDoc.bedrooms,
    suites: propertyDoc.suites,
    bathrooms: propertyDoc.bathrooms,
    parkingSpaces: propertyDoc.parkingSpaces,
    floor: propertyDoc.floor,
    totalFloors: propertyDoc.totalFloors,
    elevator: propertyDoc.elevator,
    furnished: propertyDoc.furnished,
    hasBalcony: propertyDoc.hasBalcony,
    address: addressFormatted,
    city: propertyDoc.address.city,
    state: propertyDoc.address.state,
    cep: propertyDoc.address.zipCode,
    neighborhood: propertyDoc.address.neighborhood,
    street: propertyDoc.address.street,
    streetNumber: propertyDoc.address.number,
    complement: propertyDoc.address.complement,
    zipCode: propertyDoc.address.zipCode,
    number: propertyDoc.address.number,
    latitude: propertyDoc.latitude,
    longitude: propertyDoc.longitude,
    value: propertyDoc.value,
    salePrice: propertyDoc.salePrice,
    rentPrice: propertyDoc.rentPrice,
    pricePerSquareMeter: propertyDoc.pricePerSquareMeter,
    condominiumFee: propertyDoc.condominiumFee,
    iptuValue: propertyDoc.iptuValue,
    iptu: propertyDoc.iptu,
    totalCost: propertyDoc.totalCost,
    sunPosition: propertyDoc.sunPosition,
    constructionYear: propertyDoc.constructionYear,
    yearBuilt: propertyDoc.yearBuilt,
    buildingName: propertyDoc.buildingName,
    amenities: propertyDoc.amenities,
    condominiumAmenities: propertyDoc.condominiumAmenities,
    acceptsFinancing: propertyDoc.acceptsFinancing,
    acceptsExchange: propertyDoc.acceptsExchange,
    exclusiveProperty: propertyDoc.exclusiveProperty,
    highlightProperty: propertyDoc.highlightProperty,
    images: propertyDoc.images || [],
    avatarUrl: propertyDoc.avatarUrl || (propertyDoc.images && propertyDoc.images.length > 0 ? propertyDoc.images[0] : undefined),
    agent: propertyDoc.agent,
    owner: propertyDoc.owner,
    viewsCount: propertyDoc.viewsCount,
    favoritesCount: propertyDoc.favoritesCount,
    contactsCount: propertyDoc.contactsCount,
    totalRatings: propertyDoc.totalRatings,
    totalReviews: propertyDoc.totalReviews,
    availableFrom: propertyDoc.availableFrom,
    lastUpdated: propertyDoc.lastUpdated,
    realEstateId: propertyDoc.realEstateId.toString(),
    ownerId: propertyDoc.ownerId.toString(),
    createdAt: propertyDoc.createdAt,
    updatedAt: propertyDoc.updatedAt,
  };
};