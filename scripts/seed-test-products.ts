#!/usr/bin/env tsx

import axios from 'axios';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

// Configuração da API
const API_BASE_URL = process.env.VITE_HOST_API || 'http://localhost:3001';
const API_TOKEN = process.env.API_TOKEN || '';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

// Tipos de propriedades
type PropertyType = 'house' | 'apartment' | 'land' | 'commercial';

// Interface para dados de propriedade
interface PropertyData {
  name: string;
  title: string;
  description: string;
  type: PropertyType;
  status: 'available' | 'sold' | 'rented' | 'reserved' | 'inactive';
  area: number;
  builtArea?: number;
  value: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  elevator: boolean;
  furnished: boolean;
  hasBalcony: boolean;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  acceptsFinancing: boolean;
  acceptsExchange: boolean;
  exclusiveProperty: boolean;
  highlightProperty: boolean;
  realEstateId: string;
  pricePerSquareMeter?: number;
  condominiumFee?: number;
  iptuValue?: number;
  yearBuilt?: number;
  amenities?: Record<string, boolean>;
}

// Dados realistas brasileiros
const CITIES = [
  { name: 'São Paulo', state: 'SP', neighborhoods: ['Vila Madalena', 'Pinheiros', 'Moema', 'Jardins', 'Centro'] },
  { name: 'Rio de Janeiro', state: 'RJ', neighborhoods: ['Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca', 'Centro'] },
  { name: 'Belo Horizonte', state: 'MG', neighborhoods: ['Savassi', 'Funcionários', 'Centro', 'Pampulha', 'Lourdes'] },
  { name: 'Curitiba', state: 'PR', neighborhoods: ['Batel', 'Centro', 'Água Verde', 'Bigorrilho', 'Rebouças'] },
  { name: 'Porto Alegre', state: 'RS', neighborhoods: ['Moinhos de Vento', 'Centro', 'Petrópolis', 'Auxiliadora', 'Cidade Baixa'] }
];

const STREET_NAMES = [
  'Rua das Flores', 'Avenida Paulista', 'Rua Augusta', 'Rua Oscar Freire',
  'Avenida Atlântica', 'Rua Visconde de Pirajá', 'Rua Dias Ferreira',
  'Avenida Brigadeiro Faria Lima', 'Rua Haddock Lobo', 'Rua Consolação'
];

const AMENITIES = {
  piscina: 'Piscina',
  academia: 'Academia',
  churrasqueira: 'Churrasqueira',
  playground: 'Playground',
  portaria24h: 'Portaria 24h',
  elevador: 'Elevador',
  garagem: 'Garagem',
  jardim: 'Jardim',
  salaoFestas: 'Salão de Festas',
  quadraEsportes: 'Quadra de Esportes'
};

// Função para gerar número aleatório
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para escolher item aleatório de array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Função para gerar CEP aleatório
function generateZipCode(): string {
  const num1 = randomBetween(10000, 99999);
  const num2 = randomBetween(100, 999);
  return `${num1}-${num2}`;
}

// Função para gerar endereço aleatório
function generateAddress() {
  const city = randomChoice(CITIES);
  const neighborhood = randomChoice(city.neighborhoods);
  const street = randomChoice(STREET_NAMES);
  const number = randomBetween(10, 9999).toString();
  
  return {
    street,
    number,
    complement: Math.random() > 0.7 ? `Apto ${randomBetween(10, 999)}` : '',
    neighborhood,
    city: city.name,
    state: city.state,
    zipCode: generateZipCode(),
    country: 'Brasil'
  };
}

// Função para gerar comodidades aleatórias
function generateAmenities(): Record<string, boolean> {
  const amenities: Record<string, boolean> = {};
  const amenityKeys = Object.keys(AMENITIES);
  
  // Selecionar 3-6 comodidades aleatórias
  const numAmenities = randomBetween(3, 6);
  const selectedAmenities = amenityKeys.sort(() => 0.5 - Math.random()).slice(0, numAmenities);
  
  selectedAmenities.forEach(key => {
    amenities[key] = true;
  });
  
  return amenities;
}

// Gerador de dados para imóveis (casas e apartamentos)
function generateHouseData(realEstateId: string): PropertyData {
  const isApartment = Math.random() > 0.5;
  const bedrooms = randomBetween(1, 5);
  const bathrooms = randomBetween(1, Math.min(bedrooms + 1, 4));
  const area = randomBetween(50, 300);
  const pricePerM2 = randomBetween(3000, 12000);
  const value = area * pricePerM2;
  
  const propertyType = isApartment ? 'Apartamento' : 'Casa';
  const title = `${propertyType} ${bedrooms} ${bedrooms === 1 ? 'quarto' : 'quartos'} - ${area}m²`;
  
  return {
    name: title,
    title,
    description: `Excelente ${propertyType.toLowerCase()} com ${bedrooms} ${bedrooms === 1 ? 'quarto' : 'quartos'} e ${bathrooms} ${bathrooms === 1 ? 'banheiro' : 'banheiros'}. Localização privilegiada, próximo a comércios e transporte público. Imóvel em ótimo estado de conservação.`,
    type: isApartment ? 'apartment' : 'house',
    status: 'available',
    area,
    builtArea: area,
    value,
    bedrooms,
    bathrooms,
    parkingSpaces: randomBetween(0, 3),
    elevator: isApartment && Math.random() > 0.3,
    furnished: Math.random() > 0.7,
    hasBalcony: isApartment && Math.random() > 0.4,
    address: generateAddress(),
    acceptsFinancing: Math.random() > 0.3,
    acceptsExchange: Math.random() > 0.8,
    exclusiveProperty: Math.random() > 0.9,
    highlightProperty: Math.random() > 0.8,
    realEstateId,
    pricePerSquareMeter: pricePerM2,
    condominiumFee: isApartment ? randomBetween(200, 800) : 0,
    iptuValue: randomBetween(100, 500),
    yearBuilt: randomBetween(1990, 2023),
    amenities: generateAmenities()
  };
}

// Gerador de dados para terrenos
function generateLandData(realEstateId: string): PropertyData {
  const area = randomBetween(200, 2000);
  const pricePerM2 = randomBetween(500, 3000);
  const value = area * pricePerM2;
  
  const title = `Terreno ${area}m² - Excelente localização`;
  
  return {
    name: title,
    title,
    description: `Terreno plano de ${area}m² em excelente localização. Ideal para construção residencial ou comercial. Documentação em dia, pronto para construir. Fácil acesso e infraestrutura completa na região.`,
    type: 'land',
    status: 'available',
    area,
    value,
    elevator: false,
    furnished: false,
    hasBalcony: false,
    address: generateAddress(),
    acceptsFinancing: Math.random() > 0.4,
    acceptsExchange: Math.random() > 0.7,
    exclusiveProperty: Math.random() > 0.8,
    highlightProperty: Math.random() > 0.9,
    realEstateId,
    pricePerSquareMeter: pricePerM2,
    iptuValue: randomBetween(50, 200)
  };
}

// Gerador de dados para empreendimentos
function generateCommercialData(realEstateId: string): PropertyData {
  const area = randomBetween(100, 1000);
  const pricePerM2 = randomBetween(4000, 15000);
  const value = area * pricePerM2;
  
  const commercialTypes = ['Loja', 'Escritório', 'Galpão', 'Sala Comercial'];
  const commercialType = randomChoice(commercialTypes);
  const title = `${commercialType} ${area}m² - Centro Comercial`;
  
  return {
    name: title,
    title,
    description: `${commercialType} de ${area}m² em centro comercial movimentado. Excelente para diversos tipos de negócios. Localização estratégica com grande fluxo de pessoas. Infraestrutura completa e estacionamento disponível.`,
    type: 'commercial',
    status: 'available',
    area,
    builtArea: area,
    value,
    bathrooms: randomBetween(1, 3),
    parkingSpaces: randomBetween(1, 5),
    elevator: area > 200 && Math.random() > 0.4,
    furnished: Math.random() > 0.8,
    hasBalcony: false,
    address: generateAddress(),
    acceptsFinancing: Math.random() > 0.5,
    acceptsExchange: Math.random() > 0.8,
    exclusiveProperty: Math.random() > 0.7,
    highlightProperty: Math.random() > 0.8,
    realEstateId,
    pricePerSquareMeter: pricePerM2,
    condominiumFee: randomBetween(300, 1200),
    iptuValue: randomBetween(200, 800),
    yearBuilt: randomBetween(2000, 2023),
    amenities: {
      estacionamento: true,
      seguranca24h: true,
      elevador: area > 200,
      arCondicionado: Math.random() > 0.5
    }
  };
}

// Função para criar propriedade via API
async function createProperty(propertyData: PropertyData): Promise<boolean> {
  try {
    console.log(`📤 Criando: ${propertyData.title}`);
    
    const response = await api.post('/api/property', propertyData);
    
    if (response.data.success) {
      console.log(`✅ Criado com sucesso: ${propertyData.title}`);
      return true;
    } else {
      console.error(`❌ Erro ao criar ${propertyData.title}:`, response.data.message);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ Erro ao criar ${propertyData.title}:`, error.response?.data?.message || error.message);
    return false;
  }
}

// Função para obter ID da imobiliária atual
async function getCurrentRealEstateId(): Promise<string | null> {
  try {
    console.log('🔍 Buscando imobiliárias do usuário...');
    const response = await api.get('/api/real-estate');
    
    if (response.data.success && response.data.data.realEstates.length > 0) {
      const realEstateId = response.data.data.realEstates[0].id;
      console.log(`✅ Imobiliária encontrada: ${realEstateId}`);
      return realEstateId;
    } else {
      console.error('❌ Nenhuma imobiliária encontrada');
      return null;
    }
  } catch (error: any) {
    console.error('❌ Erro ao buscar imobiliárias:', error.response?.data?.message || error.message);
    return null;
  }
}

// Função principal de seeding
async function seedTestProducts() {
  console.log('🚀 Iniciando criação de produtos de teste...');
  console.log('=' .repeat(50));
  
  // Verificar token de autenticação
  if (!API_TOKEN) {
    console.error('❌ Token de API não encontrado. Configure a variável API_TOKEN.');
    process.exit(1);
  }
  
  // Obter ID da imobiliária
  const realEstateId = await getCurrentRealEstateId();
  if (!realEstateId) {
    console.error('❌ Não foi possível obter o ID da imobiliária.');
    process.exit(1);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  // Criar 10 imóveis (casas e apartamentos)
  console.log('\n🏠 Criando 10 imóveis (casas e apartamentos)...');
  for (let i = 1; i <= 10; i++) {
    const propertyData = generateHouseData(realEstateId);
    const success = await createProperty(propertyData);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Pequena pausa entre criações
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Criar 10 terrenos
  console.log('\n🌱 Criando 10 terrenos...');
  for (let i = 1; i <= 10; i++) {
    const propertyData = generateLandData(realEstateId);
    const success = await createProperty(propertyData);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Pequena pausa entre criações
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Criar 10 empreendimentos comerciais
  console.log('\n🏢 Criando 10 empreendimentos comerciais...');
  for (let i = 1; i <= 10; i++) {
    const propertyData = generateCommercialData(realEstateId);
    const success = await createProperty(propertyData);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Pequena pausa entre criações
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Resumo final
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMO DA CRIAÇÃO:');
  console.log(`✅ Produtos criados com sucesso: ${successCount}`);
  console.log(`❌ Produtos com erro: ${errorCount}`);
  console.log(`📈 Total processado: ${successCount + errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Todos os produtos foram criados com sucesso!');
  } else {
    console.log(`\n⚠️  ${errorCount} produtos falharam. Verifique os logs acima.`);
  }
  
  console.log('\n✨ Seeding concluído!');
}

// Executar o seeding
seedTestProducts();

export { seedTestProducts };