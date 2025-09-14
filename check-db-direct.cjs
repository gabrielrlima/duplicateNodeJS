const axios = require('axios');

async function checkDatabase() {
  try {
    console.log('🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'gabriel@teste.com',
      password: '123456'
    });
    
    const token = loginResponse.data.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log('🏢 Buscando imobiliárias...');
    const realEstateResponse = await axios.get('http://localhost:3001/api/real-estate', { headers });
    
    console.log('📋 Estrutura da resposta:', JSON.stringify(realEstateResponse.data, null, 2));
    
    const realEstates = realEstateResponse.data.data || realEstateResponse.data || [];
    console.log(`📊 Total de imobiliárias: ${Array.isArray(realEstates) ? realEstates.length : 'não é array'}`);
    
    if (!Array.isArray(realEstates)) {
      console.log('❌ realEstates não é um array:', typeof realEstates);
      return;
    }
    
    for (const realEstate of realEstates) {
      console.log(`\n🏢 Imobiliária: ${realEstate.name} (ID: ${realEstate.id})`);
      
      try {
        const productsResponse = await axios.get(`http://localhost:3001/api/products?real_estate_id=${realEstate.id}`, { headers });
        const products = productsResponse.data.data || [];
        
        console.log(`   📦 Total de produtos: ${products.length}`);
        
        const empreendimentos = products.filter(p => p.tipo === 'empreendimento');
        console.log(`   🏗️ Empreendimentos: ${empreendimentos.length}`);
        
        empreendimentos.forEach((emp, i) => {
          console.log(`\n     Empreendimento ${i + 1}: ${emp.titulo || emp.name}`);
          console.log(`       Tipo: ${emp.tipo}`);
          console.log(`       Preço: R$ ${emp.preco || emp.value || 0}`);
          console.log(`       Plantas: ${emp.plantas ? emp.plantas.length : 'undefined'}`);
          
          if (emp.plantas && emp.plantas.length > 0) {
            emp.plantas.forEach((planta, j) => {
              console.log(`         Planta ${j + 1}:`);
              console.log(`           Área: ${planta.area}m²`);
              console.log(`           Preço/m²: R$ ${planta.precoPorM2}`);
            });
          } else {
            console.log('         ❌ Nenhuma planta encontrada');
          }
        });
        
        // Verificar outros tipos também
        const imoveis = products.filter(p => p.tipo === 'imovel');
        const terrenos = products.filter(p => p.tipo === 'terreno');
        console.log(`   🏠 Imóveis: ${imoveis.length}`);
        console.log(`   🌍 Terrenos: ${terrenos.length}`);
        
      } catch (error) {
        console.log(`   ❌ Erro ao buscar produtos: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

checkDatabase();