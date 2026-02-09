# 🎨 Imagens do Carrosel Hero - Guia de Configuração

Documentação sobre as imagens usadas no carrosel da hero section.

---

## 📷 **Imagens Atuais**

### **Slide 1: Imigrantes**
- **Arquivo:** `imigrante-ok.png`
- **Título:** "Transforme a Complexidade em Simplicidade"
- **Descrição:** "Mais de 10.000 imigrantes já confiaram em nós para regularizar a sua situação em Portugal"
- **Tema:** Documentação e legalização para imigrantes

### **Slide 2: Consultoria**
- **Arquivo:** `consultoria-img.png`
- **Título:** "Construa o Seu Futuro em Portugal"
- **Descrição:** "Da constituição à gestão, acompanhamos cada etapa do seu negócio"
- **Tema:** Consultoria empresarial

---

## 📐 **Especificações Técnicas**

### **Tamanho Recomendado:**
```
Largura: 1920px (mínimo: 1280px)
Altura: 1080px (mínimo: 720px)
Proporção: 16:9 ou similar
Formato: PNG, JPG ou WebP
Tamanho do arquivo: < 500KB (otimizado)
```

### **Posicionamento:**
```css
object-fit: cover       /* Preenche o espaço mantendo proporção */
object-position: center /* Centralizado */
```

### **Responsividade:**
- **Desktop (>1024px):** Imagem completa visível
- **Tablet (768px-1024px):** Imagem ajustada ao centro
- **Mobile (<768px):** Imagem centralizada, área crítica visível

---

## 🎨 **Boas Práticas para Imagens**

### **✅ O Que Fazer:**
1. **Otimizar antes de usar:**
   - Comprimir com TinyPNG ou Squoosh
   - Reduzir para 1920x1080px máximo
   - Salvar em qualidade 80-85%

2. **Área de segurança:**
   - Manter elementos importantes no centro
   - Evitar texto pequeno nas bordas
   - Considerar crop em mobile

3. **Overlay escuro:**
   - O carrosel já aplica overlay escuro
   - Garante legibilidade do texto branco
   - Efeito vignette automático

4. **Consistência visual:**
   - Usar fotos com estilo similar
   - Manter paleta de cores coesa
   - Preferir fotos profissionais

### **❌ O Que Evitar:**
- Imagens muito claras (dificulta leitura)
- Textos já escritos na imagem
- Rostos cortados nas bordas
- Imagens borradas ou pixeladas
- Arquivos muito pesados (>2MB)

---

## 🔧 **Como Adicionar Nova Imagem**

### **Passo 1: Preparar a Imagem**
```bash
# Otimizar com TinyPNG ou:
# https://tinypng.com/
# https://squoosh.app/

# Salvar em: /public/
# Exemplo: /public/nova-imagem.png
```

### **Passo 2: Adicionar no Código**
Edite `app/page.tsx`:

```typescript
const carouselImages = [
  {
    src: "/imigrante-ok.png",
    alt: "Documentação e legalização para imigrantes em Portugal",
    title: "Transforme a Complexidade em Simplicidade",
    description: "Mais de 10.000 imigrantes já confiaram em nós...",
  },
  {
    src: "/consultoria-img.png",
    alt: "Consultoria empresarial em Portugal",
    title: "Construa o Seu Futuro em Portugal",
    description: "Da constituição à gestão, acompanhamos cada etapa...",
  },
  // Adicionar nova imagem aqui:
  {
    src: "/nova-imagem.png",
    alt: "Descrição alternativa para acessibilidade",
    title: "Título que aparecerá sobre a imagem",
    description: "Descrição complementar do serviço",
  },
];
```

### **Passo 3: Testar**
```bash
# Testar em diferentes tamanhos
# Desktop: 1920x1080
# Tablet: 768x1024
# Mobile: 375x667
```

---

## 📱 **Responsividade Mobile**

### **Altura do Hero em Diferentes Telas:**
```css
/* Mobile */
height: 600px;

/* Tablet (md:) */
@media (min-width: 768px) {
  height: 700px;
}

/* Desktop (lg:) */
@media (min-width: 1024px) {
  height: 800px;
}
```

### **Imagem em Mobile:**
- Centro da imagem sempre visível
- Overlay garante contraste
- Texto permanece legível
- Navegação (setas) acessível

---

## 🎯 **Otimização de Performance**

### **Next.js Image Optimization:**
```typescript
<Image
  src="/imagem.png"
  alt="Descrição"
  fill
  className="object-cover object-center"
  priority={index === 0}  // Primeira imagem carrega prioritária
  sizes="(max-width: 768px) 100vw, 100vw"
  quality={90}  // Qualidade otimizada
/>
```

### **Lazy Loading:**
- Primeira imagem: `priority={true}` (carrega imediatamente)
- Outras imagens: lazy load automático
- Melhora performance inicial

### **WebP (Recomendado):**
```bash
# Converter PNG/JPG para WebP:
# https://cloudconvert.com/png-to-webp

# Economiza ~30% do tamanho
# Suportado por todos os browsers modernos
```

---

## 🎨 **Overlay e Efeitos Aplicados**

O `HeroCarousel.tsx` já aplica automaticamente:

### **1. Gradient Overlay:**
```css
/* Horizontal (lateral escura) */
bg-gradient-to-r from-black/80 via-black/60 to-black/80

/* Vertical (topo/fundo escuros) */
bg-gradient-to-b from-black/40 via-transparent to-black/70
```

### **2. Vignette Effect:**
```css
box-shadow: inset 0 0 200px rgba(0,0,0,0.5)
```

### **3. Transições:**
```css
/* Fade entre slides */
transition-opacity duration-1000 ease-in-out
```

---

## 📊 **Checklist de Qualidade**

Antes de adicionar uma nova imagem, verifique:

- [ ] Imagem otimizada (<500KB)
- [ ] Resolução mínima 1280x720px
- [ ] Área central sem cortes importantes
- [ ] Contraste adequado com texto branco
- [ ] Foto profissional e de alta qualidade
- [ ] Consistente com identidade visual
- [ ] Alt text descritivo para acessibilidade
- [ ] Testada em mobile

---

## 🚀 **Comandos Úteis**

```bash
# Ver tamanho de arquivos na pasta public
ls -lh public/*.png

# Comprimir imagens (ImageMagick)
convert input.png -quality 85 -resize 1920x1080 output.png

# Converter para WebP
cwebp input.png -q 85 -o output.webp
```

---

## 📞 **Recursos**

- **Otimização:** https://tinypng.com/
- **Conversão WebP:** https://cloudconvert.com/
- **Next.js Image:** https://nextjs.org/docs/api-reference/next/image
- **Unsplash (fotos grátis):** https://unsplash.com/

---

## ✅ **Status Atual**

✅ **Imagem 1:** `imigrante-ok.png` (2.7MB) - ⚠️ **Considerar otimizar**
✅ **Imagem 2:** `consultoria-img.png` (8.4MB) - ⚠️ **PRECISA OTIMIZAR**

### **Recomendação:**
```bash
# Otimizar consultoria-img.png (está muito pesado)
# Objetivo: reduzir de 8.4MB para ~500KB

# Use TinyPNG ou:
# https://tinypng.com/
```

---

**🎨 Imagens configuradas e responsivas!**

