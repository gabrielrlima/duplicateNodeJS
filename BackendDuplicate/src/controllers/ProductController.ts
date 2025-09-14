import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { ProductModel, IProduct, CreateProductData, ProductResponse } from '../models/Product';
import { asyncHandler } from '../middleware/errorHandler';

// Tipos de resposta da API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Schema de validação para criação de produto
const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome deve ter no máximo 200 caracteres'),
  title: z.string().max(200, 'Título deve ter no máximo 200 caracteres').optional(),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional(),
  type: z.enum(['imovel', 'terreno', 'empreendimento']),
  status: z.enum(['available', 'sold', 'rented', 'reserved', 'inactive']).default('available'),
  condition: z.enum(['new', 'used', 'under_construction', 'to_renovate', 'ready_to_build', 'with_project', 'clean']).optional(),
  
  // Área e medidas
  area: z.number().positive('Área deve ser maior que zero'),
  builtArea: z.number().nonnegative('Área construída não pode ser negativa').optional(),
  totalArea: z.number().nonnegative('Área total não pode ser negativa').optional(),
  usableArea: z.number().nonnegative('Área útil não pode ser negativa').optional(),
  frontage: z.number().nonnegative('Testada não pode ser negativa').optional(),
  depth: z.number().nonnegative('Profundidade não pode ser negativa').optional(),
  
  // Características de imóveis
  bedrooms: z.number().int().min(0).max(50).optional(),
  suites: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  parkingSpaces: z.number().int().min(0).max(20).optional(),
  floor: z.string().optional(),
  totalFloors: z.number().int().min(1).max(200).optional(),
  elevator: z.boolean().default(false),
  furnished: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  
  // Características de terrenos
  topography: z.enum(['flat', 'sloped', 'irregular']).optional(),
  soilType: z.enum(['clay', 'sand', 'rock', 'mixed']).optional(),
  vegetation: z.enum(['none', 'grass', 'trees', 'forest']).optional(),
  waterAccess: z.boolean().default(false),
  electricityAccess: z.boolean().default(false),
  sewerAccess: z.boolean().default(false),
  gasAccess: z.boolean().default(false),
  internetAccess: z.boolean().default(false),
  zoning: z.enum(['residential', 'commercial', 'industrial', 'mixed']).optional(),
  buildingCoefficient: z.number().min(0).max(10).optional(),
  occupancyRate: z.number().min(0).max(1).optional(),
  setbackFront: z.number().nonnegative().optional(),
  setbackSide: z.number().nonnegative().optional(),
  setbackRear: z.number().nonnegative().optional(),
  maxHeight: z.number().nonnegative().optional(),
  accessType: z.enum(['paved', 'dirt', 'cobblestone']).optional(),
  
  // Características de empreendimentos
  totalUnits: z.number().int().nonnegative().optional(),
  availableUnits: z.number().int().nonnegative().optional(),
  soldUnits: z.number().int().nonnegative().optional(),
  reservedUnits: z.number().int().nonnegative().optional(),
  unitsPerFloor: z.number().int().nonnegative().optional(),
  elevators: z.number().int().nonnegative().optional(),
  commonArea: z.number().nonnegative().optional(),
  constructionProgress: z.number().min(0).max(100).optional(),
  
  // Cronograma
  timeline: z.object({
    launchDate: z.string().datetime().optional(),
    constructionStart: z.string().datetime().optional(),
    expectedCompletion: z.string().datetime().optional(),
    deliveryDate: z.string().datetime().optional()
  }).optional(),
  
  // Construtora/Incorporadora
  developer: z.object({
    name: z.string(),
    cnpj: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional()
  }).optional(),
  
  // Campos específicos para empreendimentos
  construtora: z.string().optional(),
  previsaoEntrega: z.string().optional(),
  unidadesDisponiveis: z.number().int().nonnegative().optional(),
  plantas: z.array(z.object({
    id: z.string().optional(),
    area: z.number().positive(),
    precoPorM2: z.number().positive(),
    descricao: z.string().optional()
  })).optional(),
  
  // Campos específicos para terrenos
  frente: z.number().nonnegative().optional(),
  tipoSolo: z.enum(['plano', 'inclinado', 'irregular']).optional(),
  zoneamento: z.string().optional(),
  
  // Localização
  address: z.object({
    street: z.string().min(1, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().min(1, 'CEP é obrigatório'),
    country: z.string().default('Brasil')
  }),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  
  // Valores
  value: z.number().nonnegative('Valor não pode ser negativo'),
  salePrice: z.number().nonnegative().optional(),
  rentPrice: z.number().nonnegative().optional(),
  pricePerSquareMeter: z.number().nonnegative().optional(),
  condominiumFee: z.number().nonnegative().optional(),
  iptuValue: z.number().nonnegative().optional(),
  ituValue: z.number().nonnegative().optional(),
  totalCost: z.number().nonnegative().optional(),
  
  // Características adicionais
  sunPosition: z.enum(['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest']).optional(),
  constructionYear: z.string().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 10).optional(),
  buildingName: z.string().max(200).optional(),
  
  // Comodidades
  amenities: z.record(z.string(), z.boolean()).optional(),
  condominiumAmenities: z.array(z.string()).optional(),
  nearbyAmenities: z.array(z.string()).optional(),
  
  // Documentação
  hasDocumentation: z.boolean().default(false),
  registrationNumber: z.string().optional(),
  
  // Negociação
  acceptsFinancing: z.boolean().default(false),
  acceptsExchange: z.boolean().default(false),
  exclusiveProperty: z.boolean().default(false),
  highlightProperty: z.boolean().default(false),
  
  // Mídia
  images: z.array(z.string()).default([]),
  avatarUrl: z.string().optional(),
  
  // Agente responsável
  agent: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().optional()
  }).optional(),
  
  // Proprietário
  owner: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    document: z.string().optional(),
    avatarUrl: z.string().optional()
  }).optional(),
  
  // Datas
  availableFrom: z.string().datetime().optional(),
  
  // Relacionamentos
  realEstateId: z.string().min(1, 'ID da imobiliária é obrigatório'),
  ownerId: z.string().min(1, 'ID do proprietário é obrigatório').optional()
});

// Schema de validação para atualização de produto
const updateProductSchema = createProductSchema.partial().omit({ realEstateId: true });

// Schema de validação para filtros de busca
const searchFiltersSchema = z.object({
  type: z.enum(['imovel', 'terreno', 'empreendimento']).optional(),
  status: z.enum(['available', 'sold', 'rented', 'reserved', 'inactive']).optional(),
  condition: z.enum(['new', 'used', 'under_construction', 'to_renovate', 'ready_to_build', 'with_project', 'clean']).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
  minValue: z.number().nonnegative().optional(),
  maxValue: z.number().nonnegative().optional(),
  minArea: z.number().nonnegative().optional(),
  maxArea: z.number().nonnegative().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  parkingSpaces: z.number().int().nonnegative().optional(),
  furnished: z.boolean().optional(),
  elevator: z.boolean().optional(),
  acceptsFinancing: z.boolean().optional(),
  hasDocumentation: z.boolean().optional(),
  zoning: z.enum(['residential', 'commercial', 'industrial', 'mixed']).optional(),
  waterAccess: z.boolean().optional(),
  electricityAccess: z.boolean().optional(),
  sewerAccess: z.boolean().optional(),
  totalUnits: z.number().int().nonnegative().optional(),
  constructionProgress: z.number().min(0).max(100).optional()
});

export class ProductController {
  /**
   * Criar um novo produto
   */
  static createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validar dados de entrada
    const validatedData = createProductSchema.parse(req.body);
    
    // Converter datas do timeline se fornecidas
    if (validatedData.timeline) {
      const timeline: any = {};
      if (validatedData.timeline.launchDate) {
        timeline.launchDate = new Date(validatedData.timeline.launchDate);
      }
      if (validatedData.timeline.constructionStart) {
        timeline.constructionStart = new Date(validatedData.timeline.constructionStart);
      }
      if (validatedData.timeline.expectedCompletion) {
        timeline.expectedCompletion = new Date(validatedData.timeline.expectedCompletion);
      }
      if (validatedData.timeline.deliveryDate) {
        timeline.deliveryDate = new Date(validatedData.timeline.deliveryDate);
      }
      validatedData.timeline = timeline;
    }
    
    // Converter availableFrom se fornecida
    if (validatedData.availableFrom) {
      (validatedData as any).availableFrom = new Date(validatedData.availableFrom);
    }
    
    // Definir ownerId padrão se não fornecido
    if (!validatedData.ownerId) {
      validatedData.ownerId = validatedData.realEstateId;
    }
    
    // Converter IDs para ObjectId
    const productData: any = {
      ...validatedData,
      realEstateId: new mongoose.Types.ObjectId(validatedData.realEstateId),
      ownerId: new mongoose.Types.ObjectId(validatedData.ownerId)
    };
    
    // Criar produto
    const product = new ProductModel(productData);
    await product.save();
    
    const response: ApiResponse<ProductResponse> = {
      success: true,
      message: 'Produto criado com sucesso',
      data: product.toProductResponse()
    };
    
    return res.status(201).json(response);
  });
  
  /**
   * Listar produtos com filtros e paginação
   */
  static getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Validar filtros
    const filters = searchFiltersSchema.parse(req.query);
    
    // Construir query de busca
    const query: any = { isActive: true };
    
    // Filtrar por imobiliária se fornecido
    if (req.query.real_estate_id) {
      if (!mongoose.Types.ObjectId.isValid(req.query.real_estate_id as string)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'ID da imobiliária inválido'
        };
        return res.status(400).json(response);
      }
      query.realEstateId = new mongoose.Types.ObjectId(req.query.real_estate_id as string);
    }
    
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.condition) query.condition = filters.condition;
    if (filters.city) query['address.city'] = new RegExp(filters.city, 'i');
    if (filters.state) query['address.state'] = filters.state.toUpperCase();
    if (filters.neighborhood) query['address.neighborhood'] = new RegExp(filters.neighborhood, 'i');
    
    // Filtros de valor
    if (filters.minValue || filters.maxValue) {
      query.value = {};
      if (filters.minValue) query.value.$gte = filters.minValue;
      if (filters.maxValue) query.value.$lte = filters.maxValue;
    }
    
    // Filtros de área
    if (filters.minArea || filters.maxArea) {
      query.area = {};
      if (filters.minArea) query.area.$gte = filters.minArea;
      if (filters.maxArea) query.area.$lte = filters.maxArea;
    }
    
    // Filtros específicos de imóveis
    if (filters.bedrooms !== undefined) query.bedrooms = filters.bedrooms;
    if (filters.bathrooms !== undefined) query.bathrooms = filters.bathrooms;
    if (filters.parkingSpaces !== undefined) query.parkingSpaces = filters.parkingSpaces;
    if (filters.furnished !== undefined) query.furnished = filters.furnished;
    if (filters.elevator !== undefined) query.elevator = filters.elevator;
    
    // Filtros de negociação
    if (filters.acceptsFinancing !== undefined) query.acceptsFinancing = filters.acceptsFinancing;
    if (filters.hasDocumentation !== undefined) query.hasDocumentation = filters.hasDocumentation;
    
    // Filtros específicos de terrenos
    if (filters.zoning) query.zoning = filters.zoning;
    if (filters.waterAccess !== undefined) query.waterAccess = filters.waterAccess;
    if (filters.electricityAccess !== undefined) query.electricityAccess = filters.electricityAccess;
    if (filters.sewerAccess !== undefined) query.sewerAccess = filters.sewerAccess;
    
    // Filtros específicos de empreendimentos
    if (filters.totalUnits !== undefined) query.totalUnits = filters.totalUnits;
    if (filters.constructionProgress !== undefined) query.constructionProgress = filters.constructionProgress;
    
    // Buscar produtos
    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    const response: PaginatedResponse<ProductResponse> = {
      success: true,
      message: 'Produtos encontrados com sucesso',
      data: products.map(product => {
        const productDoc = new ProductModel(product);
        return productDoc.toProductResponse();
      }),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
    
    return res.json(response);
  });
  
  /**
   * Obter produto por ID
   */
  static getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'ID do produto inválido'
      };
      return res.status(400).json(response);
    }
    
    const product = await ProductModel.findOne({ 
      _id: id, 
      isActive: true 
    });
    
    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Produto não encontrado'
      };
      return res.status(404).json(response);
    }
    
    // Incrementar visualizações
    product.viewsCount = (product.viewsCount || 0) + 1;
    await product.save();
    
    const response: ApiResponse<ProductResponse> = {
      success: true,
      message: 'Produto encontrado com sucesso',
      data: product.toProductResponse()
    };
    
    return res.json(response);
  });
  
  /**
   * Atualizar produto
   */
  static updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'ID do produto inválido'
      };
      return res.status(400).json(response);
    }
    
    // Validar dados de entrada
    const validatedData = updateProductSchema.parse(req.body);
    
    // Converter datas do timeline se fornecidas
    if (validatedData.timeline) {
      const timeline: any = {};
      if (validatedData.timeline.launchDate) {
        timeline.launchDate = new Date(validatedData.timeline.launchDate);
      }
      if (validatedData.timeline.constructionStart) {
        timeline.constructionStart = new Date(validatedData.timeline.constructionStart);
      }
      if (validatedData.timeline.expectedCompletion) {
        timeline.expectedCompletion = new Date(validatedData.timeline.expectedCompletion);
      }
      if (validatedData.timeline.deliveryDate) {
        timeline.deliveryDate = new Date(validatedData.timeline.deliveryDate);
      }
      validatedData.timeline = timeline;
    }
    
    // Converter availableFrom se fornecida
    if (validatedData.availableFrom) {
      (validatedData as any).availableFrom = new Date(validatedData.availableFrom);
    }
    
    // Converter ownerId se fornecido
    if (validatedData.ownerId) {
      (validatedData as any).ownerId = new mongoose.Types.ObjectId(validatedData.ownerId);
    }
    
    const product = await ProductModel.findOneAndUpdate(
      { _id: id, isActive: true },
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Produto não encontrado'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<ProductResponse> = {
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product.toProductResponse()
    };
    
    return res.json(response);
  });
  
  /**
   * Deletar produto (soft delete)
   */
  static deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'ID do produto inválido'
      };
      return res.status(400).json(response);
    }
    
    const product = await ProductModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Produto não encontrado'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Produto deletado com sucesso'
    };
    
    return res.json(response);
  });
  
  /**
   * Incrementar favoritos
   */
  static addToFavorites = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'ID do produto inválido'
      };
      return res.status(400).json(response);
    }
    
    const product = await ProductModel.findOne({ 
      _id: id, 
      isActive: true 
    });
    
    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Produto não encontrado'
      };
      return res.status(404).json(response);
    }
    
    product.favoritesCount = (product.favoritesCount || 0) + 1;
    await product.save();
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Produto adicionado aos favoritos'
    };
    
    return res.json(response);
  });
  
  /**
   * Incrementar contatos
   */
  static incrementContacts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'ID do produto inválido'
      };
      return res.status(400).json(response);
    }
    
    const product = await ProductModel.findOne({ 
      _id: id, 
      isActive: true 
    });
    
    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Produto não encontrado'
      };
      return res.status(404).json(response);
    }
    
    product.contactsCount = (product.contactsCount || 0) + 1;
    await product.save();
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Contato registrado com sucesso'
    };
    
    return res.json(response);
  });
  
  /**
   * Obter estatísticas de produtos
   */
  static getProductStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await ProductModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalImoveis: {
            $sum: { $cond: [{ $eq: ['$type', 'imovel'] }, 1, 0] }
          },
          totalTerrenos: {
            $sum: { $cond: [{ $eq: ['$type', 'terreno'] }, 1, 0] }
          },
          totalEmpreendimentos: {
            $sum: { $cond: [{ $eq: ['$type', 'empreendimento'] }, 1, 0] }
          },
          availableProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          soldProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
          },
          rentedProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] }
          },
          averageValue: { $avg: '$value' },
          totalViews: { $sum: '$viewsCount' },
          totalFavorites: { $sum: '$favoritesCount' },
          totalContacts: { $sum: '$contactsCount' }
        }
      }
    ]);
    
    const response: ApiResponse<any> = {
      success: true,
      message: 'Estatísticas obtidas com sucesso',
      data: stats[0] || {
        totalProducts: 0,
        totalImoveis: 0,
        totalTerrenos: 0,
        totalEmpreendimentos: 0,
        availableProducts: 0,
        soldProducts: 0,
        rentedProducts: 0,
        averageValue: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalContacts: 0
      }
    };
    
    return res.json(response);
  });
}

export default ProductController;