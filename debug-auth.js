// Script para debugar problemas de autenticação
// Execute no console do navegador

function debugAuth() {
  console.log('🔍 Debugando autenticação...');
  
  // Verificar token no sessionStorage
  const token = sessionStorage.getItem('sanctum_access_token');
  console.log('🔑 Token no sessionStorage:', token ? 'Presente' : 'Ausente');
  if (token) {
    console.log('📝 Token (primeiros 20 chars):', token.substring(0, 20) + '...');
  }
  
  // Verificar se há dados do usuário
  const userData = sessionStorage.getItem('user');
  console.log('👤 Dados do usuário:', userData ? 'Presentes' : 'Ausentes');
  
  // Testar requisição para /api/auth/me
  console.log('\n🧪 Testando requisição para /api/auth/me...');
  fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('📡 Status da resposta /api/auth/me:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Dados do usuário da API:', data);
  })
  .catch(error => {
    console.error('❌ Erro ao buscar dados do usuário:', error);
  });
  
  // Testar requisição para listar terrenos
  console.log('\n🧪 Testando requisição para listar terrenos...');
  fetch('/api/terreno/list', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('📡 Status da resposta /api/terreno/list:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Lista de terrenos:', data);
  })
  .catch(error => {
    console.error('❌ Erro ao listar terrenos:', error);
  });
}

// Função para testar criação de terreno com token correto
function testCreateTerrenoWithAuth() {
  console.log('🧪 Testando criação de terreno com autenticação...');
  
  const token = sessionStorage.getItem('sanctum_access_token');
  if (!token) {
    console.error('❌ Token não encontrado! Faça login primeiro.');
    return;
  }
  
  const terrenoData = {
    name: 'Teste com Auth',
    title: 'Teste com Auth',
    description: 'Teste de criação com token correto',
    totalArea: 500,
    value: 150000,
    status: 'available',
    type: 'residential',
    address: {
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    owner: {
      name: 'João Teste',
      email: 'joao@teste.com',
      phone: '11999887766',
      document: '12345678901'
    },
    realEstateId: 'test-real-estate-id'
  };
  
  console.log('📤 Enviando dados:', terrenoData);
  
  fetch('/api/terreno', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(terrenoData)
  })
  .then(response => {
    console.log('📡 Status da resposta:', response.status);
    console.log('📋 Headers da resposta:', [...response.headers.entries()]);
    return response.text();
  })
  .then(text => {
    console.log('📄 Resposta completa:', text);
    try {
      const data = JSON.parse(text);
      console.log('✅ Dados parseados:', data);
    } catch (e) {
      console.log('⚠️ Resposta não é JSON válido');
    }
  })
  .catch(error => {
    console.error('❌ Erro na requisição:', error);
  });
}

// Função para verificar contexto de imobiliária
function checkRealEstateContext() {
  console.log('🏢 Verificando contexto de imobiliária...');
  
  // Verificar se há dados de imobiliária no localStorage ou sessionStorage
  const realEstateData = localStorage.getItem('currentRealEstate') || sessionStorage.getItem('currentRealEstate');
  console.log('🏢 Dados de imobiliária:', realEstateData ? JSON.parse(realEstateData) : 'Não encontrados');
  
  // Testar requisição para listar imobiliárias
  const token = sessionStorage.getItem('sanctum_access_token');
  fetch('/api/real-estate', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('📡 Status /api/real-estate:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Imobiliárias disponíveis:', data);
  })
  .catch(error => {
    console.error('❌ Erro ao buscar imobiliárias:', error);
  });
}

// Exportar funções
window.debugAuth = debugAuth;
window.testCreateTerrenoWithAuth = testCreateTerrenoWithAuth;
window.checkRealEstateContext = checkRealEstateContext;

console.log('🔍 Script de debug de autenticação carregado!');
console.log('📋 Funções disponíveis:');
console.log('1. debugAuth() - Verificar token e autenticação');
console.log('2. testCreateTerrenoWithAuth() - Testar criação com token correto');
console.log('3. checkRealEstateContext() - Verificar contexto de imobiliária');