/**
 * Sistema de Notificações Híbrido
 * 
 * Tenta múltiplos métodos em ordem de prioridade:
 * 1. WhatsApp (via Baileys - TOTALMENTE GRATUITO)
 * 2. Email-to-SMS (gratuito, mas limitado)
 * 3. Email (sempre funciona como fallback)
 * 
 * TUDO 100% GRATUITO!
 */

import { sendEmail, formatAppointmentConfirmationEmail, formatAppointmentReminderEmail } from '@/lib/email';
import { sendWhatsApp, sendWhatsAppDocument, formatWhatsAppConfirmation, formatWhatsAppReminder } from '@/lib/whatsapp';
import { sendEmailToSMS, canUseEmailToSMS } from '@/lib/email-to-sms';
import { generateChecklistPDFServer } from '@/lib/checklist-pdf';
import { getServiceInfo } from '@/lib/services-documents';

interface NotificationOptions {
  phone: string;
  email: string;
  name: string;
  serviceName: string;
  serviceSlug?: string; // Adicionado para buscar documentos
  appointmentDate: string;
  appointmentTime: string;
  type: 'confirmation' | 'reminder';
  documentsReminder?: any;
}

interface NotificationResult {
  success: boolean;
  method?: 'whatsapp' | 'sms' | 'email' | 'none';
  results: {
    whatsapp: { success: boolean; error: string | null };
    sms: { success: boolean; error: string | null };
    email: { success: boolean; error: string | null };
  };
}

/**
 * Envia notificação de agendamento usando método híbrido
 * Tenta WhatsApp → Email-to-SMS → Email
 */
export async function sendAppointmentNotification(
  options: NotificationOptions
): Promise<NotificationResult> {
  const results = {
    whatsapp: { success: false, error: null as string | null },
    sms: { success: false, error: null as string | null },
    email: { success: false, error: null as string | null },
  };

  // Normalizar número de telefone (remover tudo exceto números)
  const normalizedPhone = options.phone.replace(/\D/g, '');
  
  console.log(`[NOTIFICATIONS] Iniciando envio de notificação ${options.type} para:`, {
    name: options.name,
    phone: normalizedPhone,
    email: options.email,
    service: options.serviceName,
    date: options.appointmentDate,
    time: options.appointmentTime,
  });

  // ============================================
  // MÉTODO 1: WhatsApp (Prioridade Alta)
  // ============================================
  try {
    console.log(`[NOTIFICATIONS] Tentando enviar via WhatsApp para ${normalizedPhone}...`);
    
    const whatsappMessage = options.type === 'confirmation'
      ? formatWhatsAppConfirmation({
          name: options.name,
          serviceName: options.serviceName,
          appointmentDate: options.appointmentDate,
          appointmentTime: options.appointmentTime,
        })
      : formatWhatsAppReminder({
          name: options.name,
          serviceName: options.serviceName,
          appointmentDate: options.appointmentDate,
          appointmentTime: options.appointmentTime,
          documentsReminder: options.documentsReminder,
        });

    console.log(`[NOTIFICATIONS] Mensagem WhatsApp formatada:`, whatsappMessage.substring(0, 100) + '...');

    // Adicionar timeout de 15 segundos para evitar travamento
    const whatsappPromise = sendWhatsApp({
      to: normalizedPhone,
      message: whatsappMessage,
    });
    
    const timeoutPromise = new Promise<{ success: false; error: string }>((resolve) => 
      setTimeout(() => resolve({ success: false, error: 'Timeout: WhatsApp demorou mais de 15 segundos' }), 15000)
    );
    
    const whatsappResult = await Promise.race([whatsappPromise, timeoutPromise]);

    console.log(`[NOTIFICATIONS] Resultado WhatsApp:`, whatsappResult);

    results.whatsapp = {
      success: whatsappResult.success,
      error: whatsappResult.error || null,
    };

    // Se WhatsApp funcionou, retornar sucesso
    if (whatsappResult.success) {
      console.log(`[NOTIFICATIONS] ✅ WhatsApp (mensagem) enviado com sucesso!`);
      
      // Se for confirmação, enviar PDF do checklist
      if (options.type === 'confirmation' && options.serviceSlug) {
        try {
          console.log(`[NOTIFICATIONS] 📋 Iniciando processo de envio de PDF...`);
          console.log(`[NOTIFICATIONS] ⏳ Aguardando 2 segundos antes de enviar PDF (anti-spam)...`);
          
          // Delay de 2 segundos entre mensagem e PDF (anti-spam)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log(`[NOTIFICATIONS] Gerando PDF do checklist para ${options.name}...`);
          
          // Buscar documentos do serviço
          const serviceInfo = getServiceInfo(options.serviceSlug);
          if (serviceInfo) {
            const documents = serviceInfo.documents.map(doc => ({
              name: doc.name,
              required: doc.required,
              checked: false,
              description: doc.description,
            }));

            console.log(`[NOTIFICATIONS] 📄 Documentos encontrados: ${documents.length}`);

            // Gerar PDF
            const pdfBuffer = await generateChecklistPDFServer({
              serviceSlug: options.serviceSlug,
              serviceName: options.serviceName,
              clientName: options.name,
              appointmentDate: options.appointmentDate,
              appointmentTime: options.appointmentTime,
              documents,
            });

            console.log(`[NOTIFICATIONS] ✅ PDF gerado! Tamanho: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

            // Enviar PDF via WhatsApp (com delays anti-ban embutidos)
            const pdfFileName = `Checklist-${options.serviceName.replace(/\s+/g, '-')}-${options.name.replace(/\s+/g, '-')}.pdf`;
            
            console.log(`[NOTIFICATIONS] 📤 Enviando PDF via WhatsApp...`);
            
            const pdfResult = await sendWhatsAppDocument({
              to: normalizedPhone,
              document: pdfBuffer,
              fileName: pdfFileName,
              mimetype: 'application/pdf',
              caption: `📄 *Checklist de Documentos*\n\n*${options.serviceName}*\n\nUse este documento para se preparar para sua consulta.\n\n✅ *Não se esqueça de trazer todos os documentos obrigatórios!*`,
            });

            if (pdfResult.success) {
              console.log(`[NOTIFICATIONS] ✅✅✅ PDF enviado com sucesso via WhatsApp!`);
            } else {
              console.error(`[NOTIFICATIONS] ❌ Erro ao enviar PDF:`, pdfResult.error);
            }
          } else {
            console.warn(`[NOTIFICATIONS] ⚠️ Serviço não encontrado: ${options.serviceSlug}`);
          }
        } catch (pdfError: any) {
          console.error(`[NOTIFICATIONS] ❌ Erro ao gerar/enviar PDF:`, pdfError);
          console.error(`[NOTIFICATIONS] Stack:`, pdfError.stack);
          // Não falhar a notificação se o PDF falhar
        }
      }
      
      return {
        success: true,
        method: 'whatsapp',
        results,
      };
    } else {
      console.log(`[NOTIFICATIONS] ❌ WhatsApp falhou:`, whatsappResult.error);
    }
  } catch (error: any) {
    results.whatsapp.error = error.message || 'Erro desconhecido no WhatsApp';
    console.error('[NOTIFICATIONS] ❌ Erro ao enviar WhatsApp:', error);
  }

  // ============================================
  // MÉTODO 2: Email-to-SMS (Prioridade Média)
  // ============================================
  // Só tentar se o número suportar Email-to-SMS
  if (canUseEmailToSMS(options.phone)) {
    try {
      const smsMessage = options.type === 'confirmation'
        ? `Olá ${options.name}! ✅ Seu agendamento foi confirmado: ${options.serviceName} em ${new Date(options.appointmentDate).toLocaleDateString('pt-PT')} às ${options.appointmentTime}. Obrigado!`
        : `Olá ${options.name}! 📅 Lembrete: Agendamento amanhã - ${options.serviceName} em ${new Date(options.appointmentDate).toLocaleDateString('pt-PT')} às ${options.appointmentTime}. Até breve!`;

      const smsResult = await sendEmailToSMS({
        to: options.phone,
        message: smsMessage,
        carrier: 'auto',
      });

      results.sms = {
        success: smsResult.success,
        error: smsResult.error || null,
      };

      // Se Email-to-SMS funcionou, retornar sucesso
      if (smsResult.success) {
        return {
          success: true,
          method: 'sms',
          results,
        };
      }
    } catch (error: any) {
      results.sms.error = error.message || 'Erro desconhecido no Email-to-SMS';
      console.error('Email-to-SMS error:', error);
    }
  } else {
    results.sms.error = 'Número não suporta Email-to-SMS';
  }

  // ============================================
  // MÉTODO 3: Email (Fallback - Sempre funciona)
  // ============================================
  try {
    const emailContent = options.type === 'confirmation'
      ? formatAppointmentConfirmationEmail({
          name: options.name,
          serviceName: options.serviceName,
          appointmentDate: options.appointmentDate,
          appointmentTime: options.appointmentTime,
        })
      : formatAppointmentReminderEmail({
          name: options.name,
          serviceName: options.serviceName,
          appointmentDate: options.appointmentDate,
          appointmentTime: options.appointmentTime,
          documentsReminder: options.documentsReminder,
        });

    const emailResult = await sendEmail({
      to: options.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    results.email = {
      success: emailResult.success,
      error: emailResult.error || null,
    };

    // Email é o fallback final
    return {
      success: emailResult.success,
      method: emailResult.success ? 'email' : 'none',
      results,
    };
  } catch (error: any) {
    results.email.error = error.message || 'Erro desconhecido no Email';
    console.error('Email error:', error);
    
    return {
      success: false,
      method: 'none',
      results,
    };
  }
}

/**
 * Envia apenas confirmação (sem tentar múltiplos métodos)
 * Útil quando você quer garantir que pelo menos um método funcione
 */
export async function sendConfirmationOnly(
  options: NotificationOptions
): Promise<NotificationResult> {
  return sendAppointmentNotification({
    ...options,
    type: 'confirmation',
  });
}

/**
 * Envia apenas lembrete (sem tentar múltiplos métodos)
 */
export async function sendReminderOnly(
  options: NotificationOptions
): Promise<NotificationResult> {
  return sendAppointmentNotification({
    ...options,
    type: 'reminder',
  });
}

