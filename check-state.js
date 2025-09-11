const axios = require('axios');

async function checkCurrentState() {
  try {
    console.log('=== Verificando estado atual ===');
    
    // Buscar imobiliárias
    const realEstatesResponse = await axios.get('http://localhost:3001/api/real-estates');
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
          const terrenosResponse = await axios.get(`http://localhost:3001/api/terrenos?real_estate_id=${realEstate.id}`);
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