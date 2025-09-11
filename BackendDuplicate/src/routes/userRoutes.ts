import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { debugBodyMiddleware } from '../middleware/debugBody';
import { handleMultipartData } from '../middleware/multipart';

import {
  validateQuery,
  validateParams,
  paginationSchema,
  idSchema,
} from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Todas as rotas de usuários requerem autenticação
router.use(authenticate);

// Schema para busca de usuários
const userSearchSchema = paginationSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  q: z.string().optional(), // termo de busca geral
});

// Listar todos os usuários
router.get(
  '/',
  authorize(),
  validateQuery(userSearchSchema),
  UserController.getAllUsers
);

// Obter todos os usuários (método simplificado)
router.get(
  '/all',
  authorize(),
  UserController.getUsers
);

// Obter perfil do usuário autenticado
router.get(
  '/profile',
  UserController.getProfile
);

// Obter usuário por ID
router.get(
  '/:id',
  validateParams(idSchema),
  UserController.getUserById
);

// Limpar todos os usuários cadastrados (requer autenticação)
router.delete(
  '/clear-all',
  authorize(),
  UserController.clearAllUsers
);

// Atualizar perfil do usuário autenticado
router.put(
  '/profile',
  handleMultipartData,
  debugBodyMiddleware,
  UserController.updateProfile
);

// Atualizar perfil do usuário autenticado (método PATCH para compatibilidade)
router.patch(
  '/profile',
  handleMultipartData,
  debugBodyMiddleware,
  UserController.updateProfile
);

export default router;