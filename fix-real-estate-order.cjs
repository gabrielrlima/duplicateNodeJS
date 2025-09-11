const axios = require('axios');

async function fixRealEstateOrder() {
  try {
    console.log('=== Verificando ordem das imobiliárias ===');
    
    // Fazer login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'gabriel@teste.com',
      password: '123456'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Erro ao fazer login');
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login realizado com sucesso!');
    
    // Buscar imobiliárias
    const realEstatesResponse = await axios.get('http://localhost:3001/api/real-estate/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const realEstates = realEstatesResponse.data.data.realEstates;
    console.log('\n📋 Ordem atual das imobiliárias:');
    
    for (let i = 0; i < realEstates.length; i++) {
      const realEstate = realEstates[i];
      
      // Contar terrenos para cada imobiliária
      try {
        const terrenosResponse = await axios.get(`http://localhost:3001/api/terreno/list?real_estate_id=${realEstate.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const terrenosCount = terrenosResponse.data.data.terrenos.length;
        const isFirst = i === 0;
        
        console.log(`${i + 1}. ${realEstate.name} (${terrenosCount} terrenos)${isFirst ? ' ← PRIMEIRA (selecionada automaticamente)' : ''}`);
        
        if (isFirst && terrenosCount === 0) {
          console.log('   ⚠️  PROBLEMA: A primeira imobiliária não tem terrenos!');
        }
        
      } catch (error) {
        console.log(`${i + 1}. ${realEstate.name} (erro ao contar terrenos)`);
      }
    }
    
    // Encontrar imobiliária com mais terrenos
    const adaoImoveis = realEstates.find(re => re.name === 'Adão imóveis');
    if (adaoImoveis) {
      console.log('\n💡 SOLUÇÃO:');
      console.log('A imobiliária "Adão imóveis" tem terrenos, mas não é a primeira da lista.');
      console.log('O usuário precisa selecionar manualmente "Adão imóveis" no header da aplicação.');
      console.log('\n📍 Instruções para o usuário:');
      console.log('1. Acesse: http://localhost:8080/dashboard/terrenos/todos-os-terrenos');
      console.log('2. No header da aplicação, clique no seletor de imobiliária');
      console.log('3. Selecione "Adão imóveis"');
      console.log('4. Os terrenos devem aparecer na listagem');
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

fixRealEstateOrder();