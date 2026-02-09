# 🚨 SOLUÇÃO: Notícias não aparecem + Modo Manual

## ✅ **Solução Rápida**

### **Opção 1: Inserir Notícias de Exemplo via SQL** (RÁPIDO - 2 minutos)

1. **Acesse o Supabase Dashboard**
   - https://supabase.com/dashboard
   - Entre no projeto Doc Basico

2. **Vá para SQL Editor**
   - Menu lateral → **SQL Editor**
   - Clique em **New Query**

3. **Execute o Script de Exemplo**
   - Abra o arquivo: `supabase/insert-news-examples.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor
   - Clique em **RUN** (ou Ctrl+Enter)

4. **Verifique**
   - Acesse: `http://localhost:3000/noticias`
   - Você verá 5 notícias de exemplo! 🎉

---

### **Opção 2: Criar Notícia via Dashboard Admin** (Manual)

1. **Crie um usuário admin** (se ainda não tiver)
   - Supabase → Authentication → Users → Add User
   - Email: `admin@docbasico.pt`
   - Senha: `Admin@2026`
   - ✅ Auto Confirm User

2. **Faça login no admin**
   - Acesse: `http://localhost:3000/admin/login`
   - Entre com email e senha

3. **Crie uma notícia**
   - Clique em **Posts** no menu lateral
   - Clique em **Novo Post**
   - Preencha:
     - **Título**: "AIMA anuncia novas regras para 2026"
     - **Categoria**: Selecione "AIMA"
     - **Resumo**: "Novas diretrizes para imigração"
     - **Conteúdo**: Use o editor para escrever o artigo
     - **Imagem**: `https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200`
     - ✅ Marque **"Publicar imediatamente"**
   - Clique em **Salvar Post**

4. **Visualize no site**
   - Acesse: `http://localhost:3000/noticias`
   - Sua notícia está lá! 🎉

---

## 🔍 **Por que as notícias não apareciam?**

A API de posts (`/api/posts`) só retorna notícias que:
- ✅ Estão **publicadas** (`published = true`)
- ✅ Têm `published_at` no **passado** (não no futuro)

**Provavelmente o banco estava vazio ou tinha apenas rascunhos.**

---

## 📊 **Verificar se Há Notícias no Banco**

### **Via Supabase (Interface Visual)**

1. Supabase → **Table Editor**
2. Selecione a tabela **posts**
3. Veja se há registros
4. Verifique se `published = true`

### **Via SQL**

```sql
-- Ver todas as notícias
SELECT 
  id,
  title,
  published,
  published_at
FROM posts
ORDER BY published_at DESC;

-- Ver apenas publicadas
SELECT 
  id,
  title,
  published_at
FROM posts
WHERE published = true
  AND published_at <= NOW()
ORDER BY published_at DESC;

-- Contar por status
SELECT 
  published,
  COUNT(*) as total
FROM posts
GROUP BY published;
```

---

## 🎯 **Modelo de Notícia Rápida (Copiar e Colar)**

Quando criar notícias manualmente, use este template:

### **TÍTULO:**
```
AIMA anuncia novas regras para vistos de trabalho em 2026
```

### **RESUMO (EXCERPT):**
```
A AIMA divulgou hoje novas diretrizes que simplificam o processo de solicitação de vistos de trabalho, com prazo de análise reduzido para 60 dias.
```

### **CONTEÚDO (HTML):**
```html
<h2>Principais Mudanças</h2>
<p>A Agência para Integração, Migrações e Asilo (AIMA) anunciou hoje mudanças significativas nos processos de vistos de trabalho. As alterações entram em vigor a partir de março de 2026.</p>

<h3>Documentação Simplificada</h3>
<p>A principal novidade é a redução da documentação exigida:</p>
<ul>
  <li>Passaporte válido</li>
  <li>Contrato de trabalho</li>
  <li>Certificado de antecedentes criminais</li>
  <li>Comprovativo de alojamento</li>
</ul>

<h3>Prazos Reduzidos</h3>
<p>O tempo de análise foi reduzido de 90 para 60 dias úteis, tornando o processo mais rápido e eficiente.</p>

<h3>Agendamento Online</h3>
<p>Todo o processo pode ser feito digitalmente através do portal da AIMA.</p>

<p><strong>Para mais informações, consulte o site oficial da AIMA.</strong></p>
```

### **IMAGEM:**
```
https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200
```

---

## 📝 **5 Notícias Prontas no Script SQL**

O arquivo `supabase/insert-news-examples.sql` contém:

1. **AIMA anuncia novas regras para nacionalidade**
2. **Como obter o NIF em Portugal: Guia completo**
3. **IRS 2026: Mudanças para imigrantes**
4. **Renovação de Autorização de Residência**
5. **Abrir conta bancária em Portugal**

✅ Todas com conteúdo completo, categorias e imagens!

---

## 🎨 **Fontes de Imagens Gratuitas**

Para adicionar imagens às suas notícias:

### **Unsplash** (Recomendado)
- https://unsplash.com
- Busque: "portugal", "documents", "office", "immigration"
- Clique com botão direito → Copiar endereço da imagem
- Cole no campo "URL da Imagem Destacada"

### **Pexels**
- https://pexels.com
- Mesma dinâmica do Unsplash

### **Exemplos de URLs prontas:**
```
https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200
https://images.unsplash.com/photo-1554224311-beee460ae6ba?w=1200
https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200
https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200
```

---

## 🚀 **Workflow Recomendado (Sem API Perplexity)**

### **Criação de Notícias**

1. **Acesse o Admin**
   - `http://localhost:3000/admin/posts`

2. **Clique em "Novo Post"**

3. **Preencha rapidamente:**
   - Título claro e direto
   - Escolha categoria relevante
   - Resumo de 1-2 frases
   - Conteúdo com:
     - Títulos (H2, H3)
     - Parágrafos curtos
     - Listas quando possível
     - Negrito para destaque
   - Imagem do Unsplash

4. **Publique imediatamente** ou agende

5. **Visualize no site**

---

## 📅 **Sugestão de Frequência**

**Mínimo para manter o site ativo:**
- 1-2 notícias por semana
- Foco em temas relevantes (AIMA, documentação, mudanças na lei)

**Ideal:**
- 3-5 notícias por semana
- Variar entre categorias

---

## 🎯 **Temas Populares para Notícias**

1. **AIMA**
   - Mudanças em processos
   - Novos prazos
   - Documentação exigida
   - Agendamentos

2. **Documentação**
   - NIF, NISS, Cartão Cidadão
   - Renovações
   - Processos passo a passo

3. **IRS**
   - Prazos de entrega
   - Deduções permitidas
   - Dicas para declaração

4. **Vistos e Residência**
   - Tipos de visto
   - Renovações
   - Mudanças na lei

5. **Finanças**
   - Contas bancárias
   - Custos de vida
   - Dicas financeiras

---

## ✅ **Checklist de Diagnóstico**

Se notícias não aparecem, verifique:

- [ ] Servidor está rodando (`npm run dev`)
- [ ] Há notícias no banco de dados (Supabase → Table Editor → posts)
- [ ] Notícias estão com `published = true`
- [ ] `published_at` está no passado (não no futuro)
- [ ] Categorias existem e estão associadas
- [ ] RLS (Row Level Security) permite leitura pública

---

## 🔧 **Comandos SQL Úteis**

### **Publicar todas as notícias (se houver rascunhos)**
```sql
UPDATE posts
SET 
  published = true,
  published_at = NOW()
WHERE published = false;
```

### **Deletar todas as notícias (cuidado!)**
```sql
DELETE FROM posts;
```

### **Ver estatísticas**
```sql
SELECT 
  CASE 
    WHEN published THEN 'Publicadas' 
    ELSE 'Rascunhos' 
  END as status,
  COUNT(*) as total
FROM posts
GROUP BY published;
```

---

## 🎉 **Resumo da Solução**

### **AGORA (Urgente):**
1. Execute o SQL em `supabase/insert-news-examples.sql`
2. Acesse `/noticias` e veja 5 notícias prontas

### **DEPOIS (Uso Contínuo):**
1. Crie usuário admin
2. Use `/admin/posts` para criar notícias
3. Publique 1-2 vezes por semana

### **SEM Perplexity:**
✅ Totalmente viável!
✅ Dashboard admin funciona perfeitamente
✅ Controle total sobre o conteúdo
✅ Qualidade garantida (sem IA imprecisa)

---

**🚀 Pronto! Agora você tem um sistema de notícias 100% manual e funcional!**
