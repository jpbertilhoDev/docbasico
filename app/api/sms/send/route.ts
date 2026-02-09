import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

/**
 * API Route para enviar SMS
 * POST /api/sms/send
 * Body: { to: string, message: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Campos "to" e "message" são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await sendSMS({ to, message });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar SMS' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'SMS enviado com sucesso',
    });
  } catch (error: any) {
    console.error('Error in SMS API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

