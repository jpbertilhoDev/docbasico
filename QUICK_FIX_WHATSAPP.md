# 🚨 Correção Rápida - WhatsApp Não Conecta

## Problema: QR Code não aparece ou conexão falha imediatamente

Isso geralmente acontece quando há uma **sessão antiga corrompida** na pasta `whatsapp_auth/`.

## ✅ Solução Rápida (3 passos):

### 1. Limpar Autenticação Antiga

```bash
npx tsx scripts/clear-whatsapp-auth.ts
```

Isso vai remover a pasta `whatsapp_auth/` com a sessão antiga.

### 2. Executar o Script Novamente

```bash
npx tsx scripts/start-whatsapp.ts
```

### 3. Escanear o QR Code

Quando o QR code aparecer:
1. Abra WhatsApp no celular
2. Vá em: **Configurações** → **Aparelhos conectados** → **Conectar um aparelho**
3. Escaneie o QR code que apareceu no terminal

## 🔍 Se o QR Code Ainda Não Aparecer

### Verificar se o evento está sendo capturado:

O QR code só aparece quando o Baileys recebe do WhatsApp. Pode levar alguns segundos.

**Aguarde pelo menos 10-15 segundos** após executar o script.

### Se ainda não aparecer, verifique:

1. **Terminal suporta caracteres especiais?**
   - Tente usar PowerShell moderno ou Windows Terminal
   - Ou use o terminal integrado do VS Code

2. **Há erros no console?**
   - Verifique se há mensagens de erro
   - Compartilhe os erros para análise

3. **Desconecte outros dispositivos WhatsApp Web**
   - Abra WhatsApp no celular
   - Desconecte TODOS os dispositivos conectados
   - Tente novamente

## 📋 Checklist Completo

- [ ] Executei `npx tsx scripts/clear-whatsapp-auth.ts`
- [ ] Executei `npx tsx scripts/start-whatsapp.ts`
- [ ] Aguardei pelo menos 10 segundos
- [ ] Desconectei outros dispositivos WhatsApp Web
- [ ] Estou usando um terminal que suporta caracteres especiais
- [ ] Não há outros processos Node.js rodando

## 🆘 Se Nada Funcionar

Execute com logs detalhados. Edite temporariamente `lib/whatsapp-baileys.ts`:

```typescript
// Mude esta linha (linha ~88):
logger: pino({ level: 'silent' }),

// Para:
logger: pino({ level: 'debug' }),
```

Isso mostrará logs detalhados que podem ajudar a identificar o problema.

