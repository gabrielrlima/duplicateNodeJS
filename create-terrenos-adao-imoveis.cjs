const axios = require('axios');
const mongoose = require('mongoose');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const USER_EMAIL = 'gabriel@teste.com';
const USER_PASSWORD = '123456';
const REAL_ESTATE_NAME = 'Adão imóveis';

// Função para fazer login e obter token
async function login() {
  try {
    console.log('🔐 Fazendo login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    
    if (response.data.success && response.data.data.token) {
      console.log('✅ Login realizado com sucesso!');
      return response.data.data.token;
    } else {
      throw new Error('Token não encontrado na resposta');
    }
  } catch (error) {
    console.error('❌ Erro ao fazer login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    throw error;
  }
}

// Função para buscar imobiliárias do usuário
async function getRealEstates(token) {
  try {
    console.log('🏢 Buscando imobiliárias...');
    const response = await axios.get(`${API_BASE_URL}/real-estate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      const realEstates = response.data.data.realEstates;
      console.log(`📋 Encontradas ${realEstates.length} imobiliárias`);
      
      // Buscar a imobiliária "Adão Imóveis"
      const adaoImoveis = realEstates.find(re => re.name === REAL_ESTATE_NAME);
      
      if (adaoImoveis) {
        console.log(`✅ Imobiliária "${REAL_ESTATE_NAME}" encontrada:`, adaoImoveis.id);
        return adaoImoveis;
      } else {
        console.log(`❌ Imobiliária "${REAL_ESTATE_NAME}" não encontrada.`);
        console.log('Imobiliárias disponíveis:');
        realEstates.forEach(re => console.log(`- ${re.name} (ID: ${re.id})`));
        throw new Error(`Imobiliária "${REAL_ESTATE_NAME}" não encontrada`);
      }
    } else {
      throw new Error('Erro ao buscar imobiliárias');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar imobiliárias:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    throw error;
  }
}

// Função para criar um terreno
async function createTerreno(token, realEstateId, terrenoData) {
  try {
    // Criar payload sem campos opcionais problemáticos
    const { nearbyAmenities, images, owner, agent, ...baseData } = terrenoData;
    
    const payload = {
      ...baseData,
      realEstateId: realEstateId
    };
    
    const response = await axios.post(`${API_BASE_URL}/terreno`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      return response.data.data.terreno;
    } else {
      throw new Error('Erro ao criar terreno');
    }
  } catch (error) {
    console.error('❌ Erro ao criar terreno:', terrenoData.name);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    throw error;
  }
}

// Dados dos 10 terrenos para criar
const terrenosData = [
  {
    name: 'Terreno Residencial Vila Madalena',
    title: 'Excelente terreno em localização privilegiada',
    description: 'Terreno plano com 300m² em uma das melhores regiões de São Paulo. Ideal para construção residencial.',
    type: 'residential',
    status: 'available',
    condition: 'ready_to_build',
    totalArea: 300,
    usableArea: 280,
    frontage: 12,
    depth: 25,
    topography: 'flat',
    soilType: 'clay',
    vegetation: 'grass',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'residential',
    buildingCoefficient: 2.0,
    occupancyRate: 0.5,
    setbackFront: 5,
    setbackSide: 1.5,
    setbackRear: 3,
    maxHeight: 12,
    address: {
      street: 'Rua Harmonia',
      number: '123',
      complement: '',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05435-000',
      country: 'Brasil'
    },
    value: 450000,
    pricePerSquareMeter: 1500,
    iptuValue: 2500,
    sunPosition: 'north',
    nearbyAmenities: [
      'Escola Municipal João Silva',
      'Colégio São Paulo', 
      'Hospital São Camilo',
      'UBS Central',
      'Shopping Center Norte',
      'Mercado Municipal',
      'Estação de Metrô',
      'Terminal de Ônibus'
    ],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: false,
    exclusiveProperty: false,
    highlightProperty: true,
    images: [
      'https://example.com/terreno1-main.jpg',
      'https://example.com/terreno1-1.jpg',
      'https://example.com/terreno1-2.jpg',
      'https://example.com/terreno1-3.jpg'
    ],
    owner: {
      name: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      phone: '+55 11 99999-1234',
      document: '123.456.789-00'
    }
  },
  {
    name: 'Terreno Comercial Pinheiros',
    title: 'Terreno comercial estratégico',
    description: 'Terreno comercial de 500m² em Pinheiros, próximo ao metrô. Excelente para investimento.',
    type: 'commercial',
    status: 'available',
    condition: 'ready_to_build',
    totalArea: 500,
    usableArea: 480,
    frontage: 20,
    depth: 25,
    topography: 'flat',
    soilType: 'mixed',
    vegetation: 'none',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'commercial',
    buildingCoefficient: 3.0,
    occupancyRate: 0.7,
    setbackFront: 3,
    setbackSide: 0,
    setbackRear: 3,
    maxHeight: 20,
    address: {
      street: 'Rua dos Pinheiros',
      number: '456',
      complement: '',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05422-000',
      country: 'Brasil'
    },
    value: 850000,
    pricePerSquareMeter: 1700,
    iptuValue: 4200,
    sunPosition: 'east',
    nearbyAmenities: ['Metro', 'Bancos', 'Restaurantes', 'Escritórios'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: true,
    exclusiveProperty: true,
    highlightProperty: true,
    images: []
  },
  {
    name: 'Terreno Industrial Guarulhos',
    title: 'Amplo terreno industrial',
    description: 'Terreno industrial de 1200m² em Guarulhos, com acesso facilitado para caminhões.',
    type: 'industrial',
    status: 'available',
    condition: 'clean',
    totalArea: 1200,
    usableArea: 1150,
    frontage: 30,
    depth: 40,
    topography: 'flat',
    soilType: 'sand',
    vegetation: 'none',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: false,
    internetAccess: true,
    zoning: 'industrial',
    buildingCoefficient: 1.5,
    occupancyRate: 0.6,
    setbackFront: 10,
    setbackSide: 5,
    setbackRear: 10,
    maxHeight: 15,
    address: {
      street: 'Avenida Industrial',
      number: '789',
      complement: '',
      neighborhood: 'Distrito Industrial',
      city: 'Guarulhos',
      state: 'SP',
      zipCode: '07110-000',
      country: 'Brasil'
    },
    value: 680000,
    pricePerSquareMeter: 567,
    iptuValue: 3400,
    sunPosition: 'south',
    nearbyAmenities: ['Rodovia', 'Porto Seco', 'Aeroporto'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: false,
    acceptsExchange: true,
    exclusiveProperty: false,
    highlightProperty: false,
    images: []
  },
  {
    name: 'Terreno Rural Cotia',
    title: 'Terreno rural para sítio',
    description: 'Terreno rural de 2000m² em Cotia, ideal para construção de sítio ou chácara.',
    type: 'rural',
    status: 'available',
    condition: 'with_project',
    totalArea: 2000,
    usableArea: 1900,
    frontage: 40,
    depth: 50,
    topography: 'sloped',
    soilType: 'clay',
    vegetation: 'trees',
    waterAccess: false,
    electricityAccess: true,
    sewerAccess: false,
    gasAccess: false,
    internetAccess: false,
    zoning: 'mixed',
    buildingCoefficient: 0.5,
    occupancyRate: 0.2,
    setbackFront: 15,
    setbackSide: 10,
    setbackRear: 15,
    maxHeight: 8,
    address: {
      street: 'Estrada do Morro Grande',
      number: '1000',
      complement: 'Km 5',
      neighborhood: 'Morro Grande',
      city: 'Cotia',
      state: 'SP',
      zipCode: '06709-015',
      country: 'Brasil'
    },
    value: 320000,
    pricePerSquareMeter: 160,
    iptuValue: 800,
    sunPosition: 'northeast',
    nearbyAmenities: ['Natureza', 'Trilhas', 'Cachoeira'],
    accessType: 'dirt',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: false,
    exclusiveProperty: false,
    highlightProperty: false,
    images: []
  },
  {
    name: 'Terreno Misto Itaim Bibi',
    title: 'Terreno uso misto premium',
    description: 'Terreno de uso misto no Itaim Bibi, 400m², ideal para empreendimento comercial/residencial.',
    type: 'mixed',
    status: 'available',
    condition: 'ready_to_build',
    totalArea: 400,
    usableArea: 380,
    frontage: 16,
    depth: 25,
    topography: 'flat',
    soilType: 'mixed',
    vegetation: 'grass',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'mixed',
    buildingCoefficient: 4.0,
    occupancyRate: 0.8,
    setbackFront: 5,
    setbackSide: 3,
    setbackRear: 5,
    maxHeight: 25,
    address: {
      street: 'Rua Iguatemi',
      number: '200',
      complement: '',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01451-010',
      country: 'Brasil'
    },
    value: 1200000,
    pricePerSquareMeter: 3000,
    iptuValue: 8000,
    sunPosition: 'west',
    nearbyAmenities: ['Shopping', 'Bancos', 'Restaurantes', 'Escritórios', 'Metro'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: true,
    exclusiveProperty: true,
    highlightProperty: true,
    images: []
  },
  {
    name: 'Terreno Residencial Moema',
    title: 'Terreno nobre em Moema',
    description: 'Terreno residencial de 350m² em Moema, bairro nobre com excelente infraestrutura.',
    type: 'residential',
    status: 'available',
    condition: 'ready_to_build',
    totalArea: 350,
    usableArea: 330,
    frontage: 14,
    depth: 25,
    topography: 'flat',
    soilType: 'clay',
    vegetation: 'grass',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'residential',
    buildingCoefficient: 2.5,
    occupancyRate: 0.5,
    setbackFront: 5,
    setbackSide: 1.5,
    setbackRear: 3,
    maxHeight: 15,
    address: {
      street: 'Rua Tuim',
      number: '567',
      complement: '',
      neighborhood: 'Moema',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04514-100',
      country: 'Brasil'
    },
    value: 750000,
    pricePerSquareMeter: 2143,
    iptuValue: 4500,
    sunPosition: 'north',
    nearbyAmenities: ['Parque', 'Shopping', 'Metro', 'Escolas'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: false,
    exclusiveProperty: false,
    highlightProperty: true,
    images: []
  },
  {
    name: 'Terreno Comercial Santana',
    title: 'Oportunidade comercial Santana',
    description: 'Terreno comercial de 600m² em Santana, próximo ao metrô e centro comercial.',
    type: 'commercial',
    status: 'available',
    condition: 'clean',
    totalArea: 600,
    usableArea: 580,
    frontage: 24,
    depth: 25,
    topography: 'flat',
    soilType: 'sand',
    vegetation: 'none',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'commercial',
    buildingCoefficient: 2.5,
    occupancyRate: 0.7,
    setbackFront: 3,
    setbackSide: 0,
    setbackRear: 3,
    maxHeight: 18,
    address: {
      street: 'Avenida Cruzeiro do Sul',
      number: '890',
      complement: '',
      neighborhood: 'Santana',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '02031-000',
      country: 'Brasil'
    },
    value: 540000,
    pricePerSquareMeter: 900,
    iptuValue: 3200,
    sunPosition: 'east',
    nearbyAmenities: ['Metro', 'Centro Comercial', 'Bancos'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: false,
    exclusiveProperty: false,
    highlightProperty: false,
    images: []
  },
  {
    name: 'Terreno Residencial Perdizes',
    title: 'Terreno em bairro tradicional',
    description: 'Terreno residencial de 280m² em Perdizes, bairro tradicional com boa valorização.',
    type: 'residential',
    status: 'available',
    condition: 'ready_to_build',
    totalArea: 280,
    usableArea: 260,
    frontage: 11.2,
    depth: 25,
    topography: 'flat',
    soilType: 'clay',
    vegetation: 'grass',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'residential',
    buildingCoefficient: 2.0,
    occupancyRate: 0.5,
    setbackFront: 5,
    setbackSide: 1.5,
    setbackRear: 3,
    maxHeight: 12,
    address: {
      street: 'Rua Cardoso de Almeida',
      number: '1234',
      complement: '',
      neighborhood: 'Perdizes',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05013-001',
      country: 'Brasil'
    },
    value: 420000,
    pricePerSquareMeter: 1500,
    iptuValue: 2800,
    sunPosition: 'south',
    nearbyAmenities: ['Metro', 'Universidade', 'Comércio'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: false,
    exclusiveProperty: false,
    highlightProperty: false,
    images: []
  },
  {
    name: 'Terreno Industrial São Bernardo',
    title: 'Terreno industrial ABC',
    description: 'Terreno industrial de 1500m² em São Bernardo do Campo, região do ABC paulista.',
    type: 'industrial',
    status: 'available',
    condition: 'ready_to_build',
    totalArea: 1500,
    usableArea: 1450,
    frontage: 30,
    depth: 50,
    topography: 'flat',
    soilType: 'mixed',
    vegetation: 'none',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'industrial',
    buildingCoefficient: 2.0,
    occupancyRate: 0.6,
    setbackFront: 10,
    setbackSide: 5,
    setbackRear: 10,
    maxHeight: 18,
    address: {
      street: 'Rua das Indústrias',
      number: '2000',
      complement: '',
      neighborhood: 'Distrito Industrial',
      city: 'São Bernardo do Campo',
      state: 'SP',
      zipCode: '09890-000',
      country: 'Brasil'
    },
    value: 900000,
    pricePerSquareMeter: 600,
    iptuValue: 5400,
    sunPosition: 'northwest',
    nearbyAmenities: ['Rodovia', 'Porto', 'Indústrias'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: false,
    acceptsExchange: true,
    exclusiveProperty: false,
    highlightProperty: false,
    images: []
  },
  {
    name: 'Terreno Misto Brooklin',
    title: 'Terreno corporativo Brooklin',
    description: 'Terreno de uso misto no Brooklin, 450m², ideal para empreendimento corporativo.',
    type: 'mixed',
    status: 'available',
    condition: 'with_project',
    totalArea: 450,
    usableArea: 430,
    frontage: 18,
    depth: 25,
    topography: 'flat',
    soilType: 'clay',
    vegetation: 'grass',
    waterAccess: true,
    electricityAccess: true,
    sewerAccess: true,
    gasAccess: true,
    internetAccess: true,
    zoning: 'mixed',
    buildingCoefficient: 3.5,
    occupancyRate: 0.7,
    setbackFront: 5,
    setbackSide: 3,
    setbackRear: 5,
    maxHeight: 22,
    address: {
      street: 'Rua Funchal',
      number: '1500',
      complement: '',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04551-060',
      country: 'Brasil'
    },
    value: 1350000,
    pricePerSquareMeter: 3000,
    iptuValue: 9500,
    sunPosition: 'southeast',
    nearbyAmenities: ['Escritórios', 'Shopping', 'Metro', 'Aeroporto'],
    accessType: 'paved',
    hasDocumentation: true,
    acceptsFinancing: true,
    acceptsExchange: true,
    exclusiveProperty: true,
    highlightProperty: true,
    images: []
  }
];

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando criação de terrenos para Adão Imóveis...');
    
    // 1. Fazer login
    const token = await login();
    
    // 2. Buscar imobiliárias e encontrar "Adão Imóveis"
    const realEstate = await getRealEstates(token);
    
    // 3. Criar os 10 terrenos
    console.log('\n🏗️  Criando terrenos...');
    const createdTerrenos = [];
    
    for (let i = 0; i < terrenosData.length; i++) {
      const terrenoData = terrenosData[i];
      try {
        console.log(`Criando terreno ${i + 1}/10: ${terrenoData.name}`);
        const terreno = await createTerreno(token, realEstate.id, terrenoData);
        createdTerrenos.push(terreno);
        console.log(`✅ Terreno criado: ${terreno.name} (ID: ${terreno.id})`);
      } catch (error) {
        console.error(`❌ Erro ao criar terreno ${i + 1}: ${terrenoData.name}`);
        console.error(error.message);
      }
    }
    
    console.log('\n📊 Resumo:');
    console.log(`✅ ${createdTerrenos.length} terrenos criados com sucesso`);
    console.log(`❌ ${terrenosData.length - createdTerrenos.length} terrenos falharam`);
    console.log(`🏢 Imobiliária: ${realEstate.name} (ID: ${realEstate.id})`);
    console.log(`👤 Usuário: ${USER_EMAIL}`);
    
    if (createdTerrenos.length > 0) {
      console.log('\n🏗️  Terrenos criados:');
      createdTerrenos.forEach((terreno, index) => {
        console.log(`${index + 1}. ${terreno.name} - R$ ${terreno.value.toLocaleString('pt-BR')} - ${terreno.totalArea}m²`);
      });
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error.message);
    process.exit(1);
  }
}

// Executar o script
main();