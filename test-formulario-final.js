// Teste final do formulário expandido de terreno
// Execute no console do navegador na página: http://localhost:8080/dashboard/terrenos/new

console.log('🧪 Teste final do formulário expandido de terreno');

// Verificar se o formulário está carregado
function verificarFormulario() {
  const form = document.querySelector('form');
  const titulo = document.querySelector('input[name="titulo"]');
  const preco = document.querySelector('input[name="preco"]');
  const endereco = document.querySelector('input[name="endereco.rua"]');
  const proprietario = document.querySelector('input[name="proprietario.nome"]');
  
  console.log('📋 Verificação do formulário:');
  console.log('✅ Formulário encontrado:', !!form);
  console.log('✅ Campo título:', !!titulo);
  console.log('✅ Campo preço:', !!preco);
  console.log('✅ Campo endereço:', !!endereco);
  console.log('✅ Campo proprietário:', !!proprietario);
  
  if (form && titulo && preco && endereco && proprietario) {
    console.log('🎉 Formulário expandido carregado com sucesso!');
    return true;
  } else {
    console.log('❌ Formulário não está completo');
    return false;
  }
}

// Preencher dados de teste
function preencherTeste() {
  console.log('📝 Preenchendo dados de teste...');
  
  const dados = {
    titulo: 'Terreno Teste Final',
    descricao: 'Teste do formulário expandido funcionando',
    preco: '200000',
    area: '450',
    'endereco.rua': 'Rua Teste Final',
    'endereco.numero': '789',
    'endereco.bairro': 'Bairro Teste',
    'endereco.cidade': 'São Paulo',
    'endereco.estado': 'SP',
    'endereco.cep': '01234567',
    'proprietario.nome': 'João Teste Final',
    'proprietario.email': 'joao@teste.com',
    'proprietario.telefone': '11999999999',
    'proprietario.documento': '12345678900'
  };
  
  Object.entries(dados).forEach(([name, value]) => {
    const input = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
    if (input) {
      input.focus();
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✅ ${name}: ${value}`);
    } else {
      console.log(`❌ Campo não encontrado: ${name}`);
    }
  });
  
  console.log('✅ Dados preenchidos! Agora você pode testar a submissão.');
}

// Executar verificação
if (verificarFormulario()) {
  setTimeout(() => {
    preencherTeste();
  }, 1000);
}

console.log('\n📋 Instruções:');
console.log('1. O formulário expandido deve estar visível com todas as seções');
console.log('2. Os dados de teste serão preenchidos automaticamente');
console.log('3. Clique em "Criar Terreno" para testar a submissão');
console.log('4. Verifique se o terreno é criado com sucesso');