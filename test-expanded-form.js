// Script para testar o formulário expandido de terreno
// Execute no console do navegador na página: http://localhost:8080/dashboard/terrenos/new

console.log('🧪 Iniciando teste do formulário expandido de terreno...');

// Função para testar validações dos campos obrigatórios
function testFormValidations() {
  console.log('\n📋 Testando validações dos campos obrigatórios...');
  
  // Tentar submeter formulário vazio
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    console.log('✅ Botão de submit encontrado');
    submitButton.click();
    
    // Aguardar um pouco para as validações aparecerem
    setTimeout(() => {
      const errorMessages = document.querySelectorAll('.Mui-error, [role="alert"]');
      console.log(`🔍 Encontradas ${errorMessages.length} mensagens de erro de validação`);
      
      errorMessages.forEach((error, index) => {
        console.log(`❌ Erro ${index + 1}: ${error.textContent}`);
      });
    }, 1000);
  } else {
    console.log('❌ Botão de submit não encontrado');
  }
}

// Função para preencher formulário com dados de teste
function fillTestData() {
  console.log('\n📝 Preenchendo formulário com dados de teste...');
  
  const testData = {
    titulo: 'Terreno de Teste Expandido',
    descricao: 'Este é um terreno de teste criado pelo formulário expandido com todos os campos preenchidos.',
    preco: '250000',
    area: '600',
    'endereco.rua': 'Rua das Palmeiras',
    'endereco.numero': '456',
    'endereco.bairro': 'Jardim das Flores',
    'endereco.cidade': 'São Paulo',
    'endereco.estado': 'SP',
    'endereco.cep': '01234567',
    dimensoes: '20m x 30m',
    'proprietario.nome': 'Maria Silva Santos',
    'proprietario.email': 'maria.santos@email.com',
    'proprietario.telefone': '(11) 98765-4321',
    'proprietario.documento': '123.456.789-00'
  };
  
  // Preencher campos de texto
  Object.entries(testData).forEach(([fieldName, value]) => {
    const input = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
    if (input) {
      input.focus();
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✅ Campo '${fieldName}' preenchido com: ${value}`);
    } else {
      console.log(`❌ Campo '${fieldName}' não encontrado`);
    }
  });
  
  // Configurar switches
  setTimeout(() => {
    const precoNegociavelSwitch = document.querySelector('input[name="precoNegociavel"]');
    if (precoNegociavelSwitch && !precoNegociavelSwitch.checked) {
      precoNegociavelSwitch.click();
      console.log('✅ Switch "Preço Negociável" ativado');
    }
    
    const documentacaoSwitch = document.querySelector('input[name="temDocumentacao"]');
    if (documentacaoSwitch && !documentacaoSwitch.checked) {
      documentacaoSwitch.click();
      console.log('✅ Switch "Tem Documentação" ativado');
    }
  }, 500);
}

// Função para testar submissão do formulário
function testFormSubmission() {
  console.log('\n🚀 Testando submissão do formulário...');
  
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    console.log('📤 Submetendo formulário...');
    submitButton.click();
    
    // Monitorar requisições de rede
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      console.log('🌐 Requisição interceptada:', args[0]);
      return originalFetch.apply(this, args)
        .then(response => {
          console.log('📥 Resposta recebida:', response.status, response.statusText);
          return response;
        })
        .catch(error => {
          console.log('❌ Erro na requisição:', error);
          throw error;
        });
    };
  }
}

// Função principal de teste
function runCompleteFormTest() {
  console.log('🎯 Executando teste completo do formulário expandido...');
  
  // Teste 1: Validações
  testFormValidations();
  
  // Teste 2: Preenchimento após 3 segundos
  setTimeout(() => {
    fillTestData();
    
    // Teste 3: Submissão após mais 3 segundos
    setTimeout(() => {
      testFormSubmission();
    }, 3000);
  }, 3000);
}

// Executar teste
runCompleteFormTest();

console.log('\n📋 Instruções:');
console.log('1. O teste irá primeiro tentar submeter o formulário vazio para verificar validações');
console.log('2. Depois irá preencher todos os campos com dados de teste');
console.log('3. Por fim irá submeter o formulário preenchido');
console.log('4. Monitore o console para ver os resultados de cada etapa');