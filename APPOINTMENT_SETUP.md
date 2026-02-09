# Assistente de Agendamento Inteligente - Setup

## 🎉 Funcionalidades Implementadas

O assistente de agendamento inteligente está completo e inclui:

1. **Fluxo de Agendamento em 4 Passos:**
   - Passo 1: Informações do serviço e documentos necessários
   - Passo 2: Seleção de data e hora
   - Passo 3: Dados pessoais
   - Passo 4: Confirmação

2. **Funcionalidades Inteligentes:**
   - Sugestão automática de documentos baseado no serviço
   - Notas de preparação personalizadas
   - Verificação de disponibilidade em tempo real
   - Lembretes de documentos antes da consulta

3. **Sistema de Horários:**
   - Horários disponíveis de segunda a sexta
   - Horários: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00
   - Verificação automática de conflitos

## 📋 Setup do Banco de Dados

### 1. Executar o Schema SQL

Execute o arquivo `supabase/appointments-schema.sql` no Supabase:

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo de `supabase/appointments-schema.sql`
4. Execute o script

Isso criará:
- Tabela `appointments` - para armazenar agendamentos
- Tabela `available_slots` - para gerenciar horários disponíveis
- Slots iniciais para os próximos 30 dias

### 2. Verificar RLS Policies

As políticas de Row Level Security já estão configuradas no schema:
- Público pode criar agendamentos
- Público pode visualizar slots disponíveis
- Público pode visualizar seus próprios agendamentos

## 🚀 Como Usar

### Para Usuários

1. **Acessar Página de Agendamento:**
   - Clique em "Agendar" no header
   - Ou acesse `/agendar`

2. **Selecionar Serviço:**
   - Escolha o serviço desejado
   - Ou acesse diretamente: `/agendar?servico=nome-do-servico`

3. **Seguir o Fluxo:**
   - Passo 1: Ver documentos necessários
   - Passo 2: Escolher data e hora
   - Passo 3: Preencher dados pessoais
   - Passo 4: Confirmar agendamento

### Para Administradores

**Ver Agendamentos:**
- Acesse o Supabase Dashboard
- Vá em **Table Editor** > **appointments**
- Veja todos os agendamentos criados

**Gerenciar Horários:**
- Vá em **Table Editor** > **available_slots**
- Edite disponibilidade de horários
- Adicione novos slots se necessário

## 📝 Serviços Disponíveis

O sistema suporta os seguintes serviços com documentos e notas personalizadas:

- Renovação de Residência
- Visto para Portugal
- Processo de Nacionalidade
- NIF
- Segurança Social
- Cartão Cidadão
- Reconhecimento de Faturas
- Agregado Familiar
- Envio do IRS
- Constituição de Empresa
- Consultoria Empresarial

## 🔧 Personalização

### Adicionar Novos Serviços

Edite `lib/services-documents.ts` para adicionar novos serviços:

```typescript
"novo-servico": {
  slug: "novo-servico",
  name: "Novo Serviço",
  documents: [
    { name: "Documento 1", required: true },
    { name: "Documento 2", required: false },
  ],
  estimatedDuration: 60,
  preparationNotes: [
    "Nota 1",
    "Nota 2",
  ],
}
```

### Alterar Horários Disponíveis

Edite o script SQL em `supabase/appointments-schema.sql` na seção de inserção de slots:

```sql
time_slots TIME[] := ARRAY[
  '09:00'::TIME, '10:00'::TIME, '11:00'::TIME, 
  '14:00'::TIME, '15:00'::TIME, '16:00'::TIME, '17:00'::TIME
];
```

### Alterar Dias de Funcionamento

No mesmo script SQL, altere a condição:

```sql
-- Apenas segunda a sexta (1-5)
IF day_of_week BETWEEN 1 AND 5 THEN
```

## 📧 Próximos Passos (Opcional)

1. **Sistema de Email:**
   - Integrar com Resend/SendGrid para envio de confirmações
   - Enviar lembretes 24h antes do agendamento

2. **Notificações:**
   - Notificações push para novos agendamentos
   - Lembretes de documentos

3. **Dashboard Admin:**
   - Página no admin para gerenciar agendamentos
   - Calendário visual de agendamentos

4. **Integração com Calendário:**
   - Sincronização com Google Calendar
   - Exportar agendamentos

## 🐛 Troubleshooting

**Problema: Não aparecem horários disponíveis**
- Verifique se o script SQL foi executado corretamente
- Verifique se há slots na tabela `available_slots`
- Verifique se a data não é no passado

**Problema: Erro ao criar agendamento**
- Verifique se todos os campos obrigatórios foram preenchidos
- Verifique se o email está no formato correto
- Verifique se a data/hora não é no passado

**Problema: Slots não atualizam após agendamento**
- Verifique se o trigger está funcionando
- Verifique se há conflitos de agendamento na mesma data/hora

## ✅ Status

- ✅ Schema SQL criado
- ✅ API routes implementadas
- ✅ Componente de assistente criado
- ✅ Página de agendamento criada
- ✅ Integração com serviços existentes
- ✅ Sistema de horários disponíveis
- ✅ Link no header adicionado

O sistema está pronto para uso!

