import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Middleware temporário para debug do req.body
export const debugBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Log para todas as requisições que passam por este middleware
  logger.info('DebugBody Middleware - Executando:', {
    method: req.method,
    url: req.url,
    path: req.path,
    contentType: req.headers['content-type'],
    body: req.body,
    bodyType: typeof req.body,
    bodyKeys: req.body ? Object.keys(req.body) : 'no body',
    hasBody: !!req.body,
    bodyStringified: JSON.stringify(req.body)
  });
  
  next();
};