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

async function fixProductsViaAPI() {
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
    
    const wrongRealEstateId = '68c41b4f075a35d86417d7f2';
    const correctRealEstateId = '68c4467199df1835267f3e48'; // Adão Imóveis
    
    console.log('🔍 Buscando produtos da imobiliária incorreta...');
    
    // Buscar produtos da imobiliária incorreta
    const wrongProducts = await makeRequest(`http://localhost:3001/api/products?real_estate_id=${wrongRealEstateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!wrongProducts.success || !wrongProducts.data || wrongProducts.data.length === 0) {
      console.log('ℹ️ Nenhum produto encontrado para transferir');
      return;
    }
    
    console.log(`📦 Encontrados ${wrongProducts.data.length} produtos para transferir:`);
    
    // Listar produtos
    wrongProducts.data.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name || product.title} (${product.type})`);
    });
    
    console.log('🔄 Transferindo produtos...');
    
    // Transferir cada produto individualmente
    let transferredCount = 0;
    for (const product of wrongProducts.data) {
      try {
        const updateData = {
          ...product,
          realEstateId: correctRealEstateId
        };
        
        const updateResult = await makeRequest(`http://localhost:3001/api/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        if (updateResult.success) {
          console.log(`   ✅ ${product.name || product.title} transferido`);
          transferredCount++;
        } else {
          console.log(`   ❌ Erro ao transferir ${product.name || product.title}: ${updateResult.message}`);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao transferir ${product.name || product.title}: ${error.message}`);
      }
    }
    
    console.log(`\n✅ ${transferredCount} produtos transferidos com sucesso!`);
    
    // Verificar resultado final
    console.log('🔍 Verificando produtos da Adão Imóveis após transferência...');
    const finalProducts = await makeRequest(`http://localhost:3001/api/products?real_estate_id=${correctRealEstateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (finalProducts.success && finalProducts.data) {
      console.log(`📦 Total de produtos na Adão Imóveis: ${finalProducts.data.length}`);
      
      const typeCount = {};
      finalProducts.data.forEach(product => {
        const type = product.type || 'indefinido';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      console.log('📊 Produtos por tipo:');
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

fixProductsViaAPI();