import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, asyncHandler } from './errorHandler';
import { AuthTokens } from '../types';
import { User } from '../models/User';
import config from '../config/env';
import logger from '../config/logger';

// Interface local para JWT payload
interface JwtPayload {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}

// Middleware para verificar token JWT
export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Verificar se o token existe
  let token: string | undefined;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new AppError('Você não está logado! Faça login para acessar.', 401, 'NO_TOKEN'));
  }
  
  try {
    // 2) Verificar o token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    // 3) Verificar se o usuário ainda existe (aqui você faria uma consulta ao banco)
    // Por enquanto, vamos simular um usuário baseado no payload
    const currentUser: User = {
      id: decoded.id,
      firstName: decoded.firstName || 'User',
      lastName: decoded.lastName || 'Name',
      email: decoded.email,
      password: '', // Não expor senha
      phone: undefined,
      businessId: undefined,
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // 4) Adicionar o usuário ao request
    req.user = currentUser;
    
    logger.info('User authenticated', {
      userId: currentUser.id,
      email: currentUser.email,
    });
    
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401, 'INVALID_TOKEN'));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401, 'TOKEN_EXPIRED'));
    }
    
    return next(new AppError('Erro na autenticação', 401, 'AUTH_ERROR'));
  }
});

// Middleware para verificar permissões (simplificado)
export const authorize = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuário não autenticado', 401, 'NOT_AUTHENTICATED'));
    }
    
    // Por enquanto, todos os usuários autenticados têm acesso
    // Implementar lógica de roles conforme necessário
    
    next();
  };
};

// Middleware opcional de autenticação (não falha se não houver token)
export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      
      const currentUser: User = {
        id: decoded.id,
        firstName: decoded.firstName || 'User',
        lastName: decoded.lastName || 'Name',
        email: decoded.email,
        password: '', // Não expor senha
        phone: undefined,
        businessId: undefined,
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      req.user = currentUser;
    } catch (error) {
      // Ignora erros de token em autenticação opcional
      logger.debug('Optional auth failed', { error: (error as Error).message });
    }
  }
  
  next();
});

// Função utilitária para gerar tokens
export const generateTokens = (payload: Omit<JwtPayload, 'iat' | 'exp'>): AuthTokens => {
  // @ts-ignore
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  
  // @ts-ignore
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
  
  return { accessToken, refreshToken };
};

// Função para verificar refresh token
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};