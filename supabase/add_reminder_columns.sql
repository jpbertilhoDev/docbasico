-- Adiciona colunas para controle de envio de lembretes
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS sms_reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS whatsapp_reminder_sent BOOLEAN DEFAULT FALSE;

-- Opcional: Adicionar índices se necessário (mas para booleanos simples geralmente não precisa)
