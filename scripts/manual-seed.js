#!/usr/bin/env node
/**
 * Script simplificado para seeding manual
 * Solicita o token do usuário e executa o seeding
 */

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function manualSeed() {
  console.log('🚀 Script de Seeding Manual');
  console.log('=' .repeat(40));
  console.log('');
  
  console.log('📋 Instruções:');
  console.log('1. Acesse: http://localhost:8080');
  console.log('2. Faça login com: gabriel@teste.com / 123456');
  console.log('3. Abra F12 → Console e execute:');
  console.log('   const token = sessionStorage.getItem("sanctum_access_token");');
  console.log('   console.log(token);');
  console.log('4. Copie o token que apareceu no console');
  console.log('');
  
  const token = await askQuestion('🔑 Cole o token aqui: ');
  
  if (!token || token.trim() === '') {
    console.log('❌ Token não fornecido. Saindo...');
    rl.close();
    return;
  }
  
  try {
    // Salvar token no .env
    console.log('💾 Salvando token no .env...');
    const envContent = `\nAPI_TOKEN=${token.trim()}\n`;
    fs.appendFileSync('.env', envContent);
    console.log('✅ Token salvo!');
    
    rl.close();
    
    // Executar seeding
    console.log('🌱 Executando seeding...');
    console.log('=' .repeat(40));
    
    execSync('npm run seed:frontend', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('\n🎉 Seeding concluído com sucesso!');
    console.log('✅ 10 imóveis criados na imobiliária');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    rl.close();
  }
}

manualSeed();