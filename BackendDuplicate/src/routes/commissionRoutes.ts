import { Router } from 'express';
import { z } from 'zod';
import CommissionController from '../controllers/commissionController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  idSchema,
} from '../utils/validation';

const router = Router();

// Schema de validação para query de listagem
const listCommissionsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'nome', 'percentualTotal']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  tipo: z.enum(['total_imobiliaria', 'distribuicao_interna']).optional(),
  tipo_produto: z.enum(['imovel', 'terreno', 'empreendimento']).optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  search: z.string().optional()
});

// Schema de validação para busca de comissões
const searchCommissionsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  search: z.string().optional(),
  tipo: z.enum(['total_imobiliaria', 'distribuicao_interna']).optional(),
  tipo_produto: z.enum(['imovel', 'terreno', 'empreendimento']).optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  empreendimento_id: z.string().optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'nome', 'percentualTotal']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

// Schema de validação para query de comissões totais
const comissoesTotaisQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório')
});

// Temporariamente removendo autenticação para testes
// router.use(authenticate);

// Rota para listar comissões de uma imobiliária
// GET /api/comissao/list?real_estate_id=123
router.get(
  '/list',
  validateQuery(listCommissionsQuerySchema),
  CommissionController.listCommissions
);

// Rota para buscar comissões com filtros
// GET /api/comissao/search?real_estate_id=123&search=vendas
router.get(
  '/search',
  validateQuery(searchCommissionsQuerySchema),
  CommissionController.searchCommissions
);

// Rota para obter comissões totais (para dropdown)
// GET /api/comissao/totais?real_estate_id=123
router.get(
  '/totais',
  validateQuery(comissoesTotaisQuerySchema),
  CommissionController.getComissoesTotais
);

// Rota para buscar comissão por ID
// GET /api/comissao/:id
router.get(
  '/:id',
  validateParams(idSchema),
  CommissionController.getCommissionById
);

// Rota para criar nova comissão
// POST /api/comissao
router.post(
  '/',
  CommissionController.createCommission
);

// Rota para atualizar comissão
// PUT /api/comissao/:id
router.put(
  '/:id',
  validateParams(idSchema),
  CommissionController.updateCommission
);

// Rota para deletar comissão (soft delete)
// DELETE /api/comissao/:id
router.delete(
  '/:id',
  validateParams(idSchema),
  CommissionController.deleteCommission
);

export default router;