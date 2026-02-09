import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

/**
 * DELETE /api/admin/appointments/[id]
 * Exclui um agendamento permanentemente do banco de dados
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await (supabase.from('appointments') as any)
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting appointment:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir agendamento', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento excluído com sucesso'
    });
  } catch (error: any) {
    console.error('Error in DELETE API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/appointments/[id]
 * Atualiza o status de um agendamento
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    const { error } = await (supabase.from('appointments') as any)
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (error) {
      console.error('Error updating appointment:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar agendamento', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso'
    });
  } catch (error: any) {
    console.error('Error in PUT API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error?.message },
      { status: 500 }
    );
  }
}

