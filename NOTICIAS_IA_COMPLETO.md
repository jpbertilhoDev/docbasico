# 🤖 Notícias Automáticas com IA - Sistema Completo

Sistema de busca automática de notícias sobre imigração em Portugal usando **Perplexity AI**, totalmente integrado ao dashboard administrativo.

---

## ✅ **Status: FUNCIONANDO!**

### **O que foi implementado:**

1. ✅ **Integração com Perplexity AI** - Busca 5 notícias diárias sobre imigração
2. ✅ **Salvamento automático no banco** - Notícias vão direto para a tabela `posts`
3. ✅ **Dashboard Admin atualizado** - Filtro especial para ver notícias da IA
4. ✅ **Badges visuais** - Identificação clara de notícias automáticas
5. ✅ **Políticas RLS corrigidas** - API pode inserir notícias
6. ✅ **Cron job configurado** - Execução automática às 10h (produção)

---

## 🎯 **Como Funciona**

### **Localmente (Desenvolvimento)**

```bash
# 1. Buscar notícias manualmente
powershell -ExecutionPolicy Bypass -File test-news-api.ps1

# 2. Ver logs no terminal do servidor Next.js
```

### **Em Produção (Vercel)**

- **Automático às 10h diárias** via cron job
- Não requer intervenção manual
- Notícias aparecem automaticamente em `/noticias` e no dashboard admin

---

## 🎨 **Dashboard Admin - Novidades**

### **Novo Filtro: 🤖 IA**

Clique no botão **"🤖 IA"** no dashboard admin para ver **apenas notícias automáticas**.

### **Badges Visuais**

Cada notícia agora mostra:

- **🤖 IA** - Badge roxo para notícias geradas pela IA
- **perplexity** - Badge azul indicando a fonte
- **🔗 Ver fonte original** - Link para a notícia original (quando disponível)

### **Exemplo Visual:**

```
┌────────────────────────────────────────────────────────────┐
│ Título                                                     │
├────────────────────────────────────────────────────────────┤
│ Governo endurece regras... [🤖 IA] [perplexity]          │
│ Resumo da notícia...                                       │
│ 🔗 Ver fonte original                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 **Estatísticas**

### **Última Execução**

- **Data:** 08/01/2026 15:13
- **Notícias salvas:** 4
- **Notícias ignoradas:** 1 (URL duplicada)
- **Erros:** 0

### **Notícias Buscadas:**

1. ✅ "Governo endurece regras para vistos e nacionalidade..."
2. ✅ "Nova lei do retorno redefine procedimentos..."
3. ✅ "Imigrantes em Portugal enfrentam 2026..."
4. ✅ "Filas de sete horas na fronteira portuguesa..."

---

## 🗄️ **Campos no Banco de Dados**

A tabela `posts` agora tem:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `source` | VARCHAR(100) | Fonte da notícia: `manual`, `perplexity` |
| `external_url` | TEXT | URL original (para evitar duplicatas) |
| `ai_generated` | BOOLEAN | `true` para notícias automáticas |
| `featured_image_url` | TEXT | URL da imagem da notícia |

---

## 🔄 **Fluxo Completo**

```
1. Cron Job (10h) ou Teste Manual
   ↓
2. API chama Perplexity AI
   ↓
3. Perplexity busca notícias recentes na web
   ↓
4. API processa e formata 5 notícias
   ↓
5. Verifica duplicatas (external_url)
   ↓
6. Gera slugs únicos
   ↓
7. Categoriza automaticamente
   ↓
8. Salva no Supabase
   ↓
9. Notícias aparecem em:
   - /noticias (público)
   - /admin/posts (dashboard)
```

---

## 📝 **Variáveis de Ambiente**

Certifique-se de ter no `.env.local`:

```env
PERPLEXITY_API_KEY=pplx-sua-chave-aqui
CRON_SECRET_TOKEN=seu-token-secreto-aqui
```

E no **Vercel Dashboard** (produção):
- Adicione as mesmas variáveis em Settings → Environment Variables

---

## 🧪 **Testar Manualmente**

### **Método 1: PowerShell**

```bash
powershell -ExecutionPolicy Bypass -File test-news-api.ps1
```

### **Método 2: Postman/Insomnia**

```http
POST http://localhost:3000/api/news/fetch
Authorization: Bearer doc_basico_news_2026_secret_xyz123
```

### **Método 3: curl**

```bash
curl -X POST http://localhost:3000/api/news/fetch \
  -H "Authorization: Bearer doc_basico_news_2026_secret_xyz123"
```

---

## 🎯 **Critérios de Busca**

A IA busca notícias sobre:

✅ **AIMA** - Agência para Integração, Migrações e Asilo  
✅ **Vistos** - Tipos de visto, processos, renovações  
✅ **Residência** - Autorizações de residência  
✅ **Nacionalidade** - Processos de naturalização  
✅ **NIF** - Número de Identificação Fiscal  
✅ **NISS** - Número de Identificação da Segurança Social  
✅ **Cartão Cidadão** - Documentação portuguesa  
✅ **IRS** - Impostos e questões fiscais  
✅ **Procedimentos burocráticos** - Documentação geral  

---

## 🚀 **Próximos Passos**

### **Opcional - Melhorias Futuras:**

- [ ] Adicionar moderação antes de publicar automaticamente
- [ ] Notificações quando novas notícias são adicionadas
- [ ] Dashboard de estatísticas de notícias IA
- [ ] Tradução automática para outros idiomas
- [ ] Resumos personalizados por categoria

---

## 📞 **Suporte**

### **Verificar se está funcionando:**

1. Acesse o dashboard admin: `/admin/posts`
2. Clique no filtro **"🤖 IA"**
3. Você deve ver as notícias automáticas com badges roxos

### **Forçar busca manual:**

```bash
powershell -ExecutionPolicy Bypass -File test-news-api.ps1
```

### **Ver logs em produção:**

- Acesse: Vercel Dashboard → Deployments → Logs
- Filtre por: `/api/news/fetch`

---

## 🎉 **Sistema Pronto!**

✅ Notícias automáticas funcionando  
✅ Dashboard admin atualizado  
✅ Badges visuais implementados  
✅ Cron job configurado para produção  
✅ Teste manual disponível  

**As notícias agora serão atualizadas automaticamente todos os dias às 10h!** 🚀

