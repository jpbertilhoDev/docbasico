# Guia de Setup - Doc Basico

## 🚀 Instalação Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Rodar em Desenvolvimento

```bash
npm run dev
```

O site estará disponível em: http://localhost:3000

### 3. Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
docbasico/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Estilos globais
│   ├── servicos/                # Páginas de serviços
│   │   ├── page.tsx            # Lista de serviços
│   │   └── renovacao-residencia/
│   │       └── page.tsx        # Página individual
│   ├── noticias/                # Blog/Notícias
│   │   └── page.tsx            # Lista de notícias
│   ├── contato/                 # Contato
│   │   └── page.tsx
│   └── sobre/                   # Sobre
│       └── page.tsx
├── components/                  # Componentes reutilizáveis
│   ├── Header.tsx              # Cabeçalho
│   └── Footer.tsx              # Rodapé
├── lib/                        # Utilitários
│   └── utils.ts               # Funções auxiliares
├── public/                     # Assets estáticos
└── styles/                     # Estilos adicionais
```

## 🎨 Design System

### Cores
- **Primária**: Azul institucional (#1E40AF)
- **Secundária**: Verde (#059669)
- Configurado em `tailwind.config.ts`

### Fontes
- **Corpo**: Inter
- **Títulos**: Poppins
- Configurado em `app/layout.tsx`

## 📝 Próximos Passos (Fase 2 - Backend)

1. Configurar Supabase
   - Criar projeto no Supabase
   - Configurar banco de dados
   - Criar tabelas (posts, categories, services, contact_submissions)

2. Configurar Variáveis de Ambiente
   - Criar arquivo `.env.local`
   - Adicionar credenciais do Supabase

3. Implementar Dashboard Admin
   - Autenticação
   - CRUD de posts
   - Sistema de agendamento

4. Implementar Sistema de Notícias
   - Lista de posts
   - Posts individuais
   - Filtros e busca

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Produção
npm start
```

## 📚 Documentação

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Status Atual**: Fase 1 (Frontend) - ✅ Completo
**Próxima Fase**: Backend com Supabase

