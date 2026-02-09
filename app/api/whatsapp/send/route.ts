import { NextResponse } from 'next/server';
import { sendWhatsApp } from '@/lib/whatsapp-baileys';

/**
 * API Route para enviar mensagem WhatsApp
 * POST /api/whatsapp/send
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

    const result = await sendWhatsApp({ to, message });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar WhatsApp' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'WhatsApp enviado com sucesso',
    });
  } catch (error: any) {
    console.error('Error in WhatsApp API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

