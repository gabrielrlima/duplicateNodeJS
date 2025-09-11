import { Router } from 'express';
import { z } from 'zod';
import BrokerGroupController from '../controllers/brokerGroupController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  idSchema,
} from '../utils/validation';

const router = Router();

// Schema de validação para query de listagem
const listBrokerGroupsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  group_type: z.enum(['sales', 'rental', 'commercial', 'luxury', 'investment', 'mixed']).optional(),
  is_active: z.enum(['true', 'false']).optional(),
  search: z.string().optional()
});

// Schema de validação para busca de grupos
const searchBrokerGroupsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  search: z.string().optional(),
  group_type: z.enum(['sales', 'rental', 'commercial', 'luxury', 'investment', 'mixed']).optional(),
  territory: z.string().optional(),
  is_active: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

// Temporariamente removendo autenticação para testes
// router.use(authenticate);

// Rota para listar grupos de uma imobiliária
// GET /api/grupo/list?real_estate_id=123
router.get(
  '/list',
  validateQuery(listBrokerGroupsQuerySchema),
  BrokerGroupController.getBrokerGroupsByRealEstate
);

// Rota para buscar grupos com filtros
// GET /api/grupo/search?real_estate_id=123&group_type=sales
router.get(
  '/search',
  validateQuery(searchBrokerGroupsQuerySchema),
  BrokerGroupController.searchBrokerGroups
);

// Rota para buscar grupo por ID
// GET /api/grupo/:id
router.get(
  '/:id',
  validateParams(idSchema),
  BrokerGroupController.getBrokerGroupById
);

// Rota para criar novo grupo
// POST /api/grupo
router.post(
  '/',
  BrokerGroupController.createBrokerGroup
);

// Rota para atualizar grupo
// PUT /api/grupo/:id
router.put(
  '/:id',
  validateParams(idSchema),
  BrokerGroupController.updateBrokerGroup
);

// Rota para deletar grupo (soft delete)
// DELETE /api/grupo/:id
router.delete(
  '/:id',
  validateParams(idSchema),
  BrokerGroupController.deleteBrokerGroup
);

export default router;