import mongoose from 'mongoose';
import { UserModel } from '../models/User';
import { RealEstateModel } from '../models/RealEstate';
import { ProductModel } from '../models/Product';
import config from '../config/env';
import logger from '../config/logger';

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    logger.info('MongoDB conectado para seed de produtos');
  } catch (error) {
    logger.error('Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
};

// Dados mockados para produtos unificados
const seedProducts = async () => {
  try {
    // Verificar se já existe o usuário
    let user = await UserModel.findOne({ email: 'teste@example.com' });
    
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

    // Verificar se já existem produtos
    const existingProducts = await ProductModel.find({ realEstateId: realEstate._id });
    
    if (existingProducts.length === 0) {
      const products = [
        // IMÓVEIS
        {
          name: 'Apartamento Centro',
          title: 'Apartamento 2 Quartos - Centro',
          description: 'Lindo apartamento no centro da cidade com 2 quartos, sala, cozinha e banheiro.',
          type: 'imovel',
          status: 'available',
          condition: 'used',
          area: 65,
          builtArea: 65,
          bedrooms: 2,
          bathrooms: 1,
          parkingSpaces: 1,
          floor: '5º andar',
          totalFloors: 12,
          elevator: true,
          furnished: false,
          hasBalcony: true,
          address: {
            street: 'Rua das Flores',
            number: '456',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234567',
            country: 'Brasil'
          },
          value: 350000,
          salePrice: 350000,
          pricePerSquareMeter: 5384.62,
          condominiumFee: 450,
          iptuValue: 2800,
          sunPosition: 'north',
          yearBuilt: 2010,
          amenities: new Map([
            ['elevador', true],
            ['portaria24h', true],
            ['areaLazer', true],
            ['piscina', false]
          ]),
          acceptsFinancing: true,
          acceptsExchange: false,
          hasDocumentation: true,
          images: [],
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        },
        {
          name: 'Casa Jardins',
          title: 'Casa 3 Quartos - Jardim América',
          description: 'Casa espaçosa com 3 quartos, quintal e garagem para 2 carros.',
          type: 'imovel',
          status: 'available',
          condition: 'used',
          area: 120,
          builtArea: 120,
          bedrooms: 3,
          bathrooms: 2,
          parkingSpaces: 2,
          totalFloors: 1,
          elevator: false,
          furnished: false,
          hasBalcony: false,
          address: {
            street: 'Rua dos Jardins',
            number: '789',
            neighborhood: 'Jardim América',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234567',
            country: 'Brasil'
          },
          value: 750000,
          salePrice: 750000,
          rentPrice: 2500,
          pricePerSquareMeter: 6250,
          iptuValue: 4200,
          sunPosition: 'east',
          yearBuilt: 1995,
          amenities: new Map([
            ['quintal', true],
            ['churrasqueira', true],
            ['garagem', true],
            ['jardim', true]
          ]),
          acceptsFinancing: true,
          acceptsExchange: true,
          hasDocumentation: true,
          images: [],
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        },
        
        // TERRENOS
        {
          name: 'Terreno Comercial Vila Madalena',
          title: 'Terreno Comercial - Vila Madalena',
          description: 'Terreno plano ideal para construção comercial em área nobre.',
          type: 'terreno',
          status: 'available',
          condition: 'clean',
          area: 300,
          totalArea: 300,
          usableArea: 280,
          frontage: 12,
          depth: 25,
          topography: 'flat',
          soilType: 'clay',
          vegetation: 'grass',
          waterAccess: true,
          electricityAccess: true,
          sewerAccess: true,
          gasAccess: true,
          internetAccess: true,
          zoning: 'commercial',
          buildingCoefficient: 2.0,
          occupancyRate: 0.7,
          setbackFront: 5,
          setbackSide: 3,
          setbackRear: 3,
          maxHeight: 15,
          accessType: 'paved',
          address: {
            street: 'Rua Harmonia',
            number: '500',
            neighborhood: 'Vila Madalena',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '05435000',
            country: 'Brasil'
          },
          value: 850000,
          salePrice: 850000,
          pricePerSquareMeter: 2833.33,
          ituValue: 3400,
          nearbyAmenities: ['Metro', 'Shopping', 'Hospitais', 'Escolas'],
          acceptsFinancing: true,
          acceptsExchange: false,
          hasDocumentation: true,
          registrationNumber: 'R-1-12345',
          images: [],
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        },
        {
          name: 'Terreno Residencial Morumbi',
          title: 'Terreno Residencial - Morumbi',
          description: 'Terreno residencial em condomínio fechado com infraestrutura completa.',
          type: 'terreno',
          status: 'available',
          condition: 'ready_to_build',
          area: 450,
          totalArea: 450,
          usableArea: 400,
          frontage: 15,
          depth: 30,
          topography: 'sloped',
          soilType: 'mixed',
          vegetation: 'trees',
          waterAccess: true,
          electricityAccess: true,
          sewerAccess: true,
          gasAccess: true,
          internetAccess: true,
          zoning: 'residential',
          buildingCoefficient: 1.5,
          occupancyRate: 0.5,
          setbackFront: 5,
          setbackSide: 3,
          setbackRear: 5,
          maxHeight: 12,
          accessType: 'paved',
          address: {
            street: 'Rua das Magnólias',
            number: '200',
            neighborhood: 'Morumbi',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '05650000',
            country: 'Brasil'
          },
          value: 1200000,
          salePrice: 1200000,
          pricePerSquareMeter: 2666.67,
          ituValue: 4800,
          nearbyAmenities: ['Clube', 'Shopping', 'Escolas Particulares', 'Parques'],
          acceptsFinancing: true,
          acceptsExchange: true,
          hasDocumentation: true,
          registrationNumber: 'R-2-67890',
          images: [],
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        },
        
        // EMPREENDIMENTOS
        {
          name: 'Residencial Jardim das Flores',
          title: 'Residencial Jardim das Flores - Lançamento',
          description: 'Empreendimento residencial com apartamentos de 2 e 3 quartos, área de lazer completa.',
          type: 'empreendimento',
          status: 'available',
          condition: 'under_construction',
          area: 2500,
          totalArea: 2500,
          commonArea: 800,
          totalUnits: 120,
          availableUnits: 85,
          soldUnits: 30,
          reservedUnits: 5,
          unitsPerFloor: 8,
          totalFloors: 15,
          elevators: 2,
          constructionProgress: 45,
          timeline: {
            launchDate: new Date('2024-01-15'),
            constructionStart: new Date('2024-03-01'),
            expectedCompletion: new Date('2025-12-31'),
            deliveryDate: new Date('2026-02-28')
          },
          developer: {
            name: 'Construtora ABC Ltda',
            cnpj: '98765432000123',
            phone: '11987654321',
            email: 'contato@construtorabc.com.br',
            website: 'https://www.construtorabc.com.br'
          },
          address: {
            street: 'Av. das Américas',
            number: '1500',
            neighborhood: 'Barra da Tijuca',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zipCode: '22640100',
            country: 'Brasil'
          },
          value: 450000,
          salePrice: 450000,
          pricePerSquareMeter: 7500,
          condominiumFee: 350,
          amenities: new Map([
            ['piscina', true],
            ['academia', true],
            ['playground', true],
            ['salaoFestas', true],
            ['quadraPoliesportiva', true],
            ['portaria24h', true],
            ['elevador', true],
            ['garagem', true]
          ]),
          acceptsFinancing: true,
          acceptsExchange: false,
          hasDocumentation: true,
          registrationNumber: 'E-1-11111',
          images: [],
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        },
        {
          name: 'Comercial Business Center',
          title: 'Business Center - Salas Comerciais',
          description: 'Empreendimento comercial com salas de diversos tamanhos, infraestrutura moderna.',
          type: 'empreendimento',
          status: 'available',
          condition: 'new',
          area: 3200,
          totalArea: 3200,
          commonArea: 600,
          totalUnits: 80,
          availableUnits: 65,
          soldUnits: 10,
          reservedUnits: 5,
          unitsPerFloor: 10,
          totalFloors: 8,
          elevators: 3,
          constructionProgress: 100,
          timeline: {
            launchDate: new Date('2023-06-01'),
            constructionStart: new Date('2023-08-01'),
            expectedCompletion: new Date('2024-10-31'),
            deliveryDate: new Date('2024-11-30')
          },
          developer: {
            name: 'Incorporadora XYZ S.A.',
            cnpj: '11223344000155',
            phone: '11912345678',
            email: 'vendas@incorporadoraxyz.com.br',
            website: 'https://www.incorporadoraxyz.com.br'
          },
          address: {
            street: 'Av. Paulista',
            number: '2000',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310300',
            country: 'Brasil'
          },
          value: 280000,
          salePrice: 280000,
          pricePerSquareMeter: 8750,
          condominiumFee: 450,
          amenities: new Map([
            ['recepção', true],
            ['seguranca24h', true],
            ['elevador', true],
            ['arCondicionado', true],
            ['internet', true],
            ['estacionamento', true],
            ['geradorEnergia', true],
            ['sistemaIncendio', true]
          ]),
          acceptsFinancing: true,
          acceptsExchange: false,
          hasDocumentation: true,
          registrationNumber: 'E-2-22222',
          images: [],
          ownerId: user._id,
          realEstateId: realEstate._id,
          isActive: true
        }
      ];

      let createdCount = 0;
      let errorCount = 0;

      for (const productData of products) {
        try {
          const product = new ProductModel(productData);
          await product.save();
          logger.info(`✅ Produto criado: ${product.name} (${product.type})`);
          createdCount++;
        } catch (error) {
          logger.error(`❌ Erro ao criar produto ${productData.name}:`, error);
          errorCount++;
        }
      }

      logger.info(`\n📊 Resumo do seeding:`);
      logger.info(`✅ Produtos criados com sucesso: ${createdCount}`);
      logger.info(`❌ Erros: ${errorCount}`);
      logger.info(`📈 Total processado: ${products.length}`);
      
    } else {
      logger.info(`${existingProducts.length} produtos já existem`);
    }

    logger.info('🎉 Seed de produtos concluído com sucesso!');
    
  } catch (error) {
    logger.error('❌ Erro no seed de produtos:', error);
  }
};

// Executar seed
const runSeed = async () => {
  await connectDB();
  await seedProducts();
  await mongoose.disconnect();
  logger.info('Desconectado do MongoDB');
  process.exit(0);
};

// Executar apenas se chamado diretamente
if (require.main === module) {
  runSeed();
}

export default runSeed;