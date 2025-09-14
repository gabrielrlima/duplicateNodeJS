#!/usr/bin/env tsx
/**
 * Script para criar produtos usando o NOVO formulário de propriedades
 * Usa os campos corretos: titulo, preco, localizacao, descricao, tipo, etc.
 */

import axios from 'axios';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configurações
const API_BASE_URL = 'http://localhost:3001';
const API_TOKEN = process.env.API_TOKEN;

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Dados para o NOVO formulário (usando os campos corretos)
const produtosNovos = [
  {
    tipo: 'imovel',
    titulo: 'Casa Moderna 3 Quartos - Jardim Europa',
    preco: 850000,
    localizacao: 'Rua das Flores, 123 - Jardim Europa, São Paulo - SP',
    descricao: 'Linda casa moderna com 3 quartos, 2 banheiros, garagem para 2 carros. Localizada em bairro nobre com excelente infraestrutura.',
    quartos: 3,
    banheiros: 2,
    garagem: 2,
    areaConstruida: 180
  },
  {
    tipo: 'imovel',
    titulo: 'Apartamento Cobertura - Ipanema',
    preco: 2500000,
    localizacao: 'Rua Visconde de Pirajá, 456 - Ipanema, Rio de Janeiro - RJ',
    descricao: 'Cobertura duplex com vista para o mar, 4 suítes, piscina privativa, churrasqueira e 3 vagas de garagem.',
    quartos: 4,
    banheiros: 5,
    garagem: 3,
    areaConstruida: 320
  },
  {
    tipo: 'imovel',
    titulo: 'Casa Térrea - Alphaville',
    preco: 1200000,
    localizacao: 'Alameda dos Anjos, 789 - Alphaville, Barueri - SP',
    descricao: 'Casa térrea em condomínio fechado, 4 quartos sendo 2 suítes, piscina, área gourmet completa.',
    quartos: 4,
    banheiros: 3,
    garagem: 4,
    areaConstruida: 280
  },
  {
    tipo: 'imovel',
    titulo: 'Apartamento Studio - Vila Madalena',
    preco: 450000,
    localizacao: 'Rua Harmonia, 321 - Vila Madalena, São Paulo - SP',
    descricao: 'Studio moderno e funcional, totalmente mobiliado, em prédio novo com academia e rooftop.',
    quartos: 1,
    banheiros: 1,
    garagem: 1,
    areaConstruida: 45
  },
  {
    tipo: 'terreno',
    titulo: 'Terreno 500m² - Granja Viana',
    preco: 400000,
    localizacao: 'Estrada da Granja Viana, 1000 - Granja Viana, Cotia - SP',
    descricao: 'Terreno plano de 500m² em condomínio fechado, pronto para construir. Excelente localização.',
    area: 500,
    frente: 20,
    tipoSolo: 'plano',
    zoneamento: 'Residencial'
  },
  {
    tipo: 'terreno',
    titulo: 'Terreno Comercial 1000m² - Centro',
    preco: 800000,
    localizacao: 'Avenida Principal, 2000 - Centro, São Paulo - SP',
    descricao: 'Terreno comercial de 1000m² em avenida movimentada, ideal para empreendimentos comerciais.',
    area: 1000,
    frente: 25,
    tipoSolo: 'plano',
    zoneamento: 'Comercial'
  },
  {
    tipo: 'empreendimento',
    titulo: 'Residencial Jardim das Flores',
    localizacao: 'Rua das Palmeiras, 500 - Jardim das Flores, São Paulo - SP',
    descricao: 'Empreendimento residencial com 120 unidades, área de lazer completa, segurança 24h.',
    construtora: 'Cyrela',
    previsaoEntrega: '2025-12-31',
    unidadesDisponiveis: 45,
    plantas: [
      {
        area: 65,
        precoPorM2: 8000,
        descricao: '2 quartos, 1 banheiro, sala, cozinha'
      },
      {
        area: 85,
        precoPorM2: 7500,
        descricao: '3 quartos, 2 banheiros, sala, cozinha'
      }
    ]
  },
  {
    tipo: 'empreendimento',
    titulo: 'Centro Comercial Vila Nova',
    localizacao: 'Avenida Comercial, 1500 - Vila Nova, São Paulo - SP',
    descricao: 'Centro comercial moderno com 50 lojas, praça de alimentação, estacionamento para 200 carros.',
    construtora: 'PDG',
    previsaoEntrega: '2026-06-30',
    unidadesDisponiveis: 25,
    plantas: [
      {
        area: 40,
        precoPorM2: 12000,
        descricao: 'Loja térrea com vitrine'
      },
      {
        area: 80,
        precoPorM2: 10000,
        descricao: 'Loja de esquina dupla'
      }
    ]
  },
  {
    tipo: 'imovel',
    titulo: 'Sobrado Geminado - Mooca',
    preco: 680000,
    localizacao: 'Rua da Mooca, 654 - Mooca, São Paulo - SP',
    descricao: 'Sobrado geminado com 3 dormitórios, quintal, área de serviço e garagem coberta.',
    quartos: 3,
    banheiros: 2,
    garagem: 1,
    areaConstruida: 150
  },
  {
    tipo: 'imovel',
    titulo: 'Loft Industrial - Bela Vista',
    preco: 520000,
    localizacao: 'Rua Augusta, 987 - Bela Vista, São Paulo - SP',
    descricao: 'Loft com conceito industrial, pé direito alto, mezanino, ideal para profissionais criativos.',
    quartos: 1,
    banheiros: 1,
    garagem: 1,
    areaConstruida: 85
  }
];

// Função para obter ID da imobiliária atual
async function getCurrentRealEstateId(): Promise<string | null> {
  try {
    console.log('🔍 Buscando imobiliárias do usuário...');
    const response = await api.get('/api/real-estate');
    
    if (response.data.success && response.data.data.realEstates.length > 0) {
      const realEstate = response.data.data.realEstates[0];
      console.log(`✅ Imobiliária encontrada: ${realEstate.name} (${realEstate.id})`);
      return realEstate.id;
    } else {
      console.error('❌ Nenhuma imobiliária encontrada');
      return null;
    }
  } catch (error: any) {
    console.error('❌ Erro ao buscar imobiliárias:', error.response?.data?.message || error.message);
    return null;
  }
}

// Função para mapear dados do frontend para o backend (igual ao frontend)
function mapFrontendToBackend(frontendData: any) {
  const typeMapping: Record<string, string> = {
    'imovel': 'house',
    'terreno': 'land',
    'empreendimento': 'commercial',
    'apartamento': 'apartment',
    'casa': 'house',
    'comercial': 'commercial'
  };
  
  const backendData = {
    name: frontendData.titulo || frontendData.name || '',
    title: frontendData.titulo || frontendData.title || '',
    description: frontendData.descricao || frontendData.description || 'Propriedade criada via sistema',
    type: typeMapping[frontendData.tipo] || frontendData.type || 'house',
    status: 'available',
    area: Number(frontendData.area || frontendData.areaConstruida || 0),
    builtArea: Number(frontendData.areaConstruida || frontendData.area || 0),
    value: Number(frontendData.preco || frontendData.value || 0),
    bedrooms: Number(frontendData.quartos || frontendData.bedrooms || 0),
    bathrooms: Number(frontendData.banheiros || frontendData.bathrooms || 0),
    parkingSpaces: Number(frontendData.garagem || frontendData.parkingSpaces || 0),
    elevator: false,
    furnished: false,
    hasBalcony: false,
    acceptsFinancing: true,
    acceptsExchange: false,
    exclusiveProperty: false,
    highlightProperty: false,
    address: {
      street: frontendData.localizacao || 'Não informado',
      number: 'S/N',
      complement: '',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      country: 'Brasil'
    },
    realEstateId: frontendData.realEstateId || ''
  };
  
  return backendData;
}

// Função para criar um produto usando o novo formulário
async function createProduct(productData: any, realEstateId: string): Promise<boolean> {
  try {
    // Adicionar realEstateId aos dados
    const dataWithRealEstate = {
      ...productData,
      realEstateId
    };
    
    // Mapear dados do frontend para o formato do backend
    const mappedData = mapFrontendToBackend(dataWithRealEstate);
    
    console.log('📤 Dados mapeados para backend:', JSON.stringify(mappedData, null, 2));
    
    const response = await api.post('/api/property', mappedData);
    
    if (response.data.success) {
      return true;
    } else {
      throw new Error(response.data.message || 'Erro desconhecido');
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error('❌ Erro ao criar produto:', errorMsg);
    return false;
  }
}

// Função principal de seeding
async function seedNewFormProducts() {
  console.log('🚀 Criando produtos com o NOVO formulário...');
  console.log('=' .repeat(50));
  
  // Verificar token de autenticação
  if (!API_TOKEN) {
    console.error('❌ Token de API não encontrado. Configure a variável API_TOKEN no .env');
    process.exit(1);
  }
  
  // Obter ID da imobiliária
  const realEstateId = await getCurrentRealEstateId();
  if (!realEstateId) {
    console.error('❌ Não foi possível obter o ID da imobiliária');
    process.exit(1);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  console.log('\n🏠 Criando produtos...');
  
  for (let i = 0; i < produtosNovos.length; i++) {
    const produto = produtosNovos[i];
    console.log(`\n   ${i + 1}/${produtosNovos.length} - ${produto.titulo}`);
    console.log(`   📍 Tipo: ${produto.tipo}`);
    
    const success = await createProduct(produto, realEstateId);
    
    if (success) {
      successCount++;
      console.log(`   ✅ Criado com sucesso`);
    } else {
      errorCount++;
      console.log(`   ❌ Falha na criação`);
    }
    
    // Pausa entre criações
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Resumo da execução:');
  console.log(`   ✅ Produtos criados: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📈 Total processado: ${successCount + errorCount}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Seeding concluído com sucesso!');
    console.log('💡 Acesse http://localhost:8080 para visualizar os produtos criados.');
  } else {
    console.log('\n⚠️ Nenhum produto foi criado.');
    console.log('💡 Verifique o token de autenticação e tente novamente.');
  }
}

// Executar o seeding
seedNewFormProducts();