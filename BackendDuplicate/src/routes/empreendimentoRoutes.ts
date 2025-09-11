import { Router } from 'express';
import multer from 'multer';
import { EmpreendimentoController } from '../controllers/EmpreendimentoController';
import { authenticate } from '../middleware/auth';
import {
  validateQuery,
  validateParams,
  idSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Configuração do multer para upload de imagens de empreendimentos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB para imagens de empreendimentos
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
const listEmpreendimentosQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório').regex(/^[0-9a-fA-F]{23,24}$/, 'ID da imobiliária deve ser um ObjectId válido'),
});

// Schema de validação para query parameters de busca
const searchEmpreendimentosQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  tipo: z.enum(['residencial', 'comercial', 'misto', 'industrial']).optional(),
  status: z.enum(['planejamento', 'construcao', 'pronto', 'entregue', 'cancelado']).optional(),
  min_price: z.string().regex(/^\d+$/, 'Preço mínimo deve ser um número').optional(),
  max_price: z.string().regex(/^\d+$/, 'Preço máximo deve ser um número').optional(),
  min_area: z.string().regex(/^\d+$/, 'Área mínima deve ser um número').optional(),
  max_area: z.string().regex(/^\d+$/, 'Área máxima deve ser um número').optional(),
  min_units: z.string().regex(/^\d+$/, 'Número mínimo de unidades deve ser um número').optional(),
  max_units: z.string().regex(/^\d+$/, 'Número máximo de unidades deve ser um número').optional(),
  min_floors: z.string().regex(/^\d+$/, 'Número mínimo de andares deve ser um número').optional(),
  max_floors: z.string().regex(/^\d+$/, 'Número máximo de andares deve ser um número').optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  neighborhood: z.string().optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'nome', 'totalUnidades', 'areaTotal']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

// Aplicar autenticação a todas as rotas
router.use(authenticate);

// Rota para listar empreendimentos por imobiliária
// GET /api/empreendimentos/list?real_estate_id=xxx
router.get(
  '/list',
  validateQuery(listEmpreendimentosQuerySchema),
  EmpreendimentoController.getEmpreendimentosByRealEstate
);

// Rota para buscar empreendimentos com filtros
// GET /api/empreendimentos/search?real_estate_id=xxx&tipo=residencial&status=construcao
router.get(
  '/search',
  validateQuery(searchEmpreendimentosQuerySchema),
  EmpreendimentoController.searchEmpreendimentos
);

// Rota para buscar empreendimento por ID
// GET /api/empreendimentos/:id
router.get(
  '/:id',
  validateParams(idSchema),
  EmpreendimentoController.getEmpreendimentoById
);

// Rota para criar novo empreendimento
// POST /api/empreendimentos
router.post(
  '/',
  upload.array('images', 30), // Permitir até 30 imagens para empreendimentos
  EmpreendimentoController.createEmpreendimento
);

// Rota para atualizar empreendimento
// PUT /api/empreendimentos/:id
router.put(
  '/:id',
  validateParams(idSchema),
  upload.array('images', 30), // Permitir até 30 imagens para empreendimentos
  EmpreendimentoController.updateEmpreendimento
);

// Rota para deletar empreendimento (soft delete)
// DELETE /api/empreendimentos/:id
router.delete(
  '/:id',
  validateParams(idSchema),
  EmpreendimentoController.deleteEmpreendimento
);

export default router;