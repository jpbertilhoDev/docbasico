-- ==========================================
-- DIAGNÓSTICO: Notícia não aparece
-- ==========================================
-- Execute este SQL no Supabase para identificar o problema

-- 1. Ver TODAS as notícias (incluindo não publicadas)
SELECT 
  id,
  title,
  slug,
  published,
  published_at,
  created_at,
  category_id,
  source
FROM posts
ORDER BY created_at DESC
LIMIT 10;

-- 2. Ver apenas notícias PUBLICADAS (o que a API retorna)
SELECT 
  id,
  title,
  slug,
  published,
  published_at,
  CASE 
    WHEN published = false THEN '❌ NÃO PUBLICADA'
    WHEN published_at > NOW() THEN '⏰ AGENDADA PARA O FUTURO'
    ELSE '✅ OK'
  END as status
FROM posts
WHERE published = true
  AND published_at <= NOW()
ORDER BY published_at DESC;

-- 3. Diagnosticar problemas
SELECT 
  id,
  title,
  published,
  published_at,
  CASE 
    WHEN published = false THEN '❌ Marque como "Publicar imediatamente"'
    WHEN published_at IS NULL THEN '❌ Falta data de publicação'
    WHEN published_at > NOW() THEN '⏰ Data está no futuro - mude para agora'
    ELSE '✅ Deve aparecer!'
  END as problema,
  category_id,
  CASE 
    WHEN category_id IS NULL THEN '⚠️ Sem categoria (opcional)'
    ELSE '✅ Tem categoria'
  END as categoria_status
FROM posts
ORDER BY created_at DESC
LIMIT 10;

-- ==========================================
-- SOLUÇÕES RÁPIDAS
-- ==========================================

-- SOLUÇÃO 1: Publicar TODAS as notícias não publicadas
-- (Descomente a linha abaixo para executar)
-- UPDATE posts SET published = true, published_at = NOW() WHERE published = false;

-- SOLUÇÃO 2: Corrigir data de publicação para AGORA
-- (Descomente a linha abaixo para executar)
-- UPDATE posts SET published_at = NOW() WHERE published_at > NOW() OR published_at IS NULL;

-- SOLUÇÃO 3: Publicar a última notícia criada
-- (Descomente a linha abaixo para executar)
-- UPDATE posts SET published = true, published_at = NOW() WHERE id = (SELECT id FROM posts ORDER BY created_at DESC LIMIT 1);

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================

-- Ver o que deve aparecer em /noticias
SELECT 
  '✅ Esta notícia DEVE aparecer em /noticias' as info,
  title,
  slug,
  published_at
FROM posts
WHERE published = true
  AND published_at <= NOW()
ORDER BY published_at DESC;
