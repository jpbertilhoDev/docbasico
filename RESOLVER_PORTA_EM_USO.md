# 🔧 Resolver Erro: Porta 3001 em Uso

## ❌ Erro

```
Error: listen EADDRINUSE: address already in use :::3001
```

## ✅ Soluções

### Opção 1: Usar Script PowerShell (Recomendado)

```powershell
.\scripts\check-port.ps1
```

O script irá:
1. Verificar se a porta 3001 está em uso
2. Mostrar quais processos estão usando
3. Perguntar se deseja encerrar

### Opção 2: Manual (Windows)

#### 1. Verificar qual processo está usando a porta:

```powershell
netstat -ano | findstr :3001
```

#### 2. Ver o PID (último número da linha):

```
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       21180
                                                                    ^^^^^
                                                                    Este é o PID
```

#### 3. Encerrar o processo:

```powershell
taskkill /F /PID 21180
```

Substitua `21180` pelo PID que você encontrou.

### Opção 3: Mudar a Porta

Se preferir usar outra porta:

1. Edite `scripts/start-whatsapp-server.ts`
2. Mude `const PORT = 3001;` para outra porta (ex: `3002`)
3. Atualize também `lib/whatsapp.ts` para usar a nova porta

## 🔍 Verificar se Funcionou

Depois de encerrar o processo, tente novamente:

```bash
npx tsx scripts/start-whatsapp-server.ts
```

Deve ver:
```
🌐 API HTTP do WhatsApp rodando em: http://localhost:3001
```

## 💡 Prevenção

O script agora mostra uma mensagem melhor quando a porta está em uso:

```
❌ Erro: A porta 3001 já está em uso!

💡 Soluções:
   1. Pare o processo que está usando a porta 3001
   2. Ou altere a porta no arquivo start-whatsapp-server.ts
```

## 🚀 Próximos Passos

Depois de resolver, inicie o servidor:

```bash
npx tsx scripts/start-whatsapp-server.ts
```

E verifique o status:

```bash
curl http://localhost:3001/status
```

