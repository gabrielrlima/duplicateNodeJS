const https = require('https');
const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function createMissingProducts() {
  try {
    console.log('🔐 Fazendo login...');
    
    // Login
    const loginData = await makeRequest('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'gabriel@teste.com',
        password: '123456'
      })
    });
    
    if (!loginData.success) {
      throw new Error('Login falhou');
    }
    
    const token = loginData.data.token;
    console.log('✅ Login realizado com sucesso');
    
    const adaoRealEstateId = '68c4467199df1835267f3e48'; // Adão Imóveis
    
    console.log('🏗️ Criando terrenos e empreendimentos para a Adão Imóveis...');
    
    // Terrenos
    const terrenos = [
      {
        name: 'Terreno Residencial - São Paulo',
        type: 'terreno',
        area: 300,
        value: 450000,
        description: 'Terreno residencial em excelente localização, próximo ao metrô.',
        address: {
          street: 'Rua das Palmeiras',
          number: '150',
          complement: '',
          neighborhood: 'Vila Madalena',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '05422-000',
          country: 'Brasil'
        },
        frontage: 12,
        topography: 'flat',
        soilType: 'mixed',
        zoning: 'residential',
        waterAccess: true,
        electricityAccess: true,
        sewerAccess: true,
        gasAccess: true,
        internetAccess: true,
        accessType: 'paved',
        realEstateId: adaoRealEstateId
      },
      {
        name: 'Terreno Comercial - Campinas',
        type: 'terreno',
        area: 500,
        value: 750000,
        description: 'Terreno comercial em avenida movimentada, ideal para negócios.',
        address: {
          street: 'Avenida Brasil',
          number: '2500',
          complement: '',
          neighborhood: 'Centro',
          city: 'Campinas',
          state: 'SP',
          zipCode: '13010-000',
          country: 'Brasil'
        },
        frontage: 20,
        topography: 'flat',
        soilType: 'mixed',
        zoning: 'commercial',
        waterAccess: true,
        electricityAccess: true,
        sewerAccess: true,
        gasAccess: true,
        internetAccess: true,
        accessType: 'paved',
        realEstateId: adaoRealEstateId
      }
    ];
    
    // Empreendimentos
    const empreendimentos = [
      {
        name: 'Residencial Vila Bela',
        type: 'empreendimento',
        area: 5000,
        value: 0, // Empreendimentos podem ter valor 0 pois o preço é por unidade
        description: 'Empreendimento residencial com infraestrutura completa e área de lazer.',
        address: {
          street: 'Rua das Flores',
          number: '100',
          complement: '',
          neighborhood: 'Vila Bela',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04567-000',
          country: 'Brasil'
        },
        totalUnits: 50,
        availableUnits: 50,
        soldUnits: 0,
        reservedUnits: 0,
        constructionProgress: 25,
        developer: {
          name: 'Construtora ABC',
          phone: '(11) 1234-5678',
          email: 'contato@construtorabc.com.br'
        },
        timeline: {
          launchDate: '2024-01-01T00:00:00.000Z',
          constructionStart: '2024-03-01T00:00:00.000Z',
          expectedCompletion: '2025-12-31T00:00:00.000Z'
        },
        realEstateId: adaoRealEstateId
      },
      {
        name: 'Comercial Business Center',
        type: 'empreendimento',
        area: 3000,
        value: 0, // Empreendimentos podem ter valor 0 pois o preço é por unidade
        description: 'Centro empresarial moderno com salas comerciais de alto padrão.',
        address: {
          street: 'Avenida Paulista',
          number: '1500',
          complement: '',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-000',
          country: 'Brasil'
        },
        totalUnits: 30,
        availableUnits: 30,
        soldUnits: 0,
        reservedUnits: 0,
        constructionProgress: 15,
        developer: {
          name: 'Construtora XYZ',
          phone: '(11) 9876-5432',
          email: 'contato@construtoraXYZ.com.br'
        },
        timeline: {
          launchDate: '2024-06-01T00:00:00.000Z',
          constructionStart: '2024-08-01T00:00:00.000Z',
          expectedCompletion: '2026-06-30T00:00:00.000Z'
        },
        realEstateId: adaoRealEstateId
      }
    ];
    
    let createdCount = 0;
    
    // Criar terrenos
    console.log('🏞️ Criando terrenos...');
    for (const terreno of terrenos) {
      try {
        const result = await makeRequest('http://localhost:3001/api/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(terreno)
        });
        
        if (result.success) {
          console.log(`   ✅ ${terreno.name} criado`);
          createdCount++;
        } else {
          console.log(`   ❌ Erro ao criar ${terreno.name}: ${result.message}`);
          console.log(`   📋 Detalhes:`, result.errors || result.error);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao criar ${terreno.name}: ${error.message}`);
      }
    }
    
    // Criar empreendimentos
    console.log('🏢 Criando empreendimentos...');
    for (const empreendimento of empreendimentos) {
      try {
        const result = await makeRequest('http://localhost:3001/api/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(empreendimento)
        });
        
        if (result.success) {
          console.log(`   ✅ ${empreendimento.name} criado`);
          createdCount++;
        } else {
          console.log(`   ❌ Erro ao criar ${empreendimento.name}: ${result.message}`);
          console.log(`   📋 Detalhes:`, result.errors || result.error);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao criar ${empreendimento.name}: ${error.message}`);
      }
    }
    
    console.log(`\n✅ ${createdCount} produtos criados com sucesso!`);
    
    // Verificar resultado final
    console.log('🔍 Verificando produtos da Adão Imóveis...');
    const finalProducts = await makeRequest(`http://localhost:3001/api/products?real_estate_id=${adaoRealEstateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (finalProducts.success && finalProducts.data) {
      console.log(`📦 Total de produtos na Adão Imóveis: ${finalProducts.data.length}`);
      
      const typeCount = {};
      finalProducts.data.forEach(product => {
        const type = product.type || product.tipo || 'indefinido';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      console.log('📊 Produtos por tipo:');
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
      
      console.log('\n📋 Lista de produtos:');
      finalProducts.data.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name || product.title || product.titulo} (${product.type || product.tipo})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createMissingProducts();