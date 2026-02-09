import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getServiceInfo } from '@/lib/services-documents';
import { validatePhoneNumber, normalizePhoneNumber } from '@/lib/phone-validation';
import { sendAppointmentNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceSlug, appointmentDate, appointmentTime, urgency, notes } = body;

    // Validações básicas com mensagens claras
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'O nome é obrigatório' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'O nome deve ter pelo menos 2 caracteres' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'O email é obrigatório' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Email inválido. Por favor, insira um email válido.' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'O telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Validar telefone (aceita números internacionais)
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { error: phoneValidation.error || 'Telefone inválido' },
        { status: 400 }
      );
    }

    // Normalizar telefone antes de salvar
    const normalizedPhone = normalizePhoneNumber(phone);

    if (!serviceSlug) {
      return NextResponse.json(
        { error: 'O serviço é obrigatório' },
        { status: 400 }
      );
    }

    if (!appointmentDate) {
      return NextResponse.json(
        { error: 'A data é obrigatória' },
        { status: 400 }
      );
    }

    if (!appointmentTime) {
      return NextResponse.json(
        { error: 'A hora é obrigatória' },
        { status: 400 }
      );
    }

    // Obter informações do serviço
    const serviceInfo = getServiceInfo(serviceSlug);
    if (!serviceInfo) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 400 }
      );
    }

    // Validar formato da data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointmentDate)) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validar formato da hora (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(appointmentTime)) {
      return NextResponse.json(
        { error: 'Formato de hora inválido. Use HH:MM' },
        { status: 400 }
      );
    }

    // Criar data/hora completa
    // appointmentDate vem como "YYYY-MM-DD" e appointmentTime como "HH:MM"
    // Normalizar hora para garantir formato HH:MM
    const normalizedTime = appointmentTime.split(':').slice(0, 2).join(':');
    const dateTimeString = `${appointmentDate}T${normalizedTime}:00`;
    
    // Tentar criar a data de diferentes formas para lidar com timezone
    let fullDateTime: Date;
    try {
      // Primeiro, tentar criar diretamente
      fullDateTime = new Date(dateTimeString);
      
      // Se falhar, tentar criar como UTC
      if (isNaN(fullDateTime.getTime())) {
        const [year, month, day] = appointmentDate.split('-').map(Number);
        const [hours, minutes] = normalizedTime.split(':').map(Number);
        fullDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      }

      // Verificar se a data é válida
      if (isNaN(fullDateTime.getTime())) {
        return NextResponse.json(
          { error: 'Data ou hora inválida. Verifique os valores fornecidos.' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Erro ao processar data e hora. Verifique os valores fornecidos.' },
        { status: 400 }
      );
    }

    // Verificar se a data não é no passado (com margem de 30 minutos)
    const now = new Date();
    now.setMinutes(now.getMinutes() - 30); // Margem de 30 minutos
    
    if (fullDateTime < now) {
      return NextResponse.json(
        { error: 'Não é possível agendar no passado. Por favor, selecione uma data e hora futuras.' },
        { status: 400 }
      );
    }

    // Verificar se já existe agendamento neste horário (evitar conflitos)
    // normalizedTime já foi definido acima, reutilizar
    const appointmentDateStr = appointmentDate; // Já está em formato YYYY-MM-DD
    
    // Buscar agendamentos com status pending ou confirmed
    // Filtrar por data usando range do dia completo
    const dayStart = new Date(`${appointmentDateStr}T00:00:00`);
    const dayEnd = new Date(`${appointmentDateStr}T23:59:59`);
    
    const { data: existingAppointments, error: checkError } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, status')
      .gte('appointment_date', dayStart.toISOString())
      .lte('appointment_date', dayEnd.toISOString())
      .in('status', ['pending', 'confirmed']);

    if (checkError) {
      console.error('Error checking existing appointments:', checkError);
    }

    // Verificar conflito por data e hora
    if (existingAppointments && existingAppointments.length > 0) {
      const hasConflict = existingAppointments.some((apt: any) => {
        // Comparar horas (normalizar formato)
        const aptTimeFormatted = apt.appointment_time?.includes(':')
          ? apt.appointment_time.split(':').slice(0, 2).join(':')
          : apt.appointment_time;
        
        return aptTimeFormatted === normalizedTime;
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'Este horário já está ocupado. Por favor, selecione outro horário.' },
          { status: 409 }
        );
      }
    }

    // Gerar notas de preparação baseadas no serviço
    const preparationNotes = serviceInfo.preparationNotes.join('\n');
    const documentsReminder = serviceInfo.documents.map(doc => ({
      name: doc.name,
      required: doc.required,
    }));

    // Criar agendamento
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        name,
        email,
        phone: normalizedPhone,
        service_slug: serviceSlug,
        service_name: serviceInfo.name,
        appointment_date: fullDateTime.toISOString(),
        appointment_time: appointmentTime,
        urgency: urgency || 'normal',
        notes: notes || null,
        documents_reminder: documentsReminder,
        preparation_notes: preparationNotes,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return NextResponse.json(
        { error: 'Erro ao criar agendamento', details: error.message },
        { status: 500 }
      );
    }

    // Atualizar slot disponível (marcar como ocupado)
    const { data: slotData } = await supabase
      .from('available_slots')
      .select('current_appointments, max_appointments')
      .eq('date', appointmentDate)
      .eq('time_slot', appointmentTime)
      .single();

    if (slotData) {
      const newCount = (slotData.current_appointments || 0) + 1;
      await supabase
        .from('available_slots')
        .update({ 
          current_appointments: newCount,
          is_available: newCount < (slotData.max_appointments || 1)
        })
        .eq('date', appointmentDate)
        .eq('time_slot', appointmentTime);
    }

    // Enviar notificação de confirmação em background (não bloqueia a resposta)
    // Isso evita que o agendamento trave se a notificação demorar
    console.log(`[APPOINTMENTS] Agendamento criado com sucesso. ID: ${data.id}`);
    console.log(`[APPOINTMENTS] Enviando notificação de confirmação em background...`);
    
    // Executar notificação em background sem bloquear a resposta
    (async () => {
      try {
        const notificationResult = await sendAppointmentNotification({
          phone: normalizedPhone,
          email: email.trim(),
          name: data.name,
          serviceName: data.service_name,
          serviceSlug: data.service_slug, // Adicionar serviceSlug para o PDF
          appointmentDate: data.appointment_date,
          appointmentTime: data.appointment_time,
          type: 'confirmation',
        });

        console.log(`[APPOINTMENTS] Resultado da notificação:`, {
          success: notificationResult.success,
          method: notificationResult.method,
          results: notificationResult.results,
        });

        // Atualizar campos de rastreamento baseado no método que funcionou
        if (notificationResult.success) {
          const updateData: any = {
            updated_at: new Date().toISOString(),
          };

          if (notificationResult.method === 'whatsapp') {
            updateData.whatsapp_confirmation_sent = new Date().toISOString();
            console.log(`[APPOINTMENTS] ✅ Notificação WhatsApp enviada e registrada`);
          } else if (notificationResult.method === 'sms') {
            updateData.sms_confirmation_sent = new Date().toISOString();
            console.log(`[APPOINTMENTS] ✅ Notificação SMS enviada e registrada`);
          } else if (notificationResult.method === 'email') {
            updateData.email_confirmation_sent = new Date().toISOString();
            console.log(`[APPOINTMENTS] ✅ Notificação Email enviada e registrada`);
          }

          await supabase
            .from('appointments')
            .update(updateData)
            .eq('id', data.id);
        } else {
          console.error(`[APPOINTMENTS] ❌ Nenhum método de notificação funcionou:`, notificationResult.results);
        }
      } catch (notificationError: any) {
        // Não falhar o agendamento se notificação falhar
        console.error('[APPOINTMENTS] ❌ Erro ao enviar notificação de confirmação:', notificationError);
        console.error('[APPOINTMENTS] Stack trace:', notificationError?.stack);
      }
    })(); // IIFE - executa imediatamente sem bloquear

    return NextResponse.json({ 
      appointment: data,
      message: 'Agendamento criado com sucesso' 
    });
  } catch (error: any) {
    console.error('Error in appointments API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const date = searchParams.get('date');

    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (email) {
      query = query.eq('email', email);
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query = query
        .gte('appointment_date', startDate.toISOString())
        .lte('appointment_date', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar agendamentos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ appointments: data || [] });
  } catch (error) {
    console.error('Error in appointments API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

