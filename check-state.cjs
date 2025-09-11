const axios = require('axios');

async function checkCurrentState() {
  try {
    console.log('=== Verificando estado atual ===');
    
    // Fazer login primeiro
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
    
    console.log('\nImobiliárias disponíveis:');
    realEstates.forEach(re => {
      console.log(`- ${re.name} (ID: ${re.id})`);
    });
    
    if (realEstates.length > 0) {
      // Testar API de terrenos para cada imobiliária
      for (const realEstate of realEstates) {
        console.log(`\nTestando terrenos para: ${realEstate.name}`);
        try {
          const terrenosResponse = await axios.get(`http://localhost:3001/api/terreno/list?real_estate_id=${realEstate.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log(`Terrenos encontrados: ${terrenosResponse.data.data.terrenos.length}`);
          
          if (terrenosResponse.data.data.terrenos.length > 0) {
            const firstTerreno = terrenosResponse.data.data.terrenos[0];
            console.log('Primeiro terreno:', {
              id: firstTerreno.id,
              name: firstTerreno.name || firstTerreno.title,
              totalArea: firstTerreno.totalArea,
              value: firstTerreno.value
            });
          }
        } catch (error) {
          console.error(`Erro ao buscar terrenos para ${realEstate.name}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

checkCurrentState();