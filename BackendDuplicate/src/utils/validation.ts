import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

// Schemas de validação comuns
export const emailSchema = z.string().email('Email inválido');
export const passwordSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');
export const nameSchema = z.string().min(2, 'Nome deve ter pelo menos 2 caracteres');

// Schema para paginação
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Schemas para autenticação
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

// Schema para atualização de usuário
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

// Schema para mudança de senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Confirmação de senha não confere',
  path: ['confirmPassword'],
});

// Middleware genérico para validação
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(error); // Será tratado pelo globalErrorHandler
      } else {
        next(new AppError('Erro de validação', 400, 'VALIDATION_ERROR'));
      }
    }
  };
};

// Middleware para validação de query parameters
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Validating query:', req.query);
      const validatedQuery = schema.parse(req.query);
      // Não modificar req.query diretamente, apenas validar
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Zod validation error:', error.issues);
        next(error);
      } else {
        console.log('Other validation error:', error);
        next(new AppError('Erro de validação de query', 400, 'QUERY_VALIDATION_ERROR'));
      }
    }
  };
};

// Middleware para validação de params
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = schema.parse(req.params);
      req.params = validatedParams as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(error);
      } else {
        next(new AppError('Erro de validação de parâmetros', 400, 'PARAMS_VALIDATION_ERROR'));
      }
    }
  };
};

// Schema para validação de ID
export const idSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
});

// Utilitário para criar schemas de paginação customizados
export const createPaginationSchema = (allowedSortFields: string[]) => {
  return paginationSchema.extend({
    sortBy: z.enum(allowedSortFields as [string, ...string[]]).optional(),
  });
};

// Utilitário para sanitizar dados de entrada
export const sanitizeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Schema para validação de strings com sanitização
export const sanitizedStringSchema = z.string().transform(sanitizeHtml);