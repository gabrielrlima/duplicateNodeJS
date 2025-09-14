// Script para verificar se as propriedades estão sendo carregadas corretamente
console.log('🔍 Verificando propriedades na página...');

// Aguardar um pouco para a página carregar
setTimeout(() => {
  // Verificar se há elementos da tabela de propriedades
  const tableRows = document.querySelectorAll('table tbody tr');
  console.log(`📊 Linhas da tabela encontradas: ${tableRows.length}`);
  
  // Verificar se há células com preço
  const priceCells = document.querySelectorAll('td');
  let empreendimentosEncontrados = 0;
  
  priceCells.forEach((cell, index) => {
    const text = cell.textContent;
    if (text.includes('R$') || text.includes('Empreendimento')) {
      console.log(`💰 Célula ${index}: ${text}`);
      if (text.includes('Empreendimento')) {
        empreendimentosEncontrados++;
      }
    }
  });
  
  console.log(`🏗️ Empreendimentos encontrados na tabela: ${empreendimentosEncontrados}`);
  
  // Verificar se há dados no contexto React
  if (window.React) {
    console.log('⚛️ React detectado na página');
  }
  
  // Verificar se há erros no console
  console.log('✅ Verificação concluída');
}, 3000);