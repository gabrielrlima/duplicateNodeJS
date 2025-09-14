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

// Função para criar um produto de teste simples
async function createTestProperty(realEstateId: string): Promise<boolean> {
  try {
    const testProperty = {
      name: 'Teste - Apartamento 2 quartos',
      title: 'Teste - Apartamento 2 quartos',
      description: 'Apartamento de teste criado pelo script de seeding',
      type: 'apartment',
      status: 'available',
      area: 80,
      builtArea: 80,
      value: 350000,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      elevator: true,
      furnished: false,
      hasBalcony: true,
      address: {
        street: 'Rua de Teste',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        country: 'Brasil'
      },
      acceptsFinancing: true,
      acceptsExchange: false,
      exclusiveProperty: false,
      highlightProperty: false,
      realEstateId,
      pricePerSquareMeter: 4375,
      condominiumFee: 400,
      iptuValue: 200
    };
    
    console.log('📤 Criando produto de teste...');
    const response = await api.post('/api/property', testProperty);
    
    if (response.data.success) {
      console.log('✅ Produto de teste criado com sucesso!');
      console.log('📋 ID do produto:', response.data.data.property.id);
      return true;
    } else {
      console.error('❌ Erro ao criar produto:', response.data.message);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar produto de teste:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('📋 Detalhes do erro:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Função principal de teste
async function testSeed() {
  console.log('🧪 Iniciando teste do script de seeding...');
  console.log('=' .repeat(50));
  
  // Verificar configurações
  console.log('🔧 Configurações:');
  console.log(`   API Base URL: ${API_BASE_URL}`);
  console.log(`   Token configurado: ${API_TOKEN ? 'Sim' : 'Não'}`);
  
  if (!API_TOKEN) {
    console.error('\n❌ Token de API não encontrado!');
    console.log('💡 Para configurar o token:');
    console.log('   1. Faça login no sistema');
    console.log('   2. Abra as ferramentas de desenvolvedor (F12)');
    console.log('   3. Vá para Application > Session Storage');
    console.log('   4. Copie o valor de "sanctum_access_token"');
    console.log('   5. Adicione no .env: API_TOKEN=seu_token_aqui');
    process.exit(1);
  }
  
  // Obter ID da imobiliária
  const realEstateId = await getCurrentRealEstateId();
  if (!realEstateId) {
    console.error('\n❌ Não foi possível obter o ID da imobiliária.');
    console.log('💡 Certifique-se de:');
    console.log('   1. Estar logado no sistema');
    console.log('   2. Ter pelo menos uma imobiliária cadastrada');
    console.log('   3. O token estar válido e não expirado');
    process.exit(1);
  }
  
  // Criar produto de teste
  console.log('\n🏠 Testando criação de produto...');
  const success = await createTestProperty(realEstateId);
  
  // Resultado final
  console.log('\n' + '=' .repeat(50));
  if (success) {
    console.log('🎉 Teste concluído com sucesso!');
    console.log('✅ O script de seeding está funcionando corretamente.');
    console.log('💡 Agora você pode executar: npm run seed:products');
  } else {
    console.log('❌ Teste falhou!');
    console.log('💡 Verifique os logs acima para identificar o problema.');
  }
}

// Executar o teste
testSeed().catch((error) => {
  console.error('💥 Erro fatal no teste:', error);
  process.exit(1);
});

export { testSeed };