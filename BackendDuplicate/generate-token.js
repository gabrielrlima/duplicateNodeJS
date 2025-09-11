const jwt = require('jsonwebtoken');

// Usar o mesmo secret do arquivo .env
const secret = 'your-super-secret-jwt-key-here-development';

// Pegar o ID do parâmetro da linha de comando ou usar o padrão
const userId = process.argv[2] || '676a1234567890abcdef1234';

// Payload do token
const payload = {
  id: userId,
  email: 'teste@exemplo.com',
  firstName: 'Usuário',
  lastName: 'Teste'
};

// Gerar token
const token = jwt.sign(payload, secret, { expiresIn: '7d' });

console.log('Token JWT gerado:');
console.log(token);

// Verificar se o token é válido
try {
  const decoded = jwt.verify(token, secret);
  console.log('\nToken verificado com sucesso:');
  console.log(decoded);
} catch (error) {
  console.error('Erro ao verificar token:', error.message);
}