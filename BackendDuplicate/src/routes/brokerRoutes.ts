import { Router } from 'express';
import { z } from 'zod';
import BrokerController from '../controllers/brokerController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  idSchema,
} from '../utils/validation';

const router = Router();

// Schema de validação para query de listagem
const listBrokersQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'hireDate', 'licenseNumber']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'terminated']).optional(),
  is_manager: z.enum(['true', 'false']).optional(),
  search: z.string().optional()
});

// Schema de validação para busca de corretores
const searchBrokersQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  search: z.string().optional(),
  specialization: z.string().optional(),
  territory: z.string().optional(),
  is_manager: z.enum(['true', 'false']).optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'terminated']).optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'hireDate', 'licenseNumber']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

// Temporariamente removendo autenticação para testes
// router.use(authenticate);

// Rota para listar corretores de uma imobiliária
// GET /api/corretor/list?real_estate_id=123
router.get(
  '/list',
  validateQuery(listBrokersQuerySchema),
  BrokerController.getBrokersByRealEstate
);

// Rota para buscar corretores com filtros
// GET /api/corretor/search?real_estate_id=123&specialization=residential
router.get(
  '/search',
  validateQuery(searchBrokersQuerySchema),
  BrokerController.searchBrokers
);

// Rota para buscar corretor por ID
// GET /api/corretor/:id
router.get(
  '/:id',
  validateParams(idSchema),
  BrokerController.getBrokerById
);

// Rota para criar novo corretor
// POST /api/corretor
router.post(
  '/',
  BrokerController.createBroker
);

// Rota para atualizar corretor
// PUT /api/corretor/:id
router.put(
  '/:id',
  validateParams(idSchema),
  BrokerController.updateBroker
);

// Rota para deletar corretor (soft delete)
// DELETE /api/corretor/:id
router.delete(
  '/:id',
  validateParams(idSchema),
  BrokerController.deleteBroker
);

export default router;