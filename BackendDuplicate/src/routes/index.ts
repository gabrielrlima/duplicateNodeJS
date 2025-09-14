import { Router } from 'express';
import { authRoutes } from './authRoutes';
import userRoutes from './userRoutes';
import realEstateRoutes from './realEstateRoutes';
import productRoutes from './productRoutes';
import brokerRoutes from './brokerRoutes';
import brokerGroupRoutes from './brokerGroupRoutes';
import commissionRoutes from './commissionRoutes';
import { successResponse } from '../utils/helpers';
import { Request, Response } from 'express';
import config from '../config/env';

const router = Router();

// Rota de health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json(
    successResponse('API está funcionando', {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      version: '1.0.0',
      uptime: process.uptime(),
    })
  );
});

// Rota de informações da API
router.get('/info', (req: Request, res: Response) => {
  res.status(200).json(
    successResponse('Informações da API', {
      name: 'Backend Duplicate API',
      version: '1.0.0',
      description: 'Backend Node.js com TypeScript seguindo boas práticas de mercado',
      environment: config.nodeEnv,
      nodeVersion: process.version,
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        realEstate: '/api/real-estate',
        property: '/api/property',
        terreno: '/api/terreno',
        empreendimento: '/api/empreendimento',
        corretor: '/api/corretor',
        grupo: '/api/grupo',
        comissao: '/api/comissao',
        health: '/api/health',
        docs: '/api/docs (em desenvolvimento)',
      },
      features: [
        'Autenticação JWT',
        'Validação de dados com Zod',
        'Middleware de segurança',
        'Sistema de logs estruturado',
        'Rate limiting',
        'Tratamento de erros centralizado',
        'Paginação',
        'Filtros e busca',
        'Controle de permissões por roles',
      ],
    })
  );
});

// Rotas principais
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/real-estate', realEstateRoutes);
router.use('/products', productRoutes);

// Rotas de compatibilidade (redirecionam para /products)
router.use('/property', (req, res, next) => {
  req.url = req.url.replace('/property', '/products');
  req.query.type = 'imovel';
  productRoutes(req, res, next);
});

router.use('/terreno', (req, res, next) => {
  req.url = req.url.replace('/terreno', '/products');
  req.query.type = 'terreno';
  productRoutes(req, res, next);
});

router.use('/empreendimento', (req, res, next) => {
  req.url = req.url.replace('/empreendimento', '/products');
  req.query.type = 'empreendimento';
  productRoutes(req, res, next);
});
router.use('/corretor', brokerRoutes);
router.use('/grupo', brokerGroupRoutes);
router.use('/comissao', commissionRoutes);

// Rota para demonstrar diferentes tipos de resposta
router.get('/demo', (req: Request, res: Response) => {
  const { type = 'success' } = req.query;
  
  switch (type) {
    case 'error':
      res.status(400).json({
        success: false,
        message: 'Exemplo de erro',
        error: 'DEMO_ERROR',
        timestamp: new Date().toISOString(),
      });
      break;
      
    case 'unauthorized':
      res.status(401).json({
        success: false,
        message: 'Não autorizado',
        error: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
      });
      break;
      
    case 'forbidden':
      res.status(403).json({
        success: false,
        message: 'Acesso negado',
        error: 'FORBIDDEN',
        timestamp: new Date().toISOString(),
      });
      break;
      
    case 'notfound':
      res.status(404).json({
        success: false,
        message: 'Recurso não encontrado',
        error: 'NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
      break;
      
    case 'validation':
      res.status(422).json({
        success: false,
        message: 'Dados inválidos',
        error: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
        data: {
          details: [
            {
              field: 'email',
              message: 'Email é obrigatório',
            },
            {
              field: 'password',
              message: 'Senha deve ter pelo menos 6 caracteres',
            },
          ],
        },
      });
      break;
      
    case 'paginated':
      res.status(200).json(
        successResponse('Exemplo de resposta paginada', {
          data: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3,
            hasNext: true,
            hasPrev: false,
          },
        })
      );
      break;
      
    default:
      res.status(200).json(
        successResponse('Exemplo de resposta de sucesso', {
          message: 'Esta é uma resposta de demonstração',
          availableTypes: [
            'success (padrão)',
            'error',
            'unauthorized',
            'forbidden',
            'notfound',
            'validation',
            'paginated',
          ],
          usage: 'Adicione ?type=<tipo> na URL para ver diferentes tipos de resposta',
        })
      );
  }
});

export default router;