# Configuração do Supabase - Doc Basico

## 📋 Passo a Passo

### 1. Variáveis de Ambiente

As variáveis já estão configuradas no arquivo `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### 2. Executar Schema SQL

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo `supabase/schema.sql`
4. Execute o script

Isso criará:
- ✅ Tabelas (posts, categories, services, contact_submissions)
- ✅ Índices para performance
- ✅ Triggers para updated_at automático
- ✅ Row Level Security (RLS) policies
- ✅ Categorias padrão

### 3. Configurar Storage (Opcional - para imagens)

1. No Supabase Dashboard, vá em **Storage**
2. Crie um bucket chamado `post-images`
3. Configure as políticas:
   - **Public Access**: Habilitado para leitura
   - **Upload**: Apenas autenticados

### 4. Criar Usuário Admin

1. No Supabase Dashboard, vá em **Authentication**
2. Clique em **Add User** ou **Invite User**
3. Crie um usuário com email e senha
4. Anote o email - será usado para login no dashboard admin

### 5. Testar Conexão

Após executar o schema, você pode testar a conexão rodando:

```bash
npm run dev
```

O projeto deve conectar ao Supabase sem erros.

## 🔐 Segurança

- Row Level Security (RLS) está habilitado
- Posts publicados são visíveis publicamente
- Apenas usuários autenticados podem criar/editar posts (será implementado no dashboard)
- Contact submissions podem ser criados por qualquer pessoa (público)

## 📊 Estrutura das Tabelas

### posts
- Armazena notícias/blog posts
- Campos: title, slug, content, published, published_at, scheduled_at
- Relacionamento com categories

### categories
- Categorias de posts (AIMA, IRS, Finanças, etc.)
- Campos: name, slug, description

### services
- Serviços oferecidos (pode ser usado no futuro)
- Campos: name, slug, description, price, features

### contact_submissions
- Submissões do formulário de contato
- Campos: name, email, phone, service, message

## 🚀 Próximos Passos

Após configurar o banco:
1. ✅ Schema criado
2. ⏳ Dashboard admin (Fase 2)
3. ⏳ Sistema de autenticação
4. ⏳ CRUD de posts
5. ⏳ Upload de imagens

