// Teste manual rápido do formulário expandido
// Execute no console do navegador

console.log('🧪 Teste manual do formulário expandido');

// Dados de teste mínimos
const testData = {
  titulo: 'Terreno Teste Expandido',
  descricao: 'Terreno para teste do formulário expandido',
  preco: '180000',
  area: '400',
  'endereco.rua': 'Rua Teste',
  'endereco.numero': '123',
  'endereco.bairro': 'Bairro Teste',
  'endereco.cidade': 'São Paulo',
  'endereco.estado': 'SP',
  'endereco.cep': '01234567',
  'proprietario.nome': 'João Teste',
  'proprietario.email': 'joao@teste.com',
  'proprietario.telefone': '11999999999',
  'proprietario.documento': '12345678900'
};

// Preencher campos
Object.entries(testData).forEach(([name, value]) => {
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

console.log('\n✅ Formulário preenchido! Agora você pode clicar em "Criar Terreno" para testar a submissão.');