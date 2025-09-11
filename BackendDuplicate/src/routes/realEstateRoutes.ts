import { Router } from 'express';
import multer from 'multer';
import { RealEstateController } from '../controllers/realEstateController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  idSchema,
} from '../utils/validation';

const router = Router();

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'));
    }
  },
});

// Todas as rotas de imobiliárias requerem autenticação
router.use(authenticate);

// Buscar todas as imobiliárias do usuário logado
router.get(
  '/',
  RealEstateController.getUserRealEstates
);

// Criar nova imobiliária
router.post(
  '/',
  upload.single('logo'),
  RealEstateController.createRealEstate
);

// Buscar imobiliária por ID
router.get(
  '/:id',
  validateParams(idSchema),
  RealEstateController.getRealEstateById
);

// Atualizar imobiliária
router.put(
  '/:id',
  validateParams(idSchema),
  upload.single('logo'),
  RealEstateController.updateRealEstate
);

// Desativar imobiliária (soft delete)
router.delete(
  '/:id',
  validateParams(idSchema),
  RealEstateController.deleteRealEstate
);

export default router;