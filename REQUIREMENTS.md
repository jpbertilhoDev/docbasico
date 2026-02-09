# DOCUMENTO DE REQUISITOS - DOC BASICO

## 📋 1. VISÃO GERAL DO PROJETO

### 1.1 Objetivo
Desenvolver uma plataforma moderna, responsiva e profissional de serviços burocráticos e consultoria para imigrantes em Portugal, com sistema de blog/notícias integrado.

### 1.2 Nicho
Serviços burocráticos, documentação e consultoria para imigrantes em Portugal, incluindo questões fiscais e empresariais.

### 1.3 Público-Alvo
- Imigrantes em Portugal (principalmente CPLP)
- Pessoas em processo de legalização
- Contribuintes com questões fiscais
- Empreendedores que precisam constituir empresa
- Pessoas que precisam renovar documentos

---

## 🎯 2. OBJETIVOS DO SITE

1. Transmitir confiança e profissionalismo
2. Facilitar compreensão dos serviços oferecidos
3. Destacar notícias e atualizações legais importantes
4. Gerar leads através de formulários de contato/solicitação
5. Ser referência em informações sobre imigração em Portugal

---

## 🛠️ 3. STACK TECNOLÓGICA

### 3.1 Frontend
- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Animações**: Framer Motion
- **Formulários**: React Hook Form + Zod
- **Editor Rich Text**: TipTap ou React Quill

### 3.2 Backend (Fase 2)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage (imagens)
- **API**: Next.js API Routes

### 3.3 Deployment
- **Hosting**: Vercel (Next.js)
- **Database**: Supabase Cloud

---

## 📱 4. REQUISITOS FUNCIONAIS

### 4.1 Páginas Públicas

#### 4.1.1 Homepage
- [ ] Hero section com impacto visual e CTA
- [ ] Seção de serviços em cards
- [ ] Últimas notícias (destaque)
- [ ] Seção "Por que escolher Doc Basico"
- [ ] Formulário de contato rápido
- [ ] Footer completo

#### 4.1.2 Página de Serviços
- [ ] Lista de todos os serviços
- [ ] Filtros por categoria (Documentação, Fiscal, Empresarial)
- [ ] Cards de serviços com:
  - Ícone/ilustração
  - Título
  - Descrição breve
  - Botão "Saiba mais" / "Solicitar"

#### 4.1.3 Página Individual de Serviço
- [ ] Breadcrumb
- [ ] Título e descrição detalhada
- [ ] Processo passo a passo
- [ ] Benefícios do serviço
- [ ] Formulário de solicitação
- [ ] FAQ relacionado
- [ ] CTA para contato

#### 4.1.4 Blog/Notícias
- [ ] Lista de posts com:
  - Imagem destacada
  - Título
  - Data de publicação
  - Categoria
  - Excerpt (resumo)
  - Botão "Ler mais"
- [ ] Filtros por categoria
- [ ] Busca de posts
- [ ] Paginação
- [ ] Posts relacionados

#### 4.1.5 Post Individual (Notícia)
- [ ] Breadcrumb
- [ ] Imagem destacada
- [ ] Título
- [ ] Meta informações (data, categoria, autor)
- [ ] Conteúdo formatado (rich text)
- [ ] Botões de compartilhamento social
- [ ] Posts relacionados
- [ ] CTA para contato

#### 4.1.6 Páginas Secundárias
- [ ] Sobre
- [ ] Contato (formulário completo)
- [ ] Termos de Uso
- [ ] Política de Privacidade

### 4.2 Dashboard Admin

#### 4.2.1 Autenticação
- [ ] Login com email/senha
- [ ] Proteção de rotas admin
- [ ] Sessão persistente
- [ ] Logout

#### 4.2.2 Gerenciamento de Posts
- [ ] Lista de posts (tabela/cards)
- [ ] Criar novo post
- [ ] Editar post existente
- [ ] Excluir post
- [ ] Publicar/Rascunho
- [ ] Agendar publicação
- [ ] Preview antes de publicar
- [ ] Upload de imagens
- [ ] Editor rich text

#### 4.2.3 Gerenciamento de Categorias
- [ ] Lista de categorias
- [ ] Criar categoria
- [ ] Editar categoria
- [ ] Excluir categoria

#### 4.2.4 Dashboard Principal
- [ ] Estatísticas (total de posts, visualizações, etc.)
- [ ] Posts recentes
- [ ] Posts agendados
- [ ] Acesso rápido a ações

---

## 🎨 5. REQUISITOS DE DESIGN

### 5.1 Paleta de Cores
- **Primária**: Azul institucional (#1E40AF ou similar)
- **Secundária**: Verde (#059669 ou similar)
- **Neutros**: Cinzas para textos
- **Sucesso**: Verde
- **Aviso**: Amarelo/Laranja
- **Erro**: Vermelho

### 5.2 Tipografia
- **Títulos**: Inter, Poppins ou similar (bold/medium)
- **Corpo**: Inter, Open Sans ou similar (regular, 16px+)
- Hierarquia clara e legível

### 5.3 Responsividade
- **Mobile First**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large Desktop**: 1920px+

### 5.4 Componentes UI
- Header fixo/sticky
- Menu mobile (hamburger)
- Cards (serviços, notícias)
- Formulários com validação
- Botões (primário, secundário, outline)
- Badges (categorias)
- Modais
- Tooltips
- Loading states
- Empty states

### 5.5 Microinterações
- Hover states
- Transições suaves
- Feedback visual em ações
- Animações discretas

---

## 📦 6. SERVIÇOS OFERECIDOS

### 6.1 Documentação e Legalização
1. **Renovação de Residência**
   - Descrição do processo
   - Documentos necessários
   - Formulário de solicitação

2. **Visto para Portugal**
   - Tipos de visto
   - Requisitos
   - Processo passo a passo

3. **Processo de Nacionalidade**
   - Requisitos
   - Documentação
   - Prazos

4. **NIF (Número de Identificação Fiscal)**
   - Como solicitar
   - Documentos necessários
   - Formulário

5. **Segurança Social**
   - Inscrição
   - Documentação
   - Formulário

6. **Cartão Cidadão**
   - Requisitos
   - Processo
   - Formulário

### 6.2 Serviços Fiscais (IRS)
1. **Reconhecimento de Faturas**
   - Como funciona
   - Benefícios
   - Formulário

2. **Agregado Familiar**
   - Explicação
   - Vantagens
   - Formulário

3. **Envio do IRS**
   - Processo completo
   - Documentação
   - Formulário

### 6.3 Serviços Empresariais
1. **Constituição de Empresa**
   - Tipos de empresa
   - Processo
   - Documentação
   - Formulário

2. **Consultoria Empresarial**
   - Serviços oferecidos
   - Formulário de contato

---

## 🗄️ 7. ESTRUTURA DE DADOS

### 7.1 Tabelas (Supabase)

#### posts
```sql
- id (UUID, PK)
- title (VARCHAR)
- slug (VARCHAR, UNIQUE)
- excerpt (TEXT)
- content (TEXT)
- category_id (UUID, FK)
- featured_image_url (TEXT)
- author_id (UUID, FK)
- published (BOOLEAN)
- published_at (TIMESTAMP)
- scheduled_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### categories
```sql
- id (UUID, PK)
- name (VARCHAR)
- slug (VARCHAR, UNIQUE)
- description (TEXT)
- created_at (TIMESTAMP)
```

#### services
```sql
- id (UUID, PK)
- name (VARCHAR)
- slug (VARCHAR, UNIQUE)
- description (TEXT)
- icon (VARCHAR)
- price (DECIMAL, optional)
- features (JSONB)
- category (VARCHAR)
- created_at (TIMESTAMP)
```

#### contact_submissions
```sql
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR, optional)
- service (VARCHAR, optional)
- message (TEXT)
- created_at (TIMESTAMP)
```

---

## ✅ 8. CRITÉRIOS DE ACEITAÇÃO

### 8.1 Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Imagens otimizadas (WebP, lazy loading)

### 8.2 Acessibilidade
- [ ] WCAG 2.1 AA compliance
- [ ] Contraste adequado (4.5:1 mínimo)
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Alt text em todas as imagens

### 8.3 SEO
- [ ] Meta tags (title, description)
- [ ] Open Graph tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] URLs amigáveis (slug)

### 8.4 Responsividade
- [ ] Funciona em todos os dispositivos
- [ ] Menu mobile funcional
- [ ] Formulários adaptáveis
- [ ] Imagens responsivas

### 8.5 Segurança
- [ ] Validação de formulários (frontend + backend)
- [ ] Sanitização de inputs
- [ ] Proteção CSRF
- [ ] Autenticação segura (Supabase)
- [ ] HTTPS obrigatório

---

## 📅 9. FASES DE DESENVOLVIMENTO

### FASE 1: Frontend (Atual)
- [x] Documento de requisitos
- [ ] Estrutura do projeto Next.js
- [ ] Design system e componentes base
- [ ] Páginas públicas principais
- [ ] Layout responsivo
- [ ] Integração de formulários

### FASE 2: Backend
- [ ] Configuração Supabase
- [ ] Schema do banco de dados
- [ ] API Routes (Next.js)
- [ ] Autenticação admin
- [ ] Dashboard admin
- [ ] CRUD de posts
- [ ] Sistema de agendamento
- [ ] Upload de imagens

### FASE 3: Refinamentos
- [ ] Otimizações de performance
- [ ] Testes
- [ ] Ajustes de UX
- [ ] SEO completo
- [ ] Analytics

### FASE 4: Deploy
- [ ] Configuração Vercel
- [ ] Configuração Supabase
- [ ] Domínio customizado
- [ ] SSL/HTTPS
- [ ] Monitoramento

---

## 📝 10. NOTAS IMPORTANTES

- Design inspirado em https://aima.gov.pt/pt (adaptado)
- Tom profissional mas acessível
- Priorizar usabilidade sobre estética
- Mobile first approach
- Performance é crítica
- Acessibilidade obrigatória

---

## 🔄 11. VERSIONAMENTO

- **v1.0.0**: MVP - Frontend completo + Backend básico
- **v1.1.0**: Dashboard admin completo
- **v1.2.0**: Sistema de agendamento
- **v1.3.0**: Analytics e otimizações

---

**Última atualização**: 05/01/2026
**Versão do documento**: 1.0

