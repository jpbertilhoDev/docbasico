-- Script para corrigir o formato dos horários em available_slots
-- Remove os segundos dos horários existentes, deixando apenas HH:MM

-- Atualizar todos os slots existentes para formato HH:MM
UPDATE available_slots
SET time_slot = TO_CHAR(time_slot::TIME, 'HH24:MI')
WHERE time_slot LIKE '%:%:%'; -- Apenas atualiza se tiver segundos

-- Verificar se há conflitos após a atualização
-- Se houver, pode ser necessário limpar duplicatas manualmente

