# 🔧 Troubleshooting WhatsApp Baileys

## Problema: QR Code não aparece ou conexão falha

### Solução 1: Limpar Autenticação Antiga

Se você já tentou conectar antes e está tendo problemas, pode ser uma sessão antiga corrompida:

```bash
npx tsx scripts/clear-whatsapp-auth.ts
```

Depois execute novamente:
```bash
npx tsx scripts/start-whatsapp.ts
```

### Solução 2: Verificar se há Outro Processo Rodando

Certifique-se de que não há outro processo do WhatsApp rodando:

```bash
# Windows PowerShell
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*tsx*"}
```

Se encontrar processos, encerre-os antes de tentar novamente.

### Solução 3: Verificar Dependências

```bash
npm install
```

Certifique-se de que todas as dependências estão instaladas:
- `@whiskeysockets/baileys`
- `@hapi/boom`
- `pino`
- `node-cache`
- `qrcode-terminal`

### Solução 4: Verificar Versão do Node.js

Baileys requer Node.js 16+:

```bash
node --version
```

Se for menor que 16, atualize o Node.js.

### Solução 5: Limpar Cache do npm

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Solução 6: Verificar Firewall/Antivírus

Alguns firewalls ou antivírus podem bloquear a conexão WebSocket do Baileys. Tente:

1. Desabilitar temporariamente o firewall/antivírus
2. Adicionar exceção para Node.js
3. Verificar se a porta não está bloqueada

## Problema: QR Code aparece mas não é reconhecido

### Possíveis Causas:

1. **QR Code expirou**: QR codes do WhatsApp expiram rapidamente. Se não escanear em ~20 segundos, um novo será gerado.

2. **Terminal não suporta caracteres especiais**: Alguns terminais não exibem o QR code corretamente. Tente:
   - Usar PowerShell moderno ou Windows Terminal
   - Usar terminal do VS Code
   - Usar Git Bash

3. **QR Code cortado**: Ajuste o tamanho da janela do terminal para ver o QR code completo.

### Solução: Usar QR Code em Arquivo

Se o terminal não exibir corretamente, podemos modificar o código para salvar o QR code em um arquivo PNG. (Implementação futura)

## Problema: Conecta mas desconecta imediatamente

### Possíveis Causas:

1. **Sessão antiga corrompida**: Limpe a autenticação (Solução 1)
2. **WhatsApp Web já conectado em outro lugar**: Desconecte outros dispositivos
3. **Problema de rede**: Verifique sua conexão de internet

### Solução:

1. Limpe a autenticação:
   ```bash
   npx tsx scripts/clear-whatsapp-auth.ts
   ```

2. Desconecte todos os dispositivos do WhatsApp Web:
   - Abra WhatsApp no celular
   - Vá em: Configurações → Aparelhos conectados
   - Desconecte todos os dispositivos

3. Tente conectar novamente:
   ```bash
   npx tsx scripts/start-whatsapp.ts
   ```

## Problema: "WhatsApp já está conectado" mas não funciona

Isso significa que há uma sessão salva, mas pode estar inválida.

### Solução:

Limpe a autenticação e reconecte:
```bash
npx tsx scripts/clear-whatsapp-auth.ts
npx tsx scripts/start-whatsapp.ts
```

## Logs Úteis para Debug

Se o problema persistir, execute com logs detalhados. Modifique temporariamente:

```typescript
// Em lib/whatsapp-baileys.ts, mude:
logger: pino({ level: 'silent' }),
// Para:
logger: pino({ level: 'debug' }),
```

Isso mostrará logs detalhados que podem ajudar a identificar o problema.

## Verificar Status da Conexão

Você pode verificar se o WhatsApp está conectado via API:

```bash
curl http://localhost:3000/api/whatsapp/status
```

Ou acesse: `http://localhost:3000/api/whatsapp/status` no navegador.

## Contato e Suporte

Se nenhuma solução funcionar:

1. Verifique os [issues do Baileys no GitHub](https://github.com/WhiskeySockets/Baileys/issues)
2. Consulte a [documentação oficial](https://baileys.wiki)
3. Verifique se há atualizações do Baileys: `npm update @whiskeysockets/baileys`

