import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { 
  fetchImmigrationNews, 
  formatNewsContent, 
  generateSlug,
  mapCategorySlug 
} from '@/lib/perplexity';

export async function POST(request: Request) {
  try {
    // Verificar autorização
    const authHeader = request.headers.get('authorization');
    const SECRET_TOKEN = process.env.CRON_SECRET_TOKEN;

    if (!SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'CRON_SECRET_TOKEN não configurado' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${SECRET_TOKEN}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('\n========================================');
    console.log('🤖 AUTOMAÇÃO DE NOTÍCIAS - DOC BASICO');
    console.log('========================================');
    console.log(`📅 Data: ${new Date().toLocaleString('pt-PT')}`);
    console.log('🔄 Iniciando busca automática de notícias...\n');

    // 1. Buscar notícias da Perplexity
    const articles = await fetchImmigrationNews();

    if (!articles || articles.length === 0) {
      console.log('⚠️ Nenhuma notícia encontrada\n');
      return NextResponse.json({
        success: false,
        message: 'Nenhuma notícia encontrada',
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`📰 ${articles.length} notícias recebidas da Perplexity\n`);

    // 2. Buscar todas as categorias
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug');

    const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || []);
    console.log(`📁 ${categoryMap.size} categorias carregadas\n`);

    // 3. Processar e salvar cada notícia
    const savedArticles = [];
    const skippedArticles = [];
    const errors = [];

    for (const article of articles) {
      try {
        console.log(`📝 Processando: "${article.title}"`);

        // Verificar se já existe (por URL)
        if (article.url && article.url.trim() !== '') {
          const { data: existing } = await supabase
            .from('posts')
            .select('id, title')
            .eq('external_url', article.url)
            .maybeSingle();

          if (existing) {
            console.log(`   ⏭️  Já existe (URL duplicada: ${existing.title})\n`);
            skippedArticles.push({
              title: article.title,
              reason: 'URL duplicada'
            });
            continue;
          }
        }

        // Gerar slug único
        let slug = generateSlug(article.title);
        
        // Verificar se slug já existe
        const { data: slugExists } = await supabase
          .from('posts')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (slugExists) {
          const timestamp = Date.now().toString().slice(-6);
          slug = `${slug}-${timestamp}`;
          console.log(`   🔄 Slug ajustado para: ${slug}`);
        }

        // Determinar categoria
        const categorySlug = mapCategorySlug(article.category);
        const categoryId = categoryMap.get(categorySlug) || categoryMap.get('noticias');

        console.log(`   📁 Categoria: ${categorySlug} (ID: ${categoryId})`);

        // Formatar conteúdo
        const formattedContent = formatNewsContent(article.content);

        // Salvar no banco
        const { data: newPost, error: insertError } = await supabase
          .from('posts')
          .insert({
            title: article.title,
            slug: slug,
            excerpt: article.summary,
            content: formattedContent,
            category_id: categoryId,
            featured_image_url: article.imageUrl && article.imageUrl.trim() !== '' ? article.imageUrl : null,
            source: 'perplexity',
            external_url: article.url && article.url.trim() !== '' ? article.url : null,
            ai_generated: true,
            published: true, // Publicar automaticamente
            published_at: new Date().toISOString(),
          })
          .select('id, title, slug, featured_image_url')
          .single();

        if (insertError) {
          console.error(`   ❌ Erro ao salvar:`, insertError.message);
          errors.push({
            title: article.title,
            error: insertError.message
          });
          continue;
        }

        console.log(`   ✅ Salva com sucesso! ID: ${newPost.id}`);
        console.log(`   🔗 Slug: ${newPost.slug}`);
        console.log(`   🖼️  Imagem: ${newPost.featured_image_url || 'Sem imagem'}\n`);
        
        savedArticles.push({
          id: newPost.id,
          title: newPost.title,
          slug: newPost.slug,
          imageUrl: newPost.featured_image_url
        });

      } catch (articleError: any) {
        console.error(`   ❌ Erro ao processar:`, articleError.message);
        errors.push({
          title: article.title,
          error: articleError.message
        });
      }
    }

    console.log('========================================');
    console.log('📊 RESUMO DA EXECUÇÃO:');
    console.log(`   ✅ Salvas: ${savedArticles.length}`);
    console.log(`   ⏭️  Ignoradas: ${skippedArticles.length}`);
    console.log(`   ❌ Erros: ${errors.length}`);
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      message: `${savedArticles.length} notícias salvas, ${skippedArticles.length} ignoradas, ${errors.length} erros`,
      saved: savedArticles,
      skipped: skippedArticles,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('\n❌ ERRO FATAL ao buscar notícias:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar notícias', 
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET para informações sobre a rota
export async function GET() {
  return NextResponse.json({
    service: 'Automação de Notícias - Doc Basico',
    description: 'Busca automática de notícias sobre imigração em Portugal usando Perplexity AI',
    endpoint: '/api/news/fetch',
    method: 'POST',
    authentication: 'Bearer token',
    schedule: 'Diário às 10h (via Vercel Cron)',
    usage: {
      manual_trigger: 'POST com Authorization: Bearer CRON_SECRET_TOKEN',
      automatic: 'Configurado em vercel.json'
    },
    features: [
      'Busca 5 notícias diárias sobre imigração em Portugal',
      'Foco em documentação (NIF, NISS, vistos, residência)',
      'Evita duplicatas por URL',
      'Gera slugs únicos automaticamente',
      'Categoriza notícias automaticamente',
      'Publica automaticamente'
    ]
  });
}

