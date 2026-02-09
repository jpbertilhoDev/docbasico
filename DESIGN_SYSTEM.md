# 🎨 Design System - DocBásico

Sistema de design minimalista e profissional.

---

## 🎯 **Filosofia de Design**

### **Princípios Fundamentais:**
1. **Menos é Mais** - Minimalismo elegante
2. **Foco no Conteúdo** - Sem distrações visuais
3. **Profissionalismo** - Aparência corporativa confiável
4. **Coerência Visual** - Identidade de marca forte

---

## 🎨 **Paleta de Cores**

### **Cores Principais:**
```css
/* Azul Primário - Cor principal da marca */
--primary-50:  #eff6ff;  /* Backgrounds sutis */
--primary-100: #dbeafe;  /* Hover states leves */
--primary-600: #2563eb;  /* Cor principal (ações, links, badges) */
--primary-700: #1d4ed8;  /* Hover em botões */

/* Neutros - Hierarquia de texto e backgrounds */
--gray-50:  #f9fafb;  /* Background secundário */
--gray-100: #f3f4f6;  /* Background elementos */
--gray-200: #e5e7eb;  /* Bordas */
--gray-500: #6b7280;  /* Texto secundário */
--gray-600: #4b5563;  /* Texto normal */
--gray-700: #374151;  /* Texto importante */
--gray-900: #111827;  /* Títulos e ênfase */

/* Branco e Preto */
--white:    #ffffff;  /* Background principal */
--black:    #000000;  /* Apenas em casos extremos */
```

### **❌ NUNCA Usar:**
- Gradientes coloridos (laranja, verde, amarelo)
- Cores vibrantes fora da paleta
- Mais de 2 cores por componente (exceto texto)

---

## 📐 **Tipografia**

### **Hierarquia:**
```css
/* Títulos */
h1: text-3xl font-bold text-gray-900     /* 30px */
h2: text-2xl font-bold text-gray-900     /* 24px */
h3: text-xl font-bold text-gray-900      /* 20px */
h4: text-lg font-bold text-gray-900      /* 18px */

/* Corpo */
p: text-base text-gray-700               /* 16px */
small: text-sm text-gray-600             /* 14px */
tiny: text-xs text-gray-500              /* 12px */

/* Pesos */
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

---

## 🧱 **Componentes**

### **1. Cards**

#### **Card Padrão:**
```jsx
<div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-600 hover:shadow-xl transition-all">
  {/* Conteúdo */}
</div>
```

**Características:**
- Background: `bg-white`
- Borda: `border-2 border-gray-200`
- Hover: `hover:border-primary-600 hover:shadow-xl`
- Cantos: `rounded-xl` (12px)
- Padding: `p-6` (24px)

#### **Card Interativo (Botão):**
```jsx
<button className="bg-white border-2 border-gray-200 hover:border-primary-600 rounded-xl p-6 text-left transition-all hover:shadow-xl">
  {/* Conteúdo */}
</button>
```

---

### **2. Badges**

#### **Badge Primário (Requer Ação):**
```jsx
<span className="px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg">
  PAGAMENTO
</span>
```

#### **Badge Neutro (Informação):**
```jsx
<span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">
  DIRETO
</span>
```

**Características:**
- Apenas 2 variações: Azul ou Cinza
- Texto: `text-xs font-semibold`
- Padding: `px-3 py-1.5`
- Cantos: `rounded-lg` (8px)

---

### **3. Botões**

#### **Botão Primário:**
```jsx
<button className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
  Agendar
</button>
```

#### **Botão Secundário:**
```jsx
<button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-primary-600 hover:text-primary-600 transition-all">
  Cancelar
</button>
```

#### **Botão Texto (Link):**
```jsx
<button className="text-primary-600 font-semibold hover:underline">
  Saiba mais
</button>
```

---

### **4. Alertas/Avisos**

#### **Informativo:**
```jsx
<div className="bg-blue-50 border-l-4 border-primary-600 rounded-r-lg p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-bold text-gray-900 mb-1">Título</h4>
      <p className="text-sm text-gray-700">Mensagem</p>
    </div>
  </div>
</div>
```

#### **Destaque/Importante:**
```jsx
<div className="bg-gray-50 border-l-4 border-primary-600 rounded-r p-4">
  <p className="text-sm text-gray-700">
    <CreditCard className="inline w-4 h-4 text-primary-600" />
    Informação importante
  </p>
</div>
```

---

### **5. Ícones**

**Cores Permitidas:**
```css
text-primary-600  /* Ações principais */
text-gray-900     /* Ênfase */
text-gray-600     /* Normal */
text-gray-500     /* Secundário */
text-white        /* Sobre backgrounds escuros */
```

**Tamanhos:**
```css
w-4 h-4   /* 16px - Pequeno (inline text) */
w-5 h-5   /* 20px - Médio (padrão) */
w-6 h-6   /* 24px - Grande (destaque) */
```

---

## 📏 **Espaçamentos**

### **Gaps:**
```css
gap-2   /* 8px  - Entre elementos pequenos */
gap-3   /* 12px - Entre elementos relacionados */
gap-4   /* 16px - Entre elementos distintos */
gap-6   /* 24px - Entre seções */
gap-8   /* 32px - Entre blocos */
```

### **Padding:**
```css
p-4     /* 16px - Compacto */
p-6     /* 24px - Padrão */
p-8     /* 32px - Espaçoso */
```

### **Margin:**
```css
mb-2    /* 8px  - Pequeno */
mb-4    /* 16px - Médio */
mb-6    /* 24px - Grande */
mb-8    /* 32px - Seção */
mb-12   /* 48px - Bloco */
```

---

## 🎭 **Estados e Interações**

### **Hover:**
```css
/* Cards */
hover:border-primary-600
hover:shadow-xl

/* Botões */
hover:bg-primary-700

/* Links */
hover:underline
hover:text-primary-700

/* Transições */
transition-all duration-200  /* Padrão */
```

### **Focus:**
```css
focus:outline-none
focus:ring-2
focus:ring-primary-500
focus:ring-offset-2
```

### **Active:**
```css
active:scale-95  /* Feedback tátil */
```

---

## 🚫 **O Que NÃO Fazer**

### **❌ Cores:**
- Gradientes (exceto em casos extremos aprovados)
- Cores vibrantes (laranja, verde, amarelo, roxo)
- Mais de 2 cores em um componente

### **❌ Espaçamentos:**
- Padding/margin inconsistentes
- Gaps muito pequenos (<8px) ou muito grandes (>32px)

### **❌ Tipografia:**
- Mais de 3 pesos de fonte por página
- Tamanhos de fonte fora da escala definida
- Texto branco sobre backgrounds claros

### **❌ Sombras:**
```css
/* NÃO usar sombras exageradas */
shadow-2xl (apenas em hover)

/* Preferir sombras sutis */
shadow-sm (padrão)
shadow-md (destaque)
shadow-lg (hover leve)
```

---

## ✅ **Exemplos Corretos**

### **Card de Serviço:**
```jsx
<button className="bg-white border-2 border-gray-200 hover:border-primary-600 rounded-xl p-6 transition-all hover:shadow-xl">
  {/* Header */}
  <div className="flex items-start justify-between mb-4">
    <h3 className="text-lg font-bold text-gray-900">
      Serviço
    </h3>
    <span className="px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg">
      BADGE
    </span>
  </div>
  
  {/* Body */}
  <p className="text-sm text-gray-600 mb-4">
    Descrição do serviço
  </p>
  
  {/* Footer */}
  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
    <span className="text-sm text-gray-500">Categoria</span>
    <span className="text-primary-600 font-semibold">
      CTA →
    </span>
  </div>
</button>
```

### **Alert:**
```jsx
<div className="bg-blue-50 border-l-4 border-primary-600 rounded-r-lg p-4">
  <div className="flex gap-3">
    <AlertCircle className="w-5 h-5 text-primary-600" />
    <div>
      <h4 className="font-bold text-gray-900">Título</h4>
      <p className="text-sm text-gray-700">Mensagem</p>
    </div>
  </div>
</div>
```

---

## 📱 **Responsividade**

### **Breakpoints:**
```css
/* Mobile First */
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
```

### **Grid:**
```css
/* Padrão para cards */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

---

## 🎯 **Checklist de Qualidade**

Antes de aprovar um componente, verifique:

- [ ] Usa apenas azul + branco + cinza/preto
- [ ] Sem gradientes ou cores vibrantes
- [ ] Espaçamentos consistentes (4, 6, 8, 12, 16, 24, 32)
- [ ] Tipografia dentro da escala definida
- [ ] Hover states suaves e profissionais
- [ ] Bordas arredondadas (lg, xl)
- [ ] Sombras sutis (exceto hover)
- [ ] Contraste adequado para acessibilidade
- [ ] Responsivo mobile-first

---

## 🏆 **Resultado Esperado**

✅ **Profissional** - Aparência corporativa confiável
✅ **Clean** - Sem poluição visual
✅ **Coerente** - Identidade de marca forte
✅ **Acessível** - Contraste e usabilidade
✅ **Minimalista** - Foco no conteúdo

**"Simplicidade é o máximo da sofisticação." - Leonardo da Vinci**

