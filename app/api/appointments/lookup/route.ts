import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

// Cache em memória (30 segundos) para reduzir chamadas ao DB
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 segundos

/**
 * POST /api/appointments/lookup
 * Busca agendamentos por email e telefone (público)
 * Otimizado com cache e índices
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    // Validações
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Normalizar telefone (remover caracteres não numéricos para comparação)
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Criar chave de cache
    const cacheKey = `${email.toLowerCase().trim()}_${normalizedPhone.slice(-9)}`;
    
    // Verificar cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'private, max-age=30',
          'X-Cache': 'HIT'
        }
      });
    }

    // Buscar agendamentos que correspondem ao email E telefone
    // Otimizado: selecionar apenas campos necessários para reduzir payload
    const { data: appointments, error } = await (supabase.from('appointments') as any)
      .select('id, name, email, phone, service_slug, service_name, appointment_date, appointment_time, status, notes, documents_reminder, created_at')
      .ilike('email', email.trim())
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false })
      .limit(50); // Limitar a 50 resultados para performance

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar agendamentos', details: error.message },
        { status: 500 }
      );
    }

    // Filtrar por telefone normalizado (pode ter formatos diferentes)
    const filteredAppointments = (appointments || []).filter(apt => {
      const aptPhoneNormalized = apt.phone.replace(/\D/g, '');
      // Comparar os últimos 9 dígitos (para lidar com códigos de país diferentes)
      const aptLastDigits = aptPhoneNormalized.slice(-9);
      const searchLastDigits = normalizedPhone.slice(-9);
      return aptLastDigits === searchLastDigits;
    });

    const responseData = {
      success: true,
      appointments: filteredAppointments,
      count: filteredAppointments.length
    };

    // Armazenar no cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    // Limpar cache antigo (garbage collection)
    if (cache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'private, max-age=30',
        'X-Cache': 'MISS'
      }
    });
  } catch (error: any) {
    console.error('Error in lookup API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error?.message },
      { status: 500 }
    );
  }
}

