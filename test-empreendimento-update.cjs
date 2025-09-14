const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3001';

// Dados de teste para empreendimento
const empreendimentoData = {
  title: 'Residencial Vila Bela - Teste Update',
  description: 'Empreendimento residencial de alto padrão com plantas variadas.',
  type: 'empreendimento',
  address: {
    street: 'Avenida das Palmeiras',
    number: '1000',
    complement: '',
    neighborhood: 'Vila Bela',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '04567-000',
    country: 'Brasil'
  },
  // Campos específicos de empreendimento
  construtora: 'Construtora ABC Ltda',
  previsaoEntrega: '2025-12-31',
  unidadesDisponiveis: 50,
  plantas: [
    {
      id: 'planta-1',
      area: 65,
      precoPorM2: 8500,
      descricao: 'Planta A - 2 quartos'
    },
    {
      id: 'planta-2', 
      area: 85,
      precoPorM2: 8200,
      descricao: 'Planta B - 3 quartos'
    }
  ],
  realEstateId: '68c4467199df1835267f3e48' // ID da Adão Imóveis
};

async function testEmpreendimentoUpdate() {
  try {
    console.log('🧪 Testando atualização de empreendimento...');
    
    // Primeiro, vamos buscar um empreendimento existente
    console.log('📋 Buscando empreendimentos existentes...');
    const listResponse = await axios.get(`${API_BASE}/api/products?type=empreendimento`);
    
    if (listResponse.data.data && listResponse.data.data.length > 0) {
      const empreendimento = listResponse.data.data[0];
      console.log(`✅ Encontrado empreendimento: ${empreendimento.name} (ID: ${empreendimento.id})`);
      
      // Tentar atualizar o empreendimento
      console.log('🔄 Tentando atualizar empreendimento...');
      const updateResponse = await axios.put(`${API_BASE}/api/products/${empreendimento.id}`, empreendimentoData);
      
      console.log('✅ Empreendimento atualizado com sucesso!');
      console.log('📊 Dados atualizados:', JSON.stringify(updateResponse.data, null, 2));
      
    } else {
      console.log('⚠️ Nenhum empreendimento encontrado. Criando um novo...');
      
      // Criar um novo empreendimento
      const createResponse = await axios.post(`${API_BASE}/api/products`, empreendimentoData);
      console.log('✅ Empreendimento criado com sucesso!');
      console.log('📊 Dados criados:', JSON.stringify(createResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('📋 Detalhes dos erros:', error.response.data.errors);
    }
  }
}

// Executar o teste
testEmpreendimentoUpdate();