import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/security';

const router = Router();

// Aplicar rate limiting para todas as rotas de auth
router.use(rateLimitMiddleware);

// Rotas públicas
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/check-email', authController.checkEmail.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Rotas protegidas (requerem autenticação)
router.get('/me', authenticate, authController.getMe.bind(authController));

export { router as authRoutes };