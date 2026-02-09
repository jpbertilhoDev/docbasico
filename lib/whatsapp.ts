/**
 * Serviço de envio de mensagens via WhatsApp usando Baileys
 * 
 * Baileys é uma biblioteca gratuita que conecta ao WhatsApp Web
 * Não precisa de API paga, funciona diretamente com WhatsApp
 * 
 * Vantagens:
 * - TOTALMENTE GRATUITO ✅
 * - Sem limites de envio
 * - Alta taxa de entrega
 * - Funciona com qualquer número WhatsApp
 * 
 * IMPORTANTE: Se o WhatsApp estiver rodando em processo separado (start-whatsapp-server.ts),
 * este serviço tentará usar a API HTTP primeiro, depois tenta o socket local.
 */

import { sendWhatsApp as sendWhatsAppBaileys } from './whatsapp-baileys';

interface WhatsAppOptions {
  to: string; // Número no formato: 351912345678 (sem +, sem espaços)
  message: string;
}

interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envia mensagem via WhatsApp usando Baileys
 * Tenta primeiro via API HTTP (se WhatsApp estiver em processo separado),
 * depois tenta socket local
 */
export async function sendWhatsApp({ to, message }: WhatsAppOptions): Promise<WhatsAppResult> {
  // Primeiro tentar via API HTTP (se WhatsApp estiver rodando em processo separado)
  try {
    const response = await fetch('http://localhost:3001/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log(`[WHATSAPP] ✅ Mensagem enviada via API HTTP`);
        return result;
      }
    }
  } catch (error) {
    // Se API HTTP não estiver disponível, tentar socket local
    console.log(`[WHATSAPP] API HTTP não disponível, tentando socket local...`);
  }

  // Tentar via socket local (se estiver no mesmo processo)
  return sendWhatsAppBaileys({ to, message });
}

/**
 * Envia documento via WhatsApp usando Baileys
 * Tenta primeiro via API HTTP (se WhatsApp estiver em processo separado),
 * depois tenta socket local
 */
export async function sendWhatsAppDocument({ 
  to, 
  document, 
  fileName, 
  mimetype = 'application/pdf',
  caption 
}: {
  to: string;
  document: Buffer;
  fileName: string;
  mimetype?: string;
  caption?: string;
}): Promise<WhatsAppResult> {
  console.log(`[WHATSAPP-WRAPPER] Iniciando envio de documento via API HTTP...`);
  console.log(`[WHATSAPP-WRAPPER] Arquivo: ${fileName} (${(document.length / 1024).toFixed(2)} KB)`);
  
  // Primeiro tentar via API HTTP (se WhatsApp estiver rodando em processo separado)
  try {
    // Converter Buffer para base64 para enviar via JSON
    const documentBase64 = document.toString('base64');
    
    console.log(`[WHATSAPP-WRAPPER] Documento convertido para base64: ${documentBase64.length} caracteres`);
    console.log(`[WHATSAPP-WRAPPER] Enviando para: http://localhost:3001/send`);
    
    const response = await fetch('http://localhost:3001/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        to, 
        document: documentBase64, 
        fileName, 
        mimetype, 
        caption 
      }),
    });

    console.log(`[WHATSAPP-WRAPPER] Resposta HTTP: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const result = await response.json();
      console.log(`[WHATSAPP-WRAPPER] Resultado:`, result);
      
      if (result.success) {
        console.log(`[WHATSAPP] ✅ Documento enviado via API HTTP`);
        return result;
      } else {
        console.error(`[WHATSAPP-WRAPPER] ❌ API retornou erro:`, result.error);
        throw new Error(result.error || 'Erro desconhecido ao enviar documento');
      }
    } else {
      const errorText = await response.text();
      console.error(`[WHATSAPP-WRAPPER] ❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
  } catch (error: any) {
    console.error(`[WHATSAPP-WRAPPER] ❌ Erro ao tentar API HTTP:`, error);
    console.error(`[WHATSAPP-WRAPPER] Stack:`, error.stack);
    
    // Se API HTTP não estiver disponível, tentar socket local
    console.log(`[WHATSAPP-WRAPPER] API HTTP não disponível, tentando socket local...`);
    
    const { sendWhatsAppDocument: sendDocumentBaileys } = await import('@/lib/whatsapp-baileys');
    return sendDocumentBaileys({ to, document, fileName, mimetype, caption });
  }
}

/**
 * Formata mensagem de confirmação para WhatsApp
 */
export function formatWhatsAppConfirmation(appointment: {
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
    `O seu agendamento foi confirmado:\n\n` +
    `📋 *${appointment.serviceName}*\n` +
    `📅 ${formattedDate}\n` +
    `🕐 ${appointment.appointmentTime}\n\n` +
    `Receberá um lembrete 24h antes do agendamento.\n\n` +
    `Obrigado!`;
}

/**
 * Formata mensagem de lembrete para WhatsApp
 */
export function formatWhatsAppReminder(appointment: {
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
    `*Lembrete:* Tem um agendamento amanhã:\n\n` +
    `📋 *${appointment.serviceName}*\n` +
    `📅 ${formattedDate}\n` +
    `🕐 ${appointment.appointmentTime}\n\n`;

  // Adicionar documentos se disponível
  if (appointment.documentsReminder && Array.isArray(appointment.documentsReminder)) {
    const requiredDocs = appointment.documentsReminder
      .filter((doc: any) => doc.required)
      .slice(0, 5)
      .map((doc: any) => `• ${doc.name}`)
      .join('\n');
    
    if (requiredDocs) {
      message += `📄 *Documentos necessários:*\n${requiredDocs}\n\n`;
    }
  }

  message += `Até breve!`;

  return message;
}

