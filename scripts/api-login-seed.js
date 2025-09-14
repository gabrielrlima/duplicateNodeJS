#!/usr/bin/env node
/**
 * Script para fazer login via API e executar seeding
 * Usa as credenciais fornecidas para obter token automaticamente
 */

import { execSync } from 'child_process';
import fs from 'fs';

// Configurações
const API_BASE_URL = 'http://localhost:3001';
const LOGIN_EMAIL = 'gabriel@teste.com';
const LOGIN_PASSWORD = '123456';

async function loginAndSeed() {
  console.log('🚀 Login via API e Seeding Automatizado');
  console.log('=' .repeat(50));
  console.log('');
  
  try {
    // 1. Fazer login via API
    console.log('🔐 Fazendo login via API...');
    console.log('📧 Email:', LOGIN_EMAIL);
    
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD
      })
    });
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Login falhou: ${loginResponse.status} - ${errorText}`);
    }
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success || !loginData.data?.token) {
      throw new Error('Token não encontrado na resposta do login');
    }
    
    const token = loginData.data.token;
    console.log('✅ Login realizado com sucesso!');
    console.log('🔑 Token obtido!');
    
    // 2. Salvar token no .env
    console.log('💾 Salvando token no .env...');
    
    // Verificar se já existe API_TOKEN no .env
    let envContent = '';
    try {
      envContent = fs.readFileSync('.env', 'utf8');
    } catch (error) {
      // Arquivo .env não existe, será criado
    }
    
    // Remover API_TOKEN existente se houver
    const envLines = envContent.split('\n').filter(line => !line.startsWith('API_TOKEN='));
    
    // Adicionar novo token
    envLines.push(`API_TOKEN=${token}`);
    
    // Salvar arquivo .env
    fs.writeFileSync('.env', envLines.join('\n'));
    console.log('✅ Token salvo no .env!');
    
    // 3. Executar seeding
    console.log('\n🌱 Executando seeding dos produtos...');
    console.log('=' .repeat(50));
    
    execSync('npm run seed:frontend', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('\n🎉 Processo concluído com sucesso!');
    console.log('✅ Login realizado via API');
    console.log('✅ Token configurado no .env');
    console.log('✅ 10 imóveis criados na imobiliária "Adão Imóveis"');
    console.log('\n📊 Verifique o sistema em: http://localhost:8080');
    
  } catch (error) {
    console.error('❌ Erro durante o processo:', error.message);
    
    console.log('\n📋 Instruções manuais alternativas:');
    console.log('1. Acesse: http://localhost:8080');
    console.log('2. Faça login com:', LOGIN_EMAIL, '/', LOGIN_PASSWORD);
    console.log('3. Abra F12 → Console e execute:');
    console.log('   const token = sessionStorage.getItem("sanctum_access_token");');
    console.log('   console.log("API_TOKEN=" + token);');
    console.log('4. Copie o resultado e execute:');
    console.log('   echo "API_TOKEN=seu_token" >> .env');
    console.log('5. Execute: npm run seed:frontend');
    
    process.exit(1);
  }
}

loginAndSeed();