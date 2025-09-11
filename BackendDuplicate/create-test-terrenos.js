const mongoose = require('mongoose');

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

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/duplicatespa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Gerar ObjectIds válidos
const realEstateId = new mongoose.Types.ObjectId();
const ownerId = new mongoose.Types.ObjectId();

const testTerrenos = [
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
    realEstateId: realEstateId,
    ownerId: ownerId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
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
    realEstateId: realEstateId,
    ownerId: ownerId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
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
    realEstateId: realEstateId,
    ownerId: ownerId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

console.log('IDs gerados:');
console.log('Real Estate ID:', realEstateId.toString());
console.log('Owner ID:', ownerId.toString());

async function createTestTerrenos() {
  try {
    console.log('Criando terrenos de teste...');
    
    // Limpar terrenos existentes
    await TerrenoModel.deleteMany({});
    console.log('Terrenos existentes removidos.');
    
    // Inserir novos terrenos
    const result = await TerrenoModel.insertMany(testTerrenos);
    console.log(`${result.length} terrenos criados com sucesso:`);
    result.forEach((terreno, index) => {
      console.log(`${index + 1}. ${terreno.name} - ID: ${terreno._id}`);
    });
    
  } catch (error) {
    console.error('Erro ao criar terrenos de teste:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestTerrenos();