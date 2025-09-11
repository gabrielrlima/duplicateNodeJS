import { Request, Response, NextFunction } from 'express';
import { RealEstateModel, IRealEstate } from '../models/RealEstate';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse } from '../utils/helpers';
import logger from '../config/logger';
import { z } from 'zod';

// Schema de validação para criação de imobiliária - Simplificado
const createRealEstateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, 'CNPJ inválido'),
  tradeName: z.string().max(100, 'Nome fantasia deve ter no máximo 100 caracteres').optional(),
  description: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido').optional(),
  website: z.string().url('URL do website inválida').optional(),
  address: z.object({
    street: z.string().min(1, 'Rua é obrigatória').optional(),
    number: z.string().min(1, 'Número é obrigatório').optional(),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório').optional(),
    city: z.string().min(1, 'Cidade é obrigatória').optional(),
    state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional(),
    country: z.string().default('Brasil')
  }).optional(),
  contacts: z.array(z.object({
    name: z.string().min(1, 'Nome do contato é obrigatório'),
    role: z.string().min(1, 'Cargo do contato é obrigatório'),
    email: z.string().email('Email do contato inválido').optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone do contato inválido').optional()
  })).optional(),
  specialties: z.array(z.enum(['residential', 'commercial', 'industrial', 'rural', 'luxury', 'investment'])).optional(),
  serviceAreas: z.array(z.string()).optional(),
  logo: z.string().optional()
});

// Função auxiliar para processar endereço
const processAddress = (address: any) => ({
  street: address.street,
  number: address.number,
  complement: address.complement,
  neighborhood: address.neighborhood,
  city: address.city,
  state: address.state,
  zipCode: address.zipCode,
  country: address.country || 'Brasil'
});

export class RealEstateController {
  // Buscar todas as imobiliárias do usuário logado
  static getUserRealEstates = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Buscando imobiliárias do usuário:', { userId });

    try {
      const realEstates = await RealEstateModel.find({ 
        ownerId: userId,
        isActive: true 
      }).sort({ createdAt: -1 });

      const realEstatesResponse = realEstates.map(realEstate => realEstate.toRealEstateResponse());

      logger.info('Imobiliárias encontradas:', { 
        userId, 
        count: realEstatesResponse.length 
      });

      res.status(200).json(
        successResponse('Imobiliárias encontradas com sucesso', {
          realEstates: realEstatesResponse,
          total: realEstatesResponse.length
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar imobiliárias:', { userId, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Criar nova imobiliária
  static createRealEstate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Criando nova imobiliária:', { 
      userId, 
      body: req.body, 
      file: req.file ? { mimetype: req.file.mimetype, size: req.file.size } : null,
      addressType: typeof req.body.address,
      addressValue: req.body.address
    });

    try {
      // Processar dados do formulário
      let addressData;
      try {
        const addressStr = req.body.address;
        if (typeof addressStr === 'string') {
          addressData = JSON.parse(addressStr);
        } else if (typeof addressStr === 'object') {
          addressData = addressStr;
        } else {
          addressData = undefined;
        }
      } catch (parseError) {
        logger.error('Erro ao parsear endereço:', parseError);
        return next(new AppError('Formato de endereço inválido', 422, 'VALIDATION_ERROR'));
      }
      
      const formData = {
        ...req.body,
        address: addressData
      };

      // Validar dados de entrada
      const validatedData = createRealEstateSchema.parse(formData);

      // Verificar se já existe uma imobiliária com o mesmo CNPJ
      const existingRealEstate = await RealEstateModel.findOne({ cnpj: validatedData.cnpj });
      if (existingRealEstate) {
        return next(new AppError('Já existe uma imobiliária cadastrada com este CNPJ', 409, 'CNPJ_ALREADY_EXISTS'));
      }

      // Processar logo se houver upload
      let logoUrl = '';
      if (req.file) {
        // Aqui você pode implementar o upload para serviços como AWS S3, Cloudinary, etc.
        // Por enquanto, vamos salvar como base64 ou gerar uma URL temporária
        logoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }

      // Criar nova imobiliária
      const newRealEstate = new RealEstateModel({
        ...validatedData,
        logo: logoUrl,
        ownerId: userId
      });

      const savedRealEstate = await newRealEstate.save();
      const realEstateResponse = savedRealEstate.toRealEstateResponse();

      logger.info('Imobiliária criada com sucesso:', { 
        userId, 
        realEstateId: savedRealEstate._id 
      });

      res.status(201).json(
        successResponse('Imobiliária criada com sucesso', {
          realEstate: realEstateResponse
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return next(new AppError('Dados inválidos', 422, 'VALIDATION_ERROR'));
      }

      logger.error('Erro ao criar imobiliária:', { userId, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Buscar imobiliária por ID
  static getRealEstateById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Buscando imobiliária por ID:', { userId, realEstateId: id });

    try {
      const realEstate = await RealEstateModel.findOne({ 
        _id: id,
        ownerId: userId 
      });

      if (!realEstate) {
        return next(new AppError('Imobiliária não encontrada', 404, 'REAL_ESTATE_NOT_FOUND'));
      }

      const realEstateResponse = realEstate.toRealEstateResponse();

      logger.info('Imobiliária encontrada:', { userId, realEstateId: id });

      res.status(200).json(
        successResponse('Imobiliária encontrada com sucesso', {
          realEstate: realEstateResponse
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar imobiliária:', { userId, realEstateId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Atualizar imobiliária
  static updateRealEstate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Atualizando imobiliária:', { userId, realEstateId: id, body: req.body });

    try {
      // Processar dados do formulário
      const formData = {
        ...req.body,
        address: req.body.address ? JSON.parse(req.body.address) : undefined
      };

      // Validar dados de entrada (parcial)
      const partialSchema = createRealEstateSchema.partial();
      const validatedData = partialSchema.parse(formData);

      // Verificar se a imobiliária existe e pertence ao usuário
      const realEstate = await RealEstateModel.findOne({ 
        _id: id,
        ownerId: userId 
      });

      if (!realEstate) {
        return next(new AppError('Imobiliária não encontrada', 404, 'REAL_ESTATE_NOT_FOUND'));
      }

      // Se o CNPJ está sendo alterado, verificar se não existe outro com o mesmo CNPJ
      if (validatedData.cnpj && validatedData.cnpj !== realEstate.cnpj) {
        const existingRealEstate = await RealEstateModel.findOne({ 
          cnpj: validatedData.cnpj,
          _id: { $ne: id }
        });
        if (existingRealEstate) {
          return next(new AppError('Já existe uma imobiliária cadastrada com este CNPJ', 409, 'CNPJ_ALREADY_EXISTS'));
        }
      }

      // Processar logo se houver upload
      let logoUrl = realEstate.logo;
      if (req.file) {
        logoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }

      // Atualizar imobiliária
      const updatedRealEstate = await RealEstateModel.findOneAndUpdate(
        { _id: id, ownerId: userId },
        { ...validatedData, logo: logoUrl },
        { new: true, runValidators: true }
      );

      const realEstateResponse = updatedRealEstate!.toRealEstateResponse();

      logger.info('Imobiliária atualizada com sucesso:', { 
        userId, 
        realEstateId: id 
      });

      res.status(200).json(
        successResponse('Imobiliária atualizada com sucesso', {
          realEstate: realEstateResponse
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return next(new AppError('Dados inválidos', 422, 'VALIDATION_ERROR'));
      }

      logger.error('Erro ao atualizar imobiliária:', { userId, realEstateId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Desativar imobiliária (soft delete)
  static deleteRealEstate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Desativando imobiliária:', { userId, realEstateId: id });

    try {
      // Verificar se a imobiliária existe e pertence ao usuário
      const realEstate = await RealEstateModel.findOne({ 
        _id: id,
        ownerId: userId 
      });

      if (!realEstate) {
        return next(new AppError('Imobiliária não encontrada', 404, 'REAL_ESTATE_NOT_FOUND'));
      }

      // Desativar imobiliária (soft delete)
      const updatedRealEstate = await RealEstateModel.findByIdAndUpdate(
        id,
        { $set: { isActive: false } },
        { new: true }
      );

      if (!updatedRealEstate) {
        return next(new AppError('Erro ao desativar imobiliária', 500, 'DELETE_ERROR'));
      }

      logger.info('Imobiliária desativada com sucesso:', { 
        userId, 
        realEstateId: id 
      });

      res.status(200).json(
        successResponse('Imobiliária desativada com sucesso', {
          realEstate: updatedRealEstate.toRealEstateResponse()
        })
      );
    } catch (error) {
      logger.error('Erro ao desativar imobiliária:', { userId, realEstateId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });
}