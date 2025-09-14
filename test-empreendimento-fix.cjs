const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const FRONTEND_URL = 'http://localhost:8081';

// Função para testar a correção do empreendimento
async function testEmpreendimentoFix() {
  try {
    console.log('🧪 Testando correção de atualização de empreendimento...');
    
    // Primeiro, vamos buscar um empreendimento existente
    console.log('\n1. Buscando empreendimentos existentes...');
    const listResponse = await axios.get(`${API_BASE_URL}/products?type=empreendimento&limit=1`);
    
    if (!listResponse.data.success || !listResponse.data.data.length) {
      console.log('❌ Nenhum empreendimento encontrado para teste');
      return;
    }
    
    const empreendimento = listResponse.data.data[0];
    console.log('✅ Empreendimento encontrado:', {
      id: empreendimento.id || empreendimento._id,
      name: empreendimento.name,
      type: empreendimento.type
    });
    
    // Dados de teste para atualização (formato que vem do frontend)
    const dadosAtualizacao = {
      title: empreendimento.name || 'Teste Empreendimento Atualizado',
      description: 'Descrição atualizada via teste automatizado',
      type: 'empreendimento',
      address: {
        street: 'Rua Teste',
        number: '123',
        complement: 'Apto 101',
        neighborhood: 'Bairro Teste',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil'
      },
      // Campos específicos de empreendimento
      construtora: 'Construtora Teste Ltda',
      previsaoEntrega: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano no futuro
      unidadesDisponiveis: 25,
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
          precoPorM2: 9200,
          descricao: 'Planta B - 3 quartos'
        }
      ]
    };
    
    console.log('\n2. Dados que serão enviados:');
    console.log(JSON.stringify(dadosAtualizacao, null, 2));
    
    // Testar atualização
    console.log('\n3. Enviando atualização...');
    const empreendimentoId = empreendimento.id || empreendimento._id;
    const updateResponse = await axios.put(
      `${API_BASE_URL}/products/${empreendimentoId}`,
      dadosAtualizacao,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (updateResponse.data.success) {
      console.log('✅ Atualização realizada com sucesso!');
      console.log('📋 Dados atualizados:', {
        id: updateResponse.data.data._id,
        name: updateResponse.data.data.name,
        type: updateResponse.data.data.type,
        construtora: updateResponse.data.data.construtora,
        unidadesDisponiveis: updateResponse.data.data.unidadesDisponiveis,
        plantas: updateResponse.data.data.plantas?.length || 0
      });
      
      console.log('\n🎉 TESTE PASSOU! O problema de dados inválidos foi corrigido.');
    } else {
      console.log('❌ Erro na atualização:', updateResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    if (error.response?.status === 400) {
      console.log('\n🔍 Analisando erro 400 (dados inválidos):');
      console.log('- Status:', error.response.status);
      console.log('- Mensagem:', error.response.data?.message);
      console.log('- Detalhes:', error.response.data);
      
      console.log('\n❌ O problema ainda persiste. Verifique:');
      console.log('1. Se o backend está rodando na porta 3001');
      console.log('2. Se os campos obrigatórios estão sendo enviados');
      console.log('3. Se a validação do backend está correta');
    }
  }
}

// Executar teste
if (require.main === module) {
  testEmpreendimentoFix();
}

module.exports = { testEmpreendimentoFix };