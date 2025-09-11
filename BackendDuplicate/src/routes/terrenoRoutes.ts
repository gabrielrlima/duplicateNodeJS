import { Router } from 'express';
import multer from 'multer';
import { TerrenoController } from '../controllers/TerrenoController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  idSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Configuração do multer para upload de imagens de terrenos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB para imagens de terrenos
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

// Schema de validação para query parameters de listagem
const listTerrenosQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório').regex(/^[0-9a-fA-F]{23,24}$/, 'ID da imobiliária deve ser um ObjectId válido'),
});

// Schema de validação para query parameters de busca
const searchTerrenosQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  type: z.enum(['residential', 'commercial', 'industrial', 'rural', 'mixed']).optional(),
  status: z.enum(['available', 'sold', 'reserved', 'inactive']).optional(),
  min_price: z.string().regex(/^\d+$/, 'Preço mínimo deve ser um número').optional(),
  max_price: z.string().regex(/^\d+$/, 'Preço máximo deve ser um número').optional(),
  min_area: z.string().regex(/^\d+$/, 'Área mínima deve ser um número').optional(),
  max_area: z.string().regex(/^\d+$/, 'Área máxima deve ser um número').optional(),
  topography: z.enum(['flat', 'sloped', 'irregular']).optional(),
  soil_type: z.enum(['clay', 'sand', 'rock', 'mixed']).optional(),
  vegetation: z.enum(['none', 'grass', 'trees', 'forest']).optional(),
  zoning: z.enum(['residential', 'commercial', 'industrial', 'mixed']).optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  neighborhood: z.string().optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'value', 'totalArea', 'name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticate);

// Rota para listar terrenos de uma imobiliária
// GET /api/terreno/list?real_estate_id=123
router.get(
  '/list',
  validateQuery(listTerrenosQuerySchema),
  TerrenoController.getTerrenosByRealEstate
);

// Rota para buscar terrenos com filtros
// GET /api/terreno/search?real_estate_id=123&type=residential&min_price=100000
router.get(
  '/search',
  validateQuery(searchTerrenosQuerySchema),
  TerrenoController.searchTerrenos
);

// Rota para buscar terreno por ID
// GET /api/terreno/:id
router.get(
  '/:id',
  validateParams(idSchema),
  TerrenoController.getTerrenoById
);

// Rota para criar novo terreno
// POST /api/terreno
router.post(
  '/',
  upload.any(), // Aceitar qualquer campo
  TerrenoController.createTerreno
);

// Rota para atualizar terreno
// PUT /api/terreno/:id
router.put(
  '/:id',
  validateParams(idSchema),
  upload.any(), // Aceitar qualquer campo
  TerrenoController.updateTerreno
);

// Rota para deletar terreno (soft delete)
// DELETE /api/terreno/:id
router.delete(
  '/:id',
  validateParams(idSchema),
  TerrenoController.deleteTerreno
);

export default router;