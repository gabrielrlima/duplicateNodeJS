import axios from 'axios';

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const USER_EMAIL = 'gabriel@teste.com';
const USER_PASSWORD = '123456';

let authToken = '';
let realEstateId = '';

// Função para fazer login e obter token
async function login() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    
    authToken = response.data.data.token;
    console.log('✅ Login realizado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    return false;
  }
}

// Função para obter ID da imobiliária Adão Imóveis
async function getRealEstateId() {
  try {
    const response = await axios.get(`${API_BASE_URL}/real-estate`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('🔍 Resposta das imobiliárias:', JSON.stringify(response.data, null, 2));
    
    // Tentar diferentes estruturas de resposta
    let realEstates = [];
    if (Array.isArray(response.data)) {
      realEstates = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      realEstates = response.data.data;
    } else if (response.data.realEstates && Array.isArray(response.data.realEstates)) {
      realEstates = response.data.realEstates;
    }
    
    console.log('📋 Imobiliárias encontradas:', realEstates.length);
    
    const adaoImoveis = realEstates.find(re => re.name === 'Adão Imóveis');
    if (adaoImoveis) {
      realEstateId = adaoImoveis.id || adaoImoveis._id;
      console.log('✅ Imobiliária Adão Imóveis encontrada:', realEstateId);
      return true;
    } else {
      console.error('❌ Imobiliária Adão Imóveis não encontrada');
      console.log('📋 Imobiliárias disponíveis:');
      realEstates.forEach((re, index) => {
        console.log(`   ${index + 1}. ${re.name} (ID: ${re.id || re._id})`);
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar imobiliárias:', error.response?.data || error.message);
    return false;
  }
}

// Função para criar propriedade
async function createProperty(propertyData) {
  try {
    console.log(`🔄 Criando propriedade: ${propertyData.titulo}`);
    console.log('📋 Dados enviados:', JSON.stringify(propertyData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/products`, {
      ...propertyData,
      realEstateId
    }, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Propriedade criada: ${propertyData.titulo}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao criar propriedade ${propertyData.titulo}:`);
    console.error('   Status:', error.response?.status);
    console.error('   Dados:', JSON.stringify(error.response?.data, null, 2));
    return null;
  }
}

// Dados dos terrenos
const terrenos = [
  {
    tipo: 'terreno',
    titulo: 'Terreno Residencial - Vila Madalena',
    descricao: 'Excelente terreno residencial em localização privilegiada na Vila Madalena. Ideal para construção de residência unifamiliar ou pequeno empreendimento. Próximo a comércios, escolas e transporte público.',
    preco: 450000,
    area: 300,
    frente: 12,
    tipoSolo: 'plano',
    zoneamento: 'residencial',
    rua: 'Rua Harmonia',
    numero: '456',
    complemento: '',
    bairro: 'Vila Madalena',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '05435-000'
  },
  {
    tipo: 'terreno',
    titulo: 'Terreno Comercial - Centro de Campinas',
    descricao: 'Terreno comercial estrategicamente localizado no centro de Campinas. Excelente para construção de edifício comercial, loja ou escritórios. Alta circulação de pessoas e fácil acesso.',
    preco: 750000,
    area: 500,
    frente: 20,
    tipoSolo: 'plano',
    zoneamento: 'comercial',
    rua: 'Avenida Francisco Glicério',
    numero: '1234',
    complemento: '',
    bairro: 'Centro',
    cidade: 'Campinas',
    estado: 'SP',
    cep: '13012-100'
  }
];

// Dados dos empreendimentos
const empreendimentos = [
  {
    tipo: 'empreendimento',
    titulo: 'Residencial Vila Bela',
    descricao: 'Moderno empreendimento residencial com apartamentos de 2 e 3 dormitórios. Localizado em bairro nobre com toda infraestrutura. Área de lazer completa com piscina, academia e salão de festas.',
    construtora: 'Construtora ABC',
    previsaoEntrega: '2025-12-31',
    unidadesDisponiveis: 50,
    plantas: [
      {
        area: 65,
        precoPorM2: 8500,
        descricao: 'Planta A - 2 dormitórios, sala, cozinha, banheiro e área de serviço'
      },
      {
        area: 85,
        precoPorM2: 8200,
        descricao: 'Planta B - 3 dormitórios, sala, cozinha, 2 banheiros e área de serviço'
      }
    ],
    rua: 'Rua das Flores',
    numero: '789',
    complemento: '',
    bairro: 'Jardim Europa',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01449-000'
  },
  {
    tipo: 'empreendimento',
    titulo: 'Comercial Business Center',
    descricao: 'Moderno centro empresarial com salas comerciais de diversos tamanhos. Localização estratégica com fácil acesso a principais vias. Infraestrutura completa para empresas de todos os portes.',
    construtora: 'Construtora XYZ',
    previsaoEntrega: '2026-06-30',
    unidadesDisponiveis: 30,
    plantas: [
      {
        area: 40,
        precoPorM2: 12000,
        descricao: 'Sala Pequena - Ideal para escritórios e consultórios'
      },
      {
        area: 60,
        precoPorM2: 11500,
        descricao: 'Sala Grande - Perfeita para empresas de médio porte'
      }
    ],
    rua: 'Avenida Paulista',
    numero: '2000',
    complemento: '',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100'
  }
];

// Função principal
async function main() {
  console.log('🚀 Iniciando criação de propriedades de exemplo...');
  
  // Fazer login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.error('❌ Falha no login. Encerrando script.');
    return;
  }
  
  // Obter ID da imobiliária
  const realEstateSuccess = await getRealEstateId();
  if (!realEstateSuccess) {
    console.error('❌ Falha ao obter imobiliária. Encerrando script.');
    return;
  }
  
  console.log('\n📍 Criando terrenos...');
  
  // Criar terrenos
  for (const terreno of terrenos) {
    await createProperty(terreno);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo entre criações
  }
  
  console.log('\n🏢 Criando empreendimentos...');
  
  // Criar empreendimentos
  for (const empreendimento of empreendimentos) {
    await createProperty(empreendimento);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo entre criações
  }
  
  console.log('\n✅ Script concluído! Todas as propriedades foram criadas com sucesso.');
}

// Executar script
main().catch(error => {
  console.error('❌ Erro geral:', error);
});