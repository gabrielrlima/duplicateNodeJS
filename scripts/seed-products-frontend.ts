/**
 * Script para criar produtos de teste usando requisições HTTP diretas
 * Este script simula as chamadas que o frontend faria
 */

// Configurações
const API_BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:8080';

// Função para obter o token do sessionStorage (precisa ser executado no navegador)
function getTokenInstructions() {
  console.log('🔑 Para obter o token de autenticação:');
  console.log('1. Abra o navegador em:', FRONTEND_URL);
  console.log('2. Faça login no sistema');
  console.log('3. Abra as ferramentas de desenvolvedor (F12)');
  console.log('4. Vá para Console e execute:');
  console.log('   sessionStorage.getItem("sanctum_access_token")');
  console.log('5. Copie o token e adicione no .env:');
  console.log('   API_TOKEN=seu_token_aqui');
  console.log('');
}

// Função para fazer requisições autenticadas
async function makeAuthenticatedRequest(endpoint: string, data: any, token: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

// Dados de exemplo para diferentes tipos de produtos
const imovelExamples = [
  {
    name: 'Casa Moderna 3 Quartos - Jardim Europa',
    title: 'Casa Moderna 3 Quartos - Jardim Europa',
    description: 'Linda casa moderna com 3 quartos, 2 banheiros, garagem para 2 carros. Localizada em bairro nobre com excelente infraestrutura.',
    type: 'house',
    area: 180,
    builtArea: 180,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    value: 850000,
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Europa',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    }
  },
  {
    name: 'Apartamento Cobertura - Ipanema',
    title: 'Apartamento Cobertura - Ipanema',
    description: 'Cobertura duplex com vista para o mar, 4 suítes, piscina privativa, churrasqueira e 3 vagas de garagem.',
    type: 'penthouse',
    area: 320,
    builtArea: 320,
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 3,
    value: 2500000,
    address: {
      street: 'Rua Visconde de Pirajá',
      number: '456',
      neighborhood: 'Ipanema',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22410-000'
    }
  },
  {
    name: 'Casa Térrea - Alphaville',
    title: 'Casa Térrea - Alphaville',
    description: 'Casa térrea em condomínio fechado, 4 quartos sendo 2 suítes, piscina, área gourmet completa.',
    type: 'house',
    area: 280,
    builtArea: 280,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 4,
    value: 1200000,
    address: {
      street: 'Alameda dos Anjos',
      number: '789',
      neighborhood: 'Alphaville',
      city: 'Barueri',
      state: 'SP',
      zipCode: '06454-000'
    }
  },
  {
    name: 'Apartamento Studio - Vila Madalena',
    title: 'Apartamento Studio - Vila Madalena',
    description: 'Studio moderno e funcional, totalmente mobiliado, em prédio novo com academia e rooftop.',
    type: 'studio',
    area: 45,
    builtArea: 45,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    value: 450000,
    address: {
      street: 'Rua Harmonia',
      number: '321',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05435-000'
    }
  },
  {
    name: 'Sobrado Geminado - Mooca',
    title: 'Sobrado Geminado - Mooca',
    description: 'Sobrado geminado com 3 dormitórios, quintal, área de serviço e garagem coberta.',
    type: 'house',
    area: 150,
    builtArea: 150,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    value: 680000,
    address: {
      street: 'Rua da Mooca',
      number: '654',
      neighborhood: 'Mooca',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '03103-000'
    }
  },
  {
    name: 'Loft Industrial - Bela Vista',
    title: 'Loft Industrial - Bela Vista',
    description: 'Loft com conceito industrial, pé direito alto, mezanino, ideal para profissionais criativos.',
    type: 'loft',
    area: 85,
    builtArea: 85,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    value: 520000,
    address: {
      street: 'Rua Augusta',
      number: '987',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000'
    }
  },
  {
    name: 'Casa de Condomínio - Granja Viana',
    title: 'Casa de Condomínio - Granja Viana',
    description: 'Casa em condomínio fechado com segurança 24h, 3 suítes, piscina, área gourmet e campo de futebol.',
    type: 'house',
    area: 220,
    builtArea: 220,
    bedrooms: 3,
    bathrooms: 4,
    parkingSpaces: 2,
    value: 980000,
    address: {
      street: 'Estrada da Granja Viana',
      number: '1234',
      neighborhood: 'Granja Viana',
      city: 'Cotia',
      state: 'SP',
      zipCode: '06709-015'
    }
  },
  {
    name: 'Apartamento Duplex - Brooklin',
    title: 'Apartamento Duplex - Brooklin',
    description: 'Duplex com 2 quartos, sala ampla, varanda gourmet, em prédio com lazer completo.',
    type: 'apartment',
    area: 120,
    builtArea: 120,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 2,
    value: 750000,
    address: {
      street: 'Rua Brooklin',
      number: '555',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04567-000'
    }
  },
  {
    name: 'Casa Comercial - Vila Olímpia',
    title: 'Casa Comercial - Vila Olímpia',
    description: 'Casa adaptada para uso comercial, 5 salas, 3 banheiros, estacionamento para 6 carros.',
    type: 'commercial',
    area: 300,
    builtArea: 300,
    bedrooms: 5,
    bathrooms: 3,
    parkingSpaces: 6,
    value: 1800000,
    address: {
      street: 'Rua Vila Olímpia',
      number: '888',
      neighborhood: 'Vila Olímpia',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04551-000'
    }
  },
  {
    name: 'Kitnet Mobiliada - República',
    title: 'Kitnet Mobiliada - República',
    description: 'Kitnet totalmente mobiliada e equipada, ideal para estudantes ou profissionais solteiros.',
    type: 'studio',
    area: 25,
    builtArea: 25,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    value: 280000,
    address: {
      street: 'Rua da República',
      number: '111',
      neighborhood: 'República',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01045-000'
    }
  }
];

// Função para criar produtos de teste
export async function seedProductsAPI() {
  console.log('🌱 Iniciando criação de produtos de teste via API...');
  console.log('==================================================');
  
  // Verificar se o token está configurado
  const token = process.env.API_TOKEN;
  if (!token) {
    console.log('❌ Token de API não encontrado!');
    getTokenInstructions();
    return;
  }
  
  console.log('✅ Token encontrado, iniciando criação...');
  
  let successCount = 0;
  let errorCount = 0;
  
  // Primeiro, vamos obter o ID da imobiliária atual
  let realEstateId: string;
  try {
    console.log('🏢 Obtendo imobiliárias do usuário...');
    const realEstatesResponse = await fetch(`${API_BASE_URL}/api/real-estate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!realEstatesResponse.ok) {
      throw new Error(`Erro ao obter imobiliárias: ${realEstatesResponse.status}`);
    }
    
    const realEstatesData = await realEstatesResponse.json();
    if (!realEstatesData.success || !realEstatesData.data.realEstates.length) {
      throw new Error('Nenhuma imobiliária encontrada');
    }
    
    realEstateId = realEstatesData.data.realEstates[0].id;
    console.log(`✅ Usando imobiliária: ${realEstatesData.data.realEstates[0].name} (${realEstateId})`);
    
  } catch (error) {
    console.error('❌ Erro ao obter imobiliária:', error.message);
    return;
  }
  
  try {
    // Criar imóveis
    console.log('\n🏠 Criando 10 imóveis...');
    for (let i = 0; i < imovelExamples.length; i++) {
      try {
        const imovel = imovelExamples[i];
        console.log(`   ${i + 1}/10 - ${imovel.name}`);
        
        const propertyData = {
          ...imovel,
          realEstateId
        };
        
        await makeAuthenticatedRequest('/api/property', propertyData, token);
        
        successCount++;
        console.log(`   ✅ Criado com sucesso`);
        
        // Pequena pausa entre criações
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        errorCount++;
        console.log(`   ❌ Erro: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Erro fatal:', error);
  }
  
  console.log('\n==================================================');
  console.log('📊 Resumo da execução:');
  console.log(`   ✅ Produtos criados: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📈 Total processado: ${successCount + errorCount}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Seeding concluído com sucesso!');
    console.log('💡 Acesse o sistema para visualizar os produtos criados.');
  } else {
    console.log('\n⚠️ Nenhum produto foi criado.');
    console.log('💡 Verifique o token de autenticação e tente novamente.');
  }
}

// Executar o seeding
seedProductsAPI();