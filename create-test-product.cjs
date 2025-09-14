const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:5000/api';
const USER_EMAIL = 'gabriel@teste.com';
const USER_PASSWORD = '123456';

// Função para fazer login e obter token
async function login() {
  try {
    console.log('🔐 Fazendo login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    
    if (response.data.success) {
      console.log('✅ Login realizado com sucesso!');
      console.log('👤 Usuário:', response.data.data.user.firstName, response.data.data.user.lastName);
      return response.data.data.tokens.token;
    } else {
      throw new Error(response.data.message || 'Erro no login');
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

// Função para criar produto de teste
async function createTestProduct(token) {
  try {
    console.log('🏠 Criando produto de teste...');
    
    const productData = {
      name: 'Casa de Teste para Edição',
      title: 'Casa de Teste - 3 Quartos, 2 Banheiros',
      description: 'Casa criada para testar a funcionalidade de edição do formulário',
      type: 'imovel',
      status: 'available',
      condition: 'new',
      area: 150,
      builtArea: 120,
      value: 350000,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      elevator: false,
      furnished: false,
      hasBalcony: true,
      acceptsFinancing: true,
      acceptsExchange: false,
      exclusiveProperty: false,
      highlightProperty: false,
      address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        country: 'Brasil'
      },
      realEstateId: '68c4467199df1835267f3e48'
    };
    
    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ Produto criado com sucesso!');
      console.log('🆔 ID do produto:', response.data.data.id);
      console.log('📝 Nome:', response.data.data.name);
      console.log('💰 Valor:', response.data.data.value);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao criar produto');
    }
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error.response?.data || error.message);
    throw error;
  }
}

// Função principal
async function main() {
  try {
    const token = await login();
    const product = await createTestProduct(token);
    
    console.log('\n🎉 Produto de teste criado com sucesso!');
    console.log('🔗 URL para editar:', `http://localhost:3000/dashboard/property/${product.id}/edit`);
    
  } catch (error) {
    console.error('💥 Erro geral:', error.message);
    process.exit(1);
  }
}

// Executar script
main();