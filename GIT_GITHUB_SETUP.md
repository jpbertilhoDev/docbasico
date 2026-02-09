# 🔧 CONFIGURAR GIT E GITHUB - Guia Completo

## ✅ **Status Atual**

- ✅ Git inicializado
- ✅ Commit realizado (058e6e8)
- ✅ Branch: master
- ❌ Remote (origin) NÃO configurado ← **PROBLEMA**

---

## 🎯 **Solução: Conectar ao GitHub**

### **PASSO 1: Criar Repositório no GitHub**

1. **Acesse:** https://github.com/new

2. **Preencha:**
   - **Repository name:** `docbasico` (ou outro nome)
   - **Description:** "Sistema de gestão para imigrantes em Portugal"
   - **Visibilidade:** 
     - ✅ **Private** (recomendado - código não fica público)
     - ⬜ Public (se quiser compartilhar)
   - ☐ **NÃO** marque "Add a README file"
   - ☐ **NÃO** marque ".gitignore"
   - ☐ **NÃO** marque "Choose a license"

3. **Clique em:** "Create repository"

4. **Copie a URL** que aparece (algo como):
   ```
   https://github.com/SEU-USUARIO/docbasico.git
   ```

---

### **PASSO 2: Conectar Repositório Local ao GitHub**

**Após criar o repositório no GitHub, execute:**

```bash
# Adicionar o remote (substitua SEU-USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU-USUARIO/docbasico.git

# Verificar se foi adicionado
git remote -v

# Deve aparecer:
# origin  https://github.com/SEU-USUARIO/docbasico.git (fetch)
# origin  https://github.com/SEU-USUARIO/docbasico.git (push)
```

---

### **PASSO 3: Fazer o Push**

```bash
# Fazer o push para o GitHub
git push -u origin master

# OU, se estiver usando 'main' como branch padrão:
# git branch -M main
# git push -u origin main
```

**Se pedir credenciais:**
- **Username:** Seu usuário do GitHub
- **Password:** **NÃO é sua senha!** É um **Personal Access Token**

---

### **PASSO 4: Criar Personal Access Token (se necessário)**

Se o GitHub pedir senha e não funcionar, você precisa criar um token:

1. **Acesse:** https://github.com/settings/tokens

2. **Clique em:** "Generate new token" → "Classic"

3. **Preencha:**
   - **Note:** "DocBasico Project"
   - **Expiration:** 90 days (ou No expiration)
   - **Scopes:** Marque:
     - ✅ repo (todos)
     - ✅ workflow

4. **Clique em:** "Generate token"

5. **COPIE O TOKEN** (aparece uma vez só!)
   - Exemplo: `ghp_aBc123DeF456...`

6. **Use o token como senha** quando o Git pedir:
   ```
   Username: seu-usuario
   Password: ghp_aBc123DeF456... (cole o token aqui)
   ```

---

## 🚀 **Comandos Completos (Resumo)**

```bash
# 1. Verificar status atual
git remote -v
git branch
git status

# 2. Adicionar remote (GitHub)
git remote add origin https://github.com/SEU-USUARIO/docbasico.git

# 3. Verificar se adicionou
git remote -v

# 4. Fazer push
git push -u origin master

# Se pedir credenciais, use:
# Username: seu-usuario
# Password: seu-token (ghp_...)
```

---

## 📋 **Método Alternativo: SSH**

Se preferir usar SSH (não precisa de token toda vez):

### **1. Gerar chave SSH**

```bash
# Gerar chave
ssh-keygen -t ed25519 -C "seu-email@gmail.com"

# Pressione Enter 3 vezes (aceita padrão)
```

### **2. Copiar chave pública**

```bash
# Windows
cat ~/.ssh/id_ed25519.pub
```

### **3. Adicionar no GitHub**

1. Acesse: https://github.com/settings/ssh/new
2. **Title:** "DocBasico PC"
3. **Key:** Cole a chave que copiou
4. Clique em "Add SSH key"

### **4. Usar URL SSH**

```bash
# Remover remote antigo (se houver)
git remote remove origin

# Adicionar com SSH
git remote add origin git@github.com:SEU-USUARIO/docbasico.git

# Push
git push -u origin master
```

---

## 🔍 **Troubleshooting**

### **Erro: "remote origin already exists"**

```bash
# Remover remote antigo
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU-USUARIO/docbasico.git
```

### **Erro: "Updates were rejected"**

```bash
# Forçar push (CUIDADO: sobrescreve histórico remoto)
git push -u origin master --force
```

### **Erro: "Permission denied (publickey)"**

Se usando SSH:
```bash
# Testar conexão SSH
ssh -T git@github.com

# Deve aparecer:
# Hi SEU-USUARIO! You've successfully authenticated...
```

Se não funcionar:
- Use HTTPS em vez de SSH
- Ou verifique se adicionou a chave SSH no GitHub

---

## 📝 **Verificar se Funcionou**

Após o push:

1. **Acesse seu repositório no GitHub:**
   ```
   https://github.com/SEU-USUARIO/docbasico
   ```

2. **Você deve ver:**
   - ✅ Todos os arquivos do projeto
   - ✅ Commit "subindo novas alterações do site"
   - ✅ 186 files changed

---

## 🎯 **Workflow Futuro**

Após configurar o remote, para subir mudanças:

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar arquivos
git add .

# 3. Commit
git commit -m "sua mensagem aqui"

# 4. Push (agora vai funcionar!)
git push

# Ou, se for o primeiro push de uma branch nova:
# git push -u origin master
```

---

## 🔐 **Segurança: Arquivos Sensíveis**

Verifique se `.env.local` está no `.gitignore`:

```bash
# Ver conteúdo do .gitignore
cat .gitignore

# Deve conter:
# .env.local
# .env*.local
# node_modules
```

**⚠️ NUNCA faça commit de:**
- `.env.local` (senhas, API keys)
- `node_modules` (muito grande)
- Arquivos com credenciais

---

## 📊 **Exemplo Completo**

```bash
# Situação: Acabei de criar repositório no GitHub

# 1. Copiei a URL: https://github.com/jpbertilho/docbasico.git

# 2. Adiciono o remote
git remote add origin https://github.com/jpbertilho/docbasico.git

# 3. Verifico
git remote -v
# origin  https://github.com/jpbertilho/docbasico.git (fetch)
# origin  https://github.com/jpbertilho/docbasico.git (push)

# 4. Push
git push -u origin master

# 5. GitHub pede credenciais:
# Username: jpbertilho
# Password: ghp_meuTokenAqui123...

# 6. Sucesso!
# Counting objects: 186, done.
# Writing objects: 100% (186/186), done.
# * [new branch]      master -> master
```

---

## 🎉 **Checklist Final**

Antes de fazer o push:

- [ ] Repositório criado no GitHub
- [ ] URL do repositório copiada
- [ ] Remote adicionado (`git remote add origin ...`)
- [ ] Remote verificado (`git remote -v`)
- [ ] Token de acesso criado (se necessário)
- [ ] `.gitignore` configurado (sem .env.local)
- [ ] Push realizado (`git push -u origin master`)
- [ ] Verificado no GitHub (arquivos aparecem)

---

## 💡 **Dicas**

1. **Use branch 'main' em vez de 'master':**
   ```bash
   git branch -M main
   git push -u origin main
   ```
   (GitHub prefere 'main' agora)

2. **Salve seu token:**
   - Anote em local seguro
   - Use um gerenciador de senhas
   - Configure Git Credential Manager (salva automaticamente)

3. **Configure Git globalmente:**
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

---

**🚀 Execute os passos acima e seu código estará no GitHub!**
