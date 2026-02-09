-- Adicionar campo para rastrear se o lembrete SMS foi enviado
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS sms_reminder_sent TIMESTAMP WITH TIME ZONE;

-- Adicionar campo para rastrear se a confirmação SMS foi enviada
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS sms_confirmation_sent TIMESTAMP WITH TIME ZONE;

-- Criar índice para buscar agendamentos que precisam de lembretes
CREATE INDEX IF NOT EXISTS idx_appointments_sms_reminder 
ON appointments(appointment_date, status, sms_reminder_sent)
WHERE status IN ('pending', 'confirmed') AND sms_reminder_sent IS NULL;

