// Script para fazer login e testar funcionalidade de edição de terrenos

async function loginAndTestEdit() {
  console.log('🔐 Fazendo login programático...');
  
  try {
    // Fazer login
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'gabriel@teste.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('📡 Resposta do login:', loginData);
    
    if (loginData.success && loginData.data.token) {
      // Salvar token no sessionStorage
      sessionStorage.setItem('sanctum_access_token', loginData.data.token);
      console.log('✅ Token salvo com sucesso!');
      
      // Aguardar um pouco e recarregar a página
      setTimeout(() => {
        console.log('🔄 Recarregando página...');
        window.location.reload();
      }, 1000);
      
    } else {
      console.error('❌ Erro no login:', loginData);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição de login:', error);
  }
}

// Função para testar a funcionalidade de edição
async function testEditFunctionality() {
  console.log('🧪 Testando funcionalidade de edição...');
  
  const token = sessionStorage.getItem('sanctum_access_token');
  if (!token) {
    console.error('❌ Token não encontrado! Execute loginAndTestEdit() primeiro.');
    return;
  }
  
  try {
    // Buscar lista de terrenos
    const response = await fetch('/api/terreno/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('📋 Lista de terrenos:', data);
    
    if (data.success && data.data && data.data.length > 0) {
      const firstTerrenoId = data.data[0]._id;
      console.log('🎯 Primeiro terreno ID:', firstTerrenoId);
      
      // Navegar para página de edição
      const editUrl = `/dashboard/terrenos/edit/${firstTerrenoId}`;
      console.log('🔗 Navegando para:', editUrl);
      window.location.href = editUrl;
      
    } else {
      console.log('⚠️ Nenhum terreno encontrado para editar');
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar terrenos:', error);
  }
}

// Exportar funções
window.loginAndTestEdit = loginAndTestEdit;
window.testEditFunctionality = testEditFunctionality;

console.log('🚀 Script de teste carregado!');
console.log('📋 Funções disponíveis:');
console.log('1. loginAndTestEdit() - Fazer login e recarregar');
console.log('2. testEditFunctionality() - Testar edição após login');