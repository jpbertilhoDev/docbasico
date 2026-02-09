import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

/**
 * POST /api/appointments/[id]/cancel
 * Cancela um agendamento (público - usuário cancela seu próprio agendamento)
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    // Validações
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email é obrigatório para confirmar a identidade' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório para confirmar a identidade' },
        { status: 400 }
      );
    }

    // Normalizar telefone
    const normalizedPhone = phone.replace(/\D/g, '');

    // Primeiro, verificar se o agendamento existe e pertence ao usuário
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o email corresponde
    if (appointment.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return NextResponse.json(
        { error: 'Email não corresponde ao agendamento' },
        { status: 403 }
      );
    }

    // Verificar se o telefone corresponde (comparar últimos 9 dígitos)
    const aptPhoneNormalized = appointment.phone.replace(/\D/g, '');
    const aptLastDigits = aptPhoneNormalized.slice(-9);
    const searchLastDigits = normalizedPhone.slice(-9);
    
    if (aptLastDigits !== searchLastDigits) {
      return NextResponse.json(
        { error: 'Telefone não corresponde ao agendamento' },
        { status: 403 }
      );
    }

    // Verificar se já está cancelado
    if (appointment.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Este agendamento já foi cancelado' },
        { status: 400 }
      );
    }

    // Verificar se já foi concluído
    if (appointment.status === 'completed') {
      return NextResponse.json(
        { error: 'Não é possível cancelar um agendamento já concluído' },
        { status: 400 }
      );
    }

    // Atualizar status para cancelled
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (updateError) {
      console.error('Error cancelling appointment:', updateError);
      return NextResponse.json(
        { error: 'Erro ao cancelar agendamento', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento cancelado com sucesso'
    });
  } catch (error: any) {
    console.error('Error in cancel API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error?.message },
      { status: 500 }
    );
  }
}

