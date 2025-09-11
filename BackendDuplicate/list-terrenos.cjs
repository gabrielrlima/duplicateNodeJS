const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configurações
const API_BASE_URL = 'http://localhost:3001';
const LOGIN_EMAIL = 'gabriel@teste.com';
const LOGIN_PASSWORD = '123456';

async function listTerrenos() {
  try {
    console.log('🔐 Fazendo login...');
    
    // Fazer login
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD
      })
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      throw new Error(`Erro ao fazer login: ${errorData.message || loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    console.log('✅ Login realizado com sucesso!');
    console.log('📋 Buscando terrenos...\n');

    try {
      // Primeiro, buscar as imobiliárias do usuário
      const realEstatesResponse = await fetch(`${API_BASE_URL}/api/real-estate/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!realEstatesResponse.ok) {
        const errorData = await realEstatesResponse.json();
        throw new Error(`Erro ao buscar imobiliárias: ${errorData.message || realEstatesResponse.statusText}`);
      }

      const realEstatesData = await realEstatesResponse.json();
      const realEstates = realEstatesData.data.realEstates;

      if (!realEstates || realEstates.length === 0) {
        console.log('❌ Nenhuma imobiliária encontrada para este usuário.');
        return;
      }

      console.log(`📋 Encontradas ${realEstates.length} imobiliária(s). Buscando terrenos...\n`);

      let totalTerrenos = 0;
      
      // Para cada imobiliária, buscar seus terrenos
      for (const realEstate of realEstates) {
        console.log(`🏢 Imobiliária: ${realEstate.name} (ID: ${realEstate.id})`);
        
        // Fazer requisição para listar terrenos desta imobiliária
        const response = await fetch(`${API_BASE_URL}/api/terreno/list?real_estate_id=${realEstate.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`❌ Erro ao buscar terrenos da imobiliária ${realEstate.name}: ${errorData.message || response.statusText}`);
          continue;
        }

        const data = await response.json();
        const terrenos = data.data.terrenos;
        
        console.log(`   📊 Total de terrenos: ${terrenos.length}`);
        totalTerrenos += terrenos.length;

        if (terrenos.length > 0) {
          console.log('   🏞️  Lista de terrenos:');
          terrenos.forEach((terreno, index) => {
            console.log(`   ${index + 1}. ${terreno.name}`);
            console.log(`      💰 Valor: R$ ${terreno.value?.toLocaleString('pt-BR') || 'N/A'}`);
            console.log(`      📐 Área Total: ${terreno.totalArea || 'N/A'} m²`);
            console.log(`      🏷️  Tipo: ${terreno.type || 'N/A'}`);
            console.log(`      📍 Localização: ${terreno.address?.city || 'N/A'}, ${terreno.address?.state || 'N/A'}`);
            console.log(`      🔖 Status: ${terreno.status || 'N/A'}`);
            console.log(`      🆔 ID: ${terreno.id}`);
            console.log('');
          });
        } else {
          console.log('   ℹ️  Nenhum terreno encontrado nesta imobiliária.');
        }
        console.log('');
      }

      console.log('📊 RESUMO GERAL:');
      console.log(`   🏢 Total de imobiliárias: ${realEstates.length}`);
      console.log(`   🏞️  Total de terrenos: ${totalTerrenos}`);
      
      if (totalTerrenos > 0) {
        console.log('\n✅ Listagem de terrenos concluída com sucesso!');
      } else {
        console.log('\n⚠️  Nenhum terreno foi encontrado em todas as imobiliárias.');
      }
      
    } catch (error) {
      console.error('❌ Erro ao listar terrenos:', error.message);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error.message);
    process.exit(1);
  }
}

// Executar o script
listTerrenos();