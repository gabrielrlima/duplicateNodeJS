import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../config/logger';
import { ApiResponse, ApiError } from '../types';
import config from '../config/env';

// Classe customizada para erros da API
export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para tratar erros de validação do Zod
const handleZodError = (error: any): ApiError => {
  const errors = error.errors?.map((err: any) => ({
    field: err.path?.join('.') || 'unknown',
    message: err.message || 'Validation error',
  })) || [];

  return {
    message: 'Dados de entrada inválidos',
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    details: errors,
  };
};

// Middleware para tratar erros de JWT
const handleJWTError = (): ApiError => ({
  message: 'Token inválido',
  statusCode: 401,
  code: 'INVALID_TOKEN',
});

// Middleware para tratar erros de JWT expirado
const handleJWTExpiredError = (): ApiError => ({
  message: 'Token expirado',
  statusCode: 401,
  code: 'TOKEN_EXPIRED',
});

// Middleware para tratar erros de cast (MongoDB)
const handleCastError = (error: any): ApiError => ({
  message: `Recurso não encontrado. ID inválido: ${error.value}`,
  statusCode: 404,
  code: 'INVALID_ID',
});

// Middleware para tratar erros de duplicação (MongoDB)
const handleDuplicateFieldsError = (error: any): ApiError => {
  const field = Object.keys(error.keyValue)[0];
  return {
    message: `${field} já existe. Use outro valor.`,
    statusCode: 409,
    code: 'DUPLICATE_FIELD',
    details: { field, value: error.keyValue[field] },
  };
};

// Função para enviar erro em desenvolvimento
const sendErrorDev = (err: any, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: err.message,
    error: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    data: {
      stack: err.stack,
      details: err.details,
    },
  };

  res.status(err.statusCode || 500).json(response);
};

// Função para enviar erro em produção
const sendErrorProd = (err: any, res: Response) => {
  // Erros operacionais: enviar mensagem para o cliente
  if (err.isOperational) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      error: err.code || 'OPERATIONAL_ERROR',
      timestamp: new Date().toISOString(),
    };

    if (err.details) {
      response.data = { details: err.details };
    }

    res.status(err.statusCode).json(response);
  } else {
    // Erros de programação: não vazar detalhes para o cliente
    logger.error('ERROR:', err);

    const response: ApiResponse = {
      success: false,
      message: 'Algo deu errado!',
      error: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(response);
  }
};

// Middleware principal de tratamento de erros
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;

  // Log do erro
  logger.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  let error = { ...err };
  error.message = err.message;

  // Tratar diferentes tipos de erro
  if (err instanceof z.ZodError) {
    error = handleZodError(err);
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  } else if (err.name === 'CastError') {
    error = handleCastError(err);
  } else if (err.code === 11000) {
    error = handleDuplicateFieldsError(err);
  }

  if (config.nodeEnv === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Middleware para capturar rotas não encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Rota ${req.originalUrl} não encontrada`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};