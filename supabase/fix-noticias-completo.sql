-- ==========================================
-- CORREÇÃO DEFINITIVA: Notícias não aparecem
-- ==========================================
-- Execute este SQL inteiro no Supabase SQL Editor

-- PASSO 1: Verificar notícias existentes e seus problemas
SELECT 
  id,
  title,
  slug,
  published,
  published_at,
  created_at,
  CASE 
    WHEN published = false THEN '❌ NÃO PUBLICADA - Precisa marcar published = true'
    WHEN published_at IS NULL THEN '❌ SEM DATA - Precisa definir published_at'
    WHEN published_at > NOW() THEN '⏰ AGENDADA - Data está no futuro, ajustar para NOW()'
    ELSE '✅ OK - Deve aparecer!'
  END as diagnostico
FROM posts
ORDER BY created_at DESC
LIMIT 20;

-- ==========================================
-- PASSO 2: CORREÇÕES AUTOMÁTICAS
-- ==========================================

-- SOLUÇÃO 1: Publicar TODAS as notícias não publicadas
UPDATE posts 
SET 
  published = true,
  published_at = COALESCE(published_at, NOW())
WHERE published = false;

-- SOLUÇÃO 2: Corrigir notícias publicadas mas SEM data
UPDATE posts 
SET published_at = created_at
WHERE published = true 
  AND published_at IS NULL;

-- SOLUÇÃO 3: Corrigir notícias com data no FUTURO
UPDATE posts 
SET published_at = NOW()
WHERE published = true 
  AND published_at > NOW();

-- ==========================================
-- PASSO 3: VERIFICAÇÃO FINAL
-- ==========================================

-- Ver quantas notícias estão CORRETAMENTE configuradas
SELECT 
  '✅ Estas notícias DEVEM aparecer em /noticias' as info,
  COUNT(*) as total
FROM posts
WHERE published = true
  AND published_at IS NOT NULL
  AND published_at <= NOW();

-- Ver DETALHES das notícias que devem aparecer
SELECT 
  '✅ DEVE APARECER' as status,
  title,
  slug,
  published_at,
  category_id,
  CASE 
    WHEN category_id IS NULL THEN '⚠️ Sem categoria'
    ELSE '✅ Tem categoria'
  END as categoria_status
FROM posts
WHERE published = true
  AND published_at IS NOT NULL
  AND published_at <= NOW()
ORDER BY published_at DESC
LIMIT 10;

-- Ver notícias que AINDA não aparecem (se houver)
SELECT 
  '❌ NÃO APARECE' as status,
  title,
  published,
  published_at,
  CASE 
    WHEN published = false THEN 'Não publicada'
    WHEN published_at IS NULL THEN 'Sem data'
    WHEN published_at > NOW() THEN 'Data futura'
    ELSE 'Erro desconhecido'
  END as motivo
FROM posts
WHERE NOT (
  published = true
  AND published_at IS NOT NULL
  AND published_at <= NOW()
)
ORDER BY created_at DESC;

-- ==========================================
-- PASSO 4: CRIAR NOTÍCIA DE TESTE
-- ==========================================

-- Se não há nenhuma notícia, crie uma de teste
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category_id,
  featured_image_url,
  published,
  published_at,
  source,
  ai_generated
) 
SELECT 
  'Notícia de Teste - Sistema Funcionando!',
  'noticia-teste-sistema-funcionando',
  'Esta é uma notícia de teste para verificar se o sistema está funcionando corretamente.',
  '<h2>Teste do Sistema</h2><p>Se você está vendo esta notícia na página /noticias, significa que o sistema está funcionando perfeitamente!</p><p>Agora você pode criar suas próprias notícias através do dashboard admin.</p>',
  (SELECT id FROM categories WHERE slug = 'noticias' LIMIT 1),
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200',
  true,
  NOW(),
  'manual',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM posts WHERE slug = 'noticia-teste-sistema-funcionando'
);

-- ==========================================
-- PASSO 5: VERIFICAR POLÍTICAS RLS
-- ==========================================

-- Ver políticas ativas na tabela posts
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'posts';

-- ==========================================
-- ESTATÍSTICAS FINAIS
-- ==========================================

SELECT 
  '📊 ESTATÍSTICAS FINAIS' as titulo,
  COUNT(*) FILTER (WHERE published = true AND published_at <= NOW()) as publicadas,
  COUNT(*) FILTER (WHERE published = false) as rascunhos,
  COUNT(*) FILTER (WHERE published = true AND published_at > NOW()) as agendadas,
  COUNT(*) as total
FROM posts;

-- ==========================================
-- SUCESSO!
-- ==========================================
-- Após executar este script:
-- 1. Todas as notícias devem estar publicadas corretamente
-- 2. Acesse http://localhost:3000/noticias para verificar
-- 3. Se não aparecer, reinicie o servidor: npm run dev
-- ==========================================
