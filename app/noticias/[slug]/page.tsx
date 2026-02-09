import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/server";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute
export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

async function getPost(slug: string) {
  try {
    const { data: post, error } = await (supabase.from('posts') as any)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .lte('published_at', new Date().toISOString())
      .single();

    if (error || !post) {
      console.error('Error fetching post:', error);
      return null;
    }

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getRelatedPosts(categoryId: string, currentSlug: string) {
  try {
    const { data: posts, error } = await (supabase.from('posts') as any)
      .select('id, title, slug, excerpt, featured_image_url, published_at')
      .eq('category_id', categoryId)
      .eq('published', true)
      .neq('slug', currentSlug)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }

    return posts || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Notícia não encontrada | Doc Básico',
    };
  }

  return {
    title: `${post.title} | Doc Básico`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = post.categories?.id
    ? await getRelatedPosts(post.categories.id, params.slug)
    : [];

  return (
    <div className="py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 md:mb-8">
          <Link
            href="/noticias"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Notícias
          </Link>
        </nav>

        {/* Article */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="aspect-video md:aspect-[21/9] bg-gray-100 overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <header className="px-5 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 border-b border-gray-100">
            {post.categories && (
              <span className="inline-block px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-4">
                {post.categories.name}
              </span>
            )}
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-gray-900">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-gray-500">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{post.published_at && formatDate(post.published_at)}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="px-5 md:px-8 py-6 md:py-8">
            <div
              className="prose prose-sm md:prose-base max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4 prose-headings:mt-6
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                prose-li:text-gray-700 prose-li:leading-relaxed
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Share */}
          <div className="px-5 md:px-8 py-5 md:py-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium text-sm">Compartilhar:</span>
              <div className="flex gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-white"
                  aria-label="Compartilhar no Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5 text-gray-900">Notícias Relacionadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost.id}
                  href={`/noticias/${relatedPost.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group"
                >
                  {relatedPost.featured_image_url && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-8 md:mt-10 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl p-6 md:p-8 text-center shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Precisa de ajuda?</h2>
          <p className="mb-5 text-primary-50 text-sm md:text-base max-w-md mx-auto">
            Entre em contacto connosco e receba orientação personalizada.
          </p>
          <Link
            href="/contato"
            className="inline-block bg-white text-primary-700 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-md hover:shadow-xl text-sm md:text-base"
          >
            Fale Connosco
          </Link>
        </div>
      </div>
    </div>
  );
}

