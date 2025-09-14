const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Função para simular o mapeamento do frontend
function simulateFrontendMapping(formData) {
  console.log('🎯 === SIMULANDO MAPEAMENTO DO FRONTEND ===');
  console.log('📥 Dados do formulário:', JSON.stringify(formData, null, 2));
  
  // Simular sanitizeAndValidateData do frontend
  const sanitizedData = {
    ...formData,
    tipo: formData.tipo || 'empreendimento',
    construtora: String(formData.construtora || '').trim(),
    previsaoEntrega: formData.previsaoEntrega || new Date().toISOString().split('T')[0],
    unidadesDisponiveis: Number(formData.unidadesDisponiveis) || 0
  };
  
  console.log('🧹 Dados sanitizados:', JSON.stringify(sanitizedData, null, 2));
  
  // Simular mapeamento para formato do backend
  const baseData = {
    name: sanitizedData.titulo || 'Teste Frontend Flow',
    title: sanitizedData.titulo,
    description: sanitizedData.descricao,
    type: sanitizedData.tipo,
    area: Number(sanitizedData.areaConstruida) || 100,
    value: Number(sanitizedData.preco) || 0,
    address: {
      street: sanitizedData.endereco || 'Rua Teste Frontend',
      number: sanitizedData.numero || '123',
      complement: sanitizedData.complemento || '',
      neighborhood: sanitizedData.bairro || 'Centro',
      city: sanitizedData.cidade || 'São Paulo',
      state: sanitizedData.estado || 'SP',
      zipCode: sanitizedData.cep || '01000-000',
      country: 'Brasil'
    },
    realEstateId: '507f1f77bcf86cd799439011' // ID fictício
  };
  
  // Adicionar campos específicos de empreendimento
  if (sanitizedData.tipo === 'empreendimento') {
    const mappedData = {
      ...baseData,
      construtora: String(sanitizedData.construtora || '').trim(),
      previsaoEntrega: sanitizedData.previsaoEntrega,
      unidadesDisponiveis: Math.max(0, Math.floor(Number(sanitizedData.unidadesDisponiveis))),
      plantas: Array.isArray(sanitizedData.plantas) ? sanitizedData.plantas : []
    };
    
    console.log('🏢 Dados mapeados para empreendimento:', JSON.stringify(mappedData, null, 2));
    return mappedData;
  }
  
  return baseData;
}

// Função para testar o fluxo completo
async function testFrontendFlow() {
  try {
    console.log('🧪 === TESTE DO FLUXO FRONTEND → BACKEND ===\n');
    
    // 1. Buscar um empreendimento existente
    console.log('🔍 1. Buscando empreendimento existente...');
    const searchResponse = await axiosInstance.get('/products?type=empreendimento&limit=1');
    
    if (!searchResponse.data.success || !searchResponse.data.data.length) {
      throw new Error('Nenhum empreendimento encontrado');
    }
    
    const existingProperty = searchResponse.data.data[0];
    console.log('✅ Empreendimento encontrado:', existingProperty.id);
    console.log('📋 Dados atuais:');
    console.log('   - construtora:', existingProperty.construtora);
    console.log('   - previsaoEntrega:', existingProperty.previsaoEntrega);
    console.log('   - unidadesDisponiveis:', existingProperty.unidadesDisponiveis);
    
    // 2. Simular dados do formulário (como se viessem do React Hook Form)
    const formData = {
      titulo: 'Teste Frontend Flow - ' + new Date().toISOString(),
      tipo: 'empreendimento',
      construtora: 'CONSTRUTORA TESTE FRONTEND - ' + Date.now(),
      previsaoEntrega: '2025-12-31',
      unidadesDisponiveis: 150,
      areaConstruida: 200,
      preco: 500000,
      endereco: 'Rua Frontend Test',
      numero: '456',
      bairro: 'Bairro Teste',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000'
    };
    
    console.log('\n🎯 2. Simulando dados do formulário...');
    console.log('📝 Dados do formulário:', JSON.stringify(formData, null, 2));
    
    // 3. Aplicar mapeamento do frontend
    const mappedData = simulateFrontendMapping(formData);
    
    // 4. Enviar para o backend
    console.log('\n📤 3. Enviando dados mapeados para o backend...');
    console.log('🔗 URL:', `${API_BASE_URL}/products/${existingProperty.id}`);
    console.log('📦 Payload:', JSON.stringify(mappedData, null, 2));
    
    const updateResponse = await axiosInstance.put(`/products/${existingProperty.id}`, mappedData);
    
    console.log('✅ Resposta do backend:', updateResponse.status, updateResponse.statusText);
    console.log('📋 Dados retornados:');
    console.log('   - construtora:', updateResponse.data.data?.construtora);
    console.log('   - previsaoEntrega:', updateResponse.data.data?.previsaoEntrega);
    console.log('   - unidadesDisponiveis:', updateResponse.data.data?.unidadesDisponiveis);
    
    // 5. Verificar se os dados foram persistidos
    console.log('\n🔍 4. Verificando persistência dos dados...');
    const verifyResponse = await axiosInstance.get(`/products/${existingProperty.id}`);
    
    console.log('📋 Dados verificados:');
    console.log('   - construtora:', verifyResponse.data.data?.construtora);
    console.log('   - previsaoEntrega:', verifyResponse.data.data?.previsaoEntrega);
    console.log('   - unidadesDisponiveis:', verifyResponse.data.data?.unidadesDisponiveis);
    
    // 6. Comparar dados enviados vs persistidos
    console.log('\n📊 5. Comparação final:');
    const sentConstrutora = mappedData.construtora;
    const persistedConstrutora = verifyResponse.data.data?.construtora;
    const sentPrevisao = mappedData.previsaoEntrega;
    const persistedPrevisao = verifyResponse.data.data?.previsaoEntrega;
    const sentUnidades = mappedData.unidadesDisponiveis;
    const persistedUnidades = verifyResponse.data.data?.unidadesDisponiveis;
    
    console.log('   - Construtora:');
    console.log('     Enviado:', sentConstrutora);
    console.log('     Persistido:', persistedConstrutora);
    console.log('     Status:', sentConstrutora === persistedConstrutora ? '✅ OK' : '❌ FALHA');
    
    console.log('   - Previsão Entrega:');
    console.log('     Enviado:', sentPrevisao);
    console.log('     Persistido:', persistedPrevisao);
    console.log('     Status:', sentPrevisao === persistedPrevisao ? '✅ OK' : '❌ FALHA');
    
    console.log('   - Unidades Disponíveis:');
    console.log('     Enviado:', sentUnidades);
    console.log('     Persistido:', persistedUnidades);
    console.log('     Status:', sentUnidades === persistedUnidades ? '✅ OK' : '❌ FALHA');
    
    // Resultado final
    const allFieldsOk = (
      sentConstrutora === persistedConstrutora &&
      sentPrevisao === persistedPrevisao &&
      sentUnidades === persistedUnidades
    );
    
    console.log('\n🎯 RESULTADO FINAL:');
    if (allFieldsOk) {
      console.log('🎉 SUCESSO! Todos os campos foram persistidos corretamente.');
      console.log('   O problema pode estar na interface do usuário ou no carregamento dos dados.');
    } else {
      console.log('🚨 FALHA! Alguns campos não foram persistidos.');
      console.log('   O problema está no fluxo de dados entre frontend e backend.');
    }
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Data:', error.response.data);
    }
  }
}

// Executar o teste
testFrontendFlow();