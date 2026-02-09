# Checklist Interativo de Documentos - Setup

## 📋 Funcionalidades Implementadas

### ✅ O que foi criado:

1. **Schema do Banco de Dados** (`supabase/document-checklists-schema.sql`)
   - Tabela `document_checklists` para armazenar checklists
   - Tabela `checklist_documents` para documentos individuais
   - Triggers automáticos para atualizar progresso
   - RLS policies para segurança

2. **Componente DocumentChecklist** (`components/DocumentChecklist.tsx`)
   - Checklist interativo com marcação de documentos
   - Barra de progresso visual
   - Dicas e notas de preparação
   - Botões de impressão e download PDF (em desenvolvimento)

3. **API Routes** (`app/api/checklists/[appointmentId]/route.ts`)
   - GET: Buscar checklist de um agendamento
   - PUT: Atualizar checklist
   - POST: Criar checklist inicial

4. **Integrações:**
   - ✅ Páginas de serviços (exemplo: renovacao-residencia)
   - ✅ Fluxo de agendamento (criação automática)
   - ✅ Página "Meus Agendamentos" (visualização e edição)

## 🚀 Como Configurar

### 1. Executar Schema no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute o arquivo `supabase/document-checklists-schema.sql`
4. Verifique se as tabelas foram criadas:
   - `document_checklists`
   - `checklist_documents`

### 2. Testar Funcionalidade

#### Teste 1: Checklist na Página de Serviço
1. Acesse `/servicos/renovacao-residencia`
2. Role até a seção "Preparação para Consulta"
3. Marque os documentos que você já tem
4. Veja o progresso atualizar em tempo real

#### Teste 2: Checklist no Agendamento
1. Acesse `/agendar?servico=renovacao-residencia`
2. Complete o agendamento
3. Após confirmar, o checklist será criado automaticamente
4. Acesse "Meus Agendamentos" para ver o checklist

#### Teste 3: Checklist em "Meus Agendamentos"
1. Acesse `/agendar` e vá na aba "Meus Agendamentos"
2. Busque seus agendamentos com email e telefone
3. Clique em "Ver Checklist" em um agendamento
4. Marque os documentos conforme prepara
5. O progresso é salvo automaticamente

## 📱 Funcionalidades do Checklist

### Para o Cliente:
- ✅ Marcar documentos como obtidos
- ✅ Ver progresso visual (barra de progresso)
- ✅ Dicas de preparação por serviço
- ✅ Lembretes de documentos obrigatórios
- ✅ Acesso via mobile-friendly

### Para a Empresa (em desenvolvimento):
- ⏳ Verificação presencial no espaço físico
- ⏳ Notas do atendente sobre documentos
- ⏳ Geração de PDF para impressão
- ⏳ Relatórios de documentos faltantes

## 🔄 Próximos Passos

### Fase 2: Verificação Presencial (Admin)
- Criar página no admin para verificar documentos presencialmente
- Marcar documentos como "verificado pelo atendente"
- Adicionar notas sobre documentos faltantes

### Fase 3: Geração de PDF
- Implementar biblioteca de PDF (ex: `react-pdf` ou `jspdf`)
- Gerar PDF com checklist para impressão
- Incluir QR code para acesso online

### Fase 4: Notificações Automáticas
- Email 24h antes com checklist
- WhatsApp com link do checklist
- Lembretes de documentos faltantes

## 📊 Estrutura de Dados

### document_checklists
```sql
- id: UUID
- appointment_id: UUID (FK para appointments)
- service_slug: VARCHAR
- service_name: VARCHAR
- client_name, email, phone: VARCHAR
- total_documents: INTEGER
- checked_documents: INTEGER
- progress_percentage: INTEGER (0-100)
- status: VARCHAR (in_progress, completed, verified)
- verified_by_staff: BOOLEAN
- created_at, updated_at: TIMESTAMP
```

### checklist_documents
```sql
- id: UUID
- checklist_id: UUID (FK para document_checklists)
- document_name: VARCHAR
- document_description: TEXT
- required: BOOLEAN
- document_order: INTEGER
- checked: BOOLEAN
- checked_at: TIMESTAMP
- verified_by_staff: BOOLEAN
- verified_at: TIMESTAMP
- client_notes, staff_notes: TEXT
```

## 🎯 Benefícios

### Para o Cliente:
- ✅ Reduz esquecimentos de documentos
- ✅ Organiza a preparação
- ✅ Acesso fácil via mobile
- ✅ Lembretes automáticos (em breve)

### Para a Empresa:
- ✅ Menos consultas incompletas
- ✅ Clientes mais preparados
- ✅ Rastreamento de documentos
- ✅ Redução de retrabalho

## 🐛 Troubleshooting

### Checklist não aparece
- Verifique se o schema foi executado no Supabase
- Verifique se o `appointment_id` está correto
- Verifique os logs do console do navegador

### Progresso não atualiza
- Verifique se a API está retornando sucesso
- Verifique os logs do servidor
- Verifique se o trigger está funcionando no Supabase

### Erro ao salvar checklist
- Verifique as RLS policies no Supabase
- Verifique se o agendamento existe
- Verifique os logs da API

## 📝 Notas Importantes

- O checklist é criado automaticamente quando um agendamento é confirmado
- O progresso é calculado automaticamente via trigger no banco
- Os documentos são baseados em `lib/services-documents.ts`
- O checklist pode ser usado sem agendamento (nas páginas de serviços)

