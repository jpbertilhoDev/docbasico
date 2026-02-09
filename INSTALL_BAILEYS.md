# 📦 Instalação do Baileys

## Passo 1: Instalar Dependências

Execute no terminal:

```bash
npm install
```

Isso instalará:
- `@whiskeysockets/baileys` - Biblioteca principal do Baileys
- `@hapi/boom` - Para tratamento de erros
- `pino` - Para logs
- `node-cache` - Para cache de mensagens
- `tsx` - Para executar scripts TypeScript

## Passo 2: Instalar tsx (se necessário)

Se o `tsx` não for instalado automaticamente:

```bash
npm install -D tsx
```

## Passo 3: Iniciar Servidor WhatsApp

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

## Passo 4: Escanear QR Code

Quando o servidor iniciar, aparecerá um QR code no terminal. Escaneie com seu WhatsApp:

1. Abra WhatsApp no celular
2. Vá em **Configurações** → **Aparelhos conectados** → **Conectar um aparelho**
3. Escaneie o QR code

## ✅ Pronto!

Após escanear, o WhatsApp estará conectado e pronto para enviar mensagens!

