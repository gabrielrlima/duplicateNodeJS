// Script para testar ambos os formulários e comparar
// Execute no console do navegador

function testBothForms() {
  console.log('🧪 Testando ambos os formulários de terreno...');
  
  const testData = {
    titulo: 'Terreno Teste Comparação',
    preco: '150000',
    area: '500',
    proprietario: {
      nome: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '11999887766',
      documento: '12345678901'
    }
  };
  
  // Função para preencher campos
  function fillField(selector, value) {
    const field = document.querySelector(selector);
    if (field) {
      field.focus();
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.blur();
      console.log(`✅ Campo ${selector} preenchido: ${value}`);
      return true;
    } else {
      console.error(`❌ Campo ${selector} não encontrado`);
      return false;
    }
  }
  
  // Testar formulário atual
  console.log('\n📋 Testando formulário na URL atual...');
  console.log('URL atual:', window.location.href);
  
  // Preencher campos básicos
  fillField('input[name="titulo"]', testData.titulo);
  fillField('input[name="preco"]', testData.preco);
  fillField('input[name="area"]', testData.area);
  
  // Preencher dados do proprietário
  fillField('input[name="proprietario.nome"]', testData.proprietario.nome);
  fillField('input[name="proprietario.email"]', testData.proprietario.email);
  fillField('input[name="proprietario.telefone"]', testData.proprietario.telefone);
  fillField('input[name="proprietario.documento"]', testData.proprietario.documento);
  
  // Verificar se há botão de submissão
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    console.log('✅ Botão de submissão encontrado:', submitButton.textContent);
    submitButton.style.border = '3px solid #00ff00';
    
    // Adicionar listener para capturar o evento de submissão
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        console.log('🚀 Evento de submissão capturado!');
        console.log('📋 Dados do formulário:', new FormData(form));
      });
    }
  } else {
    console.error('❌ Botão de submissão não encontrado');
  }
  
  console.log('\n🎯 Formulário preenchido! Clique no botão verde para testar a submissão.');
}

// Função para testar submissão com logs detalhados
function testSubmissionWithLogs() {
  console.log('🚀 Testando submissão com logs detalhados...');
  
  // Interceptar console.log para capturar logs do formulário
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = function(...args) {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('🎯')) {
      originalLog('🔍 [INTERCEPTADO]', ...args);
    }
    originalLog.apply(console, args);
  };
  
  console.error = function(...args) {
    originalError('🔍 [ERRO INTERCEPTADO]', ...args);
    originalError.apply(console, args);
  };
  
  // Clicar no botão de submissão
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.click();
    console.log('✅ Botão clicado, aguardando logs...');
    
    // Restaurar console após 10 segundos
    setTimeout(() => {
      console.log = originalLog;
      console.error = originalError;
      console.log('🔄 Console restaurado');
    }, 10000);
  } else {
    console.error('❌ Botão de submissão não encontrado');
  }
}

// Função para comparar URLs
function compareFormUrls() {
  console.log('🔍 Comparando URLs dos formulários:');
  console.log('📍 Formulário Principal: http://localhost:8080/dashboard/terrenos/new');
  console.log('📍 Formulário Simples: http://localhost:8080/dashboard/terrenos/new-simple');
  console.log('📍 URL Atual:', window.location.href);
  
  if (window.location.href.includes('new-simple')) {
    console.log('✅ Você está no formulário SIMPLES');
  } else if (window.location.href.includes('terrenos/new')) {
    console.log('✅ Você está no formulário PRINCIPAL');
  } else {
    console.log('❓ URL não reconhecida');
  }
}

// Exportar funções
window.testBothForms = testBothForms;
window.testSubmissionWithLogs = testSubmissionWithLogs;
window.compareFormUrls = compareFormUrls;

console.log('🧪 Script de comparação carregado!');
console.log('📋 Funções disponíveis:');
console.log('1. compareFormUrls() - Verificar qual formulário está sendo usado');
console.log('2. testBothForms() - Preencher campos do formulário atual');
console.log('3. testSubmissionWithLogs() - Testar submissão com logs detalhados');