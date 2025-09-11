import type { ITerrenoItem } from 'src/types/terreno';

import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const TERRENO_STATUS_OPTIONS = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'suspenso', label: 'Inativo' },
];

export const TERRENO_TIPO_OPTIONS = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'rural', label: 'Rural' },
];

// ----------------------------------------------------------------------

const TERRENO_TITLES = [
  'Terreno Residencial Vila Nova',
  'Lote Comercial Centro',
  'Área Industrial Distrito',
  'Terreno Rural Fazenda',
  'Lote Condomínio Fechado',
  'Terreno Esquina Comercial',
  'Área Residencial Jardins',
  'Lote Industrial Logística',
  'Terreno Praia Litoral',
  'Área Comercial Shopping',
];

const TERRENO_DESCRIPTIONS = [
  'Excelente terreno em localização privilegiada',
  'Lote com ótima topografia e documentação em dia',
  'Área plana ideal para construção',
  'Terreno com vista panorâmica',
  'Lote em condomínio de alto padrão',
];

const BAIRROS = [
  'Centro',
  'Vila Nova',
  'Jardins',
  'Industrial',
  'Praia',
  'Shopping',
  'Residencial',
  'Comercial',
  'Fazenda',
  'Distrito',
];

const CIDADES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Salvador',
  'Brasília',
  'Fortaleza',
  'Recife',
  'Porto Alegre',
  'Curitiba',
  'Goiânia',
];

const ESTADOS = ['SP', 'RJ', 'MG', 'BA', 'DF', 'CE', 'PE', 'RS', 'PR', 'GO'];

// ----------------------------------------------------------------------

export const _terrenos: ITerrenoItem[] = Array.from({ length: 24 }, (_, index) => {
  const status = TERRENO_STATUS_OPTIONS[index % TERRENO_STATUS_OPTIONS.length].value;
  const tipo = TERRENO_TIPO_OPTIONS[index % TERRENO_TIPO_OPTIONS.length].value;
  const area = _mock.number.nativeL(index);
  const preco = _mock.number.price(index);
  const bairro = BAIRROS[index % BAIRROS.length];
  const cidade = CIDADES[index % CIDADES.length];
  const estado = ESTADOS[index % ESTADOS.length];

  return {
    id: _mock.id(index),
    codigo: `TER-${String(index + 1).padStart(4, '0')}`,
    titulo: TERRENO_TITLES[index % TERRENO_TITLES.length],
    descricao: TERRENO_DESCRIPTIONS[index % TERRENO_DESCRIPTIONS.length],
    area,
    preco,
    precoM2: Math.round(preco / area),
    status,
    tipo,
    createdAt: _mock.time(index),
    updatedAt: _mock.time(index),
    localizacao: {
      endereco: `${_mock.fullAddress(index)}, ${_mock.number.nativeS(index)}`,
      bairro,
      cidade,
      estado,
      cep: `${_mock.number.nativeM(index)}-${_mock.number.nativeS(index)}`,
      coordenadas: {
        lat: -23.5505 + index * 0.01,
        lng: -46.6333 + index * 0.01,
      },
    },
    proprietario: {
      id: _mock.id(index),
      nome: _mock.fullName(index),
      email: _mock.email(index),
      telefone: _mock.phoneNumber(index),
      avatarUrl: _mock.image.avatar(index),
      documento: `${_mock.number.nativeS(index)}.${_mock.number.nativeS(index + 1)}.${_mock.number.nativeS(index + 2)}-${_mock.number.nativeS(index + 3)}`,
    },
    caracteristicas: {
      area,
      formato: ['Retangular', 'Quadrado', 'Irregular', 'Triangular'][index % 4],
      topografia: ['Plano', 'Inclinado', 'Aclive', 'Declive'][index % 4],
      acesso: ['Rua asfaltada', 'Rua de terra', 'Estrada vicinal'][index % 3],
      documentacao: ['Escritura', 'Contrato', 'Posse'][index % 3],
      restricoes: _mock.boolean(index) ? ['Nenhuma'] : ['Área de preservação'],
    },
    imagens: Array.from({ length: 3 + (index % 5) }, (__, imgIndex) => _mock.image.cover(imgIndex)),
    destaque: _mock.boolean(index),
    negociavel: _mock.boolean(index + 1),
    itu: Math.floor(Math.random() * 500) + 200,
    observacoes: _mock.boolean(index + 2)
      ? 'Terreno com excelente localização e potencial de valorização.'
      : undefined,
  };
});
