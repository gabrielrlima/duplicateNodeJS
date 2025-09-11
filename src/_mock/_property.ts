import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const PROPERTY_STATUS_OPTIONS = [
  { value: 'Em andamento', label: 'Em andamento' },
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Vendido', label: 'Vendido' },
  { value: 'Alugado', label: 'Alugado' },
];

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'Apartamento', label: 'Apartamento' },
  { value: 'Casa', label: 'Casa' },
  { value: 'Comercial', label: 'Comercial' },
];

// Imagens de exemplo para imóveis
const PROPERTY_IMAGES = [
  '/assets/images/properties/property-1.jpg',
  '/assets/images/properties/property-2.jpg',
  '/assets/images/properties/property-3.jpg',
  '/assets/images/properties/property-4.jpg',
  '/assets/images/properties/property-5.jpg',
  '/assets/images/properties/property-6.jpg',
  '/assets/images/properties/property-7.jpg',
  '/assets/images/properties/property-8.jpg',
];

// Descrições de exemplo
const PROPERTY_DESCRIPTIONS = [
  `## Apartamento Moderno e Confortável

Este magnífico apartamento oferece o máximo em conforto e sofisticação. Localizado em uma das melhores regiões da cidade, combina comodidade urbana com tranquilidade residencial.

### Características Principais

- **Amplos ambientes** com excelente iluminação natural
- **Cozinha gourmet** totalmente equipada
- **Suíte master** com closet e varanda privativa  
- **Área de lazer completa** no condomínio
- **2 vagas de garagem** cobertas

### Localização Privilegiada

Próximo a shopping centers, escolas de qualidade, hospitais e com fácil acesso ao transporte público.`,

  `## Casa Familiar Espaçosa

Uma residência perfeita para famílias que buscam espaço, conforto e qualidade de vida. Esta casa oferece ambientes amplos e bem distribuídos.

### Destaques

- **4 quartos** sendo 2 suítes
- **Área gourmet** com churrasqueira
- **Jardim** com espaço para lazer
- **Garagem** para 3 carros
- **Quintal amplo** para crianças brincarem

### Infraestrutura

Localizada em bairro residencial consolidado, com toda infraestrutura urbana disponível.`,

  `## Cobertura de Luxo

Cobertura exclusiva com vista panorâmica da cidade. Acabamentos de alto padrão e área de lazer privativa.

### Características Exclusivas

- **Vista 360°** da cidade
- **Piscina privativa** na cobertura
- **Área gourmet** completa
- **4 suítes** com closets
- **Elevador privativo**

### Condomínio Premium

Condomínio com infraestrutura completa: spa, academia, salão de festas, quadras esportivas.`,
];

// Amenidades do imóvel
const PROPERTY_AMENITIES = [
  'Box',
  'Armários no quarto',
  'Armários nos banheiros',
  'Armários na cozinha',
  'Varanda',
  'Área de serviço',
  'Cozinha americana',
  'Closet',
  'Escritório',
  'Lavabo',
  'Despensa',
];

// Amenidades do condomínio
const CONDOMINIUM_AMENITIES = [
  'Playground',
  'Piscina',
  'Churrasqueira',
  'Quadra esportiva',
  'Área comum',
  'Elevador',
  'Portaria 24h',
  'Academia',
  'Salão de festas',
  'Jardim',
  'Sauna',
  'Piscina infantil',
  'Espaço gourmet',
  'Biblioteca',
  'Brinquedoteca',
];

export const _properties = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  name:
    index === 0
      ? "Spazio d'italia - 903"
      : [
          'Residencial Jardim das Flores',
          'Apartamento Vista Mar',
          'Casa Colonial Moderna',
          'Cobertura Sunset',
          'Loft Industrial Chic',
        ][index % 5] + ` - ${index + 1}`,
  avatarUrl: _mock.image.avatar(index),
  images: [
    PROPERTY_IMAGES[index % PROPERTY_IMAGES.length],
    PROPERTY_IMAGES[(index + 1) % PROPERTY_IMAGES.length],
    PROPERTY_IMAGES[(index + 2) % PROPERTY_IMAGES.length],
    PROPERTY_IMAGES[(index + 3) % PROPERTY_IMAGES.length],
  ],
  type:
    (index % 5 === 0 && 'Casa') ||
    (index % 5 === 1 && 'Apartamento') ||
    (index % 5 === 2 && 'Condomínio') ||
    (index % 5 === 3 && 'Terreno') ||
    'Comercial',
  status:
    (index % 4 === 0 && 'Em andamento') ||
    (index % 4 === 1 && 'Pendente') ||
    (index % 4 === 2 && 'Vendido') ||
    'Alugado',
  value: _mock.number.price(index) * 20000,
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
  address: _mock.fullAddress(index),
  city: _mock.countryNames(index),
  state: _mock.companyNames(index).slice(0, 2).toUpperCase(),
  cep: _mock
    .phoneNumber(index)
    .slice(0, 8)
    .replace(/(\d{5})(\d{3})/, '$1-$2'),
  area: 50 + Math.floor(Math.random() * 150),
  description: PROPERTY_DESCRIPTIONS[index % PROPERTY_DESCRIPTIONS.length],

  // Campos adicionais para detalhes do imóvel
  bedrooms: Math.floor(Math.random() * 4) + 1,
  suites: Math.floor(Math.random() * 3) + 1,
  bathrooms: Math.floor(Math.random() * 3) + 1,
  parkingSpaces: Math.floor(Math.random() * 3) + 1,
  condominiumFee: Math.floor(Math.random() * 800) + 140,
  iptuValue: Math.floor(Math.random() * 500) + 700,
  sunPosition: ['Norte', 'Sul', 'Leste', 'Oeste', 'Face Oeste'][Math.floor(Math.random() * 5)],
  floor: index % 5 === 0 ? 'Térreo' : `${Math.floor(Math.random() * 20) + 1}º andar`,
  furnished: Math.random() > 0.5,
  hasBalcony: Math.random() > 0.3,
  acceptsFinancing: Math.random() > 0.3,
  acceptsExchange: Math.random() > 0.7,
  exclusiveProperty: Math.random() > 0.8,
  highlightProperty: Math.random() > 0.9,
  propertyCondition: ['Novo', 'Usado', 'Na planta', 'Em construção'][Math.floor(Math.random() * 4)],
  constructionYear: `${2000 + Math.floor(Math.random() * 24)}`,
  buildingName: index % 2 === 0 ? `Edifício ${_mock.companyNames(index)}` : undefined,
  propertyDescription: `Imóvel aconchegante para alugar com ${Math.floor(Math.random() * 4) + 1} quartos e ${Math.floor(Math.random() * 3) + 1} banheiro no total. é ideal para quem procura conforto e comodidade. O condomínio é bem equipado com diversas instalações, apropriado para quem busca lazer sem sair de casa e fica localizado em Avenida Interlagos no bairro Jardim Umuarama em São Paulo. Está bem localizado, próximo a pontos de interesse de Jardim Umuarama, tais como Emei Dr. João de Deus Bueno dos Reis, Colégio Santa Maria, Shopping Interlagos, UBS Campo Grande, Hospital Vida's e Clínica Notredame Intermédica.`,

  // Localização detalhada
  neighborhood: ['Jardim Umuarama', 'Jardim Goias', 'Centro', 'Vila Nova'][index % 4],
  street: `Rua ${Math.floor(Math.random() * 100) + 1}`,
  streetNumber: `${Math.floor(Math.random() * 500) + 200}`,
  zipCode: _mock
    .phoneNumber(index)
    .slice(0, 8)
    .replace(/(\d{5})(\d{3})/, '$1-$2'),

  // Informações do condomínio
  totalFloors: Math.floor(Math.random() * 30) + 20,
  condominiumAmenities: CONDOMINIUM_AMENITIES.filter(() => Math.random() > 0.4),

  // Preços
  salePrice: _mock.number.price(index) * 20000,
  rentPrice: Math.floor(_mock.number.price(index) * 20000 * 0.005),
  pricePerSquareMeter: Math.floor(
    (_mock.number.price(index) * 20000) / (50 + Math.floor(Math.random() * 150))
  ),

  // Responsável
  agent: {
    id: _mock.id(index + 100),
    name: index % 3 === 0 ? 'Matheus Vieira Tavares' : _mock.fullName(index),
    phone: index % 3 === 0 ? '(62) 0 0000-0000' : _mock.phoneNumber(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
  },

  // Métricas
  viewsCount: Math.floor(Math.random() * 1000) + 50,
  favoritesCount: Math.floor(Math.random() * 100) + 5,
  contactsCount: Math.floor(Math.random() * 50) + 1,

  // Reviews mock
  totalRatings: 4.0 + Math.random(),
  totalReviews: Math.floor(Math.random() * 20) + 5,
  reviews: [],
  ratings: [
    {
      name: '5 Star',
      starCount: Math.floor(Math.random() * 50) + 10,
      reviewCount: Math.floor(Math.random() * 30) + 5,
    },
    {
      name: '4 Star',
      starCount: Math.floor(Math.random() * 30) + 5,
      reviewCount: Math.floor(Math.random() * 20) + 3,
    },
    {
      name: '3 Star',
      starCount: Math.floor(Math.random() * 20) + 2,
      reviewCount: Math.floor(Math.random() * 10) + 1,
    },
    {
      name: '2 Star',
      starCount: Math.floor(Math.random() * 10) + 1,
      reviewCount: Math.floor(Math.random() * 5) + 1,
    },
    { name: '1 Star', starCount: Math.floor(Math.random() * 5) + 1, reviewCount: 1 },
  ],

  // Amenidades do imóvel
  amenities: PROPERTY_AMENITIES.reduce(
    (acc, amenity) => {
      acc[amenity.toLowerCase().replace(/\s+/g, '')] = Math.random() > 0.5;
      return acc;
    },
    {} as Record<string, boolean>
  ),
}));
