import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento BrokerGroup no MongoDB
export interface IBrokerGroup extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  realEstateId: mongoose.Types.ObjectId; // Relacionamento com RealEstate
  managerId?: mongoose.Types.ObjectId; // Relacionamento com Broker (gerente do grupo)
  groupType: 'sales' | 'rental' | 'commercial' | 'luxury' | 'investment' | 'mixed';
  territory?: string[];
  targetMarket?: string[];
  commissionStructure?: {
    baseRate: number;
    bonusThresholds?: {
      threshold: number;
      bonusRate: number;
    }[];
    teamBonusRate?: number;
  };
  permissions: {
    canCreateListings: boolean;
    canEditListings: boolean;
    canDeleteListings: boolean;
    canManageClients: boolean;
    canViewReports: boolean;
    canManageTeam: boolean;
    canApproveContracts: boolean;
    canAccessFinancials: boolean;
    canEditGroupSettings: boolean;
    canInviteMembers: boolean;
  };
  settings?: {
    autoAssignLeads: boolean;
    leadDistributionMethod: 'round_robin' | 'performance_based' | 'manual';
    requireApprovalForListings: boolean;
    allowCrossGroupCollaboration: boolean;
    notificationSettings: {
      newLeads: boolean;
      newListings: boolean;
      contractUpdates: boolean;
      teamAnnouncements: boolean;
    };
  };
  goals?: {
    year: number;
    salesTarget: number;
    revenueTarget: number;
    listingsTarget: number;
  }[];
  performance?: {
    year: number;
    salesCount: number;
    salesVolume: number;
    commissionEarned: number;
    listingsCreated: number;
    averageRating?: number;
  }[];
  meetingSchedule?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    time?: string; // HH:MM format
    location?: string;
    isVirtual?: boolean;
  };
  resources?: {
    name: string;
    type: 'document' | 'link' | 'tool' | 'template';
    url: string;
    description?: string;
    uploadedAt: Date;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  toBrokerGroupResponse(): BrokerGroupResponse;
}

// Interface para compatibilidade
export interface BrokerGroup {
  id: string;
  name: string;
  description?: string;
  realEstateId: string;
  managerId?: string;
  groupType: 'sales' | 'rental' | 'commercial' | 'luxury' | 'investment' | 'mixed';
  territory?: string[];
  targetMarket?: string[];
  commissionStructure?: {
    baseRate: number;
    bonusThresholds?: {
      threshold: number;
      bonusRate: number;
    }[];
    teamBonusRate?: number;
  };
  permissions: {
    canCreateListings: boolean;
    canEditListings: boolean;
    canDeleteListings: boolean;
    canManageClients: boolean;
    canViewReports: boolean;
    canManageTeam: boolean;
    canApproveContracts: boolean;
    canAccessFinancials: boolean;
    canEditGroupSettings: boolean;
    canInviteMembers: boolean;
  };
  settings?: {
    autoAssignLeads: boolean;
    leadDistributionMethod: 'round_robin' | 'performance_based' | 'manual';
    requireApprovalForListings: boolean;
    allowCrossGroupCollaboration: boolean;
    notificationSettings: {
      newLeads: boolean;
      newListings: boolean;
      contractUpdates: boolean;
      teamAnnouncements: boolean;
    };
  };
  goals?: {
    year: number;
    salesTarget: number;
    revenueTarget: number;
    listingsTarget: number;
  }[];
  performance?: {
    year: number;
    salesCount: number;
    salesVolume: number;
    commissionEarned: number;
    listingsCreated: number;
    averageRating?: number;
  }[];
  meetingSchedule?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek?: number;
    time?: string;
    location?: string;
    isVirtual?: boolean;
  };
  resources?: {
    name: string;
    type: 'document' | 'link' | 'tool' | 'template';
    url: string;
    description?: string;
    uploadedAt: Date;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrokerGroupData {
  name: string;
  description?: string;
  realEstateId: string;
  managerId?: string;
  groupType: 'sales' | 'rental' | 'commercial' | 'luxury' | 'investment' | 'mixed';
  territory?: string[];
  targetMarket?: string[];
  commissionStructure?: {
    baseRate: number;
    bonusThresholds?: {
      threshold: number;
      bonusRate: number;
    }[];
    teamBonusRate?: number;
  };
}

export interface BrokerGroupResponse {
  id: string;
  name: string;
  description?: string;
  realEstateId: string;
  managerId?: string;
  groupType: 'sales' | 'rental' | 'commercial' | 'luxury' | 'investment' | 'mixed';
  territory?: string[];
  targetMarket?: string[];
  commissionStructure?: {
    baseRate: number;
    bonusThresholds?: {
      threshold: number;
      bonusRate: number;
    }[];
    teamBonusRate?: number;
  };
  permissions: {
    canCreateListings: boolean;
    canEditListings: boolean;
    canDeleteListings: boolean;
    canManageClients: boolean;
    canViewReports: boolean;
    canManageTeam: boolean;
    canApproveContracts: boolean;
    canAccessFinancials: boolean;
    canEditGroupSettings: boolean;
    canInviteMembers: boolean;
  };
  settings?: {
    autoAssignLeads: boolean;
    leadDistributionMethod: 'round_robin' | 'performance_based' | 'manual';
    requireApprovalForListings: boolean;
    allowCrossGroupCollaboration: boolean;
    notificationSettings: {
      newLeads: boolean;
      newListings: boolean;
      contractUpdates: boolean;
      teamAnnouncements: boolean;
    };
  };
  goals?: {
    year: number;
    salesTarget: number;
    revenueTarget: number;
    listingsTarget: number;
  }[];
  performance?: {
    year: number;
    salesCount: number;
    salesVolume: number;
    commissionEarned: number;
    listingsCreated: number;
    averageRating?: number;
  }[];
  meetingSchedule?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek?: number;
    time?: string;
    location?: string;
    isVirtual?: boolean;
  };
  resources?: {
    name: string;
    type: 'document' | 'link' | 'tool' | 'template';
    url: string;
    description?: string;
    uploadedAt: Date;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Mongoose
const brokerGroupSchema = new Schema<IBrokerGroup>({
  name: {
    type: String,
    required: [true, 'Nome do grupo é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres'],
  },
  realEstateId: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstate',
    required: [true, 'Imobiliária é obrigatória'],
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: 'Broker',
  },
  groupType: {
    type: String,
    required: [true, 'Tipo do grupo é obrigatório'],
    enum: ['sales', 'rental', 'commercial', 'luxury', 'investment', 'mixed'],
  },
  territory: [{
    type: String,
    trim: true,
  }],
  targetMarket: [{
    type: String,
    trim: true,
    enum: ['first_time_buyers', 'luxury_buyers', 'investors', 'commercial_clients', 'international_clients', 'seniors', 'families'],
  }],
  commissionStructure: {
    baseRate: {
      type: Number,
      required: [true, 'Taxa base de comissão é obrigatória'],
      min: [0, 'Taxa base não pode ser negativa'],
      max: [100, 'Taxa base não pode ser maior que 100%'],
    },
    bonusThresholds: [{
      threshold: {
        type: Number,
        required: [true, 'Limite para bônus é obrigatório'],
        min: [0, 'Limite não pode ser negativo'],
      },
      bonusRate: {
        type: Number,
        required: [true, 'Taxa de bônus é obrigatória'],
        min: [0, 'Taxa de bônus não pode ser negativa'],
        max: [100, 'Taxa de bônus não pode ser maior que 100%'],
      },
    }],
    teamBonusRate: {
      type: Number,
      min: [0, 'Taxa de bônus da equipe não pode ser negativa'],
      max: [100, 'Taxa de bônus da equipe não pode ser maior que 100%'],
    },
  },
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
    canEditGroupSettings: {
      type: Boolean,
      default: false,
    },
    canInviteMembers: {
      type: Boolean,
      default: false,
    },
  },
  settings: {
    autoAssignLeads: {
      type: Boolean,
      default: false,
    },
    leadDistributionMethod: {
      type: String,
      enum: ['round_robin', 'performance_based', 'manual'],
      default: 'manual',
    },
    requireApprovalForListings: {
      type: Boolean,
      default: false,
    },
    allowCrossGroupCollaboration: {
      type: Boolean,
      default: true,
    },
    notificationSettings: {
      newLeads: {
        type: Boolean,
        default: true,
      },
      newListings: {
        type: Boolean,
        default: true,
      },
      contractUpdates: {
        type: Boolean,
        default: true,
      },
      teamAnnouncements: {
        type: Boolean,
        default: true,
      },
    },
  },
  goals: [{
    year: {
      type: Number,
      required: [true, 'Ano é obrigatório'],
      min: [2000, 'Ano deve ser maior que 2000'],
    },
    salesTarget: {
      type: Number,
      default: 0,
      min: [0, 'Meta de vendas não pode ser negativa'],
    },
    revenueTarget: {
      type: Number,
      default: 0,
      min: [0, 'Meta de receita não pode ser negativa'],
    },
    listingsTarget: {
      type: Number,
      default: 0,
      min: [0, 'Meta de anúncios não pode ser negativa'],
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
    listingsCreated: {
      type: Number,
      default: 0,
      min: [0, 'Anúncios criados não pode ser negativo'],
    },
    averageRating: {
      type: Number,
      min: [1, 'Avaliação média deve ser entre 1 e 5'],
      max: [5, 'Avaliação média deve ser entre 1 e 5'],
    },
  }],
  meetingSchedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly'],
      default: 'weekly',
    },
    dayOfWeek: {
      type: Number,
      min: [0, 'Dia da semana deve ser entre 0 e 6'],
      max: [6, 'Dia da semana deve ser entre 0 e 6'],
    },
    time: {
      type: String,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'],
    },
    location: {
      type: String,
      trim: true,
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
  },
  resources: [{
    name: {
      type: String,
      required: [true, 'Nome do recurso é obrigatório'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Tipo do recurso é obrigatório'],
      enum: ['document', 'link', 'tool', 'template'],
    },
    url: {
      type: String,
      required: [true, 'URL do recurso é obrigatória'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Descrição deve ter no máximo 500 caracteres'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
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
brokerGroupSchema.index({ realEstateId: 1 });
brokerGroupSchema.index({ managerId: 1 });
brokerGroupSchema.index({ groupType: 1 });
brokerGroupSchema.index({ isActive: 1 });
brokerGroupSchema.index({ createdAt: -1 });
brokerGroupSchema.index({ 'name': 'text', 'description': 'text' });

// Middleware para validar gerente
brokerGroupSchema.pre('save', async function(next) {
  if (this.managerId) {
    const BrokerModel = mongoose.model('Broker');
    const manager = await BrokerModel.findById(this.managerId);
    
    if (!manager || !manager.isManager) {
      const error = new Error('O usuário selecionado não é um gerente válido');
      return next(error);
    }
    
    if (manager.realEstateId.toString() !== this.realEstateId.toString()) {
      const error = new Error('O gerente deve pertencer à mesma imobiliária');
      return next(error);
    }
  }
  next();
});

// Método para converter para BrokerGroupResponse
brokerGroupSchema.methods.toBrokerGroupResponse = function(): BrokerGroupResponse {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    realEstateId: this.realEstateId.toString(),
    managerId: this.managerId?.toString(),
    groupType: this.groupType,
    territory: this.territory,
    targetMarket: this.targetMarket,
    commissionStructure: this.commissionStructure,
    permissions: this.permissions,
    settings: this.settings,
    goals: this.goals,
    performance: this.performance,
    meetingSchedule: this.meetingSchedule,
    resources: this.resources,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Modelo do Mongoose
export const BrokerGroupModel = mongoose.model<IBrokerGroup>('BrokerGroup', brokerGroupSchema);

// Função utilitária para converter IBrokerGroup para BrokerGroup
export const toBrokerGroup = (brokerGroupDoc: IBrokerGroup): BrokerGroup => {
  return {
    id: brokerGroupDoc._id.toString(),
    name: brokerGroupDoc.name,
    description: brokerGroupDoc.description,
    realEstateId: brokerGroupDoc.realEstateId.toString(),
    managerId: brokerGroupDoc.managerId?.toString(),
    groupType: brokerGroupDoc.groupType,
    territory: brokerGroupDoc.territory,
    targetMarket: brokerGroupDoc.targetMarket,
    commissionStructure: brokerGroupDoc.commissionStructure,
    permissions: brokerGroupDoc.permissions,
    settings: brokerGroupDoc.settings,
    goals: brokerGroupDoc.goals,
    performance: brokerGroupDoc.performance,
    meetingSchedule: brokerGroupDoc.meetingSchedule,
    resources: brokerGroupDoc.resources,
    isActive: brokerGroupDoc.isActive,
    createdAt: brokerGroupDoc.createdAt,
    updatedAt: brokerGroupDoc.updatedAt,
  };
};