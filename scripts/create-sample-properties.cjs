const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';
const REAL_ESTATE_ID = '68b184600238f6393d251d3c'; // ID da imobiliária do usuário gabriel@teste.com

// Função para fazer login e obter token
async function login() {
  try {
    console.log('🔐 Fazendo login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'gabriel@teste.com',
      password: '123456' // Senha padrão - ajustar conforme necessário
    });
    
    if (response.data.success && response.data.data.token) {
      console.log('✅ Login realizado com sucesso!');
      return response.data.data.token;
    } else {
      throw new Error('Token não encontrado na resposta');
    }
  } catch (error) {
    console.error('❌ Erro ao fazer login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    throw error;
  }
}

// Configurar axios com token
function setAuthToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Dados de exemplo para 10 imóveis
const sampleProperties = [
  {
    titulo: 'Apartamento Moderno no Jardins',
    descricao: 'Lindo apartamento de 3 quartos com vista panorâmica da cidade. Localizado em uma das regiões mais nobres de São Paulo, com acabamentos de primeira qualidade.',
    area: 120,
    preco: 850000,
    precoM2: 7083.33,
    tipo: 'Apartamento',
    condicao: 'novo',
    status: 'Disponível',
    negociavel: true,
    observacoes: 'Aceita financiamento bancário. Documentação em ordem.',
    localizacao: {
      endereco: 'Rua Augusta',
      numero: '1234',
      complemento: 'Apto 152',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01305-100'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      suites: 1,
      vagasGaragem: 2,
      andar: '15º',
      elevador: true,
      mobiliado: false
    },
    comodidades: {
      varanda: true,
      churrasqueira: false,
      piscina: false,
      arCondicionado: true,
      cozinhaAmericana: true,
      jardim: false,
      playground: true,
      piscinaCondominio: true,
      churrasqueiraCondominio: true,
      academia: true,
      salaoFestas: true,
      lavanderia: true,
      espacoGourmet: true,
      recepcao24h: true,
      quadraEsportes: true,
      sauna: true,
      brinquedoteca: true,
      areaVerde: true
    },
    valores: {
      valorCondominio: 800,
      valorIPTU: 450,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  },
  {
    titulo: 'Casa Térrea em Condomínio Fechado',
    descricao: 'Casa térrea com 4 quartos em condomínio fechado com segurança 24h. Amplo quintal e área gourmet completa.',
    area: 180,
    preco: 650000,
    precoM2: 3611.11,
    tipo: 'Casa',
    condicao: 'usado',
    status: 'Disponível',
    negociavel: true,
    observacoes: 'Casa em excelente estado de conservação.',
    localizacao: {
      endereco: 'Rua das Palmeiras',
      numero: '567',
      complemento: '',
      bairro: 'Vila Madalena',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '05435-020'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 4,
      banheiros: 3,
      suites: 2,
      vagasGaragem: 3,
      andar: 'Térreo',
      elevador: false,
      mobiliado: false
    },
    comodidades: {
      varanda: true,
      churrasqueira: true,
      piscina: true,
      arCondicionado: false,
      cozinhaAmericana: false,
      jardim: true,
      playground: true,
      piscinaCondominio: true,
      churrasqueiraCondominio: true,
      academia: false,
      salaoFestas: true,
      lavanderia: false,
      espacoGourmet: true,
      recepcao24h: true,
      quadraEsportes: true,
      sauna: false,
      brinquedoteca: true,
      areaVerde: true
    },
    valores: {
      valorCondominio: 350,
      valorIPTU: 280,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  },
  {
    titulo: 'Sobrado Duplex na Mooca',
    descricao: 'Sobrado duplex com 3 quartos, sendo 1 suíte. Localizado em rua tranquila, próximo ao metrô.',
    area: 95,
    preco: 420000,
    precoM2: 4421.05,
    tipo: 'Sobrado',
    condicao: 'reformado',
    status: 'Disponível',
    negociavel: false,
    observacoes: 'Recém reformado com materiais de qualidade.',
    localizacao: {
      endereco: 'Rua do Oratório',
      numero: '890',
      complemento: '',
      bairro: 'Mooca',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '03116-000'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      suites: 1,
      vagasGaragem: 1,
      andar: 'Duplex',
      elevador: false,
      mobiliado: false
    },
    comodidades: {
      varanda: true,
      churrasqueira: false,
      piscina: false,
      arCondicionado: false,
      cozinhaAmericana: true,
      jardim: false,
      playground: false,
      piscinaCondominio: false,
      churrasqueiraCondominio: false,
      academia: false,
      salaoFestas: false,
      lavanderia: true,
      espacoGourmet: false,
      recepcao24h: false,
      quadraEsportes: false,
      sauna: false,
      brinquedoteca: false,
      areaVerde: false
    },
    valores: {
      valorCondominio: 0,
      valorIPTU: 180,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  },
  {
    titulo: 'Apartamento Compacto na Liberdade',
    descricao: 'Apartamento de 1 quarto ideal para solteiros ou casais. Localização privilegiada no centro da cidade.',
    area: 45,
    preco: 280000,
    precoM2: 6222.22,
    tipo: 'Apartamento',
    condicao: 'usado',
    status: 'Disponível',
    negociavel: true,
    observacoes: 'Ótima oportunidade de investimento.',
    localizacao: {
      endereco: 'Rua da Glória',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Liberdade',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01510-000'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 1,
      banheiros: 1,
      suites: 0,
      vagasGaragem: 0,
      andar: '8º',
      elevador: true,
      mobiliado: true
    },
    comodidades: {
      varanda: false,
      churrasqueira: false,
      piscina: false,
      arCondicionado: true,
      cozinhaAmericana: true,
      jardim: false,
      playground: false,
      piscinaCondominio: false,
      churrasqueiraCondominio: false,
      academia: false,
      salaoFestas: false,
      lavanderia: true,
      espacoGourmet: false,
      recepcao24h: true,
      quadraEsportes: false,
      sauna: false,
      brinquedoteca: false,
      areaVerde: false
    },
    valores: {
      valorCondominio: 320,
      valorIPTU: 120,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  },
  {
    titulo: 'Casa de Alto Padrão em Alphaville',
    descricao: 'Casa luxuosa com 5 quartos, piscina e área gourmet completa. Condomínio de alto padrão com infraestrutura completa.',
    area: 350,
    preco: 1200000,
    precoM2: 3428.57,
    tipo: 'Casa',
    condicao: 'novo',
    status: 'Disponível',
    negociavel: false,
    observacoes: 'Casa de luxo com acabamentos importados.',
    localizacao: {
      endereco: 'Alameda dos Anjos',
      numero: '456',
      complemento: '',
      bairro: 'Alphaville',
      cidade: 'Barueri',
      estado: 'SP',
      cep: '06454-000'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 5,
      banheiros: 4,
      suites: 3,
      vagasGaragem: 4,
      andar: 'Térreo',
      elevador: false,
      mobiliado: false
    },
    comodidades: {
      varanda: true,
      churrasqueira: true,
      piscina: true,
      arCondicionado: true,
      cozinhaAmericana: false,
      jardim: true,
      playground: true,
      piscinaCondominio: true,
      churrasqueiraCondominio: true,
      academia: true,
      salaoFestas: true,
      lavanderia: true,
      espacoGourmet: true,
      recepcao24h: true,
      quadraEsportes: true,
      sauna: true,
      brinquedoteca: true,
      areaVerde: true
    },
    valores: {
      valorCondominio: 650,
      valorIPTU: 800,
      aceitaFinanciamento: true,
      aceitaFGTS: false
    }
  },
  {
    titulo: 'Apartamento Studio na Vila Olímpia',
    descricao: 'Studio moderno e funcional em prédio novo. Ideal para profissionais que trabalham na região.',
    area: 35,
    preco: 320000,
    precoM2: 9142.86,
    tipo: 'Apartamento',
    condicao: 'novo',
    status: 'Disponível',
    negociavel: true,
    observacoes: 'Prédio entregue em 2023.',
    localizacao: {
      endereco: 'Rua Funchal',
      numero: '789',
      complemento: 'Apto 201',
      bairro: 'Vila Olímpia',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04551-060'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 0,
      banheiros: 1,
      suites: 0,
      vagasGaragem: 1,
      andar: '2º',
      elevador: true,
      mobiliado: true
    },
    comodidades: {
      varanda: true,
      churrasqueira: false,
      piscina: false,
      arCondicionado: true,
      cozinhaAmericana: true,
      jardim: false,
      playground: false,
      piscinaCondominio: true,
      churrasqueiraCondominio: true,
      academia: true,
      salaoFestas: true,
      lavanderia: true,
      espacoGourmet: true,
      recepcao24h: true,
      quadraEsportes: false,
      sauna: true,
      brinquedoteca: false,
      areaVerde: true
    },
    valores: {
      valorCondominio: 450,
      valorIPTU: 180,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  },
  {
    titulo: 'Casa Geminada no Ipiranga',
    descricao: 'Casa geminada com 2 quartos em bairro tradicional. Ótima localização próxima ao transporte público.',
    area: 80,
    preco: 350000,
    precoM2: 4375.00,
    tipo: 'Casa',
    condicao: 'usado',
    status: 'Disponível',
    negociavel: true,
    observacoes: 'Casa bem conservada, pronta para morar.',
    localizacao: {
      endereco: 'Rua Bom Pastor',
      numero: '321',
      complemento: '',
      bairro: 'Ipiranga',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04203-000'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 2,
      banheiros: 1,
      suites: 0,
      vagasGaragem: 1,
      andar: 'Térreo',
      elevador: false,
      mobiliado: false
    },
    comodidades: {
      varanda: false,
      churrasqueira: false,
      piscina: false,
      arCondicionado: false,
      cozinhaAmericana: false,
      jardim: true,
      playground: false,
      piscinaCondominio: false,
      churrasqueiraCondominio: false,
      academia: false,
      salaoFestas: false,
      lavanderia: false,
      espacoGourmet: false,
      recepcao24h: false,
      quadraEsportes: false,
      sauna: false,
      brinquedoteca: false,
      areaVerde: false
    },
    valores: {
      valorCondominio: 0,
      valorIPTU: 150,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  },
  {
    titulo: 'Cobertura Duplex em Moema',
    descricao: 'Cobertura duplex com terraço privativo e vista deslumbrante. Localizada em uma das regiões mais valorizadas de SP.',
    area: 200,
    preco: 1100000,
    precoM2: 5500.00,
    tipo: 'Apartamento',
    condicao: 'usado',
    status: 'Disponível',
    negociavel: false,
    observacoes: 'Cobertura única no prédio.',
    localizacao: {
      endereco: 'Avenida Ibirapuera',
      numero: '2468',
      complemento: 'Cobertura',
      bairro: 'Moema',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04029-200'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 4,
      banheiros: 3,
      suites: 2,
      vagasGaragem: 3,
      andar: 'Cobertura',
      elevador: true,
      mobiliado: false
    },
    comodidades: {
      varanda: true,
      churrasqueira: true,
      piscina: true,
      arCondicionado: true,
      cozinhaAmericana: false,
      jardim: true,
      playground: true,
      piscinaCondominio: true,
      churrasqueiraCondominio: true,
      academia: true,
      salaoFestas: true,
      lavanderia: true,
      espacoGourmet: true,
      recepcao24h: true,
      quadraEsportes: true,
      sauna: true,
      brinquedoteca: true,
      areaVerde: true
    },
    valores: {
      valorCondominio: 950,
      valorIPTU: 650,
      aceitaFinanciamento: true,
      aceitaFGTS: false
    }
  },
  {
    titulo: 'Apartamento Familiar no Tatuapé',
    descricao: 'Apartamento de 3 quartos em bairro familiar. Próximo a escolas, comércio e transporte público.',
    area: 85,
    preco: 480000,
    precoM2: 5647.06,
    tipo: 'Apartamento',
    condicao: 'usado',
    status: 'Disponível',
    negociavel: true,
    observacoes: 'Apartamento em ótimo estado, ideal para famílias.',
    localizacao: {
      endereco: 'Rua Tuiuti',
      numero: '1357',
      complemento: 'Apto 73',
      bairro: 'Tatuapé',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '03081-000'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      suites: 1,
      vagasGaragem: 1,
      andar: '7º',
      elevador: true,
      mobiliado: false
    },
    comodidades: {
      varanda: true,
      churrasqueira: false,
      piscina: false,
      arCondicionado: false,
      cozinhaAmericana: false,
      jardim: false,
      playground: true,
      piscinaCondominio: true,
      churrasqueiraCondominio: true,
      academia: false,
      salaoFestas: true,
      lavanderia: true,
      espacoGourmet: false,
      recepcao24h: true,
      quadraEsportes: true,
      sauna: false,
      brinquedoteca: true,
      areaVerde: true
    },
    valores: {
      valorCondominio: 380,
      valorIPTU: 220,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  },
  {
    titulo: 'Loft Industrial na Bela Vista',
    descricao: 'Loft com conceito industrial em prédio histórico reformado. Ambiente único e diferenciado.',
    area: 65,
    preco: 390000,
    precoM2: 6000.00,
    tipo: 'Apartamento',
    condicao: 'reformado',
    status: 'Disponível',
    negociavel: true,
    observacoes: 'Loft com pé direito alto e acabamentos especiais.',
    localizacao: {
      endereco: 'Rua Major Diogo',
      numero: '159',
      complemento: 'Loft 3',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01324-000'
    },
    proprietario: {
      nome: 'Gabriel Silva',
      email: 'gabriel@teste.com',
      telefone: '+55 11 99999-1234',
      documento: '123.456.789-00'
    },
    caracteristicas: {
      quartos: 1,
      banheiros: 1,
      suites: 0,
      vagasGaragem: 0,
      andar: '3º',
      elevador: false,
      mobiliado: false
    },
    comodidades: {
      varanda: false,
      churrasqueira: false,
      piscina: false,
      arCondicionado: true,
      cozinhaAmericana: true,
      jardim: false,
      playground: false,
      piscinaCondominio: false,
      churrasqueiraCondominio: false,
      academia: false,
      salaoFestas: false,
      lavanderia: false,
      espacoGourmet: false,
      recepcao24h: false,
      quadraEsportes: false,
      sauna: false,
      brinquedoteca: false,
      areaVerde: false
    },
    valores: {
      valorCondominio: 250,
      valorIPTU: 180,
      aceitaFinanciamento: true,
      aceitaFGTS: true
    }
  }
];

// Função para mapear tipos do frontend para backend
function mapPropertyType(tipo) {
  const typeMap = {
    'Apartamento': 'apartment',
    'Casa': 'house',
    'Sobrado': 'house',
    'Studio': 'studio',
    'Loft': 'loft'
  };
  return typeMap[tipo] || 'apartment';
}

// Função para mapear status do frontend para backend
function mapPropertyStatus(status) {
  const statusMap = {
    'Disponível': 'available',
    'Vendido': 'sold',
    'Alugado': 'rented',
    'Reservado': 'reserved',
    'Inativo': 'inactive'
  };
  return statusMap[status] || 'available';
}

// Função para mapear condição do frontend para backend
function mapPropertyCondition(condicao) {
  const conditionMap = {
    'novo': 'new',
    'usado': 'used',
    'reformado': 'used'
  };
  return conditionMap[condicao] || 'used';
}

// Função para criar um imóvel via API
async function createProperty(propertyData) {
  try {
    // Preparar dados no formato JSON esperado pela API
    const payload = {
      realEstateId: REAL_ESTATE_ID,
      name: propertyData.titulo,
      description: propertyData.descricao,
      type: mapPropertyType(propertyData.tipo),
      status: mapPropertyStatus(propertyData.status),
      condition: mapPropertyCondition(propertyData.condicao),
      area: propertyData.area,
      value: propertyData.preco,
      bedrooms: propertyData.caracteristicas?.quartos || 0,
      bathrooms: propertyData.caracteristicas?.banheiros || 1,
      suites: propertyData.caracteristicas?.suites || 0,
      parkingSpaces: propertyData.caracteristicas?.vagasGaragem || 0,
      furnished: propertyData.caracteristicas?.mobiliado || false,
      address: {
        street: propertyData.localizacao?.endereco || '',
        number: propertyData.localizacao?.numero || '',
        complement: propertyData.localizacao?.complemento || '',
        neighborhood: propertyData.localizacao?.bairro || '',
        city: propertyData.localizacao?.cidade || '',
        state: propertyData.localizacao?.estado || '',
        zipCode: propertyData.localizacao?.cep || ''
      },
      amenities: propertyData.comodidades || {},
      owner: {
        name: propertyData.proprietario?.nome || '',
        email: propertyData.proprietario?.email || '',
        phone: propertyData.proprietario?.telefone || '',
        document: propertyData.proprietario?.documento || ''
      },
      financialInfo: {
        condoFee: propertyData.valores?.valorCondominio || 0,
        iptuValue: propertyData.valores?.valorIPTU || 0,
        acceptsFinancing: propertyData.valores?.aceitaFinanciamento || false,
        acceptsFgts: propertyData.valores?.aceitaFGTS || false
      },
      negotiable: propertyData.negociavel || false,
      observations: propertyData.observacoes || ''
    };

    const response = await axios.post(`${API_BASE_URL}/property`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`✅ Imóvel criado: ${propertyData.titulo}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao criar imóvel ${propertyData.titulo}:`);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Erro de rede:', error.message);
    } else {
      console.error('Erro:', error.message);
    }
    throw error;
  }
}

// Função para testar a conexão com a API
async function testApiConnection() {
  try {
    console.log('🔍 Testando conexão com a API...');
    const response = await axios.get(`${API_BASE_URL}/property/list?real_estate_id=${REAL_ESTATE_ID}`);
    console.log('✅ Conexão com a API estabelecida com sucesso!');
    console.log('📊 Imóveis existentes:', response.data.data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com a API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Erro de rede:', error.message);
      console.error('Verifique se o backend está rodando em:', API_BASE_URL);
    } else {
      console.error('Erro:', error.message);
    }
    return false;
  }
}

// Função principal para criar todos os imóveis
async function createAllProperties() {
  console.log('🏠 Iniciando criação de 10 imóveis de exemplo...');
  console.log('👤 Proprietário: gabriel@teste.com');
  console.log('🏢 ID da Imobiliária:', REAL_ESTATE_ID);
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('\n' + '='.repeat(50) + '\n');

  // Fazer login primeiro
  try {
    const token = await login();
    setAuthToken(token);
  } catch (error) {
    console.log('\n❌ Não foi possível fazer login. Abortando execução.');
    return;
  }

  // Testar conexão
  const isConnected = await testApiConnection();
  if (!isConnected) {
    console.log('\n❌ Não foi possível conectar com a API. Abortando execução.');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < sampleProperties.length; i++) {
    const property = sampleProperties[i];
    console.log(`📍 Criando imóvel ${i + 1}/10: ${property.titulo}`);
    
    try {
      await createProperty(property);
      successCount++;
      
      // Aguardar um pouco entre as criações para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      errorCount++;
    }
    
    console.log('');
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DA EXECUÇÃO:');
  console.log(`✅ Imóveis criados com sucesso: ${successCount}`);
  console.log(`❌ Erros encontrados: ${errorCount}`);
  console.log(`📈 Taxa de sucesso: ${((successCount / sampleProperties.length) * 100).toFixed(1)}%`);
  console.log('\n🎉 Processo concluído!');
}

// Executar o script
if (require.main === module) {
  createAllProperties().catch(error => {
    console.error('💥 Erro fatal na execução do script:', error);
    process.exit(1);
  });
}

module.exports = { createAllProperties, sampleProperties };