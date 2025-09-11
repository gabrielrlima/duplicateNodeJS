const { MongoClient, ObjectId } = require('mongodb');

async function createSampleData() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('duplicate_spa');
    
    // Criar uma imobiliária de exemplo
    const realEstate = {
      _id: new ObjectId(),
      name: 'Imobiliária Exemplo',
      email: 'contato@exemplo.com',
      phone: '+55 11 99999-9999',
      address: 'Rua Exemplo, 123',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('realestates').insertOne(realEstate);
    console.log('Imobiliária criada:', realEstate._id);
    
    // Criar algumas propriedades de exemplo
    const properties = [
      {
        _id: new ObjectId(),
        name: 'Casa Residencial 1',
        type: 'casa',
        price: 500000,
        area: 150,
        bedrooms: 3,
        bathrooms: 2,
        address: 'Rua das Flores, 100',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        description: 'Casa ampla com jardim',
        realEstateId: realEstate._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Apartamento Centro',
        type: 'apartamento',
        price: 350000,
        area: 80,
        bedrooms: 2,
        bathrooms: 1,
        address: 'Av. Central, 500',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-890',
        description: 'Apartamento no centro da cidade',
        realEstateId: realEstate._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Terreno Comercial',
        type: 'terreno',
        price: 800000,
        area: 500,
        address: 'Rua Comercial, 200',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-111',
        description: 'Terreno para construção comercial',
        realEstateId: realEstate._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('properties').insertMany(properties);
    console.log('Propriedades criadas:', properties.length);
    
    // Verificar os dados inseridos
    const totalProperties = await db.collection('properties').countDocuments({ realEstateId: realEstate._id });
    const totalRealEstates = await db.collection('realestates').countDocuments();
    
    console.log('\nResumo:');
    console.log('Total de imobiliárias:', totalRealEstates);
    console.log('Total de propriedades:', totalProperties);
    console.log('ID da imobiliária:', realEstate._id.toString());
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
  }
}

createSampleData();