import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('posts')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (published !== null) {
      query = query.eq('published', published === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    console.error('Error in posts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category_id, featured_image_url, published, published_at, scheduled_at } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase.from('posts') as any)
      .insert([
        {
          title,
          slug,
          excerpt: excerpt || null,
          content,
          category_id: category_id || null,
          featured_image_url: featured_image_url || null,
          published: published || false,
          published_at: published_at || null,
          scheduled_at: scheduled_at || null,
        },
      ])
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

