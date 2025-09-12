import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info('=== DEBUG REQUEST ===', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('=== DEBUG RESPONSE ===', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};

export const debugAuthRoutes = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.includes('/auth/')) {
    logger.info('=== AUTH ROUTE DEBUG ===', {
      method: req.method,
      url: req.url,
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }
  next();
};
