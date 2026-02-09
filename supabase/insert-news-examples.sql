-- ==========================================
-- INSERIR NOTÍCIAS DE EXEMPLO
-- ==========================================
-- Execute este SQL no Supabase SQL Editor para criar notícias de teste
-- Supabase Dashboard → SQL Editor → Cole este código → Run

-- 1. Verificar se as categorias existem
SELECT id, name, slug FROM categories ORDER BY name;

-- 2. Inserir notícias de exemplo
-- Nota: Ajuste os category_id conforme os IDs do seu banco

-- Notícia 1: AIMA
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category_id,
  featured_image_url,
  published,
  published_at,
  source,
  ai_generated
) VALUES (
  'AIMA anuncia novas regras para pedidos de nacionalidade em 2026',
  'aima-novas-regras-nacionalidade-2026',
  'A Agência para Integração, Migrações e Asilo (AIMA) divulgou hoje as novas diretrizes para solicitações de nacionalidade portuguesa, com mudanças significativas nos prazos e documentação necessária.',
  '<h2>Principais Mudanças</h2>
  <p>A AIMA anunciou hoje uma série de mudanças importantes nos processos de nacionalidade portuguesa. As novas regras entram em vigor a partir de março de 2026 e visam agilizar os pedidos e reduzir o tempo de espera.</p>
  
  <h3>Documentação Simplificada</h3>
  <p>Uma das principais novidades é a redução da documentação exigida. Agora, os requerentes precisarão apresentar:</p>
  <ul>
    <li>Certidão de nascimento apostilada</li>
    <li>Certificado de registo criminal do país de origem</li>
    <li>Comprovativo de residência em Portugal</li>
    <li>Certificado de proficiência em português (nível A2 mínimo)</li>
  </ul>
  
  <h3>Prazos Reduzidos</h3>
  <p>O tempo médio de análise dos processos será reduzido de 24 para 18 meses, segundo informou a AIMA. Esta medida é parte do plano de modernização da agência.</p>
  
  <h3>Agendamento Online</h3>
  <p>Todo o processo de agendamento passa a ser 100% digital através do portal da AIMA. Não será mais necessário deslocação presencial para entrega de documentos na fase inicial.</p>
  
  <p><strong>Para mais informações, consulte o site oficial da AIMA ou entre em contacto com os nossos consultores especializados.</strong></p>',
  (SELECT id FROM categories WHERE slug = 'aima' LIMIT 1),
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
  true,
  NOW(),
  'manual',
  false
);

-- Notícia 2: Documentação
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category_id,
  featured_image_url,
  published,
  published_at,
  source,
  ai_generated
) VALUES (
  'Como obter o NIF em Portugal: Guia completo 2026',
  'como-obter-nif-portugal-guia-2026',
  'O Número de Identificação Fiscal (NIF) é essencial para quem vive em Portugal. Veja o passo a passo atualizado para obter o seu documento.',
  '<h2>O que é o NIF?</h2>
  <p>O NIF (Número de Identificação Fiscal) é um número único atribuído a cada contribuinte em Portugal. É essencial para diversas atividades, como abrir conta bancária, assinar contratos de trabalho, comprar casa, entre outras.</p>
  
  <h2>Quem precisa de NIF?</h2>
  <p>Todos os residentes em Portugal precisam de NIF, incluindo:</p>
  <ul>
    <li>Cidadãos portugueses</li>
    <li>Cidadãos estrangeiros residentes</li>
    <li>Trabalhadores temporários</li>
    <li>Estudantes</li>
    <li>Proprietários de imóveis</li>
  </ul>
  
  <h2>Como obter?</h2>
  <h3>Opção 1: Presencialmente</h3>
  <p>Dirija-se a qualquer serviço de Finanças em Portugal com:</p>
  <ul>
    <li>Passaporte ou documento de identificação</li>
    <li>Comprovativo de morada (se possível)</li>
  </ul>
  
  <h3>Opção 2: Online</h3>
  <p>Para quem já reside em Portugal, é possível solicitar o NIF através do Portal das Finanças.</p>
  
  <h3>Opção 3: Representante Fiscal</h3>
  <p>Se ainda não estiver em Portugal, pode nomear um representante fiscal para obter o NIF em seu nome.</p>
  
  <h2>Prazos</h2>
  <p>O NIF é emitido na hora quando solicitado presencialmente. Online, o processo pode levar até 48 horas.</p>
  
  <p><em>Atenção: É gratuito! Desconfie de quem cobra valores elevados por este serviço.</em></p>',
  (SELECT id FROM categories WHERE slug = 'documentacao' LIMIT 1),
  'https://images.unsplash.com/photo-1554224311-beee460ae6ba?w=1200',
  true,
  NOW() - INTERVAL '1 day',
  'manual',
  false
);

-- Notícia 3: IRS
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category_id,
  featured_image_url,
  published,
  published_at,
  source,
  ai_generated
) VALUES (
  'IRS 2026: O que muda para imigrantes residentes em Portugal',
  'irs-2026-mudancas-imigrantes',
  'Fique atento às principais alterações no IRS 2026 que afetam trabalhadores estrangeiros residentes em Portugal.',
  '<h2>Mudanças Importantes no IRS 2026</h2>
  <p>O ano fiscal de 2026 traz algumas mudanças relevantes para quem é residente fiscal em Portugal, especialmente para trabalhadores estrangeiros.</p>
  
  <h3>1. Regime de Residente Não Habitual (RNH)</h3>
  <p>O regime RNH sofreu alterações significativas:</p>
  <ul>
    <li>Taxa fixa de 20% mantida para atividades de elevado valor acrescentado</li>
    <li>Novas profissões incluídas na lista elegível</li>
    <li>Prazo de adesão permanece em 10 anos</li>
  </ul>
  
  <h3>2. Calendário Fiscal</h3>
  <p>As datas importantes para 2026:</p>
  <ul>
    <li><strong>1 de abril:</strong> Início da entrega do IRS</li>
    <li><strong>30 de junho:</strong> Prazo final para entrega</li>
    <li><strong>Julho a setembro:</strong> Período de reembolsos</li>
  </ul>
  
  <h3>3. Deduções Permitidas</h3>
  <p>Imigrantes podem deduzir:</p>
  <ul>
    <li>Despesas de saúde</li>
    <li>Despesas de educação (incluindo filhos)</li>
    <li>Rendas de habitação (até certo limite)</li>
    <li>Contribuições para segurança social</li>
  </ul>
  
  <h3>4. Primeira Declaração de IRS</h3>
  <p>Se é a sua primeira vez a declarar IRS em Portugal:</p>
  <ol>
    <li>Aceda ao Portal das Finanças com seu NIF</li>
    <li>Escolha "IRS Automático" se disponível</li>
    <li>Verifique todos os rendimentos declarados</li>
    <li>Adicione deduções não automáticas</li>
    <li>Submeta a declaração</li>
  </ol>
  
  <h2>Precisa de Ajuda?</h2>
  <p>Se tem dúvidas sobre como declarar o IRS, procure um contabilista certificado ou entre em contacto com os serviços de apoio ao contribuinte.</p>
  
  <p><strong>Dica:</strong> Guarde todos os comprovativos de despesas durante o ano para facilitar a declaração!</p>',
  (SELECT id FROM categories WHERE slug = 'irs' LIMIT 1),
  'https://images.unsplash.com/photo-1554224311-beee460ae6ba?w=1200',
  true,
  NOW() - INTERVAL '2 days',
  'manual',
  false
);

-- Notícia 4: Procedimentos
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category_id,
  featured_image_url,
  published,
  published_at,
  source,
  ai_generated
) VALUES (
  'Renovação de Autorização de Residência: Passo a Passo',
  'renovacao-autorizacao-residencia-passo-passo',
  'Saiba como renovar sua autorização de residência em Portugal sem complicações. Processo atualizado para 2026.',
  '<h2>Quando Renovar?</h2>
  <p>A renovação da autorização de residência deve ser solicitada com antecedência mínima de 30 dias antes do vencimento. É recomendado iniciar o processo 60 dias antes para evitar contratempos.</p>
  
  <h2>Documentos Necessários</h2>
  <p>Para renovar sua autorização, você precisará de:</p>
  <ul>
    <li>Formulário de renovação preenchido</li>
    <li>Passaporte válido (com validade superior ao período solicitado)</li>
    <li>Duas fotografias tipo passe</li>
    <li>Comprovativo de residência em Portugal</li>
    <li>Comprovativo de meios de subsistência (contrato de trabalho, recibos de vencimento, extratos bancários)</li>
    <li>Comprovativo de pagamento de taxas</li>
    <li>NIF e NISS</li>
  </ul>
  
  <h2>Passo a Passo</h2>
  
  <h3>1. Agendar Atendimento</h3>
  <p>Aceda ao portal da AIMA e agende um atendimento presencial. O agendamento online é obrigatório.</p>
  
  <h3>2. Preparar Documentação</h3>
  <p>Reúna todos os documentos listados acima. Certifique-se de que todas as cópias estão legíveis e atualizadas.</p>
  
  <h3>3. Comparecer ao Atendimento</h3>
  <p>No dia agendado, leve todos os documentos originais e cópias. Chegue com 15 minutos de antecedência.</p>
  
  <h3>4. Aguardar Processamento</h3>
  <p>O prazo para renovação é de aproximadamente 60 dias úteis. Você receberá um comprovativo que serve como autorização provisória.</p>
  
  <h3>5. Recolher o Título</h3>
  <p>Quando o processo estiver concluído, você será notificado para recolher seu novo título de residência.</p>
  
  <h2>Taxas</h2>
  <p>As taxas de renovação variam conforme o tipo de autorização:</p>
  <ul>
    <li>Autorização de Residência Temporária: €83,10</li>
    <li>Autorização de Residência Permanente: €166,60</li>
  </ul>
  
  <h2>Atenção!</h2>
  <p><strong>Não deixe sua autorização vencer sem renovar!</strong> Ficar com documentos vencidos pode resultar em multas e complicações na sua situação legal em Portugal.</p>
  
  <p>Em caso de dúvidas, consulte um advogado especializado em direito de imigração ou contacte a AIMA.</p>',
  (SELECT id FROM categories WHERE slug = 'documentacao' LIMIT 1),
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
  true,
  NOW() - INTERVAL '3 days',
  'manual',
  false
);

-- Notícia 5: Finanças
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category_id,
  featured_image_url,
  published,
  published_at,
  source,
  ai_generated
) VALUES (
  'Abrir conta bancária em Portugal: Guia para imigrantes',
  'abrir-conta-bancaria-portugal-guia',
  'Descubra como abrir uma conta bancária em Portugal mesmo antes de ter residência. Veja os documentos necessários e os principais bancos.',
  '<h2>Por que preciso de conta bancária?</h2>
  <p>Ter uma conta bancária em Portugal é essencial para:</p>
  <ul>
    <li>Receber salário</li>
    <li>Pagar contas (água, luz, internet)</li>
    <li>Realizar transferências</li>
    <li>Obter cartão de débito/crédito</li>
    <li>Comprovar meios de subsistência para processos de imigração</li>
  </ul>
  
  <h2>Documentos Necessários</h2>
  <p>Para abrir conta, você geralmente precisa de:</p>
  <ul>
    <li><strong>NIF</strong> (Número de Identificação Fiscal) - OBRIGATÓRIO</li>
    <li>Passaporte ou documento de identificação válido</li>
    <li>Comprovativo de morada em Portugal</li>
    <li>Comprovativo de rendimentos (contrato de trabalho, declaração de IRS, extratos bancários)</li>
  </ul>
  
  <p><em>Dica: Obtenha o NIF antes de abrir a conta! É impossível abrir conta sem ele.</em></p>
  
  <h2>Principais Bancos em Portugal</h2>
  
  <h3>Bancos Tradicionais</h3>
  <ul>
    <li><strong>CGD (Caixa Geral de Depósitos):</strong> Banco público, ampla rede de agências</li>
    <li><strong>Millennium BCP:</strong> Grande presença em todo o país</li>
    <li><strong>Novo Banco:</strong> Boa rede de atendimento</li>
    <li><strong>Santander Totta:</strong> Banco internacional</li>
    <li><strong>BPI:</strong> Forte presença no norte do país</li>
  </ul>
  
  <h3>Bancos Digitais</h3>
  <ul>
    <li><strong>ActivoBank:</strong> Banco 100% digital, tarifas reduzidas</li>
    <li><strong>Moey:</strong> Aplicativo gratuito</li>
    <li><strong>N26, Revolut:</strong> Opções europeias (verificar aceitação local)</li>
  </ul>
  
  <h2>Passo a Passo</h2>
  
  <h3>1. Obter o NIF</h3>
  <p>Primeiro passo obrigatório! Vá às Finanças ou nomeie um representante fiscal.</p>
  
  <h3>2. Escolher o Banco</h3>
  <p>Compare taxas, serviços oferecidos e proximidade de agências.</p>
  
  <h3>3. Agendar Atendimento ou Abrir Online</h3>
  <p>Alguns bancos permitem abertura online; outros exigem presença física.</p>
  
  <h3>4. Apresentar Documentação</h3>
  <p>Leve todos os documentos originais e cópias.</p>
  
  <h3>5. Assinar Contrato</h3>
  <p>Leia atentamente as condições, taxas e tarifas do banco.</p>
  
  <h3>6. Receber Cartão e Credenciais</h3>
  <p>Em alguns dias, você receberá cartão e acesso ao internet banking.</p>
  
  <h2>Taxas Bancárias</h2>
  <p>Atenção às taxas cobradas:</p>
  <ul>
    <li>Manutenção de conta (mensal/anual)</li>
    <li>Cartão de débito</li>
    <li>Transferências</li>
    <li>Descoberto bancário</li>
  </ul>
  
  <p>Alguns bancos oferecem isenção de taxas para jovens, estudantes ou mediante domiciliação de salário.</p>
  
  <h2>Dicas Importantes</h2>
  <ul>
    <li>✅ Compare as condições de diferentes bancos</li>
    <li>✅ Prefira contas com poucos custos fixos</li>
    <li>✅ Ative o internet banking para mais comodidade</li>
    <li>✅ Guarde bem seus dados de acesso</li>
    <li>❌ Evite descobertos bancários (juros altos!)</li>
  </ul>
  
  <p><strong>Agora que sabe o processo, escolha seu banco e abra sua conta!</strong></p>',
  (SELECT id FROM categories WHERE slug = 'financas' LIMIT 1),
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200',
  true,
  NOW() - INTERVAL '4 days',
  'manual',
  false
);

-- Verificar posts inseridos
SELECT 
  id,
  title,
  slug,
  published,
  published_at,
  source,
  ai_generated
FROM posts
WHERE source = 'manual'
ORDER BY published_at DESC;

-- ==========================================
-- SUCESSO!
-- ==========================================
-- Agora você tem 5 notícias de exemplo no sistema.
-- Acesse http://localhost:3000/noticias para ver!
