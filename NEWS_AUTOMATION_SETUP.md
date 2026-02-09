# 🤖 Automação de Notícias com IA - Doc Basico

Sistema automático que busca 5 notícias diárias sobre imigração em Portugal usando **Perplexity AI**.

---

## 📋 **Índice**

1. [Configuração](#configuração)
2. [Como Funciona](#como-funciona)
3. [Teste Manual](#teste-manual)
4. [Deploy](#deploy)
5. [Monitoramento](#monitoramento)
6. [Troubleshooting](#troubleshooting)

---

## ⚙️ **Configuração**

### **1. Executar SQL no Supabase**

Abra o **Supabase SQL Editor** e execute o arquivo:

```
supabase/news-automation.sql
```

Isso adiciona os campos necessários à tabela `posts`:
- `source` (VARCHAR) - Origem da notícia (manual, perplexity, etc)
- `external_url` (TEXT) - URL original para evitar duplicatas
- `ai_generated` (BOOLEAN) - Marcador de conteúdo gerado por IA

### **2. Variáveis de Ambiente**

Certifique-se de que seu `.env.local` contém:

```env
# Perplexity API
PERPLEXITY_API_KEY=pplx-sua-chave-aqui

# Token de segurança para cron jobs
CRON_SECRET_TOKEN=seu-token-secreto-aqui
```

### **3. Deploy no Vercel**

Adicione as mesmas variáveis no Vercel:

1. Vá para: https://vercel.com/[seu-usuario]/[seu-projeto]/settings/environment-variables
2. Adicione:
   - `PERPLEXITY_API_KEY`
   - `CRON_SECRET_TOKEN`
3. Faça o deploy: `git push origin main`

---

## 🔄 **Como Funciona**

### **Fluxo Automático**

```
┌─────────────────────────────────────────────────────────┐
│  1. Cron Job (10h diárias)                             │
│     ↓                                                   │
│  2. Perplexity AI busca notícias recentes              │
│     ↓                                                   │
│  3. Processa e formata 5 notícias                      │
│     ↓                                                   │
│  4. Verifica duplicatas (URL)                          │
│     ↓                                                   │
│  5. Gera slugs únicos                                  │
│     ↓                                                   │
│  6. Categoriza automaticamente                         │
│     ↓                                                   │
│  7. Salva no Supabase (publicado=true)                 │
│     ↓                                                   │
│  8. Aparece em /noticias                               │
└─────────────────────────────────────────────────────────┘
```

### **Critérios de Busca**

A IA busca notícias sobre:
- ✅ Processos de documentação (vistos, residência, nacionalidade)
- ✅ Mudanças na lei de imigração portuguesa
- ✅ AIMA (Agência para Integração, Migrações e Asilo)
- ✅ Procedimentos burocráticos (NIF, NISS, Cartão Cidadão)
- ✅ Renovação de autorizações de residência
- ✅ IRS para imigrantes

### **Categorias Automáticas**

```
AIMA          → aima
Documentacao  → documentacao
IRS           → irs
Financas      → financas
Noticias      → noticias (padrão)
```

---

## 🧪 **Teste Manual**

### **Via Terminal**

```bash
curl -X POST http://localhost:3000/api/news/fetch \
  -H "Authorization: Bearer doc_basico_news_2026_secret_xyz123"
```

### **Via Postman/Insomnia**

- **URL**: `http://localhost:3000/api/news/fetch`
- **Method**: `POST`
- **Header**: `Authorization: Bearer doc_basico_news_2026_secret_xyz123`

### **Resposta de Sucesso**

```json
{
  "success": true,
  "message": "5 notícias salvas, 0 ignoradas, 0 erros",
  "saved": [
    {
      "id": "uuid",
      "title": "AIMA anuncia novas regras para vistos de trabalho",
      "slug": "aima-anuncia-novas-regras-para-vistos-de-trabalho"
    }
  ],
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

## 🚀 **Deploy**

### **1. Commit e Push**

```bash
git add .
git commit -m "feat: Automação de notícias com Perplexity AI"
git push origin main
```

### **2. Verificar Cron Job no Vercel**

1. Acesse: Vercel Dashboard → Settings → Cron Jobs
2. Você verá:
   - `/api/news/fetch` - Agendado para 10:00 diariamente

### **3. Testar no Vercel**

```bash
curl -X POST https://seu-site.vercel.app/api/news/fetch \
  -H "Authorization: Bearer doc_basico_news_2026_secret_xyz123"
```

---

## 📊 **Monitoramento**

### **Verificar Logs**

1. **Vercel**: Dashboard → Logs → Filtrar por `/api/news/fetch`
2. **Terminal local**: Acompanhe o console ao rodar `npm run dev`

### **Verificar Notícias no Banco**

```sql
-- Ver notícias automáticas
SELECT 
  id, 
  title, 
  source, 
  ai_generated,
  published,
  created_at
FROM posts
WHERE ai_generated = true
ORDER BY created_at DESC
LIMIT 10;

-- Contar notícias por fonte
SELECT 
  source, 
  COUNT(*) as total
FROM posts
GROUP BY source;
```

### **Verificar na UI**

Acesse: `https://seu-site.vercel.app/noticias`

---

## 🛠️ **Troubleshooting**

### **Erro: "PERPLEXITY_API_KEY não configurada"**

**Solução**:
```bash
# Adicione no .env.local
PERPLEXITY_API_KEY=pplx-sua-chave-aqui

# Reinicie o servidor
npm run dev
```

### **Erro: "Não autorizado"**

**Solução**:
```bash
# Verifique se o token está correto
curl -X POST http://localhost:3000/api/news/fetch \
  -H "Authorization: Bearer doc_basico_news_2026_secret_xyz123"
```

### **Erro: "Nenhuma notícia encontrada"**

**Possíveis causas**:
- A Perplexity não encontrou notícias recentes
- Erro na API da Perplexity (verifique créditos)
- Problema na conexão

**Solução**: Verifique os logs para mais detalhes

### **Notícias Duplicadas**

**Prevenção automática**:
- O sistema verifica `external_url` antes de salvar
- URLs duplicadas são ignoradas automaticamente

### **Cron Job não executando**

**Verificações**:
1. Variáveis de ambiente configuradas no Vercel
2. `vercel.json` commitado no repositório
3. Aguarde até o horário agendado (10h)

**Forçar execução manual**:
```bash
curl -X POST https://seu-site.vercel.app/api/news/fetch \
  -H "Authorization: Bearer doc_basico_news_2026_secret_xyz123"
```

---

## 📈 **Estatísticas de Uso**

### **Limites da Perplexity**

- **Free Tier**: Verifique os limites atuais
- **Pro Tier**: Requisições ilimitadas

### **Custo Estimado**

Com 5 notícias/dia:
- ~150 notícias/mês
- ~1800 notícias/ano

---

## 🔐 **Segurança**

### **Proteção da API**

✅ Token secreto obrigatório (`CRON_SECRET_TOKEN`)
✅ Apenas POST requests autorizadas
✅ Logs detalhados para auditoria

### **Prevenção de Duplicatas**

✅ Índice por `external_url`
✅ Verificação automática antes de inserir
✅ Slugs únicos com timestamp se necessário

---

## 🎯 **Próximos Passos**

- [ ] Adicionar mais fontes de notícias
- [ ] Implementar moderação manual antes de publicar
- [ ] Adicionar notificações de novas notícias
- [ ] Dashboard de estatísticas de notícias
- [ ] Opção de agendar horário personalizado

---

## 📞 **Suporte**

Se tiver problemas:

1. Verifique os logs no Vercel
2. Execute o teste manual
3. Verifique as variáveis de ambiente
4. Consulte este documento

---

**🚀 Sistema pronto para produção!**

