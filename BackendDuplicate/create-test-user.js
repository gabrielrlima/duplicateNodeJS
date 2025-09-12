const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/backendduplicate');

// Schema do User (compatível com o backend)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  businessId: String,
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

const UserModel = mongoose.model('User', userSchema);

// Schema da RealEstate
const realEstateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    number: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const RealEstateModel = mongoose.model('RealEstate', realEstateSchema);

// Schema do Terreno
const terrenoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  totalArea: { type: Number, required: true },
  value: { type: Number, required: true },
  address: {
    street: String,
    number: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String
  },
  realEstateId: { type: mongoose.Schema.Types.ObjectId, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TerrenoModel = mongoose.model('Terreno', terrenoSchema);

async function createTestData() {
  try {
    console.log('Criando dados de teste completos...');
    
    // Limpar dados existentes
    await UserModel.deleteMany({});
    await RealEstateModel.deleteMany({});
    await TerrenoModel.deleteMany({});
    console.log('Dados existentes removidos.');
    
    // Criar usuário
    const hashedPassword = await bcrypt.hash('123456', 12);
    const user = await UserModel.create({
      firstName: 'Usuário',
      lastName: 'Teste',
      email: 'teste@example.com',
      password: hashedPassword,
      phone: '+55 11 99999-9999',
      businessId: 'test-business'
    });
    console.log('Usuário criado:', user._id.toString());
    
    // Criar imobiliária
    const realEstate = await RealEstateModel.create({
      name: 'Imobiliária Teste',
      email: 'imobiliaria@teste.com',
      phone: '+55 11 99999-9999',
      address: {
        street: 'Rua Principal',
        number: '100',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000'
      },
      ownerId: user._id
    });
    console.log('Imobiliária criada:', realEstate._id.toString());
    
    // Criar terrenos
    const terrenos = await TerrenoModel.insertMany([
      {
        name: 'Terreno Residencial Centro',
        type: 'residential',
        status: 'available',
        totalArea: 500,
        value: 250000,
        address: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        },
        realEstateId: realEstate._id,
        ownerId: user._id
      },
      {
        name: 'Terreno Comercial Zona Sul',
        type: 'commercial',
        status: 'available',
        totalArea: 800,
        value: 450000,
        address: {
          street: 'Avenida Paulista',
          number: '456',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100'
        },
        realEstateId: realEstate._id,
        ownerId: user._id
      },
      {
        name: 'Terreno Industrial ABC',
        type: 'industrial',
        status: 'available',
        totalArea: 1200,
        value: 680000,
        address: {
          street: 'Rua Industrial',
          number: '789',
          neighborhood: 'Distrito Industrial',
          city: 'Santo André',
          state: 'SP',
          zipCode: '09080-500'
        },
        realEstateId: realEstate._id,
        ownerId: user._id
      }
    ]);
    
    console.log(`${terrenos.length} terrenos criados com sucesso:`);
    terrenos.forEach((terreno, index) => {
      console.log(`${index + 1}. ${terreno.name} - ID: ${terreno._id}`);
    });
    
    console.log('\n=== DADOS PARA TESTE ===');
    console.log('User ID:', user._id.toString());
    console.log('Real Estate ID:', realEstate._id.toString());
    console.log('Email:', user.email);
    console.log('Password: 123456');
    
  } catch (error) {
    console.error('Erro ao criar dados de teste:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestData();