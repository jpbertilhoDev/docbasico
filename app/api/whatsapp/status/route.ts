import { NextResponse } from 'next/server';
import { isWhatsAppConnected, getWhatsAppStatus } from '@/lib/whatsapp-baileys';

/**
 * API Route para verificar status da conexão WhatsApp
 * Verifica primeiro a API HTTP (se WhatsApp estiver em processo separado),
 * depois verifica socket local
 * GET /api/whatsapp/status
 */
export async function GET() {
  try {
    // Primeiro tentar verificar via API HTTP (se WhatsApp estiver rodando em processo separado)
    try {
      const response = await fetch('http://localhost:3001/status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const status = await response.json();
        return NextResponse.json({
          connected: status.connected,
          status,
          message: status.connected
            ? `WhatsApp está conectado e pronto para enviar mensagens (${status.phoneNumber || 'N/A'})`
            : 'WhatsApp não está conectado. Por favor, escaneie o QR code primeiro.',
          source: 'http-api',
        });
      }
    } catch (error) {
      // Se API HTTP não estiver disponível, verificar socket local
      console.log('[WHATSAPP STATUS] API HTTP não disponível, verificando socket local...');
    }

    // Verificar socket local (se estiver no mesmo processo)
    const status = getWhatsAppStatus();
    const connected = await isWhatsAppConnected();
    
    return NextResponse.json({
      connected,
      status,
      message: connected 
        ? `WhatsApp está conectado e pronto para enviar mensagens (${status.phoneNumber || 'N/A'})`
        : 'WhatsApp não está conectado. Por favor, execute: npx tsx scripts/start-whatsapp-server.ts',
      source: 'local-socket',
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        connected: false,
        error: error.message || 'Erro ao verificar status do WhatsApp' 
      },
      { status: 500 }
    );
  }
}

