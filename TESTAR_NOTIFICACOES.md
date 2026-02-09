# 🧪 Como Testar as Notificações Automáticas

## ✅ Pré-requisitos

1. **WhatsApp deve estar conectado e rodando:**
   ```bash
   npx tsx scripts/start-whatsapp.ts
   ```
   Deve mostrar: `WHATSAPP CONECTADO COM SUCESSO!`

2. **Servidor Next.js deve estar rodando:**
   ```bash
   npm run dev
   ```

## 🔍 Verificar Status do WhatsApp

### Opção 1: Via API
```bash
curl http://localhost:3000/api/whatsapp/status
```

### Opção 2: Via Navegador
Acesse: `http://localhost:3000/api/whatsapp/status`

**Resposta esperada:**
```json
{
  "connected": true,
  "status": {
    "connected": true,
    "userId": "351912345678:...",
    "phoneNumber": "351912345678"
  },
  "message": "WhatsApp está conectado e pronto para enviar mensagens (351912345678)"
}
```

## 📱 Testar Agendamento Completo

1. Acesse: `http://localhost:3000/agendar`
2. Preencha o formulário:
   - Nome: Teste
   - Email: teste@exemplo.com
   - Telefone: **Use um número WhatsApp válido** (ex: 351912345678)
   - Serviço: Qualquer um
   - Data/Hora: Futura
3. Clique em "Confirmar Agendamento"

## 📊 Verificar Logs

### No Terminal do WhatsApp
Você deve ver:
```
[WHATSAPP] ========================================
[WHATSAPP] Tentando enviar mensagem para: 351912345678
[WHATSAPP] ========================================
[WHATSAPP] ✅ Socket já está conectado (User: 351912345678:...)
[WHATSAPP] Enviando para JID: 351912345678@s.whatsapp.net
[WHATSAPP] Enviando mensagem (XXX caracteres)...
[WHATSAPP] ✅ Mensagem enviada com sucesso! Message ID: ...
```

### No Terminal do Next.js
Você deve ver:
```
[APPOINTMENTS] Agendamento criado com sucesso. ID: xxx
[APPOINTMENTS] Iniciando envio de notificação de confirmação...
[NOTIFICATIONS] Iniciando envio de notificação confirmation para: {...}
[NOTIFICATIONS] Tentando enviar via WhatsApp para 351912345678...
[NOTIFICATIONS] Mensagem WhatsApp formatada: Olá Teste! ✅...
[NOTIFICATIONS] Resultado WhatsApp: { success: true, messageId: '...' }
[NOTIFICATIONS] ✅ WhatsApp enviado com sucesso!
[APPOINTMENTS] Resultado da notificação: { success: true, method: 'whatsapp', ... }
[APPOINTMENTS] ✅ Notificação WhatsApp enviada e registrada
```

## ❌ Problemas Comuns

### 1. "WhatsApp não está conectado"
**Solução:** Execute o script WhatsApp em outro terminal:
```bash
npx tsx scripts/start-whatsapp.ts
```

### 2. Mensagem não chega
**Verificar:**
- O número está correto? (formato: 351912345678, sem +, sem espaços)
- O número tem WhatsApp?
- O WhatsApp está realmente conectado? (verificar status)

### 3. Erro "Socket não encontrado"
**Solução:** O processo WhatsApp precisa estar rodando ANTES de fazer agendamentos.

### 4. Nenhum log aparece
**Solução:** Verifique se o servidor Next.js está rodando e se há erros no console.

## 🔄 Fluxo Completo

1. **Cliente faz agendamento** → `POST /api/appointments`
2. **Sistema salva no banco** → Supabase `appointments` table
3. **Sistema tenta enviar notificação:**
   - ✅ **WhatsApp** (se conectado) → Mensagem instantânea
   - Se falhar → **Email-to-SMS** (se suportado)
   - Se falhar → **Email** (sempre funciona)
4. **Sistema atualiza banco** → Marca qual método funcionou

## 📝 Verificar no Banco de Dados

```sql
SELECT 
  id,
  name,
  phone,
  whatsapp_confirmation_sent,
  sms_confirmation_sent,
  email_confirmation_sent,
  created_at
FROM appointments
ORDER BY created_at DESC
LIMIT 5;
```

**Campos preenchidos indicam:**
- `whatsapp_confirmation_sent` → WhatsApp funcionou ✅
- `sms_confirmation_sent` → Email-to-SMS funcionou ✅
- `email_confirmation_sent` → Email funcionou ✅

## 🎯 Teste Rápido

```bash
# Terminal 1: WhatsApp
npx tsx scripts/start-whatsapp.ts

# Terminal 2: Next.js
npm run dev

# Terminal 3: Testar status
curl http://localhost:3000/api/whatsapp/status

# Depois: Fazer agendamento no site
# Acesse: http://localhost:3000/agendar
```

## ✅ Checklist

- [ ] WhatsApp conectado (`npx tsx scripts/start-whatsapp.ts`)
- [ ] Next.js rodando (`npm run dev`)
- [ ] Status verificado (`/api/whatsapp/status` retorna `connected: true`)
- [ ] Agendamento feito no site
- [ ] Logs aparecem nos terminais
- [ ] Mensagem recebida no WhatsApp
- [ ] Banco de dados atualizado (`whatsapp_confirmation_sent` preenchido)

