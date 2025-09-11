// Script para corrigir automaticamente problemas de autenticação
// Execute no console do navegador

async function fixAuthenticationIssue() {
  console.log('🔧 Iniciando correção automática de autenticação...');
  
  // 1. Verificar se o usuário está logado
  console.log('\n1. 🔍 Verificando status de login...');
  
  try {
    // Testar endpoint de verificação de usuário
    const userResponse = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status /api/auth/me:', userResponse.status);
    
    if (userResponse.status === 401) {
      console.log('❌ Usuário não está logado ou token expirado');
      console.log('🔄 Redirecionando para login...');
      
      // Limpar dados de sessão
      sessionStorage.clear();
      localStorage.removeItem('sanctum_access_token');
      
      // Redirecionar para login
      window.location.href = '/auth/sign-in';
      return;
    }
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ Usuário logado:', userData.firstName, userData.lastName);
      
      // Verificar se há token no sessionStorage
      const token = sessionStorage.getItem('sanctum_access_token');
      if (!token) {
        console.log('⚠️ Token não encontrado no sessionStorage, mas usuário está autenticado');
        console.log('🔄 Tentando obter novo token...');
        
        // Tentar fazer login silencioso ou refresh
        await attemptSilentLogin();
      } else {
        console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error);
    console.log('🔄 Redirecionando para login por segurança...');
    window.location.href = '/auth/sign-in';
    return;
  }
  
  // 2. Verificar contexto de imobiliária
  console.log('\n2. 🏢 Verificando contexto de imobiliária...');
  
  try {
    const token = sessionStorage.getItem('sanctum_access_token');
    const realEstateResponse = await fetch('/api/real-estate', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (realEstateResponse.ok) {
      const realEstateData = await realEstateResponse.json();
      
      if (realEstateData.data && realEstateData.data.length > 0) {
        console.log('✅ Imobiliárias encontradas:', realEstateData.data.length);
        
        // Verificar se há uma imobiliária selecionada no contexto
        const currentRealEstate = localStorage.getItem('currentRealEstate');
        if (!currentRealEstate) {
          console.log('⚠️ Nenhuma imobiliária selecionada no contexto');
          console.log('🔧 Selecionando primeira imobiliária automaticamente...');
          
          // Selecionar primeira imobiliária
          const firstRealEstate = realEstateData.data[0];
          localStorage.setItem('currentRealEstate', JSON.stringify(firstRealEstate));
          console.log('✅ Imobiliária selecionada:', firstRealEstate.name);
        } else {
          const selected = JSON.parse(currentRealEstate);
          console.log('✅ Imobiliária já selecionada:', selected.name);
        }
      } else {
        console.log('❌ Nenhuma imobiliária encontrada para o usuário');
        console.log('🔄 Redirecionando para criação de imobiliária...');
        window.location.href = '/dashboard/real-estate/new';
        return;
      }
    } else {
      console.error('❌ Erro ao buscar imobiliárias:', realEstateResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar imobiliárias:', error);
  }
  
  // 3. Testar criação de terreno
  console.log('\n3. 🧪 Testando criação de terreno...');
  
  const testData = {
    name: 'Teste Correção Auth',
    title: 'Teste Correção Auth',
    description: 'Terreno de teste após correção de autenticação',
    totalArea: 500,
    value: 150000,
    status: 'available',
    type: 'residential',
    address: {
      street: 'Rua Teste Auth',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    owner: {
      name: 'Teste Auth',
      email: 'teste.auth@email.com',
      phone: '11999887766',
      document: '12345678901'
    },
    realEstateId: 'test-real-estate-id'
  };
  
  try {
    const token = sessionStorage.getItem('sanctum_access_token');
    const createResponse = await fetch('/api/terreno', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Status criação terreno:', createResponse.status);
    
    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ Terreno criado com sucesso!', result);
      console.log('🎉 Autenticação funcionando corretamente!');
      
      // Restaurar formulário completo
      await restoreCompleteForm();
      
    } else {
      const errorText = await createResponse.text();
      console.error('❌ Ainda há problemas na criação:', createResponse.status, errorText);
      
      if (createResponse.status === 401) {
        console.log('🔄 Problema de token persistente, redirecionando para login...');
        window.location.href = '/auth/sign-in';
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar criação:', error);
  }
}

// Função para tentar login silencioso
async function attemptSilentLogin() {
  console.log('🔄 Tentando login silencioso...');
  
  try {
    // Verificar se há cookies de sessão
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        sessionStorage.setItem('sanctum_access_token', data.token);
        console.log('✅ Token renovado com sucesso');
        return true;
      }
    }
  } catch (error) {
    console.log('⚠️ Login silencioso falhou:', error.message);
  }
  
  return false;
}

// Função para restaurar o formulário completo
async function restoreCompleteForm() {
  console.log('\n🔧 Restaurando formulário completo de terreno...');
  
  try {
    // Verificar se estamos na página de terreno
    if (window.location.pathname.includes('/terrenos/new')) {
      console.log('✅ Na página correta, recarregando para aplicar correções...');
      
      // Aguardar um pouco e recarregar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.log('🔄 Redirecionando para página de criação de terreno...');
      window.location.href = '/dashboard/terrenos/new';
    }
  } catch (error) {
    console.error('❌ Erro ao restaurar formulário:', error);
  }
}

// Função para verificar se a correção foi bem-sucedida
function verifyAuthFix() {
  console.log('\n✅ VERIFICAÇÃO FINAL:');
  
  const token = sessionStorage.getItem('sanctum_access_token');
  const realEstate = localStorage.getItem('currentRealEstate');
  
  console.log('🔑 Token JWT:', token ? '✅ Presente' : '❌ Ausente');
  console.log('🏢 Imobiliária:', realEstate ? '✅ Selecionada' : '❌ Não selecionada');
  
  if (token && realEstate) {
    console.log('🎉 Autenticação corrigida com sucesso!');
    console.log('✅ Formulário de terreno deve funcionar agora');
    return true;
  } else {
    console.log('❌ Ainda há problemas de autenticação');
    return false;
  }
}

// Exportar funções
window.fixAuthenticationIssue = fixAuthenticationIssue;
window.verifyAuthFix = verifyAuthFix;
window.restoreCompleteForm = restoreCompleteForm;

console.log('🔧 Script de correção de autenticação carregado!');
console.log('📋 Execute: fixAuthenticationIssue() para corrigir problemas');