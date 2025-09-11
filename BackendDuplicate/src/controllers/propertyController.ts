import { Request, Response, NextFunction } from 'express';
import { PropertyModel, IProperty, CreatePropertyData } from '../models/Property';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse } from '../utils/helpers';
import logger from '../config/logger';
import { z } from 'zod';
import mongoose from 'mongoose';

// Schema de validação para criação de propriedade
const createPropertySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(200, 'Nome deve ter no máximo 200 caracteres'),
  title: z.string().max(200, 'Título deve ter no máximo 200 caracteres').optional(),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional(),
  propertyDescription: z.string().max(2000, 'Descrição da propriedade deve ter no máximo 2000 caracteres').optional(),
  type: z.enum(['apartment', 'house', 'commercial', 'land', 'penthouse', 'studio', 'loft', 'farm', 'warehouse', 'office']),
  status: z.enum(['available', 'sold', 'rented', 'reserved', 'inactive']).default('available'),
  condition: z.enum(['new', 'used', 'under_construction', 'to_renovate']).optional(),
  area: z.number().min(1, 'Área deve ser maior que 0'),
  builtArea: z.number().min(1, 'Área construída deve ser maior que 0').optional(),
  totalArea: z.number().min(1, 'Área total deve ser maior que 0').optional(),
  bedrooms: z.number().min(0, 'Número de quartos não pode ser negativo').max(50, 'Número de quartos não pode exceder 50').optional(),
  suites: z.number().min(0, 'Número de suítes não pode ser negativo').max(20, 'Número de suítes não pode exceder 20').optional(),
  bathrooms: z.number().min(0, 'Número de banheiros não pode ser negativo').max(20, 'Número de banheiros não pode exceder 20').optional(),
  parkingSpaces: z.number().min(0, 'Número de vagas não pode ser negativo').max(20, 'Número de vagas não pode exceder 20').optional(),
  floor: z.string().optional(),
  totalFloors: z.number().min(1, 'Número total de andares deve ser pelo menos 1').max(200, 'Número total de andares não pode exceder 200').optional(),
  elevator: z.boolean().default(false),
  furnished: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
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
  value: z.number().min(0, 'Valor não pode ser negativo'),
  salePrice: z.number().min(0, 'Preço de venda não pode ser negativo').optional(),
  rentPrice: z.number().min(0, 'Preço de aluguel não pode ser negativo').optional(),
  pricePerSquareMeter: z.number().min(0, 'Preço por m² não pode ser negativo').optional(),
  condominiumFee: z.number().min(0, 'Taxa de condomínio não pode ser negativa').optional(),
  iptuValue: z.number().min(0, 'Valor do IPTU não pode ser negativo').optional(),
  sunPosition: z.enum(['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest']).optional(),
  constructionYear: z.string().optional(),
  yearBuilt: z.number().min(1800, 'Ano de construção deve ser posterior a 1800').max(new Date().getFullYear() + 10, 'Ano de construção não pode ser muito futuro').optional(),
  buildingName: z.string().max(200, 'Nome do edifício deve ter no máximo 200 caracteres').optional(),
  amenities: z.record(z.string(), z.boolean()).optional(),
  condominiumAmenities: z.array(z.string()).optional(),
  acceptsFinancing: z.boolean().default(false),
  acceptsExchange: z.boolean().default(false),
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
  owner: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    document: z.string().optional(),
    avatarUrl: z.string().optional()
  }).optional(),
  availableFrom: z.string().datetime().optional(),
  realEstateId: z.string().min(1, 'ID da imobiliária é obrigatório')
});

// Schema de validação para atualização de propriedade
const updatePropertySchema = createPropertySchema.partial().omit({ realEstateId: true });

export class PropertyController {
  // Listar propriedades de uma imobiliária
  static getPropertiesByRealEstate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { real_estate_id } = req.query;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!real_estate_id) {
      return next(new AppError('ID da imobiliária é obrigatório', 400, 'BAD_REQUEST'));
    }

    if (!mongoose.Types.ObjectId.isValid(real_estate_id as string)) {
      return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando propriedades da imobiliária:', { userId, realEstateId: real_estate_id });

    try {
      const properties = await PropertyModel.find({ 
        realEstateId: real_estate_id,
        ownerId: userId,
        isActive: true 
      }).sort({ createdAt: -1 });

      const propertiesResponse = properties.map(property => property.toPropertyResponse());

      logger.info('Propriedades encontradas:', { 
        userId, 
        realEstateId: real_estate_id,
        count: propertiesResponse.length 
      });

      res.status(200).json(
        successResponse('Propriedades encontradas com sucesso', {
          properties: propertiesResponse,
          total: propertiesResponse.length
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar propriedades:', { userId, realEstateId: real_estate_id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Buscar propriedade por ID
  static getPropertyById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID da propriedade inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando propriedade por ID:', { userId, propertyId: id });

    try {
      const property = await PropertyModel.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!property) {
        return next(new AppError('Propriedade não encontrada', 404, 'NOT_FOUND'));
      }

      logger.info('Propriedade encontrada:', { userId, propertyId: id });

      res.status(200).json(
        successResponse('Propriedade encontrada com sucesso', {
          property: property.toPropertyResponse()
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar propriedade:', { userId, propertyId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Criar nova propriedade
  static createProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Criando nova propriedade:', { userId, body: req.body });

    try {
      // Validar dados de entrada
      const validatedData = createPropertySchema.parse(req.body);

      // Verificar se a imobiliária pertence ao usuário
      if (!mongoose.Types.ObjectId.isValid(validatedData.realEstateId)) {
        return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
      }

      // Criar propriedade
      const propertyData = {
        ...validatedData,
        availableFrom: validatedData.availableFrom ? new Date(validatedData.availableFrom) : undefined,
        amenities: validatedData.amenities as Record<string, boolean> | undefined
      };

      const property = new PropertyModel({
        ...propertyData,
        ownerId: userId,
        realEstateId: new mongoose.Types.ObjectId(validatedData.realEstateId)
      });

      await property.save();

      logger.info('Propriedade criada com sucesso:', { 
        userId, 
        propertyId: property._id,
        realEstateId: validatedData.realEstateId
      });

      res.status(201).json(
        successResponse('Propriedade criada com sucesso', {
          property: property.toPropertyResponse()
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(`Dados inválidos: ${errorMessages}`, 400, 'VALIDATION_ERROR'));
      }
      
      logger.error('Erro ao criar propriedade:', { userId, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Atualizar propriedade
  static updateProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID da propriedade inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Atualizando propriedade:', { userId, propertyId: id, body: req.body });

    try {
      // Validar dados de entrada
      const validatedData = updatePropertySchema.parse(req.body);

      // Buscar propriedade existente
      const existingProperty = await PropertyModel.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!existingProperty) {
        return next(new AppError('Propriedade não encontrada', 404, 'NOT_FOUND'));
      }

      // Atualizar propriedade
      const updateData = {
        ...validatedData,
        availableFrom: validatedData.availableFrom ? new Date(validatedData.availableFrom) : existingProperty.availableFrom,
        lastUpdated: new Date()
      };

      const updatedProperty = await PropertyModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedProperty) {
        return next(new AppError('Erro ao atualizar propriedade', 500, 'INTERNAL_SERVER_ERROR'));
      }

      logger.info('Propriedade atualizada com sucesso:', { 
        userId, 
        propertyId: id
      });

      res.status(200).json(
        successResponse('Propriedade atualizada com sucesso', {
          property: updatedProperty.toPropertyResponse()
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(`Dados inválidos: ${errorMessages}`, 400, 'VALIDATION_ERROR'));
      }
      
      logger.error('Erro ao atualizar propriedade:', { userId, propertyId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Deletar propriedade (soft delete)
  static deleteProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID da propriedade inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Deletando propriedade:', { userId, propertyId: id });

    try {
      const property = await PropertyModel.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!property) {
        return next(new AppError('Propriedade não encontrada', 404, 'NOT_FOUND'));
      }

      // Soft delete
      await PropertyModel.findByIdAndUpdate(id, { 
        isActive: false,
        lastUpdated: new Date()
      });

      logger.info('Propriedade deletada com sucesso:', { 
        userId, 
        propertyId: id
      });

      res.status(200).json(
        successResponse('Propriedade deletada com sucesso', {})
      );
    } catch (error) {
      logger.error('Erro ao deletar propriedade:', { userId, propertyId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Buscar propriedades com filtros
  static searchProperties = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { 
      real_estate_id,
      type,
      status,
      min_price,
      max_price,
      min_area,
      max_area,
      bedrooms,
      bathrooms,
      city,
      state,
      neighborhood,
      page = 1,
      limit = 10,
      sort_by = 'createdAt',
      sort_order = 'desc'
    } = req.query;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!real_estate_id) {
      return next(new AppError('ID da imobiliária é obrigatório', 400, 'BAD_REQUEST'));
    }

    if (!mongoose.Types.ObjectId.isValid(real_estate_id as string)) {
      return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando propriedades com filtros:', { 
      userId, 
      realEstateId: real_estate_id,
      filters: req.query 
    });

    try {
      // Construir filtros
      const filters: any = {
        realEstateId: real_estate_id,
        ownerId: userId,
        isActive: true
      };

      if (type) filters.type = type;
      if (status) filters.status = status;
      if (min_price || max_price) {
        filters.value = {};
        if (min_price) filters.value.$gte = Number(min_price);
        if (max_price) filters.value.$lte = Number(max_price);
      }
      if (min_area || max_area) {
        filters.area = {};
        if (min_area) filters.area.$gte = Number(min_area);
        if (max_area) filters.area.$lte = Number(max_area);
      }
      if (bedrooms) filters.bedrooms = Number(bedrooms);
      if (bathrooms) filters.bathrooms = Number(bathrooms);
      if (city) filters['address.city'] = new RegExp(city as string, 'i');
      if (state) filters['address.state'] = state;
      if (neighborhood) filters['address.neighborhood'] = new RegExp(neighborhood as string, 'i');

      // Configurar paginação
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(50, Math.max(1, Number(limit)));
      const skip = (pageNum - 1) * limitNum;

      // Configurar ordenação
      const sortOrder = sort_order === 'asc' ? 1 : -1;
      const sortField = sort_by as string;
      const sort: any = { [sortField]: sortOrder };

      // Buscar propriedades
      const [properties, total] = await Promise.all([
        PropertyModel.find(filters)
          .sort(sort)
          .skip(skip)
          .limit(limitNum),
        PropertyModel.countDocuments(filters)
      ]);

      const propertiesResponse = properties.map(property => property.toPropertyResponse());

      logger.info('Propriedades encontradas com filtros:', { 
        userId, 
        realEstateId: real_estate_id,
        count: propertiesResponse.length,
        total,
        page: pageNum,
        limit: limitNum
      });

      res.status(200).json(
        successResponse('Propriedades encontradas com sucesso', {
          properties: propertiesResponse,
          pagination: {
            current_page: pageNum,
            per_page: limitNum,
            total_items: total,
            total_pages: Math.ceil(total / limitNum)
          }
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar propriedades com filtros:', { 
        userId, 
        realEstateId: real_estate_id, 
        error 
      });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Obter estatísticas das propriedades de uma imobiliária
  static getPropertyStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { real_estate_id } = req.query;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!real_estate_id) {
      return next(new AppError('ID da imobiliária é obrigatório', 400, 'BAD_REQUEST'));
    }

    if (!mongoose.Types.ObjectId.isValid(real_estate_id as string)) {
      return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando estatísticas das propriedades:', { userId, realEstateId: real_estate_id });

    try {
      const realEstateObjectId = new mongoose.Types.ObjectId(real_estate_id as string);
      
      // Buscar estatísticas usando agregação
      const stats = await PropertyModel.aggregate([
        {          $match: {            realEstateId: realEstateObjectId,            $or: [              { isDeleted: false },              { isDeleted: { $exists: false } }            ]          }        },
        {
          $group: {
            _id: null,
            totalProperties: { $sum: 1 },
            availableProperties: {
              $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
            },
            soldProperties: {
              $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
            },
            rentedProperties: {
              $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] }
            },
            averagePrice: { $avg: '$value' },
            minPrice: { $min: '$value' },
            maxPrice: { $max: '$value' }
          }
        }
      ]);

      const result = stats[0] || {
        totalProperties: 0,
        availableProperties: 0,
        soldProperties: 0,
        rentedProperties: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0
      };

      const response = {
        totalProperties: result.totalProperties,
        availableProperties: result.availableProperties,
        soldProperties: result.soldProperties,
        rentedProperties: result.rentedProperties,
        averagePrice: Math.round(result.averagePrice || 0),
        priceRange: {
          min: result.minPrice || 0,
          max: result.maxPrice || 0
        }
      };

      logger.info('Estatísticas das propriedades encontradas:', { userId, realEstateId: real_estate_id, stats: response });

      return res.status(200).json(successResponse('Estatísticas das propriedades obtidas com sucesso', response));

    } catch (error) {
      logger.error('Erro ao buscar estatísticas das propriedades:', { userId, realEstateId: real_estate_id, error: error instanceof Error ? error.message : 'Erro desconhecido' });
      return next(new AppError('Erro interno do servidor ao buscar estatísticas das propriedades', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });
}