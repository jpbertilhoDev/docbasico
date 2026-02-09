import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Cache removido para garantir atualização em tempo real (Requisito do Admin)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[API /posts] Fetching from DB...', { category, search, limit, offset });

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

    // Log das primeiras notícias para debugging
    if (data && data.length > 0) {
      // console.log('[API /posts] First post:', { ... });
    }

    return NextResponse.json({ posts: data || [] }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'CDN-Cache-Control': 'no-store'
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
