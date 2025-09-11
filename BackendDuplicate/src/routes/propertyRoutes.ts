import { Router } from 'express';
import multer from 'multer';
import { PropertyController } from '../controllers/propertyController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  idSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Configuração do multer para upload de imagens de propriedades
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB para imagens de propriedades
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
const listPropertiesQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório').regex(/^[0-9a-fA-F]{23,24}$/, 'ID da imobiliária deve ser um ObjectId válido'),
});

// Schema de validação para query parameters de busca
const searchPropertiesQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  type: z.enum(['apartment', 'house', 'commercial', 'land', 'penthouse', 'studio', 'loft', 'farm', 'warehouse', 'office']).optional(),
  status: z.enum(['available', 'sold', 'rented', 'reserved', 'inactive']).optional(),
  min_price: z.string().regex(/^\d+$/, 'Preço mínimo deve ser um número').optional(),
  max_price: z.string().regex(/^\d+$/, 'Preço máximo deve ser um número').optional(),
  min_area: z.string().regex(/^\d+$/, 'Área mínima deve ser um número').optional(),
  max_area: z.string().regex(/^\d+$/, 'Área máxima deve ser um número').optional(),
  bedrooms: z.string().regex(/^\d+$/, 'Número de quartos deve ser um número').optional(),
  bathrooms: z.string().regex(/^\d+$/, 'Número de banheiros deve ser um número').optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  neighborhood: z.string().optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'value', 'area', 'name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

// Todas as rotas de propriedades requerem autenticação
router.use(authenticate);

// Obter estatísticas das propriedades de uma imobiliária
// GET /api/property/stats?real_estate_id=...
router.get(
  '/stats',
  validateQuery(listPropertiesQuerySchema),
  PropertyController.getPropertyStats
);

// Listar propriedades de uma imobiliária
// GET /api/property/list?real_estate_id=...
router.get(
  '/list',
  validateQuery(listPropertiesQuerySchema),
  PropertyController.getPropertiesByRealEstate
);

// Buscar propriedades com filtros
// GET /api/property/search?real_estate_id=...&type=...&status=...
router.get(
  '/search',
  validateQuery(searchPropertiesQuerySchema),
  PropertyController.searchProperties
);

// Buscar propriedade por ID
// GET /api/property/:id
router.get(
  '/:id',
  validateParams(idSchema),
  PropertyController.getPropertyById
);

// Criar nova propriedade
// POST /api/property
router.post(
  '/',
  upload.array('images', 20), // Permitir até 20 imagens
  PropertyController.createProperty
);

// Atualizar propriedade
// PUT /api/property/:id
router.put(
  '/:id',
  validateParams(idSchema),
  upload.array('images', 20), // Permitir até 20 imagens
  PropertyController.updateProperty
);

// Deletar propriedade (soft delete)
// DELETE /api/property/:id
router.delete(
  '/:id',
  validateParams(idSchema),
  PropertyController.deleteProperty
);

export default router;