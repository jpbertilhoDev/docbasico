# Configuração das Variáveis de Ambiente

## ⚠️ IMPORTANTE

Crie manualmente o arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrfwtnvwyqaynylykcrt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_Jn2i6SIOeZcSb3rGNBLaDQ_FfODA8Id
```

## 📝 Passos

1. Na raiz do projeto (`docbasico/`), crie um arquivo chamado `.env.local`
2. Cole o conteúdo acima
3. Salve o arquivo
4. O arquivo já está no `.gitignore`, então não será commitado

## ✅ Verificação

Após criar o arquivo, execute:

```bash
npm install
npm run dev
```

O projeto deve conectar ao Supabase sem erros.

