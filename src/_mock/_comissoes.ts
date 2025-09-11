import type {
  IComissaoItem,
  DistribuicaoInterna,
  ComissaoTotalImobiliaria,
} from 'src/types/comissao';

import { _mock } from './_mock';

// ----------------------------------------------------------------------

// Comissões Totais da Imobiliária (Nível 1)
const comissoesTotais: ComissaoTotalImobiliaria[] = [
  {
    id: _mock.id(1),
    nome: 'Comissão Total - Imóveis',
    descricao: 'Percentual total que a imobiliária recebe nas vendas de imóveis',
    tipoProduto: 'imovel',
    percentualTotal: 5.0, // 5% do valor da venda
    status: 'ativo',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    dataInicio: new Date('2024-01-01'),
    dataFim: new Date('2024-12-31'),
  },
  {
    id: _mock.id(2),
    nome: 'Comissão Total - Terrenos',
    descricao: 'Percentual total que a imobiliária recebe nas vendas de terrenos',
    tipoProduto: 'terreno',
    percentualTotal: 4.0, // 4% do valor da venda
    status: 'ativo',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    dataInicio: new Date('2024-01-01'),
    dataFim: new Date('2024-12-31'),
  },
  {
    id: _mock.id(3),
    nome: 'Comissão Total - Empreendimentos',
    descricao: 'Percentual total que a imobiliária recebe nas vendas de empreendimentos',
    tipoProduto: 'empreendimento',
    percentualTotal: 6.0, // 6% do valor da venda
    status: 'ativo',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    dataInicio: new Date('2024-01-01'),
    dataFim: new Date('2024-12-31'),
  },
  {
    id: _mock.id(4),
    nome: 'Comissão Especial - Empreendimento Premium',
    descricao: 'Comissão especial para empreendimento de alto padrão',
    tipoProduto: 'empreendimento',
    percentualTotal: 7.0, // 7% do valor da venda
    status: 'ativo',
    empreendimentoId: 'emp-premium-001',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    dataInicio: new Date('2024-02-01'),
    dataFim: new Date('2024-12-31'),
  },
];

// Distribuições Internas (Nível 2)
const distribuicoesInternas: DistribuicaoInterna[] = [
  {
    id: _mock.id(5),
    nome: 'Distribuição Padrão - Imóveis',
    descricao: 'Distribuição interna padrão para comissões de imóveis',
    comissaoTotalId: _mock.id(1), // Referência à comissão total de imóveis
    participantes: [
      {
        tipo: 'grupo',
        percentual: 20,
        ativo: true,
        fixo: true,
        obrigatorio: true,
        grupoId: 'grupo-vendas-001',
      },
      {
        tipo: 'imobiliaria',
        percentual: 10,
        ativo: true,
        fixo: true,
        obrigatorio: true,
      },
      {
        tipo: 'corretor_principal',
        percentual: 50,
        ativo: true,
        fixo: false,
        obrigatorio: true,
        percentualMinimo: 40,
        percentualMaximo: 60,
      },
      {
        tipo: 'corretor_suporte',
        percentual: 20,
        ativo: true,
        fixo: false,
        obrigatorio: false,
        percentualMinimo: 20,
        percentualMaximo: 40,
      },
    ],
    status: 'ativo',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: _mock.id(6),
    nome: 'Distribuição Premium - Empreendimentos',
    descricao: 'Distribuição especial para empreendimentos premium',
    comissaoTotalId: _mock.id(4), // Referência à comissão especial premium
    participantes: [
      {
        tipo: 'grupo',
        percentual: 15,
        ativo: true,
        fixo: true,
        obrigatorio: true,
        grupoId: 'grupo-premium-001',
      },
      {
        tipo: 'imobiliaria',
        percentual: 10,
        ativo: true,
        fixo: true,
        obrigatorio: true,
      },
      {
        tipo: 'corretor_principal',
        percentual: 60,
        ativo: true,
        fixo: false,
        obrigatorio: true,
        percentualMinimo: 50,
        percentualMaximo: 70,
      },
      {
        tipo: 'coordenador',
        percentual: 15,
        ativo: true,
        fixo: false,
        obrigatorio: true,
        percentualMinimo: 15,
        percentualMaximo: 25,
      },
    ],
    status: 'ativo',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// Combinar todos os tipos em um array único
export const _comissoes: IComissaoItem[] = [...comissoesTotais, ...distribuicoesInternas];
