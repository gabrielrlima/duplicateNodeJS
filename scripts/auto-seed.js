#!/usr/bin/env node
/**
 * Script automatizado para fazer login e executar seeding
 * Usa as credenciais fornecidas para automatizar o processo
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import { execSync } from 'child_process';

// Configurações
const FRONTEND_URL = 'http://localhost:8080';
const LOGIN_EMAIL = 'gabriel@teste.com';
const LOGIN_PASSWORD = '123456';

async function autoSeedWithLogin() {
  console.log('🚀 Iniciando processo automatizado de seeding...');
  console.log('=' .repeat(50));
  
  let browser;
  
  try {
    // 1. Abrir navegador
    console.log('🌐 Abrindo navegador...');
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 2. Navegar para a página de login
    console.log('📱 Navegando para:', FRONTEND_URL);
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
    
    // 3. Fazer login
    console.log('🔐 Fazendo login com:', LOGIN_EMAIL);
    
    // Aguardar campos de login aparecerem
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    
    // Preencher email
    await page.type('input[type="email"], input[name="email"]', LOGIN_EMAIL);
    
    // Preencher senha
    await page.type('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
    
    // Clicar no botão de login
    await page.click('button[type="submit"], button:contains("Entrar"), button:contains("Login")');
    
    // Aguardar redirecionamento após login
    console.log('⏳ Aguardando login...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    
    // 4. Obter token do sessionStorage
    console.log('🔑 Obtendo token de autenticação...');
    const token = await page.evaluate(() => {
      return sessionStorage.getItem('sanctum_access_token');
    });
    
    if (!token) {
      throw new Error('Token não encontrado no sessionStorage');
    }
    
    console.log('✅ Token obtido com sucesso!');
    
    // 5. Salvar token no .env
    console.log('💾 Salvando token no arquivo .env...');
    const envContent = `API_TOKEN=${token}\n`;
    fs.appendFileSync('.env', envContent);
    
    console.log('✅ Token salvo no .env');
    
    // 6. Fechar navegador
    await browser.close();
    
    // 7. Executar script de seeding
    console.log('🌱 Executando script de seeding...');
    console.log('=' .repeat(50));
    
    execSync('npm run seed:frontend', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('\n🎉 Processo concluído com sucesso!');
    console.log('✅ Login realizado');
    console.log('✅ Token configurado');
    console.log('✅ Produtos criados na imobiliária');
    
  } catch (error) {
    console.error('❌ Erro durante o processo:', error.message);
    
    if (browser) {
      await browser.close();
    }
    
    // Fallback: instruções manuais
    console.log('\n📋 Instruções manuais:');
    console.log('1. Acesse:', FRONTEND_URL);
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

// Verificar se puppeteer está instalado e executar
try {
  await autoSeedWithLogin();
} catch (error) {
  if (error.message.includes('Cannot resolve module')) {
    console.log('📦 Puppeteer não encontrado. Instalando...');
    
    try {
      execSync('npm install puppeteer --save-dev', { stdio: 'inherit' });
      console.log('✅ Puppeteer instalado. Execute novamente: npm run seed:auto');
    } catch (installError) {
      console.error('❌ Erro ao instalar puppeteer:', installError.message);
      console.log('\n📋 Execute manualmente:');
      console.log('1. npm install puppeteer --save-dev');
      console.log('2. npm run seed:auto');
    }
  } else {
    console.error('❌ Erro:', error.message);
  }
}