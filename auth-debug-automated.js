// Script automatizado para debug completo de autenticação
// Execute no console do navegador

async function runCompleteAuthDebug() {
  console.log('🚀 Iniciando debug completo de autenticação...');
  console.log('=' .repeat(60));
  
  const results = {
    token: null,
    tokenValid: false,
    userAuth: false,
    realEstateContext: false,
    apiAccess: false,
    errors: []
  };
  
  try {
    // 1. Verificar token no sessionStorage
    console.log('\n🔍 1. VERIFICANDO TOKEN JWT...');
    const token = sessionStorage.getItem('sanctum_access_token');
    
    if (!token) {
      console.error('❌ Token JWT não encontrado no sessionStorage!');
      results.errors.push('Token JWT ausente');
      
      // Verificar outros possíveis locais de armazenamento
      const altToken = localStorage.getItem('sanctum_access_token') || 
                      localStorage.getItem('access_token') ||
                      sessionStorage.getItem('access_token');
      
      if (altToken) {
        console.log('⚠️ Token encontrado em local alternativo:', altToken.substring(0, 20) + '...');
        results.token = altToken;
      } else {
        console.error('❌ Nenhum token encontrado em qualquer local!');
        return results;
      }
    } else {
      console.log('✅ Token JWT encontrado:', token.substring(0, 20) + '...');
      results.token = token;
    }
    
    // 2. Testar validade do token com /api/auth/me
    console.log('\n🔍 2. TESTANDO VALIDADE DO TOKEN...');
    try {
      const authResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${results.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Status /api/auth/me:', authResponse.status);
      
      if (authResponse.ok) {
        const userData = await authResponse.json();
        console.log('✅ Token válido! Usuário:', userData.firstName, userData.lastName);
        results.tokenValid = true;
        results.userAuth = true;
      } else {
        console.error('❌ Token inválido ou expirado! Status:', authResponse.status);
        const errorText = await authResponse.text();
        console.error('Erro:', errorText);
        results.errors.push(`Token inválido: ${authResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      results.errors.push(`Erro de rede: ${error.message}`);
    }
    
    // 3. Verificar contexto de imobiliária
    console.log('\n🔍 3. VERIFICANDO CONTEXTO DE IMOBILIÁRIA...');
    try {
      const realEstateResponse = await fetch('/api/real-estate', {
        headers: {
          'Authorization': `Bearer ${results.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Status /api/real-estate:', realEstateResponse.status);
      
      if (realEstateResponse.ok) {
        const realEstateData = await realEstateResponse.json();
        console.log('✅ Imobiliárias encontradas:', realEstateData.data?.length || 0);
        
        if (realEstateData.data && realEstateData.data.length > 0) {
          console.log('🏢 Primeira imobiliária:', realEstateData.data[0].name);
          results.realEstateContext = true;
        } else {
          console.warn('⚠️ Nenhuma imobiliária encontrada para o usuário');
          results.errors.push('Nenhuma imobiliária disponível');
        }
      } else {
        console.error('❌ Erro ao buscar imobiliárias! Status:', realEstateResponse.status);
        results.errors.push(`Erro ao buscar imobiliárias: ${realEstateResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar imobiliárias:', error);
      results.errors.push(`Erro de rede imobiliárias: ${error.message}`);
    }
    
    // 4. Testar acesso à API de terrenos
    console.log('\n🔍 4. TESTANDO ACESSO À API DE TERRENOS...');
    try {
      const terrenosResponse = await fetch('/api/terreno/list', {
        headers: {
          'Authorization': `Bearer ${results.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Status /api/terreno/list:', terrenosResponse.status);
      
      if (terrenosResponse.ok) {
        const terrenosData = await terrenosResponse.json();
        console.log('✅ API de terrenos acessível! Terrenos:', terrenosData.data?.terrenos?.length || 0);
        results.apiAccess = true;
      } else {
        console.error('❌ Erro ao acessar API de terrenos! Status:', terrenosResponse.status);
        const errorText = await terrenosResponse.text();
        console.error('Erro:', errorText);
        results.errors.push(`API terrenos inacessível: ${terrenosResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao testar API de terrenos:', error);
      results.errors.push(`Erro de rede terrenos: ${error.message}`);
    }
    
    // 5. Testar criação de terreno
    if (results.tokenValid && results.apiAccess) {
      console.log('\n🔍 5. TESTANDO CRIAÇÃO DE TERRENO...');
      
      const testTerrenoData = {
        name: 'Teste Debug Auth',
        title: 'Teste Debug Auth',
        description: 'Terreno criado durante debug de autenticação',
        totalArea: 500,
        value: 150000,
        status: 'available',
        type: 'residential',
        address: {
          street: 'Rua Debug',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        },
        owner: {
          name: 'Debug Teste',
          email: 'debug@teste.com',
          phone: '11999887766',
          document: '12345678901'
        },
        realEstateId: 'test-real-estate-id'
      };
      
      try {
        const createResponse = await fetch('/api/terreno', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${results.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testTerrenoData)
        });
        
        console.log('📡 Status criação terreno:', createResponse.status);
        
        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log('✅ Terreno criado com sucesso!', createData);
        } else {
          console.error('❌ Erro ao criar terreno! Status:', createResponse.status);
          const errorText = await createResponse.text();
          console.error('Erro:', errorText);
          results.errors.push(`Erro ao criar terreno: ${createResponse.status}`);
        }
      } catch (error) {
        console.error('❌ Erro ao testar criação:', error);
        results.errors.push(`Erro de rede criação: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral no debug:', error);
    results.errors.push(`Erro geral: ${error.message}`);
  }
  
  // Relatório final
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RELATÓRIO FINAL DO DEBUG');
  console.log('=' .repeat(60));
  
  console.log('🔑 Token JWT:', results.token ? '✅ Presente' : '❌ Ausente');
  console.log('✅ Token Válido:', results.tokenValid ? '✅ Sim' : '❌ Não');
  console.log('👤 Usuário Autenticado:', results.userAuth ? '✅ Sim' : '❌ Não');
  console.log('🏢 Contexto Imobiliária:', results.realEstateContext ? '✅ OK' : '❌ Problema');
  console.log('🔌 Acesso API:', results.apiAccess ? '✅ OK' : '❌ Bloqueado');
  
  if (results.errors.length > 0) {
    console.log('\n❌ PROBLEMAS ENCONTRADOS:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  } else {
    console.log('\n🎉 NENHUM PROBLEMA ENCONTRADO!');
  }
  
  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');
  
  if (!results.token) {
    console.log('1. ❗ Faça login novamente para obter um token válido');
  } else if (!results.tokenValid) {
    console.log('1. ❗ Token expirado - faça login novamente');
  } else if (!results.realEstateContext) {
    console.log('1. ❗ Crie ou selecione uma imobiliária');
  } else if (!results.apiAccess) {
    console.log('1. ❗ Verifique permissões de API no backend');
  } else {
    console.log('1. ✅ Autenticação funcionando corretamente!');
    console.log('2. ✅ Pode restaurar o formulário completo de terreno');
  }
  
  return results;
}

// Função para corrigir problemas automaticamente
async function autoFixAuthProblems() {
  console.log('🔧 Tentando corrigir problemas de autenticação...');
  
  const results = await runCompleteAuthDebug();
  
  if (!results.token || !results.tokenValid) {
    console.log('🔄 Redirecionando para login...');
    window.location.href = '/auth/sign-in';
    return;
  }
  
  if (!results.realEstateContext) {
    console.log('🏢 Redirecionando para seleção de imobiliária...');
    window.location.href = '/dashboard/real-estate';
    return;
  }
  
  if (results.errors.length === 0) {
    console.log('✅ Todos os problemas foram resolvidos!');
    console.log('🔄 Recarregando página...');
    window.location.reload();
  }
}

// Exportar funções
window.runCompleteAuthDebug = runCompleteAuthDebug;
window.autoFixAuthProblems = autoFixAuthProblems;

console.log('🔧 Script de debug automatizado carregado!');
console.log('📋 Funções disponíveis:');
console.log('1. runCompleteAuthDebug() - Debug completo de autenticação');
console.log('2. autoFixAuthProblems() - Tentar corrigir problemas automaticamente');
console.log('\n💡 Execute: runCompleteAuthDebug() para começar');