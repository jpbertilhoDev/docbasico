# 🔐 Como Acessar o Dashboard Admin

## ⚠️ **IMPORTANTE: Você precisa criar um usuário primeiro!**

O sistema **NÃO tem senha padrão**. Você precisa criar um usuário administrativo no Supabase antes de fazer login.

---

## 📝 **Passo a Passo para Configurar o Acesso**

### **1. Acessar o Supabase Dashboard**

1. Vá para: https://supabase.com/dashboard
2. Faça login com sua conta Supabase
3. Selecione o projeto **Doc Basico**

---

### **2. Criar Usuário Administrativo**

1. No menu lateral, clique em **Authentication** (ícone de cadeado)
2. Clique na aba **Users**
3. Clique no botão **Add User** (ou **Invite User**)
4. Preencha os dados:
   - **Email**: Seu email (ex: `admin@docbasico.pt`)
   - **Password**: Sua senha (ex: `Admin@2026`)
   - **Auto Confirm User**: ✅ Marque esta opção
5. Clique em **Create User** ou **Send Invitation**

**📝 Anote estas credenciais! Você vai precisar delas para fazer login.**

---

### **3. Acessar o Dashboard Admin**

Agora que você tem um usuário criado:

1. **Certifique-se que o servidor está rodando**:
   ```bash
   npm run dev
   ```

2. **Acesse a página de login**:
   ```
   http://localhost:3000/admin/login
   ```

3. **Faça login com as credenciais que você criou**:
   - Email: `admin@docbasico.pt` (ou o email que você usou)
   - Senha: `Admin@2026` (ou a senha que você definiu)

4. **Clique em "Entrar"**

5. Você será redirecionado para o dashboard: `/admin`

---

## 🎯 **Rotas do Dashboard**

Após fazer login, você terá acesso a:

| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard principal (estatísticas) |
| `/admin/posts` | Gerenciar notícias/posts |
| `/admin/posts/new` | Criar nova notícia |
| `/admin/posts/[id]` | Editar notícia existente |
| `/admin/categories` | Gerenciar categorias |
| `/admin/appointments` | Ver agendamentos |
| `/admin/settings` | Configurações |

---

## 🔒 **Sistema de Autenticação**

### **Como funciona?**

- O sistema usa **Supabase Auth**
- Sessão é mantida via cookies seguros
- Logout limpa a sessão
- Rotas `/admin/*` são protegidas automaticamente
- Se não estiver logado, você é redirecionado para `/admin/login`

### **Política de Segurança (RLS)**

- Usuários autenticados podem criar/editar posts
- Leitores públicos (site) só veem posts publicados
- Contact submissions são criados por visitantes sem autenticação

---

## 🚨 **Troubleshooting**

### **❌ "Email not confirmed"**

**Solução:**
1. Volte ao Supabase Dashboard → Authentication → Users
2. Encontre seu usuário
3. Clique nos **3 pontinhos** ao lado
4. Escolha **Confirm Email**
5. Tente fazer login novamente

---

### **❌ "Invalid credentials" ou "Email or password incorrect"**

**Soluções:**
1. Verifique se digitou o email e senha corretamente
2. Verifique se o usuário existe no Supabase
3. Tente redefinir a senha:
   - No Supabase: Authentication → Users → (seu usuário) → Reset Password

---

### **❌ "User not found"**

**Solução:**
- Você precisa criar um usuário primeiro (veja Passo 2 acima)

---

### **❌ Tela de login trava ou não carrega**

**Soluções:**
1. Verifique se o servidor está rodando: `npm run dev`
2. Verifique o console do navegador (F12) para erros
3. Verifique se as variáveis de ambiente estão configuradas:
   ```bash
   # No .env.local deve ter:
   NEXT_PUBLIC_SUPABASE_URL=sua-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua-key
   ```
4. Limpe o cache do navegador (Ctrl+Shift+Delete)
5. Tente em uma aba anônima

---

### **❌ Após login, sou redirecionado de volta para o login**

**Solução:**
1. Verifique se as políticas RLS foram configuradas no Supabase
2. Execute o SQL do arquivo `supabase/rls-policies.sql`:
   - Supabase Dashboard → SQL Editor
   - Cole o conteúdo do arquivo
   - Execute
3. Tente fazer login novamente

---

## 📋 **Checklist de Configuração**

Antes de tentar fazer login, verifique:

- [ ] Projeto criado no Supabase
- [ ] Variáveis de ambiente configuradas (`.env.local`)
- [ ] Schema SQL executado (`supabase/schema.sql`)
- [ ] Políticas RLS executadas (`supabase/rls-policies.sql`)
- [ ] **Usuário admin criado no Supabase** ⬅️ **MAIS IMPORTANTE**
- [ ] Email do usuário confirmado
- [ ] Servidor Next.js rodando (`npm run dev`)

---

## 🔑 **Credenciais Recomendadas**

### **Para Desenvolvimento Local:**

- **Email**: `admin@docbasico.local`
- **Senha**: `Admin@DocBasico2026!`

### **Para Produção:**

- **Email**: Seu email real (ex: `seu@email.com`)
- **Senha**: Senha forte (mínimo 8 caracteres, letras, números, símbolos)

**⚠️ NUNCA compartilhe suas credenciais ou commite senhas no Git!**

---

## 🎓 **Criar Usuário via SQL (Alternativa)**

Se preferir criar o usuário via SQL:

1. Vá em Supabase → SQL Editor
2. Execute:

```sql
-- Criar usuário (ajuste email e senha)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@docbasico.pt', -- ⬅️ MUDE AQUI
  crypt('SuaSenhaSegura123!', gen_salt('bf')), -- ⬅️ MUDE AQUI
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

**⚠️ Nota**: Preferível usar a interface do Supabase (método 1)!

---

## 📞 **Ainda com problemas?**

### **Verificar logs do Supabase**

1. Supabase Dashboard → Logs → Auth Logs
2. Procure por erros relacionados ao seu email

### **Verificar console do navegador**

1. Abra o console (F12)
2. Vá para a aba "Console"
3. Procure por erros em vermelho
4. Copie a mensagem de erro

### **Criar novo usuário**

Se nada funcionar, delete o usuário antigo e crie um novo:

1. Supabase → Authentication → Users
2. Clique nos 3 pontinhos → Delete User
3. Crie um novo usuário seguindo o Passo 2

---

## ✅ **Resumo Rápido**

1. **Crie um usuário no Supabase** (Authentication → Users → Add User)
2. **Anote email e senha**
3. **Acesse**: `http://localhost:3000/admin/login`
4. **Faça login** com as credenciais
5. **Pronto!** Você está no dashboard `/admin`

---

## 🎉 **Exemplo de Sucesso**

Quando tudo estiver correto, você verá:

```
┌─────────────────────────────────────────────┐
│  Doc Basico Admin                           │
│  Faça login para acessar o painel           │
├─────────────────────────────────────────────┤
│  Email                                      │
│  [admin@docbasico.pt]                       │
│                                             │
│  Senha                                      │
│  [••••••••]                                 │
│                                             │
│  [       Entrar       ]                     │
│                                             │
│  ← Voltar para o site                       │
└─────────────────────────────────────────────┘
```

Após clicar em "Entrar", você será redirecionado para:

```
┌─────────────────────────────────────────────┐
│  Doc Basico Admin                           │
│                                             │
│  📊 Dashboard                               │
│  📝 Posts                                   │
│  📁 Categorias                              │
│  📅 Agendamentos                            │
│  ⚙️ Configurações                           │
│                                             │
│  Conectado como                             │
│  admin@docbasico.pt                         │
│  [Sair]                                     │
└─────────────────────────────────────────────┘
```

---

## 🔑 **Credenciais de Exemplo (NÃO use em produção)**

**Apenas para desenvolvimento/teste:**

| Email | Senha |
|-------|-------|
| `admin@test.com` | `Test123456!` |
| `admin@docbasico.local` | `DocBasico2026` |
| `dev@localhost` | `DevPassword123` |

**⚠️ Para produção, use credenciais únicas e seguras!**

---

**📅 Atualizado em**: 09/02/2026
