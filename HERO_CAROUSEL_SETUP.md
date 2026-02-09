# Configuração do Carrossel Hero - Doc Basico

## 📸 Como Adicionar Imagens ao Carrossel

### 1. Preparar as Imagens

Adicione as imagens do carrossel na pasta `public/` com os seguintes nomes:
- `hero-1.jpg` (ou `.png`)
- `hero-2.jpg` (ou `.png`)
- `hero-3.jpg` (ou `.png`)

### 2. Recomendações de Imagens

**Tamanho recomendado:**
- Largura: 1920px
- Altura: 700px - 900px
- Formato: JPG ou PNG
- Peso: Otimizado (< 500KB por imagem)

**Temas sugeridos para as imagens:**
1. **hero-1.jpg**: Documentação, papéis, processos burocráticos
2. **hero-2.jpg**: Serviços fiscais, IRS, finanças
3. **hero-3.jpg**: Empresas, consultoria, negócios

### 3. Personalizar Textos

As imagens podem ter textos sobrepostos. Para personalizar, edite o arquivo `app/page.tsx`:

```typescript
const carouselImages = [
  {
    src: "/hero-1.jpg",
    alt: "Descrição da imagem",
    title: "Título que aparece sobre a imagem",
    description: "Descrição que aparece sobre a imagem",
  },
  // ... mais imagens
];
```

### 4. Adicionar Mais Imagens

Para adicionar mais imagens ao carrossel:

1. Adicione a imagem em `public/` (ex: `hero-4.jpg`)
2. Adicione o objeto no array `carouselImages` em `app/page.tsx`

### 5. Ajustar Velocidade

Para alterar a velocidade de transição, ajuste o `autoPlayInterval`:

```typescript
<HeroCarousel images={carouselImages} autoPlayInterval={5000} />
// 5000 = 5 segundos entre cada imagem
```

## 🎨 Funcionalidades do Carrossel

- ✅ **Transição automática** a cada 5 segundos
- ✅ **Navegação manual** com setas laterais
- ✅ **Indicadores de posição** (dots)
- ✅ **Pausa ao passar o mouse**
- ✅ **Transições suaves** (fade in/out)
- ✅ **Totalmente responsivo**
- ✅ **Acessível** (aria-labels, navegação por teclado)

## 📝 Notas

- Se as imagens não forem encontradas, o carrossel mostrará um gradiente padrão
- As imagens são otimizadas automaticamente pelo Next.js
- O carrossel funciona mesmo com apenas 1 imagem
- Sem imagens, mostra apenas o gradiente de fundo

---

**Localização do código:**
- Componente: `components/HeroCarousel.tsx`
- Uso: `app/page.tsx` (hero section)

