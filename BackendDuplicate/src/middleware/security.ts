import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import config from '../config/env';
import logger from '../config/logger';

// Configuração do CORS
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Em desenvolvimento, permite qualquer origin
    if (config.nodeEnv === 'development') {
      return callback(null, true);
    }
    
    // Em produção, verifica origins permitidas
    const allowedOrigins = config.corsOrigin.split(',');
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// Configuração do Helmet para segurança
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiting - DESABILITADO TEMPORARIAMENTE PARA DEBUG
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Rate limit middleware bypassed for debug');
  next();
};

// Middleware para log de requisições
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  });
  
  next();
};

// Middleware para sanitização de dados - SIMPLIFICADO PARA DEBUG
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Sanitize input middleware - bypassed for debug');
  next();
};