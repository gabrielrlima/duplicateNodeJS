// Usando fetch nativo do Node.js 18+

async function testAPI() {
  try {
    console.log('🔍 Testando API...');
    
    // Login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'gabriel@teste.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('📋 Login response:', JSON.stringify(loginData, null, 2));
    
    if (!loginData.success) {
      console.error('❌ Login falhou');
      return;
    }
    
    const token = loginData.data.token;
    console.log('✅ Login realizado com sucesso');
    
    // Buscar imobiliárias
    const realEstateResponse = await fetch('http://localhost:3001/api/real-estate', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const realEstateData = await realEstateResponse.json();
    console.log('📋 Real Estate response:', JSON.stringify(realEstateData, null, 2));
    
    if (realEstateData.success && realEstateData.data) {
      console.log(`✅ Encontradas ${realEstateData.data.length} imobiliárias`);
      
      for (const realEstate of realEstateData.data) {
        console.log(`\n🏢 Imobiliária: ${realEstate.name} (ID: ${realEstate.id})`);
        
        // Buscar propriedades desta imobiliária
        const propertiesResponse = await fetch(`http://localhost:3001/api/properties?real_estate_id=${realEstate.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const propertiesData = await propertiesResponse.json();
        console.log(`📦 Properties response:`, JSON.stringify(propertiesData, null, 2));
        
        if (propertiesData.success && propertiesData.data) {
          console.log(`   📦 ${propertiesData.data.length} propriedades encontradas:`);
          propertiesData.data.forEach(prop => {
            console.log(`      - ${prop.title || prop.titulo} (Tipo: ${prop.type || prop.tipo})`);
          });
        } else {
          console.log('   ❌ Nenhuma propriedade encontrada ou erro na resposta');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testAPI();