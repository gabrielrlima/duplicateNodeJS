const axios = require('axios');

async function checkDuplicateIds() {
  try {
    console.log('=== Verificando IDs duplicados nos terrenos ===');
    
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
    const adaoImoveis = realEstates.find(re => re.name === 'Adão imóveis');
    
    if (!adaoImoveis) {
      console.log('❌ Imobiliária "Adão imóveis" não encontrada');
      return;
    }
    
    // Buscar terrenos da Adão imóveis
    const terrenosResponse = await axios.get(`http://localhost:3001/api/terreno/list?real_estate_id=${adaoImoveis.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const terrenos = terrenosResponse.data.data.terrenos;
    console.log(`\n📋 Total de terrenos: ${terrenos.length}`);
    
    // Verificar IDs duplicados
    const ids = terrenos.map(t => t.id);
    const uniqueIds = [...new Set(ids)];
    
    console.log(`\n🔍 Verificação de IDs:`);
    console.log(`- IDs totais: ${ids.length}`);
    console.log(`- IDs únicos: ${uniqueIds.length}`);
    
    if (ids.length !== uniqueIds.length) {
      console.log('\n⚠️  PROBLEMA: IDs duplicados encontrados!');
      
      // Encontrar duplicatas
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      const uniqueDuplicates = [...new Set(duplicates)];
      
      console.log(`\n🔴 IDs duplicados (${uniqueDuplicates.length}):`);
      uniqueDuplicates.forEach(id => {
        const count = ids.filter(i => i === id).length;
        console.log(`- ${id}: aparece ${count} vezes`);
        
        // Mostrar detalhes dos terrenos duplicados
        const duplicateTerrenos = terrenos.filter(t => t.id === id);
        duplicateTerrenos.forEach((t, index) => {
          console.log(`  ${index + 1}. ${t.name || t.title || 'Sem nome'} (${t.totalArea || 0}m²)`);
        });
      });
      
    } else {
      console.log('✅ Todos os IDs são únicos!');
    }
    
    // Verificar se há outros campos que podem estar causando problemas
    console.log('\n🔍 Verificando outros possíveis problemas:');
    
    // Verificar se há objetos sendo renderizados como strings
    const problematicFields = [];
    
    terrenos.slice(0, 3).forEach((terreno, index) => {
      console.log(`\n${index + 1}. ${terreno.name || 'Sem nome'}:`);
      
      // Verificar campos que podem ser objetos
      const fieldsToCheck = ['address', 'location', 'owner', 'characteristics'];
      
      fieldsToCheck.forEach(field => {
        if (terreno[field] && typeof terreno[field] === 'object') {
          console.log(`   - ${field}: é objeto`);
          console.log(`     Estrutura: ${JSON.stringify(terreno[field], null, 4)}`);
        }
      });
    });
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

checkDuplicateIds();