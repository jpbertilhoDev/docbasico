# 📧➡️📱 Email-to-SMS Explicado

## O que é Email-to-SMS?

Email-to-SMS é uma funcionalidade onde você **envia um email** para um endereço especial da operadora, e ela **converte automaticamente em SMS** e entrega no número do destinatário.

## Como Funciona?

### Exemplo Prático:

1. **Você quer enviar SMS para**: `912345678` (número português)

2. **Você envia um email para**: `912345678@mail2meo.pt`
   - O domínio `@mail2meo.pt` é o gateway da MEO
   - O número `912345678` é o destinatário

3. **A MEO recebe o email** e automaticamente:
   - Converte em SMS
   - Envia para o número `912345678`
   - O usuário recebe como SMS normal no celular

## Operadoras Portuguesas

### MEO
- **Gateway**: `numero@mail2meo.pt`
- **Exemplo**: `912345678@mail2meo.pt`
- **Limite**: Geralmente 160 caracteres
- **Custo**: GRATUITO ✅

### Vodafone
- **Gateway**: `numero@sms.vodafone.pt`
- **Exemplo**: `912345678@sms.vodafone.pt`
- **Limite**: Geralmente 160 caracteres
- **Custo**: GRATUITO ✅

### NOS
- **Gateway**: `numero@sms.nos.pt`
- **Exemplo**: `912345678@sms.nos.pt`
- **Limite**: Geralmente 160 caracteres
- **Custo**: GRATUITO ✅

## Vantagens ✅

1. **Totalmente Gratuito** - Não paga nada
2. **Sem Limites** - Pode enviar quantos quiser (dependendo da operadora)
3. **Usa Email Normal** - Funciona com Gmail, Resend, qualquer SMTP
4. **Simples** - Apenas envia email para endereço especial

## Desvantagens ❌

1. **Funciona Apenas com Números da Mesma Operadora**
   - Se o número é MEO, precisa usar `@mail2meo.pt`
   - Se é Vodafone, precisa usar `@sms.vodafone.pt`
   - **Problema**: Não sabemos qual operadora o usuário usa!

2. **Não é 100% Confiável**
   - Pode ir para spam
   - Algumas operadoras bloqueiam
   - Não recebe confirmação de entrega

3. **Limite de Caracteres**
   - Geralmente 160 caracteres (limite de SMS)
   - Mensagens longas são cortadas

4. **Nem Todas as Operadoras Suportam**
   - Funciona bem em Portugal
   - Funciona em alguns países (Brasil, etc.)
   - Não funciona em muitos países

## Como o Sistema Resolve o Problema da Operadora?

O sistema tenta **adivinhar** a operadora baseado no número, mas como não é 100% preciso, ele:

1. **Tenta MEO primeiro** (mais comum em Portugal)
2. Se falhar, você pode configurar manualmente
3. **Sempre tem Email como fallback** (sempre funciona)

## Exemplo de Uso no Código

```typescript
// O sistema detecta automaticamente que é número português
const result = await sendEmailToSMS({
  to: '+351912345678', // Número português
  message: 'Olá! Seu agendamento é amanhã às 10:00',
  carrier: 'auto', // Tenta detectar automaticamente
});

// Internamente, envia email para:
// 912345678@mail2meo.pt
```

## Por Que Não Usar Apenas Email-to-SMS?

Porque:
- ❌ Não sabemos a operadora do usuário
- ❌ Não é 100% confiável
- ❌ Pode ir para spam

**Solução**: Sistema híbrido que tenta WhatsApp primeiro, depois Email-to-SMS, e por último Email (que sempre funciona).

## Testando Email-to-SMS

### Teste Manual:

1. Envie um email para: `seu-numero@mail2meo.pt`
   - Substitua `seu-numero` pelo seu número MEO (sem código do país)
   - Exemplo: Se seu número é `912345678`, envie para `912345678@mail2meo.pt`

2. Você deve receber SMS no celular em alguns segundos

3. **Importante**: Funciona apenas se você for cliente MEO!

### Teste no Sistema:

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "912345678@mail2meo.pt",
    "subject": "",
    "text": "Teste de Email-to-SMS"
  }'
```

## Conclusão

Email-to-SMS é uma funcionalidade **interessante e gratuita**, mas tem limitações. Por isso, o sistema usa ela como **segunda opção** (depois do WhatsApp), e sempre tem Email como **fallback garantido**.

É uma forma inteligente de tentar enviar SMS sem pagar, mas não é a solução principal porque não é 100% confiável.

