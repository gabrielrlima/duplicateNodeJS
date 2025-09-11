import { Request, Response, NextFunction } from 'express';
import { Empreendimento, IEmpreendimento, CreateEmpreendimentoData } from '../models/Empreendimento';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse } from '../utils/helpers';
import logger from '../config/logger';
import { z } from 'zod';
import mongoose from 'mongoose';

// Schema de validação para criação de empreendimento
const createEmpreendimentoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(200, 'Nome deve ter no máximo 200 caracteres'),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional(),
  type: z.enum(['residential', 'commercial', 'industrial', 'mixed'], { message: 'Tipo deve ser residential, commercial, industrial ou mixed' }),
  status: z.enum(['planning', 'construction', 'completed', 'delivered', 'inactive'], { message: 'Status inválido' }).default('planning'),
  totalUnits: z.number().min(1, 'Total de unidades deve ser maior que 0'),
  availableUnits: z.number().min(0, 'Unidades disponíveis não pode ser negativo'),
  totalArea: z.number().min(1, 'Área total deve ser maior que 0').optional(),
  builtArea: z.number().min(1, 'Área construída deve ser maior que 0').optional(),
  floors: z.number().min(1, 'Número de andares deve ser maior que 0').optional(),
  parkingSpaces: z.number().min(0, 'Vagas de garagem não pode ser negativo').optional(),
  amenities: z.array(z.string()).optional(),
  address: z.object({
    street: z.string().min(1, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    country: z.string().default('Brasil')
  }),
  latitude: z.number().min(-90, 'Latitude deve estar entre -90 e 90').max(90, 'Latitude deve estar entre -90 e 90').optional(),
  longitude: z.number().min(-180, 'Longitude deve estar entre -180 e 180').max(180, 'Longitude deve estar entre -180 e 180').optional(),
  basePrice: z.number().min(0, 'Preço base não pode ser negativo'),
  pricePerSquareMeter: z.number().min(0, 'Preço por m² não pode ser negativo').optional(),
  timeline: z.object({
    launchDate: z.string().datetime().optional(),
    constructionStart: z.string().datetime().optional(),
    expectedCompletion: z.string().datetime().optional(),
    deliveryDate: z.string().datetime().optional()
  }).optional(),
  hasDocumentation: z.boolean().default(false),
  registrationNumber: z.string().optional(),
  developer: z.object({
    name: z.string().min(1, 'Nome do desenvolvedor é obrigatório'),
    document: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional()
  }).optional(),
  acceptsFinancing: z.boolean().default(false),
  exclusiveProperty: z.boolean().default(false),
  highlightProperty: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  avatarUrl: z.string().optional(),
  agent: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().optional()
  }).optional(),
  realEstateId: z.string().min(1, 'ID da imobiliária é obrigatório')
});

// Schema de validação para atualização de empreendimento
const updateEmpreendimentoSchema = createEmpreendimentoSchema.partial().omit({ realEstateId: true });

export class EmpreendimentoController {
  // Listar empreendimentos por imobiliária
  static getEmpreendimentosByRealEstate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { real_estate_id } = req.query;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!real_estate_id || !mongoose.Types.ObjectId.isValid(real_estate_id as string)) {
      return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando empreendimentos por imobiliária:', { userId, realEstateId: real_estate_id });

    try {
      const empreendimentos = await Empreendimento.find({ 
        realEstateId: real_estate_id as string,
        ownerId: userId,
        isActive: true 
      }).sort({ createdAt: -1 });

      const empreendimentosResponse = empreendimentos.map((empreendimento: any) => empreendimento.toEmpreendimentoResponse());

      logger.info('Empreendimentos encontrados:', { 
        userId, 
        realEstateId: real_estate_id,
        count: empreendimentosResponse.length 
      });

      res.status(200).json(
        successResponse('Empreendimentos encontrados com sucesso', {
          empreendimentos: empreendimentosResponse,
          total: empreendimentosResponse.length
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar empreendimentos:', { userId, realEstateId: real_estate_id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Buscar empreendimento por ID
  static getEmpreendimentoById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID do empreendimento inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando empreendimento por ID:', { userId, empreendimentoId: id });

    try {
      const empreendimento = await Empreendimento.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!empreendimento) {
        return next(new AppError('Empreendimento não encontrado', 404, 'NOT_FOUND'));
      }

      // Incrementar visualizações
      await Empreendimento.findByIdAndUpdate(id, {
        $inc: { 'stats.views': 1 }
      });

      logger.info('Empreendimento encontrado:', { userId, empreendimentoId: id });

      res.status(200).json(
        successResponse('Empreendimento encontrado com sucesso', {
          empreendimento: empreendimento.toEmpreendimentoResponse()
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar empreendimento:', { userId, empreendimentoId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Criar empreendimento
  static createEmpreendimento = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Criando novo empreendimento:', { userId, body: req.body });

    try {
      // Validar dados de entrada
      const validatedData = createEmpreendimentoSchema.parse(req.body);

      // Verificar se a imobiliária pertence ao usuário
      if (!mongoose.Types.ObjectId.isValid(validatedData.realEstateId)) {
        return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
      }

      // Criar empreendimento
      const empreendimentoData = {
        ...validatedData,
        timeline: validatedData.timeline ? {
          launchDate: validatedData.timeline.launchDate ? new Date(validatedData.timeline.launchDate) : undefined,
          constructionStart: validatedData.timeline.constructionStart ? new Date(validatedData.timeline.constructionStart) : undefined,
          expectedCompletion: validatedData.timeline.expectedCompletion ? new Date(validatedData.timeline.expectedCompletion) : undefined,
          deliveryDate: validatedData.timeline.deliveryDate ? new Date(validatedData.timeline.deliveryDate) : undefined
        } : undefined
      };

      const empreendimento = new Empreendimento({
        ...empreendimentoData,
        ownerId: userId,
        realEstateId: new mongoose.Types.ObjectId(validatedData.realEstateId)
      });

      await empreendimento.save();

      logger.info('Empreendimento criado com sucesso:', { 
        userId, 
        empreendimentoId: empreendimento._id,
        realEstateId: validatedData.realEstateId
      });

      res.status(201).json(
        successResponse('Empreendimento criado com sucesso', {
          empreendimento: empreendimento.toEmpreendimentoResponse()
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(`Dados inválidos: ${errorMessages}`, 400, 'VALIDATION_ERROR'));
      }
      
      logger.error('Erro ao criar empreendimento:', { userId, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Atualizar empreendimento
  static updateEmpreendimento = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID do empreendimento inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Atualizando empreendimento:', { userId, empreendimentoId: id, body: req.body });

    try {
      // Validar dados de entrada
      const validatedData = updateEmpreendimentoSchema.parse(req.body);

      // Buscar empreendimento existente
      const existingEmpreendimento = await Empreendimento.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!existingEmpreendimento) {
        return next(new AppError('Empreendimento não encontrado', 404, 'NOT_FOUND'));
      }

      // Preparar dados para atualização
      const updateData = {
        ...validatedData,
        timeline: validatedData.timeline ? {
          launchDate: validatedData.timeline.launchDate ? new Date(validatedData.timeline.launchDate) : existingEmpreendimento.timeline?.launchDate,
          constructionStart: validatedData.timeline.constructionStart ? new Date(validatedData.timeline.constructionStart) : existingEmpreendimento.timeline?.constructionStart,
          expectedCompletion: validatedData.timeline.expectedCompletion ? new Date(validatedData.timeline.expectedCompletion) : existingEmpreendimento.timeline?.expectedCompletion,
          deliveryDate: validatedData.timeline.deliveryDate ? new Date(validatedData.timeline.deliveryDate) : existingEmpreendimento.timeline?.deliveryDate
        } : existingEmpreendimento.timeline,
        updatedAt: new Date()
      };

      // Atualizar empreendimento
      const updatedEmpreendimento = await Empreendimento.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedEmpreendimento) {
        return next(new AppError('Erro ao atualizar empreendimento', 500, 'INTERNAL_SERVER_ERROR'));
      }

      logger.info('Empreendimento atualizado com sucesso:', { userId, empreendimentoId: id });

      res.status(200).json(
        successResponse('Empreendimento atualizado com sucesso', {
          empreendimento: updatedEmpreendimento.toEmpreendimentoResponse()
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(`Dados inválidos: ${errorMessages}`, 400, 'VALIDATION_ERROR'));
      }
      
      logger.error('Erro ao atualizar empreendimento:', { userId, empreendimentoId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Deletar empreendimento (soft delete)
  static deleteEmpreendimento = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID do empreendimento inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Deletando empreendimento:', { userId, empreendimentoId: id });

    try {
      const empreendimento = await Empreendimento.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!empreendimento) {
        return next(new AppError('Empreendimento não encontrado', 404, 'NOT_FOUND'));
      }

      // Soft delete
      await Empreendimento.findByIdAndUpdate(id, {
        isActive: false,
        updatedAt: new Date()
      });

      logger.info('Empreendimento deletado com sucesso:', { userId, empreendimentoId: id });

      res.status(200).json(
        successResponse('Empreendimento deletado com sucesso', {})
      );
    } catch (error) {
      logger.error('Erro ao deletar empreendimento:', { userId, empreendimentoId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Buscar empreendimentos com filtros
  static searchEmpreendimentos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { real_estate_id } = req.query;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!real_estate_id || !mongoose.Types.ObjectId.isValid(real_estate_id as string)) {
      return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando empreendimentos com filtros:', { userId, realEstateId: real_estate_id, query: req.query });

    try {
      const {
        type,
        status,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        minUnits,
        maxUnits,
        city,
        state,
        neighborhood,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Construir filtros
      const filters: any = {
        realEstateId: real_estate_id as string,
        ownerId: userId,
        isActive: true
      };

      if (type) filters.type = type;
      if (status) filters.status = status;
      if (minPrice || maxPrice) {
        filters.basePrice = {};
        if (minPrice) filters.basePrice.$gte = Number(minPrice);
        if (maxPrice) filters.basePrice.$lte = Number(maxPrice);
      }
      if (minArea || maxArea) {
        filters.totalArea = {};
        if (minArea) filters.totalArea.$gte = Number(minArea);
        if (maxArea) filters.totalArea.$lte = Number(maxArea);
      }
      if (minUnits || maxUnits) {
        filters.totalUnits = {};
        if (minUnits) filters.totalUnits.$gte = Number(minUnits);
        if (maxUnits) filters.totalUnits.$lte = Number(maxUnits);
      }
      if (city) filters['address.city'] = new RegExp(city as string, 'i');
      if (state) filters['address.state'] = state;
      if (neighborhood) filters['address.neighborhood'] = new RegExp(neighborhood as string, 'i');

      // Configurar paginação
      const pageNumber = Math.max(1, Number(page));
      const limitNumber = Math.min(50, Math.max(1, Number(limit)));
      const skip = (pageNumber - 1) * limitNumber;

      // Configurar ordenação
      const sortOptions: any = {};
      sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

      // Buscar empreendimentos
      const [empreendimentos, total] = await Promise.all([
        Empreendimento.find(filters)
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNumber),
        Empreendimento.countDocuments(filters)
      ]);

      const empreendimentosResponse = empreendimentos.map((empreendimento: any) => empreendimento.toEmpreendimentoResponse());

      logger.info('Busca de empreendimentos concluída:', { 
        userId, 
        realEstateId: real_estate_id,
        total,
        returned: empreendimentosResponse.length,
        page: pageNumber
      });

      res.status(200).json(
        successResponse('Busca realizada com sucesso', {
          empreendimentos: empreendimentosResponse,
          pagination: {
            current: pageNumber,
            total: Math.ceil(total / limitNumber),
            count: empreendimentosResponse.length,
            totalItems: total
          }
        })
      );
    } catch (error) {
      logger.error('Erro na busca de empreendimentos:', { userId, realEstateId: real_estate_id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });
}