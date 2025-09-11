import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

import { successResponse } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../config/logger';

export class UserController {
  // Listar todos os usuários (apenas admins)
  static getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      name,
      email,
      role,
      sortBy,
      sortOrder = 'desc',
    } = req.query;
    
    const filters = {
      page: Number(page),
      limit: Number(limit),
      name: name as string,
      email: email as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };
    
    const result = await UserService.getAllUsers(filters);
    
    logger.info('Users list retrieved', {
      requestedBy: req.user?.id,
      filters,
      resultCount: result.data.length,
    });
    
    res.status(200).json(
      successResponse('Usuários obtidos com sucesso', result)
    );
  });
  
  // Obter usuário por ID
  static getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const user = await UserService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
        error: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
    }
    
    logger.info('User retrieved by ID', {
      requestedBy: req.user?.id,
      targetUserId: id,
    });
    
    return res.status(200).json(
      successResponse('Usuário obtido com sucesso', { user })
    );
  });
  
  // Obter perfil do usuário autenticado
  static getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
        error: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
      });
    }
    
    const user = await UserService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
        error: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
    }
    
    logger.info('User profile retrieved', {
      userId: user.id,
      email: user.email,
    });
    
    return res.status(200).json(
      successResponse('Perfil obtido com sucesso', { user })
    );
  });
  
  // Listar usuários simples
  static getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getUsers();
    
    logger.info('Users retrieved', {
      requestedBy: req.user?.id,
      count: users.length,
    });
    
    res.status(200).json(
      successResponse('Usuários obtidos com sucesso', { users })
    );
  });

  // Limpar todos os usuários cadastrados
  static clearAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.clearAllUsers();
    
    logger.info('All users cleared', {
      requestedBy: req.user?.id,
      removedCount: result.count,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json(
      successResponse('Usuários removidos com sucesso', {
        removedCount: result.count,
        message: result.message
      })
    );
   });

  // Método de teste para limpar usuários sem autenticação
  static testClearAllUsers = async (req: Request, res: Response) => {
    try {
      const result = await UserService.clearAllUsers();
      
      logger.info('Test: All users cleared', {
        removedCount: result.count,
        timestamp: new Date().toISOString()
      });
      
      res.status(200).json({
        success: true,
        message: 'Usuários removidos com sucesso',
        data: {
          removedCount: result.count,
          message: result.message
        }
      });
    } catch (error) {
      logger.error('Test: Error clearing users:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao limpar usuários',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  // Método de teste para listar usuários sem autenticação
  static testGetUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserService.getUsers();
      
      logger.info('Test: Users retrieved', {
        count: users.length,
      });
      
      res.status(200).json({
        success: true,
        message: 'Usuários obtidos com sucesso',
        data: { users }
      });
    } catch (error) {
      logger.error('Test: Error getting users:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao obter usuários',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  // Atualizar perfil do usuário
  static updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    // Debug completo da requisição
    logger.info('UpdateProfile - Debug completo:', {
      contentType: req.get('Content-Type'),
      method: req.method,
      url: req.url,
      bodyType: typeof req.body,
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body).join(', ') : 'no keys',
      hasFile: !!(req as any).file,
      fileInfo: (req as any).file ? {
        fieldname: (req as any).file.fieldname,
        originalname: (req as any).file.originalname,
        mimetype: (req as any).file.mimetype,
        size: (req as any).file.size
      } : 'no file'
    });

    // Verificar se há dados para atualizar
    let firstName: string | undefined;
    let lastName: string | undefined;
    let photoURL: string | undefined;
    
    // Processar dados baseado no tipo de conteúdo
    const contentType = req.get('Content-Type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // FormData: dados vêm do req.body e arquivo do req.file
      firstName = req.body?.firstName || req.body?.displayName; // Aceitar ambos os nomes
      lastName = req.body?.lastName;
      
      // Se há arquivo, converter para base64 ou URL
      if ((req as any).file) {
        const file = (req as any).file as Express.Multer.File;
        photoURL = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        logger.info('Arquivo processado:', {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype
        });
      }
    } else {
      // JSON: dados vêm do req.body
      if (req.body && typeof req.body === 'object') {
        firstName = req.body.firstName || req.body.displayName; // Aceitar ambos os nomes
        lastName = req.body.lastName;
        photoURL = req.body.photoURL;
      }
    }
    
    logger.info('Dados finais extraídos:', { firstName, lastName, photoURL: photoURL ? 'presente' : 'ausente' });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
        error: 'NOT_AUTHENTICATED',
        timestamp: new Date().toISOString(),
      });
    }

    // Validar dados de entrada
    if (!firstName || firstName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nome é obrigatório',
        error: 'INVALID_INPUT',
        timestamp: new Date().toISOString(),
      });
    }

    if (!lastName || lastName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sobrenome é obrigatório',
        error: 'INVALID_INPUT',
        timestamp: new Date().toISOString(),
      });
    }

    // Buscar dados atuais do usuário para preservar photoURL se não fornecido
    const currentUser = await UserService.getUserById(userId);
    
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // Preservar photoURL existente se não foi fornecido novo
      photoURL: photoURL !== undefined ? photoURL : currentUser?.photoURL
    };

    const updatedUser = await UserService.updateProfile(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
        error: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
    }

    logger.info('User profile updated', {
      userId,
      updatedFields: Object.keys(updateData),
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: updatedUser
    });
  });
}

export const userController = new UserController();