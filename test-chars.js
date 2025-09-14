// Teste de caracteres especiais
const regex1 = /^[a-zA-ZÀ-ÿ0-9\s\-.,:]+$/;
const regex2 = /^[a-zA-Z0-9\s\-.,:]+$/;

console.log('Regex com À-ÿ:', regex1);
console.log('Regex sem À-ÿ:', regex2);

// Teste com string
const testString = 'Apartamento 3 quartos';
console.log('Teste 1:', regex1.test(testString));
console.log('Teste 2:', regex2.test(testString));