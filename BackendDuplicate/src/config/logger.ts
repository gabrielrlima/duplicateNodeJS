import winston from 'winston';
import config from './env';

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Formato para console em desenvolvimento
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Configuração dos transportes
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: config.nodeEnv === 'development' ? consoleFormat : logFormat,
  }),
];

// Adiciona file transport apenas em produção
if (config.nodeEnv === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: config.log.file,
      format: logFormat,
    })
  );
}

// Criação do logger
const logger = winston.createLogger({
  level: config.log.level,
  format: logFormat,
  transports,
  // Não sair do processo em caso de erro
  exitOnError: false,
});

// Stream para integração com Morgan
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;