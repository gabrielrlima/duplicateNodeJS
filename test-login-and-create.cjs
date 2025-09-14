const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const USER_EMAIL = 'gabriel@teste.com';
const USER_PASSWORD = '123456';

// Função para fazer login e obter token
async function login() {
  try {
    console.log('🔐 Fazendo login com gabriel@teste.com...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    
    if (response.data.success) {
      console.log('✅ Login realizado com sucesso!');
      console.log('👤 Usuário:', response.data.data.user.firstName, response.data.data.user.lastName);
      console.log('🏢 Imobiliária ID:', response.data.data.user.realEstateId);
      console.log('🔍 Estrutura completa da resposta:', JSON.stringify(response.data, null, 2));
      
      // Verificar diferentes estruturas possíveis
      const token = response.data.data.tokens?.token || response.data.data.token || response.data.token;
      const realEstateId = response.data.data.user?.realEstateId || response.data.data.realEstateId || '68c4467199df1835267f3e48';
      
      return {
        token: token,
        realEstateId: realEstateId
      };
    } else {
      throw new Error(response.data.message || 'Erro no login');
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

// Função para listar produtos existentes
async function listProducts(token, realEstateId) {
  try {
    console.log('📋 Listando produtos existentes...');
    const response = await axios.get(`${API_BASE_URL}/products?real_estate_id=${realEstateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log(`✅ Encontrados ${response.data.data.length} produtos`);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao listar produtos');
    }
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error.response?.data || error.message);
    return [];
  }
}

// Função para buscar detalhes de um produto específico
async function getProductDetails(token, productId, realEstateId) {
  try {
    console.log(`🔍 Buscando detalhes do produto ${productId}...`);
    const response = await axios.get(`${API_BASE_URL}/products/${productId}?real_estate_id=${realEstateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ Detalhes do produto obtidos com sucesso!');
      console.log('📝 Nome:', response.data.data.name);
      console.log('💰 Valor:', response.data.data.value);
      console.log('🏠 Tipo:', response.data.data.type);
      console.log('📍 Endereço:', response.data.data.address);
      console.log('🔑 Campos disponíveis:', Object.keys(response.data.data));
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao buscar produto');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error.response?.data || error.message);
    throw error;
  }
}

// Função para criar produto de teste se não existir nenhum
async function createTestProduct(token, realEstateId) {
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
      realEstateId: realEstateId
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
    // 1. Fazer login
    const { token, realEstateId } = await login();
    
    // 2. Listar produtos existentes
    const products = await listProducts(token, realEstateId);
    
    let testProduct;
    
    if (products.length > 0) {
      // Se há produtos, usar o primeiro para teste
      testProduct = products[0];
      console.log(`\n🎯 Usando produto existente para teste: ${testProduct.name}`);
      
      // Buscar detalhes completos do produto
      testProduct = await getProductDetails(token, testProduct.id, realEstateId);
    } else {
      // Se não há produtos, criar um
      console.log('\n📝 Nenhum produto encontrado, criando produto de teste...');
      testProduct = await createTestProduct(token, realEstateId);
    }
    
    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('🔗 URL para editar:', `http://localhost:3000/dashboard/property/${testProduct.id}/edit`);
    console.log('🔑 Token para usar no frontend:', token);
    
    // Salvar token no arquivo para uso manual
    const fs = require('fs');
    fs.writeFileSync('auth-token.txt', token);
    console.log('💾 Token salvo em auth-token.txt');
    
  } catch (error) {
    console.error('💥 Erro geral:', error.message);
    process.exit(1);
  }
}

// Executar script
main();