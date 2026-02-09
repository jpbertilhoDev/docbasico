-- Fix DELETE policy for appointments
-- Execute este script no Supabase SQL Editor se o DELETE não estiver funcionando

-- Remover política antiga (se existir)
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;

-- Criar política correta para DELETE
-- IMPORTANTE: auth.uid() verifica se há um usuário autenticado
CREATE POLICY "Authenticated users can delete appointments" ON appointments
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Verificar se a política foi criada
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'appointments' AND cmd = 'DELETE';

