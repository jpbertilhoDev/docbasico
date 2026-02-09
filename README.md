# Doc Basico

Plataforma moderna de serviços burocráticos e consultoria para imigrantes em Portugal.

## 🚀 Tecnologias

- **Next.js 14+** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Backend (PostgreSQL + Auth + Storage)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 📁 Estrutura do Projeto

```
docbasico/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Homepage
│   ├── noticias/          # Blog/Notícias
│   ├── servicos/          # Páginas de serviços
│   ├── sobre/             # Sobre
│   ├── contato/           # Contato
│   └── admin/             # Dashboard admin
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes UI base
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                   # Utilitários
├── public/               # Assets estáticos
└── styles/               # Estilos globais
```

## 🎨 Design System

- **Cores Primárias**: Azul institucional (#1E40AF)
- **Cores Secundárias**: Verde (#059669)
- **Fontes**: Inter (corpo), Poppins (títulos)

## 📝 Documentação

Veja [REQUIREMENTS.md](./REQUIREMENTS.md) para requisitos completos do projeto.

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📄 Licença

Proprietário - Doc Basico

