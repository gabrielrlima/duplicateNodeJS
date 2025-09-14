const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const FRONTEND_URL = 'http://localhost:3030';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testNavigateToForm() {
  try {
    console.log('🧪 === TESTE DE NAVEGAÇÃO PARA FORMULÁRIO ===\n');
    
    // 1. Buscar um empreendimento existente
    console.log('🔍 1. Buscando empreendimento existente...');
    const searchResponse = await axiosInstance.get('/products?type=empreendimento&limit=1');
    
    if (!searchResponse.data.success || !searchResponse.data.data.length) {
      throw new Error('Nenhum empreendimento encontrado');
    }
    
    const property = searchResponse.data.data[0];
    console.log('✅ Empreendimento encontrado:');
    console.log('   - ID:', property.id);
    console.log('   - Nome:', property.name || property.title);
    console.log('   - Tipo:', property.type);
    console.log('   - Construtora:', property.construtora);
    console.log('   - Previsão Entrega:', property.previsaoEntrega);
    console.log('   - Unidades Disponíveis:', property.unidadesDisponiveis);
    
    // 2. Verificar detalhes do produto
    console.log('\n🔍 2. Verificando detalhes completos do produto...');
    const detailsResponse = await axiosInstance.get(`/products/${property.id}`);
    
    if (detailsResponse.data.success) {
      const details = detailsResponse.data.data;
      console.log('✅ Detalhes obtidos com sucesso:');
      console.log('   - ID:', details.id);
      console.log('   - Nome:', details.name || details.title);
      console.log('   - Tipo:', details.type);
      console.log('   - Construtora:', details.construtora);
      console.log('   - Previsão Entrega:', details.previsaoEntrega);
      console.log('   - Unidades Disponíveis:', details.unidadesDisponiveis);
      console.log('   - Plantas:', details.plantas ? details.plantas.length : 0, 'plantas');
      
      // 3. Gerar URL do formulário
      const formUrl = `${FRONTEND_URL}/dashboard/property/${details.id}/edit`;
      console.log('\n🌐 3. URL do formulário gerada:');
      console.log('   ', formUrl);
      
      console.log('\n📋 4. Instruções para teste manual:');
      console.log('   1. Abra o navegador e acesse:', formUrl);
      console.log('   2. Abra o Console do Desenvolvedor (F12)');
      console.log('   3. Verifique os logs detalhados que implementamos');
      console.log('   4. Procure por logs que começam com:');
      console.log('      - 🏢 DADOS ESPECÍFICOS DE EMPREENDIMENTO');
      console.log('      - 🏢 VALORES ESPECÍFICOS DE EMPREENDIMENTO MAPEADOS');
      console.log('      - 🔍 VERIFICAÇÃO PÓS-RESET');
      console.log('   5. Teste editar o campo "Construtora" e observe os logs');
      
      console.log('\n🎯 5. Dados esperados no formulário:');
      console.log('   - Campo "Construtora" deve mostrar:', details.construtora || '[VAZIO]');
      console.log('   - Campo "Previsão de Entrega" deve mostrar:', details.previsaoEntrega || '[VAZIO]');
      console.log('   - Campo "Unidades Disponíveis" deve mostrar:', details.unidadesDisponiveis || '[VAZIO]');
      
      // 6. Verificar se há problemas nos dados
      console.log('\n🚨 6. Análise de possíveis problemas:');
      const issues = [];
      
      if (!details.construtora || details.construtora === '') {
        issues.push('Construtora está vazia no banco de dados');
      }
      
      if (!details.previsaoEntrega || details.previsaoEntrega === '') {
        issues.push('Previsão de entrega está vazia no banco de dados');
      }
      
      if (!details.unidadesDisponiveis || details.unidadesDisponiveis === 0) {
        issues.push('Unidades disponíveis está vazia ou zero no banco de dados');
      }
      
      if (issues.length > 0) {
        console.log('   ❌ Problemas encontrados:');
        issues.forEach(issue => console.log('      -', issue));
        console.log('   💡 Solução: Primeiro atualize os dados via API de teste');
      } else {
        console.log('   ✅ Dados parecem estar corretos no banco');
        console.log('   💡 O problema pode estar no mapeamento do frontend');
      }
      
    } else {
      console.error('❌ Erro ao obter detalhes do produto:', detailsResponse.data.message);
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
testNavigateToForm();