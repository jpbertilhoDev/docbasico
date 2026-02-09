# 🔧 Corrigir Política RLS para DELETE

## ❌ Problema

O DELETE está retornando sucesso, mas o agendamento ainda existe no banco. Isso indica que a política RLS está bloqueando silenciosamente.

## ✅ Solução

Execute este script SQL no Supabase:

### 1. Acesse o Supabase Dashboard

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**

### 2. Execute o Script

Copie e cole este script:

```sql
-- Remover política antiga (se existir)
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;

-- Criar política correta para DELETE
-- Usa auth.uid() que é mais confiável que auth.role()
CREATE POLICY "Authenticated users can delete appointments" ON appointments
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Verificar se a política foi criada
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'appointments' AND cmd = 'DELETE';
```

### 3. Verificar Resultado

O último SELECT deve retornar a política criada com:
- `cmd`: `DELETE`
- `qual`: `(auth.uid() IS NOT NULL)`

## 🔍 Diferença

**Política Antiga (não funcionava):**
```sql
USING (auth.role() = 'authenticated')
```

**Política Nova (funciona):**
```sql
USING (auth.uid() IS NOT NULL)
```

A diferença é que `auth.uid()` verifica se há um usuário autenticado (retorna o UUID do usuário), enquanto `auth.role()` pode não estar funcionando corretamente.

## ✅ Após Executar

1. Recarregue a página do admin
2. Tente excluir um agendamento novamente
3. Deve funcionar agora!

## 🧪 Testar

Depois de executar o script, teste:

1. Acesse: `/admin/appointments`
2. Clique em "Excluir" em um agendamento de teste
3. Confirme
4. O agendamento deve ser removido permanentemente

