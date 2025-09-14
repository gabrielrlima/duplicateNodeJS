# Scripts de Seeding

Este diretório contém scripts para popular o banco de dados com dados de teste.

## Script de Produtos de Teste

### `seed-test-products.ts`

Este script cria 30 produtos de teste (10 de cada tipo) para facilitar o desenvolvimento e testes:

- **10 Imóveis** (casas e apartamentos)
- **10 Terrenos**
- **10 Empreendimentos comerciais**

### Como usar

#### 1. Pré-requisitos

Antes de executar o script, você precisa:

1. **Estar autenticado no sistema**
2. **Ter uma imobiliária cadastrada**
3. **Configurar o token de API**

#### 2. Configurar o Token de API

Você precisa obter um token de autenticação válido. Existem algumas formas:

**Opção A: Via Browser (Recomendado)**
1. Faça login no sistema via browser
2. Abra as ferramentas de desenvolvedor (F12)
3. Vá para Application/Storage > Session Storage
4. Copie o valor de `sanctum_access_token`

**Opção B: Via arquivo .env**
1. Crie/edite o arquivo `.env` na raiz do projeto
2. Adicione: `API_TOKEN=seu_token_aqui`

**Opção C: Via variável de ambiente**
```bash
export API_TOKEN="seu_token_aqui"
```

#### 3. Instalar dependências

```bash
# Instalar tsx e dotenv se ainda não estiverem instalados
npm install
```

#### 4. Executar o script

```bash
# Comando principal
npm run seed:products

# Ou diretamente com tsx
npx tsx scripts/seed-test-products.ts

# Para ver ajuda
npm run seed:help
```

### Dados Gerados

O script gera dados realistas brasileiros:

#### Imóveis (Casas e Apartamentos)
- Variação de 1-5 quartos
- 1-4 banheiros
- Áreas de 50-300m²
- Preços baseados no mercado brasileiro (R$ 3.000-12.000/m²)
- Comodidades variadas (piscina, academia, etc.)
- Endereços de cidades reais (SP, RJ, MG, PR, RS)

#### Terrenos
- Áreas de 200-2.000m²
- Preços de R$ 500-3.000/m²
- Documentação em dia
- Localizações variadas

#### Empreendimentos Comerciais
- Lojas, escritórios, galpões, salas comerciais
- Áreas de 100-1.000m²
- Preços de R$ 4.000-15.000/m²
- Infraestrutura comercial completa

### Características dos Dados

- **Endereços reais**: Cidades e bairros brasileiros
- **Preços realistas**: Baseados no mercado imobiliário brasileiro
- **Variação**: Cada execução gera dados diferentes
- **Comodidades**: Seleção aleatória de amenidades
- **Documentação**: Todos os campos obrigatórios preenchidos

### Logs e Monitoramento

O script fornece logs detalhados:

```
🚀 Iniciando criação de produtos de teste...
🔍 Buscando imobiliárias do usuário...
✅ Imobiliária encontrada: 60f7b3c4d5e6f7g8h9i0j1k2

🏠 Criando 10 imóveis (casas e apartamentos)...
📤 Criando: Apartamento 2 quartos - 85m²
✅ Criado com sucesso: Apartamento 2 quartos - 85m²

📊 RESUMO DA CRIAÇÃO:
✅ Produtos criados com sucesso: 30
❌ Produtos com erro: 0
📈 Total processado: 30
```

### Tratamento de Erros

O script trata diversos tipos de erro:

- **Token inválido ou expirado**
- **Imobiliária não encontrada**
- **Dados inválidos**
- **Problemas de conexão**
- **Erros de validação do backend**

### Configurações Avançadas

Você pode modificar o script para:

- Alterar a quantidade de produtos por tipo
- Modificar os ranges de preços
- Adicionar novas cidades/bairros
- Customizar as comodidades
- Ajustar os tipos de propriedades

### Troubleshooting

#### Erro: "Token de API não encontrado"
- Verifique se o token está configurado corretamente
- Certifique-se de que o token não expirou

#### Erro: "Nenhuma imobiliária encontrada"
- Faça login no sistema
- Cadastre pelo menos uma imobiliária
- Verifique se o token pertence ao usuário correto

#### Erro: "Dados inválidos"
- Verifique se o backend está rodando
- Confirme se a API está acessível
- Verifique os logs do backend para mais detalhes

### Limpeza

Para remover os dados de teste, use a interface do sistema ou acesse diretamente o banco de dados.

---

**Nota**: Este script é destinado apenas para desenvolvimento e testes. Não execute em ambiente de produção sem revisar os dados gerados.