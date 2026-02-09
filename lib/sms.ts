/**
 * Serviço de envio de SMS usando Twilio
 * Para usar, configure as variáveis de ambiente:
 * TWILIO_ACCOUNT_SID
 * TWILIO_AUTH_TOKEN
 * TWILIO_PHONE_NUMBER
 */

interface SMSOptions {
  to: string; // Número de telefone no formato E.164 (ex: +351912345678)
  message: string;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envia SMS usando Twilio
 */
export async function sendSMS({ to, message }: SMSOptions): Promise<SMSResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // Verificar se as variáveis de ambiente estão configuradas
  if (!accountSid || !authToken || !fromNumber) {
    console.error('Twilio credentials not configured');
    return {
      success: false,
      error: 'Serviço de SMS não configurado. Entre em contacto com o administrador.',
    };
  }

  try {
    // Usar a API do Twilio
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: to,
          Body: message,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio API error:', data);
      return {
        success: false,
        error: data.message || 'Erro ao enviar SMS',
      };
    }

    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.message || 'Erro ao enviar SMS',
    };
  }
}

/**
 * Formata mensagem de confirmação de agendamento
 */
export function formatAppointmentConfirmationSMS(appointment: {
  name: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}): string {
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `Olá ${appointment.name}! ✅\n\n` +
    `O seu agendamento para ${appointment.serviceName} foi confirmado.\n\n` +
    `📅 Data: ${formattedDate}\n` +
    `🕐 Hora: ${appointment.appointmentTime}\n\n` +
    `Em breve entraremos em contacto para confirmar os detalhes.\n\n` +
    `Obrigado!`;
}

/**
 * Formata mensagem de lembrete de agendamento
 */
export function formatAppointmentReminderSMS(appointment: {
  name: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  documentsReminder?: any;
}): string {
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let message = `Olá ${appointment.name}! 📅\n\n` +
    `Lembrete: Tem um agendamento amanhã:\n\n` +
    `📋 Serviço: ${appointment.serviceName}\n` +
    `📅 Data: ${formattedDate}\n` +
    `🕐 Hora: ${appointment.appointmentTime}\n\n`;

  // Adicionar lembretes de documentos se disponível
  if (appointment.documentsReminder && Array.isArray(appointment.documentsReminder)) {
    const requiredDocs = appointment.documentsReminder
      .filter((doc: any) => doc.required)
      .slice(0, 3)
      .map((doc: any) => `• ${doc.name}`)
      .join('\n');
    
    if (requiredDocs) {
      message += `📄 Documentos necessários:\n${requiredDocs}\n\n`;
    }
  }

  message += `Até breve!`;

  return message;
}

/**
 * Formata mensagem de confirmação imediata após agendamento
 */
export function formatImmediateConfirmationSMS(appointment: {
  name: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}): string {
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `Olá ${appointment.name}! ✅\n\n` +
    `O seu agendamento foi registado com sucesso:\n\n` +
    `📋 ${appointment.serviceName}\n` +
    `📅 ${formattedDate} às ${appointment.appointmentTime}\n\n` +
    `Receberá um lembrete 24h antes do agendamento.\n\n` +
    `Obrigado!`;
}

