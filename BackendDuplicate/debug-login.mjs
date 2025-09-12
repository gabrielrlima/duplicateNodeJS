import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/backendduplicate';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const User = mongoose.model('User', userSchema);

async function debug() {
  console.log('=== DEBUG LOGIN ===');
  
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB conectado!');
    
    console.log('Verificando usuário de teste...');
    let user = await User.findOne({ email: 'gabriel@teste.com' });
    
    if (!user) {
      console.log('Criando usuário de teste...');
      user = new User({
        firstName: 'Gabriel',
        lastName: 'Lima',
        email: 'gabriel@teste.com',
        password: '123456'
      });
      await user.save();
      console.log('Usuário criado:', user.email);
    } else {
      console.log('Usuário já existe:', user.email);
    }
    
    console.log('Testando login...');
    const loginUser = await User.findOne({ email: 'gabriel@teste.com' });
    if (loginUser) {
      const isValid = await loginUser.comparePassword('123456');
      console.log('Senha válida:', isValid);
    }
    
    console.log('=== DEBUG CONCLUÍDO ===');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debug();
