import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const days = parseInt(searchParams.get('days') || '14'); // Próximos 14 dias por padrão

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (date) {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    // Data atual para filtrar apenas datas futuras ou hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Garantir que começamos de hoje ou depois
    const actualStartDate = startDate < today ? today : startDate;

    // Buscar slots disponíveis (apenas datas >= hoje)
    const { data: slots, error: slotsError } = await supabase
      .from('available_slots')
      .select('*')
      .gte('date', actualStartDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .eq('is_available', true)
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true });

    if (slotsError) {
      console.error('Error fetching slots:', slotsError);
      return NextResponse.json(
        { error: 'Erro ao buscar horários disponíveis' },
        { status: 500 }
      );
    }

    // Buscar agendamentos confirmados para verificar disponibilidade real
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('appointment_date, appointment_time, status')
      .gte('appointment_date', startDate.toISOString())
      .lte('appointment_date', endDate.toISOString())
      .in('status', ['pending', 'confirmed']);

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
    }

    // Data/hora atual para filtrar horários passados
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // Data de hoje em formato YYYY-MM-DD
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Agrupar slots por data
    const slotsByDate: Record<string, any[]> = {};
    
    slots?.forEach(slot => {
      const dateKey = slot.date;
      const slotDate = new Date(slot.date);
      slotDate.setHours(0, 0, 0, 0);
      
      // Formatar hora para HH:MM (remover segundos se existirem)
      const timeFormatted = slot.time_slot.includes(':') 
        ? slot.time_slot.split(':').slice(0, 2).join(':')
        : slot.time_slot;
      
      // Extrair hora e minuto do slot
      const [slotHour, slotMinute] = timeFormatted.split(':').map(Number);
      
      // Verificar se o horário já passou (apenas para hoje)
      const isToday = dateKey === todayStr;
      const isPastTime = isToday && (
        slotHour < currentHour || 
        (slotHour === currentHour && slotMinute <= currentMinute)
      );
      
      if (isPastTime) {
        // Pular horários passados do dia atual
        return;
      }
      
      // Verificar se há agendamentos neste slot
      // Usar appointment_time diretamente para comparação mais precisa
      const hasAppointment = appointments?.some(apt => {
        const aptDate = new Date(apt.appointment_date);
        const aptDateStr = aptDate.toISOString().split('T')[0];
        
        // Comparar data e hora
        if (aptDateStr !== slot.date) return false;
        
        // Comparar hora formatada
        const aptTimeFormatted = apt.appointment_time.includes(':')
          ? apt.appointment_time.split(':').slice(0, 2).join(':')
          : apt.appointment_time;
        
        return aptTimeFormatted === timeFormatted;
      });

      // Só adicionar se não tiver agendamento e estiver disponível
      if (!hasAppointment && slot.is_available) {
        if (!slotsByDate[dateKey]) {
          slotsByDate[dateKey] = [];
        }
        slotsByDate[dateKey].push(timeFormatted);
      }
    });

    return NextResponse.json({ 
      slots: slotsByDate,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error in slots API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

