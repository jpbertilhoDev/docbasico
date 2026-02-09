-- Fix RLS Policies for appointments table
-- Execute este script se os agendamentos não aparecerem no admin

-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Public can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;

-- Criar políticas corretas
-- Permitir que usuários autenticados (admin) vejam todos os agendamentos
CREATE POLICY "Authenticated users can view all appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir que usuários autenticados (admin) atualizem agendamentos
CREATE POLICY "Authenticated users can update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Permitir que usuários autenticados (admin) deletem agendamentos (opcional)
CREATE POLICY "Authenticated users can delete appointments" ON appointments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Manter a política de inserção pública (para o formulário do site)
-- Esta já deve existir, mas vamos garantir
CREATE POLICY IF NOT EXISTS "Public can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

