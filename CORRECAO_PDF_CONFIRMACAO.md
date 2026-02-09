# ✅ Correção: Envio de PDF na Confirmação do Agendamento

## 🐛 Problema Identificado

Quando um cliente fazia um agendamento, recebia apenas a mensagem de confirmação no WhatsApp, mas o PDF do checklist de documentos **NÃO** estava sendo enviado.

## 🔧 Solução Implementada

### 1. Adicionado `serviceSlug` nas Notificações
**Arquivo**: `lib/notifications.ts`

```typescript
interface NotificationOptions {
  // ... outros campos
  serviceSlug?: string; // NOVO: Para buscar documentos do serviço
  // ...
}
```

### 2. Geração e Envio Automático do PDF
**Arquivo**: `lib/notifications.ts`

Após enviar a mensagem de confirmação via WhatsApp com sucesso, o sistema agora:

1. **Verifica** se é uma notificação de confirmação
2. **Busca** os documentos do serviço usando `serviceSlug`
3. **Gera** o PDF com todos os documentos necessários
4. **Envia** o PDF automaticamente via WhatsApp como anexo

```typescript
// Se WhatsApp funcionou e for confirmação, enviar PDF
if (whatsappResult.success && options.type === 'confirmation' && options.serviceSlug) {
  // Buscar documentos do serviço
  const serviceInfo = getServiceInfo(options.serviceSlug);
  
  // Gerar PDF
  const pdfBuffer = await generateChecklistPDFServer({...});
  
  // Enviar PDF via WhatsApp
  await sendWhatsAppDocument({
    to: normalizedPhone,
    document: pdfBuffer,
    fileName: `checklist-${options.serviceSlug}-${date}.pdf`,
    caption: "📄 Checklist de Documentos..."
  });
}
```

### 3. Passado `serviceSlug` na Criação do Agendamento
**Arquivo**: `app/api/appointments/route.ts`

```typescript
const notificationResult = await sendAppointmentNotification({
  phone: normalizedPhone,
  email: email.trim(),
  name: data.name,
  serviceName: data.service_name,
  serviceSlug: data.service_slug, // ✅ ADICIONADO
  appointmentDate: data.appointment_date,
  appointmentTime: data.appointment_time,
  type: 'confirmation',
});
```

## 📋 Fluxo Completo Agora

1. Cliente preenche o formulário de agendamento
2. Sistema cria o agendamento no banco de dados
3. Sistema envia notificação de confirmação:
   - ✅ Mensagem de texto via WhatsApp
   - ✅ PDF do checklist via WhatsApp (NOVO!)
4. Cliente recebe:
   - Mensagem: "Olá [Nome]! Seu agendamento foi confirmado..."
   - PDF anexado: Com todos os documentos necessários

## 📄 Conteúdo do PDF

O PDF inclui:
- ✅ Informações do cliente e consulta
- ✅ Data e hora do agendamento
- ✅ Barra de progresso
- ✅ **TODOS os documentos do serviço** (obrigatórios e opcionais)
- ✅ Badges de "OBRIGATÓRIO" e "OPCIONAL"
- ✅ Descrições dos documentos
- ✅ Aviso destacado sobre documentos obrigatórios

## 🧪 Como Testar

### Teste Manual:
1. Certifique-se de que o WhatsApp está conectado:
   ```bash
   npx tsx scripts/start-whatsapp-server.ts
   ```

2. Faça um agendamento pelo site:
   - Acesse: http://localhost:3000/agendar
   - Preencha o formulário
   - Complete o agendamento

3. Verifique no WhatsApp:
   - Mensagem de confirmação deve chegar
   - PDF deve chegar logo após (alguns segundos de diferença)

### Logs para Verificar:
```
[NOTIFICATIONS] ✅ WhatsApp enviado com sucesso!
[NOTIFICATIONS] Gerando PDF do checklist para [Nome]...
[NOTIFICATIONS] PDF gerado! Tamanho: X KB
[NOTIFICATIONS] ✅ PDF enviado com sucesso via WhatsApp!
```

## ⚠️ Tratamento de Erros

- Se o PDF falhar ao ser gerado/enviado, a mensagem de confirmação ainda é enviada
- Logs detalhados ajudam a identificar problemas
- O agendamento não falha se o PDF não for enviado

## 🎯 Resultado

Agora, **toda confirmação de agendamento** inclui:
1. ✅ Mensagem de confirmação personalizada
2. ✅ PDF do checklist de documentos
3. ✅ Tudo automático e gratuito via Baileys

O cliente recebe tudo que precisa para se preparar para a consulta!

