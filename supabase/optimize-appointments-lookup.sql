-- Otimizações de Performance para Consulta de Agendamentos
-- Executar no Supabase SQL Editor

-- 1. Índice composto para busca por email (case-insensitive)
-- Acelera a query principal de lookup
CREATE INDEX IF NOT EXISTS idx_appointments_email_lower 
ON appointments (LOWER(email));

-- 2. Índice para ordenação por data e hora
-- Acelera o ORDER BY na query
CREATE INDEX IF NOT EXISTS idx_appointments_date_time 
ON appointments (appointment_date DESC, appointment_time DESC);

-- 3. Índice composto para email + status (queries filtradas)
-- Útil para futuras queries que filtrem por status
CREATE INDEX IF NOT EXISTS idx_appointments_email_status 
ON appointments (LOWER(email), status);

-- 4. ANALYZE para atualizar estatísticas de query planner
ANALYZE appointments;

-- 5. Verificar índices criados
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'appointments'
ORDER BY indexname;

