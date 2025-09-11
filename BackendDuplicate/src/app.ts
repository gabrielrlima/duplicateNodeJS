import express from 'express';
import morgan from 'morgan';
import config from './config/env';
import logger, { morganStream } from './config/logger';
import {
  corsMiddleware,
  helmetMiddleware,
  rateLimitMiddleware,
  requestLogger,
  sanitizeInput,
} from './middleware/security';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middleware/errorHandler';
import routes from './routes';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeTestUser } from './services/authService';

// Criar aplicação Express
const app = express();

// Trust proxy (importante para deployment)
app.set('trust proxy', 1);

// Middlewares de segurança
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Rate limiting (aplicado globalmente)
if (config.nodeEnv === 'production') {
  app.use(rateLimitMiddleware);
}

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: morganStream }));
}

// Middleware customizado de logging
app.use(requestLogger);

// Middleware de sanitização
app.use(sanitizeInput);

// Middleware para adicionar headers de resposta padrão
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Powered-By', 'Node.js/Express');
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Duplicate API está funcionando!',
    data: {
      version: '1.0.0',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      endpoints: {
        api: '/api',
        health: '/api/health',
        auth: '/api/auth',
        users: '/api/users',
        docs: '/api/docs (em desenvolvimento)',
      },
      documentation: {
        postman: 'Collection disponível em breve',
        swagger: 'Documentação Swagger em desenvolvimento',
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use('/api', routes);

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware global de tratamento de erros
app.use(globalErrorHandler);

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await connectDatabase();
    
    // Inicializar usuário de teste
    await initializeTestUser();
    
    const server = app.listen(config.port, () => {
       logger.info(`🚀 Servidor iniciado`, {
         port: config.port,
         environment: config.nodeEnv,
         nodeVersion: process.version,
         timestamp: new Date().toISOString(),
       });
       
       logger.info('📋 Endpoints disponíveis:', {
         root: `http://localhost:${config.port}/`,
         api: `http://localhost:${config.port}/api`,
         health: `http://localhost:${config.port}/api/health`,
         auth: `http://localhost:${config.port}/api/auth`,
         users: `http://localhost:${config.port}/api/users`,
       });
     });

     return server;
   } catch (error) {
     logger.error('Erro ao iniciar servidor:', error);
     process.exit(1);
   }
};

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} recebido. Iniciando graceful shutdown...`);
  
  // Fechar conexões de banco de dados
  disconnectDatabase().then(() => {
    logger.info('Conexão com MongoDB fechada.');
  }).catch((error) => {
    logger.error('Erro ao fechar conexão com MongoDB:', error);
  });
  
  logger.info('Graceful shutdown concluído.');
  process.exit(0);
};

// Listeners para sinais de shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Listener para erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Iniciar servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

export { app, startServer };
export default app;