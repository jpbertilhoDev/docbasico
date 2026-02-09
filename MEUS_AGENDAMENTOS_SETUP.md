# Meus Agendamentos - Configuração

## ✅ Funcionalidade Implementada

A funcionalidade "Meus Agendamentos" permite que usuários consultem e cancelem seus próprios agendamentos usando email + telefone.

## 📋 O Que Foi Criado

### 1. Página Pública
- **Rota**: `/meus-agendamentos`
- **Arquivo**: `app/meus-agendamentos/page.tsx`
- **Funcionalidades**:
  - Busca de agendamentos por email + telefone
  - Visualização de todos os agendamentos do usuário
  - Cancelamento de agendamentos futuros (até 2 horas antes)
  - Visualização de documentos necessários
  - Status dos agendamentos (Pendente, Confirmado, Cancelado, Concluído)

### 2. API Routes

#### `/api/appointments/lookup` (POST)
- Busca agendamentos por email + telefone
- Normaliza telefones para comparação (últimos 9 dígitos)
- Retorna lista de agendamentos encontrados

#### `/api/appointments/[id]/cancel` (POST)
- Cancela um agendamento específico
- Valida email + telefone antes de cancelar
- Atualiza status para "cancelled"
- Verifica se já está cancelado ou concluído

### 3. Integração com Dashboard Admin

Quando um usuário cancela um agendamento:
- ✅ O status muda para "cancelled" no banco de dados
- ✅ Aparece automaticamente no dashboard admin com badge "Cancelado"
- ✅ Pode ser filtrado no dashboard usando o filtro de status
- ✅ O admin pode ver quem cancelou e quando

## 🔧 Configuração Necessária

### 1. Executar Script SQL no Supabase

Execute o script `supabase/fix-appointments-public-lookup.sql` no Supabase SQL Editor:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole e execute o conteúdo de `supabase/fix-appointments-public-lookup.sql`

Este script:
- Permite que usuários públicos consultem agendamentos
- Permite que usuários públicos cancelem seus próprios agendamentos
- Mantém todas as permissões de admin intactas

### 2. Link no Header

O link "Meus Agendamentos" já foi adicionado ao Header e aparece na navegação.

## 🎯 Como Funciona

### Para o Usuário:

1. Acessa `/meus-agendamentos`
2. Digita email e telefone usados no agendamento
3. Clica em "Buscar Agendamentos"
4. Vê todos os seus agendamentos
5. Pode cancelar agendamentos futuros (até 2 horas antes)

### Para o Admin:

1. Acessa `/admin/appointments`
2. Vê todos os agendamentos, incluindo cancelados
3. Pode filtrar por status (incluindo "Cancelados")
4. Vê quando um agendamento foi cancelado pelo usuário

## 🔒 Segurança

- ✅ Validação de email e telefone antes de mostrar agendamentos
- ✅ Validação dupla (email + telefone) antes de cancelar
- ✅ Comparação de telefones normalizada (últimos 9 dígitos)
- ✅ Não permite cancelar agendamentos já concluídos
- ✅ Não permite cancelar menos de 2 horas antes do agendamento
- ✅ RLS policies garantem que apenas o próprio usuário pode cancelar seus agendamentos

## 📱 Interface

- Design responsivo (mobile-friendly)
- Feedback visual claro (loading, erros, sucesso)
- Badges de status coloridos
- Informações completas do agendamento
- Lista de documentos necessários

## 🧪 Testar

1. Crie um agendamento de teste em `/agendar`
2. Acesse `/meus-agendamentos`
3. Digite o email e telefone usados
4. Verifique se o agendamento aparece
5. Tente cancelar (se for futuro)
6. Verifique no dashboard admin se aparece como "Cancelado"

## ⚠️ Notas Importantes

- A busca é case-insensitive para email
- A comparação de telefone usa os últimos 9 dígitos (para lidar com códigos de país diferentes)
- Agendamentos cancelados não podem ser cancelados novamente
- Agendamentos concluídos não podem ser cancelados
- O cancelamento só é permitido até 2 horas antes do agendamento

