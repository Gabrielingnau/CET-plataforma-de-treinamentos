# KyDora 🚀

Uma plataforma completa de gestão e treinamento corporativo que conecta empresas, colaboradores e administratores em um único ecossistema. KyDora oferece ferramentas robustas para criação de cursos, gerenciamento de certificados, acompanhamento de progresso e realização de avaliações.

## 📋 Sobre o Projeto

KyDora é uma solução enterprise para:

- **Gestão de Treinamentos**: Criação e administração de cursos estruturados com módulos e aulas
- **Certificação Profissional**: Geração automática de certificados com validação
- **Avaliações Interativas**: Sistema de quizzes e questões para acompanhar o conhecimento
- **Controle de Progresso**: Dashboard inteligente com métricas de desempenho
- **Gestão de Equipes**: Administração de colaboradores, empresas e permissões de acesso
- **Temas Personalizáveis**: Suporte a modo claro/escuro e customização visual

O projeto foi desenvolvido com foco em **escalabilidade**, **segurança** e **experiência de usuário**, utilizando as tecnologias mais modernas do ecossistema React.

## 🛠️ Tecnologias

- **[Next.js 16](https://nextjs.org)** - Framework React meta-framework com SSR, SSG e API Routes para aplicações web de alta performance
- **[React 19](https://react.dev)** - Biblioteca JavaScript para construção de interfaces interativas com componentes reutilizáveis
- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática para maior segurança e melhor experiência de desenvolvimento
- **[Tailwind CSS 4](https://tailwindcss.com)** - Framework CSS utilitário para estilização rápida e consistente
- **[Shadcn/UI](https://ui.shadcn.com)** - Componentes modernos, acessíveis e customizáveis construídos com Radix UI
- **[Supabase](https://supabase.com)** - Backend as a Service com autenticação, banco de dados PostgreSQL e storage em tempo real
- **[React Query (TanStack Query)](https://tanstack.com/query/latest)** - Gerenciamento de estado de dados remotos com cache inteligente e sincronização
- **[React Hook Form](https://react-hook-form.com)** - Biblioteca leve para validação e gerenciamento de formulários
- **[Framer Motion](https://www.framer.com/motion)** - Biblioteca de animações para criar interfaces dinâmicas e fluidas
- **[Recharts](https://recharts.org)** - Componentes de gráficos compostos para visualização de dados
- **[PDF Lib & jsPDF](https://pdfjs.express/)** - Geração e manipulação de documentos PDF para certificados
- **[Lucide React](https://lucide.dev)** - Conjunto de ícones SVG limpos e consistentes
- **[Kbar](https://kbar.vercel.app)** - Barra de comandos (Command Palette) para navegação rápida
- **[Axios](https://axios-http.com)** - Cliente HTTP para requisições API
- **[Date-fns](https://date-fns.org)** - Manipulação e formatação de datas
- **[Sonner](https://sonner.emilkowal.ski)** - Notificações toast modernas e acessíveis

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) ou npm
- [Git](https://git-scm.com/)
- Conta no [Supabase](https://supabase.com) para variáveis de ambiente

### 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Gabrielingnau/KyDora-plataforma-de-treinamentos.git
cd KyDora
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_supabase
```

4. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
KyDora/
├── app/                    # Aplicação Next.js (App Router)
│   ├── (auth)/            # Rotas de autenticação (login, reset-senha)
│   ├── (plataforma)/      # Rotas da plataforma principal
│   │   ├── (admin)/       # Painel administrativo
│   │   ├── (colaborador)/ # Área do colaborador
│   │   └── (empresa)/     # Gestão empresarial
│   ├── api/               # Rotas API
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (botões, inputs, etc)
│   ├── layout/           # Componentes de layout (header, sidebar)
│   ├── kbar/             # Barra de comandos
│   └── shared/           # Componentes compartilhados
├── hooks/                # React Hooks customizados
│   ├── auth/             # Hooks de autenticação
│   ├── companies/        # Hooks de gestão empresarial
│   ├── certificates/     # Hooks de certificados
│   └── ...               # Outros domínios
├── services/             # Serviços e chamadas API
├── contexts/             # Contextos React
├── providers/            # Provedores de estado
├── lib/                  # Utilitários e funções auxiliares
├── types/                # Tipos TypeScript compartilhados
└── supabase/             # Configuração do Supabase
```

## 🔧 Scripts Disponíveis

```bash
pnpm dev          # Inicia o servidor de desenvolvimento com Turbopack
pnpm build        # Cria a build de produção
pnpm start        # Inicia o servidor de produção
pnpm lint         # Verifica o código com ESLint
pnpm format       # Formata o código com Prettier
pnpm typecheck    # Valida tipos TypeScript
```

## 🎯 Funcionalidades Principais

✅ Autenticação segura com Supabase  
✅ Gestão multi-tenant (Admin, Colaborador, Empresa)  
✅ Criação e gerenciamento de cursos e módulos  
✅ Sistema de questões e quizzes interativos  
✅ Geração automática de certificados em PDF  
✅ Dashboard com gráficos e métricas de progresso  
✅ Tema escuro/claro com persistência  
✅ Comando Palette (Kbar) para navegação rápida  
✅ Responsivo e otimizado para mobile  
✅ Performance otimizada com Next.js 16 e Turbopack

---

⌨️ com ❤️ por [Gabriel Lingnau](https://www.linkedin.com/in/gabriel-lingnau-3bb17b266/)
