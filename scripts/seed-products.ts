#!/usr/bin/env node
/**
 * Script de Seed para Produtos Imobiliários
 * 
 * Este script cria 30 produtos de teste (10 de cada tipo: Terreno, Imóvel, Empreendimento)
 * com controle de concorrência, retentativas e observabilidade completa.
 * 
 * Uso:
 *   npm run seed:products
 *   
 * Variáveis de ambiente necessárias:
 *   - BASE_URL: URL base da API (ex: http://localhost:3001)
 *   - API_TOKEN: Token de autenticação Bearer
 *   - IMOBILIARIA_ID: ID da imobiliária/tenant
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { randomUUID } from 'crypto';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface ProductPayload {
  tipo: 'imovel' | 'terreno' | 'empreendimento';
  titulo: string;
  localizacao: string;
  descricao: string;
  preco?: number;
  // Campos específicos de imóvel
  quartos?: number;
  banheiros?: number;
  garagem?: number;
  areaConstruida?: number;
  // Campos específicos de terreno
  area?: number;
  frente?: number;
  tipoSolo?: 'plano' | 'inclinado' | 'irregular';
  zoneamento?: string;
  // Campos específicos de empreendimento
  construtora?: string;
  previsaoEntrega?: string;
  unidadesDisponiveis?: number;
  plantas?: Array<{
    id?: string;
    area: number;
    precoPorM2: number;
    descricao?: string;
  }>;
}

interface SeedResult {
  success: boolean;
  id?: string;
  error?: string;
  statusCode?: number;
  payload: ProductPayload;
  attempts: number;
  idempotencyKey: string;
}

interface SeedSummary {
  total: number;
  created: number;
  failed: number;
  createdIds: string[];
  failedItems: Array<{
    tipo: string;
    titulo: string;
    error: string;
    statusCode?: number;
  }>;
}

// ============================================================================
// CONFIGURAÇÃO E CONSTANTES
// ============================================================================

const CONFIG = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:3001',
  API_TOKEN: process.env.API_TOKEN || '',
  IMOBILIARIA_ID: process.env.IMOBILIARIA_ID || '',
  CONCURRENCY_LIMIT: parseInt(process.env.CONCURRENCY_LIMIT || '3'),
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3'),
  RETRY_DELAY_BASE: parseInt(process.env.RETRY_DELAY_BASE || '1000'),
  ITEMS_PER_TYPE: parseInt(process.env.ITEMS_PER_TYPE || '10'),
};

const SEED_PREFIX = `SEED_${new Date().toISOString().slice(0, 10)}`;

// ============================================================================
// GERAÇÃO DE DADOS
// ============================================================================

const BAIRROS = [
  'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Moema', 'Brooklin',
  'Vila Olímpia', 'Jardins', 'Perdizes', 'Higienópolis', 'Liberdade',
  'Bela Vista', 'Santa Cecília', 'Vila Mariana', 'Ipiranga', 'Saúde',
  'Tatuapé', 'Mooca', 'Penha', 'Vila Prudente', 'Jabaquara'
];

const CONSTRUTORAS = [
  'Cyrela', 'MRV', 'PDG', 'Rossi', 'Gafisa',
  'Even', 'Tecnisa', 'Brookfield', 'Tenda', 'Direcional'
];

const RUAS = [
  'Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Rua Oscar Freire',
  'Av. Faria Lima', 'Rua Consolação', 'Av. Rebouças', 'Rua Teodoro Sampaio',
  'Av. Brasil', 'Rua Haddock Lobo', 'Rua Bela Cintra', 'Av. Ibirapuera',
  'Rua Pamplona', 'Av. Nove de Julho', 'Rua Estados Unidos'
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateImovelPayload(index: number): ProductPayload {
  const bairro = getRandomItem(BAIRROS);
  const rua = getRandomItem(RUAS);
  const numero = getRandomNumber(100, 9999);
  const quartos = getRandomNumber(1, 4);
  const banheiros = getRandomNumber(1, 3);
  const garagem = getRandomNumber(0, 3);
  const area = getRandomNumber(45, 200);
  const precoM2 = getRandomNumber(8000, 15000);
  
  return {
    tipo: 'imovel',
    titulo: `${SEED_PREFIX} - Apartamento ${quartos} quartos ${bairro} #${index}`,
    localizacao: `${rua}, ${numero} - ${bairro}, São Paulo - SP`,
    descricao: `Excelente apartamento com ${quartos} quartos e ${banheiros} banheiros no coração do ${bairro}. Imóvel bem localizado, próximo ao transporte público e comércio local. Área construída de ${area}m², ${garagem > 0 ? `com ${garagem} vaga${garagem > 1 ? 's' : ''} de garagem` : 'sem vaga de garagem'}.`,
    preco: area * precoM2,
    quartos,
    banheiros,
    garagem,
    areaConstruida: area
  };
}

function generateTerrenoPayload(index: number): ProductPayload {
  const bairro = getRandomItem(BAIRROS);
  const rua = getRandomItem(RUAS);
  const numero = getRandomNumber(100, 9999);
  const area = getRandomNumber(200, 1000);
  const frente = getRandomNumber(10, 25);
  const precoM2 = getRandomNumber(2000, 5000);
  const tipoSolo = getRandomItem(['plano', 'inclinado', 'irregular'] as const);
  const zoneamentos = ['ZM-1', 'ZM-2', 'ZC-1', 'ZC-2', 'ZR-1', 'ZR-2'];
  
  return {
    tipo: 'terreno',
    titulo: `${SEED_PREFIX} - Terreno ${area}m² ${bairro} #${index}`,
    localizacao: `${rua}, ${numero} - ${bairro}, São Paulo - SP`,
    descricao: `Terreno ${tipoSolo} de ${area}m² com ${frente}m de frente. Localizado em área ${bairro === 'Vila Madalena' || bairro === 'Pinheiros' ? 'nobre' : 'em desenvolvimento'} com excelente potencial para construção. Zoneamento ${getRandomItem(zoneamentos)} permite uso residencial e comercial.`,
    preco: area * precoM2,
    area,
    frente,
    tipoSolo,
    zoneamento: getRandomItem(zoneamentos)
  };
}

function generateEmpreendimentoPayload(index: number): ProductPayload {
  const bairro = getRandomItem(BAIRROS);
  const rua = getRandomItem(RUAS);
  const numero = getRandomNumber(100, 9999);
  const construtora = getRandomItem(CONSTRUTORAS);
  const unidades = getRandomNumber(50, 200);
  const entregaAno = getRandomNumber(2025, 2027);
  const entregaMes = getRandomNumber(1, 12);
  
  // Gerar 2-4 plantas diferentes
  const numPlantas = getRandomNumber(2, 4);
  const plantas = [];
  
  for (let i = 0; i < numPlantas; i++) {
    const area = getRandomNumber(45, 120);
    const precoPorM2 = getRandomNumber(10000, 18000);
    const quartos = area < 60 ? getRandomNumber(1, 2) : getRandomNumber(2, 3);
    
    plantas.push({
      id: `planta-${i + 1}-${Date.now()}`,
      area,
      precoPorM2,
      descricao: `Planta ${i + 1}: ${quartos} quartos, ${area}m²`
    });
  }
  
  return {
    tipo: 'empreendimento',
    titulo: `${SEED_PREFIX} - Residencial ${construtora} ${bairro} #${index}`,
    localizacao: `${rua}, ${numero} - ${bairro}, São Paulo - SP`,
    descricao: `Novo empreendimento da ${construtora} no ${bairro}. ${unidades} unidades com ${numPlantas} plantas diferentes, de ${Math.min(...plantas.map(p => p.area))}m² a ${Math.max(...plantas.map(p => p.area))}m². Acabamento de primeira qualidade, área de lazer completa com piscina, academia e salão de festas. Entrega prevista para ${String(entregaMes).padStart(2, '0')}/${entregaAno}.`,
    construtora,
    previsaoEntrega: `${entregaAno}-${String(entregaMes).padStart(2, '0')}-01`,
    unidadesDisponiveis: unidades,
    plantas
  };
}

function generatePayloads(): ProductPayload[] {
  const payloads: ProductPayload[] = [];
  
  // Gerar imóveis
  for (let i = 1; i <= CONFIG.ITEMS_PER_TYPE; i++) {
    payloads.push(generateImovelPayload(i));
  }
  
  // Gerar terrenos
  for (let i = 1; i <= CONFIG.ITEMS_PER_TYPE; i++) {
    payloads.push(generateTerrenoPayload(i));
  }
  
  // Gerar empreendimentos
  for (let i = 1; i <= CONFIG.ITEMS_PER_TYPE; i++) {
    payloads.push(generateEmpreendimentoPayload(i));
  }
  
  return payloads;
}

// ============================================================================
// CLIENTE HTTP
// ============================================================================

function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: CONFIG.BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.API_TOKEN}`
    }
  });
  
  // Interceptor para logging de requests
  client.interceptors.request.use((config) => {
    console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });
  
  return client;
}

// ============================================================================
// FUNÇÃO DE CRIAÇÃO COM RETENTATIVAS
// ============================================================================

async function createProduct(
  client: AxiosInstance,
  imobiliariaId: string,
  payload: ProductPayload,
  idempotencyKey: string,
  attempt: number = 1
): Promise<SeedResult> {
  try {
    const response = await client.post(
      `/v1/tenants/${imobiliariaId}/products`,
      payload,
      {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      }
    );
    
    const productId = response.data?.id || response.data?._id || 'unknown';
    
    console.log(`✅ [${payload.tipo.toUpperCase()}] "${payload.titulo}" criado com sucesso (ID: ${productId})`);
    
    return {
      success: true,
      id: productId,
      payload,
      attempts: attempt,
      idempotencyKey
    };
    
  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;
    const errorData = axiosError.response?.data as any;
    
    // Erros 4xx não devem ser retentados (exceto 429 - rate limit)
    if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
      let errorMessage = `HTTP ${statusCode}`;
      
      if (statusCode === 422) {
        // Erro de validação - extrair detalhes dos campos
        if (errorData?.errors) {
          const fieldErrors = Object.entries(errorData.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          errorMessage = `Validação: ${fieldErrors}`;
        } else if (errorData?.message) {
          errorMessage = `Validação: ${errorData.message}`;
        }
      } else if (statusCode === 409) {
        errorMessage = `Conflito: ${errorData?.message || 'Produto já existe'}`;
      } else if (errorData?.message) {
        errorMessage = `${errorMessage}: ${errorData.message}`;
      }
      
      console.log(`❌ [${payload.tipo.toUpperCase()}] "${payload.titulo}" falhou: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
        statusCode,
        payload,
        attempts: attempt,
        idempotencyKey
      };
    }
    
    // Erros 5xx ou timeouts - tentar novamente
    if (attempt < CONFIG.MAX_RETRIES) {
      const delay = CONFIG.RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
      console.log(`⚠️  [${payload.tipo.toUpperCase()}] "${payload.titulo}" falhou (tentativa ${attempt}/${CONFIG.MAX_RETRIES}), tentando novamente em ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return createProduct(client, imobiliariaId, payload, idempotencyKey, attempt + 1);
    }
    
    // Esgotadas as tentativas
    const errorMessage = statusCode ? `HTTP ${statusCode}` : axiosError.message;
    console.log(`💥 [${payload.tipo.toUpperCase()}] "${payload.titulo}" falhou definitivamente após ${attempt} tentativas: ${errorMessage}`);
    
    return {
      success: false,
      error: errorMessage,
      statusCode,
      payload,
      attempts: attempt,
      idempotencyKey
    };
  }
}

// ============================================================================
// CONTROLE DE CONCORRÊNCIA
// ============================================================================

async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrencyLimit: number
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += concurrencyLimit) {
    const batch = items.slice(i, i + concurrencyLimit);
    const batchPromises = batch.map(processor);
    const batchResults = await Promise.allSettled(batchPromises);
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('❌ Erro inesperado no processamento:', result.reason);
        // Criar um resultado de erro para manter a consistência
        results.push({
          success: false,
          error: 'Erro inesperado no processamento',
          payload: {} as any,
          attempts: 1,
          idempotencyKey: 'unknown'
        } as R);
      }
    }
    
    // Log de progresso
    const processed = Math.min(i + concurrencyLimit, items.length);
    console.log(`📊 Progresso: ${processed}/${items.length} itens processados`);
  }
  
  return results;
}

// ============================================================================
// VERIFICAÇÃO PÓS-CRIAÇÃO
// ============================================================================

async function verifyCreatedProducts(
  client: AxiosInstance,
  imobiliariaId: string,
  createdIds: string[]
): Promise<void> {
  console.log('\n🔍 Verificando produtos criados...');
  
  const types = ['imovel', 'terreno', 'empreendimento'];
  
  for (const type of types) {
    try {
      const response = await client.get(
        `/v1/tenants/${imobiliariaId}/products?type=${type}&limit=100`
      );
      
      const products = response.data?.data || response.data || [];
      const seedProducts = products.filter((p: any) => 
        p.titulo?.includes(SEED_PREFIX) || p.title?.includes(SEED_PREFIX)
      );
      
      console.log(`📋 ${type.toUpperCase()}: ${seedProducts.length} produtos encontrados com prefixo ${SEED_PREFIX}`);
      
      if (seedProducts.length < CONFIG.ITEMS_PER_TYPE) {
        console.log(`⚠️  Esperado: ${CONFIG.ITEMS_PER_TYPE}, Encontrado: ${seedProducts.length}`);
      }
      
    } catch (error) {
      console.error(`❌ Erro ao verificar produtos do tipo ${type}:`, error);
    }
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

async function main(): Promise<void> {
  console.log('🚀 Iniciando seed de produtos imobiliários...');
  console.log(`📊 Configuração:`);
  console.log(`   - Base URL: ${CONFIG.BASE_URL}`);
  console.log(`   - Imobiliária ID: ${CONFIG.IMOBILIARIA_ID}`);
  console.log(`   - Itens por tipo: ${CONFIG.ITEMS_PER_TYPE}`);
  console.log(`   - Concorrência: ${CONFIG.CONCURRENCY_LIMIT}`);
  console.log(`   - Max tentativas: ${CONFIG.MAX_RETRIES}`);
  console.log(`   - Prefixo: ${SEED_PREFIX}`);
  console.log('');
  
  // Vali