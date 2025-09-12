const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/backendduplicate');

// Schema do User
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('🔍 Comparando senhas...');
  console.log('Senha candidata:', candidatePassword);
  console.log('Hash armazenado:', this.password);
  
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('✅ Resultado da comparação:', result);
    return result;
  } catch (error) {
    console.error('❌ Erro na comparação:', error);
    throw error;
  }
};

const UserModel = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    console.log('🔍 Buscando usuário teste@example.com...');
    
    const user = await UserModel.findOne({ 
      email: 'teste@example.com' 
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password
    });
    
    console.log('🔐 Testando senha...');
    const isValid = await user.comparePassword('123456');
    
    console.log('🎯 Resultado final:', isValid ? 'SUCESSO' : 'FALHA');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();