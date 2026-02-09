/**
 * Serviço de integração com Perplexity AI
 * Para buscar notícias atualizadas sobre imigração em Portugal
 */

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface NewsArticle {
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl: string;
  category: string;
  publishedDate: string;
}

export async function fetchImmigrationNews(): Promise<NewsArticle[]> {
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  
  if (!PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY não configurada no .env.local');
  }

  const prompt = `
    Busque 5 notícias recentes sobre imigração em Portugal (últimos 3 dias), focando em:
    - AIMA, vistos, residência, nacionalidade
    - NIF, NISS, Cartão Cidadão
    - IRS para imigrantes
    - Documentação e procedimentos burocráticos
    
    Para cada notícia, busque também uma imagem relevante da fonte original.
    
    Retorne APENAS um array JSON válido (sem markdown, sem texto extra):
    [
      {
        "title": "titulo sem aspas duplas",
        "summary": "resumo curto de 2 frases",
        "content": "conteudo de 200 palavras sem aspas duplas e sem quebras de linha",
        "url": "",
        "imageUrl": "URL da imagem da noticia ou imagem relacionada ao tema",
        "category": "Documentacao",
        "publishedDate": "2026-01-08"
      }
    ]
    
    REGRAS CRÍTICAS:
    - Use APENAS aspas simples (') dentro dos textos, NUNCA aspas duplas (")
    - Substitua quebras de linha por espaços
    - Remova caracteres especiais
    - JSON deve ser válido e parseable
    - imageUrl deve ser uma URL válida de imagem (jpg, png, webp)
    - Se não encontrar imagem, use uma URL de placeholder relacionada a Portugal ou imigração
    - Retorne APENAS o array, nada mais
  `;

  try {
    console.log('[PERPLEXITY] 🔍 Buscando notícias...');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro', // Advanced search model with grounding (perfect for news)
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em notícias de imigração e documentação em Portugal. Sempre busque informações atualizadas de fontes confiáveis como portais governamentais e jornais portugueses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Baixa para respostas mais factuais
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PERPLEXITY] ❌ Erro na API:', errorText);
      throw new Error(`Perplexity API erro: ${response.status} - ${errorText}`);
    }

    const data: PerplexityResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Nenhum conteúdo retornado pela Perplexity');
    }

    console.log('[PERPLEXITY] 📝 Resposta recebida, processando...');

    // Extrair JSON da resposta (pode vir com markdown)
    let jsonText = content;
    
    // Remover markdown se existir
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    }
    
    // Tentar extrair array JSON
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('[PERPLEXITY] ⚠️ Resposta completa:', content.substring(0, 500) + '...');
      throw new Error('Formato JSON não encontrado na resposta');
    }

    let articles: NewsArticle[];
    try {
      // Limpar JSON antes de parsear
      const cleanJson = jsonMatch[0]
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\r\n/g, ' ') // Remove line breaks
        .replace(/\n/g, ' ') // Remove new lines
        .replace(/\t/g, ' ') // Remove tabs
        .replace(/  +/g, ' '); // Remove multiple spaces
      
      articles = JSON.parse(cleanJson);
    } catch (parseError: any) {
      console.error('[PERPLEXITY] ❌ Erro ao parsear JSON:', parseError.message);
      console.error('[PERPLEXITY] JSON problemático (primeiros 1000 chars):', jsonMatch[0].substring(0, 1000));
      throw new Error(`Erro ao parsear resposta JSON: ${parseError.message}`);
    }
    
    console.log(`[PERPLEXITY] ✅ ${articles.length} notícias encontradas`);
    
    return articles;
  } catch (error) {
    console.error('[PERPLEXITY] ❌ Erro ao buscar notícias:', error);
    throw error;
  }
}

/**
 * Formata o conteúdo em HTML básico
 */
export function formatNewsContent(content: string): string {
  // Dividir em parágrafos
  const paragraphs = content
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  // Converter para HTML
  return paragraphs.map(p => `<p>${p}</p>`).join('\n');
}

/**
 * Gera slug único a partir do título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, '') // Remove hífens no início/fim
    .substring(0, 200); // Limita tamanho
}

/**
 * Mapeia categoria da notícia para slug da categoria no banco
 */
export function mapCategorySlug(category: string): string {
  const categoryMap: Record<string, string> = {
    'AIMA': 'aima',
    'Documentacao': 'documentacao',
    'Documentação': 'documentacao',
    'IRS': 'irs',
    'Financas': 'financas',
    'Finanças': 'financas',
    'Noticias': 'noticias',
    'Notícias': 'noticias',
  };
  
  return categoryMap[category] || 'noticias';
}

