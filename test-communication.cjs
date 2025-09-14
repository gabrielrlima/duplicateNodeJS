const axios = require('axios');

async function testCommunication() {
  console.log('=== Teste de Comunicação Frontend <-> Backend ===\n');
  
  try {
    // 1. Testar se o frontend está rodando
    console.log('1. Testando Frontend (porta 8080)...');
    const frontendResponse = await axios.get('http://localhost:8080', {
      timeout: 5000,
      headers: {
        'User-Agent': 'Test-Script'
      }
    });
    console.log('✅ Frontend OK - Status:', frontendResponse.status);
    
    // 2. Testar se o backend está rodando
    console.log('\n2. Testando Backend (porta 3001)...');
    const backendResponse = await axios.get('http://localhost:3001', {
      timeout: 5000,
      headers: {
        'User-Agent': 'Test-Script'
      }
    });
    console.log('✅ Backend OK - Status:', backendResponse.status);
    
    // 3. Testar login no backend
    console.log('\n3. Testando Login no Backend...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'gabriel@teste.com',
      password: '123456'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      }
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login OK - Token recebido');
      const token = loginResponse.data.data.token;
      
      // 4. Testar requisição autenticada
      console.log('\n4. Testando Requisição Autenticada...');
      const authResponse = await axios.get('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Origin': 'http://localhost:8080'
        }
      });
      
      if (authResponse.data.success) {
        console.log('✅ Requisição Autenticada OK');
        console.log('   Usuário:', authResponse.data.data.firstName, authResponse.data.data.lastName);
      } else {
        console.log('❌ Erro na requisição autenticada:', authResponse.data.message);
      }
      
      // 5. Testar CORS com preflight
      console.log('\n5. Testando CORS (OPTIONS)...');
      try {
        const corsResponse = await axios.options('http://localhost:3001/api/auth/login', {
          headers: {
            'Origin': 'http://localhost:8080',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type,Authorization'
          }
        });
        console.log('✅ CORS OK - Status:', corsResponse.status);
        console.log('   Headers CORS:', {
          'Access-Control-Allow-Origin': corsResponse.headers['access-control-allow-origin'],
          'Access-Control-Allow-Methods': corsResponse.headers['access-control-allow-methods'],
          'Access-Control-Allow-Headers': corsResponse.headers['access-control-allow-headers']
        });
      } catch (corsError) {
        console.log('❌ Erro CORS:', corsError.message);
      }
      
    } else {
      console.log('❌ Erro no login:', loginResponse.data.message);
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   Possível causa: Servidor não está rodando na porta especificada');
    }
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
  
  console.log('\n=== Fim do Teste ===');
}

testCommunication();