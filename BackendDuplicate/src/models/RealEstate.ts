import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento RealEstate no MongoDB
export interface IRealEstate extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  cnpj: string;
  tradeName?: string;
  description?: string;
  email?: string;
  phone: string;
  website?: string;
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
  contacts: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }[];
  businessHours?: {
    monday?: { open: string; close: string; };
    tuesday?: { open: string; close: string; };
    wednesday?: { open: string; close: string; };
    thursday?: { open: string; close: string; };
    friday?: { open: string; close: string; };
    saturday?: { open: string; close: string; };
    sunday?: { open: string; close: string; };
  };
  logo?: string;
  documents?: {
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  foundedAt?: Date;
  employeeCount?: number;
  specialties?: string[];
  serviceAreas?: string[];
  ownerId: mongoose.Types.ObjectId; // Relacionamento com User
  createdAt: Date;
  updatedAt: Date;
  toRealEstateResponse(): RealEstateResponse;
}

// Interface para compatibilidade
export interface RealEstate {
  id: string;
  name: string;
  cnpj: string;
  tradeName?: string;
  description?: string;
  email?: string;
  phone: string;
  website?: string;
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
  contacts: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }[];
  businessHours?: {
    monday?: { open: string; close: string; };
    tuesday?: { open: string; close: string; };
    wednesday?: { open: string; close: string; };
    thursday?: { open: string; close: string; };
    friday?: { open: string; close: string; };
    saturday?: { open: string; close: string; };
    sunday?: { open: string; close: string; };
  };
  logo?: string;
  documents?: {
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  foundedAt?: Date;
  employeeCount?: number;
  specialties?: string[];
  serviceAreas?: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRealEstateData {
  name: string;
  cnpj: string;
  tradeName?: string;
  description?: string;
  email?: string;
  phone: string;
  website?: string;
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
  contacts?: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }[];
  foundedAt?: Date;
  employeeCount?: number;
  specialties?: string[];
  serviceAreas?: string[];
}

export interface RealEstateResponse {
  id: string;
  name: string;
  cnpj: string;
  tradeName?: string;
  description?: string;
  email?: string;
  phone: string;
  website?: string;
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
  contacts: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }[];
  businessHours?: {
    monday?: { open: string; close: string; };
    tuesday?: { open: string; close: string; };
    wednesday?: { open: string; close: string; };
    thursday?: { open: string; close: string; };
    friday?: { open: string; close: string; };
    saturday?: { open: string; close: string; };
    sunday?: { open: string; close: string; };
  };
  logo?: string;
  documents?: {
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  foundedAt?: Date;
  employeeCount?: number;
  specialties?: string[];
  serviceAreas?: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Mongoose
const realEstateSchema = new Schema<IRealEstate>({
  name: {
    type: String,
    required: [true, 'Nome da imobiliária é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    trim: true,
    match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, 'CNPJ inválido'],
  },
  tradeName: {
    type: String,
    trim: true,
    maxlength: [100, 'Nome fantasia deve ter no máximo 100 caracteres'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Telefone inválido'],
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'URL do website inválida'],
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
      match: [/^\d{5}-?\d{3}$/, 'CEP inválido'],
    },
    country: {
      type: String,
      trim: true,
      default: 'Brasil',
    },
  },
  contacts: [{
    name: {
      type: String,
      required: [true, 'Nome do contato é obrigatório'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Cargo do contato é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email do contato inválido'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Telefone do contato inválido'],
    },
  }],
  businessHours: {
    monday: {
      open: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      close: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    tuesday: {
      open: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      close: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    wednesday: {
      open: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      close: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    thursday: {
      open: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      close: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    friday: {
      open: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      close: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    saturday: {
      open: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      close: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    sunday: {
      open: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      close: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
  },
  logo: {
    type: String,
    trim: true,
  },
  documents: [{
    type: {
      type: String,
      required: [true, 'Tipo do documento é obrigatório'],
      enum: ['license', 'certificate', 'contract', 'other'],
    },
    url: {
      type: String,
      required: [true, 'URL do documento é obrigatória'],
      trim: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  socialMedia: {
    facebook: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?facebook\.com\/.+/, 'URL do Facebook inválida'],
    },
    instagram: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?instagram\.com\/.+/, 'URL do Instagram inválida'],
    },
    linkedin: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'URL do LinkedIn inválida'],
    },
    twitter: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?twitter\.com\/.+/, 'URL do Twitter inválida'],
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  foundedAt: {
    type: Date,
  },
  employeeCount: {
    type: Number,
    min: [1, 'Número de funcionários deve ser pelo menos 1'],
  },
  specialties: [{
    type: String,
    trim: true,
    enum: ['residential', 'commercial', 'industrial', 'rural', 'luxury', 'investment'],
  }],
  serviceAreas: [{
    type: String,
    trim: true,
  }],
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Proprietário é obrigatório'],
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

// Índices
realEstateSchema.index({ cnpj: 1 }, { unique: true });
realEstateSchema.index({ ownerId: 1 });
realEstateSchema.index({ 'address.city': 1 });
realEstateSchema.index({ 'address.state': 1 });
realEstateSchema.index({ specialties: 1 });
realEstateSchema.index({ isActive: 1 });
realEstateSchema.index({ isVerified: 1 });
realEstateSchema.index({ createdAt: -1 });

// Método para converter para RealEstateResponse
realEstateSchema.methods.toRealEstateResponse = function(): RealEstateResponse {
  return {
    id: this._id.toString(),
    name: this.name,
    cnpj: this.cnpj,
    tradeName: this.tradeName,
    description: this.description,
    email: this.email,
    phone: this.phone,
    website: this.website,
    address: this.address,
    contacts: this.contacts,
    businessHours: this.businessHours,
    logo: this.logo,
    documents: this.documents,
    socialMedia: this.socialMedia,
    isActive: this.isActive,
    isVerified: this.isVerified,
    foundedAt: this.foundedAt,
    employeeCount: this.employeeCount,
    specialties: this.specialties,
    serviceAreas: this.serviceAreas,
    ownerId: this.ownerId.toString(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Modelo do Mongoose
export const RealEstateModel = mongoose.model<IRealEstate>('RealEstate', realEstateSchema);

// Função utilitária para converter IRealEstate para RealEstate
export const toRealEstate = (realEstateDoc: IRealEstate): RealEstate => {
  return {
    id: realEstateDoc._id.toString(),
    name: realEstateDoc.name,
    cnpj: realEstateDoc.cnpj,
    tradeName: realEstateDoc.tradeName,
    description: realEstateDoc.description,
    email: realEstateDoc.email,
    phone: realEstateDoc.phone,
    website: realEstateDoc.website,
    address: realEstateDoc.address,
    contacts: realEstateDoc.contacts,
    businessHours: realEstateDoc.businessHours,
    logo: realEstateDoc.logo,
    documents: realEstateDoc.documents,
    socialMedia: realEstateDoc.socialMedia,
    isActive: realEstateDoc.isActive,
    isVerified: realEstateDoc.isVerified,
    foundedAt: realEstateDoc.foundedAt,
    employeeCount: realEstateDoc.employeeCount,
    specialties: realEstateDoc.specialties,
    serviceAreas: realEstateDoc.serviceAreas,
    ownerId: realEstateDoc.ownerId.toString(),
    createdAt: realEstateDoc.createdAt,
    updatedAt: realEstateDoc.updatedAt,
  };
};