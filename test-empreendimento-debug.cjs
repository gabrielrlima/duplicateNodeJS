const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3001';

// Dados de teste específicos para empreendimento
const testData = {
  title: 'Teste Debug Empreendimento',
  description: 'Teste para debug do problema de persistência',
  type: 'empreendimento',
  name: 'Teste Debug Empreendimento',
  address: {
    street: 'Rua Teste',
    number: '123',
    complement: '',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    country: 'Brasil'
  },
  area: 100,
  value: 0,
  // Campos específicos de empreendimento
  construtora: 'Construtora Teste Debug',
  previsaoEntrega: '2025-12-31',
  unidadesDisponiveis: 25,
  availableUnits: 25,
  plantas: [
    {
      id: 'planta-1',
      area: 65,
      precoPorM2: 8500,
      descricao: 'Planta A - 2 quartos'
    }
  ],
  realEstateId: '68c4467199df1835267f3e48' // ID da Adão Imóveis
};

async function testEmpreendimentoDebug() {
  try {
    console.log('🧪 === TESTE DE DEBUG EMPREENDIMENTO ===');
    console.log('📋 Dados que serão enviados:', JSON.stringify(testData, null, 2));
    
    // 1. Primeiro, buscar um empreendimento existente
    console.log('\n🔍 1. Buscando empreendimentos existentes...');
    const listResponse = await axios.get(`${API_BASE}/api/products?type=empreendimento`);
    
    if (!listResponse.data.data || listResponse.data.data.length === 0) {
      console.log('⚠️ Nenhum empreendimento encontrado. Criando um novo...');
      
      const createResponse = await axios.post(`${API_BASE}/api/products`, testData);
      console.log('✅ Empreendimento criado:', createResponse.data.data.id);
      
      // Usar o ID do empreendimento recém-criado
      var empreendimentoId = createResponse.data.data.id;
    } else {
      var empreendimentoId = listResponse.data.data[0].id;
      console.log('✅ Usando empreendimento existente:', empreendimentoId);
    }
    
    // 2. Buscar dados atuais do empreendimento
    console.log('\n🔍 2. Buscando dados atuais do empreendimento...');
    const currentResponse = await axios.get(`${API_BASE}/api/products/${empreendimentoId}`);
    console.log('📋 Dados atuais:', JSON.stringify(currentResponse.data.data, null, 2));
    
    // 3. Testar atualização com dados específicos
    console.log('\n🔄 3. Testando atualização...');
    const updateData = {
      ...testData,
      construtora: 'NOVA CONSTRUTORA TESTE - ' + new Date().toISOString(),
      previsaoEntrega: '2026-06-30',
      unidadesDisponiveis: 50
    };
    
    console.log('📤 Dados de atualização:', JSON.stringify(updateData, null, 2));
    
    const updateResponse = await axios.put(`${API_BASE}/api/products/${empreendimentoId}`, updateData);
    console.log('✅ Resposta da atualização:', JSON.stringify(updateResponse.data, null, 2));
    
    // 4. Verificar se os dados foram persistidos
    console.log('\n🔍 4. Verificando persistência...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo
    
    const verifyResponse = await axios.get(`${API_BASE}/api/products/${empreendimentoId}`);
    const dadosVerificados = verifyResponse.data.data;
    
    console.log('📋 Dados após atualização:', JSON.stringify(dadosVerificados, null, 2));
    
    // 5. Comparar dados
    console.log('\n🔍 5. Comparação de dados:');
    console.log('   - Construtora enviada:', updateData.construtora);
    console.log('   - Construtora retornada:', dadosVerificados.construtora);
    console.log('   - Previsão enviada:', updateData.previsaoEntrega);
    console.log('   - Previsão retornada:', dadosVerificados.previsaoEntrega);
    console.log('   - Unidades enviadas:', updateData.unidadesDisponiveis);
    console.log('   - Unidades retornadas:', dadosVerificados.unidadesDisponiveis);
    
    // Verificar se os dados foram persistidos corretamente
    const persistiuConstrutora = dadosVerificados.construtora === updateData.construtora;
    const persistiuPrevisao = dadosVerificados.previsaoEntrega === updateData.previsaoEntrega;
    const persistiuUnidades = dadosVerificados.unidadesDisponiveis === updateData.unidadesDisponiveis;
    
    console.log('\n📊 RESULTADO DO TESTE:');
    console.log('   - Construtora persistiu:', persistiuConstrutora ? '✅' : '❌');
    console.log('   - Previsão persistiu:', persistiuPrevisao ? '✅' : '❌');
    console.log('   - Unidades persistiu:', persistiuUnidades ? '✅' : '❌');
    
    if (persistiuConstrutora && persistiuPrevisao && persistiuUnidades) {
      console.log('\n🎉 SUCESSO! Todos os dados foram persistidos corretamente.');
      console.log('   O problema pode estar no frontend (mapeamento de dados ou interface).');
    } else {
      console.log('\n🚨 PROBLEMA IDENTIFICADO! Alguns dados não foram persistidos.');
      console.log('   O problema está no backend (validação, schema ou salvamento).');
    }
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('📋 Detalhes dos erros:', error.response.data.errors);
    }
    if (error.response?.status) {
      console.error('📋 Status HTTP:', error.response.status);
    }
  }
}

// Executar o teste
testEmpreendimentoDebug();