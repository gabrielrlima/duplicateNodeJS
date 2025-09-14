const mongoose = require('mongoose');
const { ProductModel } = require('./BackendDuplicate/src/models/Product');

async function fixProductsAssociation() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/duplicate_db');
    console.log('✅ Conectado ao MongoDB');
    
    const wrongRealEstateId = '68c41b4f075a35d86417d7f2';
    const correctRealEstateId = '68c4467199df1835267f3e48'; // Adão Imóveis
    
    console.log('🔍 Buscando produtos com imobiliária incorreta...');
    const wrongProducts = await ProductModel.find({ realEstateId: wrongRealEstateId });
    console.log(`📦 Encontrados ${wrongProducts.length} produtos para transferir`);
    
    if (wrongProducts.length > 0) {
      console.log('📋 Produtos encontrados:');
      wrongProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name || product.title} (${product.type})`);
      });
      
      console.log('🔄 Transferindo produtos para a Adão Imóveis...');
      const result = await ProductModel.updateMany(
        { realEstateId: wrongRealEstateId },
        { $set: { realEstateId: correctRealEstateId } }
      );
      
      console.log(`✅ ${result.modifiedCount} produtos transferidos com sucesso!`);
      
      // Verificar se a transferência funcionou
      console.log('🔍 Verificando produtos da Adão Imóveis após transferência...');
      const adaoProducts = await ProductModel.find({ realEstateId: correctRealEstateId });
      console.log(`📦 Total de produtos na Adão Imóveis: ${adaoProducts.length}`);
      
      const typeCount = {};
      adaoProducts.forEach(product => {
        const type = product.type || 'indefinido';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      console.log('📊 Produtos por tipo:');
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
      
    } else {
      console.log('ℹ️ Nenhum produto encontrado para transferir');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

fixProductsAssociation();