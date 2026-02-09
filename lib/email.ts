/**
 * Serviço de envio de Email GRATUITO
 * Opções:
 * 1. Resend (3000 emails/mês grátis) - Recomendado
 * 2. Gmail SMTP (ilimitado, mas precisa configurar)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envia email usando Resend (GRATUITO - 3000 emails/mês)
 */
export async function sendEmailResend({ to, subject, html, text }: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@seu-dominio.com';

  if (!apiKey) {
    console.error('Resend API key not configured');
    return {
      success: false,
      error: 'Serviço de email não configurado',
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Remove HTML tags para texto
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return {
        success: false,
        error: data.message || 'Erro ao enviar email',
      };
    }

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Erro ao enviar email',
    };
  }
}

/**
 * Envia email usando Gmail SMTP (TOTALMENTE GRATUITO)
 * Requer: Gmail App Password
 * Usa API route do Next.js para enviar via SMTP
 */
export async function sendEmailGmail({ to, subject, html, text }: EmailOptions): Promise<EmailResult> {
  // Usar API route do Next.js para enviar via SMTP
  // Isso evita expor credenciais no cliente
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Erro ao enviar email',
      };
    }

    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao enviar email',
    };
  }
}

/**
 * Função principal - escolhe o método baseado na configuração
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // Priorizar Resend se configurado, senão usar Gmail
  if (process.env.RESEND_API_KEY) {
    return sendEmailResend(options);
  }
  
  // Fallback para Gmail se configurado
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return sendEmailGmail(options);
  }

  return {
    success: false,
    error: 'Nenhum serviço de email configurado. Configure RESEND_API_KEY ou GMAIL_USER',
  };
}

/**
 * Formata email de confirmação de agendamento
 */
export function formatAppointmentConfirmationEmail(appointment: {
  name: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}): { subject: string; html: string; text: string } {
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `✅ Agendamento Confirmado - ${appointment.serviceName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Agendamento Confirmado</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${appointment.name}</strong>!</p>
          
          <p>O seu agendamento foi registado com sucesso:</p>
          
          <div class="info-box">
            <p><strong>📋 Serviço:</strong> ${appointment.serviceName}</p>
            <p><strong>📅 Data:</strong> ${formattedDate}</p>
            <p><strong>🕐 Hora:</strong> ${appointment.appointmentTime}</p>
          </div>
          
          <p>Receberá um lembrete por email 24 horas antes do agendamento com os documentos necessários.</p>
          
          <p>Obrigado por escolher os nossos serviços!</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Olá ${appointment.name}!

O seu agendamento foi registado com sucesso:

📋 Serviço: ${appointment.serviceName}
📅 Data: ${formattedDate}
🕐 Hora: ${appointment.appointmentTime}

Receberá um lembrete por email 24 horas antes do agendamento.

Obrigado!
  `;

  return { subject, html, text };
}

/**
 * Formata email de lembrete de agendamento
 */
export function formatAppointmentReminderEmail(appointment: {
  name: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  documentsReminder?: any;
}): { subject: string; html: string; text: string } {
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `📅 Lembrete: Agendamento Amanhã - ${appointment.serviceName}`;

  let documentsHtml = '';
  let documentsText = '';

  if (appointment.documentsReminder && Array.isArray(appointment.documentsReminder)) {
    const requiredDocs = appointment.documentsReminder.filter((doc: any) => doc.required);
    if (requiredDocs.length > 0) {
      documentsHtml = `
        <div class="info-box" style="border-left-color: #f59e0b;">
          <h3>📄 Documentos Necessários:</h3>
          <ul>
            ${requiredDocs.map((doc: any) => `<li>${doc.name}</li>`).join('')}
          </ul>
        </div>
      `;
      documentsText = `\n📄 Documentos Necessários:\n${requiredDocs.map((doc: any) => `• ${doc.name}`).join('\n')}`;
    }
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        ul { margin: 10px 0; padding-left: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Lembrete de Agendamento</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${appointment.name}</strong>!</p>
          
          <p><strong>Lembrete:</strong> Tem um agendamento amanhã:</p>
          
          <div class="info-box">
            <p><strong>📋 Serviço:</strong> ${appointment.serviceName}</p>
            <p><strong>📅 Data:</strong> ${formattedDate}</p>
            <p><strong>🕐 Hora:</strong> ${appointment.appointmentTime}</p>
          </div>
          
          ${documentsHtml}
          
          <p>Por favor, traga todos os documentos necessários.</p>
          
          <p>Até breve!</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Olá ${appointment.name}!

Lembrete: Tem um agendamento amanhã:

📋 Serviço: ${appointment.serviceName}
📅 Data: ${formattedDate}
🕐 Hora: ${appointment.appointmentTime}
${documentsText}

Por favor, traga todos os documentos necessários.

Até breve!
  `;

  return { subject, html, text };
}

