const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const FRONTEND_URL = 'http://localhost:8081';

// ID do produto problemático
const PROBLEMATIC_PRODUCT_ID = '68c5d2da346a055c4bd815ba';
const REAL_ESTATE_ID = '68c4467199df1835267f3e48';

// Função para fazer login e obter token
async function login() {
  try {
    console.log('🔐 Fazendo login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'gabriel@teste.com',
      password: '123456'
    });
    
    if (response.data.success) {
      console.log('✅ Login realizado com sucesso');
      return response.data.data.token;
    } else {
      throw new Error('Falha no login: ' + response.data.message);
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

// Função para buscar dados do produto
async function getProduct(token, productId) {
  try {
    console.log(`🔍 Buscando produto ${productId}...`);
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Produto encontrado:', response.data.data.title);
      return response.data.data;
    } else {
      throw new Error('Produto não encontrado: ' + response.data.message);
    }
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar atualização com dados mínimos
async function testMinimalUpdate(token, productId, originalData) {
  try {
    console.log('\n🧪 TESTE 1: Atualização com dados mínimos');
    
    const minimalData = {
      name: originalData.title || originalData.name || 'Teste Empreendimento',
      title: originalData.title || 'Teste Empreendimento',
      description: originalData.description || 'Descrição teste',
      type: 'empreendimento',
      area: 100, // Campo obrigatório
      value: 0, // Campo obrigatório
      address: {
        street: 'Rua Teste',
        number: '123',
        complement: '',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'SP',
        zipCode: '12345-678',
        country: 'Brasil'
      },
      construtora: 'Construtora Teste',
      previsaoEntrega: new Date().toISOString(),
      unidadesDisponiveis: 10,
      plantas: []
    };
    
    console.log('📤 Enviando dados mínimos:', JSON.stringify(minimalData, null, 2));
    
    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, minimalData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ TESTE 1 PASSOU: Atualização com dados mínimos funcionou!');
      return true;
    } else {
      console.log('❌ TESTE 1 FALHOU:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ TESTE 1 ERRO:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      details: error.response?.data
    });
    return false;
  }
}

// Função para testar atualização com dados originais
async function testOriginalDataUpdate(token, productId, originalData) {
  try {
    console.log('\n🧪 TESTE 2: Atualização com dados originais');
    
    // Simular o mapeamento que o frontend faz - seguindo o schema do backend
    const mappedData = {
      name: originalData.title || originalData.name || 'Produto Teste',
      title: originalData.title,
      description: originalData.description,
      type: originalData.type,
      area: Number(originalData.area) || 100, // Campo obrigatório no backend
      value: Number(originalData.value) || 0, // Campo obrigatório no backend
      address: {
        street: originalData.address?.street || 'Rua Teste',
        number: originalData.address?.number || '123',
        complement: originalData.address?.complement || '',
        neighborhood: originalData.address?.neighborhood || 'Bairro Teste',
        city: originalData.address?.city || 'Cidade Teste',
        state: originalData.address?.state || 'SP',
        zipCode: originalData.address?.zipCode || '12345-678',
        country: 'Brasil'
      },
      construtora: originalData.construtora || '',
      previsaoEntrega: originalData.previsaoEntrega || new Date().toISOString(),
      unidadesDisponiveis: Number(originalData.unidadesDisponiveis) || 0,
      plantas: originalData.plantas || []
    };
    
    console.log('📤 Enviando dados originais mapeados:', JSON.stringify(mappedData, null, 2));
    
    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, mappedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ TESTE 2 PASSOU: Atualização com dados originais funcionou!');
      return true;
    } else {
      console.log('❌ TESTE 2 FALHOU:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ TESTE 2 ERRO:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      details: error.response?.data
    });
    return false;
  }
}

// Função para testar campos problemáticos
async function testProblematicFields(token, productId) {
  try {
    console.log('\n🧪 TESTE 3: Campos problemáticos (NaN, null, undefined)');
    
    const problematicData = {
      name: 'Teste Campos Problemáticos', // Campo obrigatório
      title: 'Teste Campos Problemáticos',
      description: 'Teste com campos inválidos',
      type: 'empreendimento',
      area: 100, // Campo obrigatório
      value: 0, // Campo obrigatório
      address: {
        street: 'Rua Teste',
        number: '123',
        complement: '',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'SP',
        zipCode: '12345-678',
        country: 'Brasil'
      },
      construtora: null, // Campo problemático
      previsaoEntrega: undefined, // Campo problemático
      unidadesDisponiveis: NaN, // Campo problemático
      plantas: null // Campo problemático
    };
    
    console.log('📤 Enviando dados problemáticos:', JSON.stringify(problematicData, null, 2));
    
    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, problematicData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ TESTE 3 PASSOU: Backend lidou bem com campos problemáticos!');
      return true;
    } else {
      console.log('❌ TESTE 3 FALHOU:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ TESTE 3 ERRO:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      details: error.response?.data
    });
    return false;
  }
}

// Função principal
async function main() {
  try {
    console.log('🚀 INICIANDO TESTE DO PRODUTO PROBLEMÁTICO');
    console.log('=' .repeat(60));
    
    // 1. Fazer login
    const token = await login();
    
    // 2. Buscar dados do produto
    const originalData = await getProduct(token, PROBLEMATIC_PRODUCT_ID);
    
    console.log('\n📋 DADOS ORIGINAIS DO PRODUTO:');
    console.log('   - ID:', originalData._id);
    console.log('   - Título:', originalData.title);
    console.log('   - Tipo:', originalData.type);
    console.log('   - Construtora:', originalData.construtora);
    console.log('   - Previsão Entrega:', originalData.previsaoEntrega);
    console.log('   - Unidades Disponíveis:', originalData.unidadesDisponiveis);
    console.log('   - Plantas:', originalData.plantas?.length || 0, 'itens');
    console.log('   - Endereço:', originalData.address);
    
    // 3. Executar testes
    const results = {
      minimalUpdate: await testMinimalUpdate(token, PROBLEMATIC_PRODUCT_ID, originalData),
      originalDataUpdate: await testOriginalDataUpdate(token, PROBLEMATIC_PRODUCT_ID, originalData),
      problematicFields: await testProblematicFields(token, PROBLEMATIC_PRODUCT_ID)
    };
    
    // 4. Resumo dos resultados
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RESUMO DOS TESTES:');
    console.log('   - Dados mínimos:', results.minimalUpdate ? '✅ PASSOU' : '❌ FALHOU');
    console.log('   - Dados originais:', results.originalDataUpdate ? '✅ PASSOU' : '❌ FALHOU');
    console.log('   - Campos problemáticos:', results.problematicFields ? '✅ PASSOU' : '❌ FALHOU');
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 RESULTADO FINAL: ${passedTests}/${totalTests} testes passaram`);
    
    if (passedTests === totalTests) {
      console.log('🎉 TODOS OS TESTES PASSARAM! O problema foi resolvido.');
    } else {
      console.log('⚠️  Alguns testes falharam. Investigação adicional necessária.');
    }
    
  } catch (error) {
    console.error('💥 ERRO GERAL:', error.message);
    process.exit(1);
  }
}

// Executar o teste
if (require.main === module) {
  main();
}

module.exports = { main, login, getProduct, testMinimalUpdate, testOriginalDataUpdate, testProblematicFields };