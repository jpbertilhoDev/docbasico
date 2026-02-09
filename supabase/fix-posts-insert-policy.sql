-- ================================================
-- FIX: Permitir inserção de posts via API
-- ================================================
-- Este script adiciona políticas RLS para permitir
-- que a API insira notícias automaticamente na tabela posts

-- Remover política antiga se existir
DROP POLICY IF EXISTS "API can insert posts" ON posts;
DROP POLICY IF EXISTS "Service role can insert posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;

-- Criar política para permitir inserções via service role ou authenticated users
-- Isso permite que a API (usando service role) insira notícias
CREATE POLICY "API can insert posts" ON posts
  FOR INSERT 
  WITH CHECK (true);

-- Permitir que authenticated users também possam atualizar posts
CREATE POLICY "Authenticated users can update posts" ON posts
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir que authenticated users possam deletar posts
CREATE POLICY "Authenticated users can delete posts" ON posts
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Verificar políticas criadas
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
WHERE tablename = 'posts'
ORDER BY policyname;

