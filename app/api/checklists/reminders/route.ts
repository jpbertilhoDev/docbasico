import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { sendWhatsApp, sendWhatsAppDocument } from "@/lib/whatsapp";
import { generateChecklistPDFServer } from "@/lib/checklist-pdf";
import { normalizePhoneNumber } from "@/lib/phone-validation";

/**
 * POST /api/checklists/reminders
 * Envia lembretes de checklist para agendamentos próximos
 */
export async function POST(request: Request) {
  try {
    // Buscar agendamentos nas próximas 24 horas
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: appointments, error: appointmentsError } = await (supabase.from("appointments") as any)
      .select("id, name, email, phone, service_slug, service_name, appointment_date, appointment_time")
      .gte("appointment_date", now.toISOString().split("T")[0])
      .lte("appointment_date", tomorrow.toISOString().split("T")[0])
      .eq("status", "confirmed")
      .order("appointment_date", { ascending: true });

    if (appointmentsError) {
      console.error("Error fetching appointments:", appointmentsError);
      return NextResponse.json(
        { error: "Erro ao buscar agendamentos" },
        { status: 500 }
      );
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhum agendamento para enviar lembretes",
        sent: 0,
      });
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const appointment of appointments) {
      try {
        // Buscar checklist
        const { data: checklist } = await (supabase.from("document_checklists") as any)
          .select("id, progress_percentage")
          .eq("appointment_id", appointment.id)
          .maybeSingle();

        if (!checklist) {
          // Criar checklist se não existir
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/checklists/${appointment.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }

        // Buscar documentos do checklist
        const { data: checklistData } = await (supabase.from("document_checklists") as any)
          .select("id, progress_percentage")
          .eq("appointment_id", appointment.id)
          .maybeSingle();

        // Buscar documentos do checklist
        let documents: any[] = [];
        if (checklistData) {
          const { data: checklistDocs } = await (supabase.from("checklist_documents") as any)
            .select("document_name, required, checked, document_description")
            .eq("checklist_id", checklistData.id)
            .order("document_order", { ascending: true });

          if (checklistDocs) {
            documents = checklistDocs.map(doc => ({
              name: doc.document_name,
              required: doc.required,
              checked: doc.checked || false,
              description: doc.document_description || undefined,
            }));
          }
        }

        // Se não tiver documentos, buscar do serviço (SEMPRE buscar do serviço para garantir)
        const { getServiceInfo } = await import("@/lib/services-documents");
        const serviceInfo = getServiceInfo(appointment.service_slug);
        
        if (serviceInfo && serviceInfo.documents) {
          // Usar documentos do serviço como base (sempre atualizados)
          // Mesclar com status do checklist se existir
          const serviceDocs = serviceInfo.documents.map(serviceDoc => {
            // Verificar se já existe no checklist
            const existingDoc = documents.find(d => d.name === serviceDoc.name);
            return {
              name: serviceDoc.name,
              required: serviceDoc.required,
              checked: existingDoc?.checked || false,
              description: serviceDoc.description || undefined,
            };
          });
          documents = serviceDocs;
        } else if (documents.length === 0) {
          // Se não conseguir buscar do serviço e não tiver documentos, erro
          console.error(`[REMINDERS] Não foi possível obter documentos para o serviço: ${appointment.service_slug}`);
          errors.push(`${appointment.name}: Serviço não encontrado`);
          continue;
        }
        
        // Garantir que temos documentos
        if (documents.length === 0) {
          console.error(`[REMINDERS] Nenhum documento encontrado para ${appointment.name}`);
          errors.push(`${appointment.name}: Nenhum documento encontrado`);
          continue;
        }
        
        console.log(`[REMINDERS] Documentos para ${appointment.name}: ${documents.length} documentos encontrados`);

        // Preparar mensagem
        const appointmentDate = new Date(appointment.appointment_date);
        const dateStr = appointmentDate.toLocaleDateString("pt-PT", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const checklistUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/agendar?checklist=${appointment.id}`;
        
        const message = `📋 *Lembrete de Documentos - ${appointment.service_name}*

Olá ${appointment.name},

Sua consulta está agendada para *${dateStr}* às *${appointment.appointment_time}*.

Não se esqueça de verificar o checklist de documentos:
${checklistUrl}

Prepare-se com antecedência para garantir que tem todos os documentos necessários.

*Até breve!*`;

        // Normalizar telefone
        const normalizedPhone = normalizePhoneNumber(appointment.phone);
        if (!normalizedPhone) {
          errors.push(`${appointment.name}: Número de telefone inválido`);
          continue;
        }

        // Remover + e espaços para WhatsApp
        const whatsappNumber = normalizedPhone.replace(/\D/g, '');

        // Primeiro gerar o PDF ANTES de enviar a mensagem
        let pdfBuffer: Buffer | null = null;
        try {
          console.log(`[REMINDERS] Gerando PDF para ${appointment.name}...`);
          console.log(`[REMINDERS] Documentos no PDF: ${documents.length}`);
          
          pdfBuffer = await generateChecklistPDFServer({
            serviceSlug: appointment.service_slug,
            serviceName: appointment.service_name,
            clientName: appointment.name,
            appointmentDate: appointment.appointment_date,
            appointmentTime: appointment.appointment_time,
            documents,
          });

          console.log(`[REMINDERS] ✅ PDF gerado com sucesso! Tamanho: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
        } catch (pdfError: any) {
          console.error(`[REMINDERS] ❌ Erro ao gerar PDF para ${appointment.name}:`, pdfError);
          errors.push(`${appointment.name}: Erro ao gerar PDF - ${pdfError.message}`);
          // Continuar mesmo se o PDF falhar - enviar apenas a mensagem
        }

        // Enviar mensagem via WhatsApp
        const messageResult = await sendWhatsApp({
          to: whatsappNumber,
          message,
        });

        if (!messageResult.success) {
          errors.push(`${appointment.name}: ${messageResult.error}`);
          continue;
        }

        console.log(`[REMINDERS] ✅ Mensagem enviada com sucesso para ${appointment.name}`);

        // Enviar PDF via WhatsApp (se foi gerado com sucesso)
        if (pdfBuffer) {
          try {
            const pdfFileName = `checklist-${appointment.service_slug}-${new Date().toISOString().split('T')[0]}.pdf`;
            
            console.log(`[REMINDERS] Enviando PDF via WhatsApp para ${whatsappNumber}...`);
            console.log(`[REMINDERS] Tamanho do PDF: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
            
            const pdfResult = await sendWhatsAppDocument({
              to: whatsappNumber,
              document: pdfBuffer,
              fileName: pdfFileName,
              mimetype: 'application/pdf',
              caption: `📄 *Checklist de Documentos - ${appointment.service_name}*\n\nUse este documento para se preparar para sua consulta.\n\n*Não se esqueça de trazer todos os documentos obrigatórios!*`,
            });

            if (pdfResult.success) {
              console.log(`[REMINDERS] ✅ PDF enviado com sucesso para ${appointment.name}`);
            } else {
              console.error(`[REMINDERS] ❌ Erro ao enviar PDF para ${appointment.name}: ${pdfResult.error}`);
              errors.push(`${appointment.name}: Erro ao enviar PDF - ${pdfResult.error}`);
            }
          } catch (pdfSendError: any) {
            console.error(`[REMINDERS] ❌ Erro ao enviar PDF para ${appointment.name}:`, pdfSendError);
            errors.push(`${appointment.name}: Erro ao enviar PDF - ${pdfSendError.message}`);
          }
        }

        sentCount++;
      } catch (error: any) {
        console.error(`Error sending reminder to ${appointment.email}:`, error);
        errors.push(`${appointment.name}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Lembretes enviados: ${sentCount} de ${appointments.length}`,
      sent: sentCount,
      total: appointments.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error in reminders API:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

