import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento Empreendimento no MongoDB
export interface IEmpreendimento extends Document {
  name: string;
  description?: string;
  type: 'residential' | 'commercial' | 'mixed' | 'industrial';
  status: 'planning' | 'construction' | 'completed' | 'delivered' | 'inactive';
  
  // Informações do empreendimento
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  
  // Características do empreendimento
  characteristics: {
    totalArea: number; // Área total do empreendimento em m²
    builtArea: number; // Área construída em m²
    commonArea: number; // Área comum em m²
    floors: number; // Número de andares
    unitsPerFloor: number; // Unidades por andar
    elevators: number; // Número de elevadores
    parkingSpaces: number; // Vagas de garagem
  };
  
  // Amenidades e facilidades
  amenities: {
    pool: boolean;
    gym: boolean;
    playground: boolean;
    partyRoom: boolean;
    barbecueArea: boolean;
    sportsField: boolean;
    garden: boolean;
    concierge: boolean;
    security: boolean;
    gourmetSpace: boolean;
    coworking: boolean;
    petSpace: boolean;
    bikeRack: boolean;
    electricCarCharger: boolean;
  };
  
  // Localização
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Valores e financiamento
  pricing: {
    minPrice: number; // Preço mínimo das unidades
    maxPrice: number; // Preço máximo das unidades
    averagePrice: number; // Preço médio
    pricePerSqm: number; // Preço por m²
    maintenanceFee?: number; // Taxa de condomínio
    financing: {
      bankFinancing: boolean;
      constructorFinancing: boolean;
      governmentPrograms: string[]; // Ex: ['Minha Casa Minha Vida', 'FGTS']
    };
  };
  
  // Cronograma de construção
  timeline: {
    launchDate?: Date;
    constructionStart?: Date;
    expectedCompletion?: Date;
    deliveryDate?: Date;
    constructionProgress: number; // Percentual de conclusão (0-100)
  };
  
  // Documentação
  documentation: {
    incorporationLicense?: string;
    environmentalLicense?: string;
    constructionPermit?: string;
    habitationCertificate?: string;
    memorial?: string;
    technicalSpecs?: string;
  };
  
  // Construtora/Incorporadora
  developer: {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    website?: string;
    experience?: string;
  };
  
  // Mídia
  media: {
    images: string[]; // URLs das imagens
    videos: string[]; // URLs dos vídeos
    virtualTour?: string; // URL do tour virtual
    floorPlans: string[]; // URLs das plantas
    brochure?: string; // URL do material promocional
  };
  
  // Relacionamentos
  realEstateId: mongoose.Types.ObjectId; // Imobiliária responsável
  ownerId: mongoose.Types.ObjectId; // Proprietário/usuário responsável
  agent?: mongoose.Types.ObjectId; // Corretor responsável
  
  // Estatísticas
  stats: {
    views: number;
    favorites: number;
    inquiries: number;
    visits: number;
  };
  
  // Metadados
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  
  // Método para converter para resposta da API
  toEmpreendimentoResponse(): EmpreendimentoResponse;
}

// Interface para criação de empreendimento
export interface CreateEmpreendimentoData {
  name: string;
  description?: string;
  type: 'residential' | 'commercial' | 'mixed' | 'industrial';
  status: 'planning' | 'construction' | 'completed' | 'delivered' | 'inactive';
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  characteristics: {
    totalArea: number;
    builtArea: number;
    commonArea: number;
    floors: number;
    unitsPerFloor: number;
    elevators: number;
    parkingSpaces: number;
  };
  amenities: {
    pool: boolean;
    gym: boolean;
    playground: boolean;
    partyRoom: boolean;
    barbecueArea: boolean;
    sportsField: boolean;
    garden: boolean;
    concierge: boolean;
    security: boolean;
    gourmetSpace: boolean;
    coworking: boolean;
    petSpace: boolean;
    bikeRack: boolean;
    electricCarCharger: boolean;
  };
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  pricing: {
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    pricePerSqm: number;
    maintenanceFee?: number;
    financing: {
      bankFinancing: boolean;
      constructorFinancing: boolean;
      governmentPrograms: string[];
    };
  };
  timeline: {
    launchDate?: Date;
    constructionStart?: Date;
    expectedCompletion?: Date;
    deliveryDate?: Date;
    constructionProgress: number;
  };
  documentation?: {
    incorporationLicense?: string;
    environmentalLicense?: string;
    constructionPermit?: string;
    habitationCertificate?: string;
    memorial?: string;
    technicalSpecs?: string;
  };
  developer: {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    website?: string;
    experience?: string;
  };
  media?: {
    images?: string[];
    videos?: string[];
    virtualTour?: string;
    floorPlans?: string[];
    brochure?: string;
  };
  realEstateId: string;
  ownerId: string;
  agent?: string;
}

// Interface para resposta da API
export interface EmpreendimentoResponse {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  characteristics: {
    totalArea: number;
    builtArea: number;
    commonArea: number;
    floors: number;
    unitsPerFloor: number;
    elevators: number;
    parkingSpaces: number;
  };
  amenities: {
    pool: boolean;
    gym: boolean;
    playground: boolean;
    partyRoom: boolean;
    barbecueArea: boolean;
    sportsField: boolean;
    garden: boolean;
    concierge: boolean;
    security: boolean;
    gourmetSpace: boolean;
    coworking: boolean;
    petSpace: boolean;
    bikeRack: boolean;
    electricCarCharger: boolean;
  };
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  pricing: {
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    pricePerSqm: number;
    maintenanceFee?: number;
    financing: {
      bankFinancing: boolean;
      constructorFinancing: boolean;
      governmentPrograms: string[];
    };
  };
  timeline: {
    launchDate?: string;
    constructionStart?: string;
    expectedCompletion?: string;
    deliveryDate?: string;
    constructionProgress: number;
  };
  documentation: {
    incorporationLicense?: string;
    environmentalLicense?: string;
    constructionPermit?: string;
    habitationCertificate?: string;
    memorial?: string;
    technicalSpecs?: string;
  };
  developer: {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    website?: string;
    experience?: string;
  };
  media: {
    images: string[];
    videos: string[];
    virtualTour?: string;
    floorPlans: string[];
    brochure?: string;
  };
  realEstateId: string;
  ownerId: string;
  agent?: string;
  stats: {
    views: number;
    favorites: number;
    inquiries: number;
    visits: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Schema do Mongoose
const empreendimentoSchema = new Schema<IEmpreendimento>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'mixed', 'industrial']
  },
  status: {
    type: String,
    required: true,
    enum: ['planning', 'construction', 'completed', 'delivered', 'inactive'],
    default: 'planning'
  },
  
  totalUnits: { type: Number, required: true, min: 1 },
  availableUnits: { type: Number, required: true, min: 0 },
  soldUnits: { type: Number, required: true, min: 0 },
  reservedUnits: { type: Number, required: true, min: 0 },
  
  characteristics: {
    totalArea: { type: Number, required: true, min: 0 },
    builtArea: { type: Number, required: true, min: 0 },
    commonArea: { type: Number, required: true, min: 0 },
    floors: { type: Number, required: true, min: 1 },
    unitsPerFloor: { type: Number, required: true, min: 1 },
    elevators: { type: Number, required: true, min: 0 },
    parkingSpaces: { type: Number, required: true, min: 0 }
  },
  
  amenities: {
    pool: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    playground: { type: Boolean, default: false },
    partyRoom: { type: Boolean, default: false },
    barbecueArea: { type: Boolean, default: false },
    sportsField: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    concierge: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    gourmetSpace: { type: Boolean, default: false },
    coworking: { type: Boolean, default: false },
    petSpace: { type: Boolean, default: false },
    bikeRack: { type: Boolean, default: false },
    electricCarCharger: { type: Boolean, default: false }
  },
  
  location: {
    address: { type: String, required: true, trim: true },
    neighborhood: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, maxlength: 2 },
    zipCode: { type: String, required: true, trim: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  pricing: {
    minPrice: { type: Number, required: true, min: 0 },
    maxPrice: { type: Number, required: true, min: 0 },
    averagePrice: { type: Number, required: true, min: 0 },
    pricePerSqm: { type: Number, required: true, min: 0 },
    maintenanceFee: { type: Number, min: 0 },
    financing: {
      bankFinancing: { type: Boolean, default: false },
      constructorFinancing: { type: Boolean, default: false },
      governmentPrograms: [{ type: String, trim: true }]
    }
  },
  
  timeline: {
    launchDate: { type: Date },
    constructionStart: { type: Date },
    expectedCompletion: { type: Date },
    deliveryDate: { type: Date },
    constructionProgress: { type: Number, required: true, min: 0, max: 100, default: 0 }
  },
  
  documentation: {
    incorporationLicense: { type: String, trim: true },
    environmentalLicense: { type: String, trim: true },
    constructionPermit: { type: String, trim: true },
    habitationCertificate: { type: String, trim: true },
    memorial: { type: String, trim: true },
    technicalSpecs: { type: String, trim: true }
  },
  
  developer: {
    name: { type: String, required: true, trim: true },
    cnpj: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
    experience: { type: String, trim: true }
  },
  
  media: {
    images: [{ type: String, trim: true }],
    videos: [{ type: String, trim: true }],
    virtualTour: { type: String, trim: true },
    floorPlans: [{ type: String, trim: true }],
    brochure: { type: String, trim: true }
  },
  
  realEstateId: { type: Schema.Types.ObjectId, ref: 'RealEstate', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: Schema.Types.ObjectId, ref: 'User' },
  
  stats: {
    views: { type: Number, default: 0, min: 0 },
    favorites: { type: Number, default: 0, min: 0 },
    inquiries: { type: Number, default: 0, min: 0 },
    visits: { type: Number, default: 0, min: 0 }
  },
  
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para otimização de consultas
empreendimentoSchema.index({ realEstateId: 1, isActive: 1 });
empreendimentoSchema.index({ ownerId: 1 });
empreendimentoSchema.index({ 'location.city': 1, 'location.state': 1 });
empreendimentoSchema.index({ type: 1, status: 1 });
empreendimentoSchema.index({ 'pricing.minPrice': 1, 'pricing.maxPrice': 1 });
empreendimentoSchema.index({ 'characteristics.totalArea': 1 });
empreendimentoSchema.index({ createdAt: -1 });
empreendimentoSchema.index({ updatedAt: -1 });

// Método para converter para resposta da API
empreendimentoSchema.methods.toEmpreendimentoResponse = function(): EmpreendimentoResponse {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    type: this.type,
    status: this.status,
    totalUnits: this.totalUnits,
    availableUnits: this.availableUnits,
    soldUnits: this.soldUnits,
    reservedUnits: this.reservedUnits,
    characteristics: this.characteristics,
    amenities: this.amenities,
    location: this.location,
    pricing: {
      ...this.pricing,
      financing: this.pricing.financing
    },
    timeline: {
      launchDate: this.timeline.launchDate?.toISOString(),
      constructionStart: this.timeline.constructionStart?.toISOString(),
      expectedCompletion: this.timeline.expectedCompletion?.toISOString(),
      deliveryDate: this.timeline.deliveryDate?.toISOString(),
      constructionProgress: this.timeline.constructionProgress
    },
    documentation: this.documentation,
    developer: this.developer,
    media: this.media,
    realEstateId: this.realEstateId.toString(),
    ownerId: this.ownerId.toString(),
    agent: this.agent?.toString(),
    stats: this.stats,
    isActive: this.isActive,
    createdAt: this.createdAt.toISOString(),
    updatedAt: this.updatedAt.toISOString()
  };
};

// Middleware para soft delete
empreendimentoSchema.pre(/^find/, function() {
  // @ts-ignore
  this.where({ deletedAt: { $exists: false } });
});

export const Empreendimento = mongoose.model<IEmpreendimento>('Empreendimento', empreendimentoSchema);

// Função utilitária para formatar empreendimento para resposta
export const toEmpreendimento = (empreendimento: IEmpreendimento): EmpreendimentoResponse => {
  return empreendimento.toEmpreendimentoResponse();
};