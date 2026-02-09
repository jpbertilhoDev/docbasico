/**
 * Serviço de envio de SMS via Email-to-SMS Gateway
 * 
 * COMO FUNCIONA:
 * - Você envia um email para um endereço especial da operadora
 * - Exemplo: 912345678@mail2meo.pt
 * - A operadora converte o email em SMS e entrega no número
 * 
 * VANTAGENS:
 * ✅ TOTALMENTE GRATUITO
 * ✅ Sem limites de envio (dependendo da operadora)
 * ✅ Funciona com qualquer serviço de email (Gmail, etc.)
 * 
 * DESVANTAGENS:
 * ❌ Funciona APENAS com números da mesma operadora
 * ❌ Nem todas as operadoras suportam
 * ❌ Pode ter limite de caracteres (geralmente 160)
 * ❌ Não é 100% confiável (pode ir para spam)
 * ❌ Não recebe confirmação de entrega
 * 
 * OPERADORAS PORTUGUESAS QUE SUPORTAM:
 * - MEO: numero@mail2meo.pt
 * - Vodafone: numero@sms.vodafone.pt
 * - NOS: numero@sms.nos.pt
 */

interface EmailToSMSOptions {
  to: string; // Número: 912345678 ou +351912345678
  message: string;
  carrier?: 'meo' | 'vodafone' | 'nos' | 'auto';
}

interface EmailToSMSResult {
  success: boolean;
  error?: string;
  method?: string;
}

// Gateways Email-to-SMS por país e operadora
const carrierGateways: Record<string, Record<string, string>> = {
  '351': { // Portugal
    'meo': '@mail2meo.pt',
    'vodafone': '@sms.vodafone.pt',
    'nos': '@sms.nos.pt',
  },
  '55': { // Brasil
    'vivo': '@sms.vivo.com.br',
    'claro': '@sms.claro.com.br',
    'tim': '@sms.tim.com.br',
    'oi': '@sms.oi.com.br',
  },
};

/**
 * Detecta a operadora baseado no número (não é 100% preciso)
 * Em produção, você pode pedir ao usuário qual operadora usa
 */
function detectCarrier(phoneNumber: string): 'meo' | 'vodafone' | 'nos' {
  // Remover código do país
  const number = phoneNumber.replace(/^\+?351/, '').replace(/\D/g, '');
  
  // Prefixos comuns (não é 100% preciso, mas ajuda)
  // MEO: geralmente números que começam com 91, 92, 93, 96
  // Vodafone: 91, 92, 93, 96 também (sobreposição)
  // NOS: 91, 92, 93, 96 também
  
  // Como não há como detectar com certeza, vamos tentar MEO primeiro
  // (é uma das mais comuns e geralmente funciona melhor)
  return 'meo';
}

/**
 * Converte número para formato do gateway
 */
function formatNumberForGateway(phoneNumber: string, countryCode: string): string {
  // Remover código do país e espaços
  let number = phoneNumber.replace(/^\+?/, '').replace(/\D/g, '');
  
  // Remover código do país se presente
  if (number.startsWith(countryCode)) {
    number = number.substring(countryCode.length);
  }
  
  // Remover zero inicial se houver (formato nacional)
  if (number.startsWith('0')) {
    number = number.substring(1);
  }
  
  return number;
}

/**
 * Envia SMS via Email-to-SMS Gateway
 */
export async function sendEmailToSMS({ 
  to, 
  message, 
  carrier = 'auto' 
}: EmailToSMSOptions): Promise<EmailToSMSResult> {
  // Limitar mensagem a 160 caracteres (limite comum de SMS)
  const smsMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;
  
  // Detectar país pelo número
  const normalizedNumber = to.replace(/\D/g, '');
  let countryCode = '';
  let phoneNumber = normalizedNumber;
  
  // Detectar código do país
  if (normalizedNumber.startsWith('351')) {
    countryCode = '351';
    phoneNumber = normalizedNumber;
  } else if (normalizedNumber.startsWith('55')) {
    countryCode = '55';
    phoneNumber = normalizedNumber;
  } else if (normalizedNumber.length === 9 && normalizedNumber.startsWith('9')) {
    // Assumir Portugal se tiver 9 dígitos começando com 9
    countryCode = '351';
    phoneNumber = '351' + normalizedNumber;
  } else {
    return {
      success: false,
      error: 'Email-to-SMS apenas disponível para números portugueses ou brasileiros',
    };
  }

  // Verificar se o país tem gateways configurados
  if (!carrierGateways[countryCode]) {
    return {
      success: false,
      error: `Email-to-SMS não disponível para código de país ${countryCode}`,
    };
  }

  // Determinar operadora
  let selectedCarrier: string;
  if (carrier === 'auto') {
    selectedCarrier = detectCarrier(phoneNumber);
  } else {
    selectedCarrier = carrier;
  }

  // Verificar se a operadora tem gateway
  if (!carrierGateways[countryCode][selectedCarrier]) {
    return {
      success: false,
      error: `Gateway não disponível para operadora ${selectedCarrier}`,
    };
  }

  // Formatar número para o gateway
  const formattedNumber = formatNumberForGateway(phoneNumber, countryCode);
  const gateway = carrierGateways[countryCode][selectedCarrier];
  const emailTo = `${formattedNumber}${gateway}`;

  // Enviar email via API route (que usa SMTP configurado)
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailTo,
        subject: '', // SMS não tem assunto, mas alguns gateways precisam
        text: smsMessage,
        html: smsMessage, // Alguns gateways preferem HTML
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Erro ao enviar email para gateway SMS',
        method: `email-to-sms-${selectedCarrier}`,
      };
    }

    return {
      success: true,
      method: `email-to-sms-${selectedCarrier}`,
    };
  } catch (error: any) {
    console.error('Error sending email-to-SMS:', error);
    return {
      success: false,
      error: error.message || 'Erro ao enviar email para gateway SMS',
      method: `email-to-sms-${selectedCarrier}`,
    };
  }
}

/**
 * Verifica se um número pode usar Email-to-SMS
 */
export function canUseEmailToSMS(phoneNumber: string): boolean {
  const normalized = phoneNumber.replace(/\D/g, '');
  
  // Verificar se é número português ou brasileiro
  return normalized.startsWith('351') || normalized.startsWith('55') || 
         (normalized.length === 9 && normalized.startsWith('9'));
}

