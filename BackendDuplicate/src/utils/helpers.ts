import bcrypt from 'bcryptjs';
import { ApiResponse, PaginatedResponse } from '../types';
import logger from '../config/logger';

// Utilitários para hash de senha
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Utilitário para criar resposta padronizada da API
export const createApiResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): ApiResponse<T> => {
  return {
    success,
    message,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
};

// Utilitário para criar resposta de sucesso
export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => {
  return createApiResponse(true, message, data);
};

// Utilitário para criar resposta de erro
export const errorResponse = (message: string, error?: string): ApiResponse => {
  return createApiResponse(false, message, undefined, error);
};

// Utilitário para paginação
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Utilitário para calcular offset de paginação
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

// Utilitário para gerar ID único simples
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Utilitário para delay (útil para testes)
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Utilitário para capitalizar primeira letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Utilitário para formatar nome
export const formatName = (name: string): string => {
  return name
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Utilitário para validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utilitário para remover propriedades sensíveis de objetos
export const excludeSensitiveFields = <T extends Record<string, any>>(
  obj: T,
  fieldsToExclude: (keyof T)[]
): Omit<T, keyof T> => {
  const result = { ...obj };
  fieldsToExclude.forEach(field => {
    delete result[field];
  });
  return result;
};

// Utilitário para converter string para slug
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Utilitário para validar CPF (exemplo brasileiro)
export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  
  return remainder === parseInt(cpf.charAt(10));
};

// Utilitário para formatar moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Utilitário para formatar data brasileira
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Utilitário para gerar senha aleatória
export const generateRandomPassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Utilitário para processar imagens de upload
export const processUploadedImages = (files: Express.Multer.File[]): string[] => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }

  return files.map((file: Express.Multer.File) => {
    const base64 = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64}`;
    
    return dataUrl;
  });
};

// Utilitário para converter tipos de FormData
const convertFormDataTypes = (data: any): any => {
  logger.info('🔍 [convertFormDataTypes] Dados originais recebidos:', JSON.stringify(data, null, 2));
  const converted = { ...data };
  
  // Converter campos numéricos
  const numericFields = [
    'totalArea', 'usableArea', 'frontage', 'depth', 'value', 'salePrice', 
    'pricePerSquareMeter', 'ituValue', 'itu_anual', 'latitude', 'longitude',
    'buildingCoefficient', 'occupancyRate', 'setbackFront', 'setbackSide', 
    'setbackRear', 'maxHeight'
  ];
  
  numericFields.forEach(field => {
    if (converted[field] !== undefined && converted[field] !== '' && converted[field] !== null) {
      const num = Number(converted[field]);
      if (!isNaN(num)) {
        converted[field] = num;
      }
    }
  });
  
  // Converter campos booleanos
  const booleanFields = [
    'hasDocumentation', 'acceptsFinancing', 'acceptsExchange', 'exclusiveProperty',
    'highlightProperty', 'preco_negociavel', 'waterAccess', 'electricityAccess',
    'sewerAccess', 'gasAccess', 'internetAccess'
  ];
  
  booleanFields.forEach(field => {
    if (converted[field] !== undefined && converted[field] !== null) {
      converted[field] = converted[field] === 'true' || converted[field] === true;
    }
  });
  
  // Processar objetos aninhados (owner, address, agent)
  if (converted.owner && typeof converted.owner === 'object') {
    logger.info('🔍 [convertFormDataTypes] Processando owner:', JSON.stringify(converted.owner, null, 2));
     
    // Validar email do proprietário
    if (converted.owner.email !== undefined) {
      const originalEmail = converted.owner.email;
      logger.info('🔍 [convertFormDataTypes] owner.email original:', {
        value: originalEmail,
        type: typeof originalEmail,
        length: originalEmail?.length || 0
      });
      
      const email = converted.owner.email.toString().trim();
      logger.info('🔍 [convertFormDataTypes] owner.email após trim():', {
        value: email,
        length: email.length,
        isEmpty: email === ''
      });
      
      const isValid = isValidEmail(email);
      logger.info('🔍 [convertFormDataTypes] Validação do email:', {
        email: email,
        isValid: isValid,
        shouldDelete: email === '' || !isValid
      });
      
      if (email === '' || !isValid) {
        logger.info('🔍 [convertFormDataTypes] Removendo owner.email (vazio ou inválido)');
        delete converted.owner.email;
      } else {
        logger.info('🔍 [convertFormDataTypes] Mantendo owner.email válido:', email);
        converted.owner.email = email;
      }
    } else {
      logger.info('🔍 [convertFormDataTypes] owner.email é undefined');
    }
    
    logger.info('🔍 [convertFormDataTypes] Owner após processamento:', JSON.stringify(converted.owner, null, 2));
  }
  
  // Processar email do agente também
  if (converted.agent && typeof converted.agent === 'object') {
    if (converted.agent.email !== undefined) {
      const email = converted.agent.email.toString().trim();
      if (email === '' || !isValidEmail(email)) {
        delete converted.agent.email;
      } else {
        converted.agent.email = email;
      }
    }
  }
  
  logger.info('🔍 [convertFormDataTypes] Dados finais após conversão:', JSON.stringify(converted, null, 2));
  return converted;
};

// Utilitário para processar dados de requisição com imagens
export const processRequestWithImages = (body: any, files?: Express.Multer.File[]): any => {
  logger.info('🔍 [processRequestWithImages] Função chamada com body:', JSON.stringify(body, null, 2));
  
  const processedImages = processUploadedImages(files || []);
  logger.info('🔍 [processRequestWithImages] Imagens processadas:', processedImages.length);
  
  const convertedData = convertFormDataTypes(body);
  logger.info('🔍 [processRequestWithImages] Dados convertidos:', JSON.stringify(convertedData, null, 2));
  
  const result = {
    ...convertedData,
    ...(processedImages.length > 0 && { images: processedImages })
  };
  
  logger.info('🔍 [processRequestWithImages] Resultado final:', JSON.stringify(result, null, 2));
  return result;
};