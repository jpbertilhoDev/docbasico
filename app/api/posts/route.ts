import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Cache inteligente de 60 segundos (1 minuto) - Compromisso entre performance e atualização
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minuto

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Criar chave de cache
    const cacheKey = `${category || 'all'}_${search || ''}_${limit}_${offset}`;

    // Verificar cache (1 minuto)
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[API /posts] Cache HIT -', cached.data.posts?.length || 0, 'posts');
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
          'X-Cache': 'HIT',
          'X-Posts-Count': String(cached.data.posts?.length || 0)
        }
      });
    }

    console.log('[API /posts] Cache MISS - Fetching from DB...', { category, search, limit, offset });

    let query = (supabase.from('posts') as any)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Busca por categoria
    if (category) {
      query = query.eq('categories.slug', category);
    }

    // Busca por texto (título, excerpt ou conteúdo)
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API /posts] Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts', details: error.message },
        { status: 500 }
      );
    }

    console.log(`[API /posts] Found ${data?.length || 0} posts`);

    // Log das primeiras notícias para debugging
    if (data && data.length > 0) {
      console.log('[API /posts] First post:', {
        title: data[0].title,
        published: data[0].published,
        published_at: data[0].published_at,
        slug: data[0].slug
      });
    }

    const responseData = { posts: data || [] };

    // Armazenar no cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    // Limpar cache antigo (garbage collection)
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
        'X-Cache': 'MISS',
        'X-Posts-Count': String(data?.length || 0)
      }
    });
  } catch (error) {
    console.error('[API /posts] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
