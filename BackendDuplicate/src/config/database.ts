import mongoose from 'mongoose';
import config from './env';
import logger from './logger';

// Opções de configuração do Mongoose
const mongooseOptions = {
  // Configurações de conexão
  maxPoolSize: 10, // Máximo de conexões no pool
  serverSelectionTimeoutMS: 5000, // Timeout para seleção do servidor
  socketTimeoutMS: 45000, // Timeout do socket
};

// Classe para gerenciar a conexão com o banco de dados
class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('📊 Banco de dados já está conectado');
      return;
    }

    try {
      logger.info('🔄 Conectando ao MongoDB...', {
        url: config.databaseUrl.replace(/\/\/.*@/, '//***:***@'), // Oculta credenciais no log
      });

      await mongoose.connect(config.databaseUrl, mongooseOptions);
      
      this.isConnected = true;
      
      logger.info('✅ MongoDB conectado com sucesso', {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
      });

      // Event listeners para monitoramento da conexão
      this.setupEventListeners();

    } catch (error) {
      logger.error('❌ Erro ao conectar com MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('🔌 Desconectado do MongoDB');
    } catch (error) {
      logger.error('❌ Erro ao desconectar do MongoDB:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnection(): typeof mongoose.connection {
    return mongoose.connection;
  }

  private setupEventListeners(): void {
    // Conexão estabelecida
    mongoose.connection.on('connected', () => {
      logger.info('🔗 Mongoose conectado ao MongoDB');
    });

    // Erro de conexão
    mongoose.connection.on('error', (error) => {
      logger.error('❌ Erro de conexão MongoDB:', error);
    });

    // Conexão perdida
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ Mongoose desconectado do MongoDB');
      this.isConnected = false;
    });

    // Reconexão
    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 Mongoose reconectado ao MongoDB');
      this.isConnected = true;
    });

    // Processo sendo finalizado
    process.on('SIGINT', async () => {
      logger.info('🛑 Processo sendo finalizado, fechando conexão MongoDB...');
      await this.disconnect();
      process.exit(0);
    });
  }
}

// Exporta a instância singleton
export const database = Database.getInstance();
export default database;

// Função utilitária para conectar
export const connectDatabase = async (): Promise<void> => {
  await database.connect();
};

// Função utilitária para desconectar
export const disconnectDatabase = async (): Promise<void> => {
  await database.disconnect();
};