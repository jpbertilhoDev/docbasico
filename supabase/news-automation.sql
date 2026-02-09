-- ================================================
-- AUTOMAÇÃO DE NOTÍCIAS - DOC BASICO
-- ================================================
-- Este script adiciona campos necessários para rastrear
-- notícias automáticas buscadas via Perplexity AI

-- Adicionar campos para rastreamento de notícias automáticas
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'manual';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- Criar índice para evitar duplicatas por URL
CREATE INDEX IF NOT EXISTS idx_posts_external_url ON posts(external_url) 
WHERE external_url IS NOT NULL;

-- Criar índice para buscar notícias por fonte
CREATE INDEX IF NOT EXISTS idx_posts_source ON posts(source);

-- Criar índice para buscar notícias geradas por IA
CREATE INDEX IF NOT EXISTS idx_posts_ai_generated ON posts(ai_generated) 
WHERE ai_generated = true;

-- Comentários para documentação
COMMENT ON COLUMN posts.source IS 'Fonte da notícia: manual, perplexity, web_scraping';
COMMENT ON COLUMN posts.external_url IS 'URL original da notícia (para evitar duplicatas)';
COMMENT ON COLUMN posts.ai_generated IS 'Se o conteúdo foi gerado/resumido por IA';

-- Verificar estrutura
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND column_name IN ('source', 'external_url', 'ai_generated')
ORDER BY ordinal_position;


