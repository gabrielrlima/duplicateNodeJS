import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento Broker no MongoDB
export interface IBroker extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Relacionamento com User
  realEstateId: mongoose.Types.ObjectId; // Relacionamento com RealEstate
  brokerGroupId?: mongoose.Types.ObjectId; // Relacionamento com BrokerGroup
  licenseNumber: string;
  licenseState: string;
  licenseExpiryDate: Date;
  isManager: boolean;
  managerLevel?: 'junior' | 'senior' | 'director';
  hireDate: Date;
  terminationDate?: Date;
  employmentStatus: 'active' | 'inactive' | 'suspended' | 'terminated';
  commissionRate: number; // Percentual de comissão (0-100)
  baseSalary?: number;
  salesTarget?: number;
  territory?: string[];
  specializations?: string[];
  languages?: string[];
  certifications?: {
    name: string;
    issuedBy: string;
    issuedDate: Date;
    expiryDate?: Date;
    certificateUrl?: string;
  }[];
  performance?: {
    year: number;
    salesCount: number;
    salesVolume: number;
    commissionEarned: number;
    rating?: number; // 1-5
  }[];
  permissions?: {
    canCreateListings: boolean;
    canEditListings: boolean;
    canDeleteListings: boolean;
    canManageClients: boolean;
    canViewReports: boolean;
    canManageTeam: boolean;
    canApproveContracts: boolean;
    canAccessFinancials: boolean;
  };
  contactPreferences?: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    whatsapp: boolean;
  };
  workSchedule?: {
    monday?: { start: string; end: string; };
    tuesday?: { start: string; end: string; };
    wednesday?: { start: string; end: string; };
    thursday?: { start: string; end: string; };
    friday?: { start: string; end: string; };
    saturday?: { start: string; end: string; };
    sunday?: { start: string; end: string; };
  };
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  toBrokerResponse(): BrokerResponse;
}

// Interface para compatibilidade
export interface Broker {
  id: string;
  userId: string;
  realEstateId: string;
  brokerGroupId?: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiryDate: Date;
  isManager: boolean;
  managerLevel?: 'junior' | 'senior' | 'director';
  hireDate: Date;
  terminationDate?: Date;
  employmentStatus: 'active' | 'inactive' | 'suspended' | 'terminated';
  commissionRate: number;
  baseSalary?: number;
  salesTarget?: number;
  territory?: string[];
  specializations?: string[];
  languages?: string[];
  certifications?: {
    name: string;
    issuedBy: string;
    issuedDate: Date;
    expiryDate?: Date;
    certificateUrl?: string;
  }[];
  performance?: {
    year: number;
    salesCount: number;
    salesVolume: number;
    commissionEarned: number;
    rating?: number;
  }[];
  permissions?: {
    canCreateListings: boolean;
    canEditListings: boolean;
    canDeleteListings: boolean;
    canManageClients: boolean;
    canViewReports: boolean;
    canManageTeam: boolean;
    canApproveContracts: boolean;
    canAccessFinancials: boolean;
  };
  contactPreferences?: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    whatsapp: boolean;
  };
  workSchedule?: {
    monday?: { start: string; end: string; };
    tuesday?: { start: string; end: string; };
    wednesday?: { start: string; end: string; };
    thursday?: { start: string; end: string; };
    friday?: { start: string; end: string; };
    saturday?: { start: string; end: string; };
    sunday?: { start: string; end: string; };
  };
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrokerData {
  userId: string;
  realEstateId: string;
  brokerGroupId?: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiryDate: Date;
  isManager?: boolean;
  managerLevel?: 'junior' | 'senior' | 'director';
  hireDate: Date;
  commissionRate: number;
  baseSalary?: number;
  salesTarget?: number;
  territory?: string[];
  specializations?: string[];
  languages?: string[];
}

export interface BrokerResponse {
  id: string;
  userId: string;
  realEstateId: string;
  brokerGroupId?: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiryDate: Date;
  isManager: boolean;
  managerLevel?: 'junior' | 'senior' | 'director';
  hireDate: Date;
  terminationDate?: Date;
  employmentStatus: 'active' | 'inactive' | 'suspended' | 'terminated';
  commissionRate: number;
  baseSalary?: number;
  salesTarget?: number;
  territory?: string[];
  specializations?: string[];
  languages?: string[];
  certifications?: {
    name: string;
    issuedBy: string;
    issuedDate: Date;
    expiryDate?: Date;
    certificateUrl?: string;
  }[];
  performance?: {
    year: number;
    salesCount: number;
    salesVolume: number;
    commissionEarned: number;
    rating?: number;
  }[];
  permissions?: {
    canCreateListings: boolean;
    canEditListings: boolean;
    canDeleteListings: boolean;
    canManageClients: boolean;
    canViewReports: boolean;
    canManageTeam: boolean;
    canApproveContracts: boolean;
    canAccessFinancials: boolean;
  };
  contactPreferences?: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    whatsapp: boolean;
  };
  workSchedule?: {
    monday?: { start: string; end: string; };
    tuesday?: { start: string; end: string; };
    wednesday?: { start: string; end: string; };
    thursday?: { start: string; end: string; };
    friday?: { start: string; end: string; };
    saturday?: { start: string; end: string; };
    sunday?: { start: string; end: string; };
  };
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Mongoose
const brokerSchema = new Schema<IBroker>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório'],
  },
  realEstateId: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstate',
    required: [true, 'Imobiliária é obrigatória'],
  },
  brokerGroupId: {
    type: Schema.Types.ObjectId,
    ref: 'BrokerGroup',
  },
  licenseNumber: {
    type: String,
    required: [true, 'Número da licença é obrigatório'],
    trim: true,
  },
  licenseState: {
    type: String,
    required: [true, 'Estado da licença é obrigatório'],
    trim: true,
    maxlength: [2, 'Estado deve ter 2 caracteres'],
  },
  licenseExpiryDate: {
    type: Date,
    required: [true, 'Data de expiração da licença é obrigatória'],
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  managerLevel: {
    type: String,
    enum: ['junior', 'senior', 'director'],
  },
  hireDate: {
    type: Date,
    required: [true, 'Data de contratação é obrigatória'],
    default: Date.now,
  },
  terminationDate: {
    type: Date,
  },
  employmentStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active',
  },
  commissionRate: {
    type: Number,
    required: [true, 'Taxa de comissão é obrigatória'],
    min: [0, 'Taxa de comissão não pode ser negativa'],
    max: [100, 'Taxa de comissão não pode ser maior que 100%'],
  },
  baseSalary: {
    type: Number,
    min: [0, 'Salário base não pode ser negativo'],
  },
  salesTarget: {
    type: Number,
    min: [0, 'Meta de vendas não pode ser negativa'],
  },
  territory: [{
    type: String,
    trim: true,
  }],
  specializations: [{
    type: String,
    trim: true,
    enum: ['residential', 'commercial', 'industrial', 'rural', 'luxury', 'investment', 'rental'],
  }],
  languages: [{
    type: String,
    trim: true,
  }],
  certifications: [{
    name: {
      type: String,
      required: [true, 'Nome da certificação é obrigatório'],
      trim: true,
    },
    issuedBy: {
      type: String,
      required: [true, 'Emissor da certificação é obrigatório'],
      trim: true,
    },
    issuedDate: {
      type: Date,
      required: [true, 'Data de emissão é obrigatória'],
    },
    expiryDate: {
      type: Date,
    },
    certificateUrl: {
      type: String,
      trim: true,
    },
  }],
  performance: [{
    year: {
      type: Number,
      required: [true, 'Ano é obrigatório'],
      min: [2000, 'Ano deve ser maior que 2000'],
    },
    salesCount: {
      type: Number,
      default: 0,
      min: [0, 'Número de vendas não pode ser negativo'],
    },
    salesVolume: {
      type: Number,
      default: 0,
      min: [0, 'Volume de vendas não pode ser negativo'],
    },
    commissionEarned: {
      type: Number,
      default: 0,
      min: [0, 'Comissão ganha não pode ser negativa'],
    },
    rating: {
      type: Number,
      min: [1, 'Avaliação deve ser entre 1 e 5'],
      max: [5, 'Avaliação deve ser entre 1 e 5'],
    },
  }],
  permissions: {
    canCreateListings: {
      type: Boolean,
      default: true,
    },
    canEditListings: {
      type: Boolean,
      default: true,
    },
    canDeleteListings: {
      type: Boolean,
      default: false,
    },
    canManageClients: {
      type: Boolean,
      default: true,
    },
    canViewReports: {
      type: Boolean,
      default: false,
    },
    canManageTeam: {
      type: Boolean,
      default: false,
    },
    canApproveContracts: {
      type: Boolean,
      default: false,
    },
    canAccessFinancials: {
      type: Boolean,
      default: false,
    },
  },
  contactPreferences: {
    email: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: Boolean,
      default: true,
    },
    whatsapp: {
      type: Boolean,
      default: false,
    },
  },
  workSchedule: {
    monday: {
      start: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      end: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    tuesday: {
      start: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      end: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    wednesday: {
      start: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      end: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    thursday: {
      start: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      end: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    friday: {
      start: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      end: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    saturday: {
      start: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      end: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
    sunday: {
      start: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
      end: { type: String, match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'] },
    },
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notas devem ter no máximo 1000 caracteres'],
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

// Índices
brokerSchema.index({ userId: 1 }, { unique: true });
brokerSchema.index({ realEstateId: 1 });
brokerSchema.index({ brokerGroupId: 1 });
brokerSchema.index({ licenseNumber: 1 }, { unique: true });
brokerSchema.index({ licenseState: 1 });
brokerSchema.index({ isManager: 1 });
brokerSchema.index({ employmentStatus: 1 });
brokerSchema.index({ isActive: 1 });
brokerSchema.index({ hireDate: -1 });
brokerSchema.index({ createdAt: -1 });

// Middleware para definir permissões de gerente
brokerSchema.pre('save', function(next) {
  if (this.isManager && this.permissions) {
    // Gerentes têm permissões expandidas
    this.permissions.canViewReports = true;
    this.permissions.canManageTeam = true;
    
    if (this.managerLevel === 'senior' || this.managerLevel === 'director') {
      this.permissions.canApproveContracts = true;
    }
    
    if (this.managerLevel === 'director') {
      this.permissions.canAccessFinancials = true;
      this.permissions.canDeleteListings = true;
    }
  }
  next();
});

// Método para converter para BrokerResponse
brokerSchema.methods.toBrokerResponse = function(): BrokerResponse {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    realEstateId: this.realEstateId.toString(),
    brokerGroupId: this.brokerGroupId?.toString(),
    licenseNumber: this.licenseNumber,
    licenseState: this.licenseState,
    licenseExpiryDate: this.licenseExpiryDate,
    isManager: this.isManager,
    managerLevel: this.managerLevel,
    hireDate: this.hireDate,
    terminationDate: this.terminationDate,
    employmentStatus: this.employmentStatus,
    commissionRate: this.commissionRate,
    baseSalary: this.baseSalary,
    salesTarget: this.salesTarget,
    territory: this.territory,
    specializations: this.specializations,
    languages: this.languages,
    certifications: this.certifications,
    performance: this.performance,
    permissions: this.permissions,
    contactPreferences: this.contactPreferences,
    workSchedule: this.workSchedule,
    notes: this.notes,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Modelo do Mongoose
export const BrokerModel = mongoose.model<IBroker>('Broker', brokerSchema);

// Função utilitária para converter IBroker para Broker
export const toBroker = (brokerDoc: IBroker): Broker => {
  return {
    id: brokerDoc._id.toString(),
    userId: brokerDoc.userId.toString(),
    realEstateId: brokerDoc.realEstateId.toString(),
    brokerGroupId: brokerDoc.brokerGroupId?.toString(),
    licenseNumber: brokerDoc.licenseNumber,
    licenseState: brokerDoc.licenseState,
    licenseExpiryDate: brokerDoc.licenseExpiryDate,
    isManager: brokerDoc.isManager,
    managerLevel: brokerDoc.managerLevel,
    hireDate: brokerDoc.hireDate,
    terminationDate: brokerDoc.terminationDate,
    employmentStatus: brokerDoc.employmentStatus,
    commissionRate: brokerDoc.commissionRate,
    baseSalary: brokerDoc.baseSalary,
    salesTarget: brokerDoc.salesTarget,
    territory: brokerDoc.territory,
    specializations: brokerDoc.specializations,
    languages: brokerDoc.languages,
    certifications: brokerDoc.certifications,
    performance: brokerDoc.performance,
    permissions: brokerDoc.permissions,
    contactPreferences: brokerDoc.contactPreferences,
    workSchedule: brokerDoc.workSchedule,
    notes: brokerDoc.notes,
    isActive: brokerDoc.isActive,
    createdAt: brokerDoc.createdAt,
    updatedAt: brokerDoc.updatedAt,
  };
};