import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BrokerModel, IBroker, toBroker } from '../models/Broker';
import { UserModel } from '../models/User';
import { successResponse, errorResponse } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';
import { PaginatedResponse } from '../types';

// Schema de validação para criação de corretor
const createBrokerSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  realEstateId: z.string().min(1, 'ID da imobiliária é obrigatório'),
  brokerGroupId: z.string().optional(),
  licenseNumber: z.string().min(1, 'Número da licença é obrigatório'),
  licenseState: z.string().length(2, 'Estado deve ter 2 caracteres'),
  licenseExpiryDate: z.string().datetime('Data de expiração inválida'),
  isManager: z.boolean().default(false),
  managerLevel: z.enum(['junior', 'senior', 'director']).optional(),
  hireDate: z.string().datetime('Data de contratação inválida'),
  commissionRate: z.number().min(0).max(100, 'Taxa de comissão deve estar entre 0 e 100'),
  baseSalary: z.number().min(0).optional(),
  salesTarget: z.number().min(0).optional(),
  territory: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional()
});

// Schema de validação para atualização de corretor
const updateBrokerSchema = createBrokerSchema.partial().omit({ userId: true, realEstateId: true });

// Schema de validação para query de listagem
const listBrokersQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'hireDate', 'licenseNumber']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'terminated']).optional(),
  is_manager: z.enum(['true', 'false']).optional(),
  search: z.string().optional()
});

// Schema de validação para busca de corretores
const searchBrokersQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  search: z.string().optional(),
  specialization: z.string().optional(),
  territory: z.string().optional(),
  is_manager: z.enum(['true', 'false']).optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'terminated']).optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'hireDate', 'licenseNumber']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

class BrokerController {
  // Listar corretores de uma imobiliária
  async getBrokersByRealEstate(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listBrokersQuerySchema.parse(req.query);
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;
      const sortBy = query.sort_by || 'createdAt';
      const sortOrder = query.sort_order === 'asc' ? 1 : -1;

      // Construir filtros
      const filters: any = {
        realEstateId: query.real_estate_id,
        isActive: true
      };

      if (query.status) {
        filters.employmentStatus = query.status;
      }

      if (query.is_manager) {
        filters.isManager = query.is_manager === 'true';
      }

      if (query.search) {
        filters.$or = [
          { licenseNumber: { $regex: query.search, $options: 'i' } },
          { 'territory': { $in: [new RegExp(query.search, 'i')] } },
          { 'specializations': { $in: [new RegExp(query.search, 'i')] } }
        ];
      }

      // Buscar corretores com população de dados do usuário
      const brokers = await BrokerModel
        .find(filters)
        .populate('userId', 'firstName lastName email phone avatarUrl')
        .populate('brokerGroupId', 'name groupType')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await BrokerModel.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<any> = {
        data: brokers.map(broker => ({
          ...toBroker(broker as IBroker),
          user: broker.userId,
          group: broker.brokerGroupId
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };

      res.status(200).json(successResponse('Corretores listados com sucesso', response));
    } catch (error) {
      next(error);
    }
  }

  // Buscar corretor por ID
  async getBrokerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const broker = await BrokerModel
        .findById(id)
        .populate('userId', 'firstName lastName email phone avatarUrl')
        .populate('brokerGroupId', 'name groupType')
        .populate('realEstateId', 'name')
        .lean();

      if (!broker) {
        throw new AppError('Corretor não encontrado', 404, 'BROKER_NOT_FOUND');
      }

      const response = {
        ...toBroker(broker as IBroker),
        user: broker.userId,
        group: broker.brokerGroupId,
        realEstate: broker.realEstateId
      };

      res.status(200).json(successResponse('Corretor encontrado', response));
    } catch (error) {
      next(error);
    }
  }

  // Criar novo corretor
  async createBroker(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createBrokerSchema.parse(req.body);

      // Verificar se o usuário existe
      const user = await UserModel.findById(data.userId);
      if (!user) {
        throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
      }

      // Verificar se o usuário já é um corretor
      const existingBroker = await BrokerModel.findOne({ userId: data.userId });
      if (existingBroker) {
        throw new AppError('Usuário já é um corretor', 400, 'USER_ALREADY_BROKER');
      }

      // Verificar se o número da licença já existe
      const existingLicense = await BrokerModel.findOne({ licenseNumber: data.licenseNumber });
      if (existingLicense) {
        throw new AppError('Número de licença já existe', 400, 'LICENSE_ALREADY_EXISTS');
      }

      const broker = new BrokerModel({
        ...data,
        licenseExpiryDate: new Date(data.licenseExpiryDate),
        hireDate: new Date(data.hireDate),
        employmentStatus: 'active'
      });

      await broker.save();

      const populatedBroker = await BrokerModel
        .findById(broker._id)
        .populate('userId', 'firstName lastName email phone avatarUrl')
        .populate('brokerGroupId', 'name groupType')
        .lean();

      const response = {
        ...toBroker(populatedBroker as IBroker),
        user: populatedBroker?.userId,
        group: populatedBroker?.brokerGroupId
      };

      res.status(201).json(successResponse('Corretor criado com sucesso', response));
    } catch (error) {
      next(error);
    }
  }

  // Atualizar corretor
  async updateBroker(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateBrokerSchema.parse(req.body);

      const broker = await BrokerModel.findById(id);
      if (!broker) {
        throw new AppError('Corretor não encontrado', 404, 'BROKER_NOT_FOUND');
      }

      // Se estiver atualizando o número da licença, verificar se já existe
      if (data.licenseNumber && data.licenseNumber !== broker.licenseNumber) {
        const existingLicense = await BrokerModel.findOne({ 
          licenseNumber: data.licenseNumber,
          _id: { $ne: id }
        });
        if (existingLicense) {
          throw new AppError('Número de licença já existe', 400, 'LICENSE_ALREADY_EXISTS');
        }
      }

      // Converter datas se fornecidas
      const updateData: any = { ...data };
      if (data.licenseExpiryDate) {
        updateData.licenseExpiryDate = new Date(data.licenseExpiryDate);
      }
      if (data.hireDate) {
        updateData.hireDate = new Date(data.hireDate);
      }

      const updatedBroker = await BrokerModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('userId', 'firstName lastName email phone avatarUrl')
        .populate('brokerGroupId', 'name groupType')
        .lean();

      const response = {
        ...toBroker(updatedBroker as IBroker),
        user: updatedBroker?.userId,
        group: updatedBroker?.brokerGroupId
      };

      res.status(200).json(successResponse('Corretor atualizado com sucesso', response));
    } catch (error) {
      next(error);
    }
  }

  // Deletar corretor (soft delete)
  async deleteBroker(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const broker = await BrokerModel.findById(id);
      if (!broker) {
        throw new AppError('Corretor não encontrado', 404, 'BROKER_NOT_FOUND');
      }

      await BrokerModel.findByIdAndUpdate(id, {
        isActive: false,
        employmentStatus: 'terminated',
        terminationDate: new Date()
      });

      res.status(200).json(successResponse('Corretor removido com sucesso'));
    } catch (error) {
      next(error);
    }
  }

  // Buscar corretores com filtros
  async searchBrokers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = searchBrokersQuerySchema.parse(req.query);
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;
      const sortBy = query.sort_by || 'createdAt';
      const sortOrder = query.sort_order === 'asc' ? 1 : -1;

      // Construir filtros
      const filters: any = {
        realEstateId: query.real_estate_id,
        isActive: true
      };

      if (query.status) {
        filters.employmentStatus = query.status;
      }

      if (query.is_manager) {
        filters.isManager = query.is_manager === 'true';
      }

      if (query.specialization) {
        filters.specializations = { $in: [query.specialization] };
      }

      if (query.territory) {
        filters.territory = { $in: [query.territory] };
      }

      if (query.search) {
        filters.$or = [
          { licenseNumber: { $regex: query.search, $options: 'i' } },
          { 'territory': { $in: [new RegExp(query.search, 'i')] } },
          { 'specializations': { $in: [new RegExp(query.search, 'i')] } }
        ];
      }

      const brokers = await BrokerModel
        .find(filters)
        .populate('userId', 'firstName lastName email phone avatarUrl')
        .populate('brokerGroupId', 'name groupType')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await BrokerModel.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<any> = {
        data: brokers.map(broker => ({
          ...toBroker(broker as IBroker),
          user: broker.userId,
          group: broker.brokerGroupId
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };

      res.status(200).json(successResponse('Busca realizada com sucesso', response));
    } catch (error) {
      next(error);
    }
  }
}

export default new BrokerController();