// Script para obter o token do sessionStorage
// Execute este script no console do navegador (F12)

console.log('🔍 Buscando token de autenticação...');

const token = sessionStorage.getItem('sanctum_access_token');

if (token) {
  console.log('✅ Token encontrado!');
  console.log('📋 Copie o comando abaixo e execute no terminal:');
  console.log('');
  console.log(`echo "API_TOKEN=${token}" >> .env`);
  console.log('');
  console.log('🔧 Ou adicione manualmente no arquivo .env:');
  console.log(`API_TOKEN=${token}`);
} else {
  console.log('❌ Token não encontrado!');
  console.log('💡 Certifique-se de estar logado no sistema.');
  console.log('🔄 Faça login e execute este script novamente.');
}

// Também verificar outros possíveis locais do token
const allKeys = Object.keys(sessionStorage);
console.log('🗂️ Chaves disponíveis no sessionStorage:', allKeys);

const allLocalKeys = Object.keys(localStorage);
console.log('🗂️ Chaves disponíveis no localStorage:', allLocalKeys);