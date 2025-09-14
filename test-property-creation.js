const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';

// Token de autenticação (você precisa pegar um token válido)
const AUTH_TOKEN = 'seu_token_aqui'; // Substitua por um token válido

// Dados de teste que seguem o schema do backend
const testPropertyData = {
  name: 'Casa de Teste',
  title: 'Casa de Teste - 3 Quartos',
  description: 'Casa para teste de criação via API',
  type: 'house',
  status: 'available',
  condition: 'new',
  area: 120,
  builtArea: 100,
  bedrooms: 3,
  bathrooms: 2,
  parkingSpaces: 2,
  elevator: false,
  furnished: false,
  hasBalcony: false,
  address: {
    street: 'Rua de Teste',
    number: '123',
    complement: 'Apto 101',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'Brasil'
  },
  value: 350000,
  salePrice: 350000,
  acceptsFinancing: true,
  acceptsExchange: false,
  exclusiveProperty: false,
  highlightProperty: false,
  realEstateId: '507f1f77bcf86cd799439011' // ID de teste - substitua por um ID válido
};

// Função para testar a criação de propriedade
async function testPropertyCreation() {
  try {
    console.log('🧪 Testando criação de propriedade...');
    console.log('📋 Dados de teste:', JSON.stringify(testPropertyData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/property`, testPropertyData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('✅ Sucesso! Propriedade criada:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao criar propriedade:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados do erro:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Erro de rede:', error.request);
    } else {
      console.error('Erro:', error.message);
    }
  }
}

// Função para testar com dados do frontend
async function testWithFrontendData() {
  try {
    console.log('\n🧪 Testando com dados similares ao frontend...');
    
    // Dados similares ao que o frontend está enviando
    const frontendLikeData = {
      name: 'Apartamento Vila Madalena',
      title: 'Apartamento Vila Madalena',
      description: 'Apartamento moderno com 2 quartos',
      type: 'apartment',
      status: 'available',
      area: 80,
      value: 450000,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      address: {
        street: 'Rua Augusta',
        number: '1000',
        neighborhood: 'Vila Madalena',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-100'
      },
      realEstateId: '507f1f77bcf86cd799439011' // Substitua por um ID válido
    };
    
    console.log('📋 Dados frontend-like:', JSON.stringify(frontendLikeData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/property`, frontendLikeData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('✅ Sucesso com dados frontend-like!');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro com dados frontend-like:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados do erro:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Erro:', error.message);
    }
  }
}

// Executar os testes
if (require.main === module) {
  console.log('🚀 Iniciando testes de criação de propriedade...');
  console.log('⚠️  IMPORTANTE: Substitua AUTH_TOKEN por um token válido antes de executar!');
  console.log('⚠️  IMPORTANTE: Substitua realEstateId por um ID válido da sua base de dados!');
  console.log('');
  
  // Descomente as linhas abaixo após configurar o token
  // testPropertyCreation();
  // testWithFrontendData();
  
  console.log('ℹ️  Configure o token e IDs válidos, depois descomente as funções de teste.');
}

module.exports = {
  testPropertyCreation,
  testWithFrontendData
};