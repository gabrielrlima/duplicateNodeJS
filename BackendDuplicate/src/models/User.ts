import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento User no MongoDB
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  businessId?: string;
  realEstateId?: mongoose.Types.ObjectId; // Relacionamento com RealEstate
  photoURL?: string | null;
  // Novos campos para perfil completo
  cpf?: string;
  rg?: string;
  dateOfBirth?: Date;
  gender?: 'M' | 'F' | 'Other';
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profession?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other';
  nationality?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toUserResponse(): UserResponse;
}

// Interface para compatibilidade com código existente
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  businessId?: string;
  realEstateId?: string; // Relacionamento com RealEstate
  photoURL?: string | null;
  // Novos campos para perfil completo
  cpf?: string;
  rg?: string;
  dateOfBirth?: Date;
  gender?: 'M' | 'F' | 'Other';
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profession?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other';
  nationality?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone?: string;
  businessId?: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessId?: string;
  realEstateId?: string; // Relacionamento com RealEstate
  photoURL?: string | null;
  // Novos campos para perfil completo
  cpf?: string;
  rg?: string;
  dateOfBirth?: Date;
  gender?: 'M' | 'F' | 'Other';
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profession?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other';
  nationality?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
}

export interface CheckEmailResponse {
  is_available: boolean;
  message: string;
}

// Schema do Mongoose
const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [50, 'Nome deve ter no máximo 50 caracteres'],
  },
  lastName: {
    type: String,
    required: [true, 'Sobrenome é obrigatório'],
    trim: true,
    minlength: [2, 'Sobrenome deve ter pelo menos 2 caracteres'],
    maxlength: [50, 'Sobrenome deve ter no máximo 50 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido'],
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Telefone inválido'],
  },
  businessId: {
    type: String,
    trim: true,
  },
  realEstateId: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstate',
  },
  photoURL: {
    type: String,
    default: null,
  },
  // Novos campos para perfil completo
  cpf: {
    type: String,
    trim: true,
    match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF inválido'],
  },
  rg: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['M', 'F', 'Other'],
  },
  address: {
    street: { type: String, trim: true },
    number: { type: String, trim: true },
    complement: { type: String, trim: true },
    neighborhood: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Brasil' },
  },
  profession: {
    type: String,
    trim: true,
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'],
  },
  nationality: {
    type: String,
    trim: true,
    default: 'Brasileira',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: {
    type: Date,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  toJSON: {
    transform: function(doc, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password; // Remove senha do JSON por segurança
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ businessId: 1 });
userSchema.index({ createdAt: -1 });

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  // Só faz hash se a senha foi modificada
  if (!this.isModified('password')) return next();
  
  try {
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para converter para UserResponse
userSchema.methods.toUserResponse = function(): UserResponse {
  return {
    id: this._id.toString(),
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    businessId: this.businessId,
    realEstateId: this.realEstateId?.toString(),
    photoURL: this.photoURL,
    cpf: this.cpf,
    rg: this.rg,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    address: this.address,
    profession: this.profession,
    maritalStatus: this.maritalStatus,
    nationality: this.nationality,
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    emailVerified: this.emailVerified,
    phoneVerified: this.phoneVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Modelo do Mongoose
export const UserModel = mongoose.model<IUser>('User', userSchema);

// Função utilitária para converter IUser para User
export const toUser = (userDoc: IUser): User => {
  return {
    id: userDoc._id.toString(),
    firstName: userDoc.firstName,
    lastName: userDoc.lastName,
    email: userDoc.email,
    password: userDoc.password,
    phone: userDoc.phone,
    businessId: userDoc.businessId,
    realEstateId: userDoc.realEstateId?.toString(),
    photoURL: userDoc.photoURL,
    cpf: userDoc.cpf,
    rg: userDoc.rg,
    dateOfBirth: userDoc.dateOfBirth,
    gender: userDoc.gender,
    address: userDoc.address,
    profession: userDoc.profession,
    maritalStatus: userDoc.maritalStatus,
    nationality: userDoc.nationality,
    isActive: userDoc.isActive,
    lastLoginAt: userDoc.lastLoginAt,
    emailVerified: userDoc.emailVerified,
    phoneVerified: userDoc.phoneVerified,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
};