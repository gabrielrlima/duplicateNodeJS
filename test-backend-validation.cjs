const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3001';

// Teste específico para validação do backend
async function testBackendValidation() {
  try {
    console.log('🧪 === TESTE DE VALIDAÇÃO DO BACKEND ===');
    
    // 1. Buscar um empreendimento existente
    console.log('\n🔍 1. Buscando empreendimento existente...');
    const listResponse = await axios.get(`${API_BASE}/api/products?type=empreendimento`);
    
    if (!listResponse.data.data || listResponse.data.data.length === 0) {
      console.log('❌ Nenhum empreendimento encontrado para teste');
      return;
    }
    
    const empreendimento = listResponse.data.data[0];
    console.log('✅ Empreendimento encontrado:', empreendimento.id);
    console.log('📋 Dados atuais:');
    console.log('   - construtora:', empreendimento.construtora);
    console.log('   - previsaoEntrega:', empreendimento.previsaoEntrega);
    console.log('   - unidadesDisponiveis:', empreendimento.unidadesDisponiveis);
    
    // 2. Teste com dados mínimos (apenas campos obrigatórios + campos específicos)
    console.log('\n🧪 2. Testando atualização com dados mínimos...');
    const minimalData = {
      // Campos obrigatórios básicos
      name: empreendimento.name,
      type: 'empreendimento',
      area: empreendimento.area,
      value: empreendimento.value,
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
      
      // APENAS os campos específicos de empreendimento que queremos testar
      construtora: 'TESTE MINIMAL - ' + new Date().toISOString(),
      previsaoEntrega: '2025-12-31',
      unidadesDisponiveis: 99
    };
    
    console.log('📤 Enviando dados mínimos:', JSON.stringify(minimalData, null, 2));
    
    const updateResponse = await axios.put(`${API_BASE}/api/products/${empreendimento.id}`, minimalData);
    console.log('✅ Resposta da atualização:', updateResponse.status, updateResponse.statusText);
    console.log('📋 Dados retornados:');
    console.log('   - construtora:', updateResponse.data.data.construtora);
    console.log('   - previsaoEntrega:', updateResponse.data.data.previsaoEntrega);
    console.log('   - unidadesDisponiveis:', updateResponse.data.data.unidadesDisponiveis);
    
    // 3. Verificar se os dados foram salvos
    console.log('\n🔍 3. Verificando se os dados foram salvos...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar 500ms
    
    const verifyResponse = await axios.get(`${API_BASE}/api/products/${empreendimento.id}`);
    const dadosVerificados = verifyResponse.data.data;
    
    console.log('📋 Dados verificados:');
    console.log('   - construtora:', dadosVerificados.construtora);
    console.log('   - previsaoEntrega:', dadosVerificados.previsaoEntrega);
    console.log('   - unidadesDisponiveis:', dadosVerificados.unidadesDisponiveis);
    
    // 4. Comparar dados
    console.log('\n📊 4. Comparação:');
    const construtoraPersistiu = dadosVerificados.construtora === minimalData.construtora;
    const previsaoPersistiu = dadosVerificados.previsaoEntrega === minimalData.previsaoEntrega;
    const unidadesPersistiu = dadosVerificados.unidadesDisponiveis === minimalData.unidadesDisponiveis;
    
    console.log('   - Construtora:', construtoraPersistiu ? '✅ PERSISTIU' : '❌ NÃO PERSISTIU');
    console.log('   - Previsão:', previsaoPersistiu ? '✅ PERSISTIU' : '❌ NÃO PERSISTIU');
    console.log('   - Unidades:', unidadesPersistiu ? '✅ PERSISTIU' : '❌ NÃO PERSISTIU');
    
    if (construtoraPersistiu && previsaoPersistiu && unidadesPersistiu) {
      console.log('\n🎉 SUCESSO! Backend está funcionando corretamente.');
      console.log('   O problema deve estar no frontend (mapeamento de dados).');
    } else {
      console.log('\n🚨 PROBLEMA NO BACKEND!');
      console.log('   Alguns campos não estão sendo persistidos corretamente.');
      
      // 5. Teste individual de cada campo
      console.log('\n🔬 5. Testando campos individualmente...');
      
      // Teste apenas construtora
      console.log('\n   🧪 Testando apenas construtora...');
      const testConstrutora = {
        construtora: 'TESTE INDIVIDUAL CONSTRUTORA - ' + Date.now()
      };
      
      const construtorResponse = await axios.put(`${API_BASE}/api/products/${empreendimento.id}`, testConstrutora);
      console.log('   📤 Enviado:', testConstrutora.construtora);
      console.log('   📥 Retornado:', construtorResponse.data.data.construtora);
      console.log('   ✅ Resultado:', construtorResponse.data.data.construtora === testConstrutora.construtora ? 'SUCESSO' : 'FALHA');
    }
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.response?.data || error.message);
    
    if (error.response?.data?.errors) {
      console.error('📋 Erros de validação:', error.response.data.errors);
    }
    
    if (error.response?.status === 400) {
      console.error('🚨 ERRO 400 - Problema de validação!');
      console.error('   Dados enviados podem não estar no formato correto.');
    }
  }
}

// Executar o teste
testBackendValidation();