# 💰 Easynizze - Controle Financeiro

<div align="center">

![Easynizze Banner](https://img.shields.io/badge/Easynizze-Controle%20Financeiro-00C853?style=for-the-badge)

[![Live Demo](https://img.shields.io/badge/demo-live-00C853?style=flat&logo=vercel)](https://easynizze.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Simplifique o controle das suas finanças pessoais com inteligência e praticidade**

[🚀 Ver Demo](https://easynizze.vercel.app) • [🐛 Reportar Bug](https://github.com/JohnSilva98/mywallet/issues) • [💡 Sugerir Feature](https://github.com/JohnSilva98/mywallet/issues)

</div>

---

## 📖 Sobre o Projeto

**Easynizze** é uma aplicação web moderna e intuitiva para gerenciamento de finanças pessoais, desenvolvida com foco em simplicidade e eficiência. Controle suas receitas, despesas e acompanhe a saúde financeira de forma visual e prática.

### 🎯 Objetivo

Facilitar o controle financeiro pessoal através de uma interface limpa e responsiva, permitindo que qualquer pessoa possa organizar suas finanças sem complicação.

### ✨ Principais Funcionalidades

- 💸 **Registro de Transações** - Adicione receitas e despesas rapidamente
- 📊 **Dashboard Interativo** - Visualize seu saldo e movimentações em tempo real
- 🏷️ **Categorização** - Organize suas transações por categorias personalizáveis
- 📅 **Histórico Completo** - Acesse todo o histórico de movimentações financeiras
- 📱 **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Performance Otimizada** - Carregamento rápido e navegação fluida
- 🎨 **Interface Moderna** - Design limpo e intuitivo para melhor experiência
- 💾 **Persistência de Dados** - Seus dados ficam salvos com segurança

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

### Frontend
- **[Next.js 14+](https://nextjs.org/)** - Framework React com Server-Side Rendering
- **[React](https://reactjs.org/)** - Biblioteca JavaScript para construção de interfaces
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário para estilização rápida
- **[Geist Font](https://vercel.com/font)** - Tipografia moderna da Vercel

### Backend & Database
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js e TypeScript
- **Database** - Banco de dados relacional (PostgreSQL/MySQL)

### Deploy & DevOps
- **[Vercel](https://vercel.com/)** - Plataforma de deploy com CI/CD automático
- **[Git](https://git-scm.com/)** - Controle de versão

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** 18.x ou superior
- **npm**, **yarn**, **pnpm** ou **bun** (gerenciador de pacotes)
- **Git** para clonar o repositório
- Banco de dados (PostgreSQL, MySQL ou SQLite para desenvolvimento)

## 🚀 Como Executar o Projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/JohnSilva98/mywallet.git
cd mywallet
```

### 2️⃣ Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="sua-connection-string-aqui"

# Next Auth (se aplicável)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-secret-key"
```

### 4️⃣ Configure o banco de dados

Execute as migrações do Prisma:

```bash
npx prisma generate
npx prisma db push
# ou para rodar migrações
npx prisma migrate dev
```

### 5️⃣ Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver a aplicação rodando! 🎉

## 📁 Estrutura de Diretórios

```
easynizze/
│
├── prisma/
│   ├── schema.prisma          # Modelo do banco de dados
│   └── migrations/            # Migrações do banco
│
├── public/
│   └── assets/                # Imagens e arquivos estáticos
│
├── src/
│   ├── app/                   # Rotas e páginas (App Router do Next.js)
│   │   ├── layout.js          # Layout principal
│   │   ├── page.js            # Página inicial
│   │   └── api/               # API Routes
│   │
│   ├── components/            # Componentes React reutilizáveis
│   │   ├── Transaction/       # Componentes de transações
│   │   ├── Dashboard/         # Componentes do dashboard
│   │   └── UI/                # Componentes de interface
│   │
│   ├── lib/                   # Utilitários e configurações
│   │   ├── prisma.js          # Cliente Prisma
│   │   └── utils.js           # Funções auxiliares
│   │
│   └── styles/                # Estilos globais
│       └── globals.css        # CSS global
│
├── .env.local                 # Variáveis de ambiente (não commitado)
├── .gitignore                 # Arquivos ignorados pelo Git
├── eslint.config.mjs          # Configuração do ESLint
├── next.config.mjs            # Configuração do Next.js
├── package.json               # Dependências do projeto
├── postcss.config.mjs         # Configuração do PostCSS
├── tailwind.config.js         # Configuração do Tailwind CSS
└── README.md                  # Documentação do projeto
```

## 🎨 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa o linter
npm run format       # Formata o código

# Database
npx prisma studio    # Abre interface visual do banco
npx prisma generate  # Gera o Prisma Client
npx prisma migrate   # Gerencia migrações
```

## 🚢 Deploy em Produção

### Deploy na Vercel (Recomendado)

A forma mais fácil de fazer deploy é usando a Vercel:

1. Faça push do código para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com/new)
3. Configure as variáveis de ambiente
4. Deploy automático! ✨

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JohnSilva98/mywallet)

### Outras Plataformas

O projeto também pode ser deployado em:
- **Railway** - Deploy com banco de dados incluso
- **Netlify** - Alternativa à Vercel
- **DigitalOcean App Platform** - Deploy em containers

## 📚 Documentação e Recursos

- [📖 Documentação Next.js](https://nextjs.org/docs)
- [📖 Documentação Prisma](https://www.prisma.io/docs)
- [📖 Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [🎓 Tutorial Next.js](https://nextjs.org/learn)

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Para contribuir:

1. Faça um **Fork** do projeto
2. Crie uma **Branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Faça **Push** para a Branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### 💡 Ideias de Contribuição

- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 📝 Melhorar a documentação
- 🎨 Aprimorar a interface
- ⚡ Otimizar performance

## 🐛 Reportar Problemas

Encontrou um bug? [Abra uma issue](https://github.com/JohnSilva98/mywallet/issues) descrevendo:
- O que aconteceu
- O que você esperava
- Passos para reproduzir
- Screenshots (se aplicável)

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/JohnSilva98">
        <img src="https://github.com/JohnSilva98.png" width="100px;" alt="Jonathan Silva"/><br>
        <sub>
          <b>Jonathan Silva</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

### Contato

- 🌐 Website: [easynizze.vercel.app](https://easynizze.vercel.app)
- 💼 GitHub: [@JohnSilva98](https://github.com/JohnSilva98)

## ⭐ Mostre seu apoio

Se este projeto te ajudou de alguma forma, considere dar uma ⭐️ no repositório!

---

<div align="center">
  
**[⬆ Voltar ao topo](#-easynizze---controle-financeiro)**

Desenvolvido com 💚 por [Jonathan Silva](https://github.com/JohnSilva98)

</div>