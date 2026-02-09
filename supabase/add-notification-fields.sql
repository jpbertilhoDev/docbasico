-- Adicionar campos para rastrear notificações enviadas
-- Suporta múltiplos métodos: WhatsApp, SMS (Email-to-SMS), Email

-- Campos de confirmação
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS whatsapp_confirmation_sent TIMESTAMP WITH TIME ZONE;

ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS sms_confirmation_sent TIMESTAMP WITH TIME ZONE;

ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS email_confirmation_sent TIMESTAMP WITH TIME ZONE;

-- Campos de lembrete
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS whatsapp_reminder_sent TIMESTAMP WITH TIME ZONE;

ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS sms_reminder_sent TIMESTAMP WITH TIME ZONE;

ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS email_reminder_sent TIMESTAMP WITH TIME ZONE;

-- Criar índices para buscar agendamentos que precisam de lembretes
CREATE INDEX IF NOT EXISTS idx_appointments_whatsapp_reminder 
ON appointments(appointment_date, status, whatsapp_reminder_sent)
WHERE status IN ('pending', 'confirmed') AND whatsapp_reminder_sent IS NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_sms_reminder 
ON appointments(appointment_date, status, sms_reminder_sent)
WHERE status IN ('pending', 'confirmed') AND sms_reminder_sent IS NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_email_reminder 
ON appointments(appointment_date, status, email_reminder_sent)
WHERE status IN ('pending', 'confirmed') AND email_reminder_sent IS NULL;

-- Comentários para documentação
COMMENT ON COLUMN appointments.whatsapp_confirmation_sent IS 'Data/hora quando confirmação WhatsApp foi enviada';
COMMENT ON COLUMN appointments.sms_confirmation_sent IS 'Data/hora quando confirmação SMS (Email-to-SMS) foi enviada';
COMMENT ON COLUMN appointments.email_confirmation_sent IS 'Data/hora quando confirmação Email foi enviada';
COMMENT ON COLUMN appointments.whatsapp_reminder_sent IS 'Data/hora quando lembrete WhatsApp foi enviado';
COMMENT ON COLUMN appointments.sms_reminder_sent IS 'Data/hora quando lembrete SMS (Email-to-SMS) foi enviado';
COMMENT ON COLUMN appointments.email_reminder_sent IS 'Data/hora quando lembrete Email foi enviado';

