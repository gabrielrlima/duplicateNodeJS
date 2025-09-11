import mongoose from 'mongoose';
import { UserModel } from '../models/User';
import { RealEstateModel } from '../models/RealEstate';
import { BrokerModel } from '../models/Broker';
import { BrokerGroupModel } from '../models/BrokerGroup';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Dados de exemplo para popular o banco
const seedData = {
  users: [
    {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@exemplo.com',
      password: 'senha123',
      phone: '+5511999991111',
      cpf: '123.456.789-01',
      rg: '12.345.678-9',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'M' as const,
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil'
      },
      profession: 'Corretor de Imóveis',
      maritalStatus: 'Married' as const,
      nationality: 'Brasileira',
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    },
    {
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@exemplo.com',
      password: 'senha123',
      phone: '+5511999992222',
      cpf: '987.654.321-09',
      rg: '98.765.432-1',
      dateOfBirth: new Date('1990-08-20'),
      gender: 'F' as const,
      address: {
        street: 'Av. Paulista',
        number: '456',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        country: 'Brasil'
      },
      profession: 'Gerente de Vendas',
      maritalStatus: 'Single' as const,
      nationality: 'Brasileira',
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    },
    {
      firstName: 'Carlos',
      lastName: 'Oliveira',
      email: 'carlos.oliveira@exemplo.com',
      password: 'senha123',
      phone: '+5511999993333',
      cpf: '456.789.123-45',
      rg: '45.678.912-3',
      dateOfBirth: new Date('1982-12-10'),
      gender: 'M' as const,
      address: {
        street: 'Rua Augusta',
        number: '789',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-000',
        country: 'Brasil'
      },
      profession: 'Corretor de Imóveis',
      maritalStatus: 'Divorced' as const,
      nationality: 'Brasileira',
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    }
  ],
  realEstates: [
    {
      name: 'Imobiliária Prime',
      cnpj: '12.345.678/0001-90',
      address: {
        street: 'Rua Comercial',
        number: '100',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil'
      },
      phone: '+551133334444',
      email: 'contato@imobiliariaprime.com',
      website: 'https://www.imobiliariaprime.com',
      businessHours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' }
      },
      socialMedia: {
        facebook: 'https://facebook.com/imobiliariaprime',
        instagram: 'https://instagram.com/imobiliariaprime',
        linkedin: 'https://linkedin.com/company/imobiliariaprime'
      },
      isActive: true
    }
  ]
};

class DatabaseSeeder {
  private async connectDatabase(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/duplicate_backend';
      await mongoose.connect(mongoUri);
      console.log('✅ Conectado ao MongoDB');
    } catch (error) {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }

  private async clearDatabase(): Promise<void> {
    try {
      console.log('🧹 Limpando banco de dados...');
      await BrokerModel.deleteMany({});
      await BrokerGroupModel.deleteMany({});
      await RealEstateModel.deleteMany({});
      await UserModel.deleteMany({});
      console.log('✅ Banco de dados limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar banco de dados:', error);
      throw error;
    }
  }

  private async seedUsers(): Promise<mongoose.Types.ObjectId[]> {
    try {
      console.log('👥 Criando usuários...');
      const userIds: mongoose.Types.ObjectId[] = [];

      for (const userData of seedData.users) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        const user = new UserModel({
          ...userData,
          password: hashedPassword
        });

        await user.save();
        userIds.push(user._id);
        console.log(`✅ Usuário criado: ${userData.firstName} ${userData.lastName}`);
      }

      return userIds;
    } catch (error) {
      console.error('❌ Erro ao criar usuários:', error);
      throw error;
    }
  }

  private async seedRealEstates(ownerIds: mongoose.Types.ObjectId[]): Promise<mongoose.Types.ObjectId[]> {
    try {
      console.log('🏢 Criando imobiliárias...');
      const realEstateIds: mongoose.Types.ObjectId[] = [];

      for (let i = 0; i < seedData.realEstates.length; i++) {
        const realEstateData = seedData.realEstates[i];
        const ownerId = ownerIds[i % ownerIds.length]; // Distribui proprietários

        const realEstate = new RealEstateModel({
          ...realEstateData,
          ownerId
        });

        await realEstate.save();
        realEstateIds.push(realEstate._id);
        console.log(`✅ Imobiliária criada: ${realEstateData.name}`);

        // Atualizar usuário com referência à imobiliária
        await UserModel.findByIdAndUpdate(ownerId, {
          realEstateId: realEstate._id
        });
      }

      return realEstateIds;
    } catch (error) {
      console.error('❌ Erro ao criar imobiliárias:', error);
      throw error;
    }
  }

  private async seedBrokerGroups(realEstateIds: mongoose.Types.ObjectId[]): Promise<mongoose.Types.ObjectId[]> {
    try {
      console.log('👥 Criando grupos de corretores...');
      const groupIds: mongoose.Types.ObjectId[] = [];

      const groupsData = [
        {
          name: 'Equipe de Vendas Residenciais',
          description: 'Grupo especializado em vendas de imóveis residenciais',
          groupType: 'sales' as const,
          territory: ['Centro', 'Zona Sul', 'Zona Oeste'],
          targetMarket: ['first_time_buyers', 'families'],
          commissionStructure: {
            baseRate: 3.0,
            bonusThresholds: [
              { threshold: 10, bonusRate: 0.5 },
              { threshold: 20, bonusRate: 1.0 }
            ],
            teamBonusRate: 0.2
          }
        },
        {
          name: 'Equipe de Imóveis de Luxo',
          description: 'Grupo especializado em imóveis de alto padrão',
          groupType: 'luxury' as const,
          territory: ['Jardins', 'Vila Olímpia', 'Itaim Bibi'],
          targetMarket: ['luxury_buyers', 'investors'],
          commissionStructure: {
            baseRate: 4.0,
            bonusThresholds: [
              { threshold: 5, bonusRate: 1.0 },
              { threshold: 10, bonusRate: 2.0 }
            ],
            teamBonusRate: 0.5
          }
        }
      ];

      for (let i = 0; i < groupsData.length; i++) {
        const groupData = groupsData[i];
        const realEstateId = realEstateIds[0]; // Usar primeira imobiliária

        const group = new BrokerGroupModel({
          ...groupData,
          realEstateId,
          permissions: {
            canCreateListings: true,
            canEditListings: true,
            canDeleteListings: false,
            canManageClients: true,
            canViewReports: false,
            canManageTeam: false,
            canApproveContracts: false,
            canAccessFinancials: false,
            canEditGroupSettings: false,
            canInviteMembers: false
          }
        });

        await group.save();
        groupIds.push(group._id);
        console.log(`✅ Grupo criado: ${groupData.name}`);
      }

      return groupIds;
    } catch (error) {
      console.error('❌ Erro ao criar grupos de corretores:', error);
      throw error;
    }
  }

  private async seedBrokers(
    userIds: mongoose.Types.ObjectId[],
    realEstateIds: mongoose.Types.ObjectId[],
    groupIds: mongoose.Types.ObjectId[]
  ): Promise<void> {
    try {
      console.log('🏘️ Criando corretores...');

      const brokersData = [
        {
          licenseNumber: 'CRECI-12345',
          licenseState: 'SP',
          licenseExpiryDate: new Date('2025-12-31'),
          isManager: true,
          managerLevel: 'senior' as const,
          commissionRate: 5.0,
          baseSalary: 8000,
          salesTarget: 50,
          territory: ['Centro', 'Zona Sul'],
          specializations: ['residential', 'luxury'],
          languages: ['Português', 'Inglês']
        },
        {
          licenseNumber: 'CRECI-67890',
          licenseState: 'SP',
          licenseExpiryDate: new Date('2025-06-30'),
          isManager: false,
          commissionRate: 3.5,
          baseSalary: 5000,
          salesTarget: 30,
          territory: ['Zona Norte', 'Zona Leste'],
          specializations: ['residential', 'commercial'],
          languages: ['Português']
        },
        {
          licenseNumber: 'CRECI-11111',
          licenseState: 'SP',
          licenseExpiryDate: new Date('2025-09-15'),
          isManager: false,
          commissionRate: 4.0,
          baseSalary: 6000,
          salesTarget: 40,
          territory: ['Jardins', 'Vila Olímpia'],
          specializations: ['luxury', 'investment'],
          languages: ['Português', 'Inglês', 'Espanhol']
        }
      ];

      for (let i = 0; i < Math.min(brokersData.length, userIds.length); i++) {
        const brokerData = brokersData[i];
        const userId = userIds[i];
        const realEstateId = realEstateIds[0]; // Usar primeira imobiliária
        const brokerGroupId = groupIds[i % groupIds.length]; // Distribuir entre grupos

        const broker = new BrokerModel({
          ...brokerData,
          userId,
          realEstateId,
          brokerGroupId,
          hireDate: new Date(),
          employmentStatus: 'active'
        });

        await broker.save();
        console.log(`✅ Corretor criado para usuário: ${userId}`);

        // Se for gerente, atualizar o grupo
        if (brokerData.isManager && i < groupIds.length) {
          await BrokerGroupModel.findByIdAndUpdate(groupIds[i], {
            managerId: broker._id
          });
          console.log(`✅ Gerente definido para grupo: ${groupIds[i]}`);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao criar corretores:', error);
      throw error;
    }
  }

  public async run(): Promise<void> {
    try {
      console.log('🌱 Iniciando processo de seed...');
      
      await this.connectDatabase();
      await this.clearDatabase();
      
      const userIds = await this.seedUsers();
      const realEstateIds = await this.seedRealEstates(userIds);
      const groupIds = await this.seedBrokerGroups(realEstateIds);
      await this.seedBrokers(userIds, realEstateIds, groupIds);
      
      console.log('🎉 Processo de seed concluído com sucesso!');
      console.log('📊 Dados criados:');
      console.log(`   - ${userIds.length} usuários`);
      console.log(`   - ${realEstateIds.length} imobiliárias`);
      console.log(`   - ${groupIds.length} grupos de corretores`);
      console.log(`   - ${Math.min(userIds.length, 3)} corretores`);
      
    } catch (error) {
      console.error('❌ Erro durante o processo de seed:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado do MongoDB');
    }
  }
}

// Executar seeder se chamado diretamente
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.run()
    .then(() => {
      console.log('✅ Seeder executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro ao executar seeder:', error);
      process.exit(1);
    });
}

export default DatabaseSeeder;