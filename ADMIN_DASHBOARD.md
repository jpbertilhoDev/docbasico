# Dashboard Admin - Doc Basico

## 🎉 Status: Implementado

O dashboard admin completo foi criado e está pronto para uso!

## ✅ Funcionalidades Implementadas

### 1. Autenticação
- ✅ Login com email/senha (Supabase Auth)
- ✅ Proteção de rotas admin
- ✅ Logout
- ✅ Verificação de sessão

### 2. Dashboard Principal
- ✅ Estatísticas (total, publicados, agendados, rascunhos)
- ✅ Lista de posts recentes
- ✅ Navegação lateral responsiva

### 3. Gerenciamento de Posts
- ✅ Lista todos os posts com filtros
- ✅ Busca de posts
- ✅ Filtros por status (Todos, Publicados, Agendados, Rascunhos)
- ✅ Criar novo post
- ✅ Editar post existente
- ✅ Excluir post
- ✅ Visualizar post no site

### 4. Editor Rich Text
- ✅ Editor completo com React Quill
- ✅ Formatação de texto (negrito, itálico, etc.)
- ✅ Listas ordenadas e não ordenadas
- ✅ Links e imagens
- ✅ Cores e alinhamento

### 5. Sistema de Agendamento
- ✅ Agendar publicação futura
- ✅ Publicar imediatamente
- ✅ Definir data de publicação

### 6. Campos do Post
- ✅ Título
- ✅ Slug (gerado automaticamente)
- ✅ Categoria
- ✅ Resumo (Excerpt)
- ✅ URL da imagem destacada
- ✅ Conteúdo (rich text)
- ✅ Status de publicação
- ✅ Data de publicação/agendamento

## 🚀 Como Usar

### 1. Configurar Autenticação no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Authentication** > **Users**
3. Clique em **Add User** ou **Invite User**
4. Crie um usuário com email e senha
5. Anote as credenciais - serão usadas para login

### 2. Configurar RLS Policies

Execute o arquivo `supabase/rls-policies.sql` no SQL Editor do Supabase:

1. Acesse **SQL Editor** no Supabase
2. Abra o arquivo `supabase/rls-policies.sql`
3. Copie e cole o conteúdo
4. Execute o script

Isso permitirá que usuários autenticados gerenciem posts.

### 3. Acessar o Dashboard

1. Acesse: `http://localhost:3000/admin/login`
2. Faça login com as credenciais criadas
3. Você será redirecionado para `/admin`

### 4. Criar um Post

1. No dashboard, clique em **Posts** no menu lateral
2. Clique em **Novo Post**
3. Preencha os campos:
   - **Título**: O título do post
   - **Slug**: Gerado automaticamente (pode editar)
   - **Categoria**: Selecione uma categoria
   - **Resumo**: Breve descrição
   - **Imagem**: URL da imagem destacada
   - **Conteúdo**: Use o editor rich text
4. Escolha:
   - **Publicar imediatamente**: Marque se quiser publicar agora
   - **Agendar**: Defina data/hora futura
5. Clique em **Salvar Post**

### 5. Editar um Post

1. Na lista de posts, clique no ícone de editar
2. Faça as alterações necessárias
3. Clique em **Salvar Alterações**

### 6. Excluir um Post

1. Na lista de posts, clique no ícone de excluir
2. Confirme a exclusão
3. O post será removido permanentemente

## 📁 Estrutura de Arquivos

```
app/admin/
├── layout.tsx              # Layout do dashboard (sidebar, header)
├── login/page.tsx          # Página de login
├── page.tsx                # Dashboard principal
└── posts/
    ├── page.tsx            # Lista de posts
    ├── new/page.tsx        # Criar novo post
    └── [id]/page.tsx       # Editar post

components/
└── Editor.tsx              # Editor rich text (React Quill)

app/api/admin/
└── posts/
    ├── route.ts            # GET (listar) e POST (criar)
    └── [id]/route.ts       # GET, PUT (editar), DELETE
```

## 🔐 Segurança

- ✅ Autenticação obrigatória
- ✅ Rotas protegidas
- ✅ Row Level Security (RLS) configurado
- ✅ Apenas usuários autenticados podem gerenciar posts

## 🎨 Interface

- ✅ Design moderno e responsivo
- ✅ Menu lateral colapsável (mobile)
- ✅ Tabela de posts com ações rápidas
- ✅ Editor rich text intuitivo
- ✅ Feedback visual em todas as ações

## 📝 Próximas Melhorias (Opcional)

- [ ] Upload de imagens direto no editor
- [ ] Preview do post antes de publicar
- [ ] Estatísticas de visualizações
- [ ] Gerenciamento de categorias (criar/editar/excluir)
- [ ] Editor de imagens
- [ ] Histórico de versões

## 🐛 Troubleshooting

### Não consigo fazer login
- Verifique se o usuário foi criado no Supabase
- Verifique se as credenciais estão corretas
- Verifique o console do navegador para erros

### Posts não aparecem
- Verifique se as políticas RLS foram executadas
- Verifique se está autenticado
- Verifique o console do navegador

### Editor não funciona
- Verifique se `react-quill` foi instalado: `npm install`
- Limpe o cache do navegador
- Verifique o console para erros

---

**Última atualização**: 06/01/2026

