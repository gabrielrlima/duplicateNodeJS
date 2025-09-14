const { MongoClient, ObjectId } = require('mongodb');

async function createPropertiesDirect() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('duplicate_backend');
    
    console.log('🚀 Criando propriedades diretamente no banco...');
    
    // Buscar usuário gabriel@teste.com
    const user = await db.collection('users').findOne({ email: 'gabriel@teste.com' });
    if (!user) {
      console.error('❌ Usuário gabriel@teste.com não encontrado');
      return;
    }
    
    // Buscar imobiliária Adão Imóveis
    const realEstate = await db.collection('realestates').findOne({ name: 'Adão Imóveis' });
    if (!realEstate) {
      console.error('❌ Imobiliária Adão Imóveis não encontrada');
      return;
    }
    
    console.log('✅ Usuário e imobiliária encontrados');
    
    // Dados dos terrenos
    const terrenos = [
      {
        _id: new ObjectId(),
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
        cep: '05435-000',
        ownerId: user._id,
        realEstateId: realEstate._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
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
        cep: '13012-100',
        ownerId: user._id,
        realEstateId: realEstate._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Dados dos empreendimentos
    const empreendimentos = [
      {
        _id: new ObjectId(),
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
        cep: '01449-000',
        ownerId: user._id,
        realEstateId: realEstate._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
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
        cep: '01310-100',
        ownerId: user._id,
        realEstateId: realEstate._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Inserir terrenos
    console.log('\n📍 Criando terrenos...');
    for (const terreno of terrenos) {
      await db.collection('products').insertOne(terreno);
      console.log(`✅ Terreno criado: ${terreno.titulo}`);
    }
    
    // Inserir empreendimentos
    console.log('\n🏢 Criando empreendimentos...');
    for (const empreendimento of empreendimentos) {
      await db.collection('products').insertOne(empreendimento);
      console.log(`✅ Empreendimento criado: ${empreendimento.titulo}`);
    }
    
    console.log('\n🎉 Todas as propriedades foram criadas com sucesso!');
    console.log('📊 Resumo:');
    console.log('   - 2 terrenos');
    console.log('   - 2 empreendimentos');
    console.log('   - Todos vinculados à imobiliária Adão Imóveis');
    console.log('   - Proprietário: gabriel@teste.com');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

createPropertiesDirect();