import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Configuração do MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/backendduplicate';

// Schema do usuário
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparando senhas...');
  console.log('Senha candidata:', candidatePassword);
  console.log('Senha armazenada:', this.password);
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log('Resultado da comparação:', result);
  return result;
};

// Middleware para hash da senha
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  console.log('Hashing password...');
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

async function debugLogin() {
  console.log('=== DEBUG LOGIN ===');
  
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB conectado!');
    
    // Limpar usuários existentes
    console.log('Limpando usuários existentes...');
    await User.deleteMany({});
    console.log('Usuários limpos!');
    
    // Criar usuário de teste
    console.log('Criando usuário de teste...');
    const testUser = new User({
      firstName: 'Gabriel',
      lastName: 'Lima',
      email: 'gabriel@teste.com',
      password: '123456'
    });
    
    console.log('Salvando usuário...');
    await testUser.save();
    console.log('Usuário criado:', testUser.toJSON());
    
    // Buscar usuário
    console.log('Buscando usuário...');
    const user = await User.findOne({ email: 'gabriel@teste.com' });
    console.log('Usuário encontrado:', user ? 'SIM' : 'NÃO');
    
    if (user) {
      console.log('Testando comparação de senha...');
      const isValid = await user.comparePassword('123456');
      console.log('Senha válida:', isValid);
    }
    
    console.log('=== DEBUG CONCLUÍDO ===');
    
  } catch (error) {
    console.error('Erro no debug:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Executar debug
debugLogin();