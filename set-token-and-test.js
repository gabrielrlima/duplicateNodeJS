// Script para definir token e testar funcionalidade de edição

// Token JWT válido gerado
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmExMjM0NTY3ODkwYWJjZGVmMTIzNCIsImVtYWlsIjoidGVzdGVAZXhlbXBsby5jb20iLCJmaXJzdE5hbWUiOiJVc3XDoXJpbyIsImxhc3ROYW1lIjoiVGVzdGUiLCJpYXQiOjE3NTY3NjgwNDAsImV4cCI6MTc1NzM3Mjg0MH0.8qd0UPsEYtH2Ww2xrriPV5lgj8P-xFfFNxruNoXstf0';

function setTokenAndReload() {
  console.log('🔑 Definindo token no sessionStorage...');
  
  // Definir token
  sessionStorage.setItem('sanctum_access_token', validToken);
  
  // Definir dados básicos do usuário
  const userData = {
    id: '676a1234567890abcdef1234',
    email: 'teste@exemplo.com',
    firstName: 'Usuário',
    lastName: 'Teste',
    accessToken: validToken
  };
  
  sessionStorage.setItem('user', JSON.stringify(userData));
  
  console.log('✅ Token e dados do usuário definidos!');
  console.log('🔄 Recarregando página em 1 segundo...');
  
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

function testUpdateButton() {
  console.log('🧪 Testando funcionalidade do botão de atualização...');
  
  // Verificar se estamos na página de edição
  const isEditPage = window.location.pathname.includes('/edit/');
  if (!isEditPage) {
    console.log('⚠️ Não estamos na página de edição. Navegando...');
    window.location.href = '/dashboard/terrenos/edit/676a1234567890abcdef1234';
    return;
  }
  
  // Aguardar o formulário carregar
  setTimeout(() => {
    // Procurar pelo botão de atualização
    const updateButton = document.querySelector('button[type="submit"]') || 
                        document.querySelector('button:contains("Atualizar")') ||
                        document.querySelector('[data-testid="update-button"]');
    
    if (updateButton) {
      console.log('🎯 Botão de atualização encontrado:', updateButton);
      console.log('🔍 Estado inicial do botão:');
      console.log('  - Desabilitado:', updateButton.disabled);
      console.log('  - Classes:', updateButton.className);
      
      // Testar alteração em um campo
      const titleInput = document.querySelector('input[name="titulo"]') ||
                        document.querySelector('input[name="title"]') ||
                        document.querySelector('#titulo');
      
      if (titleInput) {
        console.log('📝 Campo de título encontrado. Testando alteração...');
        
        // Simular alteração
        titleInput.focus();
        titleInput.value = titleInput.value + ' - Editado';
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        titleInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Verificar estado do botão após alteração
        setTimeout(() => {
          console.log('🔍 Estado do botão após alteração:');
          console.log('  - Desabilitado:', updateButton.disabled);
          console.log('  - Classes:', updateButton.className);
          
          if (!updateButton.disabled) {
            console.log('✅ Sucesso! Botão foi habilitado após alteração.');
          } else {
            console.log('❌ Botão ainda está desabilitado. Verificar implementação.');
          }
        }, 500);
        
      } else {
        console.log('❌ Campo de título não encontrado.');
      }
      
    } else {
      console.log('❌ Botão de atualização não encontrado.');
    }
  }, 2000);
}

// Exportar funções
window.setTokenAndReload = setTokenAndReload;
window.testUpdateButton = testUpdateButton;

console.log('🚀 Script de teste do botão de atualização carregado!');
console.log('📋 Funções disponíveis:');
console.log('1. setTokenAndReload() - Definir token e recarregar');
console.log('2. testUpdateButton() - Testar funcionalidade do botão');