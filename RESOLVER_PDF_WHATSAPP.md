# 🔧 Resolver Envio de PDF via WhatsApp

## 🐛 Problema Identificado

O PDF está sendo gerado corretamente pelo jsPDF (10.48 KB), mas **NÃO está sendo enviado** via WhatsApp.

**Erro nos logs**:
```
[NOTIFICATIONS] ❌ Erro ao enviar PDF: WhatsApp está conectado em outro processo. Use a API HTTP (start-whatsapp-server.ts) para enviar documentos.
```

## ✅ Solução

### 1. Reiniciar o Servidor WhatsApp

O servidor WhatsApp (`start-whatsapp-server.ts`) precisa ser reiniciado para pegar as mudanças no código:

```bash
# 1. Parar o servidor WhatsApp atual (se estiver rodando)
# No terminal onde está rodando, pressione: Ctrl+C

# 2. Iniciar novamente
npx tsx scripts/start-whatsapp-server.ts
```

### 2. Testar o Envio de PDF

Após reiniciar o servidor, execute o teste:

```bash
npx tsx test-pdf-send.ts
```

**Resultado esperado**:
```
✅✅✅ SUCESSO! PDF enviado via WhatsApp!
Verifique seu WhatsApp para confirmar o recebimento.
```

### 3. Fazer um Novo Agendamento

Faça um novo agendamento pelo site e verifique se:

1. ✅ Mensagem de confirmação chega
2. ✅ PDF chega logo após (2-5 segundos)

## 📋 O que foi Corrigido

### 1. Logs Melhorados no Servidor

**Arquivo**: `scripts/start-whatsapp-server.ts`

Agora o servidor mostra logs detalhados quando recebe requisição de documento:

```typescript
console.log(`[API] Dados recebidos:`, {
  to,
  message: message ? 'sim' : 'não',
  document: document ? 'sim (base64)' : 'não',
  fileName,
});

console.log(`[API] ✅ Detectado envio de documento`);
console.log(`[API] Convertendo base64 para Buffer...`);
console.log(`[API] ✅ Convertido! Tamanho: X KB`);
console.log(`[API] 📤 Enviando documento via Baileys...`);
```

### 2. Logs Melhorados no Wrapper

**Arquivo**: `lib/whatsapp.ts`

O wrapper agora mostra cada etapa do envio:

```typescript
console.log(`[WHATSAPP-WRAPPER] Iniciando envio de documento via API HTTP...`);
console.log(`[WHATSAPP-WRAPPER] Documento convertido para base64: X caracteres`);
console.log(`[WHATSAPP-WRAPPER] Enviando para: http://localhost:3001/send`);
console.log(`[WHATSAPP-WRAPPER] Resposta HTTP: 200 OK`);
console.log(`[WHATSAPP] ✅ Documento enviado via API HTTP`);
```

## 🧪 Teste Completo

### Passo 1: Reiniciar Servidor WhatsApp
```bash
# Terminal 1: Servidor WhatsApp
npx tsx scripts/start-whatsapp-server.ts
```

### Passo 2: Iniciar Next.js
```bash
# Terminal 2: Aplicação
npm run dev
```

### Passo 3: Fazer Teste Direto
```bash
# Terminal 3: Teste
npx tsx test-pdf-send.ts
```

### Passo 4: Fazer Agendamento
- Acesse: http://localhost:3000/agendar
- Preencha o formulário
- Confirme o agendamento
- **Verifique o WhatsApp**

## 📊 Logs Esperados (Sucesso)

### No Servidor WhatsApp:
```
[API] Dados recebidos: { to: '351XXXXXXXXX', document: 'sim (base64)', fileName: 'Checklist-XXX.pdf' }
[API] ✅ Detectado envio de documento
[API] Convertendo base64 para Buffer...
[API] ✅ Convertido! Tamanho: 10.48 KB
[API] 📤 Recebida requisição para enviar documento para 351XXXXXXXXX
[API] Arquivo: Checklist-XXX.pdf
[API] Chamando sendWhatsAppDocument...
[WHATSAPP] ========================================
[WHATSAPP] Tentando enviar documento para: 351XXXXXXXXX
[WHATSAPP] Arquivo: Checklist-XXX.pdf (10.48 KB)
[WHATSAPP] ========================================
[WHATSAPP] ✅ Número verificado no WhatsApp
[WHATSAPP] ⏳ Anti-spam delay: 4.2s
[WHATSAPP] 📊 Mensagens enviadas neste minuto: 2/10
[WHATSAPP] Enviando documento...
[WHATSAPP] ✅ Documento enviado com sucesso!
[API] Resultado: { success: true, messageId: '...' }
```

### Na Aplicação Next.js:
```
[NOTIFICATIONS] ✅ WhatsApp (mensagem) enviado com sucesso!
[NOTIFICATIONS] 📋 Iniciando processo de envio de PDF...
[NOTIFICATIONS] ⏳ Aguardando 2 segundos antes de enviar PDF (anti-spam)...
[NOTIFICATIONS] Gerando PDF do checklist para [Nome]...
[NOTIFICATIONS] 📄 Documentos encontrados: 6
[NOTIFICATIONS] ✅ PDF gerado! Tamanho: 10.48 KB
[NOTIFICATIONS] 📤 Enviando PDF via WhatsApp...
[WHATSAPP-WRAPPER] Iniciando envio de documento via API HTTP...
[WHATSAPP-WRAPPER] Documento convertido para base64: 14016 caracteres
[WHATSAPP-WRAPPER] Enviando para: http://localhost:3001/send
[WHATSAPP-WRAPPER] Resposta HTTP: 200 OK
[WHATSAPP] ✅ Documento enviado via API HTTP
[NOTIFICATIONS] ✅✅✅ PDF enviado com sucesso via WhatsApp!
```

## ❌ Erros Comuns

### 1. "to e message são obrigatórios"
**Causa**: Servidor não detectou o campo `document` na requisição.
**Solução**: Reiniciar servidor WhatsApp.

### 2. "WhatsApp não está conectado"
**Causa**: Servidor WhatsApp não está rodando ou perdeu conexão.
**Solução**: 
```bash
npx tsx scripts/start-whatsapp-server.ts
# Escanear QR code novamente se necessário
```

### 3. "Connection refused localhost:3001"
**Causa**: Servidor WhatsApp não está rodando.
**Solução**: Iniciar o servidor conforme Passo 1.

## 🎯 Checklist de Verificação

Antes de testar:
- [ ] Servidor WhatsApp rodando (`npx tsx scripts/start-whatsapp-server.ts`)
- [ ] QR code escaneado e conectado
- [ ] Aplicação Next.js rodando (`npm run dev`)
- [ ] Teste direto funcionando (`npx tsx test-pdf-send.ts`)

## 📝 Notas

- **jsPDF está funcionando perfeitamente** - PDFs sendo gerados corretamente
- **O problema era na comunicação** entre Next.js e o servidor Baileys
- **Após reiniciar o servidor**, tudo deve funcionar
- **PDFs são enviados 2-5 segundos após a mensagem** (delays anti-ban)

## ✨ Resultado Final

Quando funcionar, você verá no WhatsApp:

1. **Mensagem de Confirmação** 📱
   ```
   Olá [Nome]! ✅
   O seu agendamento foi confirmado:
   📋 Serviço: [Nome do Serviço]
   📅 Data: [Data]
   ...
   ```

2. **PDF do Checklist** 📄
   - Arquivo: `Checklist-[Serviço]-[Nome].pdf`
   - Caption: "📄 *Checklist de Documentos* ..."
   - Tamanho: ~10KB
   - Formato A4 com todos os documentos necessários

**TESTE AGORA E ME AVISE SE FUNCIONOU!** 🚀

