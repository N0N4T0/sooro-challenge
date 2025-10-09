# IMC Tracker - Frontend

Sistema de acompanhamento de avaliações de IMC desenvolvido com Next.js, TailwindCSS e Chakra UI.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **Chakra UI v3** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **React Query (TanStack Query)** - Gerenciamento de estado servidor
- **Axios** - Cliente HTTP
- **Zod** - Validação de schemas

## 📋 Funcionalidades

- ✅ **Autenticação de usuários** (login/cadastro)
- ✅ **Dashboard do usuário** com informações pessoais
- ✅ **Busca de avaliações IMC** em tempo real
- ✅ **Visualização de dados** com cards informativos
- ✅ **Responsividade** para dispositivos móveis
- ✅ **Validação de formulários** com feedback visual

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun

### 1. Instalar dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL da API do backend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Executar o projeto

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.


## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Login**: `/login` - Formulário de entrada
- **Cadastro**: `/register` - Formulário de registro
- **Dashboard**: `/dashboard` - Área protegida do usuário

### Fluxo de Autenticação

1. Usuário faz login/cadastro
2. Token JWT é armazenado no localStorage
3. Token é enviado automaticamente nas requisições
4. Redirecionamento automático baseado no status de autenticação

## 📊 Funcionalidades do Dashboard

### Informações do Usuário
- Nome completo
- Email
- Data de cadastro

### Busca de Avaliações IMC
- **Pesquisa em tempo real** por qualquer campo
- **Visualização em cards** com:
  - Valor do IMC calculado
  - Classificação com cores (Normal, Sobrepeso, etc.)
  - Peso e altura
  - Data da avaliação
- **Estados de loading** e mensagens informativas

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar versão de produção
npm run start

# Linting
npm run lint
```
## 🤝 Integração com Backend

Este frontend foi desenvolvido para integrar com a API backend localizada em `../backend`. Certifique-se de que o backend esteja rodando na porta 5000 ou ajuste a variável `NEXT_PUBLIC_API_URL` conforme necessário.
