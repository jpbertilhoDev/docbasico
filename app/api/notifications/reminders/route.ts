import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { sendAppointmentNotification } from '@/lib/notifications';

/**
 * API Route para enviar lembretes de agendamentos
 * GET /api/notifications/reminders
 * 
 * Envia lembretes para agendamentos que acontecem em 24 horas
 * Usa sistema híbrido: WhatsApp → Email-to-SMS → Email
 * 
 * Esta rota deve ser chamada periodicamente (cron job)
 */
export async function GET(request: Request) {
  try {
    // Calcular data/hora de amanhã (24h a partir de agora)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Buscar agendamentos confirmados ou pendentes para amanhã
    // Que ainda não receberam lembrete (qualquer método)
    const { data: appointments, error } = await (supabase.from('appointments') as any)
      .select('*')
      .gte('appointment_date', tomorrow.toISOString())
      .lte('appointment_date', tomorrowEnd.toISOString())
      .in('status', ['pending', 'confirmed'])
      .or('whatsapp_reminder_sent.is.null,sms_reminder_sent.is.null,email_reminder_sent.is.null');

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar agendamentos' },
        { status: 500 }
      );
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum agendamento para lembrar',
        sent: 0,
      });
    }

    // Filtrar apenas os que ainda não receberam nenhum lembrete
    const appointmentsToRemind = appointments.filter(apt => 
      !apt.whatsapp_reminder_sent && 
      !apt.sms_reminder_sent && 
      !apt.email_reminder_sent
    );

    if (appointmentsToRemind.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Todos os agendamentos já receberam lembretes',
        sent: 0,
      });
    }

    // Enviar notificações para cada agendamento
    const results = await Promise.allSettled(
      appointmentsToRemind.map(async (appointment) => {
        const notificationResult = await sendAppointmentNotification({
          phone: appointment.phone,
          email: appointment.email,
          name: appointment.name,
          serviceName: appointment.service_name,
          appointmentDate: appointment.appointment_date,
          appointmentTime: appointment.appointment_time,
          type: 'reminder',
          documentsReminder: appointment.documents_reminder,
        });

        // Atualizar campo de rastreamento baseado no método que funcionou
        if (notificationResult.success) {
          const updateData: any = {
            updated_at: new Date().toISOString(),
          };

          if (notificationResult.method === 'whatsapp') {
            updateData.whatsapp_reminder_sent = new Date().toISOString();
          } else if (notificationResult.method === 'sms') {
            updateData.sms_reminder_sent = new Date().toISOString();
          } else if (notificationResult.method === 'email') {
            updateData.email_reminder_sent = new Date().toISOString();
          }

          await (supabase.from('appointments') as any)
            .update(updateData)
            .eq('id', appointment.id);
        }

        return {
          appointmentId: appointment.id,
          phone: appointment.phone,
          email: appointment.email,
          success: notificationResult.success,
          method: notificationResult.method,
          error: notificationResult.results[notificationResult.method || 'email']?.error || null,
        };
      })
    );

    const successful = results.filter(
      r => r.status === 'fulfilled' && r.value.success
    ).length;
    const failed = results.length - successful;

    const methods = results
      .filter(r => r.status === 'fulfilled' && r.value.success)
      .map(r => (r.status === 'fulfilled' ? r.value.method : null))
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      message: `Lembretes enviados: ${successful} sucesso, ${failed} falhas`,
      sent: successful,
      failed,
      total: appointmentsToRemind.length,
      methods: {
        whatsapp: methods.filter(m => m === 'whatsapp').length,
        sms: methods.filter(m => m === 'sms').length,
        email: methods.filter(m => m === 'email').length,
      },
    });
  } catch (error: any) {
    console.error('Error in reminders API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

