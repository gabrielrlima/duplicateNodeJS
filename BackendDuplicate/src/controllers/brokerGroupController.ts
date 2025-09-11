import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BrokerGroupModel, IBrokerGroup, toBrokerGroup } from '../models/BrokerGroup';
import { successResponse, errorResponse } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';
import { PaginatedResponse } from '../types';

// Schema de validação para query de listagem
const listBrokerGroupsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  group_type: z.enum(['sales', 'rental', 'commercial', 'luxury', 'investment', 'mixed']).optional(),
  is_active: z.enum(['true', 'false']).optional(),
  search: z.string().optional()
});

// Schema de validação para busca de grupos
const searchBrokerGroupsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  search: z.string().optional(),
  group_type: z.enum(['sales', 'rental', 'commercial', 'luxury', 'investment', 'mixed']).optional(),
  territory: z.string().optional(),
  is_active: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

// Schema de validação para criação de grupo
const createBrokerGroupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  realEstateId: z.string().min(1, 'ID da imobiliária é obrigatório'),
  managerId: z.string().optional(),
  groupType: z.enum(['sales', 'rental', 'commercial', 'luxury', 'investment', 'mixed']),
  territory: z.array(z.string()).optional(),
  targetMarket: z.array(z.string()).optional(),
  commissionStructure: z.object({
    baseRate: z.number().min(0).max(100),
    bonusThresholds: z.array(z.object({
      threshold: z.number().min(0),
      bonusRate: z.number().min(0)
    })).optional(),
    teamBonusRate: z.number().min(0).optional()
  }).optional()
});

// Schema de validação para atualização de grupo
const updateBrokerGroupSchema = createBrokerGroupSchema.partial();

class BrokerGroupController {
  // Listar grupos de uma imobiliária
  async getBrokerGroupsByRealEstate(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listBrokerGroupsQuerySchema.parse(req.query);
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;
      const sortBy = query.sort_by || 'createdAt';
      const sortOrder = query.sort_order === 'asc' ? 1 : -1;

      // Construir filtros
      const filters: any = {
        realEstateId: query.real_estate_id
      };

      if (query.group_type) {
        filters.groupType = query.group_type;
      }

      if (query.is_active) {
        filters.isActive = query.is_active === 'true';
      }

      if (query.search) {
        filters.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { 'territory': { $in: [new RegExp(query.search, 'i')] } }
        ];
      }

      // Buscar grupos com população de dados do gerente
      const groups = await BrokerGroupModel
        .find(filters)
        .populate('managerId', 'userId')
        .populate({
          path: 'managerId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await BrokerGroupModel.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<any> = {
        data: groups.map(group => ({
          ...toBrokerGroup(group as IBrokerGroup),
          manager: group.managerId
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

      res.status(200).json(successResponse('Grupos listados com sucesso', response));
    } catch (error) {
      next(error);
    }
  }

  // Buscar grupo por ID
  async getBrokerGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const group = await BrokerGroupModel
        .findById(id)
        .populate('managerId', 'userId')
        .populate({
          path: 'managerId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .populate('realEstateId', 'name')
        .lean();

      if (!group) {
        throw new AppError('Grupo não encontrado', 404, 'GROUP_NOT_FOUND');
      }

      const response = {
        ...toBrokerGroup(group as IBrokerGroup),
        manager: group.managerId,
        realEstate: group.realEstateId
      };

      res.status(200).json(successResponse('Grupo encontrado', response));
    } catch (error) {
      next(error);
    }
  }

  // Criar novo grupo
  async createBrokerGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createBrokerGroupSchema.parse(req.body);

      // Verificar se já existe um grupo com o mesmo nome na imobiliária
      const existingGroup = await BrokerGroupModel.findOne({
        name: data.name,
        realEstateId: data.realEstateId
      });
      
      if (existingGroup) {
        throw new AppError('Já existe um grupo com este nome nesta imobiliária', 400, 'GROUP_NAME_EXISTS');
      }

      const group = new BrokerGroupModel({
        ...data,
        isActive: true,
        permissions: {
          canCreateListings: true,
          canEditListings: true,
          canDeleteListings: false,
          canManageClients: true,
          canViewReports: false,
          canManageTeam: false,
          canApproveContracts: false,
          canAccessFinancials: false,
          canEditGroupSettings: false,
          canInviteMembers: false
        }
      });

      await group.save();

      const populatedGroup = await BrokerGroupModel
        .findById(group._id)
        .populate('managerId', 'userId')
        .populate({
          path: 'managerId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .lean();

      const response = {
        ...toBrokerGroup(populatedGroup as IBrokerGroup),
        manager: populatedGroup?.managerId
      };

      res.status(201).json(successResponse('Grupo criado com sucesso', response));
    } catch (error) {
      next(error);
    }
  }

  // Atualizar grupo
  async updateBrokerGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateBrokerGroupSchema.parse(req.body);

      // Verificar se o grupo existe
      const existingGroup = await BrokerGroupModel.findById(id);
      if (!existingGroup) {
        throw new AppError('Grupo não encontrado', 404, 'GROUP_NOT_FOUND');
      }

      // Se está alterando o nome, verificar se não existe outro grupo com o mesmo nome
      if (data.name && data.name !== existingGroup.name) {
        const duplicateGroup = await BrokerGroupModel.findOne({
          name: data.name,
          realEstateId: existingGroup.realEstateId,
          _id: { $ne: id }
        });
        
        if (duplicateGroup) {
          throw new AppError('Já existe um grupo com este nome nesta imobiliária', 400, 'GROUP_NAME_EXISTS');
        }
      }

      const updatedGroup = await BrokerGroupModel
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('managerId', 'userId')
        .populate({
          path: 'managerId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .lean();

      const response = {
        ...toBrokerGroup(updatedGroup as IBrokerGroup),
        manager: updatedGroup?.managerId
      };

      res.status(200).json(successResponse('Grupo atualizado com sucesso', response));
    } catch (error) {
      next(error);
    }
  }

  // Deletar grupo (soft delete)
  async deleteBrokerGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const group = await BrokerGroupModel.findById(id);
      if (!group) {
        throw new AppError('Grupo não encontrado', 404, 'GROUP_NOT_FOUND');
      }

      // Soft delete - marcar como inativo
      await BrokerGroupModel.findByIdAndUpdate(id, { isActive: false });

      res.status(200).json(successResponse('Grupo deletado com sucesso'));
    } catch (error) {
      next(error);
    }
  }

  // Buscar grupos com filtros
  async searchBrokerGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const query = searchBrokerGroupsQuerySchema.parse(req.query);
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;
      const sortBy = query.sort_by || 'createdAt';
      const sortOrder = query.sort_order === 'asc' ? 1 : -1;

      // Construir filtros
      const filters: any = {
        realEstateId: query.real_estate_id
      };

      if (query.is_active) {
        filters.isActive = query.is_active === 'true';
      }

      if (query.group_type) {
        filters.groupType = query.group_type;
      }

      if (query.territory) {
        filters.territory = { $in: [query.territory] };
      }

      if (query.search) {
        filters.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { 'territory': { $in: [new RegExp(query.search, 'i')] } }
        ];
      }

      const groups = await BrokerGroupModel
        .find(filters)
        .populate('managerId', 'userId')
        .populate({
          path: 'managerId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await BrokerGroupModel.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<any> = {
        data: groups.map(group => ({
          ...toBrokerGroup(group as IBrokerGroup),
          manager: group.managerId
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

      res.status(200).json(successResponse('Grupos encontrados', response));
    } catch (error) {
      next(error);
    }
  }
}

export default new BrokerGroupController();