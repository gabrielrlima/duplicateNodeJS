import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser, User, CreateUserData, UserResponse, AuthResponse, CheckEmailResponse, toUser } from '../models/User';
import { RegisterInput, LoginInput } from '../validation/authValidation';
import config from '../config/env';
import logger from '../config/logger';

// Função para inicializar usuário de teste
const initializeTestUser = async () => {
  try {
    const existingUser = await UserModel.findOne({ email: 'gabriel@teste.com' });
    
    if (!existingUser) {
      const testUser = new UserModel({
        firstName: 'Gabriel',
        lastName: 'Lima',
        email: 'gabriel@teste.com',
        password: '123456', // Será hasheada automaticamente pelo middleware
      });
      
      await testUser.save();
      logger.info('Usuário de teste criado: gabriel@teste.com / 123456');
    }
  } catch (error) {
    logger.error('Erro ao inicializar usuário de teste:', error);
  }
};

// Inicializar usuário de teste (será chamado quando a conexão estiver pronta)
export { initializeTestUser };

export class AuthService {
  /**
   * Verifica se um email já está em uso
   */
  async checkEmailAvailability(email: string): Promise<CheckEmailResponse> {
    try {
      const existingUser = await UserModel.findOne({ 
        email: email.toLowerCase() 
      });
      
      if (existingUser) {
        return {
          is_available: false,
          message: 'Este e-mail já está cadastrado'
        };
      }

      return {
        is_available: true,
        message: 'E-mail disponível'
      };
    } catch (error) {
      logger.error('Erro ao verificar disponibilidade do email:', error);
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Registra um novo usuário
   */
  async register(userData: RegisterInput): Promise<AuthResponse> {
    try {
      // Verificar se o email já existe
      const existingUser = await UserModel.findOne({ 
        email: userData.email.toLowerCase() 
      });
      
      if (existingUser) {
        throw new Error('Este e-mail já está cadastrado');
      }

      // Criar novo usuário
      const newUser = new UserModel({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: userData.password, // Será hasheada pelo middleware
        phone: userData.phone,
        businessId: userData.businessId,
      });

      const savedUser = await newUser.save();
      
      // Gerar tokens
      const { token, refreshToken } = this.generateTokens(toUser(savedUser));
      
      logger.info('Usuário registrado com sucesso:', {
        id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName
      });

      return {
        user: savedUser.toUserResponse(),
        token,
        refreshToken
      };
    } catch (error: any) {
      logger.error('Erro durante o registro:', error);
      
      if (error.code === 11000) {
        throw new Error('Este e-mail já está cadastrado');
      }
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        throw new Error(messages.join(', '));
      }
      
      throw error;
    }
  }

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginInput): Promise<AuthResponse> {
    try {
      logger.info('Iniciando processo de login para:', { email: credentials.email });
      
      // Buscar usuário pelo email
      logger.info('Buscando usuário no banco de dados...');
      const user = await UserModel.findOne({ 
        email: credentials.email.toLowerCase() 
      });
      
      logger.info('Usuário encontrado:', { user: user ? user.email : 'não encontrado' });
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha
      logger.info('Verificando senha...');
      const isPasswordValid = await user.comparePassword(credentials.password);
      logger.info('Senha válida:', { isValid: isPasswordValid });
      
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      // Gerar tokens
      logger.info('Gerando tokens...');
      const { token, refreshToken } = this.generateTokens(toUser(user));
      
      logger.info('Login realizado com sucesso:', {
        id: user._id,
        email: user.email
      });

      return {
        user: user.toUserResponse(),
        token,
        refreshToken
      };
    } catch (error) {
      logger.error('Erro durante o login:', error);
      throw error;
    }
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(id: string): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findById(id);
      
      if (!user) {
        return null;
      }

      return user.toUserResponse();
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID:', error);
      return null;
    }
  }

  /**
   * Gera tokens JWT
   */
  private generateTokens(user: User): { token: string; refreshToken: string } {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const token = jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    ) as string;

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
    ) as string;

    return { token, refreshToken };
  }

  /**
   * Retorna todos os usuários (para desenvolvimento)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find({}).select('-password');
      return users.map(user => toUser(user));
    } catch (error) {
      logger.error('Erro ao buscar todos os usuários:', error);
      return [];
    }
  }

  /**
   * Remove todos os usuários (para desenvolvimento)
   */
  async clearAllAuthUsers(): Promise<number> {
    try {
      const result = await UserModel.deleteMany({});
      logger.info(`${result.deletedCount} usuários removidos`);
      return result.deletedCount || 0;
    } catch (error) {
      logger.error('Erro ao limpar usuários:', error);
      return 0;
    }
  }

  /**
   * Verifica token JWT
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      logger.error('Erro ao verificar token:', error);
      throw new Error('Token inválido');
    }
  }

  /**
   * Atualiza token usando refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      const user = await UserModel.findById(decoded.id);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const { token } = this.generateTokens(toUser(user));
      
      return { token };
    } catch (error) {
      logger.error('Erro ao atualizar token:', error);
      throw new Error('Refresh token inválido');
    }
  }
}

export const authService = new AuthService();