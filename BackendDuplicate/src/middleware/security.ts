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

// Rate limiting
export const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.',
    error: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
    });
    
    res.status(429).json({
      success: false,
      message: 'Muitas requisições. Tente novamente mais tarde.',
      error: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString(),
    });
  },
});

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

// Middleware para sanitização de dados
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove propriedades potencialmente perigosas
  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = { ...obj };
    delete sanitized.__proto__;
    delete sanitized.constructor;
    delete sanitized.prototype;
    
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitize(sanitized[key]);
      }
    }
    
    return sanitized;
  };
  
  if (req.body) req.body = sanitize(req.body);
  // Não modificar req.query e req.params diretamente pois são readonly
  // Em vez disso, criar novos objetos se necessário
  
  next();
};