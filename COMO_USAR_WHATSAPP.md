# 📱 Como Usar o Sistema de Notificações WhatsApp

## ⚠️ IMPORTANTE: WhatsApp Deve Estar Rodando ANTES

O WhatsApp **DEVE estar conectado e rodando** antes de fazer qualquer agendamento. Caso contrário, as notificações não serão enviadas.

## 🚀 Passo a Passo

### 1. Iniciar o Servidor WhatsApp

**Em um terminal separado**, execute:

```bash
npx tsx scripts/start-whatsapp.ts
```

**Aguarde até ver:**
```
✅ WHATSAPP CONECTADO COM SUCESSO!
💡 Mantenha este processo rodando para receber e enviar mensagens
```

**⚠️ NÃO FECHE ESTE TERMINAL!** Ele precisa ficar rodando.

### 2. Verificar Status (Opcional)

Em outro terminal, verifique se está conectado:

```bash
curl http://localhost:3000/api/whatsapp/status
```

Deve retornar:
```json
{
  "connected": true,
  "status": {
    "connected": true,
    "phoneNumber": "351912345678"
  }
}
```

### 3. Iniciar o Servidor Next.js

**Em outro terminal**, execute:

```bash
npm run dev
```

### 4. Fazer Agendamento

1. Acesse: `http://localhost:3000/agendar`
2. Preencha o formulário
3. **Use um número WhatsApp válido** (ex: 351912345678)
4. Complete o agendamento

### 5. Verificar Mensagem

O cliente deve receber uma mensagem WhatsApp de confirmação imediatamente após o agendamento.

## ✅ Como Funciona Agora

1. **Agendamento é criado** → Salvo no banco de dados
2. **Resposta é enviada imediatamente** → Não trava mais!
3. **Notificação é enviada em background** → WhatsApp → SMS → Email
4. **Cliente recebe mensagem** → No WhatsApp (se conectado)

## 🔍 Verificar Logs

### Terminal do WhatsApp:
```
[WHATSAPP] ✅ Socket conectado (User: 351912345678:...)
[WHATSAPP] Enviando para JID: 351912345678@s.whatsapp.net
[WHATSAPP] ✅ Mensagem enviada com sucesso!
```

### Terminal do Next.js:
```
[APPOINTMENTS] Agendamento criado com sucesso. ID: xxx
[APPOINTMENTS] Enviando notificação de confirmação em background...
[NOTIFICATIONS] ✅ WhatsApp enviado com sucesso!
[APPOINTMENTS] ✅ Notificação WhatsApp enviada e registrada
```

## ❌ Problemas Comuns

### "WhatsApp não está conectado"
**Solução:** Execute `npx tsx scripts/start-whatsapp.ts` em um terminal separado ANTES de fazer agendamentos.

### "Processamento infinito"
**Solução:** Isso foi corrigido! Agora o agendamento não trava mais. A notificação é enviada em background.

### Mensagem não chega
**Verificar:**
1. WhatsApp está conectado? (`/api/whatsapp/status`)
2. Número está correto? (formato: 351912345678, sem +, sem espaços)
3. Número tem WhatsApp?
4. Verificar logs nos terminais

## 🎯 Checklist Rápido

- [ ] Terminal 1: WhatsApp rodando (`npx tsx scripts/start-whatsapp.ts`)
- [ ] Terminal 2: Next.js rodando (`npm run dev`)
- [ ] Status verificado (`/api/whatsapp/status` retorna `connected: true`)
- [ ] Agendamento feito
- [ ] Mensagem recebida no WhatsApp

## 📊 Em Produção

Para produção, use PM2 para manter o WhatsApp sempre rodando:

```bash
# Instalar PM2
npm install -g pm2

# Iniciar WhatsApp
pm2 start scripts/start-whatsapp.ts --name whatsapp --interpreter tsx

# Ver status
pm2 status

# Ver logs
pm2 logs whatsapp
```

