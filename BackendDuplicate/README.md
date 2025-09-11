# Backend Duplicate - Node.js API

Backend Node.js moderno construído com TypeScript seguindo as melhores práticas de mercado.

## 🚀 Características

- **TypeScript** - Tipagem estática para maior segurança
- **Express.js** - Framework web rápido e minimalista
- **JWT Authentication** - Autenticação segura com tokens
- **Zod Validation** - Validação robusta de dados
- **Winston Logging** - Sistema de logs estruturado
- **Security Middlewares** - Helmet, CORS, Rate Limiting
- **Error Handling** - Tratamento centralizado de erros
- **ESLint + Prettier** - Qualidade e formatação de código
- **Graceful Shutdown** - Encerramento seguro da aplicação

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações (env, logger)
├── controllers/     # Controladores das rotas
├── middleware/      # Middlewares customizados
├── models/          # Modelos de dados
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Utilitários e helpers
└── app.ts           # Aplicação principal
```

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd BackendDuplicate
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📜 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Compila o TypeScript
npm start            # Executa a versão compilada
npm run lint         # Executa o linter
npm run lint:fix     # Corrige problemas do linter
npm run format       # Formata o código com Prettier
npm run type-check   # Verifica tipos TypeScript
npm run clean        # Remove arquivos compilados
```

## 🔗 Endpoints da API

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/login` | Login do usuário | ❌ |
| POST | `/register` | Registro de usuário | ❌ |
| POST | `/refresh-token` | Renovar token | ❌ |
| POST | `/logout` | Logout do usuário | ✅ |
| GET | `/profile` | Obter perfil | ✅ |
| PUT | `/profile` | Atualizar perfil | ✅ |
| PUT | `/change-password` | Alterar senha | ✅ |

### Usuários (`/api/users`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/` | Listar usuários | ✅ | Admin |
| POST | `/` | Criar usuário | ✅ | Admin |
| GET | `/:id` | Obter usuário | ✅ | Owner/Admin |
| PUT | `/:id` | Atualizar usuário | ✅ | Owner/Admin |
| DELETE | `/:id` | Deletar usuário | ✅ | Admin |
| GET | `/search` | Buscar usuários | ✅ | Admin/Mod |
| GET | `/stats` | Estatísticas | ✅ | Admin |

### Utilitários (`/api`)

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/health` | Status da API |
| GET | `/info` | Informações da API |
| GET | `/demo` | Exemplos de resposta |

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação:

1. **Login**: Envie `email` e `password` para `/api/auth/login`
2. **Token**: Receba `accessToken` e `refreshToken`
3. **Autorização**: Inclua o header `Authorization: Bearer <token>`
4. **Renovação**: Use `/api/auth/refresh-token` quando necessário

### Exemplo de Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## 👥 Roles e Permissões

- **USER**: Usuário comum (acesso limitado)
- **MODERATOR**: Moderador (pode buscar usuários)
- **ADMIN**: Administrador (acesso total)

## 📝 Validação de Dados

Todos os endpoints validam dados de entrada usando Zod:

```typescript
// Exemplo de schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});
```

## 🛡️ Segurança

- **Helmet**: Headers de segurança
- **CORS**: Controle de origem cruzada
- **Rate Limiting**: Limite de requisições
- **Input Sanitization**: Sanitização de entrada
- **JWT**: Tokens seguros
- **Password Hashing**: Senhas criptografadas

## 📊 Logs

Sistema de logs estruturado com Winston:

- **Desenvolvimento**: Logs coloridos no console
- **Produção**: Logs em arquivos JSON
- **Níveis**: error, warn, info, debug

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logs
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 🚀 Deploy

### Produção

1. **Build da aplicação**
   ```bash
   npm run build
   ```

2. **Configure variáveis de produção**
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your-production-secret
   ```

3. **Execute**
   ```bash
   npm start
   ```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testes

Para adicionar testes, instale Jest:

```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

## 📈 Monitoramento

- **Health Check**: `/api/health`
- **Logs**: Winston com diferentes níveis
- **Error Tracking**: Logs estruturados de erros
- **Performance**: Logs de tempo de resposta

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 🆘 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.

---

**Desenvolvido com ❤️ usando Node.js + TypeScript**