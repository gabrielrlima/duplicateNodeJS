import mongoose from 'mongoose';
import { UserModel } from '../models/User';
import { RealEstateModel } from '../models/RealEstate';
import { PropertyModel } from '../models/Property';
import config from '../config/env';
import logger from '../config/logger';

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    logger.info('MongoDB conectado para seed');
  } catch (error) {
    logger.error('Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
};

// Dados mockados
const seedData = async () => {
  try {
    // Verificar se já existe o usuário
    let user = await UserModel.findOne({ email: 'test@example.com' });
    
    if (!user) {
      logger.info('Usuário não encontrado, criando...');
      return;
    }

    logger.info('Usuário encontrado:', user.id);

    // Verificar se já existe uma imobiliária para este usuário
    let realEstate = await RealEstateModel.findOne({ ownerId: user._id });
    
    if (!realEstate) {
      // Criar imobiliária
      realEstate = new RealEstateModel({
        name: 'Imobiliária Teste',
        cnpj: '12345678000190',
        tradeName: 'Teste Imóveis',
        description: 'Imobiliária de teste para desenvolvimento',
        email: 'contato@teste.com',
        phone: '11999999999',
        address: {
          street: 'Rua Teste',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234567',
          country: 'Brasil'
        },
        contacts: [{
          name: 'João Silva',
          role: 'Gerente',
          email: 'joao@teste.com',
          phone: '11888888888'
        }],
        specialties: ['residential', 'commercial'],
        serviceAreas: ['São Paulo', 'ABC'],
        ownerId: user._id,
        isActive: true,
        isVerified: true
      });
      
      await realEstate.save();
      logger.info('Imobiliária criada:', realEstate.id);
    } else {
      logger.info('Imobiliária já existe:', realEstate.id);
    }

    // Criar algumas propriedades de exemplo
    const existingProperties = await PropertyModel.find({ realEstateId: realEstate._id });
    
    if (existingProperties.length === 0) {
      const properties = [
        {
          name: 'Apartamento Centro',
          title: 'Apartamento 2 Quartos - Centro',
          description: 'Lindo apartamento no centro da cidade com 2 quartos, sala, cozinha e banheiro.',
          type: 'apartment',
          purpose: 'sale',
          price: 350000,
          value: 350000,
          area: 65,
          bedrooms: 2,
          bathrooms: 1,
          parkingSpaces: 1,
          address: {
            street: 'Rua das Flores',
            number: '456',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234567',
            country: 'Brasil'
          },
          features: ['Elevador', 'Portaria 24h', 'Área de lazer'],
          images: [],
          status: 'available',
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        },
        {
          name: 'Casa Jardins',
          title: 'Casa 3 Quartos - Jardim América',
          description: 'Casa espaçosa com 3 quartos, quintal e garagem para 2 carros.',
          type: 'house',
          purpose: 'rent',
          price: 2500,
          value: 750000,
          area: 120,
          bedrooms: 3,
          bathrooms: 2,
          parkingSpaces: 2,
          address: {
            street: 'Rua dos Jardins',
            number: '789',
            neighborhood: 'Jardim América',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234567',
            country: 'Brasil'
          },
          features: ['Quintal', 'Churrasqueira', 'Garagem'],
          images: [],
          status: 'available',
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        },
        {
          name: 'Sala Comercial Vila Olímpia',
          title: 'Sala Comercial - Vila Olímpia',
          description: 'Sala comercial moderna em prédio corporativo.',
          type: 'commercial',
          purpose: 'rent',
          price: 3500,
          value: 450000,
          area: 45,
          bedrooms: 0,
          bathrooms: 1,
          parkingSpaces: 1,
          address: {
            street: 'Av. Brigadeiro Faria Lima',
            number: '1000',
            neighborhood: 'Vila Olímpia',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234567',
            country: 'Brasil'
          },
          features: ['Ar condicionado', 'Internet', 'Recepção'],
          images: [],
          status: 'available',
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        }
      ];

      for (const propertyData of properties) {
        const property = new PropertyModel(propertyData);
        await property.save();
        logger.info('Propriedade criada:', property.title);
      }
    } else {
      logger.info(`${existingProperties.length} propriedades já existem`);
    }

    logger.info('Seed concluído com sucesso!');
    
  } catch (error) {
    logger.error('Erro no seed:', error);
  }
};

// Executar seed
const runSeed = async () => {
  await connectDB();
  await seedData();
  await mongoose.disconnect();
  logger.info('Desconectado do MongoDB');
  process.exit(0);
};

runSeed();