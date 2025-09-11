const axios = require('axios');

async function testFrontendTerrenos() {
  try {
    console.log('=== Testando carregamento de terrenos no frontend ===');
    
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
    console.log(`\nImobiliárias encontradas: ${realEstates.length}`);
    
    // Testar especificamente a imobiliária "Adão imóveis" que tem terrenos
    const adaoImoveis = realEstates.find(re => re.name === 'Adão imóveis');
    
    if (adaoImoveis) {
      console.log(`\n🏢 Testando imobiliária: ${adaoImoveis.name} (ID: ${adaoImoveis.id})`);
      
      // Testar a rota que o frontend usa
      const terrenosResponse = await axios.get(`http://localhost:3001/api/terreno/list?real_estate_id=${adaoImoveis.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('\n📊 Resposta da API:');
      console.log('Status:', terrenosResponse.status);
      console.log('Estrutura dos dados:', {
        success: terrenosResponse.data.success,
        hasData: !!terrenosResponse.data.data,
        hasTerrenos: !!terrenosResponse.data.data?.terrenos,
        terrenosCount: terrenosResponse.data.data?.terrenos?.length || 0
      });
      
      if (terrenosResponse.data.data?.terrenos?.length > 0) {
        console.log('\n✅ Terrenos encontrados! Primeiros 3:');
        terrenosResponse.data.data.terrenos.slice(0, 3).forEach((terreno, index) => {
          console.log(`${index + 1}. ${terreno.name || 'Sem nome'}`);
          console.log(`   Área: ${terreno.totalArea || 'N/A'} m²`);
          console.log(`   Valor: R$ ${terreno.value?.toLocaleString('pt-BR') || 'N/A'}`);
          console.log(`   Status: ${terreno.status || 'N/A'}`);
        });
      } else {
        console.log('\n❌ Nenhum terreno encontrado na resposta da API');
      }
      
    } else {
      console.log('\n❌ Imobiliária "Adão imóveis" não encontrada');
    }
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFrontendTerrenos();