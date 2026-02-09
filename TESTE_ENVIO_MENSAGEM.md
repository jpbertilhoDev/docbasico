# 🧪 Como Testar o Envio de Mensagens WhatsApp

## ✅ Verificações Antes de Testar

### 1. WhatsApp Deve Estar Conectado

```bash
# Terminal 1: Iniciar WhatsApp com API HTTP
npx tsx scripts/start-whatsapp-server.ts
```

**Aguarde até ver:**
```
✅ WHATSAPP CONECTADO COM SUCESSO!
🌐 API HTTP do WhatsApp rodando em: http://localhost:3001
```

### 2. Verificar Status

```bash
# Terminal 2: Verificar status
curl http://localhost:3001/status
```

**Deve retornar:**
```json
{
  "connected": true,
  "userId": "351912345678:...",
  "phoneNumber": "351912345678"
}
```

### 3. Testar Envio Direto via API

```bash
# Terminal 3: Testar envio direto
curl -X POST http://localhost:3001/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "351912345678",
    "message": "Teste de mensagem via Baileys"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "messageId": "..."
}
```

## 🔍 Verificar Logs

### No Terminal do WhatsApp (start-whatsapp-server.ts):

```
[API] Recebida requisição para enviar mensagem para 351912345678
[WHATSAPP] ========================================
[WHATSAPP] Tentando enviar mensagem para: 351912345678
[WHATSAPP] ========================================
[WHATSAPP] ✅ Socket conectado (User: 351912345678:...)
[WHATSAPP] Enviando para JID: 351912345678@s.whatsapp.net
[WHATSAPP] Mensagem: Teste de mensagem via Baileys... (XX caracteres)
[WHATSAPP] Enviando mensagem...
[WHATSAPP] ✅ Mensagem enviada com sucesso!
[WHATSAPP] Message ID: ...
```

## ❌ Problemas Comuns e Soluções

### 1. "WhatsApp não está conectado"
**Causa:** O script não está rodando ou não está conectado.

**Solução:**
```bash
# Parar processo anterior (Ctrl+C)
# Limpar autenticação se necessário
npx tsx scripts/clear-whatsapp-auth.ts

# Iniciar novamente
npx tsx scripts/start-whatsapp-server.ts
# Escanear QR code novamente
```

### 2. "Número inválido"
**Causa:** Formato do número incorreto.

**Solução:**
- Use formato internacional SEM o sinal +
- Exemplo correto: `351912345678`
- Exemplo errado: `+351912345678` ou `351 912 345 678`

### 3. "Timeout ao enviar mensagem"
**Causa:** Conexão lenta ou instável.

**Solução:**
- Verificar conexão de internet
- Verificar se WhatsApp está realmente conectado
- Tentar novamente

### 4. "Número não encontrado no WhatsApp"
**Causa:** O número não tem WhatsApp ou está incorreto.

**Solução:**
- Verificar se o número está correto
- Verificar se o número tem WhatsApp instalado
- Testar com outro número conhecido

### 5. "Erro ao enviar mensagem: resultado vazio"
**Causa:** Problema na resposta do Baileys.

**Solução:**
- Verificar logs completos
- Tentar reiniciar o servidor WhatsApp
- Verificar versão do Baileys

## 📊 Teste Completo

### Passo 1: Iniciar WhatsApp
```bash
npx tsx scripts/start-whatsapp-server.ts
```

### Passo 2: Verificar Status
```bash
curl http://localhost:3001/status
```

### Passo 3: Testar Envio
```bash
curl -X POST http://localhost:3001/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "SEU_NUMERO_AQUI",
    "message": "Teste de mensagem"
  }'
```

### Passo 4: Verificar Mensagem
- Abra o WhatsApp no celular
- Verifique se a mensagem chegou

### Passo 5: Testar via Site
1. Acesse: `http://localhost:3000/agendar`
2. Preencha o formulário
3. Use um número WhatsApp válido
4. Complete o agendamento
5. Verifique se a mensagem chegou

## 🔧 Debug Avançado

### Ver Logs Detalhados

No código, os logs já estão configurados. Verifique:
- Terminal do WhatsApp: logs de conexão e envio
- Terminal do Next.js: logs de requisições e notificações

### Verificar Erros Específicos

Se a mensagem não for enviada, verifique os logs para:
- Tipo de erro (timeout, não autorizado, número inválido, etc.)
- Stack trace completo
- Status da conexão no momento do erro

## ✅ Checklist de Teste

- [ ] WhatsApp conectado (`start-whatsapp-server.ts` rodando)
- [ ] Status verificado (`/status` retorna `connected: true`)
- [ ] Teste direto via API funcionando
- [ ] Número no formato correto (sem +, apenas números)
- [ ] Mensagem chegou no WhatsApp
- [ ] Teste via site funcionando
- [ ] Logs mostram sucesso

## 📝 Notas Importantes

1. **Formato do Número:** Sempre use formato internacional sem + (ex: `351912345678`)
2. **Timeout:** Mensagens têm timeout de 15 segundos
3. **Verificação:** O sistema tenta verificar se o número está no WhatsApp antes de enviar
4. **Erros:** Todos os erros são logados detalhadamente para debug

