# 📱 Configuração do WhatsApp com Baileys

Baileys é uma biblioteca **TOTALMENTE GRATUITA** que permite enviar mensagens WhatsApp diretamente, sem precisar de APIs pagas como Twilio.

## 🎯 Como Funciona

Baileys conecta ao WhatsApp Web (como quando você usa WhatsApp Web no navegador), mas de forma programática. É como ter um bot do WhatsApp rodando no seu servidor.

## ✅ Vantagens

- **100% Gratuito** - Não paga nada
- **Sem Limites** - Pode enviar quantas mensagens quiser
- **Alta Confiabilidade** - Funciona diretamente com WhatsApp
- **Fácil de Usar** - API simples e direta

## ⚠️ Requisitos

1. **Servidor sempre rodando** - Precisa manter a conexão ativa
2. **Escanear QR Code** - Uma vez para autenticar (como WhatsApp Web)
3. **Número WhatsApp** - Precisa de um número real do WhatsApp

## 📦 Instalação

As dependências já foram adicionadas ao `package.json`. Execute:

```bash
npm install
```

## 🚀 Como Usar

### 1. Iniciar Servidor WhatsApp

Execute o script para manter a conexão ativa:

```bash
npx tsx scripts/start-whatsapp.ts
```

Ou adicione ao `package.json`:

```json
{
  "scripts": {
    "whatsapp": "tsx scripts/start-whatsapp.ts"
  }
}
```

Depois execute:

```bash
npm run whatsapp
```

### 2. Escanear QR Code

Quando executar o script, aparecerá um QR code no terminal:

```
📱 Escaneie o QR code abaixo com seu WhatsApp:

████████████████████████████████
████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄█▀█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▀▀▀▀ █   █ ████
...
```

1. Abra o WhatsApp no seu celular
2. Vá em **Configurações** → **Aparelhos conectados** → **Conectar um aparelho**
3. Escaneie o QR code que apareceu no terminal

### 3. Pronto!

Após escanear, você verá:

```
✅ WhatsApp conectado!
💡 Mantenha este processo rodando para receber e enviar mensagens
```

## 🔧 Configuração em Produção

### Opção 1: Processo Separado (Recomendado)

Mantenha o servidor WhatsApp rodando em um processo separado:

```bash
# Terminal 1: Servidor WhatsApp
npm run whatsapp

# Terminal 2: Servidor Next.js
npm run dev
```

### Opção 2: PM2 (Para Produção)

Use PM2 para gerenciar processos:

```bash
npm install -g pm2

# Iniciar servidor WhatsApp
pm2 start scripts/start-whatsapp.ts --name whatsapp --interpreter tsx

# Iniciar Next.js
pm2 start npm --name nextjs -- start

# Ver status
pm2 status
```

### Opção 3: Docker

Crie um `Dockerfile` separado para o servidor WhatsApp ou use docker-compose.

## 📁 Estrutura de Arquivos

Após a primeira autenticação, será criada a pasta `whatsapp_auth/` com os arquivos de sessão:

```
whatsapp_auth/
  ├── creds.json
  ├── app-state-sync-key-*.json
  └── ...
```

**⚠️ IMPORTANTE**: Não commite esta pasta! Adicione ao `.gitignore`:

```
whatsapp_auth/
```

## 🧪 Testar

### 1. Verificar Status

```bash
curl http://localhost:3000/api/whatsapp/status
```

### 2. Enviar Mensagem de Teste

```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "351912345678",
    "message": "Teste de mensagem WhatsApp via Baileys!"
  }'
```

## 🔄 Reconexão Automática

O Baileys reconecta automaticamente se a conexão cair. Mas se você deslogar manualmente do WhatsApp Web, precisará escanear o QR code novamente.

## 🐛 Troubleshooting

### QR Code não aparece

- Verifique se o terminal suporta caracteres especiais
- Tente em outro terminal
- Verifique os logs para erros

### Conexão cai frequentemente

- Verifique sua conexão de internet
- Certifique-se de que o servidor está sempre rodando
- Baileys reconecta automaticamente, mas pode levar alguns segundos

### Mensagem não é enviada

1. Verifique se WhatsApp está conectado:
   ```bash
   curl http://localhost:3000/api/whatsapp/status
   ```

2. Verifique o formato do número:
   - Correto: `351912345678` (sem +, sem espaços)
   - Errado: `+351 912 345 678`

3. Verifique os logs do servidor para erros

### Precisa escanear QR code toda vez

Isso acontece se:
- Os arquivos de autenticação foram deletados
- Você deslogou manualmente do WhatsApp Web
- A sessão expirou (raro, mas pode acontecer)

**Solução**: Mantenha a pasta `whatsapp_auth/` segura e não a delete.

## 🔒 Segurança

1. **Nunca commite** a pasta `whatsapp_auth/`
2. **Proteja** o servidor WhatsApp (use autenticação se expor API)
3. **Use HTTPS** em produção
4. **Limite** quem pode enviar mensagens (validação de origem)

## 📚 Recursos

- [Baileys GitHub](https://github.com/WhiskeySockets/Baileys)
- [Documentação Baileys](https://github.com/WhiskeySockets/Baileys#readme)
- [Exemplos Baileys](https://github.com/WhiskeySockets/Baileys/tree/master/Example)

## 💡 Dicas

1. **Mantenha o servidor sempre rodando** - A conexão precisa estar ativa
2. **Use PM2 ou similar** - Para produção, use um gerenciador de processos
3. **Monitore os logs** - Para detectar problemas rapidamente
4. **Backup da autenticação** - Faça backup da pasta `whatsapp_auth/` (com cuidado!)

## 🎉 Pronto!

Agora você tem WhatsApp **100% gratuito** funcionando! O sistema híbrido tentará:

1. **WhatsApp (Baileys)** - Gratuito ✅
2. **Email-to-SMS** - Gratuito ✅
3. **Email** - Gratuito ✅

Tudo funcionando sem custos! 🚀

