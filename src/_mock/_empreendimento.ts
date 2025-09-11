import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const EMPREENDIMENTO_DETAILS_TABS = [
  { label: 'Descrição do empreendimento', value: 'content' },
  { label: 'Interessados', value: 'interessados' },
];

export const EMPREENDIMENTO_CARACTERISTICAS_OPTIONS = [
  'Piscina',
  'Academia',
  'Playground',
  'Salão de Festas',
  'Churrasqueira',
  'Portaria 24h',
  'Elevador',
  'Garagem',
  'Área Verde',
  'Quadra Esportiva',
  'Sauna',
  'Espaço Gourmet',
  'Bicicletário',
  'Pet Place',
  'Coworking',
  'Lavanderia',
  'Salão de Jogos',
];

export const EMPREENDIMENTO_PLANTAS_CARACTERISTICAS_OPTIONS = [
  'Sala de estar',
  'Sala de jantar',
  'Cozinha Gourmet',
  'Cozinha planejada',
  'Copa',
  'Escritório / Home office',
  'Lavabo',
  'Área de serviço / lavanderia',
  'Despensa',
  'Closet',
  'Varanda / Sacada',
  'Jardim de inverno',
];

export const EMPREENDIMENTO_CRONOGRAMA_OPTIONS = [
  'Lançamento',
  'Fundação',
  'Estrutura',
  'Acabamento',
  'Entrega',
];

export const EMPREENDIMENTO_TIPOS_UNIDADE_OPTIONS = [
  { label: '1 quarto', value: '1 quarto' },
  { label: '2 quartos', value: '2 quartos' },
  { label: '3 quartos', value: '3 quartos' },
  { label: '4 quartos', value: '4 quartos' },
  { label: 'Cobertura', value: 'Cobertura' },
  { label: 'Studio', value: 'Studio' },
  { label: 'Loft', value: 'Loft' },
];

export const EMPREENDIMENTO_TIPO_OPTIONS = [
  { label: 'Residencial', value: 'Residencial' },
  { label: 'Comercial', value: 'Comercial' },
  { label: 'Misto', value: 'Misto' },
  { label: 'Industrial', value: 'Industrial' },
];

export const EMPREENDIMENTO_STATUS_OPTIONS = [
  { label: 'Lançamento', value: 'Lançamento' },
  { label: 'Em construção', value: 'Em construção' },
  { label: 'Pronto para morar', value: 'Pronto para morar' },
  { label: 'Entregue', value: 'Entregue' },
];

export const EMPREENDIMENTO_BENEFICIOS_OPTIONS = [
  { label: 'Financiamento próprio', value: 'Financiamento próprio' },
  { label: 'FGTS aceito', value: 'FGTS aceito' },
  { label: 'Entrada facilitada', value: 'Entrada facilitada' },
  { label: 'Desconto à vista', value: 'Desconto à vista' },
  { label: 'Permuta aceita', value: 'Permuta aceita' },
  { label: 'Documentação inclusa', value: 'Documentação inclusa' },
  { label: 'Registro incluso', value: 'Registro incluso' },
  { label: 'ITBI incluso', value: 'ITBI incluso' },
  { label: 'Corretagem grátis', value: 'Corretagem grátis' },
  { label: 'Mobiliado', value: 'Mobiliado' },
];

export const EMPREENDIMENTO_DIFERENCIAIS_EDIFICIO_OPTIONS = [
  '1 apto por andar',
  'Piscina',
  'Espaço fitness / academia',
  'Sauna',
  'Churrasqueiras compartilhadas',
  'Gourmet / área de esportes',
  'Bicicletário',
  'Espaço kids / brinquedoteca',
  'Pet place',
  'Coworking / espaço business',
  'Vaga de carro elétrico',
];

export const EMPREENDIMENTO_DIFERENCIAIS_APARTAMENTO_OPTIONS = [
  'Churrasqueira a carvão',
  'Churrasqueira a gás ou elétrica',
  'Elevador privativo',
  'Banheira / jacuzzi',
];

export const EMPREENDIMENTO_STATUS_IMOVEL_OPTIONS = [
  'Lançamento',
  'Na planta',
  'Pronto para morar',
];

export const EMPREENDIMENTO_OPORTUNIDADES_DISPONIVEIS_OPTIONS = ['Em oferta'];

export const EMPREENDIMENTO_TIPO_APARTAMENTO_OPTIONS = [
  'Duplex / triplex',
  'Cobertura',
  'Penthouse',
  'Garden',
];

export const EMPREENDIMENTO_TIPO_SACADA_OPTIONS = [
  'Simples ou balcão',
  'Com piscina',
  'Com churrasqueira',
  'Gourmet',
];

export const EMPREENDIMENTO_PUBLISH_OPTIONS = [
  { label: 'Publicado', value: 'published' },
  { label: 'Rascunho', value: 'draft' },
];

export const EMPREENDIMENTO_SORT_OPTIONS = [
  { label: 'Mais recentes', value: 'latest' },
  { label: 'Mais popular', value: 'popular' },
  { label: 'Mais antigo', value: 'oldest' },
];

const INTERESSADOS = Array.from({ length: 12 }, (_, index) => ({
  id: _mock.id(index),
  email: _mock.email(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

const DESCRICAO = `Um empreendimento moderno e sofisticado, projetado para oferecer o máximo de conforto e qualidade de vida. Localizado em uma das regiões mais valorizadas da cidade, oferece fácil acesso a shopping centers, escolas, hospitais e principais vias de transporte. Características principais: apartamentos de 2 e 3 quartos com suíte, varanda gourmet em todos os apartamentos, acabamento de alto padrão, área de lazer completa com piscina, academia e salão de festas, portaria 24 horas com sistema de segurança, 2 vagas de garagem por apartamento e elevadores de alta velocidade. Por que você vai amar morar aqui: localização privilegiada com fácil acesso ao centro da cidade, área verde preservada com paisagismo planejado, infraestrutura completa no entorno, valorização garantida da região, construtora com mais de 20 anos de experiência, financiamento facilitado e condições especiais, entrega programada para 2025.`;

export const _empreendimentos = Array.from({ length: 12 }, (_, index) => {
  const publish = index % 3 ? 'published' : 'draft';
  const status = EMPREENDIMENTO_STATUS_OPTIONS[index % EMPREENDIMENTO_STATUS_OPTIONS.length].value;

  const preco = {
    type: (index % 5 && 'Personalizado') || 'Por m²',
    valor: _mock.number.price(index) * 1000,
    negociavel: _mock.boolean(index),
  };

  const beneficios = EMPREENDIMENTO_BENEFICIOS_OPTIONS.slice(0, 3).map((option) => option.label);

  const tipoEmpreendimento =
    EMPREENDIMENTO_TIPO_OPTIONS.map((option) => option.label)[index] ||
    EMPREENDIMENTO_TIPO_OPTIONS[0].label;

  const tiposUnidade = (index % 2 && ['2 quartos']) ||
    (index % 3 && ['3 quartos']) ||
    (index % 4 && ['Cobertura']) || ['1 quarto'];

  const construtora = {
    name: _mock.companyNames(index),
    logo: _mock.image.company(index),
    phoneNumber: _mock.phoneNumber(index),
    fullAddress: _mock.fullAddress(index),
  };

  // Plantas de exemplo baseadas no tipo de unidade
  const plantas = [
    {
      id: `planta-${index}-1`,
      nome: tiposUnidade[0] || '2 quartos',
      descricao: `Planta tipo ${tiposUnidade[0] || '2 quartos'} com varanda gourmet`,
      area: index % 2 === 0 ? 65 : 85,
      quartos: tiposUnidade[0]?.includes('1 quarto')
        ? 1
        : tiposUnidade[0]?.includes('3 quartos')
          ? 3
          : 2,
      banheiros: tiposUnidade[0]?.includes('1 quarto') ? 1 : 2,
      vagas: tiposUnidade[0]?.includes('Cobertura') ? 2 : 1,
      suites:
        tiposUnidade[0]?.includes('3 quartos') || tiposUnidade[0]?.includes('Cobertura') ? 1 : 0,
      disponivel: true,
      caracteristicas: [
        'Sala de estar',
        'Cozinha Gourmet',
        'Varanda / Sacada',
        'Área de serviço / lavanderia',
      ],
      imagens: [],
      preco: {
        valor: _mock.number.price(index) * 800,
        negociavel: true,
      },
    },
  ];

  // Adiciona uma segunda planta para alguns empreendimentos
  if (index % 3 === 0) {
    plantas.push({
      id: `planta-${index}-2`,
      nome: '3 quartos Premium',
      descricao: 'Planta premium com suíte master e closet',
      area: 120,
      quartos: 3,
      banheiros: 3,
      vagas: 2,
      suites: 2,
      disponivel: true,
      caracteristicas: [
        'Sala de estar',
        'Sala de jantar',
        'Cozinha Gourmet',
        'Closet',
        'Varanda / Sacada',
        'Lavabo',
      ],
      imagens: [],
      preco: {
        valor: _mock.number.price(index) * 1200,
        negociavel: false,
      },
    });
  }

  return {
    id: _mock.id(index),
    preco,
    publish,
    status,
    construtora,
    beneficios,
    tipoEmpreendimento,
    tiposUnidade,
    descricao: DESCRICAO,
    interessados: INTERESSADOS,
    nome: `Empreendimento ${_mock.companyNames(index)}`,
    titulo: `Residencial ${_mock.companyNames(index)} - Apartamentos de Alto Padrão`,
    criadoEm: _mock.time(index),
    dataEntrega: _mock.time(index),
    caracteristicas: EMPREENDIMENTO_CARACTERISTICAS_OPTIONS.slice(0, 5),
    totalVisualizacoes: _mock.number.nativeL(index),
    cidade: 'São Paulo',
    estado: 'SP',
    cronogramaEntrega: EMPREENDIMENTO_CRONOGRAMA_OPTIONS.slice(0, 3),
    diferenciaisEdificio: EMPREENDIMENTO_DIFERENCIAIS_EDIFICIO_OPTIONS.slice(0, 3),
    diferenciaisApartamento: EMPREENDIMENTO_DIFERENCIAIS_APARTAMENTO_OPTIONS.slice(0, 2),
    tipoApartamento: EMPREENDIMENTO_TIPO_APARTAMENTO_OPTIONS.slice(0, 1),
    tipoSacada: EMPREENDIMENTO_TIPO_SACADA_OPTIONS.slice(0, 1),
    oportunidadesDisponiveis:
      index % 2 === 0 ? EMPREENDIMENTO_OPORTUNIDADES_DISPONIVEIS_OPTIONS.slice(0, 1) : [],
    book: index % 3 === 0 ? `/assets/books/empreendimento-${index}-book.pdf` : undefined,
    avatar: `/assets/images/empreendimento-${index}-avatar.jpg`,
    plantas,
  };
});
