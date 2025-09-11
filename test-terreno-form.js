// Script para testar o formulário de terreno
// Execute este script no console do navegador na página http://localhost:8080/dashboard/terrenos/new

function testTerrenoForm() {
  console.log('🧪 Iniciando teste do formulário de terreno...');
  
  // Função para aguardar um elemento aparecer
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Elemento ${selector} não encontrado em ${timeout}ms`));
      }, timeout);
    });
  }
  
  // Função para preencher um campo
  function fillField(selector, value) {
    const field = document.querySelector(selector);
    if (field) {
      field.focus();
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.blur();
      console.log(`✅ Campo ${selector} preenchido com: ${value}`);
      return true;
    } else {
      console.error(`❌ Campo ${selector} não encontrado`);
      return false;
    }
  }
  
  // Função para selecionar uma opção em um select
  function selectOption(selector, value) {
    const select = document.querySelector(selector);
    if (select) {
      select.focus();
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✅ Select ${selector} definido para: ${value}`);
      return true;
    } else {
      console.error(`❌ Select ${selector} não encontrado`);
      return false;
    }
  }
  
  // Dados de teste
  const testData = {
    titulo: 'Terreno de Teste Automatizado',
    preco: '150000',
    area: '500',
    proprietario: {
      nome: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '11999887766',
      documento: '12345678901'
    },
    descricao: 'Terreno criado através de teste automatizado',
    status: 'disponivel',
    tipo: 'residencial'
  };
  
  // Aguardar o formulário carregar e preencher os campos
  setTimeout(() => {
    console.log('📝 Preenchendo campos obrigatórios...');
    
    // Campos obrigatórios
    fillField('input[name="titulo"]', testData.titulo);
    fillField('input[name="preco"]', testData.preco);
    fillField('input[name="area"]', testData.area);
    
    // Dados do proprietário
    fillField('input[name="proprietario.nome"]', testData.proprietario.nome);
    fillField('input[name="proprietario.email"]', testData.proprietario.email);
    fillField('input[name="proprietario.telefone"]', testData.proprietario.telefone);
    fillField('input[name="proprietario.documento"]', testData.proprietario.documento);
    
    // Campos opcionais
    fillField('textarea[name="descricao"]', testData.descricao);
    
    console.log('✅ Todos os campos obrigatórios foram preenchidos!');
    console.log('🎯 Agora você pode clicar no botão "Criar Terreno" para testar a submissão');
    
    // Destacar o botão de submissão
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.style.border = '3px solid #ff0000';
      submitButton.style.animation = 'pulse 1s infinite';
      console.log('🔴 Botão de submissão destacado em vermelho!');
    }
    
  }, 2000);
}

// Função para testar a submissão automaticamente
function testSubmission() {
  console.log('🚀 Testando submissão do formulário...');
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.click();
    console.log('✅ Botão de submissão clicado!');
    
    // Monitorar logs do console por 10 segundos
    console.log('👀 Monitorando logs por 10 segundos...');
    setTimeout(() => {
      console.log('⏰ Monitoramento concluído. Verifique se houve redirecionamento.');
    }, 10000);
  } else {
    console.error('❌ Botão de submissão não encontrado!');
  }
}

// Exportar funções para uso no console
window.testTerrenoForm = testTerrenoForm;
window.testSubmission = testSubmission;

console.log('🧪 Script de teste carregado!');
console.log('📋 Para usar:');
console.log('1. testTerrenoForm() - Preenche os campos do formulário');
console.log('2. testSubmission() - Testa a submissão após preencher os campos');
console.log('3. Ou execute ambos: testTerrenoForm(); setTimeout(testSubmission, 3000);');