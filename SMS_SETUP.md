# 📱 Configuração do Sistema de Notificações SMS

Este documento explica como configurar o sistema de notificações SMS para lembretes de agendamentos.

## 🎯 Funcionalidades

O sistema envia automaticamente:
1. **SMS de Confirmação Imediata**: Quando o usuário faz um agendamento
2. **SMS de Lembrete**: 24 horas antes do agendamento (com documentos necessários)

## 🔧 Configuração do Twilio

### 1. Criar Conta no Twilio

1. Acesse [https://www.twilio.com](https://www.twilio.com)
2. Crie uma conta gratuita (inclui créditos para testes)
3. Verifique seu número de telefone pessoal para testes

### 2. Obter Credenciais

No Dashboard do Twilio:
1. Vá em **Account** → **API Keys & Tokens**
2. Copie:
   - **Account SID**
   - **Auth Token**

### 3. Obter Número de Telefone

1. Vá em **Phone Numbers** → **Manage** → **Buy a number**
2. Escolha um número (pode ser gratuito para testes)
3. Copie o número no formato E.164 (ex: +1234567890)

### 4. Configurar Variáveis de Ambiente

Adicione ao arquivo `.env.local`:

```env
TWILIO_ACCOUNT_SID=seu_account_sid_aqui
TWILIO_AUTH_TOKEN=seu_auth_token_aqui
TWILIO_PHONE_NUMBER=+1234567890
```

**⚠️ IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git!

## 📊 Atualizar Banco de Dados

Execute o script SQL para adicionar campos de rastreamento:

```sql
-- Execute no Supabase SQL Editor
-- Arquivo: supabase/add-sms-reminder-field.sql
```

Isso adiciona:
- `sms_reminder_sent`: Data/hora quando o lembrete foi enviado
- `sms_confirmation_sent`: Data/hora quando a confirmação foi enviada

## ⏰ Configurar Cron Job para Lembretes

O sistema precisa verificar diariamente agendamentos que precisam de lembretes.

### Opção 1: Vercel Cron Jobs (Recomendado)

1. Crie o arquivo `vercel.json` na raiz do projeto:

```json
{
  "crons": [
    {
      "path": "/api/sms/reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Isso executa todos os dias às 9h UTC.

### Opção 2: Serviço Externo (Cron-job.org, EasyCron, etc.)

Configure um cron job para chamar:
```
GET https://seu-dominio.com/api/sms/reminders
```

Frequência recomendada: **Uma vez por dia às 9h** (horário local de Portugal)

### Opção 3: Next.js API Route + Agendamento Manual

Você pode chamar manualmente a rota:
```bash
curl https://seu-dominio.com/api/sms/reminders
```

## 🧪 Testar o Sistema

### 1. Testar Envio de SMS

```bash
curl -X POST https://seu-dominio.com/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+351912345678",
    "message": "Teste de SMS do sistema"
  }'
```

### 2. Testar Lembretes

```bash
curl https://seu-dominio.com/api/sms/reminders
```

### 3. Verificar no Banco de Dados

```sql
SELECT 
  id,
  name,
  phone,
  appointment_date,
  appointment_time,
  sms_confirmation_sent,
  sms_reminder_sent
FROM appointments
ORDER BY created_at DESC;
```

## 📝 Formato das Mensagens

### Confirmação Imediata
```
Olá [Nome]! ✅

O seu agendamento foi registado com sucesso:

📋 [Serviço]
📅 [Data] às [Hora]

Receberá um lembrete 24h antes do agendamento.

Obrigado!
```

### Lembrete (24h antes)
```
Olá [Nome]! 📅

Lembrete: Tem um agendamento amanhã:

📋 Serviço: [Serviço]
📅 Data: [Data]
🕐 Hora: [Hora]

📄 Documentos necessários:
• [Documento 1]
• [Documento 2]
• [Documento 3]

Até breve!
```

## 💰 Custos

- **Twilio**: ~€0.05-0.10 por SMS (depende do país)
- **Conta de Teste**: Inclui créditos gratuitos
- **Produção**: Considere um plano mensal para reduzir custos

## 🔒 Segurança

1. **Nunca exponha** as credenciais do Twilio
2. Use variáveis de ambiente
3. Adicione `.env.local` ao `.gitignore`
4. Considere usar **Twilio Verify** para números verificados

## 🐛 Troubleshooting

### SMS não está sendo enviado

1. Verifique as variáveis de ambiente:
```bash
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
echo $TWILIO_PHONE_NUMBER
```

2. Verifique os logs do servidor
3. Verifique o saldo da conta Twilio
4. Verifique se o número está no formato E.164

### Lembretes não estão sendo enviados

1. Verifique se o cron job está configurado
2. Verifique os logs da API `/api/sms/reminders`
3. Verifique se há agendamentos para amanhã:
```sql
SELECT * FROM appointments
WHERE appointment_date >= CURRENT_DATE + INTERVAL '1 day'
  AND appointment_date < CURRENT_DATE + INTERVAL '2 days'
  AND status IN ('pending', 'confirmed')
  AND sms_reminder_sent IS NULL;
```

## 📚 Recursos

- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

