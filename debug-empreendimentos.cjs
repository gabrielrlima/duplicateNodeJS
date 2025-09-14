const axios = require('axios');

async function debugEmpreendimentos() {
  try {
    // Fazer login primeiro
    console.log('🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'gabriel@teste.com',
      password: '123456'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login realizado com sucesso!');
    
    // Configurar headers de autenticação
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('🔍 Listando todas as imobiliárias...');
    const realEstatesResponse = await axios.get('http://localhost:3001/api/real-estate', { headers: authHeaders });
    console.log('📋 Estrutura da resposta:', JSON.stringify(realEstatesResponse.data, null, 2));
    
    const realEstates = realEstatesResponse.data.data || realEstatesResponse.data || [];
    console.log('🏢 Imobiliárias encontradas:', realEstates.length || 0);
    
    if (realEstates && realEstates.length > 0) {
       realEstates.forEach((re, i) => {
         console.log(`   ${i+1}. ${re.name} (ID: ${re._id || re.id})`);
       });
       
       // Buscar produtos para cada imobiliária
       for (const realEstate of realEstates) {
        const realEstateId = realEstate._id || realEstate.id;
        console.log(`\n🔍 Buscando produtos para ${realEstate.name} (${realEstateId})...`);
        
        try {
           const response = await axios.get(`http://localhost:3001/api/products?real_estate_id=${realEstateId}`, { headers: authHeaders });
           const products = response.data.data || response.data || [];
          console.log(`   📦 Produtos encontrados: ${products.length}`);
          
          if (products.length > 0) {
            const empreendimentos = products.filter(p => p.tipo === 'empreendimento' || p.type === 'empreendimento');
            console.log(`   🏢 Empreendimentos: ${empreendimentos.length}`);
            
            empreendimentos.forEach((emp, i) => {
              console.log(`\n     🏗️  Empreendimento ${i+1}: ${emp.titulo || emp.name}`);
              console.log(`        ID: ${emp._id || emp.id}`);
              console.log(`        Preço: R$ ${emp.preco || emp.value || 0}`);
              console.log(`        Plantas: ${emp.plantas ? emp.plantas.length : 'undefined'}`);
              
              if (emp.plantas && emp.plantas.length > 0) {
                emp.plantas.forEach((planta, j) => {
                  console.log(`          Planta ${j+1}: ${planta.area}m² - R$ ${planta.precoPorM2}/m²`);
                });
                
                // Calcular média
                const precos = emp.plantas.map(p => p.precoPorM2).filter(p => p > 0);
                if (precos.length > 0) {
                  const media = precos.reduce((a, b) => a + b, 0) / precos.length;
                  console.log(`          💰 Média: R$ ${media.toFixed(2)}/m²`);
                }
              }
            });
          }
        } catch (err) {
          console.log(`   ❌ Erro ao buscar produtos: ${err.message}`);
        }
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

debugEmpreendimentos();