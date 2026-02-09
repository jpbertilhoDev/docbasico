# 📱 Sistema de Notificações Híbrido - Setup

Sistema inteligente que tenta múltiplos métodos de notificação em ordem de prioridade:
1. **WhatsApp** (via Baileys - TOTALMENTE GRATUITO)
2. **Email-to-SMS** (totalmente gratuito)
3. **Email** (sempre funciona como fallback)

## 🎯 Funcionalidades

- ✅ **Confirmação Imediata**: Enviada quando o usuário faz agendamento
- ✅ **Lembrete 24h Antes**: Enviado automaticamente com documentos necessários
- ✅ **Múltiplos Métodos**: Tenta WhatsApp → SMS → Email automaticamente
- ✅ **Tudo Gratuito**: Usa trials e serviços gratuitos

## 🔧 Configuração

### 1. WhatsApp (Obrigatório - Baileys - 100% Gratuito)

O WhatsApp está configurado usando **Baileys**, que é totalmente gratuito!

**Como funciona:**
1. Execute o servidor WhatsApp:
   ```bash
   npx tsx scripts/start-whatsapp.ts
   ```

2. Escaneie o QR code que aparecerá no terminal

3. Mantenha o processo rodando (use PM2 em produção)

**Pronto!** Não precisa de configuração adicional. O WhatsApp já está conectado e funcionando.

**Para produção:**
- Use PM2 para manter o processo sempre rodando
- Configure para iniciar automaticamente com o servidor

### 2. Email (Obrigatório - Fallback)

Configure um dos serviços de email:

#### Opção A: Resend (Recomendado - 3000 emails/mês grátis)

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@seu-dominio.com
```

#### Opção B: Gmail SMTP (Ilimitado)

```env
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=sua-app-password
```

### 3. Email-to-SMS (Automático)

Não precisa de configuração adicional! Funciona automaticamente se:
- O número for português (351) ou brasileiro (55)
- Você tiver email configurado (Resend ou Gmail)

**Como funciona**:
- Sistema detecta números portugueses/brasileiros
- Envia email para gateway da operadora (ex: `912345678@mail2meo.pt`)
- Operadora converte em SMS gratuitamente

**Operadoras suportadas em Portugal**:
- MEO: `numero@mail2meo.pt`
- Vodafone: `numero@sms.vodafone.pt`
- NOS: `numero@sms.nos.pt`

## 📊 Atualizar Banco de Dados

Execute o script SQL:

```sql
-- Execute no Supabase SQL Editor
-- Arquivo: supabase/add-notification-fields.sql
```

Isso adiciona campos para rastrear cada método de notificação.

## ⏰ Configurar Cron Job

O `vercel.json` já está configurado para chamar `/api/notifications/reminders` diariamente às 9h UTC.

Se usar outro serviço, configure para chamar:
```
GET https://seu-dominio.com/api/notifications/reminders
```

## 🧪 Testar

### Testar Notificação Manual

```bash
curl -X POST https://seu-dominio.com/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+351912345678",
    "email": "teste@exemplo.com",
    "name": "João Silva",
    "serviceName": "Renovação de Residência",
    "appointmentDate": "2026-01-15T10:00:00Z",
    "appointmentTime": "10:00",
    "type": "confirmation"
  }'
```

### Testar Lembretes

```bash
curl https://seu-dominio.com/api/notifications/reminders
```

## 📝 Como Funciona

### Fluxo de Notificação

```
1. Usuário faz agendamento
   ↓
2. Sistema tenta enviar confirmação:
   ├─ Tenta WhatsApp → ✅ Sucesso? Para aqui
   ├─ Falhou? Tenta Email-to-SMS → ✅ Sucesso? Para aqui
   └─ Falhou? Envia Email → ✅ Sempre funciona
   ↓
3. Marca no banco qual método funcionou
```

### Lembretes (24h antes)

```
1. Cron job executa diariamente às 9h
   ↓
2. Busca agendamentos para amanhã
   ↓
3. Para cada agendamento:
   ├─ Tenta WhatsApp
   ├─ Se falhar, tenta Email-to-SMS
   └─ Se falhar, envia Email
   ↓
4. Marca no banco qual método funcionou
```

## 💡 Vantagens do Sistema Híbrido

1. **Gratuito**: Usa trials e serviços gratuitos
2. **Confiável**: Email sempre funciona como fallback
3. **Inteligente**: Tenta o melhor método primeiro
4. **Rastreável**: Sabe qual método funcionou para cada usuário
5. **Flexível**: Pode adicionar mais métodos no futuro

## 🔍 Verificar Notificações Enviadas

```sql
SELECT 
  id,
  name,
  phone,
  email,
  appointment_date,
  appointment_time,
  whatsapp_confirmation_sent,
  sms_confirmation_sent,
  email_confirmation_sent,
  whatsapp_reminder_sent,
  sms_reminder_sent,
  email_reminder_sent
FROM appointments
ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### WhatsApp não funciona

- Verifique se o número está no formato correto (sem +, apenas números)
- Verifique se o WhatsApp Sandbox está ativado no Twilio
- Para produção, você precisa de um número verificado

### Email-to-SMS não funciona

- Funciona apenas com números portugueses (351) ou brasileiros (55)
- Nem todas as operadoras suportam
- Pode ir para spam (não é 100% confiável)
- Email sempre funciona como fallback

### Email não funciona

- Verifique as credenciais do Resend ou Gmail
- Verifique se o email do destinatário é válido
- Email é o fallback final, deve sempre funcionar

## 📚 Recursos

- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Resend Documentation](https://resend.com/docs)
- [Email-to-SMS Gateways](https://en.wikipedia.org/wiki/SMS_gateway)

