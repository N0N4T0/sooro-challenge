# IMC Tracker - Backend

API REST para sistema de acompanhamento de avaliações de IMC (Índice de Massa Corporal).

## 🚀 Tecnologias Utilizadas

- **Node.js 22+** - Runtime JavaScript
- **Express 5** - Framework web
- **TypeScript** - Tipagem estática
- **SQLite** (better-sqlite3) - Banco de dados
- **JWT** (jsonwebtoken) - Autenticação
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **CORS** - Configuração de origens permitidas

## 📋 Funcionalidades

- ✅ **Autenticação JWT** com refresh token
- ✅ **CRUD de usuários** com hash de senhas
- ✅ **Gerenciamento de avaliações IMC**
- ✅ **Cálculo automático de IMC** e classificação
- ✅ **Busca de avaliações** por nome ou usuário
- ✅ **Banco de dados SQLite** com inicialização automática
- ✅ **Validação de dados** com Zod
- ✅ **CORS configurado** para frontend

## 🛠️ Instalação e Configuração

### Pré-requisitos

- **Node.js 22.17.0 ou superior**
- npm, yarn ou pnpm

### 1. Instalar dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"

# Database Configuration (opcional)
# DB_PATH=./database/database.db
```

### 3. Executar o projeto

```bash
npm run dev
```

O servidor iniciará em **http://localhost:5000** e:
- ✅ Criará automaticamente o banco de dados SQLite
- ✅ Inicializará as tabelas necessárias
- ✅ Configurará o CORS para `localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── core/                          # Domínio e entidades
│   └── entities/                  # Entidades do domínio
├── infra/                         # Infraestrutura
│   ├── database/                  # Configuração do banco
│   │   ├── repositories/          # Repositórios
│   │   └── sqlite-connection.ts   # Conexão SQLite
│   ├── domain/                    # Controladores
│   │   └── imc/application/
│   │       └── controllers/       # Controllers da aplicação
│   └── factories/                 # Factories de dependências
├── routes/                        # Rotas da API
└── index.ts                       # Entry point
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação:

- **Token de acesso** (`token`): Expira em 1 hora
- **Refresh token**: Para renovar o token de acesso

### Headers de Autenticação

```
Authorization: Bearer <seu-token-jwt>
```

## 📊 Endpoints da API

### Autenticação

```http
POST /login
Content-Type: application/json

{
  "userName": "usuario",
  "password": "senha"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-here",
    "user": {
      "id": "uuid",
      "nome": "Nome do Usuário",
      "usuario": "usuario",
      "perfil": "ADMIN"
    }
  }
}
```

### Usuários

```http
GET /auth/user/:id
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "message": "Usuário encontrado",
  "data": {
    "id": "uuid",
    "nome": "Nome",
    "usuario": "usuario",
    "perfil": "ADMIN",
    "situacao": "ATIVO",
    "dt_inclusao": "2025-01-09T10:00:00.000Z",
    "exams": [...]
  }
}
```

### Avaliações IMC

```http
GET /auth/exam-imc/:nameOrUsername
Authorization: Bearer <token>
```

```http
POST /auth/exam-imc
Authorization: Bearer <token>
Content-Type: application/json

{
  "altura": 1.75,
  "peso": 70,
  "id_usuario_avaliacao": "uuid-avaliador"
}
```

## 🗄️ Banco de Dados

### SQLite

O projeto usa **SQLite** como banco de dados, armazenado em:
```
backend/database/database.db
```

### Collection

Disponível no projeto em api-collection.json

### Inicialização Automática

Ao executar `npm run dev`, o sistema:
1. Cria o diretório `database/` se não existir
2. Cria o arquivo `database.db`
3. Executa as migrations para criar as tabelas:
   - `usuarios` - Usuários do sistema
   - `avaliacoes_imc` - Avaliações de IMC
   - `tokens` - Tokens de autenticação

## 🔧 Configuração CORS

O CORS está configurado para aceitar requisições de:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

**Configuração atual:**
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

Para adicionar outras origens, edite o arquivo `src/index.ts`.

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm run start

# Executar testes
npm run test
```

## 🔒 Segurança

- **Senhas hasheadas** com bcrypt (salt rounds: 10)
- **JWT com expiração** configurável
- **Validação de entrada** com Zod
- **CORS restrito** a origens específicas
- **Tokens de sessão** armazenados no banco

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `JWT_SECRET` | Chave secreta para JWT | - |
| `DB_PATH` | Caminho do banco SQLite | `./database/database.db` |
| `PORT` | Porta do servidor | `5000` |

## 🤝 Integração com Frontend

Este backend foi desenvolvido para integrar com o frontend Next.js localizado em `../frontend`.

**Certifique-se de:**
1. Backend rodando na porta **5000**
2. Frontend configurado com `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. CORS habilitado para a origem do frontend

## 📦 Dependências Principais

- **express** - Framework web
- **better-sqlite3** - Driver SQLite
- **jsonwebtoken** - Autenticação JWT
- **bcryptjs** - Hash de senhas
- **zod** - Validação de schemas
- **cors** - Middleware CORS
- **dotenv** - Variáveis de ambiente

## 🐛 Troubleshooting

### Erro: "Database is locked"
- Feche outras conexões ao banco de dados
- Reinicie o servidor

### Erro: "CORS policy"
- Verifique se a origem do frontend está na lista de origens permitidas
- Confirme que o servidor está rodando na porta 5000

### Erro: "JWT malformed"
- Verifique se o token está sendo enviado corretamente no header
- Confirme que `JWT_SECRET` está configurado no `.env`

## 📄 Licença

ISC
