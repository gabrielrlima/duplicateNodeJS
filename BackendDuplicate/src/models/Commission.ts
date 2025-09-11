import { Schema, model, Document } from 'mongoose';

// Tipos para estrutura hierárquica de comissões
export type TipoComissao = 'total_imobiliaria' | 'distribuicao_interna';
export type TipoProduto = 'imovel' | 'terreno' | 'empreendimento';
export type TipoParticipante =
  | 'imobiliaria'
  | 'corretor_principal'
  | 'corretor_suporte'
  | 'coordenador'
  | 'grupo'
  | 'captador';
export type StatusComissao = 'ativo' | 'inativo' | 'pendente';

// Interface para participante de comissão
export interface IParticipanteComissao {
  tipo: TipoParticipante;
  percentual: number; // % da comissão
  ativo: boolean; // Se está ativo no cálculo
  fixo: boolean; // Se é participante fixo ou variável
  obrigatorio: boolean; // Se é obrigatório ter esse participante
  grupoId?: string; // ID do grupo/equipe específico
  percentualMinimo?: number; // % mínimo garantido
  percentualMaximo?: number; // % máximo permitido
}

// Interface principal para comissão
export interface ICommission extends Document {
  nome: string;
  descricao?: string;
  tipo: TipoComissao;
  tipoProduto?: TipoProduto; // Para comissão total
  percentualTotal?: number; // % total que a imobiliária recebe (para comissão total)
  comissaoTotalId?: string; // Referência à comissão total (para distribuição interna)
  participantes?: IParticipanteComissao[]; // Lista de participantes (para distribuição interna)
  status: StatusComissao;
  realEstateId: string; // ID da imobiliária
  // Regras específicas opcionais
  empreendimentoId?: string; // Para regras específicas por empreendimento
  produtoId?: string; // Para regras específicas por produto individual
  // Período de validade
  dataInicio?: Date;
  dataFim?: Date;
  createdAt: Date;
  updatedAt: Date;
  toCommissionResponse(): CommissionResponse;
}

// Interface para resposta da API
export interface CommissionResponse {
  id: string;
  nome: string;
  descricao?: string;
  tipo: TipoComissao;
  tipoProduto?: TipoProduto;
  percentualTotal?: number;
  comissaoTotalId?: string;
  participantes?: IParticipanteComissao[];
  status: StatusComissao;
  realEstateId: string;
  empreendimentoId?: string;
  produtoId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema para participante de comissão
const participanteComissaoSchema = new Schema<IParticipanteComissao>({
  tipo: {
    type: String,
    enum: ['imobiliaria', 'corretor_principal', 'corretor_suporte', 'coordenador', 'grupo', 'captador'],
    required: [true, 'Tipo do participante é obrigatório']
  },
  percentual: {
    type: Number,
    required: [true, 'Percentual é obrigatório'],
    min: [0, 'Percentual não pode ser negativo'],
    max: [100, 'Percentual não pode ser maior que 100%']
  },
  ativo: {
    type: Boolean,
    default: true
  },
  fixo: {
    type: Boolean,
    default: false
  },
  obrigatorio: {
    type: Boolean,
    default: false
  },
  grupoId: {
    type: String,
    ref: 'BrokerGroup'
  },
  percentualMinimo: {
    type: Number,
    min: [0, 'Percentual mínimo não pode ser negativo'],
    max: [100, 'Percentual mínimo não pode ser maior que 100%']
  },
  percentualMaximo: {
    type: Number,
    min: [0, 'Percentual máximo não pode ser negativo'],
    max: [100, 'Percentual máximo não pode ser maior que 100%']
  }
}, { _id: false });

// Schema principal para comissão
const commissionSchema = new Schema<ICommission>({
  nome: {
    type: String,
    required: [true, 'Nome da comissão é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  tipo: {
    type: String,
    enum: ['total_imobiliaria', 'distribuicao_interna'],
    required: [true, 'Tipo da comissão é obrigatório']
  },
  tipoProduto: {
    type: String,
    enum: ['imovel', 'terreno', 'empreendimento'],
    required: function(this: ICommission) {
      return this.tipo === 'total_imobiliaria';
    }
  },
  percentualTotal: {
    type: Number,
    min: [0, 'Percentual total não pode ser negativo'],
    max: [100, 'Percentual total não pode ser maior que 100%'],
    required: function(this: ICommission) {
      return this.tipo === 'total_imobiliaria';
    }
  },
  comissaoTotalId: {
    type: String,
    ref: 'Commission',
    required: function(this: ICommission) {
      return this.tipo === 'distribuicao_interna';
    }
  },
  participantes: {
    type: [participanteComissaoSchema],
    required: function(this: ICommission) {
      return this.tipo === 'distribuicao_interna';
    },
    validate: {
      validator: function(this: ICommission, participantes: IParticipanteComissao[]) {
        if (this.tipo === 'distribuicao_interna' && participantes) {
          const totalPercentual = participantes.reduce((sum, p) => sum + p.percentual, 0);
          return totalPercentual <= 100;
        }
        return true;
      },
      message: 'A soma dos percentuais dos participantes não pode exceder 100%'
    }
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'pendente'],
    default: 'ativo'
  },
  realEstateId: {
    type: String,
    ref: 'RealEstate',
    required: [true, 'ID da imobiliária é obrigatório']
  },
  empreendimentoId: {
    type: String,
    ref: 'Empreendimento'
  },
  produtoId: {
    type: String
  },
  dataInicio: {
    type: Date
  },
  dataFim: {
    type: Date,
    validate: {
      validator: function(this: ICommission, dataFim: Date) {
        if (this.dataInicio && dataFim) {
          return dataFim > this.dataInicio;
        }
        return true;
      },
      message: 'Data fim deve ser posterior à data início'
    }
  }
}, {
  timestamps: true,
  collection: 'commissions'
});

// Índices
commissionSchema.index({ realEstateId: 1 });
commissionSchema.index({ tipo: 1 });
commissionSchema.index({ tipoProduto: 1 });
commissionSchema.index({ status: 1 });
commissionSchema.index({ comissaoTotalId: 1 });
commissionSchema.index({ empreendimentoId: 1 });
commissionSchema.index({ produtoId: 1 });
commissionSchema.index({ createdAt: -1 });
commissionSchema.index({ nome: 'text', descricao: 'text' });

// Método para converter para CommissionResponse
commissionSchema.methods.toCommissionResponse = function(): CommissionResponse {
  return {
    id: this._id.toString(),
    nome: this.nome,
    descricao: this.descricao,
    tipo: this.tipo,
    tipoProduto: this.tipoProduto,
    percentualTotal: this.percentualTotal,
    comissaoTotalId: this.comissaoTotalId,
    participantes: this.participantes,
    status: this.status,
    realEstateId: this.realEstateId,
    empreendimentoId: this.empreendimentoId,
    produtoId: this.produtoId,
    dataInicio: this.dataInicio,
    dataFim: this.dataFim,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Função helper para converter documento para interface
export const toCommission = (doc: any): CommissionResponse => {
  if (!doc) return doc;
  
  if (typeof doc.toCommissionResponse === 'function') {
    return doc.toCommissionResponse();
  }
  
  return {
    id: doc._id?.toString() || doc.id,
    nome: doc.nome,
    descricao: doc.descricao,
    tipo: doc.tipo,
    tipoProduto: doc.tipoProduto,
    percentualTotal: doc.percentualTotal,
    comissaoTotalId: doc.comissaoTotalId,
    participantes: doc.participantes,
    status: doc.status,
    realEstateId: doc.realEstateId,
    empreendimentoId: doc.empreendimentoId,
    produtoId: doc.produtoId,
    dataInicio: doc.dataInicio,
    dataFim: doc.dataFim,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

export const CommissionModel = model<ICommission>('Commission', commissionSchema);
export default CommissionModel;