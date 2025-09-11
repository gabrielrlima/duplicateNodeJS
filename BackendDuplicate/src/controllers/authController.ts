import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { authService } from '../services/authService';
import { registerSchema, loginSchema, checkEmailSchema } from '../validation/authValidation';
import logger from '../config/logger';
import { ApiResponse } from '../types';

export class AuthController {
  /**
   * POST /api/auth/register
   * Registra um novo usuário
   */
  async register(req: Request, res: Response): Promise<Response> {
    try {
      // Validar dados de entrada
      const validatedData = registerSchema.parse(req.body);

      // Registrar usuário
      const result = await authService.register(validatedData);

      const response: ApiResponse = {
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      };

      logger.info(`Registro bem-sucedido para: ${validatedData.email}`);
      return res.status(201).json(response);

    } catch (error) {
      logger.error('Erro no registro:', error);

      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: 'Dados de entrada inválidos',
          errors: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        };
        return res.status(400).json(response);
      }

      if (error instanceof Error) {
        const response: ApiResponse = {
          success: false,
          message: error.message
        };
        
        // Se é erro de email já cadastrado, retornar 422
        if (error.message.includes('já está cadastrado')) {
          return res.status(422).json(response);
        }
        
        return res.status(400).json(response);
      }

      const response: ApiResponse = {
        success: false,
        message: 'Erro interno do servidor'
      };
      return res.status(500).json(response);
    }
  }

  /**
   * POST /api/auth/login
   * Autentica um usuário
   */
  async login(req: Request, res: Response): Promise<Response> {
    try {
      // Validar dados de entrada
      const validatedData = loginSchema.parse(req.body);

      // Fazer login
      const result = await authService.login(validatedData);

      const response: ApiResponse = {
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      };

      logger.info(`Login bem-sucedido para: ${validatedData.email}`);
      return res.status(200).json(response);

    } catch (error) {
      logger.error('Erro no login:', error);

      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: 'Dados de entrada inválidos',
          errors: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        };
        return res.status(400).json(response);
      }

      if (error instanceof Error) {
        const response: ApiResponse = {
          success: false,
          message: error.message
        };
        
        // Se são credenciais inválidas, retornar 401
        if (error.message.includes('Credenciais inválidas')) {
          return res.status(401).json(response);
        }
        
        return res.status(400).json(response);
      }

      const response: ApiResponse = {
        success: false,
        message: 'Erro interno do servidor'
      };
      return res.status(500).json(response);
    }
  }

  /**
   * POST /api/auth/check-email
   * Verifica se um email está disponível
   */
  async checkEmail(req: Request, res: Response): Promise<Response> {
    try {
      // Validar dados de entrada
      const validatedData = checkEmailSchema.parse(req.body);

      // Verificar disponibilidade do email
      const result = await authService.checkEmailAvailability(validatedData.email);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result
      };

      logger.info(`Verificação de email para: ${validatedData.email} - Disponível: ${result.is_available}`);
      return res.status(200).json(response);

    } catch (error) {
      logger.error('Erro na verificação de email:', error);

      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: 'Dados de entrada inválidos',
          errors: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        };
        return res.status(400).json(response);
      }

      const response: ApiResponse = {
        success: false,
        message: 'Erro interno do servidor'
      };
      return res.status(500).json(response);
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Renova o token de acesso
   */
  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const response: ApiResponse = {
          success: false,
          message: 'Refresh token é obrigatório'
        };
        return res.status(400).json(response);
      }

      const result = await authService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        message: 'Token renovado com sucesso',
        data: result
      };

      return res.status(200).json(response);

    } catch (error) {
      logger.error('Erro ao renovar token:', error);

      const response: ApiResponse = {
        success: false,
        message: 'Refresh token inválido'
      };
      return res.status(401).json(response);
    }
  }

  /**
   * GET /api/auth/me
   * Retorna informações do usuário autenticado
   */
  async getMe(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Usuário não autenticado'
        };
        return res.status(401).json(response);
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'Usuário não encontrado'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Usuário encontrado',
        data: user
      };

      return res.status(200).json(response);

    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);

      const response: ApiResponse = {
        success: false,
        message: 'Erro interno do servidor'
      };
      return res.status(500).json(response);
    }
  }
}

export const authController = new AuthController();