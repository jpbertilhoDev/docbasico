# Lembretes de Checklist via WhatsApp com PDF

## ✅ Implementação Completa

O sistema de lembretes de checklist agora envia mensagens via WhatsApp (Baileys) com o PDF do checklist anexado!

## 🚀 Funcionalidades

### 1. Mensagem de Lembrete
- Enviada via WhatsApp usando Baileys
- Formato personalizado com data/hora do agendamento
- Link para o checklist online

### 2. PDF do Checklist
- Gerado automaticamente no servidor
- Inclui todos os documentos necessários
- Mostra progresso e status de cada documento
- Enviado como anexo no WhatsApp

## 📋 Como Funciona

### Fluxo Automático:
1. **Cron Job** chama `/api/checklists/reminders` diariamente
2. **Busca** agendamentos confirmados para o dia seguinte
3. **Gera PDF** do checklist para cada agendamento
4. **Envia mensagem** via WhatsApp com Baileys
5. **Anexa PDF** na mesma conversa

### Mensagem Enviada:
```
📋 *Lembrete de Documentos - [Serviço]*

Olá [Nome],

Sua consulta está agendada para *[Data]* às *[Hora]*.

Não se esqueça de verificar o checklist de documentos:
[Link do Checklist]

Prepare-se com antecedência para garantir que tem todos os documentos necessários.

*Até breve!*
```

### PDF Inclui:
- Informações do cliente e consulta
- Barra de progresso visual
- Lista completa de documentos
- Status de cada documento (obtido/pendente)
- Badges de obrigatório/opcional
- Descrições dos documentos

## 🔧 Configuração

### 1. Executar Schema do Banco
Execute `supabase/document-checklists-schema.sql` no Supabase.

### 2. Configurar Cron Job (Vercel)
Adicione ao `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/checklists/reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Isso enviará lembretes diariamente às 9h para agendamentos do dia seguinte.

### 3. WhatsApp Deve Estar Conectado
Certifique-se de que o servidor WhatsApp está rodando:
```bash
npx tsx scripts/start-whatsapp-server.ts
```

## 📱 Teste Manual

### Enviar Lembrete Manualmente:
```bash
curl -X POST http://localhost:3000/api/checklists/reminders
```

### Verificar Logs:
Os logs mostrarão:
- Agendamentos encontrados
- PDFs gerados
- Mensagens enviadas
- Erros (se houver)

## 🎯 Arquivos Modificados/Criados

### Novos:
- `lib/checklist-pdf.ts` - Geração de PDF no servidor
- `WHATSAPP_CHECKLIST_REMINDERS.md` - Esta documentação

### Modificados:
- `lib/whatsapp-baileys.ts` - Adicionada função `sendWhatsAppDocument`
- `app/api/checklists/reminders/route.ts` - Integração com WhatsApp e PDF

## 🔍 Detalhes Técnicos

### Geração de PDF:
- Usa `jspdf` para criar PDF no servidor
- Não requer DOM (funciona em API routes)
- Formato A4 otimizado
- Suporta múltiplas páginas

### Envio via Baileys:
- Usa `sendMessage` com tipo `document`
- Buffer do PDF enviado diretamente
- Caption opcional na mensagem
- Timeout de 30 segundos

### Tratamento de Erros:
- Se WhatsApp não estiver conectado, registra erro mas continua
- Se PDF falhar, envia apenas a mensagem
- Logs detalhados para debugging

## 📊 Estrutura do PDF

1. **Header**: Título e nome do serviço
2. **Informações**: Cliente, data, hora
3. **Progresso**: Barra visual e estatísticas
4. **Documentos**: Lista completa com status
5. **Footer**: Data de geração

## 🐛 Troubleshooting

### PDF não é enviado:
- Verifique se `jspdf` está instalado
- Verifique os logs do servidor
- Verifique se o Buffer foi gerado corretamente

### WhatsApp não envia:
- Verifique se Baileys está conectado
- Verifique o formato do número (sem +, apenas dígitos)
- Verifique os logs do WhatsApp

### Lembretes não são enviados:
- Verifique se o cron job está configurado
- Verifique se há agendamentos confirmados
- Verifique os logs da API

## ✅ Status

- ✅ Geração de PDF no servidor
- ✅ Envio via WhatsApp (Baileys)
- ✅ Mensagem personalizada
- ✅ PDF anexado automaticamente
- ✅ Tratamento de erros
- ✅ Logs detalhados

**Tudo pronto para uso!** 🎉

