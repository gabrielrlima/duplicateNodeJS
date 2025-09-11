import { User, UserResponse, UserModel, IUser } from '../models/User';
import { PaginatedResponse } from '../types';
import { AppError } from '../middleware/errorHandler';
import { createPaginatedResponse, hashPassword } from '../utils/helpers';
import logger from '../config/logger';

export class UserService {
  // Listar todos os usuários com paginação e filtros
  static async getAllUsers(filters: {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<UserResponse>> {
    const {
      page = 1,
      limit = 10,
      name,
      email,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;
    
    // Construir query de filtro
    const query: any = {};
    
    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } }
      ];
    }
    
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    
    // Construir opções de ordenação
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    try {
      const total = await UserModel.countDocuments(query);
      const skip = (page - 1) * limit;
      
      const users = await UserModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-password')
        .lean();
      
      // Converter para UserResponse
      const userResponses: UserResponse[] = users.map(user => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        businessId: user.businessId,
        photoURL: user.photoURL,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      
      return createPaginatedResponse(userResponses, total, page, limit);
    } catch (error) {
      logger.error('Erro ao buscar usuários:', error);
      throw new AppError('Erro interno do servidor', 500);
    }
  }
  
  // Buscar usuário por ID
  static async getUserById(id: string): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findById(id).select('-password');
      
      if (!user) {
        return null;
      }
      
      return {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        businessId: user.businessId,
        photoURL: user.photoURL,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID:', error);
      throw new AppError('Erro interno do servidor', 500);
    }
  }
  
  // Listar usuários (método simplificado)
  static async getUsers(): Promise<UserResponse[]> {
    try {
      const users = await UserModel.find().select('-password').lean();
      
      return users.map(user => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        businessId: user.businessId,
        photoURL: user.photoURL,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      throw new AppError('Erro interno do servidor', 500);
    }
  }
  
  // Limpar todos os usuários (para testes)
  static async clearAllUsers(): Promise<{ count: number; message: string }> {
    try {
      const result = await UserModel.deleteMany({});
      
      logger.info(`${result.deletedCount} usuários removidos`);
      
      return {
        count: result.deletedCount,
        message: `${result.deletedCount} usuários removidos com sucesso`
      };
    } catch (error) {
      logger.error('Erro ao limpar usuários:', error);
      throw new AppError('Erro interno do servidor', 500);
    }
  }
  
  // Atualizar perfil do usuário
  static async updateProfile(
    userId: string, 
    updateData: { 
      firstName?: string;
      lastName?: string; 
      photoURL?: string | null;
      phone?: string;
    }
  ): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        throw new AppError('Usuário não encontrado', 404);
      }
      
      logger.info(`Perfil do usuário ${userId} atualizado com sucesso`);
      
      return user.toUserResponse();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error('Erro ao atualizar perfil:', error);
      throw new AppError('Erro interno do servidor', 500);
    }
  }
}

export const userService = new UserService();