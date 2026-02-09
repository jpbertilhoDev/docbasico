# Troubleshooting - Erro ao Criar Agendamento

## Erro 500 ao criar agendamento

Se você está recebendo erro 500 ao tentar criar um agendamento, siga estes passos:

### 1. Verificar se as tabelas existem no Supabase

Acesse o Supabase Dashboard e verifique se as tabelas existem:
- `appointments`
- `available_slots`

**Como verificar:**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Table Editor**
4. Verifique se as tabelas `appointments` e `available_slots` aparecem

### 2. Executar o Schema SQL

Se as tabelas não existem, execute o arquivo `supabase/appointments-schema.sql`:

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase/appointments-schema.sql` no seu editor
4. Cole todo o conteúdo no SQL Editor
5. Clique em **Run** ou pressione `Ctrl+Enter`

### 3. Verificar RLS Policies

Após criar as tabelas, verifique se as RLS policies estão ativas:

1. Vá em **Table Editor** > **appointments**
2. Clique em **Policies** (ou vá em **Authentication** > **Policies**)
3. Verifique se existem as seguintes policies:
   - "Public can create appointments" (INSERT)
   - "Public can view own appointments" (SELECT)
   - "Authenticated users can view all appointments" (SELECT)
   - "Authenticated users can update appointments" (UPDATE)

### 4. Verificar Variáveis de Ambiente

Certifique-se de que as variáveis estão configuradas no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua_key_aqui
```

### 5. Verificar Logs do Servidor

No terminal onde está rodando `npm run dev`, verifique os erros no console. O erro específico será mostrado lá.

### 6. Testar a Conexão

Crie um arquivo de teste temporário para verificar a conexão:

```typescript
// test-connection.ts (temporário)
import { supabase } from '@/lib/supabase/server';

async function test() {
  const { data, error } = await supabase
    .from('appointments')
    .select('count');
  
  console.log('Connection test:', { data, error });
}

test();
```

## Erros Comuns

### Erro: "relation 'appointments' does not exist"
**Solução:** Execute o schema SQL no Supabase

### Erro: "new row violates row-level security policy"
**Solução:** Verifique se as RLS policies estão configuradas corretamente

### Erro: "column does not exist"
**Solução:** Verifique se todas as colunas da tabela correspondem ao schema

## Próximos Passos

Após executar o schema SQL, tente criar um agendamento novamente. Se o erro persistir, verifique os logs do servidor para mais detalhes.

