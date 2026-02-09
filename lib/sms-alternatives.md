# Alternativas ao Twilio para SMS

Se preferir usar outro serviço de SMS, aqui estão algumas alternativas:

## 1. AWS SNS (Simple Notification Service)

### Vantagens:
- Integração fácil com AWS
- Preços competitivos
- Alta confiabilidade

### Configuração:
```typescript
// lib/sms-aws.ts
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendSMS({ to, message }: SMSOptions) {
  const command = new PublishCommand({
    PhoneNumber: to,
    Message: message,
  });

  const response = await snsClient.send(command);
  return { success: true, messageId: response.MessageId };
}
```

## 2. MessageBird

### Vantagens:
- Interface simples
- Boa documentação
- Suporte para múltiplos países

### Configuração:
```typescript
// lib/sms-messagebird.ts
import messagebird from "messagebird";

const mbClient = messagebird(process.env.MESSAGEBIRD_API_KEY!);

export async function sendSMS({ to, message }: SMSOptions) {
  return new Promise((resolve, reject) => {
    mbClient.messages.create(
      {
        originator: process.env.MESSAGEBIRD_ORIGINATOR!,
        recipients: [to],
        body: message,
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true, messageId: response.id });
        }
      }
    );
  });
}
```

## 3. Vonage (Nexmo)

### Vantagens:
- API moderna
- Boa cobertura internacional
- Preços competitivos

### Configuração:
```typescript
// lib/sms-vonage.ts
import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!,
});

export async function sendSMS({ to, message }: SMSOptions) {
  const response = await vonage.sms.send({
    to,
    from: process.env.VONAGE_FROM_NUMBER!,
    text: message,
  });

  return {
    success: response.messages[0].status === "0",
    messageId: response.messages[0]["message-id"],
  };
}
```

## 4. Serviços Portugueses

### Texto.pt
- Serviço português
- Preços em EUR
- Suporte em português

### SMS.pt
- API simples
- Focado no mercado português
- Boa relação qualidade/preço

## Como Trocar o Provedor

1. Substitua a função `sendSMS` em `lib/sms.ts`
2. Atualize as variáveis de ambiente
3. Teste o envio de SMS
4. Configure o cron job (mesmo processo)

