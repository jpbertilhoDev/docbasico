-- Permitir que usuários públicos consultem e cancelem seus próprios agendamentos
-- Isso é necessário para a funcionalidade "Meus Agendamentos"

-- Remover política antiga de SELECT (se existir)
DROP POLICY IF EXISTS "Authenticated users can view all appointments" ON appointments;

-- Criar duas políticas de SELECT:
-- 1. Usuários autenticados (admin) podem ver TODOS os agendamentos
CREATE POLICY "Authenticated users can view all appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Usuários públicos podem consultar agendamentos (será filtrado por email/telefone na API)
-- IMPORTANTE: A validação real de email/telefone é feita na API route
-- Esta política apenas permite que a consulta seja feita
CREATE POLICY "Public can lookup appointments" ON appointments
  FOR SELECT USING (true);

-- Remover política antiga de UPDATE (se existir)
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;

-- Criar duas políticas de UPDATE:
-- 1. Usuários autenticados (admin) podem atualizar QUALQUER agendamento
CREATE POLICY "Authenticated users can update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 2. Usuários públicos podem atualizar status para 'cancelled' (apenas cancelamento)
-- IMPORTANTE: A validação de email/telefone e status atual é feita na API route
-- Esta política permite apenas mudar status para 'cancelled'
-- A API route garante que:
--   - Email e telefone correspondem
--   - Status atual não é 'cancelled' ou 'completed'
--   - Apenas o campo 'status' e 'updated_at' são atualizados
CREATE POLICY "Public can cancel own appointments" ON appointments
  FOR UPDATE 
  USING (true) -- Permitir selecionar qualquer agendamento (validação na API)
  WITH CHECK (status = 'cancelled'); -- Apenas permitir mudar para 'cancelled'

-- Manter as outras políticas existentes:
-- - Public can create appointments (já existe)
-- - Authenticated users can delete appointments (já existe)

