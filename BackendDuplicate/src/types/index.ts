// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp?: string;
}

// Tipos de erro
export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

// Tipos de usuário (re-exportando do modelo)
export { User, UserResponse } from '../models/User';

// Tipos de autenticação
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}

// Tipos de requisição
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Tipos de paginação
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Extensão do Request do Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: import('../models/User').User;
    }
  }
}