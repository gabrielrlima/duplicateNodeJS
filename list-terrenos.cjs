const axios = require('axios');

// Configurações
const API_BASE_URL = 'http://localhost:3001/api';
const LOGIN_EMAIL = 'gabriel@teste.com';
const LOGIN_PASSWORD = '123456';

let authToken = null;

// Função para fazer login
async function login() {
  try {
    console.log('🔐 Fazendo login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    
    if (response.data.success && response.data.data.token) {
      authToken = response.data.data.token;
      console.log('✅ Login realizado com sucesso!');
      return true;
    } else {
      console.error('❌ Erro no login:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao fazer login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Função para listar todos os terrenos
async function listTerrenos() {
  try {
    console.log('🏗️  Buscando terrenos...');
    const response = await axios.get(`${API_BASE_URL}/terrenos`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success && response.data.data) {
      const terrenos = response.data.data;
      console.log(`📋 Encontrados ${terrenos.length} terrenos\n`);
      
      if (terrenos.length === 0) {
        console.log('❌ Nenhum terreno encontrado.');
        return;
      }
      
      // Listar todos os terrenos
      console.log('🏗️  Lista de Terrenos:');
      console.log('=' .repeat(80));
      
      terrenos.forEach((terreno, index) => {
        console.log(`\n${index + 1}. ${terreno.name}`);
        console.log(`   ID: ${terreno.id}`);
        console.log(`   Tipo: ${terreno.type}`);
        console.log(`   Status: ${terreno.status}`);
        console.log(`   Área Total: ${terreno.totalArea}m²`);
        console.log(`   Valor: R$ ${terreno.value.toLocaleString('pt-BR')}`);
        console.log(`   Endereço: ${terreno.address.street}, ${terreno.address.number} - ${terreno.address.neighborhood}`);
        console.log(`   Cidade: ${terreno.address.city}/${terreno.address.state}`);
        console.log(`   CEP: ${terreno.address.zipCode}`);
        
        if (terreno.description) {
          console.log(`   Descrição: ${terreno.description}`);
        }
        
        if (terreno.usableArea) {
          console.log(`   Área Útil: ${terreno.usableArea}m²`);
        }
        
        if (terreno.frontage) {
          console.log(`   Testada: ${terreno.frontage}m`);
        }
        
        if (terreno.depth) {
          console.log(`   Profundidade: ${terreno.depth}m`);
        }
        
        if (terreno.zoning) {
          console.log(`   Zoneamento: ${terreno.zoning}`);
        }
        
        if (terreno.topography) {
          console.log(`   Topografia: ${terreno.topography}`);
        }
        
        if (terreno.soilType) {
          console.log(`   Tipo de Solo: ${terreno.soilType}`);
        }
        
        if (terreno.vegetation) {
          console.log(`   Vegetação: ${terreno.vegetation}`);
        }
        
        // Infraestrutura
        const infrastructure = [];
        if (terreno.waterAccess) infrastructure.push('Água');
        if (terreno.electricityAccess) infrastructure.push('Energia');
        if (terreno.sewerAccess) infrastructure.push('Esgoto');
        if (terreno.gasAccess) infrastructure.push('Gás');
        if (terreno.internetAccess) infrastructure.push('Internet');
        
        if (infrastructure.length > 0) {
          console.log(`   Infraestrutura: ${infrastructure.join(', ')}`);
        }
        
        console.log(`   Criado em: ${new Date(terreno.createdAt).toLocaleDateString('pt-BR')}`);
        console.log(`   Atualizado em: ${new Date(terreno.updatedAt).toLocaleDateString('pt-BR')}`);
      });
      
      console.log('\n' + '='.repeat(80));
      console.log(`\n📊 Resumo:`);
      console.log(`📋 Total de terrenos: ${terrenos.length}`);
      
      // Estatísticas por tipo
      const tipoStats = {};
      terrenos.forEach(terreno => {
        tipoStats[terreno.type] = (tipoStats[terreno.type] || 0) + 1;
      });
      
      console.log('\n🏗️  Por tipo:');
      Object.entries(tipoStats).forEach(([tipo, count]) => {
        console.log(`   ${tipo}: ${count} terreno(s)`);
      });
      
      // Estatísticas por status
      const statusStats = {};
      terrenos.forEach(terreno => {
        statusStats[terreno.status] = (statusStats[terreno.status] || 0) + 1;
      });
      
      console.log('\n📈 Por status:');
      Object.entries(statusStats).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} terreno(s)`);
      });
      
      // Valor total
      const valorTotal = terrenos.reduce((total, terreno) => total + terreno.value, 0);
      console.log(`\n💰 Valor total do portfólio: R$ ${valorTotal.toLocaleString('pt-BR')}`);
      
      // Área total
      const areaTotal = terrenos.reduce((total, terreno) => total + terreno.totalArea, 0);
      console.log(`📐 Área total: ${areaTotal.toLocaleString('pt-BR')}m²`);
      
    } else {
      console.error('❌ Erro ao buscar terrenos:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Erro ao listar terrenos:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Função principal
async function main() {
  console.log('🏗️  Listando Terrenos...');
  console.log('=' .repeat(50));
  
  // Fazer login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.error('❌ Não foi possível fazer login. Encerrando...');
    process.exit(1);
  }
  
  // Listar terrenos
  await listTerrenos();
}

// Executar o script
main().catch(error => {
  console.error('❌ Erro geral:', error.message);
  process.exit(1);
});