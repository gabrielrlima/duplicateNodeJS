import { Request, Response, NextFunction } from 'express';
import { TerrenoModel, ITerreno, CreateTerrenoData } from '../models/Terreno';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse, processRequestWithImages } from '../utils/helpers';
import logger from '../config/logger';
import { z } from 'zod';
import mongoose from 'mongoose';

// Schema de validação para criação de terreno
const createTerrenoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome deve ter no máximo 200 caracteres'),
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título deve ter no máximo 200 caracteres'),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional(),
  terrainDescription: z.string().max(2000, 'Descrição do terreno deve ter no máximo 2000 caracteres').optional(),
  type: z.enum(['residential', 'commercial', 'industrial', 'rural', 'mixed']),
  status: z.enum(['available', 'sold', 'reserved', 'inactive']).default('available'),
  condition: z.enum(['ready_to_build', 'with_project', 'with_construction', 'clean']).optional(),
  totalArea: z.number().min(0.01, 'Área total deve ser maior que zero'),
  usableArea: z.number().min(0, 'Área útil não pode ser negativa').optional(),
  frontage: z.number().min(0, 'Testada não pode ser negativa').optional(),
  depth: z.number().min(0, 'Profundidade não pode ser negativa').optional(),
  dimensoes: z.string().max(100, 'Dimensões deve ter no máximo 100 caracteres').optional(),
  topography: z.enum(['flat', 'sloped', 'irregular']).optional(),
  soilType: z.enum(['clay', 'sand', 'rock', 'mixed']).optional(),
  vegetation: z.enum(['none', 'grass', 'trees', 'forest']).optional(),
  waterAccess: z.boolean().default(false),
  electricityAccess: z.boolean().default(false),
  sewerAccess: z.boolean().default(false),
  gasAccess: z.boolean().default(false),
  internetAccess: z.boolean().default(false),
  zoning: z.enum(['residential', 'commercial', 'industrial', 'mixed']).optional(),
  buildingCoefficient: z.number().min(0, 'Coeficiente de aproveitamento não pode ser negativo').max(10, 'Coeficiente de aproveitamento não pode exceder 10').optional(),
  occupancyRate: z.number().min(0, 'Taxa de ocupação não pode ser negativa').max(1, 'Taxa de ocupação não pode exceder 100%').optional(),
  setbackFront: z.number().min(0, 'Recuo frontal não pode ser negativo').optional(),
  setbackSide: z.number().min(0, 'Recuo lateral não pode ser negativo').optional(),
  setbackRear: z.number().min(0, 'Recuo de fundos não pode ser negativo').optional(),
  maxHeight: z.number().min(0, 'Altura máxima não pode ser negativa').optional(),
  address: z.object({
    street: z.string().min(1, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(1, 'Estado é obrigatório'),
    zipCode: z.string().min(1, 'CEP é obrigatório'),
    country: z.string().default('Brasil')
  }),
  latitude: z.number().min(-90, 'Latitude deve estar entre -90 e 90').max(90, 'Latitude deve estar entre -90 e 90').optional(),
  longitude: z.number().min(-180, 'Longitude deve estar entre -180 e 180').max(180, 'Longitude deve estar entre -180 e 180').optional(),
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  salePrice: z.number().min(0, 'Preço de venda não pode ser negativo').optional(),
  pricePerSquareMeter: z.number().min(0, 'Preço por m² não pode ser negativo').optional(),
  ituValue: z.number().min(0, 'Valor do ITU não pode ser negativo').optional(),
  preco_negociavel: z.boolean().default(false),
  itu_anual: z.number().min(0, 'ITU anual não pode ser negativo').optional(),
  sunPosition: z.enum(['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest']).optional(),
  nearbyAmenities: z.array(z.string()).optional(),
  accessType: z.enum(['paved', 'dirt', 'cobblestone']).optional(),
  hasDocumentation: z.boolean().default(false),
  registrationNumber: z.string().optional(),
  acceptsFinancing: z.boolean().default(false),
  acceptsExchange: z.boolean().default(false),
  exclusiveProperty: z.boolean().default(false),
  highlightProperty: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  avatarUrl: z.string().optional(),
  agent: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional().refine((val) => !val || val === '' || z.string().email().safeParse(val).success, { message: 'Invalid email address' }),
    avatarUrl: z.string().optional()
  }).optional(),
  owner: z.object({
    name: z.string().min(1, 'Nome do proprietário é obrigatório'),
    email: z.string().optional().refine((val) => !val || val === '' || z.string().email().safeParse(val).success, { message: 'Invalid email address' }),
    phone: z.string().optional(),
    document: z.string().optional(),
    avatarUrl: z.string().optional()
  }),
  availableFrom: z.string().datetime().optional(),
  realEstateId: z.string().min(1, 'ID da imobiliária é obrigatório')
});

// Schema de validação para atualização de terreno
const updateTerrenoSchema = createTerrenoSchema.partial().omit({ realEstateId: true });

export class TerrenoController {
  // Listar terrenos de uma imobiliária
  static getTerrenosByRealEstate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

    logger.info('Buscando terrenos da imobiliária:', { userId, realEstateId: real_estate_id });
    
    // Debug: log dos parâmetros de busca
    console.log('DEBUG - Parâmetros de busca:', {
      realEstateId: real_estate_id,
      realEstateIdType: typeof real_estate_id,
      ownerId: userId,
      ownerIdType: typeof userId,
      isActive: true
    });

    try {
      // Teste: buscar sem conversão para ObjectId
      const terrenosTest = await TerrenoModel.find({ 
        realEstateId: real_estate_id,
        ownerId: userId,
        isActive: true 
      }).sort({ createdAt: -1 });
      
      console.log('DEBUG - Terrenos sem conversão:', terrenosTest.length);
      
      // Teste: buscar com conversão para ObjectId
      const terrenos = await TerrenoModel.find({ 
        realEstateId: new mongoose.Types.ObjectId(real_estate_id as string),
        ownerId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      }).sort({ createdAt: -1 });
      
      console.log('DEBUG - Terrenos com conversão:', terrenos.length);

      const terrenosResponse = terrenos.map(terreno => terreno.toTerrenoResponse());

      logger.info('Terrenos encontrados:', { 
        userId, 
        realEstateId: real_estate_id,
        count: terrenosResponse.length 
      });

      res.status(200).json(
        successResponse('Terrenos encontrados com sucesso', {
          terrenos: terrenosResponse,
          total: terrenosResponse.length
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar terrenos:', { userId, realEstateId: real_estate_id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Buscar terreno por ID
  static getTerrenoById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID do terreno inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Buscando terreno por ID:', { userId, terrenoId: id });

    try {
      const terreno = await TerrenoModel.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!terreno) {
        return next(new AppError('Terreno não encontrado', 404, 'NOT_FOUND'));
      }

      logger.info('Terreno encontrado:', { userId, terrenoId: id });

      res.status(200).json(
        successResponse('Terreno encontrado com sucesso', {
          terreno: terreno.toTerrenoResponse()
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar terreno:', { userId, terrenoId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Criar novo terreno
  static createTerreno = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    logger.info('Criando novo terreno:', { 
      userId, 
      body: req.body, 
      hasFiles: !!(req.files && Array.isArray(req.files) && req.files.length > 0),
      fileCount: req.files && Array.isArray(req.files) ? req.files.length : 0
    });

    try {
      // Processar dados da requisição com imagens
      const bodyWithImages = processRequestWithImages(req.body, req.files as Express.Multer.File[]);
      
      logger.info('Dados processados para validação:', { 
        userId, 
        hasImages: !!(bodyWithImages.images && bodyWithImages.images.length > 0),
        imageCount: bodyWithImages.images ? bodyWithImages.images.length : 0
      });

      // Validar dados de entrada
      const validatedData = createTerrenoSchema.parse(bodyWithImages);

      // Verificar se a imobiliária foi fornecida e é válida
      if (!validatedData.realEstateId) {
        return next(new AppError('ID da imobiliária é obrigatório', 400, 'BAD_REQUEST'));
      }

      if (!mongoose.Types.ObjectId.isValid(validatedData.realEstateId)) {
        return next(new AppError('ID da imobiliária inválido', 400, 'BAD_REQUEST'));
      }

      // Criar terreno
      const terrenoData = {
        ...validatedData,
        availableFrom: validatedData.availableFrom ? new Date(validatedData.availableFrom) : undefined
      };

      const terreno = new TerrenoModel({
        ...terrenoData,
        ownerId: userId,
        realEstateId: new mongoose.Types.ObjectId(validatedData.realEstateId)
      });

      await terreno.save();

      logger.info('Terreno criado com sucesso:', { 
        userId, 
        terrenoId: terreno._id,
        realEstateId: validatedData.realEstateId
      });

      let terrenoResponse;
      try {
        terrenoResponse = terreno.toTerrenoResponse();
      } catch (responseError: any) {
        logger.error('Erro ao gerar resposta do terreno:', { 
          userId, 
          terrenoId: terreno._id, 
          errorMessage: responseError?.message || 'No message',
          errorStack: responseError?.stack || 'No stack',
          errorString: String(responseError),
          errorType: typeof responseError
        });
        throw responseError;
      }

      res.status(201).json(
        successResponse('Terreno criado com sucesso', {
          terreno: terrenoResponse
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(`Dados inválidos: ${errorMessages}`, 400, 'VALIDATION_ERROR'));
      }
      
      logger.error('Erro ao criar terreno:', { userId, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Atualizar terreno
  static updateTerreno = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID do terreno inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Atualizando terreno:', { 
      userId, 
      terrenoId: id, 
      body: req.body, 
      hasFiles: !!(req.files && Array.isArray(req.files) && req.files.length > 0),
      fileCount: req.files && Array.isArray(req.files) ? req.files.length : 0
    });

    try {
      // Processar dados da requisição com imagens
      const bodyWithImages = processRequestWithImages(req.body, req.files as Express.Multer.File[]);
      
      logger.info('Dados processados para validação de atualização:', { 
        userId, 
        terrenoId: id,
        hasNewImages: !!(bodyWithImages.images && bodyWithImages.images.length > 0),
        newImageCount: bodyWithImages.images ? bodyWithImages.images.length : 0,
        ownerEmail: bodyWithImages.owner?.email,
        ownerEmailType: typeof bodyWithImages.owner?.email,
        bodyWithImages: JSON.stringify(bodyWithImages, null, 2)
      });

      // Validar dados de entrada
      const validatedData = updateTerrenoSchema.parse(bodyWithImages);

      // Buscar terreno existente
      const existingTerreno = await TerrenoModel.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!existingTerreno) {
        return next(new AppError('Terreno não encontrado', 404, 'NOT_FOUND'));
      }

      // Atualizar terreno
      const updateData = {
        ...validatedData,
        availableFrom: validatedData.availableFrom ? new Date(validatedData.availableFrom) : existingTerreno.availableFrom,
        lastUpdated: new Date()
      };

      const updatedTerreno = await TerrenoModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedTerreno) {
        return next(new AppError('Erro ao atualizar terreno', 500, 'INTERNAL_SERVER_ERROR'));
      }

      logger.info('Terreno atualizado com sucesso:', { 
        userId, 
        terrenoId: id
      });

      res.status(200).json(
        successResponse('Terreno atualizado com sucesso', {
          terreno: updatedTerreno.toTerrenoResponse()
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(`Dados inválidos: ${errorMessages}`, 400, 'VALIDATION_ERROR'));
      }
      
      logger.error('Erro ao atualizar terreno:', { userId, terrenoId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Deletar terreno (soft delete)
  static deleteTerreno = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('ID do terreno inválido', 400, 'BAD_REQUEST'));
    }

    logger.info('Deletando terreno:', { userId, terrenoId: id });

    try {
      const terreno = await TerrenoModel.findOne({ 
        _id: id,
        ownerId: userId,
        isActive: true 
      });

      if (!terreno) {
        return next(new AppError('Terreno não encontrado', 404, 'NOT_FOUND'));
      }

      // Soft delete
      await TerrenoModel.findByIdAndUpdate(id, { 
        isActive: false,
        lastUpdated: new Date()
      });

      logger.info('Terreno deletado com sucesso:', { 
        userId, 
        terrenoId: id
      });

      res.status(200).json(
        successResponse('Terreno deletado com sucesso', {})
      );
    } catch (error) {
      logger.error('Erro ao deletar terreno:', { userId, terrenoId: id, error });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });

  // Buscar terrenos com filtros
  static searchTerrenos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { 
      real_estate_id,
      type,
      status,
      min_price,
      max_price,
      min_area,
      max_area,
      topography,
      soil_type,
      vegetation,
      zoning,
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

    logger.info('Buscando terrenos com filtros:', { 
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
      if (topography) filters.topography = topography;
      if (soil_type) filters.soilType = soil_type;
      if (vegetation) filters.vegetation = vegetation;
      if (zoning) filters.zoning = zoning;
      
      if (min_price || max_price) {
        filters.value = {};
        if (min_price) filters.value.$gte = Number(min_price);
        if (max_price) filters.value.$lte = Number(max_price);
      }
      
      if (min_area || max_area) {
        filters.totalArea = {};
        if (min_area) filters.totalArea.$gte = Number(min_area);
        if (max_area) filters.totalArea.$lte = Number(max_area);
      }
      
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

      // Buscar terrenos
      const [terrenos, total] = await Promise.all([
        TerrenoModel.find(filters)
          .sort(sort)
          .skip(skip)
          .limit(limitNum),
        TerrenoModel.countDocuments(filters)
      ]);

      const terrenosResponse = terrenos.map(terreno => terreno.toTerrenoResponse());

      logger.info('Terrenos encontrados com filtros:', { 
        userId, 
        realEstateId: real_estate_id,
        count: terrenosResponse.length,
        total,
        page: pageNum,
        limit: limitNum
      });

      res.status(200).json(
        successResponse('Terrenos encontrados com sucesso', {
          terrenos: terrenosResponse,
          pagination: {
            current_page: pageNum,
            per_page: limitNum,
            total_items: total,
            total_pages: Math.ceil(total / limitNum)
          }
        })
      );
    } catch (error) {
      logger.error('Erro ao buscar terrenos com filtros:', { 
        userId, 
        realEstateId: real_estate_id, 
        error 
      });
      return next(new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR'));
    }
  });
}