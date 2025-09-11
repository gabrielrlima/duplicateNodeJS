// Teste do campo de upload de imagens no formulário de terreno
// Execute no console do navegador na página: http://localhost:8080/dashboard/terrenos/new

console.log('🖼️ Teste do campo de upload de imagens');

// Verificar se o campo de upload está presente
function verificarCampoUpload() {
  const uploadArea = document.querySelector('[data-testid="upload"], .upload-area, input[type="file"]');
  const imagensSection = document.querySelector('h6');
  
  console.log('📋 Verificação do campo de upload:');
  console.log('✅ Área de upload encontrada:', !!uploadArea);
  
  // Procurar por texto "Imagens do Terreno"
  const imagensTitle = Array.from(document.querySelectorAll('h6')).find(h6 => 
    h6.textContent.includes('Imagens do Terreno')
  );
  console.log('✅ Seção "Imagens do Terreno" encontrada:', !!imagensTitle);
  
  // Procurar por dropzone ou área de upload
  const dropzone = document.querySelector('.dropzone, [role="button"]');
  console.log('✅ Dropzone encontrada:', !!dropzone);
  
  // Verificar texto de ajuda
  const helperText = Array.from(document.querySelectorAll('*')).find(el => 
    el.textContent && el.textContent.includes('3MB')
  );
  console.log('✅ Texto de ajuda encontrado:', !!helperText);
  
  if (imagensTitle && (uploadArea || dropzone)) {
    console.log('🎉 Campo de upload de imagens carregado com sucesso!');
    return true;
  } else {
    console.log('❌ Campo de upload não encontrado ou incompleto');
    return false;
  }
}

// Simular upload de arquivo (apenas para teste da interface)
function simularUpload() {
  console.log('📤 Simulando upload de arquivo...');
  
  // Criar um arquivo de teste
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = 'white';
  ctx.font = '12px Arial';
  ctx.fillText('TESTE', 30, 55);
  
  canvas.toBlob((blob) => {
    const file = new File([blob], 'teste-terreno.png', { type: 'image/png' });
    console.log('📁 Arquivo de teste criado:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Tentar encontrar input de arquivo
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      console.log('✅ Input de arquivo encontrado, simulando seleção...');
      
      // Criar evento de mudança
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // Disparar evento
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('📤 Upload simulado com sucesso!');
    } else {
      console.log('❌ Input de arquivo não encontrado');
    }
  }, 'image/png');
}

// Executar verificação
if (verificarCampoUpload()) {
  setTimeout(() => {
    simularUpload();
  }, 2000);
}

console.log('\n📋 Instruções:');
console.log('1. Verifique se a seção "Imagens do Terreno" está visível');
console.log('2. Deve haver uma área de upload com drag & drop');
console.log('3. O texto de ajuda deve mencionar "3MB" e formatos aceitos');
console.log('4. Você pode arrastar imagens ou clicar para selecionar');
console.log('5. O upload simulado será executado automaticamente em 2 segundos');