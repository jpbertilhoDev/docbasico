import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await (supabase.from('posts') as any)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching post:', error);
      return NextResponse.json(
        { error: 'Failed to fetch post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error('Error in GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category_id, featured_image_url, published, published_at, scheduled_at } = body;

    const { data, error } = await (supabase.from('posts') as any)
      .update({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category_id: category_id || null,
        featured_image_url: featured_image_url || null,
        published: published || false,
        published_at: published_at || null,
        scheduled_at: scheduled_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
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
      console.error('Error updating post:', error);
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error('Error in PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await (supabase.from('posts') as any)
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting post:', error);
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

