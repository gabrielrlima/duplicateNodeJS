import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/security';

const router = Router();

// Rate limiting temporariamente desabilitado para debug
// router.use(rateLimitMiddleware);

// Rotas públicas
router.post('/register', authController.register.bind(authController));

// Rota de login com logs adicionais
router.post('/login', (req, res, next) => {
  console.log('=== ROTA LOGIN ACESSADA ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  next();
}, authController.login.bind(authController));
router.post('/check-email', authController.checkEmail.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Rotas protegidas (requerem autenticação)
router.get('/me', authenticate, authController.getMe.bind(authController));

export { router as authRoutes };