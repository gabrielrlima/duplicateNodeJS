const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdaoImoveis() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('duplicate_backend');
    
    console.log('🚀 Criando usuário gabriel@teste.com e imobiliária Adão Imóveis...');
    
    // Verificar se o usuário já existe
    let user = await db.collection('users').findOne({ email: 'gabriel@teste.com' });
    
    if (!user) {
      // Criar usuário gabriel@teste.com
      const hashedPassword = await bcrypt.hash('123456', 12);
      
      const userData = {
        _id: new ObjectId(),
        firstName: 'Gabriel',
        lastName: 'Lima',
        email: 'gabriel@teste.com',
        password: hashedPassword,
        phone: '+5511999999999',
        cpf: '111.222.333-44',
        rg: '11.222.333-4',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'M',
        address: {
          street: 'Rua Teste',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil'
        },
        profession: 'Corretor de Imóveis',
        maritalStatus: 'Single',
        nationality: 'Brasileira',
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('users').insertOne(userData);
      user = userData;
      console.log('✅ Usuário gabriel@teste.com criado');
    } else {
      console.log('✅ Usuário gabriel@teste.com já existe');
    }
    
    // Verificar se a imobiliária já existe
    let realEstate = await db.collection('realestates').findOne({ name: 'Adão Imóveis' });
    
    if (!realEstate) {
      // Criar imobiliária Adão Imóveis
      const realEstateData = {
        _id: new ObjectId(),
        name: 'Adão Imóveis',
        cnpj: '98.765.432/0001-10',
        address: {
          street: 'Rua dos Imóveis',
          number: '456',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil'
        },
        phone: '+551133335555',
        email: 'contato@adaoimoveis.com',
        website: 'https://www.adaoimoveis.com',
        businessHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '14:00' }
        },
        socialMedia: {
          facebook: 'https://facebook.com/adaoimoveis',
          instagram: 'https://instagram.com/adaoimoveis'
        },
        ownerId: user._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('realestates').insertOne(realEstateData);
      console.log('✅ Imobiliária Adão Imóveis criada');
      
      // Atualizar usuário com referência à imobiliária
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { realEstateId: realEstateData._id, updatedAt: new Date() } }
      );
      console.log('✅ Usuário atualizado com referência à imobiliária');
    } else {
      console.log('✅ Imobiliária Adão Imóveis já existe');
    }
    
    console.log('🎉 Processo concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

createAdaoImoveis();