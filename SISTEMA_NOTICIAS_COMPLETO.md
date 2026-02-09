# 📰 Sistema de Notícias - Doc Basico

## 🎯 **Resumo Executivo**

O sistema de notícias do **Doc Basico** possui **duas formas de gestão**:

1. **🤖 Automática (IA)** - Busca automática de notícias usando Perplexity AI
2. **✍️ Manual (Dashboard)** - Interface administrativa para criar/editar notícias manualmente

---

## ✅ **SIM! Existe Dashboard Administrativo**

### **🔐 Acesso ao Dashboard**

**URL**: `/admin/posts`

**Funcionalidades**:
- ✅ **Lista completa de posts** (automáticos e manuais)
- ✅ **Criar novos posts** manualmente
- ✅ **Editar posts** existentes
- ✅ **Excluir posts**
- ✅ **Visualizar no site** (preview)
- ✅ **Filtros inteligentes**:
  - Todos
  - Publicados
  - Agendados
  - Rascunhos
  - **🤖 IA** (apenas notícias automáticas)
- ✅ **Busca por texto**
- ✅ **Badges visuais** para identificar origem (IA, Perplexity, Manual)

---

## 📝 **Como Criar Notícias Manualmente**

### **Passo a Passo**

1. **Acesse o Dashboard**
   ```
   http://localhost:3000/admin/posts
   ```

2. **Clique em "Novo Post"**
   - Botão azul no canto superior direito

3. **Preencha o Formulário**
   - ✅ **Título*** (obrigatório)
     - Ex: "AIMA anuncia novas regras para vistos"
   
   - ✅ **Slug (URL)*** (gerado automaticamente)
     - Ex: `aima-anuncia-novas-regras-para-vistos`
   
   - ✅ **Categoria** (opcional)
     - AIMA
     - Documentação
     - IRS
     - Finanças
     - Notícias
   
   - ✅ **Resumo** (opcional mas recomendado)
     - Descrição curta que aparece nos cards
   
   - ✅ **URL da Imagem** (opcional)
     - Link para imagem destacada
   
   - ✅ **Conteúdo*** (obrigatório)
     - __Editor Rich Text__ com formatação HTML
     - Suporta:
       - Negrito, itálico
       - Títulos (H1, H2, H3)
       - Listas (ordenadas e não-ordenadas)
       - Links
       - Parágrafos
   
   - ✅ **Opções de Publicação**
     - [ ] Publicar imediatamente
     - Ou agendar para data/hora específica

4. **Salvar**
   - Botão "Salvar Post" no final do formulário

---

## 🎨 **Interface do Dashboard**

### **Página de Listagem (`/admin/posts`)**

```
┌────────────────────────────────────────────────────────────┐
│  Posts                             [+ Novo Post]           │
├────────────────────────────────────────────────────────────┤
│  [🔍 Buscar posts...]                                       │
│  [Todos] [Publicados] [Agendados] [Rascunhos] [🤖 IA]     │
├────────────────────────────────────────────────────────────┤
│ Título          │ Categoria │ Status    │ Data    │ Ações │
├────────────────────────────────────────────────────────────┤
│ Nova Lei AIMA   │ AIMA      │ Publicado │ 09/02   │ 👁️ ✏️ 🗑️  │
│ [🤖 IA] [perplexity] [🔗 Ver fonte]                         │
├────────────────────────────────────────────────────────────┤
│ Documentação... │ Doc       │ Rascunho  │ 08/02   │ ✏️ 🗑️     │
└────────────────────────────────────────────────────────────┘
```

**Ícones de Ação**:
- 👁️ **Ver no site** (apenas posts publicados)
- ✏️ **Editar**
- 🗑️ **Excluir**

**Badges**:
- 🤖 **IA** - Roxo (notícias geradas por IA)
- **perplexity** - Azul (fonte Perplexity)
- **manual** - Sem badge (posts criados manualmente)

---

### **Página de Criação (`/admin/posts/new`)**

```
┌────────────────────────────────────────────────────────────┐
│  ← Voltar para Posts                                        │
│  Novo Post                                                  │
│  Crie uma nova notícia ou artigo                            │
├────────────────────────────────────────────────────────────┤
│  Título *                                                   │
│  [________________________________]                         │
│                                                             │
│  Slug (URL) *                                               │
│  [________________________________]                         │
│  URL amigável (gerado automaticamente)                      │
│                                                             │
│  Categoria                                                  │
│  [Selecione uma categoria ▼]                                │
│                                                             │
│  Resumo (Excerpt)                                           │
│  [________________________________]                         │
│  [________________________________]                         │
│                                                             │
│  URL da Imagem Destacada                                    │
│  [________________________________]                         │
│                                                             │
│  Conteúdo *                                                 │
│  ┌──────────────────────────────┐                          │
│  │ [B] [I] [H1] [Link] [Lista]  │                          │
│  │                               │                          │
│  │ Editor Rich Text...           │                          │
│  │                               │                          │
│  └──────────────────────────────┘                          │
│                                                             │
│  ─────── Opções de Publicação ──────                        │
│  ☑ Publicar imediatamente                                  │
│                                                             │
│  Data de Publicação                                         │
│  [09/02/2026 12:30] ⏰                                       │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                          [Cancelar] [💾 Salvar Post]       │
└────────────────────────────────────────────────────────────┘
```

---

### **Página de Edição (`/admin/posts/[id]`)**

Mesma interface da página de criação, mas com os dados pré-preenchidos.

---

## 🤖 **Sistema Automático (IA)**

### **Como Funciona**

**Cron Job** (Vercel) → **Perplexity AI** → **Processamento** → **Banco de Dados** → **Site**

**Horário**: 10h diárias (Portugal)

**Critérios de Busca**:
- Imigração em Portugal
- AIMA (Agência de Integração e Migrações)
- Vistos e autorizações de residência
- Documentação (NIF, NISS, Cartão Cidadão)
- IRS para imigrantes
- Mudanças na lei de imigração

**Características**:
- ✅ Evita duplicatas (verifica URL)
- ✅ Gera slugs únicos
- ✅ Categoriza automaticamente
- ✅ Publica automaticamente
- ✅ Marca como `ai_generated: true`
- ✅ Armazena URL original (`external_url`)
- ✅ Define `source: 'perplexity'`

---

## 📊 **Comparação: Manual vs Automático**

| Característica | Manual ✍️ | Automático 🤖 |
|----------------|-----------|---------------|
| **Criação** | Dashboard admin | Perplexity AI |
| **Frequência** | Sob demanda | Diária (10h) |
| **Controle** | Total | Automático |
| **Editor** | Rich Text | IA formata HTML |
| **Imagens** | URL manual | IA busca imagens |
| **Categorização** | Manual | Automática |
| **Publicação** | Imediata ou agendada | Imediata |
| **Badge** | Sem badge | 🤖 IA + perplexity |
| **Fonte Original** | Não | Link para fonte |
| **Campo `source`** | `manual` (padrão) | `perplexity` |
| **Campo `ai_generated`** | `false` | `true` |
| **Campo `external_url`** | `null` | URL da fonte |

---

## 🗄️ **Estrutura do Banco de Dados**

### **Tabela: `posts`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `title` | TEXT | Título da notícia |
| `slug` | TEXT | URL amigável |
| `excerpt` | TEXT | Resumo curto |
| `content` | TEXT | Conteúdo HTML |
| `category_id` | UUID | FK para `categories` |
| `featured_image_url` | TEXT | URL da imagem |
| `published` | BOOLEAN | Publicado ou não |
| `published_at` | TIMESTAMP | Data de publicação |
| `scheduled_at` | TIMESTAMP | Agendamento futuro |
| `source` | VARCHAR(100) | `manual`, `perplexity` |
| `external_url` | TEXT | URL original (IA) |
| `ai_generated` | BOOLEAN | Gerado por IA? |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Última edição |

---

## 🚀 **Como Usar no Dia a Dia**

### **Cenário 1: Notícia Urgente**

1. Acesse `/admin/posts`
2. Clique em **"Novo Post"**
3. Preencha rapidamente:
   - Título
   - Conteúdo (essencial)
   - Categoria
4. Marque **"Publicar imediatamente"**
5. Salve → Aparece instantaneamente em `/noticias`

---

### **Cenário 2: Preparar Conteúdo**

1. Crie o post
2. **Não marque** "Publicar imediatamente"
3. Salve como **Rascunho**
4. Edite e revise quando quiser
5. Publique depois

---

### **Cenário 3: Agendar Publicação**

1. Crie o post
2. **Não marque** "Publicar imediatamente"
3. Defina **"Agendar Publicação"** para data futura
4. Salve → Post será publicado automaticamente no horário

---

### **Cenário 4: Gerenciar Notícias da IA**

1. Acesse `/admin/posts`
2. Clique no filtro **"🤖 IA"**
3. Veja apenas notícias automáticas
4. Você pode:
   - ✏️ **Editar** (corrigir erros, melhorar texto)
   - 🗑️ **Excluir** (se não for relevante)
   - 👁️ **Visualizar** no site
   - Clicar em **"🔗 Ver fonte original"** para verificar

---

## 🔑 **Campos Importantes**

### **1. Título**
- **Obrigatório**
- Aparece:
  - Cards de listagem
  - Página individual
  - SEO (meta title)
  - Dashboard admin

### **2. Slug**
- **Obrigatório**
- **Gerado automaticamente** a partir do título
- Você pode editar manualmente
- Exemplo: `nova-lei-aima-2025`
- URL final: `https://seusite.com/noticias/nova-lei-aima-2025`

### **3. Categoria**
- **Opcional** (mas recomendado)
- Define a badge colorida
- Permite filtrar notícias por tema
- Categorias disponíveis:
  - AIMA
  - Documentação
  - IRS
  - Finanças
  - Notícias (padrão)

### **4. Resumo (Excerpt)**
- **Opcional**
- Aparece nos cards de listagem
- Recomendado: 1-2 frases (100-150 caracteres)
- Não confundir com o conteúdo completo

### **5. Conteúdo**
- **Obrigatório**
- **Editor Rich Text** (WYSIWYG)
- Suporta formatação HTML
- Estilos aplicados automaticamente na página pública

### **6. Imagem Destacada**
- **Opcional**
- Adicione URL completa de uma imagem
- Exemplos de fontes:
  - Unsplash
  - Pexels
  - Upload no seu servidor
  - Cloudinary, Imgur, etc.
- Aparece:
  - Cards de listagem (aspect 16:9)
  - Topo da página individual (widescreen)

---

## 📍 **Rotas e URLs**

### **Páginas Públicas**
- `/noticias` - Lista de todas as notícias
- `/noticias/[slug]` - Notícia individual

### **Dashboard Administrativo**
- `/admin` - Dashboard principal
- `/admin/posts` - Lista de posts
- `/admin/posts/new` - Criar novo post
- `/admin/posts/[id]` - Editar post existente

### **APIs**
- `GET /api/posts` - Lista notícias (com filtros)
- `GET /api/posts/[slug]` - Notícia individual
- `POST /api/news/fetch` - Buscar notícias automáticas (IA)

---

## 🛡️ **Segurança e Permissões**

### **RLS (Row Level Security)**
- APIs públicas podem **ler** posts publicados
- API de automação pode **inserir** posts (via service role)
- Dashboard admin requer autenticação (verificar implementação)

### **Validações**
- Slugs devem ser únicos
- Títulos obrigatórios
- Conteúdo obrigatório

---

## 🎨 **Design e Estética**

### **Página de Listagem**
- ✅ Grid responsivo (1 col mobile → 3 cols desktop)
- ✅ Cards modernos com sombras e hover
- ✅ Imagens com zoom suave no hover
- ✅ Badges flutuantes sobre imagens
- ✅ Tipografia clean (Inter, Roboto)
- ✅ Cores vibrantes e harmoniosas
- ✅ Animações suaves (300ms)

### **Página Individual**
- ✅ Layout estilo artigo profissional
- ✅ Max-width para legibilidade (768px)
- ✅ Imagem panorâmica no topo
- ✅ Espaçamento generoso entre parágrafos
- ✅ Tipografia responsiva
- ✅ Botões de compartilhamento
- ✅ Notícias relacionadas
- ✅ CTA para contato

---

## 📈 **Estatísticas e Métricas**

### **Verificar Notícias no Banco**

```sql
-- Ver todas as notícias
SELECT 
  id, 
  title, 
  source, 
  ai_generated,
  published,
  published_at
FROM posts
ORDER BY published_at DESC
LIMIT 20;

-- Contar por fonte
SELECT 
  source, 
  COUNT(*) as total
FROM posts
GROUP BY source;

-- Notícias automáticas vs manuais
SELECT 
  CASE WHEN ai_generated THEN 'IA' ELSE 'Manual' END as tipo,
  COUNT(*) as total
FROM posts
GROUP BY ai_generated;
```

---

## 🧪 **Testar o Sistema**

### **1. Testar Notícias Automáticas**

```bash
# PowerShell
powershell -ExecutionPolicy Bypass -File test-noticias.ps1

# ou via curl
curl -X POST http://localhost:3000/api/news/fetch \
  -H "Authorization: Bearer doc_basico_news_2026_secret_xyz123"
```

### **2. Testar Dashboard Manual**

1. Rode o servidor: `npm run dev`
2. Acesse: `http://localhost:3000/admin/posts`
3. Clique em "Novo Post"
4. Crie uma notícia de teste
5. Veja em `/noticias`

---

## 📝 **Boas Práticas**

### **Para o Editor**
1. ✅ Use títulos descritivos e claros
2. ✅ Sempre adicione um resumo (excerpt)
3. ✅ Escolha a categoria correta
4. ✅ Use imagens de boa qualidade
5. ✅ Formate o conteúdo com subtítulos (H2, H3)
6. ✅ Evite parágrafos muito longos
7. ✅ Revise antes de publicar

### **Para Imagens**
1. ✅ Proporção 16:9 ou similar
2. ✅ Mínimo 1200px de largura
3. ✅ Formato: JPG, PNG ou WebP
4. ✅ Hospede em CDN confiável
5. ✅ Use imagens relevantes ao conteúdo

### **Para SEO**
1. ✅ Títulos entre 50-60 caracteres
2. ✅ Resumos entre 120-150 caracteres
3. ✅ Use palavras-chave relevantes
4. ✅ Slugs limpos e descritivos
5. ✅ Publique regularmente

---

## 🔧 **Manutenção**

### **Limpar Notícias Antigas**

```sql
-- Deletar rascunhos com mais de 30 dias
DELETE FROM posts
WHERE published = false 
  AND created_at < NOW() - INTERVAL '30 days';
```

### **Atualizar Categorias em Massa**

```sql
-- Mover todas as notícias sem categoria para "Notícias"
UPDATE posts
SET category_id = (SELECT id FROM categories WHERE slug = 'noticias')
WHERE category_id IS NULL;
```

---

## 🎯 **Próximos Passos Recomendados**

### **Melhorias Sugeridas**
- [ ] Upload de imagens direto no editor
- [ ] Prévia do post antes de publicar
- [ ] Histórico de versões
- [ ] Comentários nas notícias
- [ ] Newsletter automática
- [ ] Analytics (views, tempo de leitura)
- [ ] Tags além de categorias
- [ ] Busca avançada (faceted search)

---

## 📞 **Suporte e Documentação**

### **Arquivos de Referência**
- `MELHORIAS_NOTICIAS_DESIGN.md` - Documentação do design
- `NEWS_AUTOMATION_SETUP.md` - Setup da automação
- `NOTICIAS_IA_COMPLETO.md` - Sistema IA completo
- `app/noticias/page.tsx` - Página de listagem
- `app/noticias/[slug]/page.tsx` - Página individual
- `app/admin/posts/page.tsx` - Dashboard de posts
- `app/admin/posts/new/page.tsx` - Criar post
- `app/api/news/fetch/route.ts` - API de automação
- `app/api/posts/route.ts` - API de posts

---

## ✅ **Checklist Final**

### **Dashboard Manual**
- ✅ Interface administrativa funcional
- ✅ Criar novos posts
- ✅ Editar posts existentes
- ✅ Excluir posts
- ✅ Filtros (Todos, Publicados, Agendados, Rascunhos, IA)
- ✅ Busca por texto
- ✅ Editor Rich Text
- ✅ Upload de imagem via URL
- ✅ Agendamento de publicação
- ✅ Preview no site

### **Sistema Automático (IA)**
- ✅ Cron job configurado (10h diárias)
- ✅ Integração com Perplexity AI
- ✅ Busca notícias sobre imigração
- ✅ Evita duplicatas
- ✅ Categorização automática
- ✅ Publicação automática
- ✅ Badges visuais no dashboard
- ✅ Link para fonte original

### **Páginas Públicas**
- ✅ `/noticias` - Lista responsiva
- ✅ `/noticias/[slug]` - Artigo completo
- ✅ Design moderno e profissional
- ✅ Mobile-first
- ✅ Filtros por categoria
- ✅ Busca por texto
- ✅ Notícias relacionadas
- ✅ Compartilhamento social

---

## 🎉 **Resumo**

**SIM, existe um dashboard completo para gerenciar notícias manualmente!**

✅ Acesse: `/admin/posts`
✅ Crie, edite, exclua e agende notícias
✅ Convive perfeitamente com notícias automáticas da IA
✅ Interface moderna, intuitiva e completa
✅ Editor Rich Text profissional
✅ Filtros e busca avançada
✅ Badges visuais para identificar origem

**As notícias podem ser criadas de 2 formas:**
1. **🤖 Automaticamente** - Perplexity AI busca diariamente
2. **✍️ Manualmente** - Você cria via dashboard administrativo

**Ambas aparecem em `/noticias` e podem ser gerenciadas no dashboard!** 🚀
