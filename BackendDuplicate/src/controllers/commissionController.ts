import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CommissionModel, ICommission, toCommission, TipoComissao, TipoProduto, TipoParticipante, StatusComissao } from '../models/Commission';
import { successResponse, errorResponse } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';
import { PaginatedResponse } from '../types';

// Schema de validação para participante de comissão
const participanteComissaoSchema = z.object({
  tipo: z.enum(['imobiliaria', 'corretor_principal', 'corretor_suporte', 'coordenador', 'grupo', 'captador']),
  percentual: z.number().min(0).max(100),
  ativo: z.boolean().default(true),
  fixo: z.boolean().default(false),
  obrigatorio: z.boolean().default(false),
  grupoId: z.string().optional(),
  percentualMinimo: z.number().min(0).max(100).optional(),
  percentualMaximo: z.number().min(0).max(100).optional()
});

// Schema de validação para criação de comissão
const createCommissionSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome não pode ter mais de 100 caracteres'),
  descricao: z.string().max(500, 'Descrição não pode ter mais de 500 caracteres').optional(),
  tipo: z.enum(['total_imobiliaria', 'distribuicao_interna']),
  tipoProduto: z.enum(['imovel', 'terreno', 'empreendimento']).optional(),
  percentualTotal: z.number().min(0).max(100).optional(),
  comissaoTotalId: z.string().optional(),
  participantes: z.array(participanteComissaoSchema).optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
  realEstateId: z.string().min(1, 'ID da imobiliária é obrigatório'),
  empreendimentoId: z.string().optional(),
  produtoId: z.string().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional()
}).refine((data) => {
  // Validação condicional para comissão total
  if (data.tipo === 'total_imobiliaria') {
    return data.tipoProduto && data.percentualTotal !== undefined;
  }
  // Validação condicional para distribuição interna
  if (data.tipo === 'distribuicao_interna') {
    return data.comissaoTotalId && data.participantes && data.participantes.length > 0;
  }
  return true;
}, {
  message: 'Dados obrigatórios não fornecidos para o tipo de comissão'
}).refine((data) => {
  // Validação de soma de percentuais para distribuição interna
  if (data.tipo === 'distribuicao_interna' && data.participantes) {
    const totalPercentual = data.participantes.reduce((sum, p) => sum + p.percentual, 0);
    return totalPercentual <= 100;
  }
  return true;
}, {
  message: 'A soma dos percentuais dos participantes não pode exceder 100%'
});

// Schema de validação para atualização de comissão
const updateCommissionSchema = createCommissionSchema.partial().omit({ realEstateId: true });

// Schema de validação para query de listagem
const listCommissionsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'nome', 'percentualTotal']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  tipo: z.enum(['total_imobiliaria', 'distribuicao_interna']).optional(),
  tipo_produto: z.enum(['imovel', 'terreno', 'empreendimento']).optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  search: z.string().optional()
});

// Schema de validação para busca de comissões
const searchCommissionsQuerySchema = z.object({
  real_estate_id: z.string().min(1, 'ID da imobiliária é obrigatório'),
  search: z.string().optional(),
  tipo: z.enum(['total_imobiliaria', 'distribuicao_interna']).optional(),
  tipo_produto: z.enum(['imovel', 'terreno', 'empreendimento']).optional(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(),
  empreendimento_id: z.string().optional(),
  page: z.string().regex(/^\d+$/, 'Página deve ser um número').optional(),
  limit: z.string().regex(/^\d+$/, 'Limite deve ser um número').optional(),
  sort_by: z.enum(['createdAt', 'updatedAt', 'nome', 'percentualTotal']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

class CommissionController {
  // Criar nova comissão
  async createCommission(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCommissionSchema.parse(req.body);
      
      // Verificar se já existe uma comissão com o mesmo nome para a imobiliária
      const existingCommission = await CommissionModel.findOne({
        nome: validatedData.nome,
        realEstateId: validatedData.realEstateId,
        status: { $ne: 'inativo' }
      });
      
      if (existingCommission) {
        throw new AppError('Já existe uma comissão ativa com este nome', 400);
      }
      
      // Se for distribuição interna, verificar se a comissão total existe
      if (validatedData.tipo === 'distribuicao_interna' && validatedData.comissaoTotalId) {
        const comissaoTotal = await CommissionModel.findById(validatedData.comissaoTotalId);
        if (!comissaoTotal || comissaoTotal.tipo !== 'total_imobiliaria') {
          throw new AppError('Comissão total não encontrada ou inválida', 400);
        }
      }
      
      const commissionData: any = {
        ...validatedData,
        dataInicio: validatedData.dataInicio ? new Date(validatedData.dataInicio) : undefined,
        dataFim: validatedData.dataFim ? new Date(validatedData.dataFim) : undefined
      };
      
      const commission = new CommissionModel(commissionData);
      await commission.save();
      
      res.status(201).json(
        successResponse('Comissão criada com sucesso', commission.toCommissionResponse())
      );
    } catch (error) {
      next(error);
    }
  }
  
  // Listar comissões com paginação
  async listCommissions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listCommissionsQuerySchema.parse(req.query);
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;
      const sortBy = query.sort_by || 'createdAt';
      const sortOrder = query.sort_order === 'asc' ? 1 : -1;
      
      // Construir filtros
      const filters: any = {
        realEstateId: query.real_estate_id
      };
      
      if (query.tipo) {
        filters.tipo = query.tipo;
      }
      
      if (query.tipo_produto) {
        filters.tipoProduto = query.tipo_produto;
      }
      
      if (query.status) {
        filters.status = query.status;
      }
      
      if (query.search) {
        filters.$or = [
          { nome: { $regex: query.search, $options: 'i' } },
          { descricao: { $regex: query.search, $options: 'i' } }
        ];
      }
      
      const commissions = await CommissionModel
        .find(filters)
        .populate('comissaoTotalId', 'nome percentualTotal')
        .populate('empreendimentoId', 'name')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await CommissionModel.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);
      
      const response: PaginatedResponse<any> = {
        data: commissions.map(commission => toCommission(commission)),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
      
      res.status(200).json(successResponse('Comissões listadas com sucesso', response));
    } catch (error) {
      next(error);
    }
  }
  
  // Buscar comissão por ID
  async getCommissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const commission = await CommissionModel
        .findById(id)
        .populate('comissaoTotalId', 'nome percentualTotal')
        .populate('empreendimentoId', 'name')
        .lean();
      
      if (!commission) {
        throw new AppError('Comissão não encontrada', 404);
      }
      
      res.status(200).json(
        successResponse('Comissão encontrada', toCommission(commission))
      );
    } catch (error) {
      next(error);
    }
  }
  
  // Atualizar comissão
  async updateCommission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateCommissionSchema.parse(req.body);
      
      const commission = await CommissionModel.findById(id);
      if (!commission) {
        throw new AppError('Comissão não encontrada', 404);
      }
      
      // Verificar se o nome já existe (exceto para a própria comissão)
      if (validatedData.nome) {
        const existingCommission = await CommissionModel.findOne({
          nome: validatedData.nome,
          realEstateId: commission.realEstateId,
          _id: { $ne: id },
          status: { $ne: 'inativo' }
        });
        
        if (existingCommission) {
          throw new AppError('Já existe uma comissão ativa com este nome', 400);
        }
      }
      
      const updateData: any = {
        ...validatedData,
        dataInicio: validatedData.dataInicio ? new Date(validatedData.dataInicio) : undefined,
        dataFim: validatedData.dataFim ? new Date(validatedData.dataFim) : undefined
      };
      
      const updatedCommission = await CommissionModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('comissaoTotalId', 'nome percentualTotal')
        .populate('empreendimentoId', 'name')
        .lean();
      
      res.status(200).json(
        successResponse('Comissão atualizada com sucesso', toCommission(updatedCommission))
      );
    } catch (error) {
      next(error);
    }
  }
  
  // Deletar comissão (soft delete)
  async deleteCommission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const commission = await CommissionModel.findById(id);
      if (!commission) {
        throw new AppError('Comissão não encontrada', 404);
      }
      
      // Verificar se existem distribuições internas vinculadas
      if (commission.tipo === 'total_imobiliaria') {
        const distribuicoes = await CommissionModel.countDocuments({
          comissaoTotalId: id,
          status: { $ne: 'inativo' }
        });
        
        if (distribuicoes > 0) {
          throw new AppError('Não é possível excluir uma comissão total que possui distribuições internas ativas', 400);
        }
      }
      
      // Soft delete
      await CommissionModel.findByIdAndUpdate(id, { status: 'inativo' });
      
      res.status(200).json(successResponse('Comissão excluída com sucesso'));
    } catch (error) {
      next(error);
    }
  }
  
  // Buscar comissões com filtros
  async searchCommissions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = searchCommissionsQuerySchema.parse(req.query);
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;
      const sortBy = query.sort_by || 'createdAt';
      const sortOrder = query.sort_order === 'asc' ? 1 : -1;
      
      // Construir filtros
      const filters: any = {
        realEstateId: query.real_estate_id
      };
      
      if (query.tipo) {
        filters.tipo = query.tipo;
      }
      
      if (query.tipo_produto) {
        filters.tipoProduto = query.tipo_produto;
      }
      
      if (query.status) {
        filters.status = query.status;
      }
      
      if (query.empreendimento_id) {
        filters.empreendimentoId = query.empreendimento_id;
      }
      
      if (query.search) {
        filters.$or = [
          { nome: { $regex: query.search, $options: 'i' } },
          { descricao: { $regex: query.search, $options: 'i' } }
        ];
      }
      
      const commissions = await CommissionModel
        .find(filters)
        .populate('comissaoTotalId', 'nome percentualTotal')
        .populate('empreendimentoId', 'name')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await CommissionModel.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);
      
      const response: PaginatedResponse<any> = {
        data: commissions.map(commission => toCommission(commission)),
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
  
  // Obter comissões totais para dropdown
  async getComissoesTotais(req: Request, res: Response, next: NextFunction) {
    try {
      const { real_estate_id } = req.query;
      
      if (!real_estate_id) {
        throw new AppError('ID da imobiliária é obrigatório', 400);
      }
      
      const comissoesTotais = await CommissionModel
        .find({
          realEstateId: real_estate_id,
          tipo: 'total_imobiliaria',
          status: 'ativo'
        })
        .select('nome percentualTotal tipoProduto')
        .sort({ nome: 1 })
        .lean();
      
      res.status(200).json(
        successResponse('Comissões totais encontradas', comissoesTotais.map(c => toCommission(c)))
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new CommissionController();