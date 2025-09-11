const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configurações
const API_BASE_URL = 'http://localhost:3001';
const LOGIN_EMAIL = 'gabriel@teste.com';
const LOGIN_PASSWORD = '123456';
const REAL_ESTATE_NAME = 'Adão imóveis';

async function listTerrenosAdaoImoveis() {
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
    console.log(`🔍 Buscando terrenos da imobiliária "${REAL_ESTATE_NAME}"...\n`);

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

      // Encontrar a imobiliária "Adão Imóveis"
      const adaoImoveis = realEstates.find(re => re.name === REAL_ESTATE_NAME);
      
      if (!adaoImoveis) {
        console.log(`❌ Imobiliária "${REAL_ESTATE_NAME}" não encontrada.`);
        console.log('📋 Imobiliárias disponíveis:');
        realEstates.forEach((re, index) => {
          console.log(`   ${index + 1}. ${re.name} (ID: ${re.id})`);
        });
        return;
      }

      console.log(`🏢 Imobiliária encontrada: ${adaoImoveis.name} (ID: ${adaoImoveis.id})`);
      
      // Buscar terrenos da Adão Imóveis
      const response = await fetch(`${API_BASE_URL}/api/terreno/list?real_estate_id=${adaoImoveis.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar terrenos: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const terrenos = data.data.terrenos;
      
      console.log(`\n📊 Total de terrenos na ${REAL_ESTATE_NAME}: ${terrenos.length}`);

      if (terrenos.length > 0) {
        console.log('\n🏞️  LISTA DE TERRENOS DA ADÃO IMÓVEIS:');
        console.log('=' .repeat(60));
        
        terrenos.forEach((terreno, index) => {
          console.log(`\n${index + 1}. ${terreno.name}`);
          console.log(`   💰 Valor: R$ ${terreno.value?.toLocaleString('pt-BR') || 'N/A'}`);
          console.log(`   📐 Área Total: ${terreno.totalArea || 'N/A'} m²`);
          console.log(`   🏷️  Tipo: ${terreno.type || 'N/A'}`);
          console.log(`   📍 Endereço: ${terreno.address?.street || 'N/A'}, ${terreno.address?.number || 'N/A'}`);
          console.log(`   🏘️  Bairro: ${terreno.address?.neighborhood || 'N/A'}`);
          console.log(`   🌆 Cidade: ${terreno.address?.city || 'N/A'}, ${terreno.address?.state || 'N/A'}`);
          console.log(`   📮 CEP: ${terreno.address?.zipCode || 'N/A'}`);
          console.log(`   🔖 Status: ${terreno.status || 'N/A'}`);
          console.log(`   🏔️  Topografia: ${terreno.topography || 'N/A'}`);
          console.log(`   🌱 Vegetação: ${terreno.vegetation || 'N/A'}`);
          console.log(`   🏗️  Zoneamento: ${terreno.zoning || 'N/A'}`);
          console.log(`   🆔 ID: ${terreno.id || 'N/A'}`);
          
          if (terreno.description) {
            console.log(`   📝 Descrição: ${terreno.description}`);
          }
        });
        
        console.log('\n' + '=' .repeat(60));
        console.log(`✅ Listagem concluída! Total: ${terrenos.length} terrenos`);
      } else {
        console.log(`\n⚠️  Nenhum terreno encontrado na imobiliária "${REAL_ESTATE_NAME}".`);
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
listTerrenosAdaoImoveis();