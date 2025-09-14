const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';

// Função para testar atualização de empreendimento
async function testEmpreendimentoUpdate() {
  try {
    console.log('🔍 Testando atualização de empreendimento...');
    
    // Primeiro, vamos listar os produtos para encontrar um empreendimento
    console.log('📋 Buscando empreendimentos existentes...');
    const listResponse = await axios.get(`${API_BASE_URL}/products`);
    
    const empreendimentos = listResponse.data.data.filter(p => p.type === 'empreendimento');
    
    if (empreendimentos.length === 0) {
      console.log('❌ Nenhum empreendimento encontrado para testar');
      return;
    }
    
    const empreendimento = empreendimentos[0];
    console.log('🏢 Empreendimento encontrado:', {
      id: empreendimento.id,
      name: empreendimento.name,
      type: empreendimento.type
    });
    
    // Dados mínimos para teste
    const minimalData = {
      title: 'Teste Empreendimento Atualizado',
      description: 'Descrição de teste atualizada',
      type: 'empreendimento'
    };
    
    console.log('🧪 Testando com dados mínimos:', minimalData);
    
    try {
      const updateResponse = await axios.put(`${API_BASE_URL}/products/${empreendimento.id}`, minimalData);
      console.log('✅ Atualização com dados mínimos funcionou!');
    } catch (error) {
      console.log('❌ Erro com dados mínimos:', error.response?.data || error.message);
    }
    
    // Agora vamos testar com campos específicos de empreendimento
    const empreendimentoData = {
      title: 'Teste Empreendimento Completo',
      description: 'Descrição completa de teste',
      type: 'empreendimento',
      construtora: 'Construtora Teste',
      previsaoEntrega: new Date().toISOString(),
      unidadesDisponiveis: 10,
      plantas: [
        {
          area: 65,
          precoPorM2: 8500,
          descricao: 'Planta A - 2 quartos'
        },
        {
          area: 85,
          precoPorM2: 8200,
          descricao: 'Planta B - 3 quartos'
        }
      ]
    };
    
    console.log('🧪 Testando com dados completos de empreendimento:', empreendimentoData);
    
    try {
      const updateResponse = await axios.put(`${API_BASE_URL}/products/${empreendimento.id}`, empreendimentoData);
      console.log('✅ Atualização com dados completos funcionou!');
      console.log('📊 Resposta:', updateResponse.data);
    } catch (error) {
      console.log('❌ Erro com dados completos:', error.response?.data || error.message);
      
      // Vamos testar campo por campo para identificar o problema
      console.log('🔍 Testando campos individuais...');
      
      const baseData = {
        title: 'Teste Individual',
        description: 'Teste',
        type: 'empreendimento'
      };
      
      // Teste construtora
      try {
        await axios.put(`${API_BASE_URL}/products/${empreendimento.id}`, {
          ...baseData,
          construtora: 'Construtora Teste'
        });
        console.log('✅ Campo construtora: OK');
      } catch (err) {
        console.log('❌ Campo construtora: ERRO -', err.response?.data?.message || err.message);
      }
      
      // Teste previsaoEntrega
      try {
        await axios.put(`${API_BASE_URL}/products/${empreendimento.id}`, {
          ...baseData,
          previsaoEntrega: new Date().toISOString()
        });
        console.log('✅ Campo previsaoEntrega: OK');
      } catch (err) {
        console.log('❌ Campo previsaoEntrega: ERRO -', err.response?.data?.message || err.message);
      }
      
      // Teste unidadesDisponiveis
      try {
        await axios.put(`${API_BASE_URL}/products/${empreendimento.id}`, {
          ...baseData,
          unidadesDisponiveis: 10
        });
        console.log('✅ Campo unidadesDisponiveis: OK');
      } catch (err) {
        console.log('❌ Campo unidadesDisponiveis: ERRO -', err.response?.data?.message || err.message);
      }
      
      // Teste plantas
      try {
        await axios.put(`${API_BASE_URL}/products/${empreendimento.id}`, {
          ...baseData,
          plantas: [
            {
              area: 65,
              precoPorM2: 8500,
              descricao: 'Planta teste'
            }
          ]
        });
        console.log('✅ Campo plantas: OK');
      } catch (err) {
        console.log('❌ Campo plantas: ERRO -', err.response?.data?.message || err.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.response?.data || error.message);
  }
}

// Executar teste
testEmpreendimentoUpdate();