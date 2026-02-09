import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { sendSMS, formatAppointmentReminderSMS } from '@/lib/sms';

/**
 * API Route para enviar lembretes de agendamentos
 * GET /api/sms/reminders
 * 
 * Envia lembretes para agendamentos que acontecem em 24 horas
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
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', tomorrow.toISOString())
      .lte('appointment_date', tomorrowEnd.toISOString())
      .in('status', ['pending', 'confirmed'])
      .is('sms_reminder_sent', null); // Apenas os que ainda não receberam lembrete

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

    // Enviar SMS para cada agendamento
    const results = await Promise.allSettled(
      appointments.map(async (appointment) => {
        const smsMessage = formatAppointmentReminderSMS({
          name: appointment.name,
          serviceName: appointment.service_name,
          appointmentDate: appointment.appointment_date,
          appointmentTime: appointment.appointment_time,
          documentsReminder: appointment.documents_reminder,
        });

        const result = await sendSMS({
          to: appointment.phone,
          message: smsMessage,
        });

        // Marcar como enviado se sucesso
        if (result.success) {
          await supabase
            .from('appointments')
            .update({ 
              sms_reminder_sent: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', appointment.id);
        }

        return {
          appointmentId: appointment.id,
          phone: appointment.phone,
          success: result.success,
          error: result.error,
        };
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      message: `Lembretes enviados: ${successful} sucesso, ${failed} falhas`,
      sent: successful,
      failed,
      total: appointments.length,
    });
  } catch (error: any) {
    console.error('Error in reminders API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

