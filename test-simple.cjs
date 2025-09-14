const axios = require('axios');

async function test() {
  try {
    console.log('Login...');
    const login = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'gabriel@teste.com',
      password: '123456'
    });
    
    const token = login.data.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log('Buscando imobiliárias...');
    const realEstates = await axios.get('http://localhost:3001/api/real-estate', { headers });
    console.log('Resposta:', JSON.stringify(realEstates.data, null, 2));
    
  } catch (error) {
    console.error('Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

test();