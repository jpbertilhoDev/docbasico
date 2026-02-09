# 💳 Sistema de Pagamento Prévio - Solução Profissional para Portugal

Documento técnico com estratégias profissionais para implementar pagamento prévio em agendamentos.

---

## 🎯 **Problema a Resolver**

Alguns serviços requerem pagamento antecipado para confirmar o agendamento. Precisamos de um fluxo profissional que:
- ✅ Garanta o pagamento antes da confirmação
- ✅ Seja fácil para o cliente
- ✅ Funcione em Portugal (Multibanco, MB Way)
- ✅ Integre com WhatsApp para confirmações
- ✅ Seja seguro e rastreável

---

## 💡 **Soluções Recomendadas para Portugal**

### **Opção 1: EASYPAY (Recomendado) ⭐**

**Por que:**
- ✅ Empresa portuguesa, 100% legal em PT
- ✅ Suporta Multibanco, MB Way, Cartão
- ✅ Webhooks para confirmação automática
- ✅ API bem documentada
- ✅ Taxas competitivas (2-3%)

**Como funciona:**
```
1. Cliente escolhe serviço e data/hora
2. Sistema gera referência Multibanco via Easypay
3. Cliente paga no multibanco/MB Way/ATM
4. Easypay envia webhook → Sistema confirma agendamento
5. WhatsApp automático: "Pagamento confirmado!"
```

**Implementação:**
```typescript
// 1. Criar pagamento
const payment = await easypay.createPayment({
  value: 50.00, // Valor do serviço
  method: ['mb', 'mbw', 'cc'], // Multibanco, MB Way, Cartão
  customer: {
    name: clientName,
    email: clientEmail,
    phone: clientPhone
  }
});

// 2. Guardar referência no agendamento
await supabase.from('appointments').update({
  status: 'awaiting_payment',
  payment_reference: payment.reference,
  payment_entity: payment.entity,
  payment_expires_at: payment.expiration_date
}).eq('id', appointmentId);

// 3. Webhook recebe confirmação
app.post('/api/webhooks/easypay', async (req, res) => {
  const { status, reference } = req.body;
  
  if (status === 'success') {
    // Confirmar agendamento
    await supabase.from('appointments').update({
      status: 'confirmed',
      payment_confirmed_at: new Date()
    }).eq('payment_reference', reference);
    
    // Enviar WhatsApp
    await sendWhatsApp(phone, 'Pagamento confirmado! Seu agendamento está garantido.');
  }
});
```

---

### **Opção 2: Stripe (Internacional)**

**Por que:**
- ✅ Muito popular e confiável
- ✅ Suporta cartões internacionais
- ✅ Webhooks robustos
- ✅ Dashboard excelente

**Contra:**
- ❌ Não suporta Multibanco nativamente
- ❌ Requer conta bancária EU
- ❌ Taxas um pouco mais altas (2.9% + €0.25)

**Melhor para:**
- Clientes internacionais
- Pagamentos com cartão apenas
- Expansão futura para outros países

---

### **Opção 3: Sistema Híbrido (Manual + Automático)**

**Fluxo Recomendado:**

```
┌─────────────────────────────────────────────────────┐
│  CLIENTE AGENDA                                     │
│  Status: "Aguardando Pagamento"                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│  SISTEMA GERA:                                      │
│  • Referência Multibanco (Easypay/Manual)          │
│  • Link MB Way                                      │
│  • QR Code para pagamento                           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│  WHATSAPP AUTOMÁTICO:                               │
│  "Obrigado por agendar! Para confirmar, pague:     │
│  Entidade: 12345                                    │
│  Referência: 123 456 789                            │
│  Valor: €50,00                                      │
│  Validade: 24 horas                                 │
│  [Link MB Way]"                                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│  CLIENTE PAGA                                       │
│  (Multibanco/MB Way/Homebanking)                    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│  2 OPÇÕES:                                          │
│                                                      │
│  A) AUTOMÁTICO (Webhook Easypay):                   │
│     → Sistema detecta pagamento                     │
│     → Muda status para "Confirmado"                 │
│     → WhatsApp: "Pagamento confirmado!"             │
│                                                      │
│  B) MANUAL (Admin Dashboard):                       │
│     → Admin vê lista "Aguardando Pagamento"         │
│     → Admin confirma manualmente                    │
│     → Sistema envia WhatsApp                        │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ **Implementação Passo a Passo**

### **Fase 1: Estrutura do Banco de Dados**

```sql
-- Adicionar campos à tabela appointments
ALTER TABLE appointments 
ADD COLUMN payment_required BOOLEAN DEFAULT false,
ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending', 
  -- 'pending', 'awaiting', 'paid', 'expired', 'refunded'
ADD COLUMN payment_method VARCHAR(20),
  -- 'multibanco', 'mbway', 'card', 'cash'
ADD COLUMN payment_reference VARCHAR(50),
ADD COLUMN payment_entity VARCHAR(10),
ADD COLUMN payment_amount DECIMAL(10,2),
ADD COLUMN payment_expires_at TIMESTAMP,
ADD COLUMN payment_confirmed_at TIMESTAMP,
ADD COLUMN payment_proof_url TEXT;

-- Índices para performance
CREATE INDEX idx_appointments_payment_status ON appointments(payment_status);
CREATE INDEX idx_appointments_payment_reference ON appointments(payment_reference);
```

### **Fase 2: Configuração de Preços**

Edite `lib/bookable-services.ts`:

```typescript
export interface BookableService {
  slug: string;
  name: string;
  requiresPayment: boolean;
  price?: number; // ← NOVO: Preço do serviço
  paymentNote?: string;
  priority: number;
  badge?: string;
  category: 'empresarial' | 'documentacao' | 'outro';
}

export const BOOKABLE_SERVICES: BookableService[] = [
  {
    slug: "constituicao-empresa",
    name: "Constituição de Empresa",
    requiresPayment: true,
    price: 150.00, // ← NOVO
    paymentNote: "Pagamento prévio garante sua consultoria",
    priority: 1,
    badge: "EMPRESARIAL",
    category: 'empresarial'
  },
  // ... outros serviços
];
```

### **Fase 3: API Route para Pagamento**

Crie `app/api/payments/create/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { appointmentId, method } = await request.json();
    
    // 1. Buscar agendamento
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*, service_slug')
      .eq('id', appointmentId)
      .single();
    
    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }
    
    // 2. Buscar preço do serviço
    const service = getBookableService(appointment.service_slug);
    if (!service?.price) {
      return NextResponse.json({ error: 'Serviço sem preço configurado' }, { status: 400 });
    }
    
    // 3. Gerar referência de pagamento
    // OPÇÃO A: Com Easypay
    const paymentData = await easypay.createPayment({
      value: service.price,
      method: [method], // 'mb', 'mbw', 'cc'
      customer: {
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone
      }
    });
    
    // OPÇÃO B: Gerar referência manual (apenas para testes)
    const paymentData = {
      entity: '12345', // Sua entidade Multibanco
      reference: generateRandomReference(), // Função para gerar ref única
      amount: service.price,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    };
    
    // 4. Atualizar agendamento
    await supabase.from('appointments').update({
      payment_required: true,
      payment_status: 'awaiting',
      payment_method: method,
      payment_reference: paymentData.reference,
      payment_entity: paymentData.entity,
      payment_amount: service.price,
      payment_expires_at: paymentData.expires_at
    }).eq('id', appointmentId);
    
    // 5. Enviar WhatsApp com dados de pagamento
    await sendWhatsApp(appointment.phone, `
🎯 Agendamento Quase Confirmado!

Para garantir sua vaga em ${appointment.service_name}, 
complete o pagamento:

💳 **Dados de Pagamento**
Entidade: ${paymentData.entity}
Referência: ${paymentData.reference}
Valor: €${service.price.toFixed(2)}
Válido até: ${new Date(paymentData.expires_at).toLocaleString('pt-PT')}

📱 **MB Way**: [Link direto]
🏧 **Multibanco**: Use os dados acima
💻 **Homebanking**: Pagamentos > Serviços > Referências

✅ Após o pagamento, receberá confirmação automática!

Dúvidas? Responda esta mensagem.
    `);
    
    return NextResponse.json({ 
      success: true, 
      payment: paymentData 
    });
    
  } catch (error: any) {
    console.error('Erro ao criar pagamento:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar pagamento',
      details: error.message
    }, { status: 500 });
  }
}
```

### **Fase 4: Webhook para Confirmação Automática**

Crie `app/api/webhooks/payment/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { sendWhatsApp } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    // 1. Validar webhook (importante para segurança!)
    const signature = request.headers.get('x-easypay-signature');
    const SECRET = process.env.EASYPAY_WEBHOOK_SECRET;
    
    if (!validateWebhookSignature(signature, SECRET)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // 2. Processar notificação
    const data = await request.json();
    
    if (data.status === 'success' || data.status === 'paid') {
      const { reference } = data;
      
      // 3. Atualizar agendamento
      const { data: appointment } = await supabase
        .from('appointments')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          payment_confirmed_at: new Date()
        })
        .eq('payment_reference', reference)
        .select()
        .single();
      
      if (appointment) {
        // 4. Enviar confirmação por WhatsApp
        await sendWhatsApp(appointment.phone, `
✅ **Pagamento Confirmado!**

Olá ${appointment.name},

Seu agendamento para **${appointment.service_name}** foi confirmado!

📅 Data: ${new Date(appointment.appointment_date).toLocaleDateString('pt-PT')}
⏰ Horário: ${appointment.appointment_time}
📍 Local: [Seu endereço]

📋 **Próximos Passos:**
1. Prepare os documentos necessários
2. Chegue 10 minutos antes
3. Qualquer dúvida, responda esta mensagem

Até breve! 🎉
        `);
        
        console.log(`✅ Pagamento confirmado para agendamento ${appointment.id}`);
      }
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function validateWebhookSignature(signature: string | null, secret: string): boolean {
  // Implementar validação específica do Easypay
  // Geralmente é um HMAC SHA256
  return true; // Placeholder
}
```

---

## 📱 **Dashboard Admin para Gestão de Pagamentos**

Adicione em `app/admin/appointments/page.tsx`:

```typescript
// Filtro de status de pagamento
const [paymentFilter, setPaymentFilter] = useState<string>('all');

// Fetch com filtro
const fetchAppointments = async () => {
  let query = supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (paymentFilter === 'awaiting') {
    query = query.eq('payment_status', 'awaiting');
  }
  
  const { data } = await query;
  setAppointments(data || []);
};

// Botão para confirmar pagamento manualmente
const confirmPayment = async (id: string) => {
  await supabase.from('appointments').update({
    status: 'confirmed',
    payment_status: 'paid',
    payment_confirmed_at: new Date()
  }).eq('id', id);
  
  // Enviar WhatsApp de confirmação
  // ...
  
  fetchAppointments();
};
```

---

## 🔒 **Segurança e Boas Práticas**

### **1. Validação de Webhooks**
```typescript
// SEMPRE validar assinatura de webhooks
const crypto = require('crypto');

function validateWebhook(payload: string, signature: string, secret: string): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hash)
  );
}
```

### **2. Expiração de Referências**
```typescript
// Job para limpar agendamentos expirados
// Rodar diariamente via cron
export async function cleanupExpiredPayments() {
  const { data } = await supabase
    .from('appointments')
    .update({
      status: 'cancelled',
      payment_status: 'expired'
    })
    .eq('payment_status', 'awaiting')
    .lt('payment_expires_at', new Date())
    .select();
  
  // Enviar notificação
  for (const apt of data || []) {
    await sendWhatsApp(apt.phone, 
      'Seu agendamento expirou por falta de pagamento. Para reagendar, acesse nosso site.'
    );
  }
}
```

### **3. Logs e Auditoria**
```typescript
// Registrar todas as transações
await supabase.from('payment_logs').insert({
  appointment_id: id,
  action: 'payment_confirmed',
  reference: reference,
  amount: amount,
  timestamp: new Date()
});
```

---

## 💰 **Custos e Taxas (Portugal)**

### **Easypay:**
- Taxa: 2-3% + IVA
- Multibanco: ~€0.50 por transação
- MB Way: ~€0.30 por transação
- Sem custo de setup

### **Stripe:**
- Taxa: 2.9% + €0.25 por transação
- Sem custo de setup

### **Exemplo:**
```
Serviço: €150,00
Taxa Easypay (3%): €4.50
Você recebe: €145.50

vs

Taxa Stripe (2.9% + €0.25): €4.60
Você recebe: €145.15
```

---

## 🚀 **Roadmap de Implementação**

### **Semana 1: MVP**
- [ ] Adicionar campos no banco de dados
- [ ] Configurar preços em `bookable-services.ts`
- [ ] Criar API route para gerar referências **manualmente**
- [ ] Integrar com WhatsApp para enviar dados de pagamento
- [ ] Dashboard admin para confirmar pagamentos manualmente

### **Semana 2: Automação Parcial**
- [ ] Integrar com Easypay API
- [ ] Gerar referências Multibanco automaticamente
- [ ] Implementar webhook básico
- [ ] Testar fluxo completo

### **Semana 3: Automação Completa**
- [ ] Validação de webhooks com assinatura
- [ ] Confirmação automática de pagamentos
- [ ] Job para limpar agendamentos expirados
- [ ] Logs e auditoria

### **Semana 4: Refinamento**
- [ ] MB Way links diretos
- [ ] QR codes para pagamento
- [ ] Reembolsos automáticos (cancelamentos)
- [ ] Dashboard de relatórios financeiros

---

## 📞 **Suporte e Recursos**

- **Easypay:** https://docs.easypay.pt/
- **Multibanco:** https://www.multibanco.pt/
- **MB Way:** https://www.mbway.pt/
- **Stripe Portugal:** https://stripe.com/pt

---

## 🎉 **Conclusão**

**Recomendação Final: Opção Híbrida**

1. **MVP (Imediato):** Gerar referências manualmente + confirmação manual no admin
2. **v2 (1 mês):** Integrar Easypay para automação completa
3. **v3 (Futuro):** Adicionar Stripe para clientes internacionais

Isso permite começar **hoje** e evoluir gradualmente! 🚀

