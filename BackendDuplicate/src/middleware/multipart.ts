import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import logger from '../config/logger';

// Estender o tipo Request para incluir file
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'));
    }
  },
});

// Middleware para lidar com multipart/form-data
export const handleMultipartData = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.get('Content-Type') || '';
  
  logger.info('Multipart Middleware - Content-Type:', { contentType });
  
  if (contentType.includes('multipart/form-data')) {
    // Usar multer para processar FormData
    const multerMiddleware = upload.single('photoURL');
    
    return multerMiddleware(req, res, (err: any) => {
      if (err) {
        logger.error('Multer error:', err);
        return res.status(400).json({ error: 'Erro no upload da imagem' });
      }
      
      logger.info('Multipart processado:', {
        hasFile: !!req.file,
        fileName: req.file?.originalname,
        fileSize: req.file?.size,
        body: req.body
      });
      
      return next();
    });
  } else {
    // Para JSON, continuar normalmente
    return next();
  }
};